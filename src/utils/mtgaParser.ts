import type { DeckEntry, DeckSection, ParsedDeck, ParseError } from '../types';
import { BASIC_LANDS } from '../constants/economy';

/**
 * Regex to match MTGA export format lines:
 *   {quantity} {card name} ({set code}) {collector number}
 *
 * Examples:
 *   4 Lightning Bolt (M21) 166
 *   2 Atraxa, Praetors' Voice (ONE) 196
 *   1 Jace, the Mind Sculptor (2XM) 56
 */
const MTGA_LINE_REGEX_FULL = /^(\d+)\s+(.+?)\s+\((\w+)\)\s+(\S+)$/;
const MTGA_LINE_REGEX_SIMPLE = /^(\d+)\s+(.+)$/;

/**
 * Section header patterns in MTGA exports
 */
const SECTION_HEADERS: Record<string, DeckSection> = {
  'deck': 'deck',
  'maindeck': 'deck',
  'main deck': 'deck',
  'sideboard': 'sideboard',
  'side': 'sideboard',
  'companion': 'sideboard',
  'commander': 'deck',
};

/**
 * Parse a raw MTGA deck export string into structured DeckEntry objects.
 */
export function parseMTGADeck(rawText: string): ParsedDeck {
  const lines = rawText.split('\n');
  const entries: DeckEntry[] = [];
  const errors: ParseError[] = [];
  let currentSection: DeckSection = 'deck';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    const lowerLine = line.toLowerCase().replace(':', '');
    if (SECTION_HEADERS[lowerLine] !== undefined) {
      currentSection = SECTION_HEADERS[lowerLine];
      continue;
    }

    let quantity = 0;
    let name = '';
    let setCode = '';
    let collectorNumber = '';

    const fullMatch = line.match(MTGA_LINE_REGEX_FULL);
    if (fullMatch) {
      [, quantity, name, setCode, collectorNumber] = fullMatch as unknown as [string, number, string, string, string];
      quantity = parseInt(quantity as unknown as string, 10);
    } else {
      const simpleMatch = line.match(MTGA_LINE_REGEX_SIMPLE);
      if (simpleMatch) {
        [, quantity, name] = simpleMatch as unknown as [string, number, string];
        quantity = parseInt(quantity as unknown as string, 10);
      } else {
        if (/\d/.test(line) && line.length > 3) {
          errors.push({
            line: i + 1,
            text: line,
            reason: 'Línea no reconocida. Debe ser "{cantidad} {nombre}" o incluir set y número.',
          });
        }
        continue;
      }
    }

    // Skip basic lands
    if (BASIC_LANDS.has(name)) {
      continue;
    }

    if (quantity < 1 || quantity > 4) {
      if (currentSection === 'deck' && quantity > 4) {
        errors.push({
          line: i + 1,
          text: line,
          reason: `Cantidad inválida: ${quantity}. Un mazo Standard permite máximo 4 copias de cada carta no básica.`,
        });
      }
    }

    entries.push({
      quantity,
      name,
      setCode: setCode.toLowerCase(),
      collectorNumber,
      section: currentSection,
    });
  }

  return { entries, errors };
}

/**
 * Get a unique key for a card entry (for deduplication and lookups)
 */
export function getCardKey(entry: Pick<DeckEntry, 'name' | 'setCode'>): string {
  return `${entry.name}|${entry.setCode}`;
}

/**
 * Validate that a deck has a reasonable structure
 */
export function validateDeck(deck: ParsedDeck): string[] {
  const warnings: string[] = [];
  const maindeckCards = deck.entries.filter(e => e.section === 'deck');
  const sideboardCards = deck.entries.filter(e => e.section === 'sideboard');

  const maindeckTotal = maindeckCards.reduce((sum, e) => sum + e.quantity, 0);
  const sideboardTotal = sideboardCards.reduce((sum, e) => sum + e.quantity, 0);

  if (maindeckTotal < 60) {
    warnings.push(
      `El maindeck tiene ${maindeckTotal} cartas (sin contar tierras básicas). Un mazo Standard necesita mínimo 60 cartas en total.`
    );
  }

  if (sideboardTotal > 15) {
    warnings.push(
      `El sideboard tiene ${sideboardTotal} cartas. El máximo permitido es 15.`
    );
  }

  return warnings;
}
