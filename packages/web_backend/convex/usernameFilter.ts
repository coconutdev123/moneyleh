import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import {
	ALGORITHM_VERSION,
	getUsernameBitIndexes,
	normalizeUsername,
	usernameMightExist,
	validateUsername,
} from "../../shared/src/lib/username";
import { getAuthUserId } from "@convex-dev/auth/server";

const TARGET_FALSE_POSITIVE_RATE = 0.01;
const FILTER_DOC_KEY = "global" as const;

type BloomFilter = {
	bits: Uint8Array;
	bitCount: number;
	hashCount: number;
};

function createBloomFilter(expectedItems: number, falsePositiveRate: number): BloomFilter {
	const itemCount = Math.max(1, expectedItems);
	const bitCount = Math.ceil(
		(-itemCount * Math.log(falsePositiveRate)) / (Math.LN2 * Math.LN2),
	);
	const hashCount = Math.max(1, Math.round((bitCount / itemCount) * Math.LN2));

	return {
		bits: new Uint8Array(Math.ceil(bitCount / 8)),
		bitCount,
		hashCount,
	};
}

function addUsername(filter: BloomFilter, normalized: string): void {
	for (const bitIndex of getUsernameBitIndexes(
		normalized,
		filter.bitCount,
		filter.hashCount,
	)) {
		filter.bits[bitIndex >>> 3] |= 1 << (bitIndex & 7);
	}
}

export const isUsernameAvailable = query({
	args: {
		username: v.string(),
	},
	handler: async (ctx, { username }) => {
		const validationError = validateUsername(username);
		if (validationError) {
			return { available: false as const, reason: validationError };
		}

		const normalized = normalizeUsername(username);
		const currentUserId = await getAuthUserId(ctx);

		const profiles = await ctx.db.query("profile").collect();
		const taken = profiles.some(
			(profile) =>
				profile.userId !== currentUserId &&
				normalizeUsername(profile.normalizedUsername ?? profile.username) === normalized,
		);

		if (taken) {
			return { available: false as const, reason: "Username is already taken" };
		}

		return { available: true as const };
	},
});

export const getUsernameFilterSnapshot = query({
	args: {
		/** Optional diagnostic: also return whether this name might be present. */
		sampleUsername: v.optional(v.string()),
	},
	handler: async (ctx, { sampleUsername }) => {
		const doc = await ctx.db
			.query("usernameFilter")
			.withIndex("by_key", (q) => q.eq("key", FILTER_DOC_KEY))
			.unique();

		if (!doc) {
			// Filter not built yet — client should fall back to exact check only.
			return {
				algorithmVersion: ALGORITHM_VERSION,
				usernameCount: 0,
				targetFalsePositiveRate: TARGET_FALSE_POSITIVE_RATE,
				bitCount: 0,
				hashCount: 0,
				bits: [] as number[],
				sampleUsernameMayExist: sampleUsername === undefined ? null : true,
			};
		}

		const bitsArray = Array.from(new Uint8Array(doc.bits));

		const sampleNormalized =
			sampleUsername === undefined ? null : normalizeUsername(sampleUsername);

		return {
			algorithmVersion: doc.algorithmVersion,
			usernameCount: doc.usernameCount,
			targetFalsePositiveRate: doc.targetFalsePositiveRate,
			bitCount: doc.bitCount,
			hashCount: doc.hashCount,
			bits: bitsArray,
			sampleUsernameMayExist:
				sampleNormalized === null
					? null
					: usernameMightExist(sampleNormalized, {
							algorithmVersion: doc.algorithmVersion,
							bitCount: doc.bitCount,
							hashCount: doc.hashCount,
							bits: bitsArray,
						}),
		};
	},
});

export const rebuildUsernameFilter = internalMutation({
	args: {},
	handler: async (ctx) => {
		const profiles = await ctx.db.query("profile").collect();

		const uniqueNormalized = new Set<string>();
		for (const profile of profiles) {
			const n =
				profile.normalizedUsername ??
				normalizeUsername(profile.username ?? "");
			if (n) uniqueNormalized.add(n);
		}

		const usernames = [...uniqueNormalized];
		const filter = createBloomFilter(usernames.length, TARGET_FALSE_POSITIVE_RATE);

		for (const username of usernames) {
			addUsername(filter, username);
		}

		const existing = await ctx.db
			.query("usernameFilter")
			.withIndex("by_key", (q) => q.eq("key", FILTER_DOC_KEY))
			.unique();

		const payload = {
			key: FILTER_DOC_KEY,
			algorithmVersion: ALGORITHM_VERSION,
			usernameCount: usernames.length,
			targetFalsePositiveRate: TARGET_FALSE_POSITIVE_RATE,
			bitCount: filter.bitCount,
			hashCount: filter.hashCount,
			bits: Uint8Array.from(filter.bits).buffer as ArrayBuffer,
		};

		if (existing) {
			await ctx.db.patch(existing._id, payload);
		} else {
			await ctx.db.insert("usernameFilter", payload);
		}
	},
});

export const triggerUsernameFilterRebuild = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Unauthenticated");
		}
		// Optional: restrict to admin users here.
		await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
	},
});