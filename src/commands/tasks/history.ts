import { Command } from "commander";
import { client, printJson } from "../../core/index.js";
import type { ListTaskMessagesResponse } from "../../types/index.js";
import { parseIntegerOption, runCommand } from "../utils.js";

interface MessageBlock {
  type: string;
  text?: string;
  toolName?: string;
  args?: unknown;
  result?: unknown;
  metadata?: unknown;
}

function renderContent(content: unknown): string {
  // Handle string (possibly serialized JSON)
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content) as Record<string, unknown>;
      return renderContent(parsed);
    } catch {
      return content;
    }
  }

  // Handle { blocks: [...], version: N } wrapper
  if (typeof content === "object" && content !== null) {
    const obj = content as Record<string, unknown>;
    if (Array.isArray(obj["blocks"])) {
      return (obj["blocks"] as MessageBlock[])
        .map((block) => renderBlock(block))
        .filter(Boolean)
        .join("\n");
    }
  }

  // Handle direct array of blocks
  if (Array.isArray(content)) {
    return content
      .map((block) => renderBlock(block as MessageBlock))
      .filter(Boolean)
      .join("\n");
  }

  return JSON.stringify(content);
}

function renderBlock(block: MessageBlock): string {
  switch (block.type) {
    case "text":
      return block.text ?? "";
    case "reasoning":
      return `[思考] ${block.text ?? ""}`;
    case "tool-call":
      return `[工具调用: ${block.toolName ?? "unknown"}]`;
    case "tool_result":
      return `[工具结果]`;
    default:
      if (block.text) return block.text;
      return `[${block.type}]`;
  }
}

export const tasksHistoryCmd = new Command("history")
  .description("List message history for a task")
  .argument("<task-id>", "Task ID")
  .option(
    "--limit <number>",
    "Max messages (capped at 20)",
    parseIntegerOption({ name: "--limit", min: 1, max: 20 }),
    20,
  )
  .option("--json", "Output as JSON")
  .option("--verbose", "Show full content including tool args/results")
  .action(runCommand(async (
    taskId: string,
    opts: { limit: number; json?: boolean; verbose?: boolean },
  ) => {
    const query = new URLSearchParams({ limit: String(opts.limit) });
    const data = await client.get<ListTaskMessagesResponse>(
      `/api/console/v1/tasks/${taskId}/messages`,
      query,
    );

    if (opts.json) {
      printJson(data);
    } else {
      if (data.messages.length === 0) {
        console.log("No messages found.");
        return;
      }
      for (const msg of data.messages) {
        const rendered = opts.verbose
          ? JSON.stringify(msg.content, null, 2)
          : renderContent(msg.content);
        console.log(`[${msg.role}] ${rendered}`);
        console.log("---");
      }
    }
  }));
