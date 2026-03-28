import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Button, Card } from '../components';
import { useAuth, isLoggedIn as checkIsLoggedIn } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
    User,
    Moon,
    Sun,
    ClipboardList,
    Settings,
    HelpCircle,
    Shield,
    LogOut,
    ChevronRight,
    Bell,
    Lock
} from 'lucide-react';

export function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const loggedIn = checkIsLoggedIn();
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login', { replace: true });
        }
    }, [loggedIn, navigate]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } finally {
            navigate('/login');
        }
    };

    if (!loggedIn) {
        return null;
    }

    const userName = user?.name || 'User';
    const userEmail = user?.email || '';

    return (
        <PageContainer>
            <div className="space-y-6">
                <div className="flex flex-col items-center text-center py-6">
                    <div className="w-24 h-24 rounded-full bg-accent/15 flex items-center justify-center mb-4 ring-4 ring-bg-tertiary">
                        <User className="w-12 h-12 text-accent" />
                    </div>
                    <h1 className="text-xl font-bold text-text-primary">{userName}</h1>
                    <p className="text-text-muted">{userEmail}</p>
                </div>

                <Card>
                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <Moon className="w-5 h-5 text-accent" />
                            ) : (
                                <Sun className="w-5 h-5 text-warning" />
                            )}
                            <span className="text-text-primary font-medium">Dark Mode</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`
                                w-12 h-7 rounded-full transition-colors flex items-center px-1
                                ${isDark ? 'bg-accent' : 'bg-bg-tertiary'}
                            `}
                        >
                            <div className={`
                                w-5 h-5 rounded-full bg-white shadow transition-transform
                                ${isDark ? 'translate-x-5' : 'translate-x-0'}
                            `} />
                        </button>
                    </div>
                </Card>

                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/my-reports')}
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">My Reports</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>

                    <button
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">Notifications</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>

                    <button
                        onClick={() => navigate('/security')}
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">Privacy & Security</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>

                    <button
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">Settings</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                <div className="space-y-2">
                    <button
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">Help & Support</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>

                    <button
                        onClick={() => navigate('/about')}
                        className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-text-muted" />
                            <span className="text-text-primary font-medium">About CrisisOps</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                <Button
                    variant="danger"
                    fullWidth
                    onClick={handleLogout}
                    loading={loggingOut}
                    disabled={loggingOut}
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </Button>

                <p className="text-xs text-text-muted text-center pt-4">
                    CrisisOps v1.0.0
                </p>
            </div>
        </PageContainer>
    );
}
