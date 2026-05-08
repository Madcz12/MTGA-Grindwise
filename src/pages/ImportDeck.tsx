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
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-5xl editorial-title mb-4">
          <span className="gold-gradient-text italic">Planifica tus Wildcards</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Descubre cuántos comodines necesitas para armar tu mazo de Standard y
          obtén una hoja de ruta personalizada.
        </p>
      </div>

      {/* Import area */}
      <div className="grimoire-card p-8 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <label className="block text-sm uppercase tracking-widest text-text-secondary mb-4">
          Pega tu lista de mazo (Formato MTGA)
        </label>
        <textarea
          value={deckText}
          onChange={e => setDeckText(e.target.value)}
          placeholder={`Deck\n4 Lightning Bolt (M21) 166\n2 Snapcaster Mage (ISD) 78\n...\n\nSideboard\n3 Mystical Dispute (ELD) 58`}
          className="input-field font-mono text-sm resize-none"
          rows={14}
          spellCheck={false}
          disabled={isLoading}
        />
      </div>

      {/* Example button */}
      <div className="flex items-center justify-between mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <button
          onClick={() => setDeckText(EXAMPLE_DECK)}
          className="text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          disabled={isLoading}
        >
          [ Cargar Tomo de Ejemplo ]
        </button>

        <button
          onClick={handleAnalyze}
          className="btn-primary"
          disabled={isLoading || !deckText.trim()}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {loadingMessage}
            </span>
          ) : (
            'Descifrar Tomo'
          )}
        </button>
      </div>

      {/* Progress bar */}
      {isLoading && progress.total > 0 && (
        <div className="mb-8">
          <div className="w-full h-[1px] bg-border-subtle relative">
            <div
              className="absolute top-0 left-0 h-[1px] bg-accent transition-all duration-300"
              style={{ width: `${(progress.loaded / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted mt-2 text-center font-mono">
            Procesando {progress.loaded} de {progress.total}
          </p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="grimoire-card border-error p-6 mb-8 bg-error/5 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-error mb-4 font-bold">Inscripciones Corruptas Detectadas:</p>
          <ul className="space-y-2">
            {errors.map((err, i) => (
              <li key={i} className="text-sm font-mono text-error/80 before:content-['>'] before:mr-2 before:text-error/50">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Feature cards */}
      <div className="grid-auto mt-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
        {[
          { title: 'Inventario', desc: 'Calcula exactamente qué comodines te faltan por rareza' },
          { title: 'Hoja de Ruta', desc: 'Plan semana a semana basado en oro y track' },
          { title: 'Sustitutos', desc: 'Alternativas más económicas para cartas Míticas/Raras' },
        ].map((f, i) => (
          <div key={f.title} className="grimoire-card p-6 border-t-2 border-t-border-subtle hover:border-t-accent text-center">
            <span className="editorial-number text-2xl block mb-3 opacity-50">0{i + 1}</span>
            <h3 className="text-sm uppercase tracking-widest text-text-primary mb-2 font-medium">{f.title}</h3>
            <p className="text-sm text-text-secondary font-serif italic">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
