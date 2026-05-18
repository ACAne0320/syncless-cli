import { Command } from "commander";
import { client, printJson, printTable } from "../../core/index.js";
import type { ListProjectsResponse } from "../../types/index.js";
import { parseIntegerOption, runCommand } from "../utils.js";

interface ProjectsListOptions {
  index: number;
  pageSize: number;
  json?: boolean;
}

export const projectsListCmd = new Command("list")
  .description("List projects in the workspace")
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
  .action(runCommand(async (opts: ProjectsListOptions) => {
    const query = new URLSearchParams({
      index: String(opts.index),
      pageSize: String(opts.pageSize),
    });

    const data = await client.get<ListProjectsResponse>(
      "/api/console/v1/projects",
      query,
    );

    if (opts.json) {
      printJson(data);
    } else {
      if (data.projects.length === 0) {
        console.log("No projects found.");
        return;
      }
      printTable(
        ["ID", "Name", "Created", "Updated"],
        data.projects.map((p) => [
          p.projectId,
          p.name,
          p.createdAt,
          p.updatedAt,
        ]),
      );
    }
  }));
