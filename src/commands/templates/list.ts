import { Command } from "commander";
import { client, printJson, printTable } from "../../core/index.js";
import type { ListTemplatesResponse } from "../../types/index.js";
import { parseIntegerOption, runCommand } from "../utils.js";

interface TemplatesListOptions {
  index: number;
  pageSize: number;
  json?: boolean;
}

export const templatesListCmd = new Command("list")
  .description("List templates in the workspace")
  .option(
    "--index <number>",
    "Page index",
    parseIntegerOption({ name: "--index" }),
    0,
  )
  .option(
    "--page-size <number>",
    "Page size",
    parseIntegerOption({ name: "--page-size", min: 1 }),
    50,
  )
  .option("--json", "Output as JSON")
  .action(runCommand(async (opts: TemplatesListOptions) => {
    const query = new URLSearchParams({
      index: String(opts.index),
      pageSize: String(opts.pageSize),
    });

    const data = await client.get<ListTemplatesResponse>(
      "/api/console/v1/templates",
      query,
    );

    if (opts.json) {
      printJson(data);
    } else {
      if (data.templates.length === 0) {
        console.log("No templates found.");
        return;
      }
      printTable(
        ["Template ID", "Name"],
        data.templates.map((t) => [t.id, t.name]),
      );
    }
  }));
