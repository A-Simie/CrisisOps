import { useState, useEffect, useCallback } from 'react';
import type { Report } from '../lib/db';
import { 
  getReports, 
  getQueuedReports, 
  addReport, 
  deleteReport,
  clearQueuedReports 
} from '../lib/db';
import { syncReports, getLastSyncTime, formatLastSync } from '../lib/sync';

interface ReportQueueState {
  reports: Report[];
  queuedCount: number;
  lastSyncTime: string;
  lastSyncSummary: string | null;
  syncing: boolean;
  error: string | null;
}

export function useReportQueue() {
  const [state, setState] = useState<ReportQueueState>({
    reports: [],
    queuedCount: 0,
    lastSyncTime: 'Never',
    lastSyncSummary: null,
    syncing: false,
    error: null,
  });

  const loadReports = useCallback(async () => {
    try {
      const [reports, queued, syncTime] = await Promise.all([
        getReports(),
        getQueuedReports(),
        getLastSyncTime(),
      ]);
      
      setState(prev => ({
        ...prev,
        reports: reports.reverse(), // Most recent first
        queuedCount: queued.length,
        lastSyncTime: formatLastSync(syncTime),
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load reports',
      }));
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const submitReport = useCallback(async (
    data: Omit<Report, 'id' | 'createdAt' | 'status'>
  ): Promise<Report> => {
    const report = await addReport(data);
    await loadReports();
    return report;
  }, [loadReports]);

  const sync = useCallback(async () => {
    setState(prev => ({ ...prev, syncing: true, error: null }));
    
    try {
      const result = await syncReports();
      await loadReports();
      
      if (!result.success && result.failed > 0) {
        setState(prev => ({
          ...prev,
          syncing: false,
          lastSyncSummary: `${result.synced} synced, ${result.failed} failed`,
          error: result.errors[0] || 'Sync failed',
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          syncing: false,
          lastSyncSummary: result.synced > 0 ? `${result.synced} report${result.synced !== 1 ? 's' : ''} synced` : null
        }));
      }
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        syncing: false,
        error: 'Sync failed unexpectedly',
      }));
      return { success: false, synced: 0, failed: 0, errors: ['Unexpected error'] };
    }
  }, [loadReports]);

  const removeReport = useCallback(async (id: string) => {
    await deleteReport(id);
    await loadReports();
  }, [loadReports]);

  const clearQueue = useCallback(async () => {
    await clearQueuedReports();
    await loadReports();
  }, [loadReports]);

  return {
    ...state,
    submitReport,
    sync,
    removeReport,
    clearQueue,
    refresh: loadReports,
  };
}
