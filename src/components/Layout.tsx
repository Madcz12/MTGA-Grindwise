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
    <div className="min-h-screen relative flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-secondary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-emerald-500/30 bg-slate-950 shrink-0">
              <img 
                src="/Gemini_Generated_Image_58dqsd58dqsd58dq.png" 
                alt="Grindwise Icon" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            
            {/* Logo Text Image */}
            <div className="flex flex-col justify-center">
              <div className="h-10 -ml-2">
                <img 
                  src="/05956a2f-397f-4557-afbf-656a65068ce8.jpg" 
                  alt="Grindwise" 
                  className="h-full w-auto object-contain mix-blend-screen brightness-125 contrast-110"
                />
              </div>
              <p className="text-[9px] text-text-muted font-black tracking-[0.25em] uppercase opacity-80">MTG Arena • Standard</p>
            </div>
          </div>

          {/* Stepper */}
          <nav className="hidden md:flex items-center gap-8">
            {STEPS.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              const isClickable = index < currentIndex;

              return (
                <button
                  key={step.screen}
                  onClick={() => isClickable && dispatch({ type: 'SET_SCREEN', screen: step.screen })}
                  className={`group flex items-center gap-2.5 py-2 text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-emerald-400'
                      : isCompleted
                        ? 'text-slate-300 hover:text-emerald-400'
                        : 'text-slate-500'
                  }`}
                  disabled={!isClickable && !isActive}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-md text-xs border transition-colors ${
                    isActive 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/20" 
                      : isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-slate-950"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  <span className="uppercase tracking-widest text-[11px] font-bold">{step.label}</span>
                  
                  {/* Underline for active */}
                  {isActive && (
                    <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-500 rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden">
          <div className="flex h-0.5 w-full bg-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-8 animate-slide-up @container">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-bg-secondary/50 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-text-muted font-bold tracking-[0.2em] uppercase">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Scryfall API Integration
          </p>
          <div className="h-px w-12 bg-slate-800 my-4 md:hidden"></div>
          <p>Not affiliated with Wizards of the Coast</p>
        </div>
      </footer>
    </div>
  );
}

