import { createHash, timingSafeEqual } from "crypto";

/**
 * Checks a login password against the LOGIN_PASSWORD environment variable.
 * Login is disabled (always false) when LOGIN_PASSWORD is not set.
 */
export const isValidPassword = (password: unknown): boolean => {
  const expected = process.env.LOGIN_PASSWORD;
  if (!expected || typeof password !== "string" || password.length === 0) {
    return false;
  }
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(password).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
};
