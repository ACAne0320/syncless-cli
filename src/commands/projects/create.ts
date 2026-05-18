import { Command } from "commander";
import { client, printJson, printSuccess } from "../../core/index.js";
import type {
  CreateProjectFromTemplateRequest,
  CreateProjectFromTemplateResponse,
} from "../../types/index.js";
import { parseStringRecordOption, runCommand } from "../utils.js";

interface ProjectsCreateOptions {
  template: string;
  name: string;
  nodes: Record<string, string>;
  json?: boolean;
}

export const projectsCreateCmd = new Command("create")
  .description("Create a project from a template")
  .requiredOption("--template <id>", "Template ID")
  .requiredOption("--name <name>", "Project name")
  .requiredOption(
    "--nodes <json>",
    "Node-to-owner mapping as JSON (e.g. '{\"node_id\":\"owner_id\"}')",
    parseStringRecordOption("--nodes"),
  )
  .option("--json", "Output as JSON")
  .action(runCommand(async (opts: ProjectsCreateOptions) => {
    const body: CreateProjectFromTemplateRequest = {
      name: opts.name,
      nodes: opts.nodes,
    };

    const data = await client.post<CreateProjectFromTemplateResponse>(
      `/api/console/v1/templates/${opts.template}/projects`,
      body,
    );

    if (opts.json) {
      printJson(data);
    } else {
      printSuccess(`Project created. Pipeline ID: ${data.pipelineId}`);
    }
  }));
