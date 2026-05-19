import { InvalidArgumentError } from "commander";
import { printError, SynclessError } from "../core/index.js";

type CommandAction<Args extends unknown[]> = (...args: Args) => Promise<void> | void;
type CommandErrorFormatter<Args extends unknown[]> = (
  err: unknown,
  ...args: Args
) => string | undefined;

interface IntegerOption {
  max?: number;
  min?: number;
  name: string;
}

export function runCommand<Args extends unknown[]>(
  action: CommandAction<Args>,
  formatError?: CommandErrorFormatter<Args>,
): CommandAction<Args> {
  return async (...args) => {
    try {
      await action(...args);
    } catch (err) {
      printError(formatError?.(err, ...args) ?? formatCommandError(err));
      process.exit(1);
    }
  };
}

export function formatCommandError(err: unknown): string {
  if (err instanceof SynclessError) {
    return err.message;
  }

  if (err instanceof Error) {
    if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
      return `Network error: ${err.message}`;
    }

    return err.message;
  }

  return String(err);
}

export function parseIntegerOption({ name, min = 0, max }: IntegerOption) {
  return (value: string): number => {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new InvalidArgumentError(`${name} must be an integer`);
    }

    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed) || parsed < min) {
      throw new InvalidArgumentError(`${name} must be >= ${min}`);
    }

    if (max !== undefined && parsed > max) {
      throw new InvalidArgumentError(`${name} must be <= ${max}`);
    }

    return parsed;
  };
}

export function parseStringRecordOption(name: string) {
  return (value: string): Record<string, string> => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new InvalidArgumentError(`${name} must be valid JSON`);
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new InvalidArgumentError(`${name} must be a JSON object`);
    }

    for (const [key, item] of Object.entries(parsed)) {
      if (typeof item !== "string") {
        throw new InvalidArgumentError(`${name}.${key} must be a string`);
      }
    }

    return parsed as Record<string, string>;
  };
}
