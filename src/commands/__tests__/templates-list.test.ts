import { describe, it, expect, vi, beforeEach } from "vitest";

const mockClient = {
  get: vi.fn(),
};

const mockConsoleLog = vi.fn();
const mockPrintJson = vi.fn();
const mockPrintTable = vi.fn();

vi.mock("../../core/index.js", () => ({
  client: mockClient,
  printJson: mockPrintJson,
  printTable: mockPrintTable,
}));

describe("templatesListCmd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.get.mockReset();
    mockConsoleLog.mockReset();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
  });

  it("calls GET /api/console/v1/templates with default pagination", async () => {
    mockClient.get.mockResolvedValue({
      templates: [
        { id: "tpl-1", workspaceId: "ws1", createdByUserId: "u1", name: "Launch checklist", graph: {} },
      ],
    });

    const { templatesListCmd } = await import("../templates/list.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (templatesListCmd as any)._optionValues = {
      index: 0,
      pageSize: 50,
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (templatesListCmd as any)._actionHandler;
    await handler.call(templatesListCmd, []);

    expect(mockClient.get).toHaveBeenCalledWith(
      "/api/console/v1/templates",
      expect.objectContaining({
        toString: expect.any(Function),
      }),
    );
    expect(mockPrintTable).toHaveBeenCalledWith(
      ["Template ID", "Name"],
      [["tpl-1", "Launch checklist"]],
    );
  });

  it("prints 'No templates found.' for empty list", async () => {
    mockClient.get.mockResolvedValue({ templates: [] });

    const { templatesListCmd } = await import("../templates/list.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (templatesListCmd as any)._optionValues = {
      index: 0,
      pageSize: 50,
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (templatesListCmd as any)._actionHandler;
    await handler.call(templatesListCmd, []);

    expect(mockConsoleLog).toHaveBeenCalledWith("No templates found.");
    expect(mockPrintTable).not.toHaveBeenCalled();
  });

  it("outputs JSON when --json flag is set", async () => {
    const data = {
      templates: [
        { id: "tpl-1", workspaceId: "ws1", createdByUserId: "u1", name: "Checklist", graph: {} },
      ],
    };
    mockClient.get.mockResolvedValue(data);

    const { templatesListCmd } = await import("../templates/list.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (templatesListCmd as any)._optionValues = {
      index: 0,
      pageSize: 50,
      json: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (templatesListCmd as any)._actionHandler;
    await handler.call(templatesListCmd, []);

    expect(mockPrintJson).toHaveBeenCalledWith(data);
    expect(mockPrintTable).not.toHaveBeenCalled();
  });
});
