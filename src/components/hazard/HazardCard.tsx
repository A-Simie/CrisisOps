import type { HazardType } from '../../lib/hazards';
import { ChevronRight } from 'lucide-react';

interface HazardCardProps {
    hazard: HazardType;
    onClick?: () => void;
    compact?: boolean;
    showArrow?: boolean;
}

export function HazardCard({
    hazard,
    onClick,
    compact = false,
    showArrow = false
}: HazardCardProps) {
    const Icon = hazard.icon;

    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-3 
        rounded-[--radius-lg] transition-all
        hover:scale-[1.02] active:scale-[0.98]
        text-left
        ${compact
                    ? 'p-3 bg-bg-secondary'
                    : 'p-4 bg-bg-secondary'
                }
      `}
            style={{
                backgroundColor: compact ? undefined : hazard.bgColor
            }}
        >
            <div
                className={`
          flex items-center justify-center rounded-xl
          ${compact ? 'w-10 h-10' : 'w-12 h-12'}
        `}
                style={{ backgroundColor: hazard.bgColor }}
            >
                <Icon
                    className={compact ? 'w-5 h-5' : 'w-6 h-6'}
                    style={{ color: hazard.color }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className={`
          font-medium text-text-primary
          ${compact ? 'text-sm' : 'text-base'}
        `}>
                    {hazard.name}
                </h3>
                {!compact && (
                    <p className="text-sm text-text-secondary truncate">
                        {hazard.description}
                    </p>
                )}
            </div>

            {showArrow && (
                <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
            )}
        </button>
    );
}

// Grid of hazard icons for quick selection
interface HazardGridProps {
    hazards: HazardType[];
    onSelect: (hazard: HazardType) => void;
    selectedId?: string;
}

export function HazardGrid({ hazards, onSelect, selectedId }: HazardGridProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {hazards.map((hazard) => {
                const Icon = hazard.icon;
                const isSelected = hazard.id === selectedId;

                return (
                    <button
                        key={hazard.id}
                        onClick={() => onSelect(hazard)}
                        className={`
              flex flex-col items-center gap-2 p-4
              rounded-[--radius-lg] transition-all
              hover:scale-[1.02] active:scale-[0.98]
              ${isSelected
                                ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary'
                                : ''
                            }
            `}
                        style={{ backgroundColor: hazard.bgColor }}
                    >
                        <Icon
                            className="w-8 h-8"
                            style={{ color: hazard.color }}
                        />
                        <span className="text-xs font-medium text-text-primary text-center leading-tight">
                            {hazard.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
