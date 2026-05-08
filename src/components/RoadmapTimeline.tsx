import type { RoadmapWeek } from '../types';

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  if (weeks.length === 0) {
    return (
      <div className="brutalist-card p-8 text-center border-dashed">
        <span className="text-4xl mb-4 block">🎉</span>
        <p className="text-lg font-semibold text-text-primary">¡Ya tienes todo!</p>
        <p className="text-sm text-text-secondary mt-1">No necesitas wildcards adicionales</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-mana-blue to-mana-black" />
      <div className="space-y-4">
        {weeks.map((week, index) => (
          <div key={week.weekNumber} className="relative pl-14 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${week.isComplete ? 'bg-success border-success shadow-lg shadow-success/30' : 'bg-bg-card border-accent/50'}`}>
              {week.isComplete && <span className="text-white text-xs">✓</span>}
            </div>
            <div className={`brutalist-card p-5 ${week.isComplete ? 'border-success/30 bg-success/5' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-text-primary">Semana {week.weekNumber}</h4>
                {week.isComplete && <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">🎯 ¡Meta!</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><p className="text-xs text-text-muted">📜 Misiones</p><p className="font-mono font-semibold text-text-primary">{week.dailyQuestsCompleted}/día</p></div>
                <div><p className="text-xs text-text-muted">⚔️ Victorias</p><p className="font-mono font-semibold text-text-primary">{week.weeklyWinsAchieved}/sem</p></div>
                <div><p className="text-xs text-text-muted">🪙 Oro</p><p className="font-mono font-semibold text-text-primary">{week.goldEarned.toLocaleString()}</p></div>
                <div><p className="text-xs text-text-muted">📦 Sobres</p><p className="font-mono font-semibold text-text-primary">{week.packsOpened} ({week.packsCumulative})</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {week.wildcardCumulative.mythic > 0 && <span className="text-xs px-2 py-0.5 rounded border bg-rarity-mythic/10 text-rarity-mythic border-rarity-mythic/30">✦ {week.wildcardCumulative.mythic}</span>}
                {week.wildcardCumulative.rare > 0 && <span className="text-xs px-2 py-0.5 rounded border bg-rarity-rare/10 text-rarity-rare border-rarity-rare/30">★ {week.wildcardCumulative.rare}</span>}
                {week.wildcardCumulative.uncommon > 0 && <span className="text-xs px-2 py-0.5 rounded border bg-rarity-uncommon/10 text-rarity-uncommon border-rarity-uncommon/30">◆ {week.wildcardCumulative.uncommon}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
