import React from 'react';
import { Users, BookOpen, ArrowRight, Sparkles, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { ActivePage } from '../types/database';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface HomePageProps {
  totalStudents: number;
  totalCourses: number;
  isLoadingStats: boolean;
  isDbConnected: boolean;
  onNavigate: (page: ActivePage) => void;
  onOpenDatabaseModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  totalStudents,
  totalCourses,
  isLoadingStats,
  isDbConnected,
  onNavigate,
  onOpenDatabaseModal,
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Database Connection Notice if not connected */}
      {!isDbConnected && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  Supabase Database Configuration Required
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Provide your Supabase URL & Anon Key to fetch live student and course counts, enroll students, and manage curriculum.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenDatabaseModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Connect Supabase Now
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-sky-50/80 via-white to-slate-50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Welcome & Editorial Description */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>KIPS College Zafarwal Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
                Student & Course <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-blue-700">Manager</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Welcome to the official administrative management system for <strong>KIPS College Zafarwal</strong>. Easily manage student enrollments, organize academic classes, and keep course curricula updated with real-time Supabase cloud synchronization.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('students')}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Students</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-800 font-semibold text-sm rounded-xl border border-sky-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Manage Courses</span>
                </button>
              </div>

              {/* Status indicator row */}
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-sky-600" />
                  Database: {isDbConnected ? 'Supabase Live' : 'Not Connected'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Zafarwal Campus</span>
                <span aria-hidden="true">·</span>
                <span>Academic Session {new Date().getFullYear()}</span>
              </div>

            </div>

            {/* Right Column: High-Res Campus Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-sky-200/60 bg-sky-100 aspect-16/10">
                <img
                  src="/src/assets/images/college_campus_hero_1794071236451.jpg"
                  alt="KIPS College Campus"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container in case image fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                      Academic Excellence
                    </p>
                    <p className="text-sm font-bold">
                      KIPS College Zafarwal Campus
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Real-time Metric Cards (Counting animation from Supabase data) */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Institute Overview</h2>
            <p className="text-xs text-slate-500">Live statistics synchronized with Supabase database</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Total Students Card */}
            <div
              onClick={() => onNavigate('students')}
              className="group bg-white rounded-2xl p-6 border border-sky-100 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Registered Students
                  </p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    {isLoadingStats ? (
                      <span className="inline-block w-16 h-8 bg-slate-100 rounded-md animate-pulse" />
                    ) : (
                      <AnimatedCounter value={totalStudents} />
                    )}
                  </div>
                </div>
                <div className="p-3.5 bg-sky-50 group-hover:bg-sky-100 text-sky-600 rounded-2xl transition-colors">
                  <Users className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Class enrollment records</span>
                <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  View Students <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Total Courses Card */}
            <div
              onClick={() => onNavigate('courses')}
              className="group bg-white rounded-2xl p-6 border border-sky-100 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Active Courses
                  </p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    {isLoadingStats ? (
                      <span className="inline-block w-16 h-8 bg-slate-100 rounded-md animate-pulse" />
                    ) : (
                      <AnimatedCounter value={totalCourses} />
                    )}
                  </div>
                </div>
                <div className="p-3.5 bg-blue-50 group-hover:bg-blue-100 text-blue-600 rounded-2xl transition-colors">
                  <BookOpen className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Curriculum and subjects</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  View Courses <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Two Main Navigation Cards with Photography Previews */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Administrative Sections</h2>
            <p className="text-xs text-slate-500">Select a section to manage student records or course offerings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Manage Students Card */}
            <div className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-sky-100 overflow-hidden">
                <img
                  src="/src/assets/images/students_study_library_1794071237465.jpg"
                  alt="Students studying in library"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/20 to-transparent p-5 flex items-end">
                  <div className="text-white">
                    <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                      Student Admissions & Enrollment
                    </span>
                    <h3 className="text-xl font-bold">Manage Students</h3>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Register new students, update contact details and class designations, search through enrollment rosters, or remove inactive student profiles.
                </p>

                <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Full name, email address, and class tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Instant student search by name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Automatic UUID & registration timestamp</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('students')}
                    className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Open Manage Students</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Manage Courses Card */}
            <div className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-sky-100 overflow-hidden">
                <img
                  src="/src/assets/images/classroom_lecture_hall_1794071237850.jpg"
                  alt="Classroom lecture hall"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/20 to-transparent p-5 flex items-end">
                  <div className="text-white">
                    <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                      Academic Curriculum & Syllabus
                    </span>
                    <h3 className="text-xl font-bold">Manage Courses</h3>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Add new courses with detailed descriptions, update syllabus outlines, and manage the full college course catalog stored directly in Supabase.
                </p>

                <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Course name & syllabus description</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Auto-generated UUID & creation timestamp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Direct edit and delete confirmation safety</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('courses')}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Open Manage Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
