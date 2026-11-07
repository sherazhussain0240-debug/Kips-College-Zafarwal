import React, { useState, useMemo } from 'react';
import {
  Course,
  CourseFormData,
} from '../types/database';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Calendar,
  X,
  BookMarked,
  FileText,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface CoursesPageProps {
  courses: Course[];
  isLoading: boolean;
  isDbConnected: boolean;
  onRefresh: () => Promise<void>;
  onAddCourse: (data: CourseFormData) => Promise<boolean>;
  onEditCourse: (id: string, data: CourseFormData) => Promise<boolean>;
  onDeleteCourse: (id: string) => Promise<boolean>;
  onOpenDatabaseModal: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  courses,
  isLoading,
  isDbConnected,
  onRefresh,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onOpenDatabaseModal,
}) => {
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form fields
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ID copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter courses by name
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.course_name.toLowerCase().includes(q) ||
        (c.course_description && c.course_description.toLowerCase().includes(q))
    );
  }, [courses, searchQuery]);

  // Copy ID to clipboard
  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setCourseName('');
    setCourseDescription('');
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.course_name);
    setCourseDescription(course.course_description || '');
    setFormErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!courseName.trim()) {
      errors.courseName = 'Course Name is required and cannot be empty.';
    } else if (courseName.trim().length < 2) {
      errors.courseName = 'Course Name must be at least 2 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddCourse({
      course_name: courseName.trim(),
      course_description: courseDescription.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setIsAddModalOpen(false);
      setCourseName('');
      setCourseDescription('');
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onEditCourse(editingCourse.id, {
      course_name: courseName.trim(),
      course_description: courseDescription.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setEditingCourse(null);
    }
  };

  // Confirm and delete
  const handleDeleteConfirm = async () => {
    if (!courseToDelete || isDeleting) return;

    setIsDeleting(true);
    await onDeleteCourse(courseToDelete.id);
    setIsDeleting(false);
    setCourseToDelete(null);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <span>KIPS College Zafarwal</span>
            <span aria-hidden="true">·</span>
            <span>Curriculum & Syllabus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span>Manage Courses</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Add new academic courses, configure course descriptions, and oversee academic subjects.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onRefresh()}
            disabled={isLoading}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Supabase"
            aria-label="Refresh course list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Database Warning if not connected */}
      {!isDbConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Supabase Connection Required</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Courses cannot be queried or created until your Supabase project URL and anon key are connected.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDatabaseModal}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Connect Supabase
          </button>
        </div>
      )}

      {/* Controls Bar: Search & Count */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search by Course Name / Description */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or description..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean Unboxed Metadata: Count */}
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span>Total Courses: <strong className="text-slate-800 font-mono tabular-nums">{courses.length}</strong></span>
          {searchQuery && (
            <>
              <span aria-hidden="true">·</span>
              <span>Matched: <strong className="text-blue-700 font-mono tabular-nums">{filteredCourses.length}</strong></span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>Source: Supabase</span>
        </div>

      </div>

      {/* Courses Table or Empty States */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden">
        
        {isLoading && courses.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Loading course catalog from Supabase...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {searchQuery ? 'No matching courses found' : 'No courses registered yet'}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {searchQuery
                  ? `No course matches "${searchQuery}". Clear the search query to see all courses.`
                  : 'Get started by creating your first academic course in KIPS College Zafarwal database.'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            ) : (
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add First Course</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Course ID</th>
                  <th scope="col" className="py-3.5 px-4">Course Name</th>
                  <th scope="col" className="py-3.5 px-4">Course Description</th>
                  <th scope="col" className="py-3.5 px-4">Creation Date</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => {
                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Course ID with copy button */}
                      <td className="py-4 px-4 sm:px-6 font-mono text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span title={course.id}>
                            {course.id.slice(0, 8)}...{course.id.slice(-4)}
                          </span>
                          <button
                            onClick={() => handleCopyId(course.id)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="Copy full UUID"
                            aria-label={`Copy UUID for ${course.course_name}`}
                          >
                            {copiedId === course.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Course Name */}
                      <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                            <BookMarked className="w-4 h-4" />
                          </div>
                          <span>{course.course_name}</span>
                        </div>
                      </td>

                      {/* Course Description */}
                      <td className="py-4 px-4 text-slate-600 max-w-md">
                        {course.course_description ? (
                          <p className="line-clamp-2 leading-relaxed text-xs sm:text-sm">
                            {course.course_description}
                          </p>
                        ) : (
                          <span className="text-slate-400 italic text-xs">No description provided</span>
                        )}
                      </td>

                      {/* Creation Date */}
                      <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap font-mono tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(course.creation_date)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(course)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Course"
                            aria-label={`Edit ${course.course_name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCourseToDelete(course)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Course"
                            aria-label={`Delete ${course.course_name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Course</h3>
                  <p className="text-xs text-slate-500">Course ID and creation date will be automatically generated</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-5">
              {/* Course Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Physics – Mechanics & Waves"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.courseName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                {formErrors.courseName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.courseName}</p>
                )}
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Course Description</span>
                  <span className="text-slate-400 font-normal">Optional</span>
                </label>
                <textarea
                  rows={4}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Comprehensive syllabus covering theory, laboratory practicals, exam preparation, and conceptual coursework."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>Save Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Course</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {editingCourse.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-5">
              {/* Course Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.courseName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                {formErrors.courseName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.courseName}</p>
                )}
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Course Description</span>
                  <span className="text-slate-400 font-normal">Optional</span>
                </label>
                <textarea
                  rows={4}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>Update Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(courseToDelete)}
        title="Confirm Course Deletion"
        message={`Are you sure you want to delete "${courseToDelete?.course_name}"? This action will permanently remove the course syllabus from the Supabase database.`}
        confirmLabel="Yes, Delete Course"
        cancelLabel="Keep Course"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCourseToDelete(null)}
      />

    </div>
  );
};
