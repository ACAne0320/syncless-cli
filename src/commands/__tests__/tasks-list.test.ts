import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockClient = {
  get: vi.fn(),
};

const mockPrintJson = vi.fn();
const mockPrintTable = vi.fn();
const mockPrintError = vi.fn();
const mockSelect = vi.fn();
const mockExit = vi.fn();

vi.mock("../../core/index.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../core/index.js")>();
  return {
    ...actual,
    client: mockClient,
    printError: mockPrintError,
    printJson: mockPrintJson,
    printTable: mockPrintTable,
  };
});

vi.mock("@clack/prompts", () => ({
  isCancel: vi.fn(() => false),
  select: mockSelect,
}));

const realExit = process.exit;

function setTty(value: boolean) {
  Object.defineProperty(process.stdin, "isTTY", {
    configurable: true,
    value,
  });
  Object.defineProperty(process.stdout, "isTTY", {
    configurable: true,
    value,
  });
}

describe("tasksListCmd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.get.mockReset();
    mockSelect.mockReset();
    process.exit = mockExit as unknown as typeof process.exit;
    setTty(true);
    delete process.env.CI;
  });

  afterEach(() => {
    process.exit = realExit;
  });

  it("prompts for a project when project-id is omitted in an interactive terminal", async () => {
    mockClient.get
      .mockResolvedValueOnce({
        projects: [
          {
            projectId: "proj-1",
            name: "Launch",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-02T00:00:00Z",
          },
        ],
      })
      .mockResolvedValueOnce({
        tasks: [
          { id: "task-1", title: "Plan launch" },
        ],
      });
    mockSelect.mockResolvedValueOnce("proj-1");

    const { tasksListCmd } = await import("../tasks/list.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (tasksListCmd as any)._optionValues = {
      index: 0,
      pageSize: 50,
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (tasksListCmd as any)._actionHandler;
    await handler.call(tasksListCmd, []);

    expect(mockSelect).toHaveBeenCalledWith({
      message: "Select a project",
      options: [
        { label: "Personal tasks", value: "personal" },
        { label: "Launch", value: "proj-1" },
      ],
    });
    expect(mockClient.get).toHaveBeenNthCalledWith(
      2,
      "/api/console/v1/projects/proj-1/tasks",
      expect.objectContaining({
        toString: expect.any(Function),
      }),
    );
    expect(mockPrintTable).toHaveBeenCalledWith(
      ["Task ID", "Title"],
      [["task-1", "Plan launch"]],
    );
    expect(mockPrintError).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("keeps non-interactive missing project-id behavior", async () => {
    setTty(false);
    mockClient.get.mockResolvedValueOnce({ projects: [] });

    const { tasksListCmd } = await import("../tasks/list.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (tasksListCmd as any)._optionValues = {
      index: 0,
      pageSize: 50,
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (tasksListCmd as any)._actionHandler;
    await handler.call(tasksListCmd, []);

    expect(mockSelect).not.toHaveBeenCalled();
    expect(mockPrintError).toHaveBeenCalledWith(
      "missing required argument 'project-id'",
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
