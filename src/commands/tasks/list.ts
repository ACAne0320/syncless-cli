import { Command } from "commander";
import {
  client,
  printJson,
  printTable,
  printError,
} from "../../core/index.js";
import type { ListTasksResponse, ListProjectsResponse } from "../../types/index.js";
import { parseIntegerOption, runCommand } from "../utils.js";

interface TasksListOptions {
  index: number;
  pageSize: number;
  json?: boolean;
}

export const tasksListCmd = new Command("list")
  .description(
    "List tasks in a project. Use 'personal' as project-id for personal tasks.",
  )
  .argument("[project-id]", "Project ID or 'personal'")
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
  .action(runCommand(async (
    projectId: string | undefined,
    opts: TasksListOptions,
  ) => {
    if (!projectId) {
      const data = await client.get<ListProjectsResponse>(
        "/api/console/v1/projects",
      );

      if (opts.json) {
        printJson(data);
        process.exit(1);
      }

      console.log("Available projects:\n");

      const rows = [
        ["personal", "Personal tasks"],
        ...data.projects.map((p) => [p.projectId, p.name]),
      ];

      printTable(["Project ID", "Name"], rows);

      console.log('\nUse "personal" as project-id to list personal tasks.');
      printError("missing required argument 'project-id'");
      process.exit(1);
    }

    const query = new URLSearchParams({
      index: String(opts.index),
      pageSize: String(opts.pageSize),
    });

    const data = await client.get<ListTasksResponse>(
      `/api/console/v1/projects/${projectId}/tasks`,
      query,
    );

    if (opts.json) {
      printJson(data);
    } else {
      if (data.tasks.length === 0) {
        console.log("No tasks found.");
        return;
      }
      printTable(
        ["Task ID", "Title"],
        data.tasks.map((t) => [t.id, t.title]),
      );
    }
  }));
