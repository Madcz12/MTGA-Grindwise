import type { DeckEntry, Rarity } from '../types';

// ─── Scryfall Response Types ────────────────────────────────────────

interface ScryfallCard {
  name: string;
  rarity: string;
  set: string;
  collector_number: string;
  legalities: {
    standard: string;
    [key: string]: string;
  };
  image_uris?: {
    art_crop: string;
    small: string;
    normal: string;
    [key: string]: string;
  };
  card_faces?: Array<{
    image_uris?: {
      art_crop: string;
      small: string;
      normal: string;
      [key: string]: string;
    };
  }>;
  mana_cost?: string;
  type_line?: string;
}

interface ScryfallCollectionResponse {
  data: ScryfallCard[];
  not_found: Array<{ name?: string; set?: string; collector_number?: string }>;
}

interface ScryfallSearchResponse {
  data: ScryfallCard[];
  has_more: boolean;
  total_cards: number;
}

// ─── Cache ──────────────────────────────────────────────────────────

const CACHE_PREFIX = 'wcp_scryfall_';

function getCacheKey(setCode: string, collectorNumber: string): string {
  return `${CACHE_PREFIX}${setCode}_${collectorNumber}`;
}

function getFromCache(setCode: string, collectorNumber: string): ScryfallCard | null {
  try {
    const key = getCacheKey(setCode, collectorNumber);
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function saveToCache(card: ScryfallCard): void {
  try {
    const key = getCacheKey(card.set, card.collector_number);
    sessionStorage.setItem(key, JSON.stringify(card));
  } catch {
    // sessionStorage full — silently ignore
  }
}

// ─── Rate Limiting ──────────────────────────────────────────────────

const RATE_LIMIT_MS = 500; // Scryfall: max 2 requests/second
let lastRequestTime = 0;

async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return fetch(url, options);
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Enrich deck entries with rarity, legality, and image data from Scryfall.
 * Uses the /cards/collection batch endpoint (max 75 per request).
 * Results are cached in sessionStorage.
 */
export async function enrichDeckEntries(
  entries: DeckEntry[],
  onProgress?: (loaded: number, total: number) => void
): Promise<{ enriched: DeckEntry[]; notFound: string[] }> {
  // Separate cached vs. uncached entries
  const enriched: DeckEntry[] = [];
  const uncachedEntries: DeckEntry[] = [];

  for (const entry of entries) {
    const cached = getFromCache(entry.setCode, entry.collectorNumber);
    if (cached) {
      enriched.push(applyCardData(entry, cached));
    } else {
      uncachedEntries.push(entry);
    }
  }

  if (uncachedEntries.length === 0) {
    onProgress?.(entries.length, entries.length);
    return { enriched, notFound: [] };
  }

  // Batch into chunks of 75
  const chunks = chunkArray(uncachedEntries, 75);
  const notFound: string[] = [];
  let loadedCount = enriched.length;

  for (const chunk of chunks) {
    const identifiers = chunk.map(entry => {
      if (entry.setCode && entry.collectorNumber) {
        return { set: entry.setCode, collector_number: entry.collectorNumber };
      }
      return { name: entry.name };
    });

    try {
      const response = await rateLimitedFetch(
        'https://api.scryfall.com/cards/collection',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifiers }),
        }
      );

      if (!response.ok) {
        // Fallback: try by name for each card in the chunk
        for (const entry of chunk) {
          const fallback = await fetchByName(entry.name);
          if (fallback) {
            enriched.push(applyCardData(entry, fallback));
            saveToCache(fallback);
          } else {
            notFound.push(entry.name);
            enriched.push(entry);
          }
          loadedCount++;
          onProgress?.(loadedCount, entries.length);
        }
        continue;
      }

      const data: ScryfallCollectionResponse = await response.json();

      // Process found cards
      for (const card of data.data) {
        saveToCache(card);
        const matchingEntry = chunk.find(e => {
          if (e.setCode && e.collectorNumber) {
            return e.setCode === card.set && e.collectorNumber === card.collector_number;
          }
          return e.name.toLowerCase() === card.name.toLowerCase();
        });
        if (matchingEntry) {
          enriched.push(applyCardData(matchingEntry, card));
        }
      }

      // Process not-found cards — retry by name
      for (const nf of data.not_found) {
        const matchingEntry = chunk.find(e => {
          if (e.setCode && e.collectorNumber) {
            return e.setCode === nf.set && e.collectorNumber === nf.collector_number;
          }
          return e.name.toLowerCase() === (nf.name || '').toLowerCase();
        });
        if (matchingEntry) {
          const fallback = await fetchByName(matchingEntry.name);
          if (fallback) {
            enriched.push(applyCardData(matchingEntry, fallback));
            saveToCache(fallback);
          } else {
            notFound.push(matchingEntry.name);
            enriched.push(matchingEntry);
          }
        }
      }

      loadedCount += chunk.length;
      onProgress?.(loadedCount, entries.length);

    } catch (error) {
      console.error('Scryfall API error:', error);
      // Add entries without enrichment
      for (const entry of chunk) {
        enriched.push(entry);
        notFound.push(entry.name);
      }
      loadedCount += chunk.length;
      onProgress?.(loadedCount, entries.length);
    }
  }

  return { enriched, notFound };
}

/**
 * Search Scryfall for budget substitutes: same color, same type, lower rarity.
 */
export async function searchBudgetSubstitutes(
  card: DeckEntry,
  maxResults: number = 5
): Promise<ScryfallCard[]> {
  if (!card.typeLine) return [];

  // Extract main type (e.g., "Creature" from "Legendary Creature — Elf Warrior")
  const mainType = extractMainType(card.typeLine);
  if (!mainType) return [];

  // Build Scryfall search query
  const targetRarity = card.rarity === 'mythic' ? 'rare' : 'uncommon';
  const query = `t:${mainType} r<=${targetRarity} f:standard`;

  try {
    const response = await rateLimitedFetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=edhrec&dir=desc`
    );

    if (!response.ok) return [];

    const data: ScryfallSearchResponse = await response.json();
    return data.data
      .filter(c => c.name !== card.name)
      .slice(0, maxResults);
  } catch {
    return [];
  }
}

// ─── Helpers ────────────────────────────────────────────────────────

async function fetchByName(name: string): Promise<ScryfallCard | null> {
  try {
    const response = await rateLimitedFetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function applyCardData(entry: DeckEntry, card: ScryfallCard): DeckEntry {
  const imageUri =
    card.image_uris?.art_crop ||
    card.card_faces?.[0]?.image_uris?.art_crop ||
    card.image_uris?.small ||
    '';

  return {
    ...entry,
    rarity: mapRarity(card.rarity),
    isLegalStandard: card.legalities.standard === 'legal',
    imageUri,
    manaCost: card.mana_cost || '',
    typeLine: card.type_line || '',
  };
}

function mapRarity(scryfallRarity: string): Rarity {
  switch (scryfallRarity) {
    case 'common': return 'common';
    case 'uncommon': return 'uncommon';
    case 'rare': return 'rare';
    case 'mythic': return 'mythic';
    default: return 'common';
  }
}

function extractMainType(typeLine: string): string | null {
  const types = ['creature', 'instant', 'sorcery', 'enchantment', 'artifact', 'planeswalker'];
  const lower = typeLine.toLowerCase();
  for (const type of types) {
    if (lower.includes(type)) return type;
  }
  return null;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
