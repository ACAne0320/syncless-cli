import { describe, it, expect } from "vitest";
import {
  SynclessError,
  AuthError,
  TaskRunningError,
} from "../errors.js";

describe("SynclessError", () => {
  it("creates a basic error", () => {
    const err = new SynclessError("something failed");
    expect(err.message).toBe("something failed");
    expect(err.name).toBe("SynclessError");
    expect(err.code).toBeUndefined();
    expect(err.status).toBeUndefined();
  });

  it("creates from API error response", () => {
    const err = SynclessError.fromApiError(
      { error: "Task is currently running", details: { code: "TASK_RUNNING" } },
      400,
    );
    expect(err.message).toBe("Task is currently running");
    expect(err.code).toBe("TASK_RUNNING");
    expect(err.status).toBe(400);
    expect(err).toBeInstanceOf(TaskRunningError);
  });
});

describe("AuthError", () => {
  it("has a default message", () => {
    const err = new AuthError();
    expect(err.code).toBe("AUTH_ERROR");
    expect(err.status).toBe(401);
    expect(err.message).toContain("syncl auth login");
  });
});

describe("TaskRunningError", () => {
  it("includes the task ID", () => {
    const err = new TaskRunningError("task_123");
    expect(err.code).toBe("TASK_RUNNING");
    expect(err.status).toBe(400);
    expect(err.message).toContain("task_123");
  });
});
