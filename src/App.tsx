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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="glass-card-glow p-10 text-center animate-scale-in max-w-sm w-full">
            <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-white font-serif text-xl tracking-wide uppercase">{loadingMessage || 'Descifrando...'}</p>
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
