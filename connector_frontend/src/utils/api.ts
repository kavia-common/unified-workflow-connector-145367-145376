"use client";

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

export type ApiEnvelope<T> = {
  status?: "success" | "error";
  data?: T;
  message?: string;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  baseUrl?: string; // Optional override for cross-origin
};

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || data?.detail || message;
      throw <ApiError>{ message, status: res.status, details: data };
    } catch {
      throw <ApiError>{ message, status: res.status };
    }
  }
  try {
    return (await res.json()) as T;
  } catch {
    // No content
    return {} as T;
  }
}

function buildUrl(path: string, baseUrl?: string) {
  if (baseUrl) return `${baseUrl}${path}`;
  return path;
}

// PUBLIC_INTERFACE
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  /**
   * Make a JSON API request to the backend.
   * path: relative path like "/api/v1/connect/jira"
   * options: method, body, headers, signal
   * Returns: parsed JSON response or throws ApiError.
   */
  const { method = "GET", body, headers = {}, signal, baseUrl } = options;
  const url = buildUrl(path, baseUrl);
  const res = await fetch(url, {
    method,
    headers: { ...DEFAULT_HEADERS, ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });
  return handleResponse<T>(res);
}

// PUBLIC_INTERFACE
export async function get<T = unknown>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<ApiEnvelope<T>> {
  /** Lightweight GET wrapper to match existing imports in pages/components. */
  return apiRequest<ApiEnvelope<T>>(path, { ...options, method: "GET" });
}

// PUBLIC_INTERFACE
export async function post<T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<ApiEnvelope<T>> {
  /** Lightweight POST wrapper to match existing imports in pages/components. */
  return apiRequest<ApiEnvelope<T>>(path, { ...options, method: "POST", body });
}
