import { useState, useRef } from 'react';
import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { parseMTGADeck, validateDeck, getCardKey } from '../utils/mtgaParser';
import { enrichDeckEntries } from '../utils/scryfallApi';
import { calculateWildcardGap } from '../utils/wildcardCalc';
import { generateRoadmap } from '../utils/roadmapCalc';
import type { PlayHours, Rarity } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const HOURS_OPTIONS: { value: PlayHours; labelKey: string }[] = [
  { value: 0.5, labelKey: 'importDeck.config.options.min30' },
  { value: 1, labelKey: 'importDeck.config.options.hour1' },
  { value: 2, labelKey: 'importDeck.config.options.hour2' },
  { value: 3, labelKey: 'importDeck.config.options.hour3' },
];

const DAYS_KEYS = [
  'importDeck.config.options.mon',
  'importDeck.config.options.tue',
  'importDeck.config.options.wed',
  'importDeck.config.options.thu',
  'importDeck.config.options.fri',
  'importDeck.config.options.sat',
  'importDeck.config.options.sun',
];

const EXAMPLE_DECK = `Deck
4 Heartfire Hero (BLB) 138
4 Manifold Mouse (BLB) 27
4 Emberheart Challenger (DSK) 133
3 Screaming Nemesis (DSK) 157
4 Monastery Swiftspear (BRO) 144
4 Monstrous Rage (WOE) 142
4 Turn Inside Out (BLB) 155
4 Witch's Mark (DSK) 159
3 Shock (FDN) 164
2 Might of the Meek (BLB) 25
4 Inspiring Vantage (FDN) 268
4 Battlefield Forge (BRO) 257
6 Mountain (BLB) 275
6 Plains (BLB) 272

Sideboard
3 Path of Peril (VOW) 124
2 Rending Volley (OTJ) 144
`;

export function ImportDeck() {
  const { isLoading, enrichedEntries, ownedCards, wildcardInventory, currentGold, sessionProfile } = useDeckState();
  const dispatch = useDeckDispatch();
  const { t } = useLanguage();
  const [deckText, setDeckText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [hoverCard, setHoverCard] = useState<{ src: string; x: number; y: number } | null>(null);
  const [goldText, setGoldText] = useState(currentGold > 0 ? String(currentGold) : '');
  const cardImageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  async function handleCalculateRoadmap() {
    dispatch({ type: 'SET_LOADING', isLoading: true, message: t('importDeck.config.calculating') });

    // Artificial delay to show the loader to the user
    await new Promise(resolve => setTimeout(resolve, 1200));

    const gap = calculateWildcardGap(enrichedEntries, wildcardInventory, ownedCards);
    dispatch({ type: 'SET_WILDCARD_GAP', gap });

    const roadmap = generateRoadmap(gap, sessionProfile, currentGold);
    dispatch({ type: 'SET_ROADMAP', roadmap });

    dispatch({ type: 'SET_LOADING', isLoading: false });
    dispatch({ type: 'SET_SCREEN', screen: 'results' });
  }

  async function handleAnalyze() {
    if (!deckText.trim()) {
      setErrors([t('importDeck.status.pasteFormat')]);
      return;
    }

    setErrors([]);
    dispatch({ type: 'SET_LOADING', isLoading: true, message: t('importDeck.status.parsing') });

    const parsed = parseMTGADeck(deckText);

    if (parsed.entries.length === 0) {
      setErrors([t('importDeck.status.noValidCards')]);
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return;
    }

    const parseErrors = parsed.errors.map(e => `Line ${e.line}: ${e.reason}`);
    const warnings = validateDeck(parsed);

    if (parseErrors.length > 0) {
      setErrors([...parseErrors, ...warnings]);
    }

    dispatch({ type: 'SET_DECK', deck: parsed });
    dispatch({ type: 'SET_LOADING', isLoading: true, message: t('importDeck.status.queryingScryfall') });

    try {
      const { enriched, notFound } = await enrichDeckEntries(
        parsed.entries,
        (loaded, total) => {
          setProgress({ loaded, total });
          dispatch({
            type: 'SET_LOADING',
            isLoading: true,
            message: t('importDeck.status.loadingCards') + ` ${loaded}/${total}`,
          });
        }
      );

      const illegalCards = enriched.filter(e => e.isLegalStandard === false);
      if (illegalCards.length > 0) {
        setErrors(prev => [
          ...prev,
          ...illegalCards.map(c => `⚠️ "${c.name}" ${t('importDeck.status.illegalStandard')}`),
        ]);
      }

      if (notFound.length > 0) {
        setErrors(prev => [
          ...prev,
          ...notFound.map(n => `❌ ${t('importDeck.status.notFound')} "${n}"`),
        ]);
      }

      dispatch({ type: 'SET_ENRICHED_ENTRIES', entries: enriched });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      // Remove auto-forwarding so user can see loaded cards, then manually go to roadmap
    } catch (err) {
      setErrors(prev => [...prev, `${t('importDeck.status.networkError')} ${err}`]);
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="mb-4 text-center">
        <div className="mb-2 flex justify-center">
          <img src="/logogrindwise.png" alt="Grindwise Logo" className="h-16 md:h-48 object-contain -mt-16" />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant max-w-4xl mx-auto -mt-12">
          {t('importDeck.hero.description')}
        </p>
      </div>

      {/* Import Workspace (Bento Grid Style) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 mx-auto">
        
        {/* Main Editor Area */}
        <div className="xl:col-span-8 space-y-6">
          {/* Tabs Panel */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-lg flex flex-col min-h-[500px]">
            <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="px-4 py-1.5 rounded-full bg-surface-variant text-on-surface text-xs font-bold hover:bg-surface-bright transition-colors">{t('importDeck.tabs.mainDeck')}</button>
                <button className="px-4 py-1.5 rounded-full text-on-surface-variant hover:bg-surface-variant/50 text-xs font-bold transition-colors">{t('importDeck.tabs.sideboard')}</button>
                <button className="px-4 py-1.5 rounded-full text-on-surface-variant hover:bg-surface-variant/50 text-xs font-bold transition-colors">{t('importDeck.tabs.considering')}</button>
              </div>
              <button onClick={() => setDeckText(EXAMPLE_DECK)} className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">file_upload</span>
                {t('importDeck.editor.importExample')}
              </button>
            </div>
            
            {/* Textarea Wrapper */}
            <div className="flex-1 p-4 relative flex flex-col bg-surface-dim">
              <label className="sr-only" htmlFor="deck-import">Deck Import Area</label>
              <textarea 
                className="w-full flex-1 bg-transparent border-none text-on-surface font-mono text-sm resize-none focus:ring-0 placeholder:text-outline/50 p-2 input-glow transition-shadow duration-200 outline-none" 
                id="deck-import" 
                placeholder={t('importDeck.editor.placeholder')}
                value={deckText}
                onChange={e => setDeckText(e.target.value)}
                disabled={isLoading}
              ></textarea>
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-outline opacity-50 uppercase tracking-wider">
                {t('importDeck.editor.formatRequired')}
              </div>
            </div>
            
            {/* Loading / Errors area embedded */}
            {isLoading && progress.total > 0 && (
              <div className="p-4 bg-surface-dim border-t border-outline-variant/20">
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 shadow-[0_0_12px_rgba(240,203,68,0.4)]"
                    style={{ width: `${(progress.loaded / progress.total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mt-3 text-center">
                  {t('importDeck.status.processing', { loaded: progress.loaded, total: progress.total })}
                </p>
              </div>
            )}
            {errors.length > 0 && (
              <div className="p-4 bg-error-container/10 border-t border-error/20">
                <ul className="space-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-xs text-error flex gap-2"><span className="material-symbols-outlined text-[14px]">warning</span> {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center glass-panel p-4 rounded-xl shadow-lg">
            <button onClick={() => { setDeckText(''); setErrors([]); dispatch({ type: 'SET_ENRICHED_ENTRIES', entries: [] }); }} className="px-6 py-2 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors text-xs font-bold uppercase tracking-wider">
              {t('importDeck.actions.clear')}
            </button>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded bg-surface-variant text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-bold uppercase tracking-wider">
                {t('importDeck.actions.cancel')}
              </button>
              <button 
                onClick={handleAnalyze} 
                disabled={isLoading || !deckText.trim()}
                className="px-8 py-2 rounded bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all btn-shimmer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isLoading && <span className="inline-block w-3 h-3 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin" />}
                {isLoading ? t('importDeck.actions.consulting') : t('importDeck.actions.loadDeck')}
              </button>
            </div>
          </div>

          {/* Loaded Cards State */}
          {enrichedEntries.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden shadow-lg mt-6 animate-slide-up">
              <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/30 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">{t('importDeck.cards.loaded')}</h3>
                <span className="text-xs font-bold text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">{enrichedEntries.length} {t('importDeck.cards.unique')}</span>
              </div>
              <div className="p-4 space-y-2 relative">
                {enrichedEntries.map((card, idx) => {
                  const previewSrc = card.cardImageUri || card.imageUri;
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 sm:gap-4 rounded-lg bg-surface-dim border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          ref={(el) => { if (el) cardImageRefs.current.set(idx, el); }}
                          className="flex-shrink-0 cursor-pointer"
                          onMouseEnter={() => {
                            if (!previewSrc) return;
                            const el = cardImageRefs.current.get(idx);
                            if (el) {
                              const rect = el.getBoundingClientRect();
                              setHoverCard({ src: previewSrc, x: rect.right + 16, y: rect.top + rect.height / 2 });
                            }
                          }}
                          onMouseLeave={() => setHoverCard(null)}
                        >
                          {card.imageUri ? (
                            <img alt={card.name} className="w-12 h-12 rounded object-cover border border-outline-variant/50 hover:scale-110 transition-transform duration-300" src={card.imageUri} />
                          ) : (
                            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center border border-outline-variant/50">
                              <span className="material-symbols-outlined text-outline">image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-on-surface truncate" title={card.name}>{card.name}</h4>
                          <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider ${card.isLegalStandard ? 'bg-secondary-container/20 text-secondary-container' : 'bg-error/20 text-error'}`}>
                            {card.isLegalStandard ? t('importDeck.cards.standardLegal') : t('importDeck.cards.illegalStandard')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-3 sm:pt-0 border-t border-outline-variant/10 sm:border-t-0 flex-shrink-0">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant whitespace-nowrap">{t('importDeck.cards.ownership')}</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {Array.from({ length: card.quantity + 1 }, (_, i) => {
                            const copiesOwned = ownedCards.get(getCardKey(card)) || 0;
                            return (
                              <button
                                key={i}
                                onClick={() => dispatch({ type: 'SET_OWNED_CARD', cardKey: getCardKey(card), copies: i })}
                                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                  i === copiesOwned
                                    ? 'bg-primary-container border-primary-container text-on-primary-container shadow-md'
                                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60'
                                }`}
                              >
                                {i}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Hover card preview */}
                {hoverCard && (
                  <div
                    className="card-preview-popup"
                    style={{ left: `${hoverCard.x}px`, top: `${hoverCard.y}px` }}
                  >
                    <img src={hoverCard.src} alt="Card preview" className="w-full h-full object-contain rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Player Configuration (Wildcards, Gold, Profile) */}
          {enrichedEntries.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden shadow-lg mt-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/30">
                <h3 className="text-xl font-bold text-primary">{t('importDeck.config.title')}</h3>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Wildcard inventory */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed mb-4">{t('importDeck.config.wildcards')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map(rarity => {
                      const icons: Record<Rarity, string> = { common: '●', uncommon: '◆', rare: '★', mythic: '✦' };
                      const borderColors: Record<Rarity, string> = { 
                        common: 'border-surface-variant/50 focus-within:border-surface-variant', 
                        uncommon: 'border-secondary-fixed/30 focus-within:border-secondary-fixed', 
                        rare: 'border-primary-container/30 focus-within:border-primary-container', 
                        mythic: 'border-error/30 focus-within:border-error' 
                      };
                      const textColors: Record<Rarity, string> = { common: 'text-outline', uncommon: 'text-secondary-fixed', rare: 'text-primary-container', mythic: 'text-error' };
                      
                      return (
                        <div key={rarity} className={`flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-container-low border ${borderColors[rarity]} transition-all duration-300`}>
                          <span className={`text-xl ${textColors[rarity]}`}>{icons[rarity]}</span>
                          <input
                            type="number"
                            min={0}
                            max={999}
                            value={wildcardInventory[rarity]}
                            onChange={e => {
                              dispatch({
                                type: 'SET_WILDCARD_INVENTORY',
                                inventory: { ...wildcardInventory, [rarity]: Math.max(0, parseInt(e.target.value) || 0) },
                              });
                            }}
                            className="bg-transparent text-center font-bold text-2xl w-full focus:outline-none text-on-surface"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{t(`rarity.${rarity}`)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/20">
                  {/* Gold */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">monetization_on</span> {t('importDeck.config.currentGold')}
                    </h4>
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
                      className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-secondary-fixed rounded-lg p-3 text-xl font-bold text-on-surface focus:outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>

                  {/* Profile */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {t('importDeck.config.playProfile')}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">{t('importDeck.config.hoursPerDay')}</p>
                        <div className="flex gap-2 flex-wrap">
                          {HOURS_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => dispatch({ type: 'SET_HOURS_PER_DAY', hours: opt.value })}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                                sessionProfile.hoursPerDay === opt.value
                                  ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed shadow-[0_0_8px_rgba(116,245,255,0.4)]'
                                  : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60'
                              }`}
                            >
                              {t(opt.labelKey)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">{t('importDeck.config.daysPerWeek')}</p>
                        <div className="flex gap-2 flex-wrap">
                          {DAYS_KEYS.map((dayKey, i) => {
                            const dayNum = i + 1;
                            const isActive = dayNum <= sessionProfile.daysPerWeek;
                            return (
                              <button
                                key={dayKey}
                                onClick={() => dispatch({ type: 'SET_DAYS_PER_WEEK', days: isActive && dayNum === sessionProfile.daysPerWeek ? dayNum - 1 : dayNum })}
                                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold transition-all ${
                                  isActive
                                    ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed shadow-[0_0_8px_rgba(116,245,255,0.4)]'
                                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60'
                                }`}
                              >
                                {t(dayKey)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex justify-center">
                <button 
                  onClick={handleCalculateRoadmap} 
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 py-3 rounded bg-primary-container text-on-primary-container font-bold text-xs shadow-md hover:shadow-lg transition-all btn-shimmer uppercase tracking-wider disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2">
                  {isLoading && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                  {isLoading ? t('importDeck.config.calculating') : t('importDeck.config.calculate')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Info Panel */}
        <div className="xl:col-span-4 space-y-4 md:space-y-6">
          {/* Stats Card */}
          <div className="glass-panel p-6 rounded-xl shadow-lg border-t border-t-primary/20">
            <h3 className="text-xl font-bold text-secondary-container mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">query_stats</span>
              {t('importDeck.diagnostics.title')}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant text-sm">{t('importDeck.diagnostics.cardsDetected')}</span>
                <span className="text-on-surface text-xl font-bold">{enrichedEntries.reduce((acc, c) => acc + c.quantity, 0) || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant text-sm">{t('importDeck.diagnostics.formatValidity')}</span>
                {enrichedEntries.length === 0 ? (
                  <span className="text-outline text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">pending</span> {t('importDeck.diagnostics.pending')}</span>
                ) : (
                  <span className={enrichedEntries.some(c => !c.isLegalStandard) ? "text-error text-xs font-bold flex items-center gap-1" : "text-secondary-container text-xs font-bold flex items-center gap-1"}>
                    <span className="material-symbols-outlined text-[16px]">{enrichedEntries.some(c => !c.isLegalStandard) ? 'cancel' : 'check_circle'}</span> 
                    {enrichedEntries.some(c => !c.isLegalStandard) ? t('importDeck.diagnostics.invalid') : t('importDeck.diagnostics.valid')}
                  </span>
                )}
              </div>
            </div>

            {/* Wildcard Preview */}
            <div className="mt-6">
              <p className="text-xs font-bold text-outline mb-2 uppercase tracking-wider">{t('importDeck.diagnostics.expectedCost')}</p>
              <div className="flex gap-2">
                <div className={`w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center font-bold ${enrichedEntries.some(c => c.rarity === 'mythic') ? 'text-error border-error/50 bg-error/10' : 'text-on-surface-variant opacity-50'}`} title={t('rarity.mythic')}>M</div>
                <div className={`w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center font-bold ${enrichedEntries.some(c => c.rarity === 'rare') ? 'text-primary-container border-primary-container/50 bg-primary-container/10' : 'text-on-surface-variant opacity-50'}`} title={t('rarity.rare')}>R</div>
                <div className={`w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center font-bold ${enrichedEntries.some(c => c.rarity === 'uncommon') ? 'text-secondary-fixed border-secondary-fixed/50 bg-secondary-fixed/10' : 'text-on-surface-variant opacity-50'}`} title={t('rarity.uncommon')}>U</div>
                <div className={`w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center font-bold ${enrichedEntries.some(c => c.rarity === 'common') ? 'text-surface-variant border-surface-variant/50 bg-surface-variant/10' : 'text-on-surface-variant opacity-50'}`} title={t('rarity.common')}>C</div>
              </div>
            </div>
          </div>

          {/* Tip Section */}
          <div className="glass-panel p-5 rounded-xl border border-secondary-container/20 bg-secondary-container/5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-secondary-container/10">
              <span className="material-symbols-outlined text-[100px]">lightbulb</span>
            </div>
            <h4 className="text-xs font-bold text-secondary-container flex items-center gap-2 mb-2 relative z-10 uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">emoji_objects</span>
              {t('importDeck.diagnostics.didYouKnow')}
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed relative z-10">
              {t('importDeck.diagnostics.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
