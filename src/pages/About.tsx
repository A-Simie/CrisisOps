import { useNavigate } from 'react-router-dom';
import { PageContainer, Card } from '../components';
import { ArrowLeft, Shield, Target, Award, HeartHandshake } from 'lucide-react';

export function About() {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <div className="space-y-8 pb-12">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Profile</span>
                </button>

                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-accent/15 rounded-3xl flex items-center justify-center mx-auto ring-4 ring-bg-secondary">
                        <Shield className="w-10 h-10 text-accent" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">About CrisisOps</h1>
                    <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
                        Empowering Rapid Response in Every Crisis
                    </p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <Card padding="lg" className="border-l-4 border-accent bg-bg-secondary/50">
                        <p className="text-lg text-text-primary leading-relaxed italic">
                            "CrisisOps is a unified emergency intelligence platform designed to bridge the gap between citizens, first responders, and relief organizations. In the moments that matter most, information is the most valuable resource."
                        </p>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-accent font-semibold text-lg">
                                <Target className="w-6 h-6" />
                                <h2>Our Mission</h2>
                            </div>
                            <p className="text-text-secondary leading-relaxed">
                                To democratize emergency response tools and provide every individual with the intelligence needed to survive and assist during disasters. We believe that technology should be at its most robust when the environment is at its most fragile.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-safe font-semibold text-lg">
                                <HeartHandshake className="w-6 h-6" />
                                <h2>Our Vision</h2>
                            </div>
                            <p className="text-text-secondary leading-relaxed">
                                A world where cellular outages or natural disasters don't mean isolation. Through offline-first technology, localized survival guides, and seamless reporting, we're building a more resilient global community.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-bg-tertiary">
                        <div className="flex items-center gap-3 text-warning font-semibold text-lg mb-4">
                            <Award className="w-6 h-6" />
                            <h2>Core Values</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="p-4 bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-sm">
                                <h3 className="font-bold text-text-primary mb-1">Resilience</h3>
                                <p className="text-sm text-text-muted">Built for the edge, ensuring critical data is available regardless of connectivity.</p>
                            </div>
                            <div className="p-4 bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-sm">
                                <h3 className="font-bold text-text-primary mb-1">Actionability</h3>
                                <p className="text-sm text-text-muted">Not just information, but guided, step-by-step protocols for survival.</p>
                            </div>
                            <div className="p-4 bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-sm">
                                <h3 className="font-bold text-text-primary mb-1">Transparency</h3>
                                <p className="text-sm text-text-muted">Establishing clear lines of communication between reporting citizens and authorities.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-bg-tertiary">
                    <p className="text-sm text-text-muted">CrisisOps v1.0.0</p>
                    <p className="text-xs text-text-muted mt-1 opacity-75">Developed for Public Safety & Resilience</p>
                </div>
            </div>
        </PageContainer>
    );
}
