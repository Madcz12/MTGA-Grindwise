// ─── Card & Deck Types ──────────────────────────────────────────────

export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export type DeckSection = 'deck' | 'sideboard';

export interface DeckEntry {
  quantity: number;
  name: string;
  setCode: string;
  collectorNumber: string;
  section: DeckSection;
  // Populated after Scryfall lookup
  rarity?: Rarity;
  isLegalStandard?: boolean;
  imageUri?: string;
  manaCost?: string;
  typeLine?: string;
}

export interface ParsedDeck {
  entries: DeckEntry[];
  errors: ParseError[];
}

export interface ParseError {
  line: number;
  text: string;
  reason: string;
}

// ─── Account State Types ────────────────────────────────────────────

export interface WildcardInventory {
  common: number;
  uncommon: number;
  rare: number;
  mythic: number;
}

export interface OwnedCard {
  name: string;
  setCode: string;
  copiesOwned: number;
}

// ─── Calculation Types ──────────────────────────────────────────────

export interface RarityGap {
  needed: number;
  have: number;
  gap: number;
}

export interface WildcardGap {
  common: RarityGap;
  uncommon: RarityGap;
  rare: RarityGap;
  mythic: RarityGap;
  totalGap: number;
  deckTotalCards: number;
}

// ─── Session & Roadmap Types ────────────────────────────────────────

export type PlayHours = 0.5 | 1 | 2 | 3;

export interface SessionProfile {
  hoursPerDay: PlayHours;
  daysPerWeek: number; // 1-7
}

export interface RoadmapWeek {
  weekNumber: number;
  dailyQuestsCompleted: number;
  weeklyWinsAchieved: number;
  goldEarned: number;
  goldCumulative: number;
  packsOpened: number;
  packsCumulative: number;
  wildcardProgress: WildcardInventory;
  wildcardCumulative: WildcardInventory;
  isComplete: boolean;
}

export interface Roadmap {
  weeks: RoadmapWeek[];
  totalDays: number;
  totalWeeks: number;
  totalPacksNeeded: number;
  totalGoldNeeded: number;
}

// ─── Budget Types ───────────────────────────────────────────────────

export interface BudgetSubstitution {
  original: DeckEntry;
  substitute: {
    name: string;
    rarity: Rarity;
    setCode: string;
    imageUri?: string;
    typeLine?: string;
  };
  wildcardsSaved: { rarity: Rarity; count: number };
}

export interface BudgetAnalysis {
  substitutions: BudgetSubstitution[];
  originalGap: WildcardGap;
  budgetGap: WildcardGap;
  totalWildcardsSaved: number;
  shouldSuggestBudget: boolean;
}

// ─── App State ──────────────────────────────────────────────────────

export type AppScreen = 'import' | 'account' | 'results' | 'budget';

export interface AppState {
  currentScreen: AppScreen;
  deck: ParsedDeck | null;
  enrichedEntries: DeckEntry[];
  wildcardInventory: WildcardInventory;
  ownedCards: Map<string, number>; // key: "name|setCode"
  currentGold: number;
  sessionProfile: SessionProfile;
  wildcardGap: WildcardGap | null;
  roadmap: Roadmap | null;
  budgetAnalysis: BudgetAnalysis | null;
  isLoading: boolean;
  loadingMessage: string;
}
