import { Command } from "commander";
import { clearApiKey, printSuccess } from "../../core/index.js";
import { runCommand } from "../utils.js";

export const logoutCmd = new Command("logout")
  .description("Remove the stored API key")
  .action(runCommand(() => {
    clearApiKey();
    printSuccess("API key removed");
  }));
