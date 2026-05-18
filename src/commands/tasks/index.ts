import { Command } from "commander";
import { tasksListCmd } from "./list.js";
import { tasksGetCmd } from "./get.js";
import { tasksHistoryCmd } from "./history.js";
import { tasksSendCmd } from "./send-prompt.js";
import { tasksCreateCmd } from "./create.js";

export const tasksCmd = new Command("tasks")
  .description("Manage tasks")
  .addCommand(tasksListCmd)
  .addCommand(tasksGetCmd)
  .addCommand(tasksCreateCmd)
  .addCommand(tasksSendCmd)
  .addCommand(tasksHistoryCmd);
