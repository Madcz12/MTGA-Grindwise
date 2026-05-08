import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { RarityBadge } from '../components/RarityBadge';
import { WildcardCounter } from '../components/WildcardCounter';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { generateRoadmap, formatDuration } from '../utils/roadmapCalc';
import type { Rarity } from '../types';

export function BudgetView() {
  const { budgetAnalysis, sessionProfile, currentGold } = useDeckState();
  const dispatch = useDeckDispatch();

  if (!budgetAnalysis || !budgetAnalysis.shouldSuggestBudget) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">No hay sugerencias budget disponibles.</p>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'results' })} className="btn-primary mt-4">← Resultados</button>
      </div>
    );
  }

  const { substitutions, originalGap, budgetGap, totalWildcardsSaved } = budgetAnalysis;
  const budgetRoadmap = generateRoadmap(budgetGap, sessionProfile, currentGold);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl editorial-title text-text-primary mb-3">Versión del Mendigo (Budget)</h2>
        <p className="text-xs uppercase tracking-widest text-text-secondary">Alternativas terrenales para mitigar el costo en comodines</p>
      </div>

      {/* Savings highlight */}
      <div className="grimoire-card-glow p-8 mb-12 text-center animate-slide-up border-b border-b-accent/50">
        <span className="editorial-number text-6xl text-accent block mb-2">{totalWildcardsSaved}</span>
        <p className="text-xs uppercase tracking-widest text-text-primary font-bold">Tributos Ahorrados</p>
        <p className="text-sm font-serif italic text-text-secondary mt-2">
          Tiempo estimado: <span className="text-accent not-italic font-bold">{formatDuration(budgetRoadmap.totalWeeks)}</span>
          {budgetRoadmap.totalWeeks > 0 && (
            <span className="text-success ml-2">
              (vs {formatDuration(generateRoadmap(originalGap, sessionProfile, currentGold).totalWeeks)} original)
            </span>
          )}
        </p>
      </div>

      {/* Substitution table */}
      <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>Sustituciones Sugeridas</h3>
      <div className="space-y-4 mb-12">
        {substitutions.map((sub, i) => (
          <div key={i} className="grimoire-card p-4 animate-slide-up" style={{ animationDelay: `${150 + i * 50}ms` }}>
            <div className="flex flex-col @md:flex-row items-center gap-4">
              {/* Original */}
              <div className="w-full @md:flex-1">
                <div className="flex items-center gap-3">
                  {sub.original.imageUri && (
                    <img src={sub.original.imageUri} alt={sub.original.name} className="w-12 h-9 rounded object-cover" loading="lazy" />
                  )}
                  <div>
                    <p className="text-sm font-serif font-bold text-text-primary">{sub.original.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RarityBadge rarity={sub.original.rarity!} size="sm" />
                      <span className="text-xs font-mono text-text-muted">×{sub.original.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <span className="text-text-muted text-lg font-serif italic">→</span>

              {/* Substitute */}
              <div className="w-full @md:flex-1">
                <div className="flex items-center gap-3">
                  {sub.substitute.imageUri && (
                    <img src={sub.substitute.imageUri} alt={sub.substitute.name} className="w-12 h-9 rounded object-cover" loading="lazy" />
                  )}
                  <div>
                    <p className="text-sm font-serif font-bold text-success">{sub.substitute.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RarityBadge rarity={sub.substitute.rarity} size="sm" />
                      <span className="text-[10px] uppercase tracking-widest text-success border border-success/30 px-1.5 py-0.5">Ahorra {sub.wildcardsSaved.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="grimoire-card border-l-2 border-warning p-6 bg-warning/5 mb-12 animate-fade-in relative">
        <p className="text-[10px] uppercase tracking-widest text-warning font-bold mb-2">Advertencia del Escriba</p>
        <p className="text-sm font-serif italic text-text-secondary">
          Las sustituciones son orientativas y alterarán la sinergia original del tomo.
          Se seleccionan por tipo y coste, pero no garantizan la misma eficacia en combate.
        </p>
      </div>

      {/* Budget wildcard gap */}
      <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2">Tributos Modificados (Gap Budget)</h3>
      <div className="grid grid-cols-2 @md:grid-cols-4 gap-6 mb-12">
        {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map(rarity => (
          <WildcardCounter key={rarity} rarity={rarity} needed={budgetGap[rarity].needed} have={budgetGap[rarity].have} gap={budgetGap[rarity].gap} />
        ))}
      </div>

      {/* Budget roadmap */}
      <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2">Nueva Lectura del Destino</h3>
      <RoadmapTimeline weeks={budgetRoadmap.weeks} />

      {/* Actions */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-subtle">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'results' })} className="text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">[ ← Volver a resultados ]</button>
        <button onClick={() => dispatch({ type: 'RESET' })} className="text-xs uppercase tracking-widest text-text-muted hover:text-error transition-colors">[ ✕ Descartar Tomo ]</button>
      </div>
    </div>
  );
}
