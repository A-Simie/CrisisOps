import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Shield, ChevronRight, ArrowLeft, Bell, Lock, User, Eye, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Settings = () => {
    const navigate = useNavigate();
    const { user, isEmailVerified } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <PageContainer>
            <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/profile')}
                        className="p-2 rounded-xl hover:bg-bg-secondary transition-colors text-text-muted"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                </div>

                <div className="space-y-6">
                    {/* Account Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Account</h2>
                        <Card className="divide-y divide-bg-tertiary">
                            {!user?.isEmailVerified && (
                                <button
                                    onClick={() => navigate('/settings/verify-email')}
                                    className="w-full flex items-center justify-between p-5 hover:bg-accent/5 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                                            <Shield className="w-5 h-5 text-accent" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-text-primary font-bold">Verify Email Address</span>
                                            <span className="block text-xs text-text-muted mt-0.5">Protect your account and enable reporting</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-warning/10 text-warning rounded-md">Required</span>
                                        <ChevronRight className="w-5 h-5 text-text-muted" />
                                    </div>
                                </button>
                            )}

                            <div className="w-full flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-bg-secondary rounded-xl">
                                        <User className="w-5 h-5 text-text-muted" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-text-primary font-bold">Profile Information</span>
                                        <span className="block text-xs text-text-muted mt-0.5">{user?.name} • {user?.email}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-muted" />
                            </div>
                        </Card>
                    </section>

                    {/* Preferences Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Preferences</h2>
                        <Card className="divide-y divide-bg-tertiary">
                            <div className="w-full flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-bg-secondary rounded-xl">
                                        {isDark ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-warning" />}
                                    </div>
                                    <div>
                                        <span className="block text-text-primary font-bold">Dark Mode</span>
                                        <span className="block text-xs text-text-muted mt-0.5">Toggle app theme</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`
                                        w-12 h-7 rounded-full transition-colors flex items-center px-1
                                        ${isDark ? 'bg-accent' : 'bg-bg-tertiary'}
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 rounded-full bg-white shadow-lg transition-transform
                                        ${isDark ? 'translate-x-5' : 'translate-x-0'}
                                    `} />
                                </button>
                            </div>

                            <button className="w-full flex items-center justify-between p-5 hover:bg-bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-bg-secondary rounded-xl">
                                        <Bell className="w-5 h-5 text-text-muted" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-text-primary font-bold">Notifications</span>
                                        <span className="block text-xs text-text-muted mt-0.5">Manage alerts and updates</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-muted" />
                            </button>
                        </Card>
                    </section>

                    {/* Security Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Security</h2>
                        <Card>
                            <button 
                                onClick={() => navigate('/security')}
                                className="w-full flex items-center justify-between p-5 hover:bg-bg-secondary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-bg-secondary rounded-xl">
                                        <Lock className="w-5 h-5 text-text-muted" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-text-primary font-bold">Privacy & Security</span>
                                        <span className="block text-xs text-text-muted mt-0.5">Password and session management</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-muted" />
                            </button>
                        </Card>
                    </section>
                </div>
            </div>
        </PageContainer>
    );
};
