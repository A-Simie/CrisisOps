import { getQueuedReports, updateReportStatus, getSyncMeta, setSyncMeta, type Report } from './db';
import { api, type CreateIncidentPayload } from './api';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

// Map frontend hazard IDs to backend HazardType enum values
const HAZARD_TYPE_MAP: Record<string, string> = {
  'flood': 'FLOOD',
  'fire': 'FIRE',
  'medical': 'MEDICAL_EMERGENCY',
  'road-accident': 'ROAD_ACCIDENT',
  'collapse': 'BUILDING_COLLAPSE',
  'earthquake': 'EARTHQUAKE',
  'extreme-cold': 'OTHER',
  'blizzard': 'OTHER',
  'avalanche': 'OTHER',
  'gas-leak': 'GAS_LEAK',
  'power-outage': 'POWER_OUTAGE',
  'violence': 'VIOLENCE',
  'terrorism': 'TERRORISM',
};

function mapHazardTypeToBackend(hazardType: string): string {
  const mapped = HAZARD_TYPE_MAP[hazardType.toLowerCase()];
  if (!mapped) {
    console.warn(`No backend mapping for hazard type: ${hazardType}. Falling back to OTHER.`);
    return 'OTHER';
  }
  return mapped;
}

function mapSeverityToBackend(severity: number): string {
  if (severity <= 1) return 'LOW';
  if (severity <= 2) return 'MEDIUM';
  if (severity <= 4) return 'HIGH';
  return 'CRITICAL';
}

async function sendReportToServer(report: Report): Promise<{ success: boolean; serverId?: string }> {
  try {
    const backendHazardType = mapHazardTypeToBackend(report.hazardType);
    const payload: CreateIncidentPayload = {
      hazardType: backendHazardType,
      title: `${report.hazardType.charAt(0).toUpperCase() + report.hazardType.slice(1)} Report`,
      description: report.description || `Reported ${report.hazardType.toLowerCase()} incident`,
      location: {
        latitude: report.location.lat,
        longitude: report.location.lng,
        address: report.location.address,
      },
      severity: mapSeverityToBackend(report.severity),
      media: report.mediaUrls?.map(url => ({
        url,
        type: url.includes('video') ? 'VIDEO' as const : 'IMAGE' as const,
      })),
    };

    const result = await api.createIncident(payload);
    return { success: true, serverId: result.id };
  } catch (error) {
    console.error('Failed to send report:', error);
    return { success: false };
  }
}

export async function syncReports(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    errors: [],
  };

  if (!navigator.onLine) {
    result.success = false;
    result.errors.push('No network connection');
    return result;
  }

  const queuedReports = await getQueuedReports();
  
  for (const report of queuedReports) {
    try {
      const response = await sendReportToServer(report);
      
      if (response.success && response.serverId) {
        await updateReportStatus(report.id, 'sent', response.serverId);
        result.synced++;
      } else {
        result.failed++;
        result.errors.push(`Failed to sync report ${report.id}`);
      }
    } catch (error) {
      result.failed++;
      result.errors.push(`Error syncing report ${report.id}: ${error}`);
    }
  }

  if (result.synced > 0) {
    await setSyncMeta('lastSyncTime', Date.now());
  }

  result.success = result.failed === 0;
  return result;
}

export async function getLastSyncTime(): Promise<number | null> {
  const time = await getSyncMeta('lastSyncTime');
  return typeof time === 'number' ? time : null;
}

export function formatLastSync(timestamp: number | null): string {
  if (!timestamp) return 'Never synced';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export async function registerBackgroundSync(): Promise<boolean> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-expect-error - SyncManager types not fully available
      await registration.sync.register('sync-reports');
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function setupAutoSync(onSync: (result: SyncResult) => void): () => void {
  const handleOnline = async () => {
    const result = await syncReports();
    onSync(result);
  };

  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
