import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components';

export function AuthError() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || 'An authentication error occurred';

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
                <div className="bg-danger/10 p-4 rounded-2xl mb-6">
                    <Shield className="w-12 h-12 text-danger" />
                </div>
                
                <h1 className="text-2xl font-bold text-text-primary mb-4">Authentication Issue</h1>
                
                <div className="flex items-start gap-3 bg-danger/5 p-4 rounded-xl text-left mb-8 w-full border border-danger/10">
                    <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-text-primary leading-relaxed">
                        {message}
                    </p>
                </div>
                
                <p className="text-text-secondary text-sm mb-8">
                    Please try again or contact support if the problem persists. If you don't have an account yet, you'll need to sign up first.
                </p>

                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={() => navigate('/login')}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sign In
                </Button>
            </div>
            
            <p className="mt-8 text-xs text-text-muted text-center uppercase tracking-widest font-medium">
                CrisisOps Security Gateway
            </p>
        </div>
    );
}
