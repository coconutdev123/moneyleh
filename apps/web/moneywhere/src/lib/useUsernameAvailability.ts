import { useQuery } from "convex/react";
import { api } from "@web_backend/convex/_generated/api";
import { normalizeUsername, usernameMightExist, validateUsername } from "@shared/lib/username";

export function useUsernameAvailability(username: string, enabled = true) {
	const normalized = normalizeUsername(username);
	const validationError = normalized ? validateUsername(username) : null;
	const snapshot = useQuery(api.usernameFilter.getUsernameFilterSnapshot, enabled ? {} : "skip");
	const shouldCheckExact = enabled && !validationError && normalized.length > 0 && snapshot !== undefined &&
		usernameMightExist(username, snapshot);
	const exactResult = useQuery(
		api.usernameFilter.isUsernameAvailable,
		shouldCheckExact ? { username } : "skip",
	);

	if (!enabled || !normalized) return { status: "idle" as const };
	if (validationError) return { status: "invalid" as const, message: validationError };
	if (snapshot === undefined) return { status: "checking" as const };
	if (!usernameMightExist(username, snapshot)) return { status: "available" as const };
	if (exactResult === undefined) return { status: "checking" as const };
	if (exactResult.available) return { status: "available" as const };
	return { status: "taken" as const, message: exactResult.reason };
}