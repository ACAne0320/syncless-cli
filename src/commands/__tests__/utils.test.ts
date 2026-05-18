import { describe, expect, it } from "vitest";
import { InvalidArgumentError } from "commander";
import { SynclessError } from "../../core/index.js";
import {
  formatCommandError,
  parseIntegerOption,
  parseStringRecordOption,
} from "../utils.js";

describe("formatCommandError", () => {
  it("formats Syncless errors without the Error prefix", () => {
    expect(formatCommandError(new SynclessError("bad request"))).toBe(
      "bad request",
    );
  });

  it("formats fetch TypeErrors as network errors", () => {
    expect(formatCommandError(new TypeError("fetch failed"))).toBe(
      "Network error: fetch failed",
    );
  });
});

describe("parseIntegerOption", () => {
  it("parses a valid integer option", () => {
    const parse = parseIntegerOption({ name: "--limit", min: 1, max: 20 });
    expect(parse("20")).toBe(20);
  });

  it("rejects values outside the configured range", () => {
    const parse = parseIntegerOption({ name: "--limit", min: 1, max: 20 });
    expect(() => parse("0")).toThrow(InvalidArgumentError);
    expect(() => parse("21")).toThrow(InvalidArgumentError);
  });

  it("rejects non-integer values", () => {
    const parse = parseIntegerOption({ name: "--index" });
    expect(() => parse("1.5")).toThrow(InvalidArgumentError);
    expect(() => parse("abc")).toThrow(InvalidArgumentError);
  });
});

describe("parseStringRecordOption", () => {
  it("parses a string mapping object", () => {
    const parse = parseStringRecordOption("--nodes");
    expect(parse('{"node":"owner"}')).toEqual({ node: "owner" });
  });

  it("rejects invalid JSON and non-string values", () => {
    const parse = parseStringRecordOption("--nodes");
    expect(() => parse("{bad json}")).toThrow(InvalidArgumentError);
    expect(() => parse("[]")).toThrow(InvalidArgumentError);
    expect(() => parse('{"node":123}')).toThrow(InvalidArgumentError);
  });
});
