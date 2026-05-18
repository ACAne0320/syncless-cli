import { Command } from "commander";
import { projectsListCmd } from "./list.js";
import { projectsCreateCmd } from "./create.js";

export const projectsCmd = new Command("projects")
  .description("Manage projects")
  .addCommand(projectsListCmd)
  .addCommand(projectsCreateCmd);
