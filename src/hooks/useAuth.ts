import { useState, useCallback } from 'react';

const AUTH_KEY = 'crisisops_auth';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
}

function getStoredAuth(): AuthState {
    try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
            const user = JSON.parse(stored) as User;
            return { user, isLoggedIn: true };
        }
    } catch {
        // Ignore parse errors
    }
    return { user: null, isLoggedIn: false };
}

export function useAuth() {
    const [state, setState] = useState<AuthState>(getStoredAuth);

    const login = useCallback(async (email: string, _password: string, name?: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 800));

        const user: User = {
            id: crypto.randomUUID(),
            name: name || email.split('@')[0],
            email,
        };

        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        setState({ user, isLoggedIn: true });
        return true;
    }, []);

    const signup = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 1000));

        const user: User = {
            id: crypto.randomUUID(),
            name,
            email,
        };

        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        setState({ user, isLoggedIn: true });
        return true;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_KEY);
        setState({ user: null, isLoggedIn: false });
    }, []);

    const updateProfile = useCallback((updates: Partial<User>) => {
        if (state.user) {
            const updated = { ...state.user, ...updates };
            localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
            setState({ user: updated, isLoggedIn: true });
        }
    }, [state.user]);

    return {
        ...state,
        login,
        signup,
        logout,
        updateProfile,
    };
}

export function isLoggedIn(): boolean {
    return getStoredAuth().isLoggedIn;
}
