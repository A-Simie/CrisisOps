import type { ReactNode } from 'react';
import { TopStatusBar } from './TopStatusBar';
import { BottomNav } from './BottomNav';

interface PageContainerProps {
    children: ReactNode;
    hideNav?: boolean;
    hideHeader?: boolean;
    className?: string;
}

export function PageContainer({
    children,
    hideNav = false,
    hideHeader = false,
    className = ''
}: PageContainerProps) {
    return (
        <div className="min-h-screen flex flex-col bg-bg-primary">
            {!hideHeader && <TopStatusBar />}

            <main
                className={`
          flex-1 
          ${!hideNav ? 'pb-20' : ''} 
          ${className}
        `}
            >
                <div className="max-w-lg mx-auto px-4 py-4">
                    {children}
                </div>
            </main>

            {!hideNav && <BottomNav />}
        </div>
    );
}
