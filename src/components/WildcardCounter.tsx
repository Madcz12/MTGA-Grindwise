import type { Rarity } from '../types';
import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface WildcardCounterProps {
  rarity: Rarity;
  needed: number;
  have: number;
  gap: number;
}

const RARITY_STYLES: Record<Rarity, { icon: string; color: string; accent: string; gradient: string }> = {
  common: {
    icon: '●',
    color: 'text-slate-400',
    accent: 'bg-slate-400',
    gradient: 'from-slate-400/20 to-transparent',
  },
  uncommon: {
    icon: '◆',
    color: 'text-slate-200',
    accent: 'bg-slate-200',
    gradient: 'from-slate-200/20 to-transparent',
  },
  rare: {
    icon: '★',
    color: 'text-amber-400',
    accent: 'bg-amber-400',
    gradient: 'from-amber-400/20 to-transparent',
  },
  mythic: {
    icon: '✦',
    color: 'text-orange-500',
    accent: 'bg-orange-500',
    gradient: 'from-orange-500/20 to-transparent',
  },
};

export function WildcardCounter({ rarity, needed, have, gap }: WildcardCounterProps) {
  const [animatedGap, setAnimatedGap] = useState(0);
  const { t } = useLanguage();
  const style = RARITY_STYLES[rarity];
  const isComplete = gap === 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedGap(gap), 200);
    return () => clearTimeout(timer);
  }, [gap]);

  return (
    <div
      className={`card-modern p-6 relative overflow-hidden group transition-all duration-500 ${
        isComplete ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-slate-900/40 hover:border-slate-700'
      }`}
    >
      {/* Background glow */}
      <div
        className={`absolute -inset-24 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`text-xl ${style.color} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}>{style.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t(`rarity.${rarity}`)}</span>
          </div>
          {isComplete && (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] shadow-lg shadow-emerald-500/20">
              ✓
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className={`text-4xl font-black transition-colors duration-500 ${isComplete ? 'text-emerald-400' : 'text-text-primary'}`}
          >
            {animatedGap}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('wildcardCounter.missing')}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden mb-4 border border-slate-800/50">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : style.accent}`}
            style={{
              width: `${needed === 0 ? 100 : Math.round(((needed - gap) / needed) * 100)}%`,
            }}
          />
        </div>

        {/* Details */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>{t('wildcardCounter.req')} {needed}</span>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <span>{t('wildcardCounter.own')} {have}</span>
        </div>
      </div>
    </div>
  );
}
