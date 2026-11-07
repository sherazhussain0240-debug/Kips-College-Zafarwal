/**
 * Database types for KIPS College Zafarwal - Student & Course Manager
 * Supabase schema with strictly two tables: students and courses
 */

export interface Student {
  id: string; // UUID primary key, auto-generated
  full_name: string; // Text, required
  email: string; // Text, required
  class_name: string; // Text, required
  registration_date: string; // Timestamp, auto-generated
}

export interface StudentFormData {
  full_name: string;
  email: string;
  class_name: string;
}

export interface Course {
  id: string; // UUID primary key, auto-generated
  course_name: string; // Text, required
  course_description: string | null; // Text
  creation_date: string; // Timestamp, auto-generated
}

export interface CourseFormData {
  course_name: string;
  course_description: string;
}

export type ActivePage = 'home' | 'students' | 'courses';
