#!/usr/bin/env node

import { Command } from "commander";
import { authCmd } from "./commands/auth/index.js";
import { tasksCmd } from "./commands/tasks/index.js";
import { projectsCmd } from "./commands/projects/index.js";
import { templatesCmd } from "./commands/templates/index.js";
import { usersCmd } from "./commands/users/index.js";

const program = new Command();

program
  .name("syncless")
  .description("CLI for the Syncless Console API")
  .version("0.0.1");

program.addCommand(authCmd);
program.addCommand(tasksCmd);
program.addCommand(projectsCmd);
program.addCommand(templatesCmd);
program.addCommand(usersCmd);

program.parse();
