import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import {
    WifiOff,
    Download,
    MapPin,
    ChevronRight,
    ChevronLeft,
    CloudOff,
    CheckCircle,
    Map,
    Megaphone,
    Shield
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface Slide {
    id: string;
    icon: React.ReactNode;
    decorIcon?: React.ReactNode;
    title: string;
    description: string;
    imageUrl: string;
    features?: { icon: React.ReactNode; label: string }[];
}

const SLIDE_IMAGES = {
    offline: '',
    hazardPack: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6tGYhZZUBx7Y7_lA8RO86SAiVZXtNOrTd4OS916y7R4T_mdvGBEcGhWOH-CJUebMGONqd9WG2PFYsuSQnbCeg6SN4q4lCbT_4e1kgIS4CvC0TvHrgG8Ptz7KWAaBfzcR22AqPzGVWhv8O_0SV6kwoCUd0zmpiiMhDZulqvZJj43IX1OvnOLYE1NYtXcCakZIYWWEPJo74ulhGCBevadw0dk3hVbXm7wsP70ikjwgXddDAwHXHLwfAh969UrHQBDskKJqJP7vHyAi0',
    report: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT-gHC0Rs-0hqIC4if2RCgLTYdBYcEpfWgcnhGu5w9ZNXpYyJvSDSBKQdthjLg9S8cQsjl8yj6OY3g0VHcYN50-RsyYR4REd98hD2-TCm9GqERX50PAwcj2c_aNQlRv0CMyMWJFODl4JeoV6pMnqC5f5q2wwPEdLH7u2BmVn8uLONl5G7TOfRC67qLxbLeks79mAcn3ZNmwlVgzjXDziVn02NsNOLw4rnU_uTrOpSk2CoEu9HOVqU7DPWJmPkicO2vlPVRudOvbUk0',
};

const slides: Slide[] = [
    {
        id: 'offline',
        icon: <WifiOff className="w-16 h-16 text-accent" />,
        decorIcon: <CloudOff className="w-8 h-8 text-bg-tertiary animate-pulse" />,
        title: 'Works Offline',
        description: 'Access survival guides, maps, and reporting tools even when the grid is down. Your safety doesn\'t depend on a signal.',
        imageUrl: SLIDE_IMAGES.offline,
    },
    {
        id: 'hazardPack',
        icon: <Download className="w-16 h-16 text-safe" />,
        title: 'Download Local\nHazard Packs',
        description: 'Get instant access to survival guides, evacuation routes, and first aid tips specific to your location—even when the grid is down.',
        imageUrl: SLIDE_IMAGES.hazardPack,
        features: [
            { icon: <WifiOff className="w-5 h-5 text-accent" />, label: 'Works Offline' },
            { icon: <Map className="w-5 h-5 text-accent" />, label: 'Local Maps' },
        ],
    },
    {
        id: 'report',
        icon: <Megaphone className="w-10 h-10 text-white" />,
        title: 'Report Critical Incidents',
        description: 'Alert local teams to hazards near you to speed up rescue efforts. Share real-time updates on floods, fires, or blocked roads.',
        imageUrl: SLIDE_IMAGES.report,
    },
];

const ONBOARDING_KEY = 'crisisops_onboarding_complete';

export function Onboarding() {
    const navigate = useNavigate();
    const isOnline = useOnlineStatus();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [requestingLocation, setRequestingLocation] = useState(false);
    const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOnline) {
            slides.forEach(slide => {
                const img = new Image();
                img.onload = () => setImageLoaded(prev => ({ ...prev, [slide.id]: true }));
                img.src = slide.imageUrl;
            });
        }
    }, [isOnline]);

    const completeOnboarding = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        navigate('/home', { replace: true });
    };

    const requestLocationPermission = async () => {
        setRequestingLocation(true);
        try {
            await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });
        } catch {
        }
        setRequestingLocation(false);
        completeOnboarding();
    };

    const isLastSlide = currentSlide === slides.length - 1;
    const slide = slides[currentSlide];
    const showImage = isOnline && imageLoaded[slide.id];

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 z-20">
                <div className="flex items-center gap-2 opacity-90">
                    <div className="bg-accent/20 p-1.5 rounded-lg">
                        <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-text-primary">CrisisOps</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={completeOnboarding}
                >
                    Skip
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
                <div
                    className="relative w-full max-w-[280px] aspect-square flex items-center justify-center mb-8 animate-fade-in"
                    key={currentSlide}
                >
                    <div className="absolute inset-0 bg-accent/15 rounded-full blur-[80px] opacity-70 animate-pulse-soft" />

                    {showImage ? (
                        <div
                            className="relative z-10 w-full h-full rounded-3xl overflow-hidden bg-bg-secondary shadow-2xl shadow-black/30 ring-1 ring-white/5 transform hover:scale-105 transition-transform duration-500"
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url("${slide.imageUrl}")` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/30 via-transparent to-transparent" />

                            {slide.id === 'report' && (
                                <div className="absolute bottom-4 right-4 h-14 w-14 rounded-xl bg-accent flex items-center justify-center shadow-lg ring-4 ring-bg-primary">
                                    {slide.icon}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" />

                            <div className="absolute inset-[15%] rounded-full border border-bg-tertiary/50 bg-bg-secondary/10 backdrop-blur-sm" />

                            <div className="relative z-10 bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-bg-tertiary rounded-[2rem] w-44 h-44 flex items-center justify-center shadow-2xl shadow-accent/20 ring-1 ring-white/10">
                                <WifiOff className="w-20 h-20 text-accent" />
                                <div className="absolute -right-3 -top-3 bg-bg-secondary rounded-full p-2 border border-bg-tertiary shadow-lg">
                                    <CloudOff className="w-6 h-6 text-text-muted animate-pulse" />
                                </div>
                            </div>

                            {slide.id === 'offline' && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg-secondary border border-safe/30 py-2.5 px-5 rounded-full flex items-center gap-2 shadow-lg shadow-safe/10">
                                    <CheckCircle className="w-4 h-4 text-safe" />
                                    <span className="text-xs font-semibold text-safe uppercase tracking-wider">Data Synced</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center text-center space-y-4 max-w-[320px] mx-auto animate-slide-up">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary leading-tight whitespace-pre-line">
                        {slide.title}
                    </h1>
                    <p className="text-text-secondary text-[15px] leading-relaxed font-light">
                        {slide.description}
                    </p>
                </div>

                {slide.features && (
                    <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-[280px] animate-fade-in">
                        {slide.features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center gap-1.5 bg-bg-secondary p-3 rounded-xl border border-bg-tertiary shadow-sm"
                            >
                                {feature.icon}
                                <span className="text-xs font-semibold text-text-secondary">{feature.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full flex flex-col items-center gap-6 pb-8 pt-4 px-6 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent z-20">
                <div className="flex flex-row items-center justify-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`
                h-1.5 rounded-full transition-all duration-300
                ${index === currentSlide
                                    ? 'w-8 bg-accent shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                                    : 'w-1.5 bg-bg-tertiary hover:bg-text-muted'
                                }
              `}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="w-full max-w-sm space-y-3">
                    {isLastSlide ? (
                        <>
                            <Button
                                fullWidth
                                size="lg"
                                onClick={requestLocationPermission}
                                loading={requestingLocation}
                                className="shadow-lg shadow-accent/20 ring-1 ring-white/10"
                            >
                                <MapPin className="w-5 h-5" />
                                Enable Location
                            </Button>
                            <p className="text-xs text-text-muted text-center">
                                Location helps us show relevant hazard packs and emergency services
                            </p>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            {currentSlide > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentSlide(prev => prev - 1)}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => setCurrentSlide(prev => prev + 1)}
                                className="shadow-lg shadow-accent/20 ring-1 ring-white/10"
                            >
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function hasCompletedOnboarding(): boolean {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
}
