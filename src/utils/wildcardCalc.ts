import type { DeckEntry, Rarity, RarityGap, WildcardGap, WildcardInventory } from '../types';

/**
 * Calculate the wildcard gap between what a deck requires
 * and what the player currently has.
 *
 * @param entries - Enriched deck entries (with rarity data)
 * @param inventory - Player's current wildcard inventory
 * @param ownedCards - Map of card keys ("name|setCode") to number of copies owned
 */
export function calculateWildcardGap(
  entries: DeckEntry[],
  inventory: WildcardInventory,
  ownedCards: Map<string, number>
): WildcardGap {
  // Count needed wildcards by rarity
  const needed: WildcardInventory = { common: 0, uncommon: 0, rare: 0, mythic: 0 };
  let deckTotalCards = 0;

  for (const entry of entries) {
    if (!entry.rarity) continue;

    deckTotalCards += entry.quantity;

    const key = `${entry.name}|${entry.setCode}`;
    const owned = ownedCards.get(key) || 0;
    const missing = Math.max(0, entry.quantity - owned);

    if (missing > 0) {
      needed[entry.rarity] += missing;
    }
  }

  // Calculate gap per rarity
  const rarities: Rarity[] = ['common', 'uncommon', 'rare', 'mythic'];
  const gap: Record<string, RarityGap> = {};

  for (const rarity of rarities) {
    const rawGap = Math.max(0, needed[rarity] - inventory[rarity]);
    gap[rarity] = {
      needed: needed[rarity],
      have: inventory[rarity],
      gap: rawGap,
    };
  }

  const totalGap = rarities.reduce((sum, r) => sum + gap[r].gap, 0);

  return {
    common: gap.common,
    uncommon: gap.uncommon,
    rare: gap.rare,
    mythic: gap.mythic,
    totalGap,
    deckTotalCards,
  };
}

/**
 * Calculate the percentage of completion for a deck
 */
export function calculateCompletionPercent(gap: WildcardGap): number {
  if (gap.deckTotalCards === 0) return 100;
  
  // You "have" the cards if they are not part of the missing gap
  const totalCardsOwnedOrCovered = gap.deckTotalCards - gap.totalGap;
  return Math.round((totalCardsOwnedOrCovered / gap.deckTotalCards) * 100);
}

/**
 * Get a summary of the most expensive rarities
 */
export function getRaritySummary(gap: WildcardGap): string {
  const parts: string[] = [];
  if (gap.mythic.gap > 0) parts.push(`${gap.mythic.gap} Mythic`);
  if (gap.rare.gap > 0) parts.push(`${gap.rare.gap} Rare`);
  if (gap.uncommon.gap > 0) parts.push(`${gap.uncommon.gap} Uncommon`);
  if (gap.common.gap > 0) parts.push(`${gap.common.gap} Common`);

  if (parts.length === 0) return '¡Tienes todas las cartas!';
  return `Faltan: ${parts.join(', ')}`;
}
