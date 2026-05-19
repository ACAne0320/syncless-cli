import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
};

const mockPrintJson = vi.fn();
const mockPrintSuccess = vi.fn();
const mockSelect = vi.fn();
const mockText = vi.fn();
const mockExit = vi.fn();

vi.mock("../../core/index.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../core/index.js")>();
  return {
    ...actual,
    client: mockClient,
    printJson: mockPrintJson,
    printSuccess: mockPrintSuccess,
  };
});

vi.mock("@clack/prompts", () => ({
  isCancel: vi.fn(() => false),
  select: mockSelect,
  text: mockText,
}));

const realExit = process.exit;

function expectTemplateListRequest(callIndex: number) {
  expectTemplateListRequestWithIndex(callIndex, callIndex - 1);
}

function expectTemplateListRequestWithIndex(callIndex: number, index: number) {
  expect(mockClient.get).toHaveBeenNthCalledWith(
    callIndex,
    "/api/console/v1/templates",
    expect.objectContaining({
      toString: expect.any(Function),
    }),
  );
  const query = mockClient.get.mock.calls[callIndex - 1]?.[1] as URLSearchParams;
  expect(query.toString()).toBe(`index=${index}&pageSize=50`);
}

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

describe("projectsCreateCmd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.get.mockReset();
    mockClient.post.mockReset();
    mockSelect.mockReset();
    mockText.mockReset();
    process.exit = mockExit as unknown as typeof process.exit;
    setTty(true);
    delete process.env.CI;
  });

  afterEach(() => {
    process.exit = realExit;
  });

  it("uses --nodes directly when provided", async () => {
    mockClient.post.mockResolvedValue({ ok: true, pipelineId: "pipe-1" });

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      template: "tpl-1",
      name: "Demo",
      nodes: { node_a: "user_1" },
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expect(mockClient.get).not.toHaveBeenCalled();
    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/templates/tpl-1/projects",
      { name: "Demo", nodes: { node_a: "user_1" } },
    );
    expect(mockPrintSuccess).toHaveBeenCalledWith(
      "Project created. Pipeline ID: pipe-1",
    );
  });

  it("prompts for node owners when --nodes is omitted in an interactive terminal", async () => {
    mockClient.get
      .mockResolvedValueOnce({
        templates: [
          {
            id: "tpl-1",
            workspaceId: "ws-1",
            createdByUserId: "user_1",
            name: "Launch",
            graph: {
              nodes: [
                { id: "node_a", data: { title: "Design" } },
                { id: "node_b", label: "Build" },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        users: [
          {
            userId: "user_1",
            name: "Alice",
            email: "alice@example.com",
            avatarUrl: "",
            role: "member",
          },
          {
            userId: "user_2",
            name: "Bob",
            email: "bob@example.com",
            avatarUrl: "",
            role: "member",
          },
        ],
      });
    mockSelect
      .mockResolvedValueOnce("user_1")
      .mockResolvedValueOnce("user_2");
    mockClient.post.mockResolvedValue({ ok: true, pipelineId: "pipe-1" });

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      template: "tpl-1",
      name: "Demo",
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expectTemplateListRequest(1);
    expect(mockClient.get).toHaveBeenNthCalledWith(
      2,
      "/api/console/v1/users",
    );
    expect(mockSelect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: 'Owner for "Design"',
        options: [
          {
            label: "Alice <alice@example.com>",
            value: "user_1",
          },
          {
            label: "Bob <bob@example.com>",
            value: "user_2",
          },
        ],
      }),
    );
    expect(mockSelect).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        message: 'Owner for "Build"',
      }),
    );
    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/templates/tpl-1/projects",
      {
        name: "Demo",
        nodes: {
          node_a: "user_1",
          node_b: "user_2",
        },
      },
    );
  });

  it("finds a requested template on a later page before prompting node owners", async () => {
    mockClient.get
      .mockResolvedValueOnce({
        templates: Array.from({ length: 50 }, (_, index) => ({
          id: `tpl-${index}`,
          workspaceId: "ws-1",
          createdByUserId: "user_1",
          name: `Template ${index}`,
          graph: { nodes: [] },
        })),
      })
      .mockResolvedValueOnce({
        templates: [
          {
            id: "tpl-51",
            workspaceId: "ws-1",
            createdByUserId: "user_1",
            name: "Launch",
            graph: {
              nodes: [
                { id: "node_a", title: "Design" },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        users: [
          {
            userId: "user_1",
            name: "Alice",
            email: "alice@example.com",
            avatarUrl: "",
            role: "member",
          },
        ],
      });
    mockSelect.mockResolvedValueOnce("user_1");
    mockClient.post.mockResolvedValue({ ok: true, pipelineId: "pipe-1" });

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      template: "tpl-51",
      name: "Demo",
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expectTemplateListRequestWithIndex(1, 0);
    expectTemplateListRequestWithIndex(2, 1);
    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/templates/tpl-51/projects",
      {
        name: "Demo",
        nodes: {
          node_a: "user_1",
        },
      },
    );
  });

  it("prompts for template, name, and node owners when create options are omitted", async () => {
    mockClient.get
      .mockResolvedValueOnce({
        templates: [
          {
            id: "tpl-1",
            workspaceId: "ws-1",
            createdByUserId: "user_1",
            name: "Launch",
            graph: {
              nodes: [
                { id: "node_a", title: "Design" },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        users: [
          {
            userId: "user_1",
            name: "Alice",
            email: "alice@example.com",
            avatarUrl: "",
            role: "member",
          },
        ],
      });
    mockSelect
      .mockResolvedValueOnce("tpl-1")
      .mockResolvedValueOnce("user_1");
    mockText.mockResolvedValueOnce("Demo");
    mockClient.post.mockResolvedValue({ ok: true, pipelineId: "pipe-1" });

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expect(mockSelect).toHaveBeenNthCalledWith(
      1,
      {
        message: "Select a template",
        options: [
          { label: "Launch", value: "tpl-1" },
        ],
      },
    );
    expect(mockText).toHaveBeenCalledWith({
      message: "Project name",
      placeholder: "Launch",
    });
    expect(mockClient.post).toHaveBeenCalledWith(
      "/api/console/v1/templates/tpl-1/projects",
      {
        name: "Demo",
        nodes: {
          node_a: "user_1",
        },
      },
    );
  });

  it("includes templates from later pages when prompting for a template", async () => {
    mockClient.get
      .mockResolvedValueOnce({
        templates: Array.from({ length: 50 }, (_, index) => ({
          id: `tpl-${index}`,
          workspaceId: "ws-1",
          createdByUserId: "user_1",
          name: `Template ${index}`,
          graph: { nodes: [] },
        })),
      })
      .mockResolvedValueOnce({
        templates: [
          {
            id: "tpl-51",
            workspaceId: "ws-1",
            createdByUserId: "user_1",
            name: "Launch",
            graph: {
              nodes: [
                { id: "node_a", title: "Design" },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        users: [
          {
            userId: "user_1",
            name: "Alice",
            email: "alice@example.com",
            avatarUrl: "",
            role: "member",
          },
        ],
      });
    mockSelect
      .mockResolvedValueOnce("tpl-51")
      .mockResolvedValueOnce("user_1");
    mockText.mockResolvedValueOnce("Demo");
    mockClient.post.mockResolvedValue({ ok: true, pipelineId: "pipe-1" });

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expectTemplateListRequestWithIndex(1, 0);
    expectTemplateListRequestWithIndex(2, 1);
    expect(mockSelect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: "Select a template",
        options: expect.arrayContaining([
          { label: "Template 0", value: "tpl-0" },
          { label: "Launch", value: "tpl-51" },
        ]),
      }),
    );
  });

  it("requires --nodes when interactive prompts are unavailable", async () => {
    setTty(false);

    const { projectsCreateCmd } = await import("../projects/create.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (projectsCreateCmd as any)._optionValues = {
      template: "tpl-1",
      name: "Demo",
      json: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (projectsCreateCmd as any)._actionHandler;
    await handler.call(projectsCreateCmd, []);

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockClient.get).not.toHaveBeenCalled();
    expect(mockClient.post).not.toHaveBeenCalled();
  });
});
