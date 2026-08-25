import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
	createToken,
	hashPassword,
	hashValue,
	normalizeEmail,
	sessionExpiry,
	verifyPassword,
} from "./authHelper";

const passwordValidator = v.string();

export const signUp = mutation({
	args: {
		email: v.string(),
		password: passwordValidator,
		displayName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const email = normalizeEmail(args.email);
		if (!email || !email.includes("@")) throw new Error("Enter a valid email.");
		if (args.password.length < 8) {
			throw new Error("Password must be at least 8 characters.");
		}

		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", email))
			.unique();
		if (existingUser) throw new Error("An account with this email already exists.");

		const now = Date.now();
		const userId = await ctx.db.insert("users", {
			email,
			normalizedEmail: email,
			displayName: args.displayName?.trim() || undefined,
			status: "active",
			createdAt: now,
			updatedAt: now,
		});
		await ctx.db.insert("authIdentities", {
			userId,
			provider: "password",
			providerAccountId: email,
			passwordHash: await hashPassword(args.password),
			createdAt: now,
			updatedAt: now,
		});

		return createSession(ctx, userId, now);
	},
});

export const signIn = mutation({
	args: { email: v.string(), password: passwordValidator },
	handler: async (ctx, args) => {
		const email = normalizeEmail(args.email);
		const user = await ctx.db
			.query("users")
			.withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", email))
			.unique();
		if (!user || user.status !== "active") throw new Error("Invalid email or password.");

		const identity = await ctx.db
			.query("authIdentities")
			.withIndex("by_providerAccount", (q) =>
				q.eq("provider", "password").eq("providerAccountId", email)
			)
			.unique();
		if (!identity?.passwordHash || !(await verifyPassword(args.password, identity.passwordHash))) {
			throw new Error("Invalid email or password.");
		}

		return createSession(ctx, user._id, Date.now());
	},
});

export const signOut = mutation({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const tokenHash = await hashValue(args.token);
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
			.unique();
		if (session && !session.revokedAt) await ctx.db.patch(session._id, { revokedAt: Date.now() });
	},
});

export const currentUser = query({
	args: { token: v.optional(v.string()) },
	handler: async (ctx, args) => {
		if (!args.token) return null;
		const tokenHash = await hashValue(args.token);
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
			.unique();
		if (!session || session.revokedAt || session.expiresAt <= Date.now()) return null;
		const user = await ctx.db.get(session.userId);
		if (!user || user.status !== "active") return null;
		return { id: user._id, email: user.email, displayName: user.displayName };
	},
});

async function createSession(ctx: any, userId: any, now: number) {
	const token = createToken();
	await ctx.db.insert("sessions", {
		userId,
		tokenHash: await hashValue(token),
		expiresAt: sessionExpiry(now),
		createdAt: now,
		lastSeenAt: now,
	});
	return { token };
}
