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
      className={`flex items-center gap-5 p-4 rounded-xl border transition-all duration-300 group ${
        isFullyOwned
          ? 'bg-emerald-500/5 border-emerald-500/30'
          : isIllegal
            ? 'bg-red-500/5 border-red-500/30'
            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Card art thumbnail */}
      <div className="w-16 h-12 rounded-lg border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0 relative shadow-inner">
        {entry.imageUri ? (
          <img
            src={entry.imageUri}
            alt={entry.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold">
            ?
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-sm font-bold text-text-primary truncate transition-colors group-hover:text-emerald-400">
            {entry.name}
          </span>
          {isIllegal && (
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-md">
              No legal
            </span>
          )}
          {entry.section === 'sideboard' && (
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded-md">
              SB
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.setCode}</span>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          {entry.rarity && <RarityBadge rarity={entry.rarity} size="sm" showLabel={false} />}
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <span className="text-xs font-bold text-slate-400">×{entry.quantity}</span>
        </div>
      </div>

      {/* Owned selector */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Propiedad:</label>
        <div className="flex gap-1.5">
          {Array.from({ length: entry.quantity + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => onOwnedChange(i)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                i === copiesOwned
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

