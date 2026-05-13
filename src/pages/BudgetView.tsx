import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { RarityBadge } from '../components/RarityBadge';
import { WildcardCounter } from '../components/WildcardCounter';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { generateRoadmap, formatDuration } from '../utils/roadmapCalc';
import type { Rarity } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export function BudgetView() {
  const { budgetAnalysis, sessionProfile, currentGold } = useDeckState();
  const dispatch = useDeckDispatch();
  const { t } = useLanguage();

  if (!budgetAnalysis || !budgetAnalysis.shouldSuggestBudget) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-text-secondary font-medium">{t('budgetView.empty.message')}</p>
        <button 
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'results' })} 
          className="btn-modern-primary mt-8"
        >
          {t('budgetView.empty.back')}
        </button>
      </div>
    );
  }

  const { substitutions, originalGap, budgetGap, totalWildcardsSaved } = budgetAnalysis;
  const budgetRoadmap = generateRoadmap(budgetGap, sessionProfile, currentGold);
  const originalRoadmap = generateRoadmap(originalGap, sessionProfile, currentGold);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">{t('budgetView.header.title')}</h2>
        <p className="text-text-secondary font-medium">{t('budgetView.header.subtitle')}</p>
      </div>

      {/* Savings highlight */}
      <div className="card-modern p-12 mb-16 text-center animate-slide-up bg-slate-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <span className="text-7xl font-black text-emerald-500 block mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
          {totalWildcardsSaved}
        </span>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary mb-6">{t('budgetView.savings.savedWildcards')}</p>
        
        <div className="inline-flex flex-col md:flex-row items-center gap-4 px-6 py-3 bg-slate-950/50 rounded-2xl border border-slate-800">
          <p className="text-sm font-medium text-slate-400">
            {t('budgetView.savings.newTime')} <span className="text-emerald-400 font-black">{formatDuration(budgetRoadmap.totalWeeks, t)}</span>
          </p>
          <div className="hidden md:block w-px h-4 bg-slate-800" />
          <p className="text-sm font-medium text-slate-500">
            {t('budgetView.savings.originalTime')} <span className="text-slate-300 font-bold">{formatDuration(originalRoadmap.totalWeeks, t)}</span>
          </p>
        </div>
      </div>

      {/* Substitution table */}
      <div className="mb-16">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-4">
          {t('budgetView.substitutions.title')}
          <div className="h-px flex-1 bg-slate-800"></div>
        </h3>
        
        <div className="space-y-4">
          {substitutions.map((sub, i) => (
            <div key={i} className="card-modern p-6 animate-slide-up group hover:border-slate-700 transition-colors" style={{ animationDelay: `${150 + i * 50}ms` }}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Original */}
                <div className="w-full md:flex-1">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-12 rounded-lg border border-slate-800 overflow-hidden bg-slate-950 shrink-0">
                      {sub.original.imageUri && (
                        <img src={sub.original.imageUri} alt={sub.original.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-400 truncate line-through decoration-slate-700 decoration-2">{sub.original.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <RarityBadge rarity={sub.original.rarity!} size="sm" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">×{sub.original.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-slate-800 group-hover:text-emerald-500 transition-colors">
                  <span className="text-3xl">→</span>
                </div>

                {/* Substitute */}
                <div className="w-full md:flex-1">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-12 rounded-lg border border-emerald-500/20 overflow-hidden bg-slate-950 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/40 transition-colors">
                      {sub.substitute.imageUri && (
                        <img src={sub.substitute.imageUri} alt={sub.substitute.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-emerald-400 truncate">{sub.substitute.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <RarityBadge rarity={sub.substitute.rarity} size="sm" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 bg-emerald-500 px-2 py-0.5 rounded shadow-lg shadow-emerald-500/20">
                          {t('budgetView.substitutions.saves', { count: sub.wildcardsSaved.count })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 mb-16 animate-fade-in flex gap-6 items-start">
        <div className="text-3xl">ℹ️</div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">{t('budgetView.disclaimer.title')}</p>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            {t('budgetView.disclaimer.message')}
          </p>
        </div>
      </div>

      {/* Budget wildcard gap */}
      <div className="mb-16">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-4">
          {t('budgetView.cost.title')}
          <div className="h-px flex-1 bg-slate-800"></div>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map(rarity => (
            <WildcardCounter key={rarity} rarity={rarity} needed={budgetGap[rarity].needed} have={budgetGap[rarity].have} gap={budgetGap[rarity].gap} />
          ))}
        </div>
      </div>

      {/* Budget roadmap */}
      <div className="mb-20">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-12 flex items-center gap-4">
          {t('budgetView.roadmap.title')}
          <div className="h-px flex-1 bg-slate-800"></div>
        </h3>
        <RoadmapTimeline weeks={budgetRoadmap.weeks} />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 py-10 border-t border-slate-800 animate-slide-up">
        <button 
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'results' })} 
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-text-primary transition-colors flex items-center gap-2"
        >
          {t('budgetView.actions.back')}
        </button>
        
        <button 
          onClick={() => dispatch({ type: 'RESET' })} 
          className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-2"
        >
          {t('budgetView.actions.discard')}
        </button>
      </div>
    </div>
  );
}
