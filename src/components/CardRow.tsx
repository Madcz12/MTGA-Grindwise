import { useState, useRef } from 'react';
import type { DeckEntry } from '../types';
import { RarityBadge } from './RarityBadge';
import { useLanguage } from '../i18n/LanguageContext';

interface CardRowProps {
  entry: DeckEntry;
  copiesOwned: number;
  onOwnedChange: (copies: number) => void;
}

export function CardRow({ entry, copiesOwned, onOwnedChange }: CardRowProps) {
  const { t } = useLanguage();
  const isFullyOwned = copiesOwned >= entry.quantity;
  const isIllegal = entry.isLegalStandard === false;

  const [showPreview, setShowPreview] = useState(false);
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const previewSrc = entry.cardImageUri || entry.imageUri;

  const handleMouseEnter = () => {
    if (!previewSrc) return;
    if (thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      // Position the card preview to the right of the thumbnail
      setPreviewPos({
        x: rect.right + 12,
        y: rect.top + rect.height / 2,
      });
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

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
      <div
        ref={thumbnailRef}
        className="w-16 h-12 rounded-lg border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0 relative shadow-inner cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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

      {/* Hover card preview (portal-style fixed position) */}
      {showPreview && previewSrc && (
        <div
          className="card-preview-popup"
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
          }}
        >
          <img
            src={previewSrc}
            alt={entry.name}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-sm font-bold text-text-primary truncate transition-colors group-hover:text-emerald-400">
            {entry.name}
          </span>
          {isIllegal && (
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-md">
              {t('cardRow.illegal')}
            </span>
          )}
          {entry.section === 'sideboard' && (
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded-md">
              {t('cardRow.sb')}
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
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{t('cardRow.ownership')}</label>
        {entry.quantity <= 4 ? (
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
        ) : (
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => onOwnedChange(Math.max(0, copiesOwned - 1))}
              disabled={copiesOwned <= 0}
              className="w-9 h-9 rounded-lg border bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 flex items-center justify-center text-xs font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="min-w-[48px] text-center text-xs font-bold text-text-primary bg-slate-950 px-2 py-2 rounded-lg border border-slate-800">
              {copiesOwned} / {entry.quantity}
            </span>
            <button
              onClick={() => onOwnedChange(Math.min(entry.quantity, copiesOwned + 1))}
              disabled={copiesOwned >= entry.quantity}
              className="w-9 h-9 rounded-lg border bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 flex items-center justify-center text-xs font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
