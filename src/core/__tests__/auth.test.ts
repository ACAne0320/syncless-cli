import { describe, it, expect, vi } from "vitest";

const mockGetApiKey = vi.fn();

vi.mock("../config.js", () => ({
  getApiKey: mockGetApiKey,
}));

// Dynamic import so the mock takes effect before module evaluation
const { requireApiKey } = await import("../auth.js");

describe("requireApiKey", () => {
  it("throws AuthError when no key is set", () => {
    mockGetApiKey.mockReturnValue(undefined);
    expect(() => requireApiKey()).toThrow("syncless auth login");
  });

  it("returns the key when set", () => {
    mockGetApiKey.mockReturnValue("sk-test-123");
    expect(requireApiKey()).toBe("sk-test-123");
  });
});
