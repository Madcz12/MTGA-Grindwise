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
        <p className="text-sm font-serif italic text-text-secondary">El pergamino está en blanco. Inicia tu lectura.</p>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'import' })} className="btn-primary mt-8">
          Comenzar
        </button>
      </div>
    );
  }

  const completion = calculateCompletionPercent(wildcardGap);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Summary header */}
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl brutalist-title text-text-primary mb-3">Tu Destino Sellado</h2>
        <p className="text-xs uppercase tracking-widest text-text-secondary">El camino proyectado para completar el tomo</p>
      </div>

      {/* Overall progress + time estimate */}
      <div className="grid-auto gap-8 mb-12">
        <div className="brutalist-card-glow p-8 flex flex-col items-center justify-center animate-slide-up">
          <ProgressRing percentage={completion} size={140} color="#d4af37" label="Completado" />
        </div>

        <div className="brutalist-card p-8 flex flex-col items-center justify-center animate-slide-up relative overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-serif">T</div>
          <span className="brutalist-number text-5xl mb-2">{formatDuration(roadmap.totalWeeks)}</span>
          <span className="text-[10px] uppercase tracking-widest text-text-secondary mt-2">Tiempo estimado</span>
        </div>

        <div className="brutalist-card p-8 flex flex-col items-center justify-center animate-slide-up relative overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-serif">O</div>
          <span className="brutalist-number text-5xl mb-2">{roadmap.totalPacksNeeded}</span>
          <span className="text-[10px] uppercase tracking-widest text-text-secondary mt-2">Sobres necesarios</span>
          <span className="text-[10px] font-mono text-accent mt-2">~{roadmap.totalGoldNeeded.toLocaleString()} ORO</span>
        </div>
      </div>

      {/* Wildcard gap cards */}
      <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2 animate-slide-up" style={{ animationDelay: '250ms' }}>
        Tributos Restantes (Gap)
      </h3>
      <div className="grid grid-cols-2 @md:grid-cols-4 gap-6 mb-12">
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

      {/* Mythic warning */}
      {wildcardGap.mythic.gap > 0 && (
        <div className="brutalist-card border-l-2 border-l-warning p-6 mb-12 bg-warning/5 animate-fade-in relative">
          <p className="text-[10px] uppercase tracking-widest text-warning mb-2 font-bold">Advertencia de rareza mítica</p>
          <p className="text-sm font-serif italic text-text-secondary">
            Las ofrendas míticas no tienen un ciclo garantizado (aprox. 1 cada 72 sobres).
            El augurio es conservador; prepárate para posibles demoras o intervenciones directas con gemas.
          </p>
        </div>
      )}

      {/* Budget suggestion banner */}
      {budgetAnalysis?.shouldSuggestBudget && (
        <div
          className="brutalist-card-glow p-8 mb-12 cursor-pointer animate-slide-up group"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'budget' })}
          style={{ animationDelay: '400ms' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-3xl opacity-50 font-serif">✦</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-text-primary mb-1">¿Inscripciones demasiado costosas?</p>
                <p className="text-sm font-serif italic text-text-secondary">
                  Ahorra <span className="text-accent font-bold not-italic">{budgetAnalysis.totalWildcardsSaved}</span> wildcards
                  examinando los sustitutos sugeridos.
                </p>
              </div>
            </div>
            <span className="text-accent group-hover:translate-x-2 transition-transform opacity-50 text-2xl font-serif">→</span>
          </div>
        </div>
      )}

      {/* Roadmap */}
      <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2 animate-slide-up" style={{ animationDelay: '450ms' }}>
        Lectura del Destino (Hoja de Ruta)
      </h3>
      <RoadmapTimeline weeks={roadmap.weeks} />

      {/* Actions */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-subtle">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'account' })} className="text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">[ ← Alterar Tributos ]</button>
        <button onClick={() => dispatch({ type: 'RESET' })} className="text-xs uppercase tracking-widest text-text-muted hover:text-error transition-colors">[ ✕ Descartar Tomo ]</button>
      </div>
    </div>
  );
}
