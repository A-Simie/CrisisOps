import { StatusChip } from '../ui/StatusChip';
import { Shield, User } from 'lucide-react';
import { useReportQueue } from '../../hooks/useReportQueue';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function TopStatusBar() {
    const navigate = useNavigate();
    const { queuedCount, lastSyncTime, lastSyncSummary, syncing, sync } = useReportQueue();
    const { user, isLoggedIn } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-lg border-b border-bg-tertiary safe-area-top">
            <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-semibold text-text-primary">CrisisOps</span>
                </div>

                <div className="flex items-center gap-3">
                    <StatusChip
                        lastSync={lastSyncTime}
                        queuedCount={queuedCount}
                        lastSyncSummary={lastSyncSummary}
                        syncing={syncing}
                        onSyncClick={sync}
                    />

                    {isLoggedIn && (
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-bg-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                                <User className="w-4 h-4 text-accent" />
                            </div>
                            {user?.name && (
                                <span className="text-sm font-medium text-text-primary max-w-[80px] truncate hidden sm:block">
                                    {user.name.split(' ')[0]}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
