import { getApiKey } from "./config.js";
import { AuthError } from "./errors.js";

export function requireApiKey(): string {
  const key = getApiKey();
  if (!key) {
    throw new AuthError();
  }
  return key;
}
