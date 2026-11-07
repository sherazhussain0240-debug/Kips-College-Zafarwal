/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { StudentsPage } from './pages/StudentsPage';
import { CoursesPage } from './pages/CoursesPage';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Student,
  Course,
  StudentFormData,
  CourseFormData,
  ActivePage,
} from './types/database';
import {
  getSupabase,
  isSupabaseConfigured,
  testSupabaseConnection,
} from './lib/supabase';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check Supabase connection
  const verifyConnection = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsDbConnected(false);
      return false;
    }
    const testResult = await testSupabaseConnection();
    setIsDbConnected(testResult.ok);
    return testResult.ok;
  }, []);

  // Fetch Students from Supabase
  const fetchStudents = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setStudents([]);
      return;
    }

    setIsLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        showToast('error', 'Failed to fetch students', error.message);
      } else {
        setStudents(data || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Fetch students error:', msg);
      showToast('error', 'Error loading students', msg);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [showToast]);

  // Fetch Courses from Supabase
  const fetchCourses = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setCourses([]);
      return;
    }

    setIsLoadingCourses(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('creation_date', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        showToast('error', 'Failed to fetch courses', error.message);
      } else {
        setCourses(data || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Fetch courses error:', msg);
      showToast('error', 'Error loading courses', msg);
    } finally {
      setIsLoadingCourses(false);
    }
  }, [showToast]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    const connected = await verifyConnection();
    if (connected) {
      await Promise.all([fetchStudents(), fetchCourses()]);
    }
  }, [verifyConnection, fetchStudents, fetchCourses]);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Student Actions
  const handleAddStudent = async (formData: StudentFormData): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      setIsDatabaseModalOpen(true);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            class_name: formData.class_name,
          },
        ])
        .select();

      if (error) {
        showToast('error', 'Could not register student', error.message);
        return false;
      }

      showToast(
        'success',
        'Student Registered Successfully',
        `${formData.full_name} has been enrolled in ${formData.class_name}.`
      );
      await fetchStudents();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Registration Failed', msg);
      return false;
    }
  };

  const handleEditStudent = async (id: string, formData: StudentFormData): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          class_name: formData.class_name,
        })
        .eq('id', id);

      if (error) {
        showToast('error', 'Update Failed', error.message);
        return false;
      }

      showToast('success', 'Student Updated', `Record for ${formData.full_name} updated successfully.`);
      await fetchStudents();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Update Failed', msg);
      return false;
    }
  };

  const handleDeleteStudent = async (id: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      return false;
    }

    try {
      const { error } = await supabase.from('students').delete().eq('id', id);

      if (error) {
        showToast('error', 'Deletion Failed', error.message);
        return false;
      }

      showToast('success', 'Student Deleted', 'Student record removed from registry.');
      await fetchStudents();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Deletion Failed', msg);
      return false;
    }
  };

  // Course Actions
  const handleAddCourse = async (formData: CourseFormData): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      setIsDatabaseModalOpen(true);
      return false;
    }

    try {
      const { error } = await supabase.from('courses').insert([
        {
          course_name: formData.course_name,
          course_description: formData.course_description || null,
        },
      ]);

      if (error) {
        showToast('error', 'Could not create course', error.message);
        return false;
      }

      showToast('success', 'Course Added Successfully', `"${formData.course_name}" is now part of the curriculum.`);
      await fetchCourses();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Course Creation Failed', msg);
      return false;
    }
  };

  const handleEditCourse = async (id: string, formData: CourseFormData): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          course_name: formData.course_name,
          course_description: formData.course_description || null,
        })
        .eq('id', id);

      if (error) {
        showToast('error', 'Course Update Failed', error.message);
        return false;
      }

      showToast('success', 'Course Updated', `Course "${formData.course_name}" was updated.`);
      await fetchCourses();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Course Update Failed', msg);
      return false;
    }
  };

  const handleDeleteCourse = async (id: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      showToast('error', 'Database not connected', 'Please connect your Supabase project first.');
      return false;
    }

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);

      if (error) {
        showToast('error', 'Deletion Failed', error.message);
        return false;
      }

      showToast('success', 'Course Deleted', 'Course removed from college syllabus.');
      await fetchCourses();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('error', 'Deletion Failed', msg);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        isDbConnected={isDbConnected}
      />

      {/* Main View Area (Only 3 sections: Home, Manage Students, Manage Courses) */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            totalStudents={students.length}
            totalCourses={courses.length}
            isLoadingStats={isLoadingStudents || isLoadingCourses}
            isDbConnected={isDbConnected}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}

        {activePage === 'students' && (
          <StudentsPage
            students={students}
            isLoading={isLoadingStudents}
            isDbConnected={isDbConnected}
            onRefresh={fetchStudents}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}

        {activePage === 'courses' && (
          <CoursesPage
            courses={courses}
            isLoading={isLoadingCourses}
            isDbConnected={isDbConnected}
            onRefresh={fetchCourses}
            onAddCourse={handleAddCourse}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        isDbConnected={isDbConnected}
      />

      {/* Supabase Setup / SQL Schema Modal */}
      <SupabaseSetupModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        onConfigUpdated={() => {
          refreshAllData();
        }}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
