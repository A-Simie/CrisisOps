import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Button, Card } from '../components';
import { useLocation } from '../hooks/useLocation';
import { getAllHazardPacks, saveHazardPack, deleteHazardPack, type HazardPack } from '../lib/db';
import {
    ArrowLeft,
    MapPin,
    Download,
    Trash2,
    RefreshCw,
    Phone,
    Building2,
    AlertTriangle,
    Wifi,
    HardDrive
} from 'lucide-react';

const MOCK_PACK: Omit<HazardPack, 'id' | 'installedAt'> = {
    regionCode: 'NG-LA',
    regionName: 'Lagos State, Nigeria',
    version: '2024.1.15',
    lastUpdated: Date.now() - 86400000 * 3,
    sizeBytes: 2560000,
    hazards: ['flood', 'fire', 'road-accident', 'collapse', 'medical'],
    emergencyNumbers: [
        { name: 'Emergency', number: '112', description: 'All emergencies' },
        { name: 'Police', number: '199', description: 'Law enforcement' },
        { name: 'Fire Service', number: '190', description: 'Fire emergencies' },
        { name: 'LASEMA', number: '767', description: 'Lagos Emergency Management Agency' },
    ],
    shelters: [
        { id: '1', name: 'Teslim Balogun Stadium', address: 'Surulere, Lagos', lat: 6.4969, lng: 3.3614, type: 'Primary', capacity: 5000 },
        { id: '2', name: 'National Stadium', address: 'Surulere, Lagos', lat: 6.5028, lng: 3.3681, type: 'Secondary', capacity: 10000 },
    ],
    localNotes: 'During flooding, avoid low-lying areas like Lekki, Victoria Island, and Ikoyi Marina. High ground available at Ikeja and mainland areas.',
};

export function HazardPack() {
    const navigate = useNavigate();
    const { address } = useLocation();
    const [installedPack, setInstalledPack] = useState<HazardPack | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [wifiOnly, setWifiOnly] = useState(true);

    useEffect(() => {
        loadInstalledPack();
    }, []);

    const loadInstalledPack = async () => {
        const packs = await getAllHazardPacks();
        setInstalledPack(packs[0] || null);
    };

    const handleDownload = async () => {
        setDownloading(true);
        setProgress(0);

        for (let i = 0; i <= 100; i += 10) {
            await new Promise(r => setTimeout(r, 200));
            setProgress(i);
        }

        const pack: HazardPack = {
            ...MOCK_PACK,
            id: crypto.randomUUID(),
            installedAt: Date.now(),
        };
        await saveHazardPack(pack);
        setInstalledPack(pack);
        setDownloading(false);
    };

    const handleDelete = async () => {
        if (installedPack) {
            await deleteHazardPack(installedPack.id);
            setInstalledPack(null);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <PageContainer>
            <div className="space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">
                            {installedPack?.regionName || MOCK_PACK.regionName}
                        </h1>
                        <p className="text-sm text-text-secondary">
                            {address || 'Local hazard information'}
                        </p>
                    </div>
                </div>

                <Card variant={installedPack ? 'default' : 'bordered'}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <HardDrive className="w-5 h-5 text-text-muted" />
                            <span className="font-medium text-text-primary">Pack Status</span>
                        </div>
                        {installedPack && (
                            <span className="px-2 py-0.5 rounded-full bg-safe/15 text-safe text-xs font-medium">
                                Installed
                            </span>
                        )}
                    </div>

                    {installedPack ? (
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Version</span>
                                <span className="text-text-primary">{installedPack.version}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Installed</span>
                                <span className="text-text-primary">{formatDate(installedPack.installedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Size</span>
                                <span className="text-text-primary">{formatSize(installedPack.sizeBytes)}</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" fullWidth onClick={handleDownload} loading={downloading}>
                                    <RefreshCw className="w-4 h-4" />
                                    Update
                                </Button>
                                <Button variant="ghost" onClick={handleDelete}>
                                    <Trash2 className="w-4 h-4 text-danger" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Available version</span>
                                <span className="text-text-primary">{MOCK_PACK.version}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Size</span>
                                <span className="text-text-primary">{formatSize(MOCK_PACK.sizeBytes)}</span>
                            </div>

                            <button
                                onClick={() => setWifiOnly(!wifiOnly)}
                                className="w-full flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-text-muted" />
                                    <span className="text-sm text-text-secondary">Download on Wi-Fi only</span>
                                </div>
                                <div className={`
                  w-10 h-6 rounded-full transition-colors flex items-center px-1
                  ${wifiOnly ? 'bg-accent' : 'bg-bg-tertiary'}
                `}>
                                    <div className={`
                    w-4 h-4 rounded-full bg-white transition-transform
                    ${wifiOnly ? 'translate-x-4' : 'translate-x-0'}
                  `} />
                                </div>
                            </button>

                            {downloading ? (
                                <div className="space-y-2">
                                    <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent transition-all duration-200"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-text-muted text-center">
                                        Downloading... {progress}%
                                    </p>
                                </div>
                            ) : (
                                <Button fullWidth onClick={handleDownload}>
                                    <Download className="w-5 h-5" />
                                    Download Pack
                                </Button>
                            )}
                        </div>
                    )}
                </Card>

                {installedPack && (
                    <>
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Phone className="w-5 h-5 text-danger" />
                                <h2 className="font-semibold text-text-primary">Emergency Numbers</h2>
                            </div>
                            <div className="space-y-2">
                                {installedPack.emergencyNumbers.map((contact, index) => (
                                    <Card key={index} padding="sm" className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-text-primary">{contact.name}</p>
                                            <p className="text-xs text-text-muted">{contact.description}</p>
                                        </div>
                                        <a
                                            href={`tel:${contact.number}`}
                                            className="text-lg font-bold text-accent"
                                        >
                                            {contact.number}
                                        </a>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5 text-safe" />
                                <h2 className="font-semibold text-text-primary">Emergency Shelters</h2>
                            </div>
                            <div className="space-y-2">
                                {installedPack.shelters.map((shelter) => (
                                    <Card key={shelter.id} padding="sm">
                                        <p className="font-medium text-text-primary">{shelter.name}</p>
                                        <p className="text-sm text-text-muted">{shelter.address}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className="text-text-secondary">{shelter.type}</span>
                                            {shelter.capacity && (
                                                <span className="text-text-muted">Capacity: {shelter.capacity.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {installedPack.localNotes && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-warning" />
                                    <h2 className="font-semibold text-text-primary">Local Safety Notes</h2>
                                </div>
                                <Card>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {installedPack.localNotes}
                                    </p>
                                </Card>
                            </section>
                        )}

                        <section>
                            <h2 className="font-semibold text-text-primary mb-3">Hazards Covered</h2>
                            <div className="flex flex-wrap gap-2">
                                {installedPack.hazards.map((hazardId) => (
                                    <span
                                        key={hazardId}
                                        className="px-3 py-1 bg-bg-secondary rounded-full text-sm text-text-secondary capitalize"
                                    >
                                        {hazardId.replace('-', ' ')}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </PageContainer>
    );
}
