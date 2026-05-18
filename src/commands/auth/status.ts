import { Command } from "commander";
import { client, printSuccess } from "../../core/index.js";
import type { ListUsersResponse } from "../../types/index.js";
import { runCommand } from "../utils.js";

export const statusCmd = new Command("status")
  .description("Check authentication status")
  .action(runCommand(async () => {
    const data = await client.get<ListUsersResponse>(
      "/api/console/v1/users",
    );
    printSuccess(
      `API key is valid. Workspace has ${data.users.length} user(s).`,
    );
  }));
