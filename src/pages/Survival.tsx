import { useNavigate } from 'react-router-dom';
import { PageContainer, HazardCard } from '../components';
import { HAZARD_TYPES } from '../lib/hazards';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export function Survival() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHazards = useMemo(() => {
        if (!searchQuery.trim()) return HAZARD_TYPES;
        const query = searchQuery.toLowerCase();
        return HAZARD_TYPES.filter(
            h => h.name.toLowerCase().includes(query) ||
                h.description.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <PageContainer>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Survival Library
                    </h1>
                    <p className="text-text-secondary">
                        Step-by-step guides for emergency situations
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search hazards..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
              w-full h-12 pl-10 pr-4
              bg-bg-secondary rounded-[--radius-lg]
              text-text-primary placeholder:text-text-muted
              border border-transparent
              focus:border-accent focus:outline-none
              transition-colors
            "
                    />
                </div>

                <div className="space-y-3">
                    {filteredHazards.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-text-muted">No hazards found</p>
                        </div>
                    ) : (
                        filteredHazards.map((hazard) => (
                            <HazardCard
                                key={hazard.id}
                                hazard={hazard}
                                onClick={() => navigate(`/survival/${hazard.id}`)}
                                showArrow
                            />
                        ))
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
