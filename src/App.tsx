import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { DeckStateProvider, useDeckState } from './hooks/useDeckState';
import { LanguageProvider } from './i18n/LanguageContext';
import { ImportDeck } from './pages/ImportDeck';
import { Results } from './pages/Results';
import { BudgetView } from './pages/BudgetView';

function AppRouter() {
  const { currentScreen } = useDeckState();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen]);

  return (
    <Layout>
      {/* Screen router */}
      {currentScreen === 'import' && <ImportDeck />}
      {currentScreen === 'results' && <Results />}
      {currentScreen === 'budget' && <BudgetView />}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DeckStateProvider>
        <AppRouter />
      </DeckStateProvider>
    </LanguageProvider>
  );
}
