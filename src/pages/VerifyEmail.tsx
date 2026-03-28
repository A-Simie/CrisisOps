import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, verifyEmail, resendVerification } = useAuth();
    
    // Get email from location state or current user
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const isResetFlow = location.state?.type === 'reset';
    const targetEmail = location.state?.email || user?.email;

    useEffect(() => {
        if (targetEmail) {
            setEmail(targetEmail);
        } else if (!isResetFlow && !user) {
            navigate('/login');
        }
    }, [targetEmail, user, navigate, isResetFlow]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pasted = value.slice(0, 6).split('');
            const newOtp = [...otp];
            pasted.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            // Focus last filled or next empty
            const nextIndex = Math.min(index + pasted.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
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
                // For reset flow, we just verify the email+otp then move to reset screen
                // The actual verifyEmail API updates the DB for registration, 
                // but the walkthrough said: Step 2: Show OTP input screen. Step 3: reset-password.
                // So we just pass the OTP to the next screen.
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

    // Auto-submit when all 6 digits are filled
    useEffect(() => {
        if (otp.every(digit => digit !== '') && !loading && !success) {
            handleSubmit();
        }
    }, [otp]);

    return (
        <PageContainer>
            <div className="max-w-md mx-auto space-y-8 animate-slide-up pt-12">
                <div className="flex flex-col items-center text-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="self-start p-2 -ml-2 rounded-full hover:bg-bg-secondary transition-colors text-text-muted mb-4"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10 text-accent" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Verify your email
                    </h1>
                    <p className="text-text-secondary">
                        We've sent a 6-digit code to <br />
                        <span className="text-text-primary font-semibold">{email}</span>
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-bg-secondary border-2 border-transparent rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-text-primary"
                                />
                            ))}
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
                                <p className="text-sm font-medium">Verification successful!</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Button 
                                type="submit" 
                                fullWidth 
                                loading={loading}
                                disabled={loading || success || otp.some(d => !d)}
                                size="lg"
                            >
                                Verify Account
                            </Button>
                            
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={countdown > 0 || resendLoading}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors disabled:text-text-muted"
                                >
                                    {resendLoading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                                </button>
                            </div>
                        </div>
                    </form>
                </Card>

                <p className="text-center text-sm text-text-muted">
                    Didn't receive the code? Check your spam folder or try resending.
                </p>
            </div>
        </PageContainer>
    );
};
