import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { CardRow } from '../components/CardRow';
import { calculateWildcardGap } from '../utils/wildcardCalc';
import { generateRoadmap } from '../utils/roadmapCalc';
import { analyzeBudget } from '../utils/budgetSuggest';
import type { PlayHours, Rarity } from '../types';
import { getCardKey } from '../utils/mtgaParser';

const HOURS_OPTIONS: { value: PlayHours; label: string }[] = [
  { value: 0.5, label: '30 min' },
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 3, label: '3+ horas' },
];

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function AccountState() {
  const state = useDeckState();
  const dispatch = useDeckDispatch();
  const { enrichedEntries, wildcardInventory, ownedCards, currentGold, sessionProfile } = state;

  const maindeckEntries = enrichedEntries.filter(e => e.section === 'deck');
  const sideboardEntries = enrichedEntries.filter(e => e.section === 'sideboard');

  function handleWildcardChange(rarity: Rarity, value: number) {
    dispatch({
      type: 'SET_WILDCARD_INVENTORY',
      inventory: { ...wildcardInventory, [rarity]: Math.max(0, value) },
    });
  }

  function handleOwnedChange(entry: typeof enrichedEntries[0], copies: number) {
    dispatch({ type: 'SET_OWNED_CARD', cardKey: getCardKey(entry), copies });
  }

  async function handleCalculate() {
    dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Calculando...' });

    const gap = calculateWildcardGap(enrichedEntries, wildcardInventory, ownedCards);
    dispatch({ type: 'SET_WILDCARD_GAP', gap });

    const roadmap = generateRoadmap(gap, sessionProfile, currentGold);
    dispatch({ type: 'SET_ROADMAP', roadmap });

    dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Analizando opciones budget...' });
    const budget = await analyzeBudget(enrichedEntries, gap, wildcardInventory, ownedCards);
    dispatch({ type: 'SET_BUDGET_ANALYSIS', analysis: budget });

    dispatch({ type: 'SET_LOADING', isLoading: false });
    dispatch({ type: 'SET_SCREEN', screen: 'results' });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-slide-up">
        <h2 className="text-4xl brutalist-title text-text-primary mb-3">Tu Estado de Cuenta</h2>
        <p className="text-text-secondary uppercase tracking-widest text-xs">Indica qué cartas y wildcards ya tienes para un cálculo preciso</p>
      </div>

      {/* Wildcard inventory */}
      <div className="brutalist-card-glow p-8 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-xs uppercase tracking-widest text-accent mb-6 font-bold">Wildcards Disponibles en el Tomo</h3>
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-6">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map(rarity => {
            const icons: Record<Rarity, string> = { common: '●', uncommon: '◆', rare: '★', mythic: '✦' };
            const colors: Record<Rarity, string> = { common: '#9ca3af', uncommon: '#c0c0c0', rare: '#d4af37', mythic: '#e85d26' };
            return (
              <div key={rarity} className="flex flex-col items-center gap-3 p-4 border border-border-subtle bg-bg-primary/50 relative group">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span style={{ color: colors[rarity] }} className="text-2xl drop-shadow-md">{icons[rarity]}</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={wildcardInventory[rarity]}
                  onChange={e => handleWildcardChange(rarity, parseInt(e.target.value) || 0)}
                  className="input-field text-center font-serif font-bold text-2xl w-24 bg-transparent border-b-accent border-t-0 border-l-0 border-r-0 focus:bg-accent/10 focus:ring-0 px-0"
                />
                <span className="text-[10px] uppercase tracking-widest text-text-muted">{rarity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gold */}
      <div className="brutalist-card p-8 mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
          <div className="w-full">
            <h3 className="text-xs uppercase tracking-widest text-text-primary mb-4">🪙 Oro Actual (opcional)</h3>
            <input
              type="number"
              min={0}
              step={100}
              value={currentGold}
              onChange={e => dispatch({ type: 'SET_CURRENT_GOLD', gold: parseInt(e.target.value) || 0 })}
              className="input-field font-mono w-40"
              placeholder="0"
            />
          </div>
          <div className="w-full">
            <h3 className="text-xs uppercase tracking-widest text-text-primary mb-4">🕐 Horas de juego por día</h3>
            <div className="flex gap-2 flex-wrap">
              {HOURS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => dispatch({ type: 'SET_HOURS_PER_DAY', hours: opt.value })}
                  className={`px-4 py-2 border text-xs tracking-wider transition-all ${
                    sessionProfile.hoursPerDay === opt.value
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-border-subtle text-text-secondary hover:border-text-muted hover:text-text-primary bg-transparent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border-subtle">
          <h3 className="text-xs uppercase tracking-widest text-text-primary mb-4">📅 Días que juegas a la semana</h3>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, i) => {
              const dayNum = i + 1;
              const isActive = dayNum <= sessionProfile.daysPerWeek;
              return (
                <button
                  key={day}
                  onClick={() => dispatch({ type: 'SET_DAYS_PER_WEEK', days: isActive && dayNum === sessionProfile.daysPerWeek ? dayNum - 1 : dayNum })}
                  className={`w-12 h-12 border flex items-center justify-center text-sm font-serif transition-all ${
                    isActive
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-border-subtle text-text-muted hover:border-text-muted hover:text-text-primary bg-transparent'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card list */}
      <div className="brutalist-card p-8 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-xs uppercase tracking-widest text-text-primary mb-6 border-b border-border-subtle pb-2">Contenido del Mazo ({maindeckEntries.length} inscripciones)</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {maindeckEntries.map((entry, i) => (
            <CardRow
              key={`${entry.name}-${entry.setCode}-${i}`}
              entry={entry}
              copiesOwned={ownedCards.get(getCardKey(entry)) || 0}
              onOwnedChange={copies => handleOwnedChange(entry, copies)}
            />
          ))}
        </div>

        {sideboardEntries.length > 0 && (
          <>
            <h3 className="text-xs uppercase tracking-widest text-text-primary mt-8 mb-6 border-b border-border-subtle pb-2">Sideboard ({sideboardEntries.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {sideboardEntries.map((entry, i) => (
                <CardRow
                  key={`sb-${entry.name}-${entry.setCode}-${i}`}
                  entry={entry}
                  copiesOwned={ownedCards.get(getCardKey(entry)) || 0}
                  onOwnedChange={copies => handleOwnedChange(entry, copies)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '300ms' }}>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'import' })} className="text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
          [ ← Volver al principio ]
        </button>
        <button onClick={handleCalculate} className="btn-primary" disabled={state.isLoading}>
          {state.isLoading ? 'Consultando los astros...' : 'Trazar Hoja de Ruta'}
        </button>
      </div>
    </div>
  );
}
