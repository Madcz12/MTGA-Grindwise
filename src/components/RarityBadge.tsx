import type { Rarity } from '../types';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string; icon: string }> = {
  common: {
    label: 'Common',
    color: 'text-rarity-common',
    bg: 'bg-rarity-common/10 border-rarity-common/30',
    icon: '●',
  },
  uncommon: {
    label: 'Uncommon',
    color: 'text-rarity-uncommon',
    bg: 'bg-rarity-uncommon/10 border-rarity-uncommon/30',
    icon: '◆',
  },
  rare: {
    label: 'Rare',
    color: 'text-rarity-rare',
    bg: 'bg-rarity-rare/10 border-rarity-rare/30',
    icon: '★',
  },
  mythic: {
    label: 'Mythic',
    color: 'text-rarity-mythic',
    bg: 'bg-rarity-mythic/10 border-rarity-mythic/30',
    icon: '✦',
  },
};

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function RarityBadge({ rarity, size = 'md', showLabel = true }: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${config.bg} ${config.color} ${SIZE_CLASSES[size]}`}
    >
      <span className="leading-none">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
