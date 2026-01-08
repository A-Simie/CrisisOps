import { useNavigate } from 'react-router-dom';
import { PageContainer, Button, Card } from '../components';
import { ArrowLeft, Phone, MapPin, Users, AlertTriangle, Shield } from 'lucide-react';
import { useState } from 'react';

const EMERGENCY_NUMBERS = [
    { name: 'Emergency Services', number: '112', description: 'Police, Fire, Ambulance', primary: true },
    { name: 'Police', number: '199', description: 'Law enforcement' },
    { name: 'Fire Department', number: '190', description: 'Fire emergencies' },
    { name: 'Ambulance', number: '199', description: 'Medical emergencies' },
];

const PRE_CALL_CHECKLIST = [
    { id: 'location', icon: MapPin, text: 'Know your current location', color: 'text-info' },
    { id: 'hazard', icon: AlertTriangle, text: 'Identify the type of hazard', color: 'text-warning' },
    { id: 'people', icon: Users, text: 'Count people affected', color: 'text-accent' },
];

export function EmergencyCall() {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleCall = (number: string) => {
        window.location.href = `tel:${number}`;
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

                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-10 h-10 text-danger" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Emergency Call
                    </h1>
                    <p className="text-text-secondary">
                        Contact emergency services immediately
                    </p>
                </div>

                <Card variant="bordered" className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-safe flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary">
                        <strong className="text-text-primary">Your safety first.</strong> If it's unsafe to stay where you are, move to a safe location before calling.
                    </p>
                </Card>

                <section>
                    <h2 className="font-semibold text-text-primary mb-3">
                        Before you call
                    </h2>
                    <div className="space-y-2">
                        {PRE_CALL_CHECKLIST.map(item => {
                            const Icon = item.icon;
                            const isChecked = checkedItems.has(item.id);

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => toggleCheck(item.id)}
                                    className={`
                    w-full flex items-center gap-3 p-3 rounded-[--radius-md]
                    transition-all text-left
                    ${isChecked
                                            ? 'bg-safe/10 line-through'
                                            : 'bg-bg-secondary hover:bg-bg-tertiary'
                                        }
                  `}
                                >
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isChecked ? 'bg-safe' : 'bg-bg-tertiary'}
                  `}>
                                        <Icon className={`w-4 h-4 ${isChecked ? 'text-white' : item.color}`} />
                                    </div>
                                    <span className={`text-sm ${isChecked ? 'text-text-muted' : 'text-text-primary'}`}>
                                        {item.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2 className="font-semibold text-text-primary mb-3">
                        Emergency Numbers
                    </h2>
                    <div className="space-y-3">
                        {EMERGENCY_NUMBERS.map((contact) => (
                            <Button
                                key={contact.number}
                                variant={contact.primary ? 'danger' : 'secondary'}
                                fullWidth
                                size="lg"
                                onClick={() => handleCall(contact.number)}
                                className="justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">{contact.name}</p>
                                        <p className="text-sm opacity-80">{contact.description}</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">{contact.number}</span>
                            </Button>
                        ))}
                    </div>
                </section>

                <p className="text-xs text-text-muted text-center">
                    Emergency numbers shown are for your detected region.
                    If you're traveling, local numbers may differ.
                </p>
            </div>
        </PageContainer>
    );
}
