import { getQueuedReports, updateReportStatus, getSyncMeta, setSyncMeta, type Report } from './db';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

async function mockSendReport(_report: Report): Promise<{ success: boolean; serverId?: string }> {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  if (Math.random() > 0.1) {
    return {
      success: true,
      serverId: `SRV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }
  return { success: false };
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
      const response = await mockSendReport(report);
      
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
