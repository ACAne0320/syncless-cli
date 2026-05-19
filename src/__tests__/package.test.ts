import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type PackageJson = {
  bin?: Record<string, string>;
};

describe("package bin entries", () => {
  it("registers non-conflicting CLI names", () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8"),
    ) as PackageJson;

    expect(packageJson.bin).toEqual({
      syncl: "dist/cli.js",
      "syncless-cli": "dist/cli.js",
    });
  });
});
