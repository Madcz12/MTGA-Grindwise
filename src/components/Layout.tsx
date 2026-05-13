import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary/30">


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop relative flex justify-center w-full">
        <div className="w-full max-w-container-max flex flex-col">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest text-on-surface-variant w-full py-4 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center text-xs opacity-60 border-t border-outline-variant/10 mt-auto z-50">
        <div className="mb-2 md:mb-0">
          <span className="font-bold text-on-surface">Grindwise</span>
          <span className="ml-2">© {new Date().getFullYear()} Grindwise. Not affiliated with Wizards of the Coast.</span>
        </div>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Discord Support</a>
        </div>
      </footer>
    </div>
  );
}

