import { Command } from "commander";
import { usersListCmd } from "./list.js";

export const usersCmd = new Command("users")
  .description("Manage users")
  .addCommand(usersListCmd);
