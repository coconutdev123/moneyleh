const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

export function createToken() {
	return crypto.randomUUID();
}

export async function hashValue(value: string) {
	const bytes = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, "0")
	).join("");
}

export async function hashPassword(password: string) {
	const salt = createToken();
	return `${salt}:${await hashValue(`${salt}:${password}`)}`;
}

export async function verifyPassword(password: string, storedHash: string) {
	const [salt, expectedHash] = storedHash.split(":");
	if (!salt || !expectedHash) return false;
	return (await hashValue(`${salt}:${password}`)) === expectedHash;
}

export function sessionExpiry(now: number) {
	return now + SESSION_DURATION_MS;
}
