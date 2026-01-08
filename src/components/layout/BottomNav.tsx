import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Plus, User } from 'lucide-react';

const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/survival', icon: BookOpen, label: 'Survival' },
    { to: '/report', icon: Plus, label: 'Report' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary/95 backdrop-blur-lg border-t border-bg-tertiary safe-area-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1
              w-16 h-full
              text-xs font-medium
              transition-colors
              ${isActive
                                ? 'text-accent'
                                : 'text-text-muted hover:text-text-secondary'
                            }
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`
                  p-1.5 rounded-xl transition-colors
                  ${isActive ? 'bg-accent/15' : ''}
                `}>
                                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
