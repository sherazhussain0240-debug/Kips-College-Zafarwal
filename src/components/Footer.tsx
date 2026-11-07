import React from 'react';
import { CollegeLogo } from './CollegeLogo';
import { Database } from 'lucide-react';
import { ActivePage } from '../types/database';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenDatabaseModal: () => void;
  isDbConnected: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDatabaseModal,
  isDbConnected,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <CollegeLogo size="sm" />
            <div>
              <p className="text-sm font-bold text-white tracking-wide">
                KIPS COLLEGE ZAFARWAL
              </p>
              <p className="text-xs text-sky-400">
                Student & Course Manager · Academic Records
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('students')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Manage Students
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('courses')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Manage Courses
            </button>
            <span>·</span>
            <button
              onClick={onOpenDatabaseModal}
              className="hover:text-sky-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase {isDbConnected ? 'Active' : 'Configuration'}</span>
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KIPS College Zafarwal. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Supabase Cloud Database</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Zafarwal Campus</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
