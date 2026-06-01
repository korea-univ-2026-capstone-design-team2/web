export type ApiQueryValue = string | number | boolean | null | undefined;

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: object;
  body?: unknown;
  headers?: HeadersInit;
}

export class ApiConfigurationError extends Error {
  constructor() {
    super('NEXT_PUBLIC_API_BASE_URL is not set');
    this.name = 'ApiConfigurationError';
  }
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly path: string,
  ) {
    super(`API request failed: ${status} ${statusText}`);
    this.name = 'ApiRequestError';
  }
}

export function getApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? null;
}

export function hasApiBaseUrl(): boolean {
  return Boolean(getApiBaseUrl());
}

function buildUrl(path: string, query?: object): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new ApiConfigurationError();

  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query) as [string, ApiQueryValue][]) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function unwrapDataEnvelope<T>(body: unknown): T {
  if (
    body &&
    typeof body === 'object' &&
    'data' in body &&
    Object.keys(body as Record<string, unknown>).length === 1
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = options.body === undefined ? 'GET' : 'POST', query, body, headers } = options;
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ApiRequestError(response.status, response.statusText, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) return undefined as T;

  return unwrapDataEnvelope<T>(JSON.parse(text) as unknown);
}
