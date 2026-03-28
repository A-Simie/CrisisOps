import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User, type LoginRequest, type RegisterRequest, type UpdateProfileRequest, type VerifyEmailRequest, type ForgotPasswordRequest, type ResetPasswordRequest } from '../api/auth';
import { getAccessToken, clearAccessToken, setAccessToken, AUTH_EXPIRED_EVENT, VERIFICATION_REQUIRED_EVENT } from '../api/client';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    setUserFromToken: (token: string) => Promise<void>;
    verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authApi.getMe();
            setUser(userData);
        } catch {
            clearAccessToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Listen for auth expiration events and auto-logout
    useEffect(() => {
        const handleAuthExpired = () => {
            console.warn('Session expired, logging out...');
            clearAccessToken();
            setUser(null);
        };

        window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        return () => {
            window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        };
    }, []);

    // Listen for verification required events
    useEffect(() => {
        const handleVerificationRequired = () => {
            console.warn('Email verification required for this action');
            // We can add global modal or toast here if needed
        };

        window.addEventListener(VERIFICATION_REQUIRED_EVENT, handleVerificationRequired);
        return () => {
            window.removeEventListener(VERIFICATION_REQUIRED_EVENT, handleVerificationRequired);
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data: LoginRequest = { email, password };
        const response = await authApi.login(data);
        setUser(response.user);
    }, []);

    const signup = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
        const data: RegisterRequest = { email, password, firstName, lastName };
        await authApi.register(data);
    }, []);

    const logout = useCallback(async () => {
        await authApi.logout();
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
        const updatedUser = await authApi.updateProfile(data);
        setUser(updatedUser);
    }, []);

    const setUserFromToken = useCallback(async (token: string) => {
        setAccessToken(token);
        try {
            const userData = await authApi.getMe();
            setUser(userData);
        } catch (err) {
            clearAccessToken();
            const message = err instanceof Error ? err.message : 'Failed to fetch user data';
            throw new Error(message);
        }
    }, []);

    const verifyEmail = useCallback(async (data: VerifyEmailRequest) => {
        await authApi.verifyEmail(data);
        // Refresh user data after verification
        const userData = await authApi.getMe();
        setUser(userData);
    }, []);

    const resendVerification = useCallback(async (email: string) => {
        await authApi.resendVerification(email);
    }, []);

    const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
        await authApi.forgotPassword(data);
    }, []);

    const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
        await authApi.resetPassword(data);
    }, []);

    const value: AuthContextType = {
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        setUserFromToken,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
