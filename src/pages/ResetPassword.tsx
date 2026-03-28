import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();
    
    // Auth context or passed data
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    
    // Form state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const state = location.state as { email: string; otp: string } | null;
        if (!state?.email || !state?.otp) {
            navigate('/forgot-password');
            return;
        }
        setEmail(state.email);
        setOtp(state.otp);
    }, [location.state, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ email, otp, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        return score;
    };

    const strength = passwordStrength(password);

    return (
        <PageContainer>
            <div className="max-w-md mx-auto space-y-8 animate-slide-up pt-12">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-accent" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Set New Password
                    </h1>
                    <p className="text-text-secondary">
                        Create a strong and secure password <br />
                        for your account <span className="text-text-primary font-semibold">{email}</span>
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-text-muted" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-4 bg-bg-secondary border-2 border-transparent rounded-2xl text-text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Strength Indicator */}
                            {password && (
                                <div className="mt-2 px-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Strength</span>
                                        <span className={`text-[10px] font-bold ${
                                            strength <= 25 ? 'text-danger' : 
                                            strength <= 50 ? 'text-warning' : 
                                            strength <= 75 ? 'text-accent' : 'text-success'
                                        }`}>
                                            {strength <= 25 ? 'Weak' : 
                                             strength <= 50 ? 'Fair' : 
                                             strength <= 75 ? 'Good' : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ${
                                                strength <= 25 ? 'bg-danger' : 
                                                strength <= 50 ? 'bg-warning' : 
                                                strength <= 75 ? 'bg-accent' : 'bg-success'
                                            }`}
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-text-muted" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-bg-secondary border-2 border-transparent rounded-2xl text-text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm"
                                    placeholder="••••••••"
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
                                <p className="text-sm font-medium">Password reset successfully!</p>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            disabled={loading || success || !password || !confirmPassword}
                            size="lg"
                        >
                            Reset Password
                        </Button>
                    </form>
                </Card>

                <div className="px-4 py-4 space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary">Password Requirements:</h3>
                    <ul className="space-y-2">
                        {[
                            'At least 8 characters long',
                            'Include at least one uppercase letter',
                            'Include at least one number',
                            'Include at least one special character'
                        ].map((req, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </PageContainer>
    );
};
