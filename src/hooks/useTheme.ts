import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'crisisops_theme';

type Theme = 'dark' | 'light';

function getStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    } catch {
        // Ignore
    }
    return 'dark';
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
    } else {
        root.classList.remove('light');
        root.classList.add('dark');
    }
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            return next;
        });
    }, []);

    const setThemeValue = useCallback((value: Theme) => {
        localStorage.setItem(THEME_KEY, value);
        setTheme(value);
    }, []);

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme: setThemeValue,
    };
}
