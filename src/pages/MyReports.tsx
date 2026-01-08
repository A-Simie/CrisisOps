import { PageContainer, Card, Button, ReportStatusBadge } from '../components';
import { useReportQueue } from '../hooks/useReportQueue';
import { getHazardById } from '../lib/hazards';
import { MapPin, Clock, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function MyReports() {
    const { reports, queuedCount, syncing, sync, clearQueue, refresh } = useReportQueue();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <PageContainer>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary mb-1">
                            My Reports
                        </h1>
                        <p className="text-text-secondary">
                            {reports.length} report{reports.length !== 1 ? 's' : ''} submitted
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={refresh}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>

                {queuedCount > 0 && (
                    <Card variant="bordered" className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text-primary">
                                {queuedCount} queued report{queuedCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-text-muted">
                                Waiting to sync
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowClearConfirm(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                loading={syncing}
                                onClick={sync}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Sync
                            </Button>
                        </div>
                    </Card>
                )}

                {showClearConfirm && (
                    <Card variant="danger">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-text-primary mb-2">
                                    Clear all queued reports?
                                </p>
                                <p className="text-sm text-text-secondary mb-4">
                                    This will permanently delete {queuedCount} unsent report{queuedCount !== 1 ? 's' : ''}.
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowClearConfirm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            clearQueue();
                                            setShowClearConfirm(false);
                                        }}
                                    >
                                        Clear Queue
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {reports.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-text-muted" />
                        </div>
                        <p className="text-text-muted mb-2">No reports yet</p>
                        <p className="text-sm text-text-muted">
                            Your submitted incident reports will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reports.map((report) => {
                            const hazard = getHazardById(report.hazardType);
                            if (!hazard) return null;
                            const Icon = hazard.icon;

                            return (
                                <Card key={report.id} padding="sm">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: hazard.bgColor }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: hazard.color }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-text-primary">
                                                    {hazard.name}
                                                </span>
                                                <ReportStatusBadge status={report.status} />
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(report.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {report.location.address ||
                                                        `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`
                                                    }
                                                </span>
                                            </div>

                                            {report.description && (
                                                <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                                                    {report.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`
                        text-xs font-medium px-2 py-0.5 rounded
                        ${report.severity >= 4 ? 'bg-danger/15 text-danger' :
                                                    report.severity === 3 ? 'bg-warning/15 text-warning' :
                                                        'bg-safe/15 text-safe'
                                                }
                      `}>
                                                Sev {report.severity}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
