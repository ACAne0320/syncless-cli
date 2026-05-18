import { getBaseUrl } from "./config.js";
import { requireApiKey } from "./auth.js";
import { SynclessError } from "./errors.js";
import type { ApiError } from "../types/api.js";

class HttpClient {
  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private url(path: string, query?: URLSearchParams): string {
    const base = `${getBaseUrl()}${path}`;
    return query ? `${base}?${query.toString()}` : base;
  }

  async get<T>(path: string, query?: URLSearchParams): Promise<T> {
    const res = await fetch(this.url(path, query), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      await this.handleError(res);
    }

    return res.json() as Promise<T>;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.url(path), {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      await this.handleError(res);
    }

    return res.json() as Promise<T>;
  }

  private async handleError(res: Response): Promise<never> {
    let apiError: ApiError | undefined;
    try {
      apiError = (await res.json()) as ApiError;
    } catch {
      // response body is not JSON
    }

    if (apiError?.error) {
      throw SynclessError.fromApiError(apiError, res.status);
    }

    throw new SynclessError(
      `HTTP ${res.status}: ${res.statusText}`,
      undefined,
      res.status,
    );
  }
}

export const client = new HttpClient();
