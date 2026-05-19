import type { ApiError } from "../types/api.js";

export class SynclessError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "SynclessError";
  }

  static fromApiError(err: ApiError, status: number): SynclessError {
    if (err.details?.code === "TASK_RUNNING") {
      return new TaskRunningError(undefined, err.error);
    }

    return new SynclessError(err.error, err.details?.code, status);
  }
}

export class AuthError extends SynclessError {
  constructor(message = "Authentication failed. Run `syncl auth login` to set your API key.") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

export class TaskRunningError extends SynclessError {
  constructor(taskId?: string, message?: string) {
    super(
      message ?? (taskId ? `Task ${taskId} is currently running` : "Task is currently running"),
      "TASK_RUNNING",
      400,
    );
    this.name = "TaskRunningError";
  }
}
