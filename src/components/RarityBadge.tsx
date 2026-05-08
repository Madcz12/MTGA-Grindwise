import type { Rarity } from '../types';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string; icon: string }> = {
  common: {
    label: 'Común',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10 border-slate-400/20',
    icon: '●',
  },
  uncommon: {
    label: 'Infrecuente',
    color: 'text-slate-200',
    bg: 'bg-slate-200/10 border-slate-200/20',
    icon: '◆',
  },
  rare: {
    label: 'Rara',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    icon: '★',
  },
  mythic: {
    label: 'Mítica',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/20',
    icon: '✦',
  },
};

const SIZE_CLASSES = {
  sm: 'text-[9px] px-1.5 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
  lg: 'text-sm px-4 py-2 rounded-xl',
};

export function RarityBadge({ rarity, size = 'md', showLabel = true }: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-black uppercase tracking-widest leading-none ${config.bg} ${config.color} ${SIZE_CLASSES[size]}`}
    >
      <span className="text-sm">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

