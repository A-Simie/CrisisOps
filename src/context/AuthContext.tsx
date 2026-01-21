import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User, type LoginRequest, type RegisterRequest, type UpdateProfileRequest } from '../api/auth';
import { getAccessToken, clearAccessToken, setAccessToken, AUTH_EXPIRED_EVENT } from '../api/client';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    setUserFromToken: (token: string) => Promise<void>;
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

    const login = useCallback(async (email: string, password: string) => {
        const data: LoginRequest = { email, password };
        const response = await authApi.login(data);
        setUser(response.user);
    }, []);

    const signup = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
        const data: RegisterRequest = { email, password, firstName, lastName };
        const response = await authApi.register(data);
        setUser(response.user);
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
        } catch {
            clearAccessToken();
            throw new Error('Failed to fetch user data');
        }
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
