import type { ReactNode } from 'react';
import type { AppScreen } from '../types';
import { useDeckState, useDeckDispatch } from '../hooks/useDeckState';

const STEPS: { screen: AppScreen; label: string; icon: string }[] = [
  { screen: 'import', label: 'Importar', icon: '📋' },
  { screen: 'account', label: 'Cuenta', icon: '🎴' },
  { screen: 'results', label: 'Resultados', icon: '📊' },
  { screen: 'budget', label: 'Budget', icon: '💡' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { currentScreen } = useDeckState();
  const dispatch = useDeckDispatch();
  const currentIndex = STEPS.findIndex(s => s.screen === currentScreen);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Header */}
      <header className="relative z-10 border-b-4 border-border-subtle bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-border-subtle bg-accent flex items-center justify-center text-2xl font-serif text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              G
            </div>
            <div>
              <h1 className="text-2xl brutalist-title tracking-tight uppercase">
                Grind<span className="font-sans text-text-muted text-sm ml-1">Wise</span>
              </h1>
              <p className="text-xs text-text-muted font-sans tracking-widest uppercase mt-1">MTG Arena • Standard</p>
            </div>
          </div>

          {/* Stepper */}
          <nav className="hidden md:flex items-center gap-1">
            {STEPS.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              const isClickable = index < currentIndex;

              return (
                <button
                  key={step.screen}
                  onClick={() => isClickable && dispatch({ type: 'SET_SCREEN', screen: step.screen })}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-100 border-b-4 ${
                    isActive
                      ? 'border-accent text-accent font-bold'
                      : isCompleted
                        ? 'border-border-subtle text-text-secondary hover:text-text-primary'
                        : 'border-transparent text-text-muted'
                  }`}
                  disabled={!isClickable && !isActive}
                >
                  <span className={isActive ? "brutalist-number text-lg" : "font-serif text-lg"}>{isCompleted ? '✓' : index + 1}</span>
                  <span className="uppercase font-bold tracking-widest text-xs">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden px-6 pb-4">
          <div className="flex gap-1">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-[4px] flex-1 transition-all duration-100 ${
                  index <= currentIndex ? 'bg-accent' : 'bg-border-subtle'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 animate-fade-in @container">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-border-subtle bg-bg-secondary mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-text-primary font-bold tracking-widest uppercase">
          <p>Scryfall API Integration</p>
          <div className="h-1 w-12 bg-border-subtle my-3 md:hidden"></div>
          <p>Not affiliated with Wizards of the Coast</p>
        </div>
      </footer>
    </div>
  );
}
