import { Command } from "commander";
import { client, printError, printJson, printSuccess } from "../../core/index.js";
import type {
  CreatePersonalTaskResponse,
  CreateProjectTaskRequest,
  CreateProjectTaskResponse,
  ContentBlock,
} from "../../types/index.js";
import { runCommand } from "../utils.js";

interface TasksCreateOptions {
  project?: string;
  upstream?: string;
  json?: boolean;
}

export const tasksCreateCmd = new Command("create")
  .description("Create and start a new task")
  .argument("<prompt>", "The prompt text")
  .option("--project <id>", "Create as a project task (instead of personal)")
  .option("--upstream <task_id>", "Set an upstream task for the project task")
  .option("--json", "Output as JSON")
  .action(runCommand(async (prompt: string, opts: TasksCreateOptions) => {
    const blocks: ContentBlock[] = [{ type: "text", text: prompt }];

    if (opts.project) {
      const body: CreateProjectTaskRequest = { blocks };
      if (opts.upstream) {
        body.upstream_task_id = opts.upstream;
      }

      const data = await client.post<CreateProjectTaskResponse>(
        `/api/console/v1/projects/${opts.project}/tasks`,
        body,
      );

      if (opts.json) {
        printJson(data);
      } else {
        const upstreamInfo = data.task.upstreamTaskId
          ? ` (upstream: ${data.task.upstreamTaskId})`
          : "";
        printSuccess(
          `Project task created: ${data.task.title} (${data.task.id})${upstreamInfo}`,
        );
      }
    } else {
      if (opts.upstream) {
        printError("--upstream requires --project");
        process.exit(1);
        return;
      }
      const data = await client.post<CreatePersonalTaskResponse>(
        "/api/console/v1/personal-tasks",
        blocks,
      );

      if (opts.json) {
        printJson(data);
      } else {
        printSuccess(`Task created: ${data.task.title} (${data.task.id})`);
      }
    }
  }));
