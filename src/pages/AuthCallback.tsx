import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Loader2 } from 'lucide-react';

export function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUserFromToken } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const isNewUser = searchParams.get('isNewUser') === 'true';
            const errorMessage = searchParams.get('message');

            if (errorMessage) {
                setError(errorMessage);
                return;
            }

            try {
                await setUserFromToken();
                navigate(isNewUser ? '/onboarding' : '/home', { replace: true });
            } catch {
                setError('Failed to complete authentication');
            }
        };

        handleCallback();
    }, [searchParams, setUserFromToken, navigate]);

    if (error) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6">
                <div className="bg-danger/10 p-4 rounded-2xl mb-4">
                    <Shield className="w-12 h-12 text-danger" />
                </div>
                <h1 className="text-xl font-bold text-text-primary mb-2">Authentication Failed</h1>
                <p className="text-text-secondary text-center mb-6">{error}</p>
                <button
                    onClick={() => navigate('/login', { replace: true })}
                    className="px-6 py-3 bg-accent text-white rounded-xl font-medium"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
            <div className="bg-accent/10 p-4 rounded-2xl mb-4">
                <Shield className="w-12 h-12 text-accent" />
            </div>
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-text-secondary">Completing sign in...</p>
        </div>
    );
}
