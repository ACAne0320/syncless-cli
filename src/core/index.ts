export { client } from "./client.js";
export { config, getApiKey, setApiKey, clearApiKey, getBaseUrl } from "./config.js";
export { requireApiKey } from "./auth.js";
export {
  SynclessError,
  AuthError,
  TaskRunningError,
} from "./errors.js";
export { printJson, printError, printSuccess, printTable } from "./output.js";
