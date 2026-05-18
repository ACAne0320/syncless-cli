import { describe, it, expect, vi } from "vitest";
import { printJson, printSuccess, printError, printTable } from "../output.js";

describe("printJson", () => {
  it("prints formatted JSON", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    printJson({ foo: "bar" });
    expect(spy).toHaveBeenCalledWith('{\n  "foo": "bar"\n}');
    spy.mockRestore();
  });
});

describe("printError", () => {
  it("prints to stderr", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    printError("something went wrong");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Error:"), "something went wrong");
    spy.mockRestore();
  });
});

describe("printSuccess", () => {
  it("prints success message", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    printSuccess("done");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("✓"), "done");
    spy.mockRestore();
  });
});

describe("printTable", () => {
  it("prints aligned table", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    printTable(
      ["ID", "Name"],
      [
        ["1", "Alice"],
        ["2", "Bob"],
      ],
    );
    expect(spy).toHaveBeenCalledTimes(3); // header + 2 rows
    spy.mockRestore();
  });
});
