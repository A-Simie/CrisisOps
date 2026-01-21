import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Button, Card, HazardGrid } from '../components';
import { HAZARD_TYPES, type HazardType } from '../lib/hazards';
import { useLocation } from '../hooks/useLocation';
import { useReportQueue } from '../hooks/useReportQueue';
import { api } from '../lib/api';
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    MapPin,
    Check,
    AlertCircle,
    Edit3,
    X,
    Loader2,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

type Step = 'hazard' | 'severity' | 'media' | 'location' | 'details' | 'confirm';

const STEPS: Step[] = ['hazard', 'severity', 'media', 'location', 'details', 'confirm'];

const SEVERITY_LABELS = [
    'Minor - No immediate danger',
    'Low - Minimal impact',
    'Moderate - Some danger',
    'High - Significant danger',
    'Critical - Life-threatening',
];

export function Report() {
    const navigate = useNavigate();
    const { lat, lng, address, requestLocation, loading: locationLoading } = useLocation();
    const { submitReport, sync } = useReportQueue();

    const [currentStep, setCurrentStep] = useState<Step>('hazard');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reportSent, setReportSent] = useState(false);
    const [reportId, setReportId] = useState<string | null>(null);

    const isOnline = useOnlineStatus();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedHazard, setSelectedHazard] = useState<HazardType | null>(null);
    const [severity, setSeverity] = useState(3);
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    const [mediaFiles, setMediaFiles] = useState<{ url: string; preview: string; type: 'IMAGE' | 'VIDEO' }[]>([]);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [manualAddress, setManualAddress] = useState('');

    const stepIndex = STEPS.indexOf(currentStep);
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === STEPS.length - 1;

    const hasLocation = (lat !== null && lng !== null) || manualAddress.trim().length > 0;

    const canProceed = () => {
        switch (currentStep) {
            case 'hazard': return selectedHazard !== null;
            case 'severity': return true;
            case 'media': return true;
            case 'location': return hasLocation;
            case 'details': return true;
            case 'confirm': return true;
            default: return false;
        }
    };

    const goNext = () => {
        if (!canProceed()) return;
        const nextIndex = stepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex]);
        }
    };

    const goBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedHazard || !hasLocation) return;

        setSubmitting(true);
        try {
            const finalAddress = address || manualAddress || undefined;
            const report = await submitReport({
                hazardType: selectedHazard.id,
                severity,
                location: { lat: lat || 0, lng: lng || 0, address: finalAddress },
                description: description || undefined,
                contact: contact || undefined,
                mediaUrls: mediaFiles.map(m => m.url),
            });
            setReportId(report.id);

            if (isOnline) {
                const syncResult = await sync();
                setReportSent(syncResult.success && syncResult.synced > 0);
            } else {
                setReportSent(false);
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit report:', error);
        }
        setSubmitting(false);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');

        if (isOnline) {
            setUploadingMedia(true);
            try {
                const result = await api.uploadIncidentMedia(file);
                setMediaFiles(prev => [...prev, {
                    url: result.url,
                    preview,
                    type: result.type
                }]);
            } catch (error) {
                console.error('Failed to upload media:', error);
                setMediaFiles(prev => [...prev, {
                    url: preview,
                    preview,
                    type: isVideo ? 'VIDEO' : 'IMAGE'
                }]);
            }
            setUploadingMedia(false);
        } else {
            setMediaFiles(prev => [...prev, {
                url: preview,
                preview,
                type: isVideo ? 'VIDEO' : 'IMAGE'
            }]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (submitted) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${reportSent ? 'bg-safe/15' : 'bg-warning/15'}`}>
                        <Check className={`w-10 h-10 ${reportSent ? 'text-safe' : 'text-warning'}`} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {reportSent ? 'Report Sent' : 'Report Queued'}
                    </h1>
                    <p className="text-text-secondary mb-2">
                        {reportSent
                            ? 'Your report has been submitted to emergency services'
                            : 'Your report has been saved locally and will sync when online'
                        }
                    </p>
                    <p className="text-sm text-text-muted mb-8">
                        ID: {reportId?.slice(0, 8)}...
                    </p>

                    <div className="space-y-3 w-full max-w-xs">
                        <Button fullWidth onClick={() => navigate('/my-reports')}>
                            View My Reports
                        </Button>
                        <Button variant="outline" fullWidth onClick={() => {
                            setSubmitted(false);
                            setReportSent(false);
                            setSelectedHazard(null);
                            setSeverity(3);
                            setDescription('');
                            setContact('');
                            setMediaFiles([]);
                            setManualAddress('');
                            setCurrentStep('hazard');
                        }}>
                            Submit Another Report
                        </Button>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Report Incident
                    </h1>
                    <p className="text-text-secondary">
                        Help emergency responders by reporting what you see
                    </p>
                </div>

                <div className="flex gap-1">
                    {STEPS.map((step, index) => (
                        <div
                            key={step}
                            className={`
                h-1 flex-1 rounded-full transition-colors
                ${index <= stepIndex ? 'bg-accent' : 'bg-bg-tertiary'}
              `}
                        />
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {currentStep === 'hazard' && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                What type of hazard?
                            </h2>
                            <HazardGrid
                                hazards={HAZARD_TYPES}
                                onSelect={setSelectedHazard}
                                selectedId={selectedHazard?.id}
                            />
                        </div>
                    )}

                    {currentStep === 'severity' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                How severe is the situation?
                            </h2>
                            <div className="space-y-3">
                                {SEVERITY_LABELS.map((label, index) => {
                                    const level = index + 1;
                                    const isSelected = severity === level;
                                    return (
                                        <button
                                            key={level}
                                            onClick={() => setSeverity(level)}
                                            className={`
                        w-full flex items-center gap-3 p-4 rounded-[--radius-lg]
                        transition-all text-left
                        ${isSelected
                                                    ? 'bg-accent/15 ring-2 ring-accent'
                                                    : 'bg-bg-secondary hover:bg-bg-tertiary'
                                                }
                      `}
                                        >
                                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${level <= 2 ? 'bg-safe/15 text-safe' :
                                                    level === 3 ? 'bg-warning/15 text-warning' :
                                                        'bg-danger/15 text-danger'
                                                }
                      `}>
                                                {level}
                                            </div>
                                            <span className="text-text-primary">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentStep === 'media' && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                Add photos or videos (optional)
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Visual evidence helps responders assess the situation
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                capture="environment"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div className="grid grid-cols-3 gap-3">
                                {mediaFiles.map((media, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square bg-bg-tertiary rounded-lg flex items-center justify-center relative overflow-hidden"
                                    >
                                        {media.type === 'VIDEO' ? (
                                            <video
                                                src={media.preview}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={media.preview}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <button
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-danger/90 rounded-full flex items-center justify-center"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingMedia}
                                    className="aspect-square bg-bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed border-bg-tertiary hover:border-accent transition-colors disabled:opacity-50"
                                >
                                    {uploadingMedia ? (
                                        <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
                                    ) : (
                                        <>
                                            <Camera className="w-8 h-8 text-text-muted" />
                                            <span className="text-xs text-text-muted">Add</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 'location' && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                Confirm location
                            </h2>

                            {lat && lng ? (
                                <Card>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-safe/15 flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-safe" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">
                                                {address || 'Location captured'}
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                {lat.toFixed(6)}, {lng.toFixed(6)}
                                            </p>
                                        </div>
                                        <Check className="w-5 h-5 text-safe" />
                                    </div>
                                </Card>
                            ) : manualAddress.trim() ? (
                                <Card>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center">
                                            <Edit3 className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">
                                                {manualAddress}
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                Manually entered
                                            </p>
                                        </div>
                                        <Check className="w-5 h-5 text-safe" />
                                    </div>
                                </Card>
                            ) : null}

                            <Button
                                variant="outline"
                                fullWidth
                                loading={locationLoading}
                                onClick={requestLocation}
                            >
                                <MapPin className="w-5 h-5" />
                                {lat ? 'Update GPS Location' : 'Get GPS Location'}
                            </Button>

                            <div className="relative flex items-center gap-3">
                                <div className="flex-1 border-t border-bg-tertiary" />
                                <span className="text-xs text-text-muted">or enter manually</span>
                                <div className="flex-1 border-t border-bg-tertiary" />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-2">
                                    Address / Location Description
                                </label>
                                <textarea
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                    placeholder="e.g., Near the main junction on Adeniji Street, opposite the yellow building..."
                                    rows={3}
                                    className="
                      w-full p-3 bg-bg-secondary rounded-[--radius-md]
                      text-text-primary placeholder:text-text-muted
                      border border-transparent focus:border-accent focus:outline-none
                      resize-none
                    "
                                />
                                <p className="text-xs text-text-muted mt-2">
                                    {!isOnline && 'You are offline. '}
                                    Describe your location with landmarks, street names, or any details that help responders find you.
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 'details' && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                Additional details (optional)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe what you see..."
                                        rows={4}
                                        className="
                      w-full p-3 bg-bg-secondary rounded-[--radius-md]
                      text-text-primary placeholder:text-text-muted
                      border border-transparent focus:border-accent focus:outline-none
                      resize-none
                    "
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">
                                        Contact (optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="Your phone number"
                                        className="
                      w-full h-12 px-3 bg-bg-secondary rounded-[--radius-md]
                      text-text-primary placeholder:text-text-muted
                      border border-transparent focus:border-accent focus:outline-none
                    "
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'confirm' && selectedHazard && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="font-semibold text-text-primary">
                                Review your report
                            </h2>

                            <Card>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = selectedHazard.icon;
                                            return (
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: selectedHazard.bgColor }}
                                                >
                                                    <Icon className="w-6 h-6" style={{ color: selectedHazard.color }} />
                                                </div>
                                            );
                                        })()}
                                        <div>
                                            <p className="font-medium text-text-primary">{selectedHazard.name}</p>
                                            <p className="text-sm text-text-muted">Severity: {severity}/5</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-text-muted" />
                                        <span className="text-text-secondary">
                                            {address || manualAddress || `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`}
                                        </span>
                                    </div>

                                    {mediaFiles.length > 0 && (
                                        <p className="text-sm text-text-secondary">
                                            {mediaFiles.length} photo(s) attached
                                        </p>
                                    )}

                                    {description && (
                                        <p className="text-sm text-text-secondary">
                                            "{description}"
                                        </p>
                                    )}
                                </div>
                            </Card>

                            {!isOnline && (
                                <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-text-secondary">
                                        You're offline. Your report will be saved locally and synced when you're back online.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    {!isFirstStep && (
                        <Button variant="outline" onClick={goBack}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}

                    {isLastStep ? (
                        <Button
                            fullWidth
                            onClick={handleSubmit}
                            loading={submitting}
                            disabled={!canProceed()}
                        >
                            Submit Report
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            onClick={goNext}
                            disabled={!canProceed()}
                        >
                            Continue
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
