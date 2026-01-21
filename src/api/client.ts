const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY = 'accessToken';

export const AUTH_EXPIRED_EVENT = 'auth:expired';

export function dispatchAuthExpired(): void {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
  isAuthError?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAccessToken();
        dispatchAuthExpired();
      }
      return null;
    }

    const json = await response.json();
    const newToken = json.data?.accessToken || json.accessToken;
    if (newToken) {
      setAccessToken(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers, credentials: 'include' });
    } else {
      const error: ApiError = {
        message: 'Session expired. Please log in again.',
        statusCode: 401,
        isAuthError: true,
      };
      throw error;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || `Request failed: ${response.status}`,
      statusCode: response.status,
      error: errorData.error,
      isAuthError: response.status === 401,
    };
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();
  return json.data ?? json;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
