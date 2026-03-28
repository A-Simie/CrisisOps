import { Wifi, WifiOff, RefreshCw, CloudOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useState, useEffect } from 'react';

interface StatusChipProps {
    lastSync: string;
    queuedCount: number;
    lastSyncSummary?: string | null;
    syncing?: boolean;
    onSyncClick?: () => void;
}

export function StatusChip({
    lastSync,
    queuedCount,
    lastSyncSummary,
    syncing = false,
    onSyncClick
}: StatusChipProps) {
    const isOnline = useOnlineStatus();
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        if (lastSyncSummary && !syncing) {
            setShowSummary(true);
            const timer = setTimeout(() => {
                setShowSummary(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastSyncSummary, syncing]);

    return (
        <div className="flex items-center gap-2">
            <div
                className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
          ${isOnline
                        ? 'bg-safe/15 text-safe'
                        : 'bg-warning/15 text-warning'
                    }
        `}
            >
                {isOnline ? (
                    <Wifi className="w-3.5 h-3.5" />
                ) : (
                    <WifiOff className="w-3.5 h-3.5" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            <div className="text-xs text-text-muted hidden sm:block">
                {lastSync}
            </div>

            {(queuedCount > 0 || (showSummary && lastSyncSummary)) && (
                <button
                    onClick={onSyncClick}
                    disabled={!isOnline || syncing}
                    className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
            transition-all duration-300
            ${showSummary && lastSyncSummary
                            ? 'bg-safe/20 text-safe border border-safe/30'
                            : isOnline
                                ? 'bg-accent/15 text-accent hover:bg-accent/25 cursor-pointer'
                                : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                        }
          `}
                    title={isOnline ? 'Sync now' : 'Go online to sync'}
                >
                    {syncing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : showSummary && lastSyncSummary ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : !isOnline ? (
                        <CloudOff className="w-3.5 h-3.5" />
                    ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>
                        {showSummary && lastSyncSummary ? lastSyncSummary : `${queuedCount} queued`}
                    </span>
                </button>
            )}
        </div>
    );
}

type ReportStatus = 'queued' | 'sent' | 'verified' | 'assigned' | 'resolved';

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
    queued: {
        label: 'Queued',
        className: 'bg-warning/15 text-warning'
    },
    sent: {
        label: 'Sent',
        className: 'bg-info/15 text-info'
    },
    verified: {
        label: 'Verified',
        className: 'bg-accent/15 text-accent'
    },
    assigned: {
        label: 'Assigned',
        className: 'bg-safe/15 text-safe'
    },
    resolved: {
        label: 'Resolved',
        className: 'bg-text-muted/15 text-text-muted'
    },
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const config = statusConfig[status];

    return (
        <span
            className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${config.className}
      `}
        >
            {config.label}
        </span>
    );
}
