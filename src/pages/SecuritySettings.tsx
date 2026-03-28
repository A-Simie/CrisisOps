import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { Shield, Lock, CheckCircle2, AlertCircle, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export const SecuritySettings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const hasPassword = user?.hasPassword ?? true; // Default to true if unknown

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            if (hasPassword) {
                await authApi.changePassword({ currentPassword, newPassword });
            } else {
                await authApi.setPassword({ password: newPassword });
            }
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update password';
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

    const strength = passwordStrength(newPassword);

    return (
        <PageContainer>
            <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-4 mb-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-bg-secondary transition-colors text-text-muted"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Privacy & Security</h1>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-accent/5 rounded-3xl border border-accent/10 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">
                        {hasPassword ? 'Change your password' : 'Set your password'}
                    </h2>
                    <p className="text-sm text-text-muted text-center mt-1">
                        {hasPassword 
                            ? 'Update your account security by choosing a strong new password.' 
                            : 'Since you signed up with social media, you can set a local password to log in directly.'}
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {hasPassword && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary ml-1">Current Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-text-muted" />
                                    </div>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border-0 rounded-2xl text-text-primary focus:ring-2 focus:ring-accent transition-all text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
                                    >
                                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-text-muted" />
                                </div>
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border-0 rounded-2xl text-text-primary focus:ring-2 focus:ring-accent transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            
                            {/* Strength Indicator */}
                            {newPassword && (
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

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary ml-1">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-text-muted" />
                                </div>
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border-0 rounded-2xl text-text-primary focus:ring-2 focus:ring-accent transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-xs font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-3 text-success animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <p className="text-xs font-medium">Password updated successfully!</p>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            disabled={loading || !newPassword || !confirmPassword || (hasPassword && !currentPassword)}
                            className="mt-6"
                        >
                            {hasPassword ? 'Update Password' : 'Set Password'}
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
