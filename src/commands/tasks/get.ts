import { Command } from "commander";
import { client, printJson } from "../../core/index.js";
import type { GetTaskResponse } from "../../types/index.js";
import { runCommand } from "../utils.js";

export const tasksGetCmd = new Command("get")
  .description("Get a single task by ID")
  .argument("<task-id>", "Task ID")
  .option("--json", "Output as JSON")
  .action(runCommand(async (taskId: string, opts: { json?: boolean }) => {
    const data = await client.get<GetTaskResponse>(
      `/api/console/v1/tasks/${taskId}`,
    );

    if (opts.json) {
      printJson(data);
    } else {
      console.log(`ID:    ${data.task.id}`);
      console.log(`Title: ${data.task.title}`);
    }
  }));
