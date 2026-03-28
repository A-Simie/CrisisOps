import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Button, Card } from '../components';
import { getHazardById, getSurvivalGuide } from '../lib/hazards';
import { ArrowLeft, CheckCircle2, XCircle, MessageSquare, Download, Check, Square, CheckSquare, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveSurvivalGuide, getSurvivalGuide as getStoredGuide, deleteSurvivalGuide } from '../lib/db';

export function SurvivalDetail() {
    const { hazardId } = useParams<{ hazardId: string }>();
    const navigate = useNavigate();
    const [savedOffline, setSavedOffline] = useState(false);
    const [saving, setSaving] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [showCompletionPopup, setShowCompletionPopup] = useState(false);

    const hazard = hazardId ? getHazardById(hazardId) : undefined;
    const guide = hazardId ? getSurvivalGuide(hazardId) : undefined;

    useEffect(() => {
        async function checkSaved() {
            if (hazardId) {
                const stored = await getStoredGuide(hazardId);
                setSavedOffline(!!stored);
            }
        }
        checkSaved();
    }, [hazardId]);

    useEffect(() => {
        if (showCompletionPopup) {
            const timer = setTimeout(() => {
                setShowCompletionPopup(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showCompletionPopup]);

    if (!hazard || !guide) {
        return (
            <PageContainer>
                <div className="text-center py-12">
                    <p className="text-text-muted">Hazard not found</p>
                    <Button variant="ghost" onClick={() => navigate('/survival')} className="mt-4">
                        Back to Library
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const Icon = hazard.icon;

    const toggleStep = (index: number) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
                // Check if all steps are now completed
                if (guide && next.size === guide.doNow.length) {
                    setShowCompletionPopup(true);
                }
            }
            return next;
        });
    };

    const handleSaveOffline = async () => {
        setSaving(true);
        try {
            if (savedOffline) {
                await deleteSurvivalGuide(hazardId!);
                setSavedOffline(false);
            } else {
                await saveSurvivalGuide({
                    id: hazardId!,
                    hazardType: hazardId!,
                    savedAt: Date.now(),
                    doNow: guide.doNow,
                    doNot: guide.doNot,
                    emergencyScript: guide.emergencyScript,
                });
                setSavedOffline(true);
            }
        } catch (error) {
            console.error('Failed to save guide:', error);
        }
        setSaving(false);
    };

    return (
        <PageContainer>
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/survival')}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Library</span>
                </button>

                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: hazard.bgColor }}
                    >
                        <Icon className="w-8 h-8" style={{ color: hazard.color }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">{hazard.name}</h1>
                        <p className="text-text-secondary">{hazard.description}</p>
                    </div>
                </div>

                <Button
                    variant={savedOffline ? 'secondary' : 'outline'}
                    fullWidth
                    loading={saving}
                    onClick={handleSaveOffline}
                >
                    {savedOffline ? (
                        <>
                            <Check className="w-5 h-5 text-safe" />
                            Saved Offline
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Save for Offline
                        </>
                    )}
                </Button>

                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-safe" />
                        <h2 className="text-lg font-semibold text-text-primary">Do Now</h2>
                    </div>
                    <div className="space-y-2">
                        {guide.doNow.map((step, index) => (
                            <button
                                key={index}
                                onClick={() => toggleStep(index)}
                                className={`
                  w-full flex items-start gap-4 p-4 rounded-xl text-left
                  transition-all duration-200 border
                  ${completedSteps.has(index)
                                        ? 'bg-safe/5 border-safe/20 text-text-muted'
                                        : 'bg-bg-tertiary/30 border-bg-tertiary/50 hover:bg-bg-tertiary hover:border-accent/30'
                                    }
                `}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {completedSteps.has(index) ? (
                                        <CheckSquare className="w-6 h-6 text-safe animate-in zoom-in-50 duration-300" />
                                    ) : (
                                        <Square className="w-6 h-6 text-text-muted" />
                                    )}
                                </div>
                                <span className={`text-[15px] leading-snug ${completedSteps.has(index) ? 'line-through opacity-70' : 'text-text-primary'}`}>
                                    {step}
                                </span>
                            </button>
                        ))}
                    </div>

                    {showCompletionPopup && (
                        <div className="fixed inset-x-4 bottom-24 z-50 animate-in slide-in-from-bottom-8 duration-500">
                            <Card className="bg-safe text-white border-none shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20">
                                    <ShieldCheck className="w-24 h-24 -mr-8 -mt-8" />
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">Well Done!</h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            You've completed all the immediate steps. However, please <span className="font-bold underline">stay on guard</span>—you are still at an accident scene. Remain vigilant and follow official instructions.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setShowCompletionPopup(false)}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </Card>
                        </div>
                    )}
                </Card>

                <Card variant="danger">
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-danger" />
                        <h2 className="text-lg font-semibold text-danger-light">Do Not</h2>
                    </div>
                    <ul className="space-y-2">
                        {guide.doNot.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                                <span className="text-danger mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-info" />
                        <h2 className="text-lg font-semibold text-text-primary">Emergency Script</h2>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed italic">
                        "{guide.emergencyScript}"
                    </p>
                    <p className="text-xs text-text-muted mt-3">
                        Fill in the [BRACKETS] with your specific details
                    </p>
                </Card>
            </div>
        </PageContainer>
    );
}
