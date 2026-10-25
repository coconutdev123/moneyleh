const EXISTING_ACCOUNT_PATTERNS = [
  /accountalreadyexists/i,
  /account.{0,20}already exists/i,
  /email.{0,20}already (?:registered|in use)/i,
];

const INVALID_CREDENTIAL_PATTERNS = [
  /invalidaccountid/i,
  /invalidsecret/i,
  /invalid credentials/i,
  /incorrect (?:email|password)/i,
  /wrong password/i,
  /password.{0,20}(?:incorrect|invalid)/i,
  /account.{0,20}not found/i,
];

const USER_ERROR_MESSAGES: Record<string, string> = {
  "a username is required": "Please enter a username.",
  "username is already taken": "That username is already taken.",
  "username must be at least 3 characters": "Your username must be at least 3 characters.",
  "username must be at most 16 characters": "Your username must be no more than 16 characters.",
  "username may only contain letters, digits, underscores and hyphens": "Use only letters, numbers, underscores, or hyphens in your username.",
  "this username is reserved": "Please choose a different username.",
  "not authenticated": "Please sign in and try again.",
  unauthenticated: "Please sign in and try again.",
  "not authorized to update this profile": "You don't have permission to update this profile.",
  "not authorized to delete this profile": "You don't have permission to delete this account.",
  "profile not found": "We couldn't find your profile. Please try again.",
  "monthly income must be zero or greater": "Monthly income must be zero or greater.",
  "item name is required": "Please enter an item name.",
  "target amount must be positive": "The target amount must be greater than zero.",
  "savings amount must be positive": "The savings amount must be greater than zero.",
  "savings date is required": "Please enter a savings date.",
  "wishlist not found": "We couldn't find that wishlist. Please refresh and try again.",
  "invalid wishlist order": "We couldn't update the wishlist order. Please try again.",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  return "";
}

export function getUserFriendlyError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const message = getErrorMessage(error).trim();
  if (!message) return fallback;

  if (EXISTING_ACCOUNT_PATTERNS.some((pattern) => pattern.test(message))) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (INVALID_CREDENTIAL_PATTERNS.some((pattern) => pattern.test(message))) {
    return "Incorrect email or password.";
  }

  const normalizedMessage = message
    .replace(/^(?:uncaught )?(?:convexerror|error):\s*/i, "")
    .trim()
    .toLowerCase();
  return USER_ERROR_MESSAGES[normalizedMessage] ?? fallback;
}
