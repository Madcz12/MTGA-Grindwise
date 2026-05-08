import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type {
  AppScreen,
  AppState,
  BudgetAnalysis,
  DeckEntry,
  ParsedDeck,
  PlayHours,
  Roadmap,
  SessionProfile,
  WildcardGap,
  WildcardInventory,
} from '../types';

// ─── Initial State ──────────────────────────────────────────────────

const initialState: AppState = {
  currentScreen: 'import',
  deck: null,
  enrichedEntries: [],
  wildcardInventory: { common: 0, uncommon: 0, rare: 0, mythic: 0 },
  ownedCards: new Map(),
  currentGold: 0,
  sessionProfile: { hoursPerDay: 1, daysPerWeek: 5 },
  wildcardGap: null,
  roadmap: null,
  budgetAnalysis: null,
  isLoading: false,
  loadingMessage: '',
};

// ─── Actions ────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_SCREEN'; screen: AppScreen }
  | { type: 'SET_DECK'; deck: ParsedDeck }
  | { type: 'SET_ENRICHED_ENTRIES'; entries: DeckEntry[] }
  | { type: 'SET_WILDCARD_INVENTORY'; inventory: WildcardInventory }
  | { type: 'SET_OWNED_CARD'; cardKey: string; copies: number }
  | { type: 'SET_CURRENT_GOLD'; gold: number }
  | { type: 'SET_SESSION_PROFILE'; profile: SessionProfile }
  | { type: 'SET_HOURS_PER_DAY'; hours: PlayHours }
  | { type: 'SET_DAYS_PER_WEEK'; days: number }
  | { type: 'SET_WILDCARD_GAP'; gap: WildcardGap }
  | { type: 'SET_ROADMAP'; roadmap: Roadmap }
  | { type: 'SET_BUDGET_ANALYSIS'; analysis: BudgetAnalysis }
  | { type: 'SET_LOADING'; isLoading: boolean; message?: string }
  | { type: 'RESET' };

// ─── Reducer ────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };
    case 'SET_DECK':
      return { ...state, deck: action.deck };
    case 'SET_ENRICHED_ENTRIES':
      return { ...state, enrichedEntries: action.entries };
    case 'SET_WILDCARD_INVENTORY':
      return { ...state, wildcardInventory: action.inventory };
    case 'SET_OWNED_CARD': {
      const newOwned = new Map(state.ownedCards);
      if (action.copies > 0) {
        newOwned.set(action.cardKey, action.copies);
      } else {
        newOwned.delete(action.cardKey);
      }
      return { ...state, ownedCards: newOwned };
    }
    case 'SET_CURRENT_GOLD':
      return { ...state, currentGold: action.gold };
    case 'SET_SESSION_PROFILE':
      return { ...state, sessionProfile: action.profile };
    case 'SET_HOURS_PER_DAY':
      return { ...state, sessionProfile: { ...state.sessionProfile, hoursPerDay: action.hours } };
    case 'SET_DAYS_PER_WEEK':
      return { ...state, sessionProfile: { ...state.sessionProfile, daysPerWeek: action.days } };
    case 'SET_WILDCARD_GAP':
      return { ...state, wildcardGap: action.gap };
    case 'SET_ROADMAP':
      return { ...state, roadmap: action.roadmap };
    case 'SET_BUDGET_ANALYSIS':
      return { ...state, budgetAnalysis: action.analysis };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading, loadingMessage: action.message || '' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────

const DeckStateContext = createContext<AppState>(initialState);
const DeckDispatchContext = createContext<Dispatch<Action>>(() => {});

export function DeckStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DeckStateContext.Provider value={state}>
      <DeckDispatchContext.Provider value={dispatch}>
        {children}
      </DeckDispatchContext.Provider>
    </DeckStateContext.Provider>
  );
}

export function useDeckState() {
  return useContext(DeckStateContext);
}

export function useDeckDispatch() {
  return useContext(DeckDispatchContext);
}
