import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { calculateCompletionPercent } from '../utils/wildcardCalc';
import { formatDuration } from '../utils/roadmapCalc';
import type { Rarity } from '../types';

export function Results() {
  const { wildcardGap, roadmap } = useDeckState();
  const dispatch = useDeckDispatch();

  if (!wildcardGap || !roadmap) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <p className="text-sm font-medium text-on-surface-variant">El pergamino está en blanco. Inicia tu lectura.</p>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'import' })} className="px-8 py-2 rounded bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider mt-8 btn-shimmer">
          Comenzar
        </button>
      </div>
    );
  }

  const completion = calculateCompletionPercent(wildcardGap);

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'text-surface-variant';
      case 'uncommon': return 'text-secondary-fixed';
      case 'rare': return 'text-primary-container';
      case 'mythic': return 'text-error';
    }
  };

  const getRarityBg = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'bg-surface-variant';
      case 'uncommon': return 'bg-secondary-fixed';
      case 'rare': return 'bg-primary-container';
      case 'mythic': return 'bg-error';
    }
  };

  const getRarityIcon = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'diamond';
      case 'uncommon': return 'diamond';
      case 'rare': return 'star';
      case 'mythic': return 'local_fire_department';
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12 animate-slide-up">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Hoja de Ruta</h1>
        <p className="text-base text-on-surface-variant">El camino proyectado para completar tu mazo</p>
      </div>

      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Card */}
        <div className="bg-surface-container-low backdrop-blur-md rounded-xl p-8 border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-variant/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
              <path className="text-secondary-container drop-shadow-[0_0_8px_rgba(0,241,254,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${completion}, 100`} strokeLinecap="round" strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-on-surface">{completion}%</span>
            </div>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Completado</span>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-surface-container-low backdrop-blur-md rounded-xl p-8 border border-outline-variant/30 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-5 text-[120px] font-bold leading-none select-none pointer-events-none">W</div>
          <h2 className="text-4xl font-bold text-on-surface mb-2">~{formatDuration(roadmap.totalWeeks)}</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-auto">Tiempo Estimado</span>
        </div>

        {/* Packs Needed Card */}
        <div className="bg-surface-container-low backdrop-blur-md rounded-xl p-8 border border-outline-variant/30 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-5 text-[120px] font-bold leading-none select-none pointer-events-none">P</div>
          <h2 className="text-5xl font-bold text-on-surface mb-1">{roadmap.totalPacksNeeded}</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Sobres Necesarios</span>
          <div className="bg-secondary-container/10 border border-secondary-container/30 px-3 py-1 rounded-full text-secondary-container text-[10px] font-bold uppercase">
            ~{roadmap.totalGoldNeeded.toLocaleString()} ORO
          </div>
        </div>
      </div>

      {/* Middle Row: Wildcards */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Comodines Faltantes</h3>
          <div className="h-px bg-outline-variant/30 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map((rarity) => (
            <div key={rarity} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20 shadow-sm relative overflow-hidden group hover:border-outline-variant/50 transition-colors">
              <div className={`absolute top-0 left-0 w-full h-1 ${getRarityBg(rarity)}`}></div>
              <div className="flex justify-between items-center mb-4">
                <div className={`flex items-center gap-2 ${getRarityColor(rarity)}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {getRarityIcon(rarity)}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">{rarity}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-on-surface">{wildcardGap[rarity].gap}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Faltantes</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60">
                <span>REQ: {wildcardGap[rarity].needed}</span>
                <span>OWN: {wildcardGap[rarity].have}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mythic Alert */}
        {wildcardGap.mythic.gap > 0 && (
          <div className="bg-primary-container/5 border border-primary-container/30 rounded-lg p-4 flex gap-4 items-start shadow-sm mt-4">
            <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <h4 className="text-base font-bold text-primary-container uppercase tracking-tight mb-1">Advertencia de Rareza Mítica</h4>
              <p className="text-sm text-on-surface-variant">
                Las wildcards míticas no tienen un ciclo garantizado (aprox. 1 cada 72 sobres). La proyección es conservadora; podrías necesitar abrir más sobres o usar gemas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Schedule */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cronograma de Adquisición</h3>
          <div className="h-px bg-outline-variant/30 flex-1"></div>
        </div>
        <RoadmapTimeline weeks={roadmap.weeks} />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-outline-variant/10">
        <button 
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'account' })} 
          className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span> Modificar Inventario
        </button>
        <button 
          onClick={() => dispatch({ type: 'RESET' })} 
          className="text-xs font-bold uppercase tracking-wider text-error/60 hover:text-error transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">close</span> Descartar Análisis
        </button>
      </div>
    </div>
  );
}

