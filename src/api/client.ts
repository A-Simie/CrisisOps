const IS_LIVE = import.meta.env.VITE_IS_LIVE === 'true';
const LIVE_URL = import.meta.env.VITE_API_BASE_URL;
const LOCAL_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

const API_BASE_URL = IS_LIVE ? LIVE_URL : (LOCAL_URL || LIVE_URL);

if (!API_BASE_URL) {
  console.error('API Base URL is not defined! Please check your VITE_API_BASE_URL or VITE_API_BASE_URL_LOCAL environment variables.');
}


export const AUTH_EXPIRED_EVENT = 'auth:expired';
export const VERIFICATION_REQUIRED_EVENT = 'auth:verification_required';

export function dispatchAuthExpired(): void {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

export function dispatchVerificationRequired(): void {
  window.dispatchEvent(new CustomEvent(VERIFICATION_REQUIRED_EVENT));
}

export function getAccessToken(): string | null {
  return null;
}

export function setAccessToken(_token: string): void {
}

export function clearAccessToken(): void {
}

export class AppError extends Error {
  statusCode?: number;
  error?: string;
  isAuthError?: boolean;

  constructor(message: string, options: { statusCode?: number; error?: string; isAuthError?: boolean } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options.statusCode;
    this.error = options.error;
    this.isAuthError = options.isAuthError;
  }
}

export type ApiError = AppError;

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
  const headers: Record<string, string> = { 
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers as Record<string, string>) 
  };

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
      response = await fetch(url, { ...options, headers, credentials: 'include' });
    } else {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || 'Session expired. Please log in again.';
      throw new AppError(message, {
        statusCode: 401,
        isAuthError: true,
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed: ${response.status}`;
    
    if (response.status === 403 && message === 'Email verification required to access this feature') {
      dispatchVerificationRequired();
    }

    throw new AppError(message, {
      statusCode: response.status,
      error: errorData.error,
      isAuthError: response.status === 401,
    });
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
