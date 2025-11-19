import React, { ReactNode } from 'react';
import { Layout as LayoutIcon, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-2 rounded-lg">
                <LayoutIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">ProjectScope AI</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden md:block">Powered by Gemini 2.5</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full print:p-0">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ProjectScope AI. Generado con Google Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};