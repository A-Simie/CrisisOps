import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn, verifyEmail, resendVerification } = useAuth();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const isResetFlow = location.state?.type === 'reset';
    const guestEmail = location.state?.email;
    const targetEmail = guestEmail || user?.email;

    const shouldHideChrome = !isLoggedIn || isResetFlow;

    useEffect(() => {
        if (targetEmail) {
            setEmail(targetEmail);
        } else if (!isResetFlow && !user) {
            navigate('/dashboard');
        }
    }, [targetEmail, user, navigate, isResetFlow]);

    useEffect(() => {
        if (user?.isEmailVerified && !isResetFlow) {
            navigate('/home');
        }
    }, [user?.isEmailVerified, navigate, isResetFlow]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        const lastChar = value.slice(-1);
        if (lastChar && !/[0-9]/.test(lastChar)) return;

        if (value.length > 1) {
            // Handle paste
            const pasted = value.slice(0, 6).split('').filter(c => /[0-9]/.test(c));
            const newOtp = [...otp];
            pasted.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + pasted.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) return;

        setLoading(true);
        setError(null);
        try {
            if (isResetFlow) {
                navigate('/reset-password', { state: { email, otp: code } });
            } else {
                await verifyEmail({ email, otp: code });
                setSuccess(true);
                setTimeout(() => navigate('/home'), 2000);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid verification code';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResendLoading(true);
        try {
            await resendVerification(email);
            setCountdown(60);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to resend code';
            setError(message);
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if (otp.every(digit => digit !== '') && !loading && !success) {
            handleSubmit();
        }
    }, [otp]);

    return (
        <PageContainer hideNav={shouldHideChrome} hideHeader={shouldHideChrome}>
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 animate-slide-up">
                <div className="w-full max-w-md space-y-10">
                    <div className="flex flex-col items-center text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="self-start p-2.5 -ml-2 rounded-2xl hover:bg-bg-secondary transition-all text-text-muted mb-6 border border-transparent hover:border-bg-tertiary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="w-24 h-24 bg-accent/15 rounded-[2.5rem] flex items-center justify-center mb-8 ring-8 ring-accent/5 animate-pulse-subtle">
                            <Shield className="w-12 h-12 text-accent" />
                        </div>

                        <h1 className="text-4xl font-black text-text-primary mb-4 tracking-tight">
                            Verify your email
                        </h1>
                        <p className="text-text-secondary text-lg leading-relaxed max-w-[280px]">
                            We've sent a 6-digit code to <br />
                            <span className="text-text-primary font-bold break-all">{email}</span>
                        </p>
                    </div>

                    <Card className="p-10 border-bg-tertiary shadow-2xl relative overflow-hidden">

                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="flex justify-between gap-3 sm:gap-4">
                                {otp.map((digit, index) => (
                                    <div key={index} className="relative group">
                                        <input
                                            ref={el => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`
                                                w-full h-16 sm:h-20 max-w-[3.5rem] sm:max-w-[4rem] text-center text-3xl font-black rounded-2xl outline-none transition-all ring-1 ring-gray-200
                                                ${digit
                                                    ? 'bg-accent/10 border-2 border-accent text-accent'
                                                    : 'bg-bg-secondary border-2 border-transparent text-text-primary group-hover:border-bg-tertiary focus:border-accent-light'
                                                }
                                                focus:ring-8 focus:ring-accent/10
                                            `}
                                        />
                                        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full transition-all duration-300 ${digit ? 'bg-accent h-1.5' : 'bg-transparent'}`} />
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger animate-shake">
                                    <div className="p-2 bg-danger/20 rounded-xl">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-safe/10 border border-safe/20 rounded-2xl flex items-center gap-3 text-safe animate-in zoom-in duration-300">
                                    <div className="p-2 bg-safe/20 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold">Verification successful!</p>
                                </div>
                            )}

                            <div className="space-y-6 pt-2">
                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={loading}
                                    disabled={loading || success || otp.some(d => !d)}
                                    size="lg"
                                    className="h-16 text-lg font-bold shadow-lg shadow-accent/20"
                                >
                                    Verify Account
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={countdown > 0 || resendLoading}
                                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold text-accent hover:bg-accent/10 transition-all disabled:text-text-muted disabled:hover:bg-transparent"
                                    >
                                        {resendLoading ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className={`w-4 h-4 ${countdown > 0 ? '' : 'animate-pulse'}`} />
                                        )}
                                        {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-text-muted px-8 leading-relaxed">
                        Didn't receive the code? Check your <span className="text-text-primary font-semibold">Spam folder</span> or try resending.
                    </p>
                </div>
            </div>
        </PageContainer>
    );
};
