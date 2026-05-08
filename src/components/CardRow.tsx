import type { DeckEntry } from '../types';
import { RarityBadge } from './RarityBadge';

interface CardRowProps {
  entry: DeckEntry;
  copiesOwned: number;
  onOwnedChange: (copies: number) => void;
}

export function CardRow({ entry, copiesOwned, onOwnedChange }: CardRowProps) {
  const isFullyOwned = copiesOwned >= entry.quantity;
  const isIllegal = entry.isLegalStandard === false;

  return (
    <div
      className={`flex items-center gap-4 p-3 brutalist-card mb-4 group transition-all duration-300 ${
        isFullyOwned
          ? 'bg-success/5 border-success/40'
          : isIllegal
            ? 'bg-error/5 border-error/40'
            : ''
      }`}
    >
      {/* Card art thumbnail */}
      <div className="w-16 h-12 border-2 border-border-subtle overflow-hidden bg-bg-primary flex-shrink-0 relative">
        {entry.imageUri ? (
          <img
            src={entry.imageUri}
            alt={entry.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
            ?
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-serif font-bold text-text-primary truncate group-hover:text-accent transition-colors">
            {entry.name}
          </span>
          {isIllegal && (
            <span className="text-[10px] uppercase tracking-widest text-error border border-error/30 px-1 py-0.5">
              No legal
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted uppercase">{entry.setCode}</span>
          {entry.rarity && <RarityBadge rarity={entry.rarity} size="sm" showLabel={false} />}
          <span className="text-xs font-mono text-text-muted">×{entry.quantity}</span>
          {entry.section === 'sideboard' && (
            <span className="text-[10px] uppercase tracking-widest text-mana-blue border border-mana-blue/30 px-1 py-0.5">
              SB
            </span>
          )}
        </div>
      </div>

      {/* Owned selector */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <label className="text-[10px] uppercase tracking-widest text-text-secondary whitespace-nowrap">Tengo:</label>
        <div className="flex gap-1">
          {Array.from({ length: entry.quantity + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => onOwnedChange(i)}
              className={`w-8 h-8 border flex items-center justify-center text-xs font-sans transition-all duration-300 ${
                i === copiesOwned
                  ? 'bg-accent text-bg-primary'
                  : 'border-border-subtle text-text-muted hover:border-accent hover:text-accent'
              }`}
              style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
