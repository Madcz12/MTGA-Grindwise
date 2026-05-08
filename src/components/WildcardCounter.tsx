import type { Rarity } from '../types';
import { useEffect, useState } from 'react';

interface WildcardCounterProps {
  rarity: Rarity;
  needed: number;
  have: number;
  gap: number;
}

const RARITY_STYLES: Record<Rarity, { icon: string; color: string; gradient: string }> = {
  common: {
    icon: '●',
    color: '#9ca3af',
    gradient: 'from-rarity-common/20 to-rarity-common/5',
  },
  uncommon: {
    icon: '◆',
    color: '#c0c0c0',
    gradient: 'from-rarity-uncommon/20 to-rarity-uncommon/5',
  },
  rare: {
    icon: '★',
    color: '#d4af37',
    gradient: 'from-rarity-rare/20 to-rarity-rare/5',
  },
  mythic: {
    icon: '✦',
    color: '#e85d26',
    gradient: 'from-rarity-mythic/20 to-rarity-mythic/5',
  },
};

export function WildcardCounter({ rarity, needed, have, gap }: WildcardCounterProps) {
  const [animatedGap, setAnimatedGap] = useState(0);
  const style = RARITY_STYLES[rarity];
  const isComplete = gap === 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedGap(gap), 200);
    return () => clearTimeout(timer);
  }, [gap]);

  return (
    <div
      className={`brutalist-card p-6 relative overflow-hidden group`}
      style={{
        borderColor: isComplete ? 'rgba(34, 197, 94, 0.3)' : `${style.color}30`,
      }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ color: style.color }} className="text-xl">{style.icon}</span>
            <span className="text-sm font-semibold text-text-primary capitalize">{rarity}</span>
          </div>
          {isComplete && (
            <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
              ✓ Completo
            </span>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-end gap-1 mb-3">
          <span
            className="font-mono text-3xl font-bold animate-count-up"
            style={{ color: isComplete ? '#22c55e' : style.color }}
          >
            {animatedGap}
          </span>
          <span className="text-sm text-text-muted mb-1">faltan</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${needed === 0 ? 100 : Math.round(((needed - gap) / needed) * 100)}%`,
              background: isComplete
                ? '#22c55e'
                : `linear-gradient(90deg, ${style.color}, ${style.color}80)`,
            }}
          />
        </div>

        {/* Details */}
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>Necesitas: {needed}</span>
          <span>Tienes: {have}</span>
        </div>
      </div>
    </div>
  );
}
