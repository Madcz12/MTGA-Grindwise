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
    <div className="min-h-screen bg-bg-primary bg-grain relative">
      {/* Background radial overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-bg-secondary)_0%,_transparent_70%)] pointer-events-none z-0 opacity-40" />


      {/* Header */}
      <header className="relative z-10 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-accent flex items-center justify-center text-xl font-serif text-accent relative before:absolute before:inset-1 before:border before:border-accent/30">
              G
            </div>
            <div>
              <h1 className="text-xl editorial-title tracking-wide uppercase">
                Grind<span className="font-sans text-text-secondary font-light text-sm ml-1">Wise</span>
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
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300 border-b-2 ${
                    isActive
                      ? 'border-accent text-accent font-medium'
                      : isCompleted
                        ? 'border-transparent text-text-secondary cursor-pointer hover:text-text-primary'
                        : 'border-transparent text-text-muted cursor-default'
                  }`}
                  disabled={!isClickable && !isActive}
                >
                  <span className={isActive ? "editorial-number text-lg" : "font-serif text-lg"}>{isCompleted ? '✓' : index + 1}</span>
                  <span className="uppercase tracking-wider text-xs">{step.label}</span>
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
                className={`h-[2px] flex-1 transition-all duration-500 ${
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
      <footer className="relative z-10 border-t border-border-subtle mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-text-muted tracking-wide uppercase">
          <p>Scryfall API Integration</p>
          <div className="h-px w-12 bg-border-subtle my-3 md:hidden"></div>
          <p>Not affiliated with Wizards of the Coast</p>
        </div>
      </footer>
    </div>
  );
}
