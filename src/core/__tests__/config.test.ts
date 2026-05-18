import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createConfigStore,
  getApiKey,
  setApiKey,
  clearApiKey,
  getBaseUrl,
} from "../config.js";

describe("config", () => {
  let config: ReturnType<typeof createConfigStore>;
  let configDir: string;

  beforeEach(() => {
    configDir = mkdtempSync(join(process.cwd(), ".tmp-syncless-config-"));
    config = createConfigStore(configDir);
  });

  afterEach(() => {
    rmSync(configDir, { recursive: true, force: true });
  });

  it("returns undefined when no key is set", () => {
    expect(getApiKey(config)).toBeUndefined();
  });

  it("stores and retrieves API key", () => {
    setApiKey("sk-test-456", config);
    expect(getApiKey(config)).toBe("sk-test-456");
  });

  it("clears the API key", () => {
    setApiKey("sk-test-456", config);
    clearApiKey(config);
    expect(getApiKey(config)).toBeUndefined();
  });

  it("returns default base URL", () => {
    expect(getBaseUrl(config)).toBe("https://api.syncless.ai");
  });
});
