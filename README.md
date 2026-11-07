# KIPS College Zafarwal – Student & Course Manager

A web application designed for **KIPS College Zafarwal** to manage student enrollments and academic courses using **React, TypeScript, Tailwind CSS, and Supabase**.

---

## 🏛️ Project Features

- **Institute Branding**: Dedicated to **KIPS COLLEGE ZAFARWAL** with official crest emblem, academic color scheme (light blue `#0284c7`, navy `#0f172a`, and clean white), and high-resolution campus photography.
- **Three Core Sections**:
  1. **Home**: Academic welcome, real-time animated counters for students and courses, and direct navigation cards.
  2. **Manage Students**: Add, list, search by full name, edit, and delete student records with confirmation protection.
  3. **Manage Courses**: Add, list, edit, and delete course curricula with confirmation protection.
- **Real Supabase Cloud Database**: Direct synchronization with your Supabase database. No fake or mock data.
- **Exactly Two Database Tables**: `students` and `courses`.
- **Validation & Reliability**: Full Name, Email, and Class Name format checks, live search, empty states, and toast notifications.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- A free [Supabase](https://supabase.com) account

### 2. Installation
Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

The application will launch on `http://localhost:3000`.

---

## 🗄️ Supabase Database Setup (Exactly Two Tables)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Note your **Project URL** and **Anon / Public Key** from **Project Settings → API**.

### Step 2: Run the SQL Schema
In your Supabase project dashboard, click on **SQL Editor** in the left sidebar, paste the following SQL script, and click **Run**:

```sql
-- ============================================================
-- KIPS COLLEGE ZAFARWAL — Database Schema (Exactly Two Tables)
-- ============================================================

-- Table 1: students
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  class_name TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Table 2: courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  course_description TEXT,
  creation_date TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for the client anon key
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
```

---

## 🔑 Supabase Connection Credentials

### Option A: Via Environment Variables (Recommended)
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Option B: In-App Connection Modal
You can also connect directly from the running web application:
1. Click the **"Supabase Setup"** button in the top right corner of the navigation bar.
2. Enter your **Supabase Project URL** and **Anon Key**.
3. Click **"Test Connection"** and **"Save Credentials"**.
The application will instantly connect without needing to restart the server!

---

## 📋 Database Tables Reference

### Table: `students`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, auto-generated via `gen_random_uuid()` |
| `full_name` | `TEXT` | Required student full name |
| `email` | `TEXT` | Required student email address |
| `class_name` | `TEXT` | Required enrolled class (e.g., F.Sc, ICS) |
| `registration_date` | `TIMESTAMPTZ` | Timestamp auto-generated via `now()` |

### Table: `courses`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, auto-generated via `gen_random_uuid()` |
| `course_name` | `TEXT` | Required academic course title |
| `course_description` | `TEXT` | Optional syllabus description |
| `creation_date` | `TIMESTAMPTZ` | Timestamp auto-generated via `now()` |

---

## 🎓 Technology Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Database Client**: `@supabase/supabase-js`
- **Build Tool**: Vite
