import type { BudgetAnalysis, BudgetSubstitution, DeckEntry, Rarity, WildcardGap, WildcardInventory } from '../types';
import { BUDGET_THRESHOLDS } from '../constants/economy';
import { searchBudgetSubstitutes } from './scryfallApi';
import { calculateWildcardGap } from './wildcardCalc';

/**
 * Analyze whether a budget version of the deck should be suggested,
 * and if so, generate substitution recommendations.
 */
export async function analyzeBudget(
  entries: DeckEntry[],
  gap: WildcardGap,
  inventory: WildcardInventory,
  ownedCards: Map<string, number>,
  onProgress?: (current: number, total: number) => void
): Promise<BudgetAnalysis> {
  const shouldSuggest =
    gap.mythic.gap > BUDGET_THRESHOLDS.MYTHIC_GAP_THRESHOLD ||
    gap.rare.gap > BUDGET_THRESHOLDS.RARE_GAP_THRESHOLD;

  if (!shouldSuggest) {
    return {
      substitutions: [],
      originalGap: gap,
      budgetGap: gap,
      totalWildcardsSaved: 0,
      shouldSuggestBudget: false,
    };
  }

  // Find expensive cards to substitute (Mythic first, then Rare)
  const expensiveCards = entries
    .filter(e => {
      if (!e.rarity) return false;
      const key = `${e.name}|${e.setCode}`;
      const owned = ownedCards.get(key) || 0;
      const missing = e.quantity - owned;
      return missing > 0 && (e.rarity === 'mythic' || e.rarity === 'rare');
    })
    .sort((a, b) => {
      // Mythics first, then by missing quantity
      const rarityOrder: Record<Rarity, number> = { mythic: 0, rare: 1, uncommon: 2, common: 3 };
      const ra = rarityOrder[a.rarity!];
      const rb = rarityOrder[b.rarity!];
      if (ra !== rb) return ra - rb;
      return b.quantity - a.quantity;
    })
    .slice(0, 8); // Limit to 8 most expensive cards

  const substitutions: BudgetSubstitution[] = [];
  let processed = 0;

  for (const card of expensiveCards) {
    const alternatives = await searchBudgetSubstitutes(card, 3);

    if (alternatives.length > 0) {
      const best = alternatives[0];
      substitutions.push({
        original: card,
        substitute: {
          name: best.name,
          rarity: best.rarity as Rarity,
          setCode: best.set,
          imageUri: best.image_uris?.art_crop || '',
          typeLine: best.type_line || '',
        },
        wildcardsSaved: {
          rarity: card.rarity!,
          count: card.quantity - (ownedCards.get(`${card.name}|${card.setCode}`) || 0),
        },
      });
    }

    processed++;
    onProgress?.(processed, expensiveCards.length);
  }

  // Calculate new gap with substitutions applied
  const budgetEntries = entries.map(entry => {
    const sub = substitutions.find(s => s.original.name === entry.name && s.original.setCode === entry.setCode);
    if (sub) {
      return {
        ...entry,
        name: sub.substitute.name,
        rarity: sub.substitute.rarity,
        setCode: sub.substitute.setCode,
      };
    }
    return entry;
  });

  const budgetGap = calculateWildcardGap(budgetEntries, inventory, ownedCards);
  const totalWildcardsSaved = substitutions.reduce((sum, sub) => sum + sub.wildcardsSaved.count, 0);

  return {
    substitutions,
    originalGap: gap,
    budgetGap,
    totalWildcardsSaved: Math.max(0, totalWildcardsSaved),
    shouldSuggestBudget: true,
  };
}
