import type {
  Roadmap,
  RoadmapWeek,
  SessionProfile,
  WildcardGap,
  WildcardInventory,
} from '../types';
import { ECONOMY } from '../constants/economy';

/**
 * Generate a week-by-week roadmap showing how long it will take
 * to earn enough wildcards to complete a deck.
 *
 * @param gap - Current wildcard gap
 * @param profile - Player's gaming profile
 * @param currentGold - Gold the player already has
 */
export function generateRoadmap(
  gap: WildcardGap,
  profile: SessionProfile,
  currentGold: number = 0
): Roadmap {
  // If no gap, return empty roadmap
  if (gap.totalGap === 0) {
    return {
      weeks: [],
      totalDays: 0,
      totalWeeks: 0,
      totalPacksNeeded: 0,
      totalGoldNeeded: 0,
    };
  }

  // Calculate total packs needed based on the bottleneck rarity
  const packsForRare = gap.rare.gap * ECONOMY.WILDCARD_TRACK.RARE_EVERY_N_PACKS;
  const packsForMythic = gap.mythic.gap * ECONOMY.WILDCARD_TRACK.MYTHIC_APPROX_EVERY_N_PACKS;
  const packsForUncommon = gap.uncommon.gap * ECONOMY.WILDCARD_TRACK.UNCOMMON_EVERY_N_PACKS;
  const totalPacksNeeded = Math.max(packsForRare, packsForMythic, packsForUncommon, 0);

  // Total gold needed
  const totalGoldFromPacks = totalPacksNeeded * ECONOMY.PACK_COST_GOLD;
  const totalGoldNeeded = Math.max(0, totalGoldFromPacks - currentGold);

  // Calculate gold earned per week based on profile

  // Generate weeks
  const weeks: RoadmapWeek[] = [];
  let goldSaved = currentGold; // Unspent gold carried between weeks
  let packsAccumulated = 0;
  const wildcardAccumulated: WildcardInventory = { common: 0, uncommon: 0, rare: 0, mythic: 0 };

  const maxWeeks = 52; // Safety cap: 1 year
  let weekNum = 1;

  while (!isComplete(wildcardAccumulated, gap) && weekNum <= maxWeeks) {
    const dailyQuestsThisWeek = profile.daysPerWeek;
    const gamesPerDay = profile.hoursPerDay * ECONOMY.GAMES_PER_HOUR_BO1;
    const winsPerDay = Math.min(15, Math.floor(gamesPerDay * ECONOMY.WIN_RATE_DEFAULT));
    const totalWinsThisWeek = winsPerDay * profile.daysPerWeek;

    // Gold from daily quests
    const questGold = dailyQuestsThisWeek * ECONOMY.DAILY_QUEST_GOLD_AVG;

    // Gold from daily wins
    const dailyWinsGold = ECONOMY.DAILY_WIN_REWARDS
      .slice(0, winsPerDay)
      .reduce((sum, g) => sum + g, 0 as number);
    const winsGold = dailyWinsGold * profile.daysPerWeek;

    const goldThisWeek = questGold + winsGold;
    goldSaved += goldThisWeek;

    // Buy packs with saved gold
    let packsThisWeek = Math.floor(goldSaved / ECONOMY.PACK_COST_GOLD);
    goldSaved = goldSaved % ECONOMY.PACK_COST_GOLD; // Keep remainder

    // Add free packs (Mastery Pass, Season Rewards)
    packsThisWeek += ECONOMY.FREE_PACKS_PER_WEEK;

    if (packsThisWeek > 0) {
      packsAccumulated += packsThisWeek;

      // Update wildcard track progress
      wildcardAccumulated.uncommon = Math.floor(
        packsAccumulated / ECONOMY.WILDCARD_TRACK.UNCOMMON_EVERY_N_PACKS
      );
      wildcardAccumulated.rare = Math.floor(
        packsAccumulated / ECONOMY.WILDCARD_TRACK.RARE_EVERY_N_PACKS
      );
      wildcardAccumulated.mythic = Math.floor(
        packsAccumulated / ECONOMY.WILDCARD_TRACK.MYTHIC_APPROX_EVERY_N_PACKS
      );
      // Common wildcards are plentiful, estimate 1 per 3 packs
      wildcardAccumulated.common = Math.floor(packsAccumulated / 3);
    }

    const weekData: RoadmapWeek = {
      weekNumber: weekNum,
      dailyQuestsCompleted: dailyQuestsThisWeek,
      weeklyWinsAchieved: totalWinsThisWeek,
      goldEarned: goldThisWeek,
      goldCumulative: goldSaved + packsAccumulated * ECONOMY.PACK_COST_GOLD,
      packsOpened: packsThisWeek,
      packsCumulative: packsAccumulated,
      wildcardProgress: {
        common: Math.max(0, packsThisWeek > 0 ? Math.floor(packsThisWeek / 3) : 0),
        uncommon: packsThisWeek > 0 ? Math.floor(packsThisWeek / ECONOMY.WILDCARD_TRACK.UNCOMMON_EVERY_N_PACKS) : 0,
        rare: packsAccumulated % ECONOMY.WILDCARD_TRACK.RARE_EVERY_N_PACKS < packsThisWeek ? 1 : 0,
        mythic: packsAccumulated % ECONOMY.WILDCARD_TRACK.MYTHIC_APPROX_EVERY_N_PACKS < packsThisWeek ? 1 : 0,
      },
      wildcardCumulative: { ...wildcardAccumulated },
      isComplete: isComplete(wildcardAccumulated, gap),
    };

    weeks.push(weekData);
    weekNum++;
  }

  const totalDays = (weeks.length) * 7;

  return {
    weeks,
    totalDays,
    totalWeeks: weeks.length,
    totalPacksNeeded,
    totalGoldNeeded: totalGoldNeeded,
  };
}

/**
 * Check if accumulated wildcards meet the gap
 */
function isComplete(accumulated: WildcardInventory, gap: WildcardGap): boolean {
  return (
    accumulated.common >= gap.common.gap &&
    accumulated.uncommon >= gap.uncommon.gap &&
    accumulated.rare >= gap.rare.gap &&
    accumulated.mythic >= gap.mythic.gap
  );
}



/**
 * Format weeks into a human-readable duration
 */
export function formatDuration(weeks: number, t: (key: string, params?: any) => string): string {
  if (weeks === 0) return t('duration.ready');
  if (weeks === 1) return t('duration.week_one');
  if (weeks < 5) return t('duration.weeks_multiple', { count: weeks });
  
  const months = Math.floor(weeks / 4);
  const remainingWeeks = weeks % 4;
  
  let result = months === 1 
    ? t('duration.month_one') 
    : t('duration.months_multiple', { count: months });
    
  if (remainingWeeks > 0) {
    result += remainingWeeks === 1
      ? t('duration.and_week_one')
      : t('duration.and_weeks_multiple', { count: remainingWeeks });
  }
  
  return result;
}
