import type { RoadmapWeek } from '../types';

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  if (weeks.length === 0) {
    return (
      <div className="card-modern p-12 text-center border-dashed border-slate-800">
        <span className="text-5xl mb-6 block">✨</span>
        <p className="text-xl font-black text-text-primary">¡Objetivo Alcanzado!</p>
        <p className="text-sm font-medium text-slate-500 mt-2">No necesitas comodines adicionales para este mazo.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800" />
      <div className="space-y-8">
        {weeks.map((week, index) => (
          <div key={week.weekNumber} className="relative pl-20 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute left-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${week.isComplete ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-950 border-slate-800'}`}>
              {week.isComplete && <span className="text-slate-950 text-[10px] font-black">✓</span>}
            </div>
            
            <div className={`card-modern p-6 transition-all duration-500 ${week.isComplete ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-slate-900/40'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Semana {week.weekNumber}</h4>
                {week.isComplete && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Mazo Completado</span>}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Misiones</p>
                  <p className="font-black text-text-primary">{week.dailyQuestsCompleted}/día</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Victorias</p>
                  <p className="font-black text-text-primary">{week.weeklyWinsAchieved}/sem</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Oro</p>
                  <p className="font-black text-emerald-500">+{week.goldEarned.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sobres</p>
                  <p className="font-black text-text-primary">{week.packsOpened} <span className="text-slate-500 text-xs font-medium">({week.packsCumulative})</span></p>
                </div>
              </div>

              {(week.wildcardCumulative.mythic > 0 || week.wildcardCumulative.rare > 0) && (
                <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-2">
                  {week.wildcardCumulative.mythic > 0 && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-orange-500/10 text-orange-500 border-orange-500/20">✦ {week.wildcardCumulative.mythic}</span>}
                  {week.wildcardCumulative.rare > 0 && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-amber-400/10 text-amber-400 border-amber-400/20">★ {week.wildcardCumulative.rare}</span>}
                  {week.wildcardCumulative.uncommon > 0 && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-slate-300/10 text-slate-300 border-slate-300/20">◆ {week.wildcardCumulative.uncommon}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

}
