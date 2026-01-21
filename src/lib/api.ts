import { getAccessToken, clearAccessToken, dispatchAuthExpired } from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface UploadedMedia {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  publicId: string;
}

export interface CreateIncidentPayload {
  hazardType: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
  };
  severity?: string;
  estimatedAffectedCount?: number;
  media?: { url: string; type: 'IMAGE' | 'VIDEO'; caption?: string }[];
}

export interface ApiError extends Error {
  statusCode?: number;
  isAuthError?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = { ...options.headers };

  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle auth errors - trigger logout
    if (response.status === 401) {
      clearAccessToken();
      dispatchAuthExpired();
      const error: ApiError = new Error('Session expired. Please log in again.');
      error.statusCode = 401;
      error.isAuthError = true;
      throw error;
    }
    
    const error: ApiError = new Error(errorData.message || `Request failed: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();
  return json.data ?? json;
}

export async function uploadIncidentMedia(file: File): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append('media', file);

  return request<UploadedMedia>('/incidents/media/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function createIncident(
  payload: CreateIncidentPayload
): Promise<{ id: string }> {
  return request<{ id: string }>('/incidents', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
    },
  });
}

export const api = {
  uploadIncidentMedia,
  createIncident,
};
