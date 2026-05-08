import { Layout } from './components/Layout';
import { DeckStateProvider, useDeckState } from './hooks/useDeckState';
import { ImportDeck } from './pages/ImportDeck';
import { AccountState } from './pages/AccountState';
import { Results } from './pages/Results';
import { BudgetView } from './pages/BudgetView';

function AppRouter() {
  const { currentScreen, isLoading, loadingMessage } = useDeckState();

  return (
    <Layout>
      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card-glow p-8 text-center animate-fade-in">
            <div className="w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-primary font-semibold">{loadingMessage || 'Cargando...'}</p>
          </div>
        </div>
      )}

      {/* Screen router */}
      {currentScreen === 'import' && <ImportDeck />}
      {currentScreen === 'account' && <AccountState />}
      {currentScreen === 'results' && <Results />}
      {currentScreen === 'budget' && <BudgetView />}
    </Layout>
  );
}

export default function App() {
  return (
    <DeckStateProvider>
      <AppRouter />
    </DeckStateProvider>
  );
}
