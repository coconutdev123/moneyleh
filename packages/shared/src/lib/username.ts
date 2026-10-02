export const ALGORITHM_VERSION = 1;

const minUsernameLength = 3;
const maxUsernameLength = 16;
const usernameRegex = /^[a-z0-9_-]+$/;

export type UsernameFilterSnapshot = {
	algorithmVersion: number;
	bitCount: number;
	hashCount: number;
	bits: ArrayLike<number>;
};

export function normalizeUsername(username: string): string {
	return username.trim().normalize("NFKC").toLowerCase();
}

export function validateUsername(raw: string): string | null {
	const normalized = normalizeUsername(raw);

	if (normalized.length < minUsernameLength) {
		return `Username must be at least ${minUsernameLength} characters`;
	}
	if (normalized.length > maxUsernameLength) {
		return `Username must be at most ${maxUsernameLength} characters`;
	}
	if (!usernameRegex.test(normalized)) {
		return "Username may only contain letters, digits, underscores and hyphens";
	}
	if (reservedNames.has(normalized)) {
		return "This username is reserved";
	}
	return null;
}

const reservedNames = new Set([
	"admin", "administrator", "root", "system", "support", "help", "contact", "info", "about", "privacy",
	"terms", "legal", "api", "www", "webmaster", "postmaster", "hostmaster", "abuse", "security", "billing", "sales", "marketing", "press", "media", "jobs", "careers", "team", "community",
	"test", "demo", "example", "sample", "sandbox", "staging", "dev", "development", "beta", "alpha",
	"new", "old", "archive", "backup", "temp", "temporary", "deleted", "removed", "disabled",
	"private", "public", "internal", "external", "shared", "common", "global", "local", "regional", "national",
	"international", "universal", "general", "specific", "custom", "default", "standard", "advanced",
	"coconut",
]);

function hash32(value: string, seed: number): number {
	let hash = seed >>> 0;
	for (let i = 0; i < value.length; i++) {
		hash = Math.imul(hash ^ value.charCodeAt(i), 0x01000193);
	}
	return hash >>> 0;
}


export function getUsernameBitIndexes(
	normalized: string,
	bitCount: number,
	hashCount: number,
): number[] {
	const h1 = hash32(normalized, 0x811c9dc5);
	const h2 = (hash32(normalized, 0x85ebca6b) | 1) >>> 0;
	const indexes = new Array<number>(hashCount);
	for (let i = 0; i < hashCount; i++) {
		indexes[i] = (h1 + i * h2) % bitCount;
	}
	return indexes;
}

export function usernameMightExist(
	username: string,
	filter: UsernameFilterSnapshot,
): boolean {
	if (
		filter.algorithmVersion !== ALGORITHM_VERSION ||
		filter.bitCount <= 0 ||
		filter.hashCount <= 0
	) {
		// Stale or corrupt snapshot → treat as "might exist" so the client
		// falls back to the authoritative exact check.
		return true;
	}

	const normalized = normalizeUsername(username);
	return getUsernameBitIndexes(normalized, filter.bitCount, filter.hashCount).every(
		(bitIndex) => ((filter.bits[bitIndex >>> 3] ?? 0) & (1 << (bitIndex & 7))) !== 0,
	);
}