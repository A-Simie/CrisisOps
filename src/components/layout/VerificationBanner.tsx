import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const VerificationBanner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useAuth();

    // Don't show if not logged in or already verified
    if (!isLoggedIn || !user || user.isEmailVerified) {
        return null;
    }

    // Don't show on the verification page itself
    if (location.pathname === '/settings/verify-email') {
        return null;
    }

    return (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-3 animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-warning/20 p-1.5 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-warning" />
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                        <span className="hidden sm:inline-block">Unverified Account:</span> You cannot report incidents until verified.
                    </p>
                </div>
                
                <button
                    onClick={() => navigate('/settings/verify-email', { state: { email: user.email } })}
                    className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider hover:text-accent-light transition-colors"
                >
                    Verify Now
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};
