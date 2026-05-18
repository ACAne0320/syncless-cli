import readline from "node:readline";
import { Writable } from "node:stream";
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

class HiddenPromptOutput extends Writable {
  muted = false;

  override _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
    }
    callback();
  }
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

export async function promptHidden(query: string): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new SynclessError("API key is required in non-interactive mode.");
  }

  const output = new HiddenPromptOutput();
  const rl = readline.createInterface({
    input: process.stdin,
    output,
    terminal: true,
  });

  return await new Promise<string>((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
    output.muted = true;
  });
}
