import Conf from "conf";
import { z } from "zod";
import type { Schema } from "conf";

const configSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().default("https://api.syncless.ai"),
});

export type ConfigStore = z.infer<typeof configSchema>;

const confSchema = {
  apiKey: { type: "string" },
  baseUrl: { type: "string", default: "https://api.syncless.ai" },
} satisfies Schema<ConfigStore>;

export function createConfigStore(cwd?: string): Conf<ConfigStore> {
  return new Conf<ConfigStore>({
    projectName: "syncless-cli",
    cwd,
    schema: confSchema,
  });
}

export const config = createConfigStore();

export function getApiKey(store = config): string | undefined {
  return store.get("apiKey");
}

export function setApiKey(key: string, store = config): void {
  store.set("apiKey", key);
}

export function clearApiKey(store = config): void {
  store.delete("apiKey");
}

export function getBaseUrl(store = config): string {
  return store.get("baseUrl");
}
