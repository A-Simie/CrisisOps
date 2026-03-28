import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, CardTitle, Button, HazardGrid } from '../components';
import { HAZARD_TYPES, getHazardByBackendType } from '../lib/hazards';
import { Phone, MapPin, Download, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';
import { api, type Incident } from '../lib/api';
import { formatLastSync } from '../lib/sync';

function IncidentSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-bg-secondary rounded-2xl flex items-center gap-3 px-4">
                    <div className="w-10 h-10 bg-bg-tertiary rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-bg-tertiary rounded w-1/3" />
                        <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function Home() {
    const navigate = useNavigate();
    const { coordinates, address, permissionDenied, requestLocation } = useLocation();
    const { user } = useAuth();

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const greeting = getGreeting();
    const userName = user?.name?.split(' ')[0] || 'there';

    const fetchIncidents = useCallback(async () => {
        if (!coordinates) return;
        
        try {
            setLoading(true);
            const data = await api.getNearbyIncidents({
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                radiusKm: 20, // Slightly larger radius for the home screen
            });
            setIncidents(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch incidents:', err);
            setError('Could not load nearby incidents');
        } finally {
            setLoading(false);
        }
    }, [coordinates]);

    useEffect(() => {
        if (coordinates) {
            fetchIncidents();
        } else if (permissionDenied) {
            setLoading(false);
        }
    }, [coordinates, fetchIncidents, permissionDenied]);

    const handleHazardSelect = (hazard: typeof HAZARD_TYPES[0]) => {
        navigate(`/survival/${hazard.id}`);
    };

    const handleEmergencyCall = () => {
        navigate('/emergency');
    };

    function getSeverityLevel(severity: string): number {
        switch (severity) {
            case 'LOW': return 1;
            case 'MEDIUM': return 2;
            case 'HIGH': return 4;
            case 'CRITICAL': return 5;
            default: return 2;
        }
    }

    return (
        <PageContainer>
            <div className="space-y-6 animate-slide-up">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {greeting}, {userName}
                    </h1>
                    <p className="text-text-secondary">Stay safe and prepared</p>
                </div>

                <Card
                    variant="danger"
                    padding="lg"
                    className="relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-danger flex items-center justify-center">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-danger-light">Emergency Call</CardTitle>
                                <p className="text-sm text-text-secondary">
                                    Call local emergency services
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={handleEmergencyCall}
                        >
                            <Phone className="w-5 h-5" />
                            Call Emergency Services
                        </Button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-danger/10 blur-2xl" />
                </Card>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Quick Actions
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/survival')}
                            className="text-accent"
                        >
                            View All Hazards
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <HazardGrid
                        hazards={HAZARD_TYPES.slice(0, 6)}
                        onSelect={handleHazardSelect}
                    />
                </section>

                <Card>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <CardTitle>Your Area</CardTitle>
                                <p className="text-sm text-text-secondary">
                                    {permissionDenied
                                        ? 'Location access denied'
                                        : address || 'Location not set'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-lg mb-3">
                        <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-text-muted" />
                            <span className="text-sm text-text-secondary">Hazard Pack</span>
                        </div>
                        <span className="text-sm font-medium text-warning">Not downloaded</span>
                    </div>

                    {permissionDenied ? (
                        <Button variant="outline" fullWidth onClick={requestLocation}>
                            Enable Location Access
                        </Button>
                    ) : (
                        <Button variant="secondary" fullWidth onClick={() => navigate('/hazard-pack')}>
                            <Download className="w-4 h-4" />
                            Download Hazard Pack
                        </Button>
                    )}
                </Card>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Nearby Incidents
                        </h2>
                        <div className="flex items-center gap-2">
                             {loading && <Loader2 className="w-3 h-3 animate-spin text-text-muted" />}
                             <span className="text-xs text-text-muted">Last 24h</span>
                        </div>
                    </div>

                    {loading ? (
                        <IncidentSkeleton />
                    ) : error ? (
                        <Card className="flex flex-col items-center justify-center py-8 text-center bg-danger/5 border-danger/20">
                            <p className="text-sm text-danger mb-3">{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchIncidents}>
                                Try Again
                            </Button>
                        </Card>
                    ) : incidents.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-10 text-center bg-bg-secondary/50 border-dashed border-bg-tertiary/50">
                            <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-3">
                                <AlertCircle className="w-6 h-6 text-text-muted" />
                            </div>
                            <p className="text-sm text-text-secondary font-medium">All clear nearby</p>
                            <p className="text-xs text-text-muted">No incidents reported in your area recently.</p>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {incidents.map((incident) => {
                                const hazard = getHazardByBackendType(incident.hazardType);
                                if (!hazard) return null;
                                const Icon = hazard.icon;
                                const severity = getSeverityLevel(incident.severity);

                                return (
                                    <Card
                                        key={incident.id}
                                        padding="sm"
                                        interactive
                                        className="flex items-center gap-3 group"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-active:scale-95"
                                            style={{ backgroundColor: hazard.bgColor }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: hazard.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-text-primary text-sm">{hazard.name}</p>
                                            <p className="text-xs text-text-secondary truncate">
                                                {incident.location.address || `${incident.location.latitude.toFixed(4)}, ${incident.location.longitude.toFixed(4)}`}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="text-[10px] text-text-muted uppercase font-medium">
                                                {formatLastSync(new Date(incident.createdAt).getTime())}
                                            </span>
                                            <div className={`flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full ${
                                                severity >= 4 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                                            }`}>
                                                <AlertCircle className="w-2.5 h-2.5" />
                                                <span className="text-[10px] font-bold">LVL {severity}</span>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </PageContainer>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}
