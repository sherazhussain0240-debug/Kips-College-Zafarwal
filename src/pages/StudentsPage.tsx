import React, { useState, useMemo } from 'react';
import {
  Student,
  StudentFormData,
} from '../types/database';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Database,
  Calendar,
  X,
  GraduationCap,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface StudentsPageProps {
  students: Student[];
  isLoading: boolean;
  isDbConnected: boolean;
  onRefresh: () => Promise<void>;
  onAddStudent: (data: StudentFormData) => Promise<boolean>;
  onEditStudent: (id: string, data: StudentFormData) => Promise<boolean>;
  onDeleteStudent: (id: string) => Promise<boolean>;
  onOpenDatabaseModal: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  isLoading,
  isDbConnected,
  onRefresh,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenDatabaseModal,
}) => {
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [className, setClassName] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ID copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter students by full name
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter((s) => s.full_name.toLowerCase().includes(q));
  }, [students, searchQuery]);

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
    setFullName('');
    setEmail('');
    setClassName('');
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFullName(student.full_name);
    setEmail(student.email);
    setClassName(student.class_name);
    setFormErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required and cannot be empty.';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email Address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email format (e.g., student@kips.edu.pk).';
    }

    if (!className.trim()) {
      errors.className = 'Class Name is required and cannot be empty.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddStudent({
      full_name: fullName.trim(),
      email: email.trim(),
      class_name: className.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setIsAddModalOpen(false);
      setFullName('');
      setEmail('');
      setClassName('');
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onEditStudent(editingStudent.id, {
      full_name: fullName.trim(),
      email: email.trim(),
      class_name: className.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setEditingStudent(null);
    }
  };

  // Confirm and delete
  const handleDeleteConfirm = async () => {
    if (!studentToDelete || isDeleting) return;

    setIsDeleting(true);
    await onDeleteStudent(studentToDelete.id);
    setIsDeleting(false);
    setStudentToDelete(null);
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
            <span>Academic Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-sky-600" />
            <span>Manage Students</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Register new students, update enrollments, and browse the official student registry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onRefresh()}
            disabled={isLoading}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Supabase"
            aria-label="Refresh student list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
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
                Students cannot be loaded or saved until your Supabase project URL and anon key are connected.
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
        
        {/* Search by Full Name */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by full name..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors"
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
          <span>Total Records: <strong className="text-slate-800 font-mono tabular-nums">{students.length}</strong></span>
          {searchQuery && (
            <>
              <span aria-hidden="true">·</span>
              <span>Matched: <strong className="text-sky-700 font-mono tabular-nums">{filteredStudents.length}</strong></span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>Source: Supabase</span>
        </div>

      </div>

      {/* Students Table or Empty States */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden">
        
        {isLoading && students.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Loading student registry from Supabase...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {searchQuery ? 'No matching students found' : 'No students registered yet'}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {searchQuery
                  ? `No student names match "${searchQuery}". Check the spelling or clear the search filter.`
                  : 'Get started by adding your first student record to KIPS College Zafarwal database.'}
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
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register First Student</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Student ID</th>
                  <th scope="col" className="py-3.5 px-4">Full Name</th>
                  <th scope="col" className="py-3.5 px-4">Email Address</th>
                  <th scope="col" className="py-3.5 px-4">Class Name</th>
                  <th scope="col" className="py-3.5 px-4">Registration Date</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-sky-50/40 transition-colors group"
                    >
                      {/* Student ID with copy button */}
                      <td className="py-4 px-4 sm:px-6 font-mono text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span title={student.id}>
                            {student.id.slice(0, 8)}...{student.id.slice(-4)}
                          </span>
                          <button
                            onClick={() => handleCopyId(student.id)}
                            className="text-slate-400 hover:text-sky-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="Copy full UUID"
                            aria-label={`Copy UUID for ${student.full_name}`}
                          >
                            {copiedId === student.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Full Name */}
                      <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {student.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span>{student.full_name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <a
                          href={`mailto:${student.email}`}
                          className="hover:text-sky-600 hover:underline transition-colors"
                        >
                          {student.email}
                        </a>
                      </td>

                      {/* Class Name */}
                      <td className="py-4 px-4 text-slate-800 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>{student.class_name}</span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap font-mono tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(student.registration_date)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Student"
                            aria-label={`Edit ${student.full_name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Student"
                            aria-label={`Delete ${student.full_name}`}
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

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Student</h3>
                  <p className="text-xs text-slate-500">Student ID and timestamp will be automatically generated</p>
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.fullName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                {formErrors.fullName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ali.student@kips.edu.pk"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Class Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. F.Sc Pre-Medical Part I, ICS Part II"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.className ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {formErrors.className && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.className}</p>
                )}
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
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>Save Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Student Record</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {editingStudent.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.fullName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                {formErrors.fullName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Class Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-colors ${
                    formErrors.className ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {formErrors.className && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.className}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>Update Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Confirm Student Deletion"
        message={`Are you sure you want to delete ${studentToDelete?.full_name}? This will permanently remove their enrollment record from the Supabase database.`}
        confirmLabel="Yes, Delete Student"
        cancelLabel="Keep Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />

    </div>
  );
};
