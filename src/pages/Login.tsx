import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        window.location.href = authApi.getGoogleAuthUrl();
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <div className="flex-1 flex flex-col justify-center px-6 py-12">
                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-accent/20 p-2 rounded-xl">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>
                        <span className="text-2xl font-bold text-text-primary">CrisisOps</span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
                    <p className="text-text-secondary text-center">
                        Sign in to continue to CrisisOps
                    </p>
                </div>

                <div className="max-w-sm mx-auto w-full space-y-6">
                    <button
                        onClick={handleGoogleLogin}
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
                                    placeholder="Enter your password"
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
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-sm text-accent hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <Button type="submit" fullWidth size="lg" loading={loading} disabled={googleLoading}>
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </form>
                </div>

                <p className="text-center text-text-secondary mt-8">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-accent font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="px-6 pb-8 pt-4">
                <p className="text-xs text-text-muted text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
