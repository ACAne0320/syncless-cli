import { Command } from "commander";
import {
  client,
  printJson,
  printSuccess,
  TaskRunningError,
} from "../../core/index.js";
import type { SendPromptResponse, ContentBlock } from "../../types/index.js";
import { runCommand } from "../utils.js";

export const tasksSendCmd = new Command("send")
  .description("Send a prompt to a task")
  .argument("<task-id>", "Task ID")
  .argument("<prompt>", "The prompt text to send")
  .option("--json", "Output as JSON")
  .action(runCommand(async (
    taskId: string,
    prompt: string,
    opts: { json?: boolean },
  ) => {
    const body: ContentBlock[] = [{ type: "text", text: prompt }];
    const data = await client.post<SendPromptResponse>(
      `/api/console/v1/tasks/${taskId}/send`,
      body,
    );

    if (opts.json) {
      printJson(data);
    } else {
      printSuccess(`Prompt sent to task ${taskId}`);
    }
  }, (err, taskId) => {
    if (err instanceof TaskRunningError) {
      return `Task ${taskId} is currently running. Wait for it to finish before sending a new prompt.`;
    }

    return undefined;
  }));
