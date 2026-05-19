import { Command } from "commander";
import {
  setApiKey,
  getBaseUrl,
  printSuccess,
  SynclessError,
} from "../../core/index.js";
import { promptPassword } from "../prompts.js";
import { runCommand } from "../utils.js";

export const loginCmd = new Command("login")
  .description("Store your Syncless Console API key")
  .argument("[api-key]", "Your Syncless API key")
  .action(runCommand(async (apiKey?: string) => {
    const key = apiKey?.trim() || await promptPassword("Syncless API key");
    if (!key) {
      throw new SynclessError("API key is required.");
    }

    const res = await fetch(`${getBaseUrl()}/api/console/v1/users`, {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = (body as { error?: string }).error ?? res.statusText;
      throw new SynclessError(
        `Invalid API key (HTTP ${res.status}): ${message}`,
      );
    }

    setApiKey(key);
    printSuccess("API key validated and saved");
  }));
