import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockClient = {
  post: vi.fn(),
};

const mockPrintError = vi.fn();
const mockPrintSuccess = vi.fn();
const mockPrintJson = vi.fn();
const mockExit = vi.fn();

vi.mock("../../core/index.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../core/index.js")>();
  return {
    ...actual,
    client: mockClient,
    printError: mockPrintError,
    printSuccess: mockPrintSuccess,
    printJson: mockPrintJson,
  };
});

const realExit = process.exit;

describe("tasksCreateCmd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.post.mockReset();
    process.exit = mockExit as unknown as typeof process.exit;
  });

  afterEach(() => {
    process.exit = realExit;
  });

  it("rejects --upstream without --project", async () => {
    const { tasksCreateCmd } = await import("../tasks/create.js");

    // Simulate Commander parsing: --upstream set, --project not set
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (tasksCreateCmd as any)._optionValues = {
      upstream: "task-123",
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (tasksCreateCmd as any)._actionHandler;
    await handler.call(tasksCreateCmd, ["my prompt"]);

    expect(mockPrintError).toHaveBeenCalledWith(
      "--upstream requires --project",
    );
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("allows --upstream with --project", async () => {
    mockClient.post.mockResolvedValue({
      ok: true,
      task: { id: "t1", title: "Hello", upstreamTaskId: "task-up" },
    });

    const { tasksCreateCmd } = await import("../tasks/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (tasksCreateCmd as any)._optionValues = {
      project: "proj-1",
      upstream: "task-up",
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (tasksCreateCmd as any)._actionHandler;
    await handler.call(tasksCreateCmd, ["my prompt"]);

    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/projects/proj-1/tasks",
      { blocks: [{ type: "text", text: "my prompt" }], upstream_task_id: "task-up" },
    );
    expect(mockPrintSuccess).toHaveBeenCalledWith(
      "Project task created: Hello (t1) (upstream: task-up)",
    );
  });

  it("creates a personal task when no --project", async () => {
    mockClient.post.mockResolvedValue({
      ok: true,
      task: { id: "pt1", title: "Personal task" },
    });

    const { tasksCreateCmd } = await import("../tasks/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (tasksCreateCmd as any)._optionValues = {
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (tasksCreateCmd as any)._actionHandler;
    await handler.call(tasksCreateCmd, ["my personal prompt"]);

    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/personal-tasks",
      [{ type: "text", text: "my personal prompt" }],
    );
    expect(mockPrintSuccess).toHaveBeenCalledWith(
      "Task created: Personal task (pt1)",
    );
  });
});
