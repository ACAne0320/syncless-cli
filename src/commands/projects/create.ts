import { Command } from "commander";
import { client, printJson, printSuccess, SynclessError } from "../../core/index.js";
import type {
  CreateProjectFromTemplateRequest,
  CreateProjectFromTemplateResponse,
  ListTemplatesResponse,
  ListUsersResponse,
  Template,
  User,
} from "../../types/index.js";
import { canPrompt, promptSelect, promptText } from "../prompts.js";
import { parseStringRecordOption, runCommand } from "../utils.js";

interface ProjectsCreateOptions {
  template?: string;
  name?: string;
  nodes?: Record<string, string>;
  json?: boolean;
}

interface ResolvedProjectCreateOptions {
  templateId: string;
  name: string;
  nodes: Record<string, string>;
}

interface TemplateNode {
  id: string;
  label: string;
}

interface ParsedTemplateNode {
  id: string;
  label?: string;
}

const TEMPLATE_PAGE_SIZE = 50;

export const projectsCreateCmd = new Command("create")
  .description("Create a project from a template")
  .option("--template <id>", "Template ID")
  .option("--name <name>", "Project name")
  .option(
    "--nodes <json>",
    "Node-to-owner mapping as JSON (e.g. '{\"node_id\":\"owner_id\"}')",
    parseStringRecordOption("--nodes"),
  )
  .option("--json", "Output as JSON")
  .action(runCommand(async (opts: ProjectsCreateOptions) => {
    const resolved = await resolveProjectCreateOptions(opts);
    const body: CreateProjectFromTemplateRequest = {
      name: resolved.name,
      nodes: resolved.nodes,
    };

    const data = await client.post<CreateProjectFromTemplateResponse>(
      `/api/console/v1/templates/${resolved.templateId}/projects`,
      body,
    );

    if (opts.json) {
      printJson(data);
    } else {
      printSuccess(`Project created. Pipeline ID: ${data.pipelineId}`);
    }
  }));

async function resolveProjectCreateOptions(
  opts: ProjectsCreateOptions,
): Promise<ResolvedProjectCreateOptions> {
  validateNonInteractiveOptions(opts);

  const templates = await fetchTemplatesIfNeeded(opts);
  const template = opts.template
    ? resolveTemplate(opts, templates)
    : await promptTemplate(templates, opts);
  const templateId = opts.template ?? template?.id;
  if (!templateId) {
    throw new SynclessError(
      "Template ID is required in non-interactive mode. Pass --template <id>.",
    );
  }

  const name = opts.name?.trim()
    || await promptText("Project name", {
      ...opts,
      placeholder: template?.name,
    });
  const nodes = opts.nodes ?? await promptTemplateNodeOwners(
    requireTemplate(template, templateId),
    opts,
  );

  if (!name) {
    throw new SynclessError("Project name is required.");
  }

  return { templateId, name, nodes };
}

function validateNonInteractiveOptions(opts: ProjectsCreateOptions): void {
  if (canPrompt(opts)) {
    return;
  }

  if (!opts.template) {
    throw new SynclessError(
      "Template ID is required in non-interactive mode. Pass --template <id>.",
    );
  }

  if (!opts.name?.trim()) {
    throw new SynclessError(
      "Project name is required in non-interactive mode. Pass --name <name>.",
    );
  }

  if (!opts.nodes) {
    throw new SynclessError(
      "Missing node owner assignments. Run this command in an interactive terminal or pass --nodes '{\"node_id\":\"owner_id\"}'.",
    );
  }
}

async function fetchTemplatesIfNeeded(
  opts: ProjectsCreateOptions,
): Promise<Template[]> {
  if (!opts.template) {
    return await fetchAllTemplates();
  }

  if (!opts.nodes) {
    return [await fetchTemplateById(opts.template)];
  }

  return [];
}

function resolveTemplate(
  opts: ProjectsCreateOptions,
  templates: Template[],
): Template | undefined {
  if (opts.template) {
    return templates.length > 0
      ? findTemplate(templates, opts.template)
      : undefined;
  }

  return undefined;
}

function requireTemplate(
  template: Template | undefined,
  templateId: string,
): Template {
  if (!template) {
    throw new SynclessError(`Template not found: ${templateId}`);
  }

  return template;
}

async function promptTemplate(
  templates: Template[],
  opts: ProjectsCreateOptions,
): Promise<Template> {
  if (!canPrompt(opts)) {
    throw new SynclessError(
      "Template ID is required in non-interactive mode. Pass --template <id>.",
    );
  }

  if (templates.length === 0) {
    throw new SynclessError("No templates found.");
  }

  const templateId = await promptSelect(
    "Select a template",
    templates.map((template) => ({
      label: template.name,
      value: template.id,
    })),
  );

  return findTemplate(templates, templateId);
}

async function promptTemplateNodeOwners(
  template: Template,
  opts: ProjectsCreateOptions,
): Promise<Record<string, string>> {
  if (!canPrompt(opts)) {
    throw new SynclessError(
      "Missing node owner assignments. Run this command in an interactive terminal or pass --nodes '{\"node_id\":\"owner_id\"}'.",
    );
  }

  const nodes = extractTemplateNodes(template);
  if (nodes.length === 0) {
    throw new SynclessError(
      `Template ${template.id} does not include assignable nodes.`,
    );
  }

  const users = await fetchUsers();
  if (users.length === 0) {
    throw new SynclessError("No workspace users found for node assignment.");
  }

  const userOptions = users.map((user) => ({
    label: `${user.name} <${user.email}>`,
    value: user.userId,
  }));

  const assignments: Record<string, string> = {};
  for (const node of nodes) {
    const ownerId = await promptSelect(`Owner for "${node.label}"`, userOptions);
    assignments[node.id] = ownerId;
  }

  return assignments;
}

async function fetchAllTemplates(): Promise<Template[]> {
  const templates: Template[] = [];

  for (let index = 0; ; index++) {
    const page = await fetchTemplatePage(index);
    templates.push(...page);

    if (page.length < TEMPLATE_PAGE_SIZE) {
      return templates;
    }
  }
}

async function fetchTemplateById(templateId: string): Promise<Template> {
  for (let index = 0; ; index++) {
    const page = await fetchTemplatePage(index);
    const template = page.find((item) => item.id === templateId);
    if (template) {
      return template;
    }

    if (page.length < TEMPLATE_PAGE_SIZE) {
      throw new SynclessError(`Template not found: ${templateId}`);
    }
  }
}

async function fetchTemplatePage(index: number): Promise<Template[]> {
  const query = new URLSearchParams({
    index: String(index),
    pageSize: String(TEMPLATE_PAGE_SIZE),
  });

  const data = await client.get<ListTemplatesResponse>(
    "/api/console/v1/templates",
    query,
  );
  return data.templates;
}

function findTemplate(templates: Template[], templateId: string): Template {
  const template = templates.find((item) => item.id === templateId);
  if (!template) {
    throw new SynclessError(`Template not found: ${templateId}`);
  }

  return template;
}

async function fetchUsers(): Promise<User[]> {
  const data = await client.get<ListUsersResponse>("/api/console/v1/users");
  return data.users;
}

function extractTemplateNodes(template: Template): TemplateNode[] {
  const nodes = readGraphNodes(template.graph);
  return nodes.map((node) => ({
    id: node.id,
    label: node.label ?? node.id,
  }));
}

function readGraphNodes(graph: unknown): ParsedTemplateNode[] {
  if (!isRecord(graph)) {
    return [];
  }

  const source = Array.isArray(graph.nodes)
    ? graph.nodes
    : isRecord(graph.nodes)
      ? Object.entries(graph.nodes).map(([id, value]) => (
        isRecord(value) ? { id, ...value } : { id }
      ))
      : [];

  return source.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const id = readString(item.id)
      ?? readString(item.nodeId)
      ?? readString(item.key);
    if (!id) {
      return [];
    }

    return [{
      id,
      label: readNodeLabel(item),
    }];
  });
}

function readNodeLabel(node: Record<string, unknown>): string | undefined {
  return readString(node.name)
    ?? readString(node.title)
    ?? readString(node.label)
    ?? (isRecord(node.data)
      ? readString(node.data.name)
        ?? readString(node.data.title)
        ?? readString(node.data.label)
      : undefined);
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
