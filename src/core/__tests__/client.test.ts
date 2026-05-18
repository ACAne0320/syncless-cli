import { describe, it, expect, beforeEach, vi } from "vitest";

const mockGetApiKey = vi.fn(() => "sk-test-mock");
const mockGetBaseUrl = vi.fn(() => "https://api.syncless.ai");

vi.mock("../config.js", () => ({
  getApiKey: mockGetApiKey,
  getBaseUrl: mockGetBaseUrl,
}));

const { client } = await import("../client.js");
const { TaskRunningError } = await import("../errors.js");

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(body),
  });
}

describe("HttpClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Ensure mocked config returns consistent values after restoreAllMocks
    mockGetApiKey.mockReturnValue("sk-test-mock");
    mockGetBaseUrl.mockReturnValue("https://api.syncless.ai");
  });

  describe("GET", () => {
    it("makes an authenticated GET request", async () => {
      const data = { users: [{ userId: "u1", name: "Ada" }] };
      global.fetch = mockFetch(200, data);

      const result = await client.get("/api/console/v1/users");
      expect(result).toEqual(data);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.syncless.ai/api/console/v1/users",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-test-mock",
          }),
        }),
      );
    });

    it("throws SynclessError on API error", async () => {
      global.fetch = mockFetch(400, {
        error: "Task is currently running",
        details: { code: "TASK_RUNNING" },
      });

      const request = client.get("/api/console/v1/tasks/t1");

      await expect(request).rejects.toThrow("Task is currently running");
      await expect(request).rejects.toBeInstanceOf(TaskRunningError);
    });
  });

  describe("POST", () => {
    it("makes an authenticated POST request", async () => {
      const data = { ok: true, task: { id: "t1", title: "Hello" } };
      global.fetch = mockFetch(200, data);

      const result = await client.post("/api/console/v1/personal-tasks", [
        { type: "text", text: "hello" },
      ]);
      expect(result).toEqual(data);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.syncless.ai/api/console/v1/personal-tasks",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-test-mock",
          }),
          body: JSON.stringify([{ type: "text", text: "hello" }]),
        }),
      );
    });
  });
});
