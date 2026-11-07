import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage keys for runtime configuration if .env was not configured prior to launching
const STORAGE_URL_KEY = 'kips_supabase_url';
const STORAGE_KEY_KEY = 'kips_supabase_anon_key';

export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- KIPS COLLEGE ZAFARWAL — Database Schema (Exactly Two Tables)
-- Paste this script into your Supabase project's SQL Editor
-- ============================================================

-- 1. Create the students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  class_name TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create the courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  course_description TEXT,
  creation_date TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow public access for anon key (select, insert, update, delete)
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to students" ON public.students;
CREATE POLICY "Allow public insert access to students" ON public.students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to students" ON public.students;
CREATE POLICY "Allow public update access to students" ON public.students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access to students" ON public.students;
CREATE POLICY "Allow public delete access to students" ON public.students FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read access to courses" ON public.courses;
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to courses" ON public.courses;
CREATE POLICY "Allow public insert access to courses" ON public.courses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to courses" ON public.courses;
CREATE POLICY "Allow public update access to courses" ON public.courses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access to courses" ON public.courses;
CREATE POLICY "Allow public delete access to courses" ON public.courses FOR DELETE USING (true);
`;

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  const storedUrl = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_URL_KEY)?.trim() || '') : '';
  const storedKey = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY_KEY)?.trim() || '') : '';

  return {
    url: storedUrl || envUrl,
    anonKey: storedKey || envKey,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
    }

    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  }
  // Reset cached instance
  cachedClient = null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-publishable-key')
  );
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig = '';

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();

  if (!isSupabaseConfigured()) {
    return null;
  }

  const currentConfigHash = `${url}::${anonKey}`;
  if (cachedClient && lastUsedConfig === currentConfigHash) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastUsedConfig = currentConfigHash;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  tablesFound: {
    students: boolean;
    courses: boolean;
  };
  details?: string;
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const client = getSupabase();
  if (!client) {
    return {
      ok: false,
      message: 'Supabase URL or Publishable Key is missing or invalid.',
      tablesFound: { students: false, courses: false },
    };
  }

  try {
    // 1. Check students table
    const studentsRes = await client.from('students').select('id', { count: 'exact', head: true });
    // 2. Check courses table
    const coursesRes = await client.from('courses').select('id', { count: 'exact', head: true });

    const studentsOk = !studentsRes.error;
    const coursesOk = !coursesRes.error;

    if (studentsOk && coursesOk) {
      return {
        ok: true,
        message: 'Successfully connected to Supabase and both tables (students, courses) are ready.',
        tablesFound: { students: true, courses: true },
      };
    }

    // Check specific table errors
    const errors: string[] = [];
    if (studentsRes.error) {
      errors.push(`Students table: ${studentsRes.error.message}`);
    }
    if (coursesRes.error) {
      errors.push(`Courses table: ${coursesRes.error.message}`);
    }

    const missingTables = !studentsOk || !coursesOk;
    return {
      ok: false,
      message: missingTables
        ? 'Connected to Supabase, but one or more tables are missing. Please execute the provided SQL script in your Supabase SQL Editor.'
        : `Connection test failed: ${errors.join('; ')}`,
      tablesFound: { students: studentsOk, courses: coursesOk },
      details: errors.join(' | '),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: `Failed to connect to Supabase: ${errorMsg}`,
      tablesFound: { students: false, courses: false },
      details: errorMsg,
    };
  }
}
