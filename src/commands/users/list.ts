import { Command } from "commander";
import { client, printJson, printTable } from "../../core/index.js";
import type { ListUsersResponse } from "../../types/index.js";
import { runCommand } from "../utils.js";

export const usersListCmd = new Command("list")
  .description("List workspace users")
  .option("--json", "Output as JSON")
  .action(runCommand(async (opts: { json?: boolean }) => {
    const data = await client.get<ListUsersResponse>(
      "/api/console/v1/users",
    );

    if (opts.json) {
      printJson(data);
    } else {
      if (data.users.length === 0) {
        console.log("No users found.");
        return;
      }
      printTable(
        ["User ID", "Name", "Email", "Role"],
        data.users.map((u) => [u.userId, u.name, u.email, u.role]),
      );
    }
  }));
