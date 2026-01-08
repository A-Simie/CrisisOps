import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, CardTitle, Button, HazardGrid } from '../components';
import { HAZARD_TYPES } from '../lib/hazards';
import { Phone, MapPin, Download, AlertCircle, ChevronRight } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

const mockIncidents = [
    { id: '1', type: 'flood', location: 'Downtown Area', time: '2h ago', severity: 3 },
    { id: '2', type: 'fire', location: 'Industrial Zone', time: '5h ago', severity: 4 },
    { id: '3', type: 'road-accident', location: 'Highway 12', time: '8h ago', severity: 2 },
];

export function Home() {
    const navigate = useNavigate();
    const { address, permissionDenied, requestLocation } = useLocation();
    const { user } = useAuth();

    const greeting = getGreeting();
    const userName = user?.name?.split(' ')[0] || 'there';

    const handleHazardSelect = (hazard: typeof HAZARD_TYPES[0]) => {
        navigate(`/survival/${hazard.id}`);
    };

    const handleEmergencyCall = () => {
        navigate('/emergency');
    };

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
                    <h2 className="text-lg font-semibold text-text-primary mb-4">
                        Quick Actions
                    </h2>
                    <HazardGrid
                        hazards={HAZARD_TYPES.slice(0, 6)}
                        onSelect={handleHazardSelect}
                    />
                    <Button
                        variant="ghost"
                        fullWidth
                        className="mt-3"
                        onClick={() => navigate('/survival')}
                    >
                        View All Hazards
                        <ChevronRight className="w-4 h-4" />
                    </Button>
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
                        <span className="text-xs text-text-muted">Last 24h</span>
                    </div>

                    <div className="space-y-2">
                        {mockIncidents.map((incident) => {
                            const hazard = HAZARD_TYPES.find(h => h.id === incident.type);
                            if (!hazard) return null;
                            const Icon = hazard.icon;

                            return (
                                <Card
                                    key={incident.id}
                                    padding="sm"
                                    interactive
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: hazard.bgColor }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: hazard.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text-primary text-sm">{hazard.name}</p>
                                        <p className="text-xs text-text-muted truncate">{incident.location}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-text-muted">{incident.time}</span>
                                        <div className="flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-warning" />
                                            <span className="text-xs text-warning">Sev {incident.severity}</span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            </div>
        </PageContainer>
    );
}
