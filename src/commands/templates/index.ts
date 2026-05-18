import { Command } from "commander";
import { templatesListCmd } from "./list.js";

export const templatesCmd = new Command("templates")
  .description("Manage templates")
  .addCommand(templatesListCmd);
