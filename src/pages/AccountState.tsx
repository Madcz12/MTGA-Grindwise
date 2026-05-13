import { useState } from 'react';
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
  const [goldText, setGoldText] = useState(currentGold > 0 ? String(currentGold) : '');

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
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl font-black tracking-tight text-text-primary mb-4">Estado de Cuenta</h2>
        <p className="text-text-secondary font-medium max-w-xl mx-auto">Indica qué cartas y wildcards ya tienes para un cálculo preciso</p>
      </div>

      {/* Wildcard inventory */}
      <div className="card-modern p-8 mb-8 animate-slide-up bg-slate-900/40 border-emerald-500/10 shadow-2xl shadow-emerald-500/5" style={{ animationDelay: '100ms' }}>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Wildcards en el Tomo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map(rarity => {
            const icons: Record<Rarity, string> = { common: '●', uncommon: '◆', rare: '★', mythic: '✦' };
            const colors: Record<Rarity, string> = { common: 'text-slate-400', uncommon: 'text-slate-300', rare: 'text-amber-400', mythic: 'text-orange-500' };
            return (
              <div key={rarity} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-950/50 border border-slate-800/50 hover:border-emerald-500/30 transition-all duration-300 group">
                <span className={`text-2xl ${colors[rarity]} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform`}>{icons[rarity]}</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={wildcardInventory[rarity]}
                  onChange={e => handleWildcardChange(rarity, parseInt(e.target.value) || 0)}
                  className="bg-transparent text-center font-bold text-3xl w-full focus:outline-none text-text-primary"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{rarity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile & Gold */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 card-modern p-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">🪙 Oro Actual</h3>
          <input
            type="text"
            inputMode="numeric"
            value={goldText}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setGoldText(raw);
              dispatch({ type: 'SET_CURRENT_GOLD', gold: parseInt(raw) || 0 });
            }}
            onBlur={() => {
              const num = parseInt(goldText) || 0;
              setGoldText(num > 0 ? String(num) : '');
            }}
            className="input-modern text-xl font-bold"
            placeholder="0"
          />
        </div>

        <div className="lg:col-span-2 card-modern p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">🕐 Perfil de Juego</h3>
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">Horas por día:</p>
              <div className="flex gap-2 flex-wrap">
                {HOURS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => dispatch({ type: 'SET_HOURS_PER_DAY', hours: opt.value })}
                    className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border ${
                      sessionProfile.hoursPerDay === opt.value
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">Días a la semana:</p>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day, i) => {
                  const dayNum = i + 1;
                  const isActive = dayNum <= sessionProfile.daysPerWeek;
                  return (
                    <button
                      key={day}
                      onClick={() => dispatch({ type: 'SET_DAYS_PER_WEEK', days: isActive && dayNum === sessionProfile.daysPerWeek ? dayNum - 1 : dayNum })}
                      className={`w-11 h-11 rounded-lg border flex items-center justify-center text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card list */}
      <div className="card-modern animate-slide-up mb-12" style={{ animationDelay: '250ms' }}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Contenido del Mazo</h3>
          <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{maindeckEntries.length} Cartas</span>
        </div>
        
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {maindeckEntries.map((entry, i) => (
            <CardRow
              key={`${entry.name}-${entry.setCode}-${i}`}
              entry={entry}
              copiesOwned={ownedCards.get(getCardKey(entry)) || 0}
              onOwnedChange={copies => handleOwnedChange(entry, copies)}
            />
          ))}

          {sideboardEntries.length > 0 && (
            <div className="pt-8">
              <div className="p-4 bg-slate-950/30 rounded-lg mb-4 border border-slate-800/30">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Sideboard ({sideboardEntries.length})</h3>
              </div>
              <div className="space-y-3">
                {sideboardEntries.map((entry, i) => (
                  <CardRow
                    key={`sb-${entry.name}-${entry.setCode}-${i}`}
                    entry={entry}
                    copiesOwned={ownedCards.get(getCardKey(entry)) || 0}
                    onOwnedChange={copies => handleOwnedChange(entry, copies)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <button 
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'import' })} 
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <span className="text-base">←</span> Volver al principio
        </button>
        
        <button 
          onClick={handleCalculate} 
          className="btn-modern-primary w-full md:w-auto min-w-[280px] py-4 text-lg" 
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Calculando...' : 'Trazar Hoja de Ruta'}
        </button>
      </div>
    </div>
  );
}

