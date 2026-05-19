import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockSetApiKey = vi.fn();
const mockPrintSuccess = vi.fn();
const mockPrintError = vi.fn();
const mockPassword = vi.fn();
const mockExit = vi.fn();

vi.mock("../../core/index.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../core/index.js")>();
  return {
    ...actual,
    getBaseUrl: vi.fn(() => "https://api.syncless.ai"),
    printError: mockPrintError,
    printSuccess: mockPrintSuccess,
    setApiKey: mockSetApiKey,
  };
});

vi.mock("@clack/prompts", () => ({
  isCancel: vi.fn(() => false),
  password: mockPassword,
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

describe("loginCmd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPassword.mockReset();
    process.exit = mockExit as unknown as typeof process.exit;
    setTty(true);
    delete process.env.CI;
    global.fetch = vi.fn(async () => ({
      ok: true,
    })) as unknown as typeof fetch;
  });

  afterEach(() => {
    process.exit = realExit;
  });

  it("prompts for an API key when no argument is provided", async () => {
    mockPassword.mockResolvedValueOnce("sk-test");

    const { loginCmd } = await import("../auth/login.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (loginCmd as any)._actionHandler;
    await handler.call(loginCmd, []);

    expect(mockPassword).toHaveBeenCalledWith({
      message: "Syncless API key",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.syncless.ai/api/console/v1/users",
      { headers: { Authorization: "Bearer sk-test" } },
    );
    expect(mockSetApiKey).toHaveBeenCalledWith("sk-test");
    expect(mockPrintSuccess).toHaveBeenCalledWith(
      "API key validated and saved",
    );
  });

  it("requires an API key argument when prompts are unavailable", async () => {
    setTty(false);

    const { loginCmd } = await import("../auth/login.js");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const handler = (loginCmd as any)._actionHandler;
    await handler.call(loginCmd, []);

    expect(mockPassword).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockPrintError).toHaveBeenCalledWith(
      "Syncless API key is required in non-interactive mode.",
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
