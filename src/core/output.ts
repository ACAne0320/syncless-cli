import chalk from "chalk";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printError(message: string): void {
  console.error(chalk.red("Error:"), message);
}

export function printSuccess(message: string): void {
  console.log(chalk.green("✓"), message);
}

export function printTable(
  headers: string[],
  rows: string[][],
): void {
  const colWidths = headers.map((h, i) => {
    const maxData = rows.reduce((max, row) => Math.max(max, (row[i] ?? "").length), 0);
    return Math.max(h.length, maxData);
  });

  const headerLine = headers
    .map((h, i) => chalk.bold(h.padEnd(colWidths[i] ?? h.length)))
    .join("  ");

  console.log(headerLine);

  for (const row of rows) {
    const line = row
      .map((cell, i) => (cell ?? "").padEnd(colWidths[i] ?? 0))
      .join("  ");
    console.log(line);
  }
}
