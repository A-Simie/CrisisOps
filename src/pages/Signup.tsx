import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components';
import { Shield, Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

interface PasswordRequirement {
    label: string;
    met: boolean;
}

function usePasswordStrength(password: string) {
    return useMemo(() => {
        const requirements: PasswordRequirement[] = [
            { label: 'At least 12 characters', met: password.length >= 12 },
            { label: 'One lowercase letter', met: /[a-z]/.test(password) },
            { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
            { label: 'One number', met: /\d/.test(password) },
            { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        ];

        const metCount = requirements.filter(r => r.met).length;
        const strength = metCount === 0 ? 0 : metCount <= 2 ? 1 : metCount <= 4 ? 2 : 3;
        const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength];
        const strengthColor = ['', 'bg-danger', 'bg-warning', 'bg-safe'][strength];
        const isValid = requirements.every(r => r.met);

        return { requirements, strength, strengthLabel, strengthColor, isValid };
    }, [password]);
}

export function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const passwordStrength = usePasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!passwordStrength.isValid) {
            setError('Password does not meet all requirements');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await signup(name, email, password);
            navigate('/onboarding');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
            setError(message);
        }
        setLoading(false);
    };

    const handleGoogleSignup = () => {
        setGoogleLoading(true);
        window.location.href = authApi.getGoogleAuthUrl();
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <div className="flex-1 flex flex-col justify-center px-6 py-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-accent/20 p-2 rounded-xl">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>
                        <span className="text-2xl font-bold text-text-primary">CrisisOps</span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Create account</h1>
                    <p className="text-text-secondary text-center">
                        Join CrisisOps to stay prepared
                    </p>
                </div>

                <div className="max-w-sm mx-auto w-full space-y-5">
                    <button
                        onClick={handleGoogleSignup}
                        disabled={googleLoading || loading}
                        className="w-full h-14 flex items-center justify-center gap-3 bg-white rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                            <>
                                <GoogleIcon />
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 border-t border-bg-tertiary" />
                        <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
                        <div className="flex-1 border-t border-bg-tertiary" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full h-14 pl-12 pr-4 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-muted border border-bg-tertiary focus:border-accent focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full h-14 pl-12 pr-4 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-muted border border-bg-tertiary focus:border-accent focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    className="w-full h-14 pl-12 pr-12 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-muted border border-bg-tertiary focus:border-accent focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {password && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                        ? passwordStrength.strengthColor
                                                        : 'bg-bg-tertiary'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {passwordStrength.strengthLabel && (
                                            <span className={`text-xs font-medium ${passwordStrength.strength === 1 ? 'text-danger' :
                                                passwordStrength.strength === 2 ? 'text-warning' : 'text-safe'
                                                }`}>
                                                {passwordStrength.strengthLabel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-1.5">
                                        {passwordStrength.requirements.map((req, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                {req.met ? (
                                                    <Check className="w-3.5 h-3.5 text-safe" />
                                                ) : (
                                                    <X className="w-3.5 h-3.5 text-text-muted" />
                                                )}
                                                <span className={`text-xs ${req.met ? 'text-safe' : 'text-text-muted'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className={`w-full h-14 pl-12 pr-12 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-muted border focus:outline-none transition-colors ${confirmPassword && confirmPassword !== password
                                        ? 'border-danger focus:border-danger'
                                        : confirmPassword && confirmPassword === password
                                            ? 'border-safe focus:border-safe'
                                            : 'border-bg-tertiary focus:border-accent'
                                        }`}
                                />
                                {confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {confirmPassword === password ? (
                                            <Check className="w-5 h-5 text-safe" />
                                        ) : (
                                            <X className="w-5 h-5 text-danger" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer py-2">
                            <div
                                onClick={() => setAgreeTerms(!agreeTerms)}
                                className={`
                                    w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors mt-0.5
                                    ${agreeTerms
                                        ? 'bg-accent border-accent'
                                        : 'bg-bg-secondary border-bg-tertiary'
                                    }
                                `}
                            >
                                {agreeTerms && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-text-secondary">
                                I agree to the Terms of Service and Privacy Policy
                            </span>
                        </label>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            disabled={googleLoading || !passwordStrength.isValid}
                        >
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </form>
                </div>

                <p className="text-center text-text-secondary mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
