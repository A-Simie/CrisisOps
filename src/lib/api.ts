import { apiRequest } from '../api/client';

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

export interface Incident {
  id: string;
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
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'REJECTED';
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  media?: { url: string; type: 'IMAGE' | 'VIDEO' }[];
}

export interface ApiError extends Error {
  statusCode?: number;
  isAuthError?: boolean;
}

export async function uploadIncidentMedia(file: File): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append('media', file);

  return apiRequest<UploadedMedia>('/incidents/media/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function createIncident(
  payload: CreateIncidentPayload,
  idempotencyKey?: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>('/incidents', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Idempotency-Key': idempotencyKey || crypto.randomUUID(),
    },
  });
}

export async function getNearbyIncidents(params: {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  excludeResolved?: boolean;
}): Promise<Incident[]> {
  const query = new URLSearchParams({
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    ...(params.radiusKm && { radiusKm: params.radiusKm.toString() }),
    ...(params.excludeResolved !== undefined && { excludeResolved: params.excludeResolved.toString() }),
  });

  return apiRequest<Incident[]>(`/incidents/nearby?${query.toString()}`);
}

export const api = {
  uploadIncidentMedia,
  createIncident,
  getNearbyIncidents,
};
