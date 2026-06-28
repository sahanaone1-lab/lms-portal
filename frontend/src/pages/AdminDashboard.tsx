import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../components/Toast';
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Modal, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';
import { userService, courseService, lessonService, assignmentService, quizService, domainService, projectService } from '../services/apiService';
import { VideoPlayer } from '../components/VideoPlayer';
import { User, Course, Role, Lesson, Assignment, Quiz, Question, Domain, Project, ProjectRegistration } from '../types';
import { Users, BookOpen, GraduationCap, Award, Plus, Trash2, Edit2, ShieldAlert, ListTodo, FileCheck, Check, ChevronDown, ChevronUp, Play, FileText, HelpCircle, Edit, Trash, Eye, X, CheckCircle, Video, Briefcase, Upload, Grid } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { getAuthenticatedFileUrl } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
    exactAverageScore: 0,
    totalCertificates: 0,
    approvedCertificates: 0,
    pendingCertificates: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Create Course state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDomain, setCourseDomain] = useState('Full Stack');
  const [courseProjectCoordinatorId, setCourseProjectCoordinatorId] = useState('');
  const [courseVideoUrl, setCourseVideoUrl] = useState('');
  const [courseLessonContent, setCourseLessonContent] = useState('');

  // Edit Course state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureProgress, setBrochureProgress] = useState(0);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseDesc, setEditCourseDesc] = useState('');
  const [editCourseDomain, setEditCourseDomain] = useState('Full Stack');
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseThumbnail, setEditCourseThumbnail] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState('');
  const [editCourseDifficulty, setEditCourseDifficulty] = useState('Beginner');
  const [editCourseDuration, setEditCourseDuration] = useState('');
  const [editCourseOutcomes, setEditCourseOutcomes] = useState('');

  // Course Builder states
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState('Beginner');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState('');

  // Modals state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);

  // Weeks state
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [weekTitle, setWeekTitle] = useState('');
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);

  // Lessons state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonAttachment, setLessonAttachment] = useState('');
  const [lessonPdf, setLessonPdf] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonOrder, setLessonOrder] = useState('1');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [previewingLesson, setPreviewingLesson] = useState<Lesson | null>(null);
  const [isPreviewLessonModalOpen, setIsPreviewLessonModalOpen] = useState(false);

  // Assignments state
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  const [assignmentAttachment, setAssignmentAttachment] = useState('');
  const [assignmentDue, setAssignmentDue] = useState('');
  const [assignmentMaxMarks, setAssignmentMaxMarks] = useState('100');
  const [assignmentSubtype, setAssignmentSubtype] = useState('File Upload');
  const [assignmentRules, setAssignmentRules] = useState('');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Quiz state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizPassing, setQuizPassing] = useState('70');
  const [quizTimeLimit, setQuizTimeLimit] = useState('30');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q1', text: '', type: 'MCQ', options: ['', '', '', ''], correctOption: 0, correctOptions: [] }
  ]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [previewingQuiz, setPreviewingQuiz] = useState<Quiz | null>(null);
  const [isPreviewQuizModalOpen, setIsPreviewQuizModalOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPreviewPassed, setQuizPreviewPassed] = useState(false);
  const [quizPreviewScore, setQuizPreviewScore] = useState(0);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('INTERN');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('Full Stack');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [batch, setBatch] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<Role>('INTERN');
  const [editDomain, setEditDomain] = useState('Full Stack');
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editCollegeName, setEditCollegeName] = useState('');
  const [editBatch, setEditBatch] = useState('');

  // Bulk Modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkRole, setBulkRole] = useState<Role>('PROJECT_COORDINATOR');
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkFileError, setBulkFileError] = useState<string | null>(null);
  const [bulkFileSuccess, setBulkFileSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Domains State
  const [domains, setDomains] = useState<Domain[]>([]);
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [domainStats, setDomainStats] = useState<any[]>([]);

  // Domain modal state
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [selectedDomainItem, setSelectedDomainItem] = useState<any | null>(null);
  const [domName, setDomName] = useState('');
  const [domDesc, setDomDesc] = useState('');
  const [domIsActive, setDomIsActive] = useState(true);

  // Refresh ONLY domain stats (fast — keeps intern counts live)
  const refreshDomainStats = async () => {
    const statsList = await domainService.getStats().catch(() => []);
    setDomainStats(statsList);
  };

  const loadData = async () => {
    try {
      const statsData = await userService.getSystemStats();
      const usersData = await userService.getAll();
      const coursesData = await courseService.getAll();
      const projectsData = await projectService.getAll().catch(() => []);

      const activeDomains = await domainService.getAll(false).catch(() => []);
      const allDomainsList = await domainService.getAll(true).catch(() => []);
      const statsList = await domainService.getStats().catch(() => []);

      setDomains(activeDomains);
      setAllDomains(allDomainsList);
      setDomainStats(statsList);
      setStats(statsData);
      setUsers(usersData);
      setCourses(coursesData);
      setProjects(projectsData);
      const projectCoordinators = usersData.filter((u: any) => u.role === 'PROJECT_COORDINATOR');
      if (projectCoordinators.length > 0) {
        setCourseProjectCoordinatorId(projectCoordinators[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to sync with backend databases.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editUserId = params.get('edit');
    const courseId = params.get('id');

    if (editUserId && users.length > 0) {
      const u = users.find(user => user.id === editUserId);
      if (u) {
        handleOpenEditModal(u);
      }
    }

    if (courseId && courses.length > 0) {
      const c = courses.find(course => course.id === courseId);
      if (c) {
        handleSelectCourse(c);
      }
    }
  }, [location.search, users, courses]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in Name and Email.');
      return;
    }
    if (role === 'ADMIN' && !password) {
      setError('Password is required for Admin accounts.');
      return;
    }
    if (role !== 'ADMIN' && !password && !dob) {
      setError('Please provide a Date of Birth to act as the default password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const newUser = await userService.create({
        name,
        email,
        role,
        password: password || undefined,
        domain: (role === 'INTERN' || role === 'PROJECT_COORDINATOR') ? domain : undefined,
        employeeId: employeeId || undefined,
        username: employeeId || undefined,
        phone: phone || undefined,
        dob: dob || undefined,
        department: department || undefined,
        designation: role === 'PROJECT_COORDINATOR' ? designation : undefined,
        collegeName: role === 'INTERN' ? collegeName : undefined,
        batch: role === 'INTERN' ? batch : undefined,
        isApproved: true,
      });
      setUsers(prev => [...prev, newUser]);
      setIsUserModalOpen(false);
      // Immediately update domain intern counts
      await refreshDomainStats();
      setName('');
      setEmail('');
      setPassword('');
      setRole('INTERN');
      setDomain('Full Stack');
      setEmployeeId('');
      setPhone('');
      setDob('');
      setDepartment('');
      setDesignation('');
      setCollegeName('');
      setBatch('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    try {
      const updatedUser = await userService.update(selectedUser.id, {
        name: editName,
        email: editEmail,
        role: editRole,
        domain: (editRole === 'INTERN' || editRole === 'PROJECT_COORDINATOR') ? editDomain : undefined,
        employeeId: editEmployeeId || undefined,
        username: editEmployeeId || undefined,
        phone: editPhone || undefined,
        dob: editDob || undefined,
        department: editDepartment || undefined,
        designation: editRole === 'PROJECT_COORDINATOR' ? editDesignation || undefined : undefined,
        collegeName: editRole === 'INTERN' ? editCollegeName || undefined : undefined,
        batch: editRole === 'INTERN' ? editBatch || undefined : undefined,
      });
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
      setIsEditModalOpen(false);
      // Refresh domain counts when domain assignment changes
      await refreshDomainStats();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (targetRole: Role) => {
    let headers = '';
    let example = '';
    let filename = '';

    if (targetRole === 'PROJECT_COORDINATOR') {
      headers = 'Employee ID,Full Name,Email,Phone Number,Date of Birth (YYYY-MM-DD),Domain,Designation\n';
      example = 'EMP-102,John Doe,john@company.com,1234567890,1990-05-20,Full Stack,Senior Trainer\n';
      filename = 'project_coordinator_template.csv';
    } else {
      headers = 'intern id,name,email,phone no,dob,domain,clg,batch\n';
      example = 'INT-505,Jane Smith,jane@school.edu,9876543210,2002-11-12,Data Science,MIT,2026-B\n';
      filename = 'intern_template.csv';
    }

    // Add UTF-8 BOM to make it open correctly in Mac Excel/Numbers
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + headers + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkFileError(null);
    setBulkFileSuccess(null);

    if (!bulkCsvText.trim()) {
      setBulkFileError('Please select a file or paste CSV text.');
      return;
    }

    setLoading(true);
    try {
      // 1. Strip UTF-8 BOM if present (added by Excel/Numbers)
      let cleanText = bulkCsvText;
      if (cleanText.startsWith('\uFEFF')) {
        cleanText = cleanText.substring(1);
      }

      if (cleanText.startsWith('PK')) {
        throw new Error("It looks like you uploaded or pasted a binary spreadsheet (.numbers or .xlsx) instead of a CSV text file.\n\nPlease export the spreadsheet as a CSV (Comma Separated Values) file first:\n- Apple Numbers: File > Export To > CSV...\n- MS Excel: File > Save As... > Format: CSV.");
      }

      // 2. Normalize newlines to \n to support older Mac line endings (\r)
      const normalizedText = cleanText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        throw new Error('CSV is empty or contains only headers.');
      }

      // 3. Auto-detect delimiter from the header line (handles semicolons used by European/Mac regional settings)
      const firstLine = lines[0];
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const tabCount = (firstLine.match(/\t/g) || []).length;

      let delimiter = ',';
      if (semicolonCount > commaCount && semicolonCount > tabCount) {
        delimiter = ';';
      } else if (tabCount > commaCount && tabCount > semicolonCount) {
        delimiter = '\t';
      }

      // Parse headers dynamically to support arbitrary column orders
      const headers = firstLine.split(delimiter).map(h => h.replace(/['"]/g, '').trim().toLowerCase());

      const getIndex = (aliases: string[]) => {
        return headers.findIndex(h => aliases.includes(h));
      };

      const employeeIdIdx = getIndex(['employee id', 'id', 'employeeid', 'intern id', 'internid', 'projectCoordinator id']);
      const nameIdx = getIndex(['name', 'full name', 'fullname']);
      const emailIdx = getIndex(['email']);
      const phoneIdx = getIndex(['phone number', 'phone no', 'phone', 'phonenumber', 'phoneno']);
      const dobIdx = getIndex(['date of birth', 'dob', 'date of birth (yyyy-mm-dd)', 'dateofbirth']);
      const domainIdx = getIndex(['domain']);
      const designationIdx = getIndex(['designation']);
      const clgIdx = getIndex(['clg', 'college', 'college name', 'collegename']);
      const batchIdx = getIndex(['batch', 'assigned batch', 'assignedbatch']);

      if (nameIdx === -1 || emailIdx === -1) {
        throw new Error('CSV is missing required headers: "name" (or "full name") and "email".');
      }

      const rows = lines.slice(1);
      const parsedUsers: any[] = [];
      const parseErrors: string[] = [];

      rows.forEach((row, idx) => {
        try {
          const values: string[] = [];
          let currentVal = '';
          let inQuotes = false;
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
              values.push(currentVal.trim());
              currentVal = '';
            } else {
              currentVal += char;
            }
          }
          values.push(currentVal.trim());

          const getVal = (colIdx: number) => {
            return (colIdx !== -1 && colIdx < values.length) ? values[colIdx] : undefined;
          };

          if (bulkRole === 'PROJECT_COORDINATOR') {
            const employeeId = getVal(employeeIdIdx);
            const fullName = getVal(nameIdx);
            const email = getVal(emailIdx);
            const phone = getVal(phoneIdx);
            const dob = getVal(dobIdx);
            const domain = getVal(domainIdx);
            const designation = getVal(designationIdx);

            if (!employeeId || !fullName || !email || !dob) {
              throw new Error('Required fields (Employee ID, Full Name, Email, DOB) are missing.');
            }
            parsedUsers.push({
              role: 'PROJECT_COORDINATOR',
              employeeId,
              fullName,
              email,
              phone,
              dob,
              domain,
              designation,
            });
          } else {
            const internId = getVal(employeeIdIdx);
            const name = getVal(nameIdx);
            const email = getVal(emailIdx);
            const phoneNo = getVal(phoneIdx);
            const dob = getVal(dobIdx);
            const domainVal = getVal(domainIdx);
            const clg = getVal(clgIdx);
            const batch = getVal(batchIdx);

            if (!internId || !name || !email || !dob) {
              throw new Error('Required fields (intern id, name, email, dob) are missing.');
            }
            parsedUsers.push({
              role: 'INTERN',
              internId,
              fullName: name,
              email,
              phone: phoneNo,
              dob,
              domain: domainVal,
              collegeName: clg,
              batch,
            });
          }
        } catch (err: any) {
          parseErrors.push(`Row ${idx + 2}: ${err.message}`);
        }
      });

      if (parseErrors.length > 0) {
        throw new Error(`CSV Parsing failed:\n${parseErrors.join('\n')}`);
      }

      const response = await userService.bulkCreate(parsedUsers);
      const createdCount = response.created?.length || 0;
      const errorCount = response.errors?.length || 0;

      if (errorCount > 0) {
        setBulkFileSuccess(`Imported ${createdCount} users successfully.`);
        setBulkFileError(`Encountered ${errorCount} errors:\n${response.errors.join('\n')}`);
      } else {
        setBulkFileSuccess(`All ${createdCount} users imported successfully.`);
        // Reset states
        setBulkCsvText('');
        // Close modal after delay
        setTimeout(() => {
          setIsBulkModalOpen(false);
          setBulkFileSuccess(null);
        }, 1500);
      }

      // Refresh directory
      await loadData();
    } catch (err: any) {
      setBulkFileError(err.message || 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const updatedUser = await userService.update(userId, { isApproved: true });
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      await refreshDomainStats();
    } catch (err: any) {
      alert(err.message || 'Failed to approve user');
    }
  };

  const handleDeleteUser = (u: User) => {
    setDeleteConfirmUser(u);
  };

  const executeDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try {
      await userService.delete(deleteConfirmUser.id);
      toast.success(`User "${deleteConfirmUser.name}" deleted successfully.`);
      setDeleteConfirmUser(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleOpenEditModal = (u: User) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditDomain(u.domain || 'Full Stack');
    setEditEmployeeId(u.employeeId || '');
    setEditPhone(u.phone || '');

    const dobString = u.dob
      ? (typeof u.dob === 'string' ? u.dob.split('T')[0] : new Date(u.dob).toISOString().split('T')[0])
      : '';
    setEditDob(dobString);
    setEditDepartment(u.department || '');
    setEditDesignation(u.designation || '');
    setEditCollegeName(u.collegeName || '');
    setEditBatch(u.batch || '');

    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setDeleteConfirm({
      show: true,
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course? All associated lessons, quizzes, and certificates will be removed.',
      onConfirm: async () => {
        try {
          await courseService.delete(id);
          setCourses(prev => prev.filter(c => c.id !== id));
          toast.success('Course successfully removed');
          if (selectedCourse?.id === id) {
            setSelectedCourse(null);
          }
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete course');
        }
      },
    });
  };

  const handleSelectCourse = async (course: Course) => {
    try {
      const detailed = await courseService.getById(course.id);
      setSelectedCourse(detailed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBrochureUpload = async (file: File) => {
    if (!selectedCourse) return;
    
    // File validation
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
    if (!allowedExtensions.includes(extension)) {
      toast.error('Only PDF and image files (PNG, JPG, JPEG, WEBP) are allowed');
      return;
    }
    
    try {
      setBrochureUploading(true);
      setBrochureProgress(0);
      const updated = await (courseService as any).uploadBrochure(
        selectedCourse.id,
        file,
        (percent: number) => setBrochureProgress(percent)
      );
      toast.success('Brochure uploaded successfully');
      
      // Update selected course details in UI
      const detailed = await courseService.getById(selectedCourse.id);
      setSelectedCourse(detailed);
      
      // Update in course list as well
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, ...detailed } : c));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload brochure');
    } finally {
      setBrochureUploading(false);
    }
  };

  const handleBrochureDelete = () => {
    if (!selectedCourse) return;
    setDeleteConfirm({
      show: true,
      title: 'Delete Brochure',
      message: 'Are you sure you want to delete this course brochure?',
      onConfirm: async () => {
        try {
          await (courseService as any).deleteBrochure(selectedCourse.id);
          toast.success('Brochure deleted successfully');
          
          // Update selected course details in UI
          const detailed = await courseService.getById(selectedCourse.id);
          setSelectedCourse(detailed);
          
          // Update in course list as well
          setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, ...detailed } : c));
        } catch (err: any) {
          console.error(err);
          toast.error('Failed to delete brochure');
        }
      },
    });
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const updatedCourse = await courseService.update(selectedCourse.id, {
        title: editCourseTitle,
        description: editCourseDesc,
        domain: editCourseDomain,
      });
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, ...updatedCourse } : c));
      setIsEditCourseModalOpen(false);
    } catch (err: any) {
      alert('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;
    setLoading(true);
    try {
      const newCourse = await courseService.create({
        title: courseTitle,
        description: courseDesc,
        domain: courseDomain,
        projectCoordinatorId: courseProjectCoordinatorId || undefined,
      });

      // Create Lesson if video URL is provided
      if (courseVideoUrl) {
        await lessonService.create({
          courseId: newCourse.id,
          title: '1. Introduction to ' + courseTitle,
          content: courseLessonContent || 'In this lesson, we will cover the core concepts of ' + courseTitle + '.',
          videoUrl: courseVideoUrl,
          order: 1,
        });
      }

      // Refresh list to pull course with all updated properties
      const coursesData = await courseService.getAll().catch(() => []);
      setCourses(coursesData);

      setIsCourseModalOpen(false);
      setCourseTitle('');
      setCourseDesc('');
      setCourseDomain('Full Stack');
      setCourseVideoUrl('');
      setCourseLessonContent('');
    } catch (err: any) {
      alert(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domName.trim()) {
      alert('Domain name is required.');
      return;
    }
    setLoading(true);
    try {
      if (selectedDomainItem) {
        // Edit
        await domainService.update(selectedDomainItem.id, {
          name: domName,
          description: domDesc,
          isActive: domIsActive
        });
        alert('Domain updated successfully.');
      } else {
        // Create
        await domainService.create({
          name: domName,
          description: domDesc
        });
        alert('Domain created successfully.');
      }
      setIsDomainModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to save domain');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDomainActive = (dom: Domain) => {
    const action = dom.isActive ? 'disable' : 'enable';
    setDeleteConfirm({
      show: true,
      title: `${dom.isActive ? 'Disable' : 'Enable'} Domain`,
      message: `Are you sure you want to ${action} the "${dom.name}" domain?`,
      onConfirm: async () => {
        try {
          await domainService.update(dom.id, { isActive: !dom.isActive });
          await loadData();
          toast.success(`Domain ${action}d successfully`);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to update domain status');
        }
      },
    });
  };
  // Helper methods for Course Builder
  const getCourseWeeks = (course: Course) => {
    if (course.weeks && course.weeks.length > 0) {
      return course.weeks;
    }
    return [{ id: 'w_default', number: 1, title: 'Introduction' }];
  };

  const getWeekItems = (weekId: string, course: Course) => {
    const weeks = getCourseWeeks(course);
    const isFirstWeek = weeks[0]?.id === weekId;

    const lessons = (course.lessons || []).filter(l =>
      l.weekId === weekId || (isFirstWeek && !l.weekId)
    );
    const assignments = (course.assignments || []).filter(a =>
      a.weekId === weekId || (isFirstWeek && !a.weekId)
    );
    const quizzes = (course.quizzes || []).filter(q =>
      q.weekId === weekId || (isFirstWeek && !q.weekId)
    );

    return { lessons, assignments, quizzes };
  };

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const openEditCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setEditCourseTitle(course.title);
    setEditCourseDesc(course.description);
    setEditCourseDomain(course.domain || 'Full Stack');
    setEditCourseThumbnail(course.coverImage || '');
    setEditCourseCategory(course.category || '');
    setEditCourseDifficulty(course.difficulty || 'Beginner');
    setEditCourseDuration(course.duration || '');
    setEditCourseOutcomes(course.learningOutcomes ? course.learningOutcomes.join('\n') : '');
    setIsEditCourseModalOpen(true);
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await courseService.update(courseId, { status: 'Published' });
      alert('Course published successfully!');
      const detailed = await courseService.getById(courseId);
      setSelectedCourse(detailed);
      // Refresh list
      const coursesData = await courseService.getAll().catch(() => []);
      setCourses(coursesData);
    } catch (err) {
      alert('Failed to publish course');
    }
  };

  const handleArchiveCourse = async (courseId: string) => {
    try {
      await courseService.update(courseId, { status: 'Archived' });
      alert('Course archived.');
      const detailed = await courseService.getById(courseId);
      setSelectedCourse(detailed);
      // Refresh list
      const coursesData = await courseService.getAll().catch(() => []);
      setCourses(coursesData);
    } catch (err) {
      alert('Failed to archive course');
    }
  };

  const handleSaveWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !weekTitle) return;
    try {
      const currentWeeks = getCourseWeeks(selectedCourse);
      if (editingWeekId) {
        const updatedWeeks = currentWeeks.map(w =>
          w.id === editingWeekId ? { ...w, title: weekTitle } : w
        );
        await courseService.update(selectedCourse.id, { weeks: updatedWeeks });
      } else {
        const newWeek = {
          id: 'w_' + Math.random().toString(36).substring(7),
          number: currentWeeks.length + 1,
          title: weekTitle
        };
        await courseService.update(selectedCourse.id, { weeks: [...currentWeeks, newWeek] });
      }
      setIsWeekModalOpen(false);
      setWeekTitle('');
      setEditingWeekId(null);

      const detailed = await courseService.getById(selectedCourse.id);
      setSelectedCourse(detailed);
    } catch (err: any) {
      console.error(err);
      alert('Failed to save module: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteWeek = (weekId: string) => {
    if (!selectedCourse) return;
    setDeleteConfirm({
      show: true,
      title: 'Delete Module',
      message: 'Are you sure you want to delete this module? Lessons, quizzes, and assignments in this module will be reassigned to Module 1.',
      onConfirm: async () => {
        try {
          const currentWeeks = getCourseWeeks(selectedCourse);
          const filteredWeeks = currentWeeks.filter(w => w.id !== weekId);
          const updatedWeeks = filteredWeeks.map((w, idx) => ({ ...w, number: idx + 1 }));

          await courseService.update(selectedCourse.id, { weeks: updatedWeeks });

          const firstWeekId = updatedWeeks[0]?.id || 'w_default';
          const lessons = selectedCourse.lessons || [];
          for (const l of lessons) {
            if (l.weekId === weekId) {
              await lessonService.update(l.id, { weekId: firstWeekId });
            }
          }
          const assignments = selectedCourse.assignments || [];
          for (const a of assignments) {
            if (a.weekId === weekId) {
              await assignmentService.update(a.id, { weekId: firstWeekId });
            }
          }
          const quizzes = selectedCourse.quizzes || [];
          for (const q of quizzes) {
            if (q.weekId === weekId) {
              await quizService.update(q.id, { weekId: firstWeekId });
            }
          }

          toast.success('Module successfully deleted');
          handleSelectCourse(selectedCourse);
        } catch (err: any) {
          toast.error('Failed to delete module');
        }
      },
    });
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !lessonTitle) return;
    try {
      if (editingLesson) {
        await lessonService.update(editingLesson.id, {
          title: lessonTitle,
          content: lessonContent,
          videoUrl: lessonVideo,
          pdfResource: lessonPdf,
          duration: lessonDuration,
          order: parseInt(lessonOrder) || 1
        });
        alert('Lesson updated successfully!');
      } else {
        await lessonService.create({
          courseId: selectedCourse.id,
          weekId: activeWeekId || undefined,
          title: lessonTitle,
          content: lessonContent,
          videoUrl: lessonVideo,
          pdfResource: lessonPdf,
          duration: lessonDuration,
          order: parseInt(lessonOrder) || 1
        });
        alert('Lesson added successfully!');
      }

      setIsLessonModalOpen(false);
      setLessonTitle('');
      setLessonContent('');
      setLessonVideo('');
      setLessonPdf('');
      setLessonDuration('');
      setLessonOrder('1');
      setEditingLesson(null);
      setActiveWeekId(null);

      handleSelectCourse(selectedCourse);
    } catch (err) {
      alert('Failed to save lesson');
    }
  };

  const handleEditLesson = (les: Lesson) => {
    setEditingLesson(les);
    setLessonTitle(les.title);
    setLessonContent(les.content);
    setLessonVideo(les.videoUrl || '');
    setLessonPdf(les.pdfResource || '');
    setLessonDuration(les.duration || '');
    setLessonOrder(les.order.toString());
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = (id: string) => {
    setDeleteConfirm({
      show: true,
      title: 'Delete Lesson',
      message: 'Are you sure you want to delete this lesson?',
      onConfirm: async () => {
        try {
          await lessonService.delete(id);
          toast.success('Lesson deleted successfully');
          if (selectedCourse) handleSelectCourse(selectedCourse);
        } catch (err: any) {
          toast.error('Failed to delete lesson');
        }
      },
    });
  };

  const handlePreviewLesson = (les: Lesson) => {
    setPreviewingLesson(les);
    setIsPreviewLessonModalOpen(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !assignmentTitle) return;
    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.id, {
          title: assignmentTitle,
          instruction: assignmentInstructions,
          attachmentUrl: assignmentAttachment,
          dueDate: assignmentDue,
          maxMarks: parseInt(assignmentMaxMarks) || 100,
          submissionType: assignmentSubtype as any,
          submissionRules: assignmentRules
        });
        alert('Assignment updated successfully!');
      } else {
        await assignmentService.create({
          courseId: selectedCourse.id,
          weekId: activeWeekId || undefined,
          title: assignmentTitle,
          instruction: assignmentInstructions,
          attachmentUrl: assignmentAttachment,
          dueDate: assignmentDue,
          maxMarks: parseInt(assignmentMaxMarks) || 100,
          submissionType: assignmentSubtype as any,
          submissionRules: assignmentRules
        });
        alert('Assignment posted successfully!');
      }
      setIsAssignmentModalOpen(false);
      setAssignmentTitle('');
      setAssignmentInstructions('');
      setAssignmentAttachment('');
      setAssignmentDue('');
      setAssignmentMaxMarks('100');
      setAssignmentSubtype('File Upload');
      setAssignmentRules('');
      setEditingAssignment(null);
      setActiveWeekId(null);

      handleSelectCourse(selectedCourse);
    } catch (err) {
      alert('Failed to save assignment');
    }
  };

  const handleEditAssignment = (asg: Assignment) => {
    setEditingAssignment(asg);
    setAssignmentTitle(asg.title);
    setAssignmentInstructions(asg.instruction);
    setAssignmentAttachment(asg.attachmentUrl || '');
    setAssignmentDue(asg.dueDate ? asg.dueDate.split('T')[0] : '');
    setAssignmentMaxMarks((asg.maxMarks || 100).toString());
    setAssignmentSubtype(asg.submissionType || 'File Upload');
    setAssignmentRules(asg.submissionRules || '');
    setIsAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = (id: string) => {
    setDeleteConfirm({
      show: true,
      title: 'Delete Assignment',
      message: 'Are you sure you want to delete this assignment?',
      onConfirm: async () => {
        try {
          await assignmentService.delete(id);
          toast.success('Assignment deleted successfully');
          if (selectedCourse) handleSelectCourse(selectedCourse);
        } catch (err: any) {
          toast.error('Failed to delete assignment');
        }
      },
    });
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !quizTitle) return;
    try {
      const validatedQuestions = questions.map(q => {
        if (q.type === 'TF') {
          return {
            id: q.id || 'q_' + Math.random().toString(36).substring(7),
            text: q.text,
            type: q.type,
            options: ['True', 'False'],
            correctOption: q.correctOption ?? 0
          };
        } else if (q.type === 'MS') {
          return {
            id: q.id || 'q_' + Math.random().toString(36).substring(7),
            text: q.text,
            type: q.type,
            options: q.options.filter(Boolean),
            correctOptions: q.correctOptions || [0],
            correctOption: 0
          };
        } else {
          return {
            id: q.id || 'q_' + Math.random().toString(36).substring(7),
            text: q.text,
            type: q.type,
            options: q.options.filter(Boolean),
            correctOption: q.correctOption ?? 0
          };
        }
      });

      if (editingQuiz) {
        await quizService.update(editingQuiz.id, {
          title: quizTitle,
          passingScore: parseInt(quizPassing) || 70,
          timeLimit: parseInt(quizTimeLimit) || 30,
          questions: validatedQuestions
        });
        alert('Quiz updated successfully!');
      } else {
        await quizService.create({
          courseId: selectedCourse.id,
          weekId: activeWeekId || undefined,
          title: quizTitle,
          passingScore: parseInt(quizPassing) || 70,
          timeLimit: parseInt(quizTimeLimit) || 30,
          questions: validatedQuestions
        });
        alert('Quiz created successfully!');
      }
      setIsQuizModalOpen(false);
      setQuizTitle('');
      setQuizPassing('70');
      setQuizTimeLimit('30');
      setQuestions([{ id: 'q1', text: '', type: 'MCQ', options: ['', '', '', ''], correctOption: 0, correctOptions: [] }]);
      setEditingQuiz(null);
      setActiveWeekId(null);

      handleSelectCourse(selectedCourse);
    } catch (err) {
      alert('Failed to save quiz');
    }
  };

  const handleEditQuiz = (qz: Quiz) => {
    setEditingQuiz(qz);
    setQuizTitle(qz.title);
    setQuizPassing(qz.passingScore.toString());
    setQuizTimeLimit((qz.timeLimit || 30).toString());
    setQuestions(qz.questions && qz.questions.length > 0 ? qz.questions : [{ id: 'q1', text: '', type: 'MCQ', options: ['', '', '', ''], correctOption: 0, correctOptions: [] }]);
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = (id: string) => {
    setDeleteConfirm({
      show: true,
      title: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz?',
      onConfirm: async () => {
        try {
          await quizService.delete(id);
          toast.success('Quiz deleted successfully');
          if (selectedCourse) handleSelectCourse(selectedCourse);
        } catch (err: any) {
          toast.error('Failed to delete quiz');
        }
      },
    });
  };

  const handlePreviewQuiz = (qz: Quiz) => {
    setPreviewingQuiz(qz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPreviewScore(0);
    setQuizPreviewPassed(false);
    setIsPreviewQuizModalOpen(true);
  };

  const updateQuestion = (index: number, key: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [key]: value } : q));
  };

  const updateQuestionOption = (qIdx: number, oIdx: number, val: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const updatedOptions = [...q.options];
        updatedOptions[oIdx] = val;
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };

  const handleQuestionTypeChange = (idx: number, type: 'MCQ' | 'TF' | 'MS') => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === idx) {
        if (type === 'TF') {
          return {
            ...q,
            type,
            options: ['True', 'False'],
            correctOption: 0,
            correctOptions: []
          };
        } else if (type === 'MCQ') {
          return {
            ...q,
            type,
            options: q.options.length < 2 ? ['', '', '', ''] : q.options,
            correctOption: 0,
            correctOptions: []
          };
        } else {
          return {
            ...q,
            type,
            options: q.options.length < 2 ? ['', '', '', ''] : q.options,
            correctOption: 0,
            correctOptions: [0]
          };
        }
      }
      return q;
    }));
  };

  const toggleMSCorrectOption = (qIdx: number, oIdx: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const current = q.correctOptions || [];
        const next = current.includes(oIdx)
          ? current.filter(x => x !== oIdx)
          : [...current, oIdx];
        return { ...q, correctOptions: next };
      }
      return q;
    }));
  };

  const handleAddQuestionRow = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: 'q_' + Math.random().toString(36).substring(7),
        text: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        correctOption: 0,
        correctOptions: []
      }
    ]);
  };

  const handleRemoveQuestionRow = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSelectQuizAnswer = (qId: string, oIdx: number, type: 'MCQ' | 'TF' | 'MS') => {
    if (type === 'MS') {
      const current: number[] = quizAnswers[qId] || [];
      const next = current.includes(oIdx)
        ? current.filter(x => x !== oIdx)
        : [...current, oIdx];
      setQuizAnswers(prev => ({ ...prev, [qId]: next }));
    } else {
      setQuizAnswers(prev => ({ ...prev, [qId]: oIdx }));
    }
  };

  const handleSubmitPreviewQuiz = () => {
    if (!previewingQuiz) return;
    let correctCount = 0;
    previewingQuiz.questions.forEach(q => {
      const ans = quizAnswers[q.id];
      if (q.type === 'MS') {
        const correct = q.correctOptions || [];
        const studentAns = ans || [];
        const isCorrect = correct.length === studentAns.length && correct.every((x: any) => studentAns.includes(x));
        if (isCorrect) correctCount++;
      } else {
        if (ans === q.correctOption) correctCount++;
      }
    });

    const score = Math.round((correctCount / previewingQuiz.questions.length) * 100);
    setQuizPreviewScore(score);
    setQuizPreviewPassed(score >= previewingQuiz.passingScore);
    setQuizSubmitted(true);
  };
  const renderDashboard = () => {
    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title={`Welcome Back, ${user?.name || 'Admin'}! 👋`}
          subtitle="Admin Control Center"
          description="Oversee organizational pathways, manage active courses, monitor enrollments, and check global course outcomes."
          initials={user?.name?.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase() || 'CS'}
          badgeText="CONTROL"
          badgeSubText="ADMIN"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Total Employees</p>
                <h3 className="text-3xl font-bold font-display mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Courses Created</p>
                <h3 className="text-3xl font-bold font-display mt-1">{stats.totalCourses}</h3>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Enrollments</p>
                <h3 className="text-3xl font-bold font-display mt-1">{stats.totalEnrollments}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <GraduationCap className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Completion Rate</p>
                <h3 className="text-3xl font-bold font-display mt-1">{stats.completionRate}%</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Certificate Score Avg</p>
                <h3 className="text-3xl font-bold font-display mt-1">{stats.exactAverageScore}%</h3>
              </div>
              <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                <FileCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-5 h-full space-y-4 text-left">
              <h3 className="text-base font-bold font-display">Directory Directory Quicklist</h3>
              <div className="divide-y divide-border/50 max-h-72 overflow-y-auto pr-1">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant={u.role === 'ADMIN' ? 'destructive' : u.role === 'PROJECT_COORDINATOR' ? 'success' : 'outline'}>
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6 text-left">
            <Card className="p-5 space-y-4">
              <h3 className="text-base font-bold font-display">Quick Management</h3>
              <div className="grid grid-cols-1 gap-2.5">
                <Button onClick={() => {
                  // Reset all form fields before opening the modal
                  setName(''); setEmail(''); setPassword(''); setRole('INTERN');
                  setDomain('Full Stack'); setEmployeeId(''); setPhone('');
                  setDob(''); setDepartment(''); setDesignation('');
                  setCollegeName(''); setBatch(''); setError(null);
                  setIsUserModalOpen(true);
                }} className="w-full text-xs py-2 flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
                <Button onClick={() => setIsCourseModalOpen(true)} className="w-full text-xs py-2 flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/users')} className="w-full text-xs py-2 flex items-center justify-center">
                  <Users className="mr-2 h-4 w-4" /> User Directory
                </Button>
                <Button variant="secondary" onClick={() => navigate('/admin/courses')} className="w-full text-xs py-2 flex items-center justify-center">
                  <BookOpen className="mr-2 h-4 w-4" /> View Curriculum
                </Button>
              </div>
            </Card>

            {/* About the Company */}
            <Card className="p-5 space-y-3 bg-gradient-to-br from-primary/5 via-secondary/10 to-transparent border border-primary/10">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Career Solutions" className="h-9 w-auto object-contain mix-blend-multiply" />
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-primary">About Career Solutions</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Career Solutions is a premier global corporate training and workforce enablement leader. We specialize in bridge-the-gap career acceleration programs across technology, data, and marketing domains to empower professionals with industry-ready capabilities.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const approvedUsers = users.filter((u) => u.isApproved !== false);
    const pendingInterns = users.filter((u) => u.role === 'INTERN' && u.isApproved === false);

    return (
      <div className="space-y-6 text-left animate-fade-in">
        <HeroBanner
          title="User Directory Manager"
          subtitle="Admin Control"
          description="Manage your corporate learners, trainers, and admins."
          icon={Users}
          badgeText="USER DIR"
          badgeSubText="ADMIN"
          extraContent={
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsBulkModalOpen(true)}
                className="h-10 px-4 text-xs font-bold shadow-xs border-white/20 text-white bg-white/10 hover:bg-white/20 hover:text-white"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Bulk Import (CSV)
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setName(''); setEmail(''); setPassword(''); setRole('INTERN');
                  setDomain('Full Stack'); setEmployeeId(''); setPhone('');
                  setDob(''); setDepartment(''); setDesignation('');
                  setCollegeName(''); setBatch(''); setError(null);
                  setIsUserModalOpen(true);
                }}
                className="h-10 px-4 text-xs font-bold shadow-xs bg-white text-[#0F4C81] hover:bg-white/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add Member
              </Button>
            </div>
          }
        />

        {/* User Tabs Card */}
        <Card className="text-left">
          <CardContent className="pt-6">
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Members ({approvedUsers.length})</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending Approvals ({pendingInterns.length})
                  {pendingInterns.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-destructive text-destructive-foreground rounded-full font-bold">
                      {pendingInterns.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Project Coordinators & Staff Column */}
                  <Card className="border border-border/80 shadow-xs">
                    <CardHeader className="pb-3 border-b border-border/50 bg-secondary/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold font-display">Project Coordinators & Staff</CardTitle>
                        <Badge variant="success" className="text-[10px] font-semibold uppercase">
                          {approvedUsers.filter((u) => u.role === 'PROJECT_COORDINATOR' || u.role === 'ADMIN').length} Members
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold bg-secondary/10">
                              <th className="p-3">Name & Role</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Employee ID & Dept</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {approvedUsers
                              .filter((u) => u.role === 'PROJECT_COORDINATOR' || u.role === 'ADMIN')
                              .map((u) => (
                                <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                                  <td className="p-3">
                                    <div className="font-semibold text-foreground text-sm">{u.name}</div>
                                    <Badge
                                      variant={u.role === 'ADMIN' ? 'destructive' : 'success'}
                                      className="mt-0.5 text-[9px] px-1.5 py-0 uppercase tracking-wider"
                                    >
                                      {u.role}
                                    </Badge>
                                    {u.role === 'PROJECT_COORDINATOR' && (
                                      <Badge
                                        variant="secondary"
                                        className="mt-0.5 ml-1 text-[9px] px-1.5 py-0 uppercase"
                                      >
                                        {u.domain || 'Full Stack'}
                                      </Badge>
                                    )}
                                  </td>
                                  <td className="p-3 text-muted-foreground font-medium">{u.email}</td>
                                  <td className="p-3 text-muted-foreground space-y-0.5">
                                    <p className="font-mono text-[10px] font-semibold text-foreground bg-secondary/30 px-1 py-0.5 rounded inline-block">
                                      {u.employeeId || 'N/A'}
                                    </p>
                                    {u.department && (
                                      <p className="text-[10px] font-semibold opacity-75">{u.department}</p>
                                    )}
                                  </td>
                                  <td className="p-3 text-right space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenEditModal(u)}
                                    >
                                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDeleteUser(u)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interns Column */}
                  <Card className="border border-border/80 shadow-xs">
                    <CardHeader className="pb-3 border-b border-border/50 bg-secondary/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold font-display">Interns Directory</CardTitle>
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                          {approvedUsers.filter((u) => u.role === 'INTERN').length} Interns
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold bg-secondary/10">
                              <th className="p-3">Name & Domain</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Intern ID & College / Batch</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {approvedUsers
                              .filter((u) => u.role === 'INTERN')
                              .map((u) => (
                                <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                                  <td className="p-3">
                                    <div className="font-semibold text-foreground text-sm">{u.name}</div>
                                    <Badge variant="secondary" className="mt-0.5 text-[9px] px-1.5 py-0 uppercase">
                                      {u.domain || 'Full Stack'}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-muted-foreground font-medium">{u.email}</td>
                                  <td className="p-3 text-muted-foreground space-y-1">
                                    <p className="font-mono text-[10px] font-semibold text-foreground bg-secondary/30 px-1 py-0.5 rounded inline-block">
                                      {u.employeeId || 'N/A'}
                                    </p>
                                    {(u.collegeName || u.batch) && (
                                      <div className="text-[10px] opacity-75 font-semibold space-y-0.5">
                                        {u.collegeName && <p className="truncate max-w-[150px]">{u.collegeName}</p>}
                                        {u.batch && <p className="text-primary">{u.batch}</p>}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3 text-right space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenEditModal(u)}
                                    >
                                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDeleteUser(u)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pending">
                {pendingInterns.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                    No accounts pending approval at this time.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold bg-secondary/20">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Domain</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {pendingInterns.map((u) => (
                          <tr key={u.id} className="hover:bg-secondary/15 transition-colors">
                            <td className="p-4 font-semibold text-foreground">{u.name}</td>
                            <td className="p-4 text-muted-foreground">{u.email}</td>
                            <td className="p-4 text-muted-foreground">{u.domain || 'Full Stack'}</td>
                            <td className="p-4 text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-600 hover:bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:hover:bg-emerald-500/10 dark:border-emerald-500/20"
                                onClick={() => handleApproveUser(u.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/5"
                                onClick={() => handleDeleteUser(u)}
                              >
                                Reject
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCourses = () => {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <HeroBanner
          title="Curriculum Syllabus Manager"
          subtitle="LMS Course Builder"
          description="Construct weekly structures, manage video lessons, write quizzes, and issue assignments."
          icon={BookOpen}
          badgeText="COURSES"
          badgeSubText="ADMIN"
          extraContent={
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setCourseTitle('');
                  setCourseDesc('');
                  setCourseDomain('Full Stack');
                  setIsCourseModalOpen(true);
                }}
                className="h-10 px-4 text-xs font-bold shadow-xs bg-white text-[#0F4C81] hover:bg-white/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Course
              </Button>
            </div>
          }
        />

        {/* 2-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Course list sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">Created Catalog</h3>
            {courses.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 border border-dashed rounded-lg">No courses created yet.</p>
            ) : (
              courses.map((course) => (
                <Card
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`cursor-pointer border-l-4 transition-all text-left ${selectedCourse?.id === course.id
                      ? 'border-l-primary bg-primary/5 shadow-md'
                      : 'border-l-transparent hover:bg-secondary/10'
                    }`}
                >
                  <CardHeader className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <CardTitle className="text-sm font-bold truncate leading-snug">{course.title}</CardTitle>
                      <Badge variant={
                        course.status === 'Published' ? 'success' :
                          course.status === 'Archived' ? 'destructive' : 'outline'
                      } className="text-[8px] px-1 py-0 shadow-none capitalize">
                        {course.status || 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                        {course.domain || 'Full Stack'}
                      </Badge>
                      {course.difficulty && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-background/50">
                          {course.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed mt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          {/* Column 2: Central Course Builder (9 cols) */}
          <div className="lg:col-span-9">
            {selectedCourse ? (
              <div className="space-y-6 text-left">
                {/* Course Metadata Card */}
                <Card className="p-5 border border-border shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-border/60 pb-4 gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold font-display text-foreground leading-tight">{selectedCourse.title}</h3>
                        <Badge variant="secondary">{selectedCourse.domain || 'Full Stack'}</Badge>
                        <Badge variant={
                          selectedCourse.status === 'Published' ? 'success' :
                            selectedCourse.status === 'Archived' ? 'destructive' : 'outline'
                        } className="text-[9px]">
                          {selectedCourse.status || 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedCourse.description}</p>
                      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground flex-wrap pt-1">
                        {selectedCourse.category && <span>Category: <span className="text-foreground">{selectedCourse.category}</span></span>}
                        {selectedCourse.difficulty && <span>Level: <span className="text-foreground">{selectedCourse.difficulty}</span></span>}
                        {selectedCourse.duration && <span>Duration: <span className="text-foreground">{selectedCourse.duration}</span></span>}
                      </div>

                      {/* Learning Outcomes List */}
                      {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Learning Outcomes</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedCourse.learningOutcomes.map((out, oIdx) => (
                              <span key={oIdx} className="text-[10px] bg-secondary/40 text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1 font-medium border border-secondary/60">
                                <Check className="h-3 w-3 text-emerald-500" /> {out}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Manager Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/10 p-3 rounded-lg border border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Course Controls</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => openEditCourseModal(selectedCourse)} className="text-xs h-8 px-3">
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit details
                      </Button>
                      {selectedCourse.status !== 'Published' && (
                        <Button size="sm" variant="secondary" onClick={() => handlePublishCourse(selectedCourse.id)} className="text-xs h-8 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/25">
                          Publish Course
                        </Button>
                      )}
                      {selectedCourse.status === 'Published' && (
                        <Button size="sm" variant="secondary" onClick={() => handleArchiveCourse(selectedCourse.id)} className="text-xs h-8 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/25">
                          Archive Course
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(selectedCourse.id)} className="text-xs h-8 px-3">
                        <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Brochure Section */}
                <Card className="p-5 border border-border shadow-sm text-left">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                    <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-[#0F4C81]" />
                      Course Curriculum Brochure
                    </h4>
                    {selectedCourse.brochureUrl && (
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                        Brochure Active
                      </Badge>
                    )}
                  </div>

                  {selectedCourse.brochureUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40 gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-500/10 text-rose-600 rounded-lg border border-rose-500/20">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground truncate max-w-xs sm:max-w-md">
                              {selectedCourse.brochureName || 'course-brochure.pdf'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Uploaded {selectedCourse.uploadedBy ? `by ${selectedCourse.uploadedBy}` : ''} {selectedCourse.uploadedAt ? `on ${new Date(selectedCourse.uploadedAt).toLocaleDateString()}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(selectedCourse.brochureUrl, '_blank')}
                            className="text-xs h-8"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Brochure
                          </Button>

                          <div className="relative">
                            <input
                              type="file"
                              id="replace-brochure-file"
                              className="hidden"
                              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleBrochureUpload(file);
                              }}
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => document.getElementById('replace-brochure-file')?.click()}
                              className="text-xs h-8"
                            >
                              Replace Brochure
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleBrochureDelete}
                            className="text-xs h-8"
                          >
                            <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 hover:border-[#0F4C81]/50 transition-all rounded-xl p-8 text-center bg-secondary/5 relative">
                        <input
                          type="file"
                          id="brochure-file-input"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBrochureUpload(file);
                          }}
                        />
                        <div className="p-3 bg-secondary/40 text-muted-foreground rounded-full mb-3">
                          <Upload className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Upload Course Brochure</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          PDF format is preferred. Images (PNG, JPG, WEBP) are also supported. Max size: 10MB.
                        </p>
                      </div>
                    </div>
                  )}

                  {brochureUploading && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                        <span>Uploading brochure...</span>
                        <span>{brochureProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0F4C81] rounded-full transition-all duration-150"
                          style={{ width: `${brochureProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>

                {/* Collapsible Weeks Outlines */}
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center bg-secondary/5 p-2 rounded-lg border border-border/40">
                    <h4 className="text-xs font-bold font-display text-muted-foreground uppercase tracking-wider pl-1">Course Module Curriculum</h4>
                    <Button size="sm" onClick={() => { setEditingWeekId(null); setWeekTitle(''); setIsWeekModalOpen(true); }} className="text-xs h-8">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Module
                    </Button>
                  </div>

                  {(() => {
                    const weeks = getCourseWeeks(selectedCourse);
                    return (
                      <div className="space-y-3">
                        {weeks.map((week) => {
                          const isExpanded = expandedWeeks[week.id];
                          const { lessons, assignments, quizzes } = getWeekItems(week.id, selectedCourse);
                          return (
                            <Card key={week.id} className="overflow-hidden border border-border shadow-sm">
                              {/* Module Header - Accordion Toggle */}
                              <div
                                onClick={() => toggleWeek(week.id)}
                                className="p-4 bg-secondary/10 hover:bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-colors border-b border-border/40 gap-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-sm text-foreground">Module {week.number} — {week.title}</span>
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-background/60 text-muted-foreground border-border/80">
                                    {lessons.length} lessons • {quizzes.length} quizzes • {assignments.length} assignments
                                  </Badge>
                                </div>

                                {/* Header Actions */}
                                <div className="flex flex-wrap items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" onClick={() => { setEditingWeekId(week.id); setWeekTitle(week.title); setIsWeekModalOpen(true); }} className="h-7 text-[10px] px-2" title="Edit Module Title">
                                    Edit Title
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => { setActiveWeekId(week.id); setEditingLesson(null); setLessonTitle(''); setLessonContent(''); setLessonVideo(''); setLessonPdf(''); setLessonDuration(''); setLessonOrder((lessons.length + 1).toString()); setIsLessonModalOpen(true); }} className="h-7 text-[10px] px-2">
                                    + Lesson
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => { setActiveWeekId(week.id); setEditingQuiz(null); setQuizTitle(''); setQuizPassing('70'); setQuizTimeLimit('30'); setQuestions([{ id: 'q1', text: '', type: 'MCQ', options: ['', '', '', ''], correctOption: 0, correctOptions: [] }]); setIsQuizModalOpen(true); }} className="h-7 text-[10px] px-2">
                                    + Quiz
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => { setActiveWeekId(week.id); setEditingAssignment(null); setAssignmentTitle(''); setAssignmentInstructions(''); setAssignmentAttachment(''); setAssignmentDue(''); setAssignmentMaxMarks('100'); setAssignmentSubtype('File Upload'); setAssignmentRules(''); setIsAssignmentModalOpen(true); }} className="h-7 text-[10px] px-2">
                                    + Task
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteWeek(week.id)} className="h-7 text-[10px] px-2 text-destructive hover:bg-destructive/10">
                                    Delete Module
                                  </Button>
                                </div>
                              </div>

                              {/* Accordion Content Panel */}
                              {isExpanded && (
                                <div className="p-4 bg-background space-y-4 animate-fade-in border-t border-border/40">
                                  {lessons.length === 0 && quizzes.length === 0 && assignments.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                                      No items added to this module yet. Use the buttons above to build curriculum contents.
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {/* Lessons list */}
                                      {lessons.length > 0 && (
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1.5 font-display">Module Video Lessons</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {lessons.sort((a, b) => a.order - b.order).map(les => (
                                              <div key={les.id} className="p-3 border border-border/80 bg-secondary/10 rounded-lg flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                  <p className="text-xs font-semibold text-foreground truncate">{les.title}</p>
                                                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{les.duration || 'N/A duration'}</p>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handlePreviewLesson(les)} title="Preview content">
                                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditLesson(les)}>
                                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteLesson(les.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Quizzes list */}
                                      {quizzes.length > 0 && (
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1.5 font-display">Module Assessments (Quizzes)</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {quizzes.map(qz => (
                                              <div key={qz.id} className="p-3 border border-border/80 bg-secondary/10 rounded-lg flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                  <p className="text-xs font-semibold text-foreground truncate">{qz.title}</p>
                                                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 font-mono">Passing: {qz.passingScore}% • {qz.questions?.length || 0} Qs</p>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handlePreviewQuiz(qz)} title="Preview Quiz">
                                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditQuiz(qz)}>
                                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteQuiz(qz.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Assignments list */}
                                      {assignments.length > 0 && (
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1.5 font-display">Module Projects & Tasks</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {assignments.map(asg => (
                                              <div key={asg.id} className="p-3 border border-border/80 bg-secondary/10 rounded-lg flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                  <p className="text-xs font-semibold text-foreground truncate">{asg.title}</p>
                                                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 font-mono">Max Marks: {asg.maxMarks} • {asg.submissionType}</p>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditAssignment(asg)}>
                                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteAssignment(asg.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border/80 rounded-xl p-12 text-center text-muted-foreground bg-secondary/5">
                <div>
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="font-bold text-foreground text-sm">Select Course to Build Curriculum</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                    Pick one of your curriculum tracks from the left sidebar to add collapsible modules, video lessons, tasks, and quizzes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDomains = () => {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        <HeroBanner
          title="Domain Pathways Control"
          subtitle="Pathway Config"
          description="Create, modify, and track performance metrics/counts for academic paths."
          icon={Grid}
          badgeText="DOMAINS"
          badgeSubText="ADMIN"
          extraContent={
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedDomainItem(null);
                  setDomName('');
                  setDomDesc('');
                  setDomIsActive(true);
                  setIsDomainModalOpen(true);
                }}
                className="h-10 px-4 text-xs font-bold shadow-xs bg-white text-[#0F4C81] hover:bg-white/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Domain
              </Button>
            </div>
          }
        />

        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50 bg-secondary/5">
            <CardTitle className="text-base font-bold font-display">Active & Inactive Learning Paths</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold bg-secondary/10">
                    <th className="p-4">Domain Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Project Coordinators</th>
                    <th className="p-4">Interns</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {allDomains.map((dom) => {
                    const statsForDom = domainStats.find((s) => s.name.toLowerCase() === dom.name.toLowerCase());
                    const instCount = statsForDom?.projectCoordinatorsCount ?? 0;
                    const intCount = statsForDom?.internsCount ?? 0;
                    return (
                      <tr key={dom.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-4 font-semibold text-foreground text-sm">
                          {dom.name}
                        </td>
                        <td className="p-4 text-muted-foreground font-medium max-w-xs truncate">
                          {dom.description || <span className="italic opacity-60">No description</span>}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-semibold">{instCount} Project Coordinators</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-semibold">{intCount} Interns</Badge>
                        </td>
                        <td className="p-4">
                          {dom.isActive ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border border-destructive/20 uppercase font-semibold">
                              Disabled
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => {
                              setSelectedDomainItem(dom);
                              setDomName(dom.name);
                              setDomDesc(dom.description || '');
                              setDomIsActive(dom.isActive);
                              setIsDomainModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={dom.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}
                            onClick={() => handleToggleDomainActive(dom)}
                          >
                            {dom.isActive ? 'Disable' : 'Enable'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {allDomains.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No domains found. Create one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjects = () => {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        <HeroBanner
          title="Presentation Registration"
          subtitle="Presentations Portal"
          description="Review all posted presentations, domains, and the lists of registered interns."
          icon={Briefcase}
          badgeText="PROJECTS"
          badgeSubText="ADMIN"
        />

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="border border-border/80 p-12 text-center text-muted-foreground bg-card/50">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-semibold text-sm">No projects created yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Project Coordinators will post projects here once they are available.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((p) => (
              <Card key={p.id} className="border border-border/80 shadow-xs hover:border-[#0F4C81]/30 transition-all overflow-hidden bg-card/60 rounded-xl">
                <CardHeader className="p-5 border-b border-border bg-secondary/20 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider mb-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                      {p.domain}
                    </Badge>
                    <CardTitle className="text-lg font-bold text-foreground font-display">{p.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Posted by: <span className="font-semibold text-foreground">{p.projectCoordinator?.name || 'Academy'}</span> ({p.projectCoordinator?.email || 'N/A'})
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-1.5 font-display">Description</h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{p.description}</p>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-3 font-display flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-teal-600" />
                      Registered Interns ({p.registrations?.length || 0})
                    </h4>
                    {!p.registrations || p.registrations.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic bg-secondary/15 rounded-lg p-3">No interns have registered interest for this project yet.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-border/60">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-secondary/40 border-b border-border/60">
                              <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase font-display">Name</th>
                              <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase font-display">Email</th>
                              <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase font-display">Registered At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.registrations.map((reg) => (
                              <tr key={reg.id} className="border-b border-border/40 hover:bg-secondary/10 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-foreground">{reg.intern?.name || 'N/A'}</td>
                                <td className="px-4 py-2.5 text-xs text-muted-foreground">{reg.intern?.email || 'N/A'}</td>
                                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                                  {reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {location.pathname === '/admin' || location.pathname === '/admin/' ? renderDashboard() : null}
      {location.pathname.startsWith('/admin/users') ? renderUsers() : null}
      {location.pathname.startsWith('/admin/courses') ? renderCourses() : null}
      {location.pathname.startsWith('/admin/domains') ? renderDomains() : null}
      {location.pathname.startsWith('/admin/projects') ? renderProjects() : null}

      {/* Modal: Confirm Delete User */}
      <Modal isOpen={!!deleteConfirmUser} onClose={() => setDeleteConfirmUser(null)} title="Delete Member Account">
        <div className="space-y-4 text-left">
          <p className="text-sm text-foreground">
            Are you sure you want to permanently delete user <strong className="text-primary">{deleteConfirmUser?.name}</strong> ({deleteConfirmUser?.email})?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed bg-destructive/5 p-3 rounded-lg border border-destructive/15">
            ⚠️ This will remove their record from the system immediately and cascade delete all their progress, submissions, quiz scores, and certificate requests. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDeleteUser}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirm Delete General */}
      {deleteConfirm && (
        <Modal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm(null)}
          title={deleteConfirm.title}
        >
          <div className="p-6 space-y-4 text-left">
            <p className="text-sm text-foreground">{deleteConfirm.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  const onConfirm = deleteConfirm.onConfirm;
                  setDeleteConfirm(null);
                  await onConfirm();
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add User */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Add Corporate Directory Member">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {error && <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg">{error}</div>}

          <Select
            label="System Role"
            value={role}
            onChange={(val) => {
              setRole(val as Role);
              // Clear fields when changing roles to avoid cross-contamination
              setEmployeeId('');
              setPhone('');
              setDob('');
              setDepartment('');
              setDesignation('');
              setCollegeName('');
              setBatch('');
              setError(null);
            }}
            options={[
              { value: 'INTERN', label: 'Intern / Learner' },
              { value: 'PROJECT_COORDINATOR', label: 'Project Coordinator / Trainer' },
              { value: 'ADMIN', label: 'Admin / Manager' }
            ]}
          />

          {role === 'ADMIN' && (
            <>
              <Input
                label="Name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {role === 'PROJECT_COORDINATOR' && (
            <>
              <Input
                label="Employee ID"
                placeholder="e.g. EMP-101"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Input
                label="Full Name"
                placeholder="Jane Trainer"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="projectCoordinator@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <Input
                label="Department"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <Input
                label="Designation"
                placeholder="e.g. Senior Trainer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
              <Select
                label="Select Domain"
                value={domain}
                onChange={(val) => setDomain(val)}
                options={domains.map(d => ({ value: d.name, label: d.name }))}
              />
              <Input
                label="Custom Password (Optional)"
                type="password"
                placeholder="Leave blank to use Date of Birth (YYYY-MM-DD)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground italic mt-0.5">
                Note: Initial password defaults to the Date of Birth. The user will be required to change it on their first login.
              </p>
            </>
          )}

          {role === 'INTERN' && (
            <>
              <Input
                label="Intern ID"
                placeholder="e.g. INT-101 (must be unique)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground italic -mt-2">
                Use a unique ID like INT-101, INT-102… This will also be the login username.
              </p>
              <Input
                label="Full Name"
                placeholder="Bob Learner"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="intern@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <Select
                label="Select Domain"
                value={domain}
                onChange={(val) => setDomain(val)}
                options={domains.map(d => ({ value: d.name, label: d.name }))}
              />
              <Input
                label="College Name"
                placeholder="e.g. State Tech University"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
              <Input
                label="Department"
                placeholder="e.g. Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <Input
                label="Assigned Batch"
                placeholder="e.g. 2026-A"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
              <Input
                label="Custom Password (Optional)"
                type="password"
                placeholder="Leave blank to use Date of Birth (YYYY-MM-DD)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground italic mt-0.5">
                Note: Initial password defaults to the Date of Birth. The user will be required to change it on their first login.
              </p>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit User */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Member Details">
        <form onSubmit={handleEditUser} className="space-y-4">
          {error && <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg">{error}</div>}

          <Select
            label="System Role"
            value={editRole}
            onChange={(val) => setEditRole(val as Role)}
            options={[
              { value: 'INTERN', label: 'Intern / Learner' },
              { value: 'PROJECT_COORDINATOR', label: 'Project Coordinator / Trainer' },
              { value: 'ADMIN', label: 'Admin / Manager' }
            ]}
          />

          {editRole === 'ADMIN' && (
            <>
              <Input
                label="Name"
                placeholder="Full Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@company.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </>
          )}

          {editRole === 'PROJECT_COORDINATOR' && (
            <>
              <Input
                label="Employee ID"
                placeholder="e.g. EMP-101"
                value={editEmployeeId}
                onChange={(e) => setEditEmployeeId(e.target.value)}
              />
              <Input
                label="Full Name"
                placeholder="Jane Trainer"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="projectCoordinator@company.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 1234567890"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={editDob}
                onChange={(e) => setEditDob(e.target.value)}
              />
              <Input
                label="Department"
                placeholder="e.g. Engineering"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
              />
              <Input
                label="Designation"
                placeholder="e.g. Senior Trainer"
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
              />
              <Select
                label="Select Domain"
                value={editDomain}
                onChange={(val) => setEditDomain(val)}
                options={domains.map(d => ({ value: d.name, label: d.name }))}
              />
            </>
          )}

          {editRole === 'INTERN' && (
            <>
              <Input
                label="Intern ID"
                placeholder="e.g. INT-101"
                value={editEmployeeId}
                onChange={(e) => setEditEmployeeId(e.target.value)}
              />
              <Input
                label="Full Name"
                placeholder="Bob Learner"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="intern@company.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 9876543210"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={editDob}
                onChange={(e) => setEditDob(e.target.value)}
              />
              <Select
                label="Select Domain"
                value={editDomain}
                onChange={(val) => setEditDomain(val)}
                options={domains.map(d => ({ value: d.name, label: d.name }))}
              />
              <Input
                label="College Name"
                placeholder="e.g. State Tech University"
                value={editCollegeName}
                onChange={(e) => setEditCollegeName(e.target.value)}
              />
              <Input
                label="Department"
                placeholder="e.g. Computer Science"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
              />
              <Input
                label="Assigned Batch"
                placeholder="e.g. 2026-A"
                value={editBatch}
                onChange={(e) => setEditBatch(e.target.value)}
              />
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Bulk Import */}
      <Modal isOpen={isBulkModalOpen} onClose={() => {
        setIsBulkModalOpen(false);
        setBulkFileError(null);
        setBulkFileSuccess(null);
        setBulkCsvText('');
      }} title="Bulk Import via CSV">
        <form onSubmit={handleBulkUpload} className="space-y-4">
          {bulkFileError && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg whitespace-pre-line border border-destructive/20 font-semibold font-mono">
              {bulkFileError}
            </div>
          )}
          {bulkFileSuccess && (
            <div className="p-3 text-xs bg-emerald-500/10 text-emerald-500 rounded-lg whitespace-pre-line border border-emerald-500/20 font-semibold">
              {bulkFileSuccess}
            </div>
          )}

          <Select
            label="Import Target Role"
            value={bulkRole}
            onChange={(val) => {
              setBulkRole(val as Role);
              setBulkFileError(null);
              setBulkFileSuccess(null);
            }}
            options={[
              { value: 'PROJECT_COORDINATOR', label: 'Project Coordinators' },
              { value: 'INTERN', label: 'Interns' }
            ]}
          />

          <div className="bg-secondary/20 p-3.5 rounded-lg border border-border/60 text-xs text-muted-foreground space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground block uppercase tracking-wider text-[10px]">Expected CSV Format:</span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="text-xs h-7 px-2"
                onClick={() => downloadTemplate(bulkRole)}
              >
                Download CSV Template
              </Button>
            </div>
            {bulkRole === 'PROJECT_COORDINATOR' ? (
              <>
                <code className="block bg-secondary/40 p-1.5 rounded font-mono text-[11px] text-foreground select-all">
                  Employee ID, Full Name, Email, Phone Number, Date of Birth (YYYY-MM-DD), Domain, Designation
                </code>
                <p className="italic text-[10px]">
                  Example row: <code className="bg-secondary/40 px-1 rounded font-mono text-foreground">EMP-102, John Doe, john@company.com, 1234567890, 1990-05-20, Full Stack, Senior Trainer</code>
                </p>
              </>
            ) : (
              <>
                <code className="block bg-secondary/40 p-1.5 rounded font-mono text-[11px] text-foreground select-all">
                  intern id,name,email,phone no,dob,domain,clg,batch
                </code>
                <p className="italic text-[10px]">
                  Example row: <code className="bg-secondary/40 px-1 rounded font-mono text-foreground">INT-505,Jane Smith,jane@school.edu,9876543210,2002-11-12,Data Science,MIT,2026-B</code>
                </p>
              </>
            )}
            <p className="text-[10px] text-muted-foreground">
              * The initial password will automatically be set to the user's Date of Birth (YYYY-MM-DD). New users are forced to change their password on first login.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider font-display">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary/50 transition-colors bg-secondary/5 relative">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setBulkFileError(null);
                  setBulkFileSuccess(null);

                  const nameLower = file.name.toLowerCase();
                  if (nameLower.endsWith('.numbers')) {
                    setBulkFileError("Error: Apple Numbers files (.numbers) cannot be parsed directly.\n\nPlease open your sheet in Apple Numbers, go to File > Export To > CSV... and save it. Then upload the exported .csv file.");
                    return;
                  }
                  if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
                    setBulkFileError("Error: Microsoft Excel files (.xlsx / .xls) cannot be parsed directly.\n\nPlease open your sheet in Excel, go to File > Save As... and select Comma Separated Values (.csv) as the format. Then upload the saved .csv file.");
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (text.startsWith('PK')) {
                      setBulkFileError("Error: It looks like this file is a zipped spreadsheet package (such as Apple Numbers or Excel) renamed to .csv. Please export it to a true CSV (Comma Separated Values) text file first.");
                      return;
                    }
                    setBulkCsvText(text);
                  };
                  reader.readAsText(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <span className="text-sm font-semibold text-primary">Click to select CSV File</span>
              <span className="text-xs text-muted-foreground mt-1">or drag and drop it here</span>
            </div>
          </div>

          <Textarea
            label="Or Paste CSV Data Directly (Includes Headers)"
            placeholder="Employee ID, Full Name, Email, Phone Number, Date of Birth, Domain, Designation..."
            value={bulkCsvText}
            onChange={(e) => setBulkCsvText(e.target.value)}
            disabled={loading}
            className="font-mono text-xs"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setIsBulkModalOpen(false);
                setBulkFileError(null);
                setBulkFileSuccess(null);
                setBulkCsvText('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !bulkCsvText.trim()}>
              Import Users
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Course */}
      <Modal isOpen={isEditCourseModalOpen} onClose={() => setIsEditCourseModalOpen(false)} title="Update Course Details">
        <form onSubmit={handleEditCourse} className="space-y-4">
          <Input label="Course Title" value={editCourseTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCourseTitle(e.target.value)} />
          <Textarea label="Course Description" value={editCourseDesc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditCourseDesc(e.target.value)} />
          <Select
            label="Domain"
            value={editCourseDomain}
            onChange={(val) => setEditCourseDomain(val)}
            options={domains.map(d => ({ value: d.name, label: d.name }))}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsEditCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Course */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Create New Course Module">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <Input label="Course Title" placeholder="e.g. React Native Mobile" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
          <Textarea label="Course Description" placeholder="Summary and prerequisites..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
          <Select
            label="Domain"
            value={courseDomain}
            onChange={(val) => setCourseDomain(val)}
            options={domains.map(d => ({ value: d.name, label: d.name }))}
          />
          <Select
            label="Assigned Project Coordinator"
            value={courseProjectCoordinatorId}
            onChange={(val) => setCourseProjectCoordinatorId(val)}
            options={users.filter(u => u.role === 'PROJECT_COORDINATOR').map(u => ({ value: u.id, label: u.name }))}
          />
          <Input label="Intro YouTube Video URL (Optional)" placeholder="e.g. https://www.youtube.com/watch?v=..." value={courseVideoUrl} onChange={(e) => setCourseVideoUrl(e.target.value)} />
          <Textarea label="First Lesson Notes (Optional)" placeholder="Introductory lesson notes..." value={courseLessonContent} onChange={(e) => setCourseLessonContent(e.target.value)} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !courseTitle}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Module */}
      <Modal isOpen={isWeekModalOpen} onClose={() => { setIsWeekModalOpen(false); setWeekTitle(''); setEditingWeekId(null); }} title={editingWeekId ? "Edit Module Title" : "Create New Module"}>
        <form onSubmit={handleSaveWeek} className="space-y-4">
          <Input label="Module Title" placeholder="e.g. Introduction to AI / Core Concepts" value={weekTitle} onChange={(e) => setWeekTitle(e.target.value)} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => { setIsWeekModalOpen(false); setWeekTitle(''); setEditingWeekId(null); }}>Cancel</Button>
            <Button type="submit">{editingWeekId ? "Save Changes" : "Add Module"}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Preview Lesson */}
      <Modal isOpen={isPreviewLessonModalOpen} onClose={() => { setIsPreviewLessonModalOpen(false); setPreviewingLesson(null); }} title="Preview Lesson Material">
        {previewingLesson && (
          <div className="space-y-4 text-left">
            <div>
              <h4 className="text-base font-bold text-foreground leading-snug">{previewingLesson.title}</h4>
              {previewingLesson.duration && (
                <Badge variant="secondary" className="mt-1.5 text-[9px] uppercase tracking-wider font-bold">
                  Duration: {previewingLesson.duration}
                </Badge>
              )}
            </div>

            {/* Video Player Emulation */}
            {previewingLesson.videoUrl ? (
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-border overflow-hidden relative group">
                <Play className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform cursor-pointer" />
                <div className="absolute bottom-2 left-2 right-2 text-white/50 text-[10px] text-center bg-black/45 py-1.5 px-3 rounded">
                  Emulating Video Player: <a href={previewingLesson.videoUrl} target="_blank" rel="noreferrer" className="underline hover:text-white font-semibold">{previewingLesson.videoUrl}</a>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-secondary/20 rounded-lg flex flex-col items-center justify-center border border-border border-dashed text-muted-foreground p-6 text-center">
                <Video className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-semibold">No video attached to this lecture module.</p>
              </div>
            )}

            {/* Content Description */}
            <div className="p-3 border border-border/80 rounded-lg bg-secondary/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Lecture Synopsis</p>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{previewingLesson.content || 'No text summary provided.'}</p>
            </div>

            {/* PDF Resource Link */}
            {previewingLesson.pdfResource && (
              <div className="flex items-center justify-between p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-lg text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate mr-2">PDF Reference Material Attached</span>
                <a
                  href={previewingLesson.pdfResource}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-md shadow-sm no-underline text-[10px]"
                >
                  Open PDF
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={() => { setIsPreviewLessonModalOpen(false); setPreviewingLesson(null); }}>Close Preview</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Preview Quiz */}
      <Modal isOpen={isPreviewQuizModalOpen} onClose={() => { setIsPreviewQuizModalOpen(false); setPreviewingQuiz(null); }} title="LMS Assessment Simulator">
        {previewingQuiz && (
          <div className="space-y-4 text-left">
            <div className="border-b border-border/60 pb-3 mb-2 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground leading-tight">{previewingQuiz.title}</h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                  Time: {previewingQuiz.timeLimit || 30} mins • Passing threshold: {previewingQuiz.passingScore}%
                </p>
              </div>

              {quizSubmitted && (
                <Badge variant={quizPreviewPassed ? 'success' : 'destructive'} className="text-xs">
                  {quizPreviewPassed ? `Passed: ${quizPreviewScore}%` : `Failed: ${quizPreviewScore}%`}
                </Badge>
              )}
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {previewingQuiz.questions.map((q, idx) => {
                const answer = quizAnswers[q.id];
                const isSelected = (oIdx: number) => {
                  if (q.type === 'MS') {
                    return (answer || []).includes(oIdx);
                  }
                  return answer === oIdx;
                };

                return (
                  <div key={q.id} className="p-3 border border-border/70 rounded-lg bg-secondary/5 space-y-2">
                    <p className="text-xs font-bold text-foreground">
                      Q{idx + 1}. {q.text}
                      {q.type === 'MS' && <span className="text-[9px] font-bold text-primary ml-1.5 uppercase">(Select all that apply)</span>}
                    </p>

                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt, oIdx) => {
                        let styling = 'border-border/80 bg-background hover:bg-secondary/20';
                        if (isSelected(oIdx)) {
                          styling = 'border-primary/50 bg-primary/10 text-primary-foreground text-primary font-semibold';
                        }
                        if (quizSubmitted) {
                          const isCorrect = q.type === 'MS'
                            ? (q.correctOptions || []).includes(oIdx)
                            : q.correctOption === oIdx;
                          if (isCorrect) {
                            styling = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold';
                          } else if (isSelected(oIdx)) {
                            styling = 'border-destructive/50 bg-destructive/10 text-destructive font-semibold';
                          }
                        }

                        return (
                          <div
                            key={oIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                handleSelectQuizAnswer(q.id, oIdx, q.type || 'MCQ');
                              }
                            }}
                            className={`flex items-center gap-2.5 p-2 border.5 rounded-lg cursor-pointer transition-colors text-xs ${styling}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-normal">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
              <Button variant="ghost" onClick={() => { setIsPreviewQuizModalOpen(false); setPreviewingQuiz(null); }}>Close Simulator</Button>
              {!quizSubmitted ? (
                <Button onClick={handleSubmitPreviewQuiz}>Submit Test</Button>
              ) : (
                <Button onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuizPreviewScore(0);
                  setQuizPreviewPassed(false);
                }}>Restart Simulator</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Add/Edit Lesson */}
      <Modal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} title={editingLesson ? "Edit Lesson Details" : "Append Lesson Module"}>
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <Input label="Lesson Title" placeholder="e.g. Setting up Context Providers" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
          <Input label="Video URL (Optional)" placeholder="e.g. https://youtube.com/watch?v=..." value={lessonVideo} onChange={(e) => setLessonVideo(e.target.value)} />
          <Input label="PDF Resource Link (Optional)" placeholder="e.g. https://drive.google.com/file/..." value={lessonPdf} onChange={(e) => setLessonPdf(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration" placeholder="e.g. 10 mins" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} />
            <Input label="Chapter Index (Order)" type="number" value={lessonOrder} onChange={(e) => setLessonOrder(e.target.value)} />
          </div>

          <Textarea label="Instructional Text / Content" placeholder="Markdown or detailed training materials..." value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Lesson</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Assignment */}
      <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title={editingAssignment ? "Edit Assignment Details" : "Issue Practical Task"}>
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <Input label="Task Title" placeholder="e.g. Build dynamic state store" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} />
          <Input label="Reference File Link (PDF/URL)" placeholder="e.g. https://drive.google.com/..." value={assignmentAttachment} onChange={(e) => setAssignmentAttachment(e.target.value)} />

          <div className="grid grid-cols-3 gap-4">
            <Input label="Due Date" type="date" value={assignmentDue} onChange={(e) => setAssignmentDue(e.target.value)} />
            <Input label="Maximum Marks" type="number" value={assignmentMaxMarks} onChange={(e) => setAssignmentMaxMarks(e.target.value)} />
            <Select
              label="Submission Type"
              value={assignmentSubtype}
              onChange={(val) => setAssignmentSubtype(val)}
              options={[
                { value: 'File Upload', label: 'File Upload' },
                { value: 'Text Entry', label: 'Text Entry' },
                { value: 'External Link', label: 'External Link' }
              ]}
            />
          </div>

          <Textarea label="Instructions / Prompt" placeholder="Instructions, criteria, deliverables..." value={assignmentInstructions} onChange={(e) => setAssignmentInstructions(e.target.value)} />
          <Textarea label="Submission Rules" placeholder="e.g. Submit link to GitHub repository..." value={assignmentRules} onChange={(e) => setAssignmentRules(e.target.value)} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsAssignmentModalOpen(false)}>Cancel</Button>
            <Button type="submit">Post Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Quiz */}
      <Modal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} title={editingQuiz ? "Edit Assessment Test" : "Build Assessment Test"}>
        <form onSubmit={handleSaveQuiz} className="space-y-4">
          <Input label="Quiz Title" placeholder="e.g. Midterm TypeScript Review" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Passing Threshold (%)" type="number" min="0" max="100" value={quizPassing} onChange={(e) => setQuizPassing(e.target.value)} />
            <Input label="Time Limit (minutes)" type="number" min="1" value={quizTimeLimit} onChange={(e) => setQuizTimeLimit(e.target.value)} />
          </div>

          <div className="border-t border-border/60 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Configure Questions:</p>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestionRow} className="text-[10px] h-7 px-2">
                + Add Question
              </Button>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="p-3 border border-border/80 rounded-lg bg-secondary/10 space-y-3 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-foreground">Question #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={q.type || 'MCQ'}
                      onChange={(val) => handleQuestionTypeChange(idx, val as any)}
                      options={[
                        { value: 'MCQ', label: 'Multiple Choice' },
                        { value: 'TF', label: 'True / False' },
                        { value: 'MS', label: 'Multiple Select' }
                      ]}
                      className="h-8 py-1 text-xs"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveQuestionRow(idx)} className="h-7 px-1.5 text-destructive hover:bg-destructive/15">
                      Delete
                    </Button>
                  </div>
                </div>

                <Input placeholder="e.g. Which keyword defines an immutable variable?" value={q.text} onChange={(e) => updateQuestion(idx, 'text', e.target.value)} />

                {/* Options List */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Options & Correct Marks:</p>

                  {q.type === 'TF' ? (
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-secondary/10 text-xs">
                          <input
                            type="radio"
                            name={`correct-q-${idx}`}
                            checked={q.correctOption === oIdx}
                            onChange={() => updateQuestion(idx, 'correctOption', oIdx)}
                            className="text-primary focus:ring-ring"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          {q.type === 'MS' ? (
                            <input
                              type="checkbox"
                              checked={(q.correctOptions || []).includes(oIdx)}
                              onChange={() => toggleMSCorrectOption(idx, oIdx)}
                              className="rounded text-primary focus:ring-ring"
                            />
                          ) : (
                            <input
                              type="radio"
                              name={`correct-q-${idx}`}
                              checked={q.correctOption === oIdx}
                              onChange={() => updateQuestion(idx, 'correctOption', oIdx)}
                              className="text-primary focus:ring-ring"
                            />
                          )}
                          <Input
                            placeholder={`Choice ${String.fromCharCode(65 + oIdx)}`}
                            value={opt}
                            onChange={(e) => updateQuestionOption(idx, oIdx, e.target.value)}
                            className="h-8 text-xs py-1 flex-1"
                          />
                          {q.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const nextOpt = q.options.filter((_, o) => o !== oIdx);
                                updateQuestion(idx, 'options', nextOpt);
                              }}
                              className="h-8 px-2 text-destructive hover:bg-destructive/10 text-xs"
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          updateQuestion(idx, 'options', [...q.options, '']);
                        }}
                        className="text-[10px] h-7 px-2 border border-dashed text-primary border-primary/20 hover:bg-primary/5 mt-1"
                      >
                        + Add Choice Option
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsQuizModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingQuiz ? "Save Changes" : "Create Quiz"}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Domain Create/Edit */}
      <Modal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        title={selectedDomainItem ? "Edit Learning Path Domain" : "Create New Learning Path Domain"}
      >
        <form onSubmit={handleSaveDomain} className="space-y-4">
          <Input
            label="Domain Name"
            placeholder="e.g. Generative AI"
            value={domName}
            onChange={(e) => setDomName(e.target.value)}
          />
          <Textarea
            label="Domain Description (Optional)"
            placeholder="Describe the focus and goals of this training track..."
            value={domDesc}
            onChange={(e) => setDomDesc(e.target.value)}
          />
          {selectedDomainItem && (
            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="domIsActive"
                checked={domIsActive}
                onChange={(e) => setDomIsActive(e.target.checked)}
                className="h-4 w-4 text-primary border-border rounded"
              />
              <label htmlFor="domIsActive" className="text-xs font-semibold text-muted-foreground uppercase select-none">
                Domain Status is Active
              </label>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsDomainModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {selectedDomainItem ? "Save Changes" : "Create Domain"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
