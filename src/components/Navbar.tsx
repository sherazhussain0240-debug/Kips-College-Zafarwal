import React, { useState } from 'react';
import { CollegeLogo } from './CollegeLogo';
import { ActivePage } from '../types/database';
import { Database, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenDatabaseModal: () => void;
  isDbConnected: boolean;
  customLogoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenDatabaseModal,
  isDbConnected,
  customLogoUrl,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: College Brand & Wordmark */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer select-none group shrink-0"
          >
            <CollegeLogo size="md" customLogoUrl={customLogoUrl} />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 group-hover:text-sky-700 transition-colors">
                KIPS COLLEGE ZAFARWAL
              </span>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-950 transition-colors">
                Student & Course Manager
              </span>
            </div>
          </div>

          {/* Zone 2: Primary Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activePage === 'home'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('students')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activePage === 'students'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Manage Students
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activePage === 'courses'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Manage Courses
            </button>
          </nav>

          {/* Zone 3: Database Connection / Settings Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDatabaseModal}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                isDbConnected
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80'
                  : 'bg-amber-50/80 border-amber-200 text-amber-800 hover:bg-amber-100/80'
              }`}
              title="Configure Supabase URL, Anon Key and Database Schema"
            >
              <Database className="w-3.5 h-3.5 text-current" />
              <span>Supabase {isDbConnected ? 'Connected' : 'Setup'}</span>
              {isDbConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenDatabaseModal}
              className={`p-2 rounded-lg border ${
                isDbConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              aria-label="Database Status"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sky-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
              activePage === 'home'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('students')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
              activePage === 'students'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Manage Students
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
              activePage === 'courses'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Manage Courses
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDatabaseModal();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                Supabase Settings & SQL
              </span>
              <span className={`text-xs font-semibold ${isDbConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isDbConnected ? 'Connected' : 'Action Required'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
