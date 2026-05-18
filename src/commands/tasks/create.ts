import { Command } from "commander";
import { client, printJson, printSuccess } from "../../core/index.js";
import type {
  CreatePersonalTaskResponse,
  ContentBlock,
} from "../../types/index.js";
import { runCommand } from "../utils.js";

export const tasksCreateCmd = new Command("create")
  .description("Create and start a new personal task")
  .argument("<prompt>", "The prompt text")
  .option("--json", "Output as JSON")
  .action(runCommand(async (prompt: string, opts: { json?: boolean }) => {
    const body: ContentBlock[] = [{ type: "text", text: prompt }];
    const data = await client.post<CreatePersonalTaskResponse>(
      "/api/console/v1/personal-tasks",
      body,
    );

    if (opts.json) {
      printJson(data);
    } else {
      printSuccess(`Task created: ${data.task.title} (${data.task.id})`);
    }
  }));
