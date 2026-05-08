/**
 * MTG Arena Economy Constants
 *
 * These values are configurable to adapt to future changes by Wizards of the Coast.
 * Last updated: May 2026
 */

export const ECONOMY = {
  /** Cost of a Standard booster pack in gold */
  PACK_COST_GOLD: 1000,

  /** Cost of a Mythic Edition booster pack in gold */
  PACK_COST_GOLD_MYTHIC: 1300,

  /** Average gold earned from a daily quest */
  DAILY_QUEST_GOLD_AVG: 500,

  /** Average gold earned from daily wins (assuming ~50% winrate) */
  DAILY_WINS_GOLD_AVG: 150,

  /** Total estimated daily gold income */
  get DAILY_GOLD_TOTAL() {
    return this.DAILY_QUEST_GOLD_AVG + this.DAILY_WINS_GOLD_AVG;
  },

  /** 
   * Average free packs earned per week.
   * Accounts for Free Mastery Pass track (~36 packs per 12 weeks = 3), 
   * Season Rewards, and Promo Codes.
   */
  FREE_PACKS_PER_WEEK: 3,

  /** Guaranteed wildcard track milestones */
  WILDCARD_TRACK: {
    /** 
     * Approximate packs for an Uncommon wildcard (Track + In-pack drops).
     * Track: 1 in 6. In-pack: 1 in 5. Total approx 1 in 3.
     */
    UNCOMMON_EVERY_N_PACKS: 3,
    /** Guaranteed Rare wildcard every N packs */
    RARE_EVERY_N_PACKS: 6,
    /**
     * Approximate packs for a Mythic wildcard (including track + in-pack drops).
     * Track: 1 in 30. In-pack: 1 in 30. Total approx 1 in 15.
     */
    MYTHIC_APPROX_EVERY_N_PACKS: 15,
  },

  /**
   * Gold rewards for daily wins (first 15 wins per day).
   */
  DAILY_WIN_REWARDS: [
    250, // Win 1
    100, // Win 2
    100, // Win 3
    100, // Win 4
    0,   // Win 5 (ICR)
    50,  // Win 6
    0,   // Win 7 (ICR)
    50,  // Win 8
    0,   // Win 9 (ICR)
    50,  // Win 10
    0,   // Win 11 (ICR)
    25,  // Win 12
    0,   // Win 13 (ICR)
    25,  // Win 14
    0,   // Win 15 (ICR)
  ],

  /** Total gold from all 15 daily wins */
  get DAILY_WINS_MAX_GOLD() {
    return this.DAILY_WIN_REWARDS.reduce((sum, g) => sum + g, 0);
  },

  /** Default assumed win rate in Ranked */
  WIN_RATE_DEFAULT: 0.5,

  /** Average games per hour in Bo1 */
  GAMES_PER_HOUR_BO1: 6,

  /** Average games per hour in Bo3 */
  GAMES_PER_HOUR_BO3: 3,
} as const;

/** Basic lands to exclude from wildcard calculations */
export const BASIC_LANDS = new Set([
  'Plains',
  'Island',
  'Swamp',
  'Mountain',
  'Forest',
]);

/** Thresholds for triggering budget suggestions */
export const BUDGET_THRESHOLDS = {
  /** Suggest budget if Mythic gap exceeds this */
  MYTHIC_GAP_THRESHOLD: 4,
  /** Suggest budget if Rare gap exceeds this */
  RARE_GAP_THRESHOLD: 12,
};
