import React, { useState } from 'react';
import {
  X,
  Database,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileCode2,
  KeyRound,
} from 'lucide-react';
import {
  SUPABASE_SQL_SCHEMA,
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  ConnectionTestResult,
} from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const current = getStoredSupabaseConfig();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onConfigUpdated();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    // Save current values first
    saveSupabaseConfig(url, anonKey);
    onConfigUpdated();

    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-linear-to-r from-sky-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supabase Database Setup</h2>
              <p className="text-xs text-slate-500">
                Connect your Supabase project to power KIPS College Zafarwal student and course records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Quick Step Guide */}
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-sky-900 text-sm">Follow these 3 simple steps to connect Supabase:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sky-700 underline inline-flex items-center gap-0.5"
                >
                  Supabase Dashboard <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>Open your project's <strong>SQL Editor</strong> and execute the script below to create the 2 tables.</li>
              <li>Go to <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>, and paste them below.</li>
            </ol>
          </div>

          {/* Credentials Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-sky-600" />
                Supabase Credentials
              </h3>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Supabase Project URL (e.g. <span className="font-mono text-slate-500">https://xyzcompany.supabase.co</span>)
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono text-xs text-slate-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Supabase Anon / Public Key (Publishable)
                </label>
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono text-xs text-slate-800 transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Never use the secret service-role key. Only use the public <strong>anon key</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Save Credentials
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    testResult.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px]">
                      <span>
                        Students Table:{' '}
                        <strong>{testResult.tablesFound.students ? 'Ready' : 'Not Found'}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Courses Table:{' '}
                        <strong>{testResult.tablesFound.courses ? 'Ready' : 'Not Found'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SQL Schema Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-sky-600" />
                Required SQL Schema (2 Tables: students & courses)
              </h3>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste this in the <strong>Supabase SQL Editor</strong> and click <strong>Run</strong>. This creates the exact two tables with primary keys, automatic UUIDs, timestamps, and public Row Level Security access policies.
            </p>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 text-slate-100 p-4 font-mono text-xs max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          <span>You can also set <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> in <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">.env</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
