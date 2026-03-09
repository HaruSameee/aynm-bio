const RESERVED_USERNAMES = new Set(["api", "dashboard", "_next"]);
const USERNAME_REGEX = /^[a-z0-9_-]{3,32}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isReservedUsername(value: string) {
  const normalized = normalizeUsername(value);

  return RESERVED_USERNAMES.has(normalized) || normalized.includes(".");
}

export function assertValidUsername(value: string) {
  const normalized = normalizeUsername(value);

  if (!USERNAME_REGEX.test(normalized)) {
    throw new Error(
      "Username must be 3-32 characters using lowercase letters, numbers, hyphens, or underscores.",
    );
  }

  if (isReservedUsername(normalized)) {
    throw new Error("This username is reserved.");
  }

  return normalized;
}
