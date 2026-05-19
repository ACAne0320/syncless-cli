import {
  isCancel,
  password,
  select,
  text,
} from "@clack/prompts";
import { SynclessError } from "../core/index.js";

interface InteractiveOptions {
  json?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export function canPrompt(opts: InteractiveOptions = {}): boolean {
  return Boolean(
    process.stdin.isTTY &&
    process.stdout.isTTY &&
    !process.env.CI &&
    !opts.json,
  );
}

export async function promptSelect(
  message: string,
  options: SelectOption[],
): Promise<string> {
  const value = await select<string>({
    message,
    options,
  });

  if (isCancel(value)) {
    throw new SynclessError("Command cancelled.");
  }

  return value;
}

export async function promptPassword(message: string): Promise<string> {
  if (!canPrompt()) {
    throw new SynclessError(`${message} is required in non-interactive mode.`);
  }

  const value = await password({ message });

  if (isCancel(value)) {
    throw new SynclessError("Command cancelled.");
  }

  return value.trim();
}

export async function promptText(
  message: string,
  opts: InteractiveOptions & { placeholder?: string } = {},
): Promise<string> {
  if (!canPrompt(opts)) {
    throw new SynclessError(`${message} is required in non-interactive mode.`);
  }

  const value = await text({
    message,
    placeholder: opts.placeholder,
  });

  if (isCancel(value)) {
    throw new SynclessError("Command cancelled.");
  }

  return value.trim();
}
