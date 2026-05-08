import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { WildcardCounter } from '../components/WildcardCounter';
import { ProgressRing } from '../components/ProgressRing';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { calculateCompletionPercent } from '../utils/wildcardCalc';
import { formatDuration } from '../utils/roadmapCalc';
import type { Rarity } from '../types';

const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  uncommon: '#c0c0c0',
  rare: '#d4af37',
  mythic: '#e85d26',
};

export function Results() {
  const { wildcardGap, roadmap, budgetAnalysis } = useDeckState();
  const dispatch = useDeckDispatch();

  if (!wildcardGap || !roadmap) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <p className="text-sm font-medium text-text-secondary">El pergamino está en blanco. Inicia tu lectura.</p>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'import' })} className="btn-modern-primary mt-8 px-10">
          Comenzar
        </button>
      </div>
    );
  }

  const completion = calculateCompletionPercent(wildcardGap);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Summary header */}
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">Hoja de Ruta</h2>
        <p className="text-text-secondary font-medium">El camino proyectado para completar tu mazo</p>
      </div>

      {/* Overall progress + time estimate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="card-modern p-10 flex flex-col items-center justify-center animate-slide-up bg-slate-900/40">
          <ProgressRing percentage={completion} size={150} strokeWidth={10} color="#10b981" label="Completado" />
        </div>

        <div className="card-modern p-10 flex flex-col items-center justify-center animate-slide-up bg-slate-900/40" style={{ animationDelay: '100ms' }}>
          <div className="text-slate-800 text-6xl font-black absolute top-4 right-6 opacity-20 pointer-events-none">W</div>
          <span className="text-5xl font-black text-text-primary mb-2">{formatDuration(roadmap.totalWeeks)}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4">Tiempo estimado</span>
        </div>

        <div className="card-modern p-10 flex flex-col items-center justify-center animate-slide-up bg-slate-900/40" style={{ animationDelay: '200ms' }}>
          <div className="text-slate-800 text-6xl font-black absolute top-4 right-6 opacity-20 pointer-events-none">P</div>
          <span className="text-5xl font-black text-text-primary mb-2">{roadmap.totalPacksNeeded}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4">Sobres necesarios</span>
          <div className="mt-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">~{roadmap.totalGoldNeeded.toLocaleString()} ORO</span>
          </div>
        </div>
      </div>

      {/* Wildcard gap cards */}
      <div className="mb-16">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-4">
          Comodines Faltantes
          <div className="h-px flex-1 bg-slate-800"></div>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map((rarity, i) => (
            <div key={rarity} className="animate-slide-up" style={{ animationDelay: `${300 + i * 50}ms` }}>
              <WildcardCounter
                rarity={rarity}
                needed={wildcardGap[rarity].needed}
                have={wildcardGap[rarity].have}
                gap={wildcardGap[rarity].gap}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mythic warning */}
      {wildcardGap.mythic.gap > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 mb-16 animate-fade-in flex gap-6 items-start">
          <div className="text-3xl">⚠️</div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">Advertencia de rareza mítica</p>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Las wildcards míticas no tienen un ciclo garantizado (aprox. 1 cada 72 sobres). 
              La proyección es conservadora; podrías necesitara abrir más sobres o usar gemas.
            </p>
          </div>
        </div>
      )}

      {/* Budget suggestion banner */}
      {budgetAnalysis?.shouldSuggestBudget && (
        <button
          className="w-full card-modern p-10 mb-16 text-left group hover:border-emerald-500/30 transition-all duration-500 animate-slide-up relative overflow-hidden"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'budget' })}
          style={{ animationDelay: '400ms' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💡</div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-text-primary mb-2">¿Demasiado costoso?</p>
                <p className="text-sm font-medium text-slate-400">
                  Ahorra <span className="text-emerald-400 font-black">{budgetAnalysis.totalWildcardsSaved}</span> comodines 
                  revisando las alternativas budget sugeridas.
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-slate-950 transition-all">
              <span className="text-xl">→</span>
            </div>
          </div>
        </button>
      )}

      {/* Roadmap */}
      <div className="mb-20">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-12 flex items-center gap-4">
          Cronograma de Adquisición
          <div className="h-px flex-1 bg-slate-800"></div>
        </h3>
        <RoadmapTimeline weeks={roadmap.weeks} />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 py-10 border-t border-slate-800 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <button 
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'account' })} 
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <span className="text-base">←</span> Modificar Inventario
        </button>
        
        <button 
          onClick={() => dispatch({ type: 'RESET' })} 
          className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">✕</span> Descartar Análisis
        </button>
      </div>
    </div>
  );
}

}
