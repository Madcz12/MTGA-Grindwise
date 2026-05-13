import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export function Layout({ children }: { children: ReactNode }) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary/30 bg-black/70">

      {/* Header with Language Toggle */}
      <header className="absolute top-0 right-0 p-4 z-50">
        <div className="flex bg-surface-container-high rounded-full overflow-hidden border border-outline-variant/30 shadow-md">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('es')}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${language === 'es' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant'}`}
          >
            ES
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop relative flex justify-center w-full mt-12 md:mt-0">
        <div className="w-full max-w-container-max flex flex-col">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 text-on-surface-variant w-full py-4 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center text-xs opacity-60 border-t border-outline-variant/10 mt-auto z-50">
        <div className="mb-2 md:mb-0">
          <span className="font-bold text-on-surface">Grindwise</span>
          <span className="ml-2">© {new Date().getFullYear()} Grindwise. {t('layout.footer.not_affiliated')}</span>
        </div>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">{t('layout.footer.terms')}</a>
          <a className="hover:text-primary transition-colors" href="#">{t('layout.footer.privacy')}</a>
          <a className="hover:text-primary transition-colors" href="#">{t('layout.footer.discord')}</a>
        </div>
      </footer>
    </div>
  );
}

