import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();
    
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await forgotPassword({ email });
            setSuccess(true);
            // Wait a moment for the user to see success before navigating
            setTimeout(() => {
                navigate('/verify-email', { state: { email, type: 'reset' } });
            }, 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <div className="max-w-md mx-auto space-y-8 animate-slide-up pt-12">
                <div className="flex flex-col items-center text-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="self-start p-2 -ml-2 rounded-full hover:bg-bg-secondary transition-colors text-text-muted mb-4"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-accent" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-text-secondary leading-relaxed">
                        Enter your email address and we'll send you a <br />
                        6-digit code to reset your password.
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-text-muted" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-bg-secondary border-2 border-transparent rounded-2xl text-text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-3 text-success animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">OTP sent successfully!</p>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            disabled={loading || success || !email}
                            size="lg"
                        >
                            Request Reset Code
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-text-muted">
                    Remember your password?{' '}
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-accent font-semibold hover:underline"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </PageContainer>
    );
};

// Supporting Icons
const Lock = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
