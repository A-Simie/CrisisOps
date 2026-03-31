import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { hasCompletedOnboarding } from './Onboarding';
import { useAuth } from '../hooks/useAuth';

export function Splash() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');

    useEffect(() => {
        const loadingMessages = [
            'Initializing...',
            'Loading survival guides...',
            'Checking offline cache...',
            'Establishing secure connection...',
            'Ready to go!',
        ];

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    if (!isLoggedIn) {
                        navigate('/login', { replace: true });
                    } else if (!hasCompletedOnboarding()) {
                        navigate('/onboarding', { replace: true });
                    } else {
                        navigate('/home', { replace: true });
                    }
                }, 500);
            }
            setProgress(Math.min(currentProgress, 100));

            const messageIndex = Math.min(
                Math.floor(currentProgress / 25),
                loadingMessages.length - 1
            );
            setLoadingText(loadingMessages[messageIndex]);
        }, 400);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-bg-primary">
            <div
                className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-info/15 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-grow flex-col items-center justify-center px-6 pt-20">
                <div className="mb-10 flex relative group animate-fade-in">
                    <div className="absolute -inset-4 rounded-full bg-accent/20 blur-xl animate-pulse-soft" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-bg-secondary shadow-2xl shadow-accent/10 ring-1 ring-white/10">
                        <Shield className="w-14 h-14 text-accent animate-pulse-soft" />
                    </div>
                </div>

                <h1
                    className="text-text-primary tracking-tight text-4xl font-bold leading-tight text-center mb-3 animate-slide-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    CrisisOps
                </h1>

                <div
                    className="flex flex-col items-center gap-1 animate-slide-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    <p className="text-text-secondary text-lg font-normal leading-normal text-center">
                        Coordination. Response. Survival.
                    </p>
                    <p className="text-accent font-medium text-xs mt-1 tracking-widest uppercase">
                        Saving Lives
                    </p>
                </div>
            </div>

            <div
                className="relative z-10 w-full px-8 pb-12 pt-6 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
            >
                <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <div className="flex justify-between items-end">
                        <p className="text-text-muted text-sm font-medium leading-normal transition-all duration-300">
                            {loadingText}
                        </p>
                        <p className="text-accent text-xs font-bold font-mono">
                            {Math.round(progress)}%
                        </p>
                    </div>

                    <div className="rounded-full bg-bg-tertiary h-1.5 w-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-accent shadow-[0_0_10px_rgba(99,102,241,0.6)] transition-all duration-200 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-text-muted/50 text-xs font-normal leading-normal text-center mt-4 font-mono">
                        v1.0.0 • Release Candidate
                    </p>
                </div>
            </div>
        </div>
    );
}
