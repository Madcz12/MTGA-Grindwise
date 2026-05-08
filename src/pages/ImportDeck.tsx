import { useState } from 'react';
import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';
import { parseMTGADeck, validateDeck } from '../utils/mtgaParser';
import { enrichDeckEntries } from '../utils/scryfallApi';

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
  const { isLoading, loadingMessage } = useDeckState();
  const dispatch = useDeckDispatch();
  const [deckText, setDeckText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  async function handleAnalyze() {
    if (!deckText.trim()) {
      setErrors(['Pega una lista de mazo en formato MTGA']);
      return;
    }

    setErrors([]);
    dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Parseando lista...' });

    const parsed = parseMTGADeck(deckText);

    if (parsed.entries.length === 0) {
      setErrors(['No se encontraron cartas válidas. Verifica el formato MTGA.']);
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return;
    }

    const parseErrors = parsed.errors.map(e => `Línea ${e.line}: ${e.reason}`);
    const warnings = validateDeck(parsed);

    if (parseErrors.length > 0) {
      setErrors([...parseErrors, ...warnings]);
    }

    dispatch({ type: 'SET_DECK', deck: parsed });
    dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Consultando Scryfall...' });

    try {
      const { enriched, notFound } = await enrichDeckEntries(
        parsed.entries,
        (loaded, total) => {
          setProgress({ loaded, total });
          dispatch({
            type: 'SET_LOADING',
            isLoading: true,
            message: `Cargando cartas... ${loaded}/${total}`,
          });
        }
      );

      const illegalCards = enriched.filter(e => e.isLegalStandard === false);
      if (illegalCards.length > 0) {
        setErrors(prev => [
          ...prev,
          ...illegalCards.map(c => `⚠️ "${c.name}" no es legal en Standard`),
        ]);
      }

      if (notFound.length > 0) {
        setErrors(prev => [
          ...prev,
          ...notFound.map(n => `❌ No encontrada en Scryfall: "${n}"`),
        ]);
      }

      dispatch({ type: 'SET_ENRICHED_ENTRIES', entries: enriched });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      dispatch({ type: 'SET_SCREEN', screen: 'account' });
    } catch (err) {
      setErrors(prev => [...prev, `Error de red: ${err}`]);
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-text-primary mb-6">
          Planifica tus <span className="text-emerald-500">Wildcards</span>
        </h2>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Descubre cuántos comodines necesitas para armar tu mazo de Standard y
          obtén una hoja de ruta personalizada.
        </p>
      </div>

      {/* Import area */}
      <div className="relative group animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
        
        <div className="brutalist-card p-8 mb-8 relative">
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-500/80 mb-6">
            Pega tu lista de mazo (Formato MTGA)
          </label>
          <textarea
            value={deckText}
            onChange={e => setDeckText(e.target.value)}
            placeholder={`Deck\n4 Lightning Bolt (M21) 166\n2 Snapcaster Mage (ISD) 78\n...\n\nSideboard\n3 Mystical Dispute (ELD) 58`}
            className="input-field font-mono text-sm resize-none w-full min-h-[350px] bg-slate-950/50 border-emerald-500/30 focus:border-emerald-500 transition-colors"
            spellCheck={false}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <button
          onClick={() => setDeckText(EXAMPLE_DECK)}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors"
          disabled={isLoading}
        >
          [ Cargar Ejemplo ]
        </button>

        <button
          onClick={handleAnalyze}
          className="btn-modern-primary w-full md:w-auto min-w-[240px] py-4 text-lg"
          disabled={isLoading || !deckText.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              {loadingMessage}
            </span>
          ) : (
            'Descifrar Tomo'
          )}
        </button>
      </div>

      {/* Progress bar */}
      {isLoading && progress.total > 0 && (
        <div className="mb-12 animate-fade-in">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              style={{ width: `${(progress.loaded / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-3 text-center">
            Procesando {progress.loaded} de {progress.total}
          </p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 mb-12 animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-6 flex items-center gap-2">
            <span className="text-lg">⚠️</span> Inscripciones Corruptas Detectadas:
          </p>
          <ul className="space-y-3">
            {errors.map((err, i) => (
              <li key={i} className="text-sm font-medium text-slate-400 flex gap-3">
                <span className="text-red-500/50">›</span>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '300ms' }}>
        {[
          { title: 'Inventario', desc: 'Calcula exactamente qué comodines te faltan por rareza', icon: '🎴' },
          { title: 'Hoja de Ruta', desc: 'Plan semana a semana basado en oro y track', icon: '📊' },
          { title: 'Sustitutos', desc: 'Alternativas más económicas para cartas Míticas/Raras', icon: '💡' },
        ].map((f, i) => (
          <div key={f.title} className="card-modern p-8 hover:border-emerald-500/30 transition-colors group">
            <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary mb-3">{f.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

}
