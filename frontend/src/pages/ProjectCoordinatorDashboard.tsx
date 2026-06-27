import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Modal, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';
import { courseService, lessonService, assignmentService, quizService, submissionService, userService, certificateService, domainService, projectService } from '../services/apiService';
import { Course, Lesson, Assignment, Quiz, Submission, Question, User, Certificate, Domain, Project, ProjectRegistration } from '../types';
import { BookOpen, Plus, FileText, CheckCircle, Video, ListTodo, Award, Check, Users, FileCheck, ArrowLeft, Grid, Layers, Database, Brain, Shield, Globe, Search, Calendar, ChevronLeft, ChevronRight, Clock, Eye, Trash, Edit, Play, Briefcase, Upload } from 'lucide-react';

import { useAuth } from '../store/AuthContext';
import { HeroBanner } from '../components/HeroBanner';

interface CalendarEvent {
  id: string;
  type: 'assignment' | 'quiz' | 'live_session';
  title: string;
  courseName: string;
  date: Date;
  timeStr: string;
}

export const ProjectCoordinatorDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureProgress, setBrochureProgress] = useState(0);

  // Domains directory state
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allCoursesList, setAllCoursesList] = useState<Course[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal controls
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDomain, setProjectDomain] = useState('Full Stack');

  // Forms state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDomain, setCourseDomain] = useState('Full Stack');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState('Beginner');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState('');

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

  // Quizzes state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizPassing, setQuizPassing] = useState('70');
  const [quizTimeLimit, setQuizTimeLimit] = useState('30');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q1', text: '', type: 'MCQ', options: ['', '', '', ''], correctOption: 0, correctOptions: [] }
  ]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Interactive Quiz Preview state
  const [previewingQuiz, setPreviewingQuiz] = useState<Quiz | null>(null);
  const [isPreviewQuizModalOpen, setIsPreviewQuizModalOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPreviewScore, setQuizPreviewScore] = useState(0);
  const [quizPreviewPassed, setQuizPreviewPassed] = useState(false);

  // Calendar Widget state
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-06-17'));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(new Date('2026-06-17'));

  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const [loading, setLoading] = useState(false);

  const [certRequests, setCertRequests] = useState<any[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [isProgressReportModalOpen, setIsProgressReportModalOpen] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState<User | null>(null);
  const [selectedReportCourse, setSelectedReportCourse] = useState<Course | null>(null);
  const [selectedReportProgress, setSelectedReportProgress] = useState<any>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [internsMonitoring, setInternsMonitoring] = useState<any[]>([]);

  const loadProjectCoordinatorData = async () => {
    try {
      // Load ALL courses for this projectCoordinator's domain (not just self-created)
      const allCourses = await courseService.getAll();
      const myDomain = user?.domain;
      // Domain-filtered courses — projectCoordinators see every course in their domain
      const domainCourses = myDomain
        ? allCourses.filter((c: any) => c.domain?.toLowerCase() === myDomain?.toLowerCase())
        : allCourses;

      const myGrading = await submissionService.getProjectCoordinatorSubmissions();
      const usersData = await userService.getAll().catch(() => []);
      const myCertRequests = await certificateService.getProjectCoordinatorRequests().catch(() => []);
      const monitoringData = await userService.getInternsMonitoring().catch(() => []);
      const activeDomains = await domainService.getAll().catch(() => []);
      const projectsData = await projectService.getAll().catch(() => []);

      setCourses(domainCourses);
      setSubmissions(myGrading);
      setAllUsers(usersData);
      setAllCoursesList(allCourses);
      setCertRequests(myCertRequests);
      setInternsMonitoring(monitoringData);
      setDomains(activeDomains);
      setProjects(projectsData);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to sync projectCoordinator data from database.');
    }
  };

  useEffect(() => {
    loadProjectCoordinatorData();
    // Auto-refresh every 30 seconds for real-time stats
    const interval = setInterval(loadProjectCoordinatorData, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

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
    ).sort((a, b) => a.order - b.order);

    const assignments = (course.assignments || []).filter(a =>
      a.weekId === weekId || (isFirstWeek && !a.weekId)
    );

    const quizzes = (course.quizzes || []).filter(q =>
      q.weekId === weekId || (isFirstWeek && !q.weekId)
    );

    return { lessons, assignments, quizzes };
  };

  const getDueDateBadgeInfo = (dueDateStr: string) => {
    if (!dueDateStr) return { label: 'No Due Date', variant: 'outline' as const };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(dueDateStr);
    const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    const diffTime = dueDateOnly.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(dueDateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    if (diffDays < 0) {
      return { label: `Due: ${formattedDate} (Overdue)`, variant: 'destructive' as const };
    } else if (diffDays <= 3) {
      return { label: `Due: ${formattedDate} (Near Deadline)`, variant: 'warning' as const };
    } else {
      return { label: `Due: ${formattedDate}`, variant: 'success' as const };
    }
  };

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const handleSelectCourse = async (course: Course) => {
    try {
      const detailed = await courseService.getById(course.id);
      setSelectedCourse(detailed);
      const weeks = getCourseWeeks(detailed);
      if (weeks.length > 0) {
        setExpandedWeeks(prev => ({ ...prev, [weeks[0].id]: true }));
      }
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

  const handleBrochureDelete = async () => {
    if (!selectedCourse) return;
    if (!confirm('Are you sure you want to delete this course brochure?')) return;
    
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
  };


  const resetCourseForm = () => {
    setCourseTitle('');
    setCourseDesc('');
    setCourseDomain('Full Stack');
    setCourseThumbnail('');
    setCourseCategory('');
    setCourseDifficulty('Beginner');
    setCourseDuration('');
    setCourseOutcomes('');
  };

  const openEditCourseModal = (course: Course) => {
    setCourseTitle(course.title);
    setCourseDesc(course.description);
    setCourseDomain(course.domain || 'Full Stack');
    setCourseThumbnail(course.coverImage || '');
    setCourseCategory(course.category || course.domain || 'Full Stack');
    setCourseDifficulty(course.difficulty || 'Beginner');
    setCourseDuration(course.duration || '');
    setCourseOutcomes(course.learningOutcomes ? course.learningOutcomes.join('\n') : '');
    setIsEditCourseModalOpen(true);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;
    try {
      const outcomesArray = courseOutcomes
        ? courseOutcomes.split('\n').map(o => o.trim()).filter(Boolean)
        : [];
      await courseService.create({
        title: courseTitle,
        description: courseDesc,
        domain: courseDomain,
        coverImage: courseThumbnail,
        category: courseCategory || courseDomain,
        difficulty: courseDifficulty as any || 'Beginner',
        duration: courseDuration || '4 Weeks',
        learningOutcomes: outcomesArray,
        status: 'Draft',
        weeks: [{ id: 'w_' + Math.random().toString(36).substring(7), number: 1, title: 'Introduction' }]
      });
      await loadProjectCoordinatorData();
      setIsCourseModalOpen(false);
      resetCourseForm();
      alert('Course created successfully!');
    } catch (err) {
      alert('Failed to create course');
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !courseTitle) return;
    try {
      const outcomesArray = courseOutcomes
        ? courseOutcomes.split('\n').map(o => o.trim()).filter(Boolean)
        : [];
      const updatedCourse = await courseService.update(selectedCourse.id, {
        title: courseTitle,
        description: courseDesc,
        domain: courseDomain,
        coverImage: courseThumbnail,
        category: courseCategory,
        difficulty: courseDifficulty as any,
        duration: courseDuration,
        learningOutcomes: outcomesArray
      });
      await loadProjectCoordinatorData();
      setSelectedCourse(prev => prev ? { ...prev, ...updatedCourse } : null);
      setIsEditCourseModalOpen(false);
      resetCourseForm();
      alert('Course updated successfully!');
    } catch (err) {
      alert('Failed to update course');
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      const updated = await courseService.update(courseId, { status: 'Published' });
      await loadProjectCoordinatorData();
      setSelectedCourse(prev => prev ? { ...prev, ...updated } : null);
      alert('Course published successfully!');
    } catch (err) {
      alert('Failed to publish course');
    }
  };

  const handleArchiveCourse = async (courseId: string) => {
    try {
      const updated = await courseService.update(courseId, { status: 'Archived' });
      await loadProjectCoordinatorData();
      setSelectedCourse(prev => prev ? { ...prev, ...updated } : null);
      alert('Course archived successfully!');
    } catch (err) {
      alert('Failed to archive course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This action is permanent and will delete all associated lessons, assignments, and quizzes.')) {
      try {
        await courseService.delete(courseId);
        await loadProjectCoordinatorData();
        setSelectedCourse(null);
        alert('Course deleted successfully!');
      } catch (err) {
        alert('Failed to delete course');
      }
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

  const handleDeleteWeek = async (weekId: string) => {
    if (!selectedCourse) return;
    if (confirm('Are you sure you want to delete this module? Lessons, quizzes, and assignments in this module will be reassigned to Module 1.')) {
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

      handleSelectCourse(selectedCourse);
    }
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

  const handleDeleteLesson = async (id: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await lessonService.delete(id);
      if (selectedCourse) handleSelectCourse(selectedCourse);
    }
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

  const handleDeleteAssignment = async (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      await assignmentService.delete(id);
      if (selectedCourse) handleSelectCourse(selectedCourse);
    }
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

  const handleDeleteQuiz = async (id: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      await quizService.delete(id);
      if (selectedCourse) handleSelectCourse(selectedCourse);
    }
  };

  const handlePreviewQuiz = (qz: Quiz) => {
    setPreviewingQuiz(qz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPreviewScore(0);
    setQuizPreviewPassed(false);
    setIsPreviewQuizModalOpen(true);
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const mockLiveSessions = [
    { id: 'ls1', title: 'Q&A & Mentor Sync', courseName: 'Foundations of TypeScript', date: new Date(2026, 5, 18), timeStr: '10:00 AM' },
    { id: 'ls2', title: 'Project Review Live', courseName: 'Data Science with Python', date: new Date(2026, 5, 20), timeStr: '02:00 PM' },
    { id: 'ls3', title: 'Office Hours: Deep Learning', courseName: 'Introduction to Machine Learning', date: new Date(2026, 5, 22), timeStr: '11:00 AM' },
    { id: 'ls4', title: 'Live Coding Lab', courseName: 'Foundations of TypeScript', date: new Date(2026, 5, 25), timeStr: '03:00 PM' },
  ];

  const getCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    courses.forEach(c => {
      const detailed = c.assignments || [];
      detailed.forEach(a => {
        if (a.dueDate) {
          events.push({
            id: a.id,
            type: 'assignment',
            title: a.title,
            courseName: c.title,
            date: new Date(a.dueDate),
            timeStr: new Date(a.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      });

      const detailedQuizzes = c.quizzes || [];
      detailedQuizzes.forEach(q => {
        const quizDate = q.createdAt ? new Date(q.createdAt) : new Date();
        const offsetDays = q.id.charCodeAt(0) % 10;
        const qDate = new Date(2026, 5, 18 + offsetDays);
        events.push({
          id: q.id,
          type: 'quiz',
          title: q.title,
          courseName: c.title,
          date: qDate,
          timeStr: '11:59 PM'
        });
      });
    });

    mockLiveSessions.forEach(ls => {
      events.push({
        id: ls.id,
        type: 'live_session',
        title: ls.title,
        courseName: ls.courseName,
        date: ls.date,
        timeStr: ls.timeStr
      });
    });

    return events;
  };

  const getEventsForDate = (d: Date, events: CalendarEvent[]) => {
    return events.filter(e =>
      e.date.getDate() === d.getDate() &&
      e.date.getMonth() === d.getMonth() &&
      e.date.getFullYear() === d.getFullYear()
    );
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    const parsedGrade = parseInt(grade);
    if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }
    try {
      const updatedSub = await submissionService.grade(selectedSub.id, {
        grade: parsedGrade,
        feedback,
        isApproved
      });
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? updatedSub : s));
      setIsGradeModalOpen(false);
      setSelectedSub(null);
      setGrade('');
      setFeedback('');
      setIsApproved(false);
      toast.success(isApproved ? 'Submission graded and approved!' : 'Grade submitted successfully.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit grade';
      alert(msg);
    }
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

  const getStudentCourseProgress = (studentId: string, courseId: string) => {
    // Find the intern in the internsMonitoring state list
    const intern = internsMonitoring.find((i: any) => i.id === studentId);

    // Find the course in allCoursesList or from the intern's enrollments
    const enrollment = intern?.enrollments?.find((e: any) => e.courseId === courseId);
    const dbCourse = enrollment?.course || allCoursesList.find((c: any) => c.id === courseId);

    if (!dbCourse) {
      return {
        totalWeeks: 0,
        completedWeeks: 0,
        percentage: 0,
        weeksList: [],
        lessons: [],
        quizzes: [],
        assignments: [],
        completedLessons: {},
        quizResults: [],
        subs: []
      };
    }

    const lessons = dbCourse.lessons || [];
    const quizzes = dbCourse.quizzes || [];
    const assignments = dbCourse.assignments || [];

    const weeks = dbCourse.weeks || [{ id: 'w_default', number: 1, title: 'Introduction' }];
    const totalWeeks = weeks.length;

    let completedWeeks = 0;
    let percentage = 0;
    let weeksList = weeks.map((w: any) => ({ ...w, completed: false }));
    let quizResults = intern ? (intern.quizResults || []) : [];
    let subs = intern ? (intern.submissions || []) : [];

    if (intern) {
      const cProg = intern.coursesProgress?.find((cp: any) => cp.courseId === courseId);
      if (cProg) {
        completedWeeks = cProg.modulesCompletedCount;
        percentage = cProg.progressPercent;
        weeksList = cProg.weeksList || [];
      }
    }

    return {
      totalWeeks,
      completedWeeks,
      percentage,
      weeksList,
      lessons,
      quizzes,
      assignments,
      completedLessons: {},
      quizResults,
      subs
    };
  };

  const handleApproveCertificate = async (id: string) => {
    setApprovingId(id);
    try {
      await certificateService.approve(id);
      toast.success('Certificate approved! The intern has been notified.');
      await loadProjectCoordinatorData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to approve certificate';
      toast.error(msg);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectCertificate = async (id: string) => {
    setRejectingId(id);
    try {
      await certificateService.reject(id);
      toast.success('Certificate request rejected.');
      await loadProjectCoordinatorData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to reject certificate';
      toast.error(msg);
    } finally {
      setRejectingId(null);
    }
  };

  const handleViewCourseProgress = (studentId: string, courseId: string) => {
    let student = allUsers.find(u => u.id === studentId);
    if (!student) {
      const intern = internsMonitoring.find((i: any) => i.id === studentId);
      if (intern) {
        student = {
          id: intern.id,
          name: intern.name,
          employeeId: intern.employeeId,
          username: intern.employeeId,
          email: intern.email,
          role: 'INTERN',
          domain: intern.domain,
          phone: intern.phone,
          collegeName: intern.collegeName,
          batch: intern.batch,
          createdAt: '',
        } as any;
      }
    }
    const course = allCoursesList.find(c => c.id === courseId);
    if (!student || !course) {
      alert('Student or course details not found.');
      return;
    }

    const progress = getStudentCourseProgress(studentId, courseId);

    const courseQuizzes = progress.quizzes;
    const courseQuizResults = progress.quizResults.filter((r: any) => courseQuizzes.some((q: any) => q.id === r.quizId));
    const quizAverage = courseQuizResults.length > 0
      ? Math.round(courseQuizResults.reduce((acc: number, curr: any) => acc + curr.score, 0) / courseQuizResults.length)
      : 0;

    const totalAssignments = progress.assignments.length;
    const submittedAssignments = progress.assignments.filter((a: any) => progress.subs.some((s: any) => s.assignmentId === a.id)).length;

    const attendance = progress.percentage === 100 ? 95 : Math.max(75, Math.round(75 + progress.percentage * 0.2));

    setSelectedReportStudent(student);
    setSelectedReportCourse(course);
    setSelectedReportProgress({
      weeksList: progress.weeksList,
      assignmentsSubmitted: submittedAssignments,
      totalAssignments,
      quizAverage,
      attendance,
      percentage: progress.percentage
    });
    setIsProgressReportModalOpen(true);
  };

  const handleTrackProgress = (student: any, progress: any) => {
    const mockCourse = {
      id: progress.courseId,
      title: progress.courseTitle,
      domain: student.domain || user?.domain || 'Full Stack',
    };
    setSelectedReportStudent({
      id: student.id,
      name: student.name,
      employeeId: student.employeeId || 'N/A',
      username: student.employeeId || 'N/A',
      email: student.email,
      role: 'INTERN' as const,
      createdAt: '',
    });
    setSelectedReportCourse(mockCourse as any);
    setSelectedReportProgress({
      weeksList: progress.weeksList || [],
      assignmentsSubmitted: progress.assignmentsSubmitted || 0,
      totalAssignments: progress.totalAssignments || 0,
      quizAverage: progress.quizAverage || 0,
      attendance: progress.attendance || 0,
      percentage: progress.progressPercent || 0,
    });
    setIsProgressReportModalOpen(true);
  };

  const renderDashboard = () => {
    const pendingCount = submissions.filter(s => s.status === 'PENDING').length;
    const myDomain = user?.domain || 'Not Assigned';

    // Domain-scoped interns from monitoring data
    const domainInterns = internsMonitoring.filter((i: any) => i.domain?.toLowerCase() === myDomain?.toLowerCase());
    const totalDomainInterns = domainInterns.length;
    const activeInterns = domainInterns.filter((i: any) => (i.coursesProgress || []).length > 0).length;

    // Course completion % across domain interns
    const allProgressPcts = domainInterns.flatMap((i: any) =>
      (i.coursesProgress || []).map((cp: any) => cp.progressPercent || 0)
    );
    const avgCompletion = allProgressPcts.length > 0
      ? Math.round(allProgressPcts.reduce((a: number, b: number) => a + b, 0) / allProgressPcts.length)
      : 0;

    // Pending certificate requests for domain
    const pendingCerts = certRequests.filter((c: any) => !c.isApproved).length;

    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title={`Welcome, ${user?.name || 'Project Coordinator'}! 👋`}
          subtitle={`${myDomain || 'Full Stack'} Domain`}
          description="Manage pathway curriculums, organize upcoming live sessions and project milestones, and review pending evaluations for enrolled interns."
          isCoordinator={true}
        />

        {/* Domain Analytics Stats Grid — 5 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight">Total Courses in Domain</p>
              <h3 className="text-xl font-bold mt-0.5">{courses.length}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight">Total Interns in Domain</p>
              <h3 className="text-xl font-bold mt-0.5">{totalDomainInterns}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight">Active Interns</p>
              <h3 className="text-xl font-bold mt-0.5 text-emerald-500">{activeInterns}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl flex-shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight">Avg. Completion %</p>
              <h3 className="text-xl font-bold mt-0.5 text-amber-500">{avgCompletion}%</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl flex-shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight">Cert Requests Pending</p>
              <h3 className="text-xl font-bold mt-0.5 text-rose-500">{pendingCerts + pendingCount}</h3>
            </div>
          </Card>
        </div>

        {/* Main Dashboard Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Submissions Queue */}
          <div className="lg:col-span-2">
            <Card className="p-5 h-full space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display">Grading Action Items</h3>
                  <p className="text-xs text-muted-foreground">Submissions awaiting your feedback</p>
                </div>
                {pendingCount > 0 && <Badge variant="warning">{pendingCount} Pending</Badge>}
              </div>

              {submissions.filter(s => s.status === 'PENDING').length === 0 ? (
                <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl flex flex-col justify-center items-center h-48">
                  <CheckCircle className="h-10 w-10 text-emerald-500/50 mb-2" />
                  <p className="text-sm font-semibold">No pending assignments! All caught up.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {submissions.filter(s => s.status === 'PENDING').map(sub => (
                    <div key={sub.id} className="p-3 border border-border rounded-lg bg-secondary/10 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                      <div className="min-w-0 flex-1 mr-3 text-left">
                        <p className="text-sm font-semibold text-foreground truncate">{sub.studentName}</p>
                        <p className="text-xs text-muted-foreground truncate">{sub.assignmentTitle}</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        setSelectedSub(sub);
                        setGrade('');
                        setFeedback('');
                        setIsApproved(sub.isApproved || false);
                        setIsGradeModalOpen(true);
                      }} className="text-xs">Grade</Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Courses */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <Card className="p-5 space-y-4">
              <h3 className="text-base font-bold font-display">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2.5">
                <Button onClick={() => {
                  setCourseTitle('');
                  setCourseDesc('');
                  setCourseDomain(user?.domain || 'Full Stack');
                  setIsCourseModalOpen(true);
                }} className="w-full text-xs py-2 flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4" /> Start New Course
                </Button>
                <Button variant="outline" onClick={() => navigate('/project-coordinator/courses')} className="w-full text-xs py-2 flex items-center justify-center">
                  <BookOpen className="mr-2 h-4 w-4" /> Manage Course Catalog
                </Button>
                <Button variant="secondary" onClick={() => navigate('/project-coordinator/grading')} className="w-full text-xs py-2 flex items-center justify-center">
                  <FileCheck className="mr-2 h-4 w-4" /> Go to Grading Portal
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-base font-bold font-display">Domain Courses Quick List</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No courses in your domain yet.</p>
                ) : (
                  courses.slice(0, 3).map(c => (
                    <div key={c.id} className="p-2.5 rounded-lg border border-border bg-secondary/5 flex items-center justify-between">
                      <span className="text-xs font-semibold truncate mr-2">{c.title}</span>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedCourse(c);
                        navigate('/project-coordinator/courses');
                      }} className="text-[10px] h-7 px-2">Edit</Button>
                    </div>
                  ))
                )}
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

        {/* Intern Progress Section */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold font-display">Intern Progress — {myDomain}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time progress for all interns in your domain</p>
            </div>
            <Badge variant="outline" className="text-xs">{totalDomainInterns} Interns</Badge>
          </div>
          {domainInterns.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold">No interns registered in {myDomain} yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold bg-secondary/10">
                    <th className="p-3">Intern Name</th>
                    <th className="p-3">Assigned Course</th>
                    <th className="p-3">Current Module</th>
                    <th className="p-3">Completion</th>
                    <th className="p-3">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {domainInterns.map((intern: any) => {
                    const cp = (intern.coursesProgress || [])[0];
                    const pct = cp?.progressPercent || 0;
                    const hasCert = certRequests.some((c: any) => c.studentId === intern.id);
                    return (
                      <tr key={intern.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-3">
                          <p className="font-semibold text-foreground">{intern.name}</p>
                          <p className="text-[10px] text-muted-foreground">{intern.employeeId || intern.email}</p>
                        </td>
                        <td className="p-3 text-muted-foreground">{cp?.courseTitle || '—'}</td>
                        <td className="p-3 text-muted-foreground">{cp?.currentWeek ? `Module ${cp.currentWeek}` : '—'}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-secondary/30 rounded-full h-1.5 w-20">
                              <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {hasCert
                            ? <Badge variant="success" className="text-[9px]">Requested</Badge>
                            : pct === 100
                              ? <Badge variant="outline" className="text-[9px]">Eligible</Badge>
                              : <Badge variant="secondary" className="text-[9px]">In Progress</Badge>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderCourses = () => {
    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title="Domain Curriculum Manager"
          subtitle="Pathway Syllabus"
          description="Manage video lessons, write quizzes, and issue assignments for courses in your domain."
          isCoordinator={true}
          extraContent={
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button
                variant="primary"
                onClick={() => {
                  resetCourseForm();
                  setIsCourseModalOpen(true);
                }}
                className="h-10 px-4 text-xs font-bold shadow-xs bg-white text-[#0F4C81] hover:bg-white/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Course
              </Button>
            </div>
          }
        />

        {/* 3-Column Layout Grid */}
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

          {/* Column 2: Central Course Builder (6 cols) */}
          <div className="lg:col-span-6">
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
                                  <Button variant="ghost" size="sm" onClick={() => { setEditingWeekId(week.id); setWeekTitle(week.title); setIsWeekModalOpen(true); }} className="h-7 text-[10px] px-2" title="Edit Week Title">
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
                                      No items added to this module yet. Use the action buttons above to construct module content.
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {/* Lessons */}
                                      {lessons.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5"><Video className="h-3 w-3" /> Video Lectures</div>
                                          <div className="space-y-2">
                                            {lessons.map(les => (
                                              <div key={les.id} className="p-3 border border-border rounded-lg bg-secondary/5 flex items-center justify-between hover:bg-secondary/10 transition-all">
                                                <div className="flex items-start space-x-3 text-left">
                                                  <div className="mt-0.5 p-1 bg-primary/10 text-primary rounded">
                                                    <Video className="h-3.5 w-3.5" />
                                                  </div>
                                                  <div className="min-w-0">
                                                    <p className="text-xs font-bold text-foreground truncate">{les.title}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate max-w-sm mt-0.5">{les.content}</p>

                                                    {/* Duration & Resource badges */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                      {les.duration && (
                                                        <span className="text-[8px] font-bold uppercase bg-secondary/60 text-secondary-foreground border border-secondary px-1.5 py-0.5 rounded flex items-center gap-1">
                                                          <Clock className="h-2.5 w-2.5" /> {les.duration}
                                                        </span>
                                                      )}
                                                      {les.pdfResource && (
                                                        <span className="text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                                          PDF Resource
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0 ml-4">
                                                  <Button variant="ghost" size="sm" onClick={() => handlePreviewLesson(les)} className="h-7 text-[10px] px-2 font-semibold hover:bg-primary/10 text-primary">
                                                    <Eye className="h-3 w-3 mr-1" /> Preview
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={() => handleEditLesson(les)} className="h-7 text-[10px] px-2">
                                                    Edit
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(les.id)} className="h-7 text-[10px] px-2 text-destructive hover:bg-destructive/10">
                                                    Delete
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Quizzes */}
                                      {quizzes.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> Mini Assessments</div>
                                          <div className="space-y-2">
                                            {quizzes.map(qz => (
                                              <div key={qz.id} className="p-3 border border-border rounded-lg bg-secondary/5 flex items-center justify-between hover:bg-secondary/10 transition-all">
                                                <div className="flex items-start space-x-3 text-left">
                                                  <div className="mt-0.5 p-1 bg-emerald-500/10 text-emerald-500 rounded">
                                                    <Award className="h-3.5 w-3.5" />
                                                  </div>
                                                  <div>
                                                    <p className="text-xs font-bold text-foreground">{qz.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <span className="text-[9px] bg-secondary/60 text-secondary-foreground border border-secondary px-1.5 py-0.5 rounded font-medium">
                                                        {qz.questions?.length || 0} Questions
                                                      </span>
                                                      <span className="text-[9px] bg-secondary/60 text-secondary-foreground border border-secondary px-1.5 py-0.5 rounded font-medium">
                                                        Time: {qz.timeLimit || 30} mins
                                                      </span>
                                                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                                                        Target: {qz.passingScore}%
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0 ml-4">
                                                  <Button variant="ghost" size="sm" onClick={() => handlePreviewQuiz(qz)} className="h-7 text-[10px] px-2 font-semibold hover:bg-primary/10 text-primary">
                                                    <Play className="h-3 w-3 mr-1" /> Test Preview
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={() => handleEditQuiz(qz)} className="h-7 text-[10px] px-2">
                                                    Edit
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteQuiz(qz.id)} className="h-7 text-[10px] px-2 text-destructive hover:bg-destructive/10">
                                                    Delete
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Assignments */}
                                      {assignments.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Practical Assessments</div>
                                          <div className="space-y-2">
                                            {assignments.map(asg => {
                                              const badgeInfo = getDueDateBadgeInfo(asg.dueDate);
                                              return (
                                                <div key={asg.id} className="p-3 border border-border rounded-lg bg-secondary/5 flex items-center justify-between hover:bg-secondary/10 transition-all">
                                                  <div className="flex items-start space-x-3 text-left">
                                                    <div className="mt-0.5 p-1 bg-blue-500/10 text-blue-500 rounded">
                                                      <FileText className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div>
                                                      <p className="text-xs font-bold text-foreground">{asg.title}</p>
                                                      <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-sm mt-0.5">{asg.instruction}</p>

                                                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <Badge variant={badgeInfo.variant} className="text-[8px] py-0.5 font-bold uppercase">
                                                          {badgeInfo.label}
                                                        </Badge>
                                                        <span className="text-[9px] bg-secondary/60 text-secondary-foreground border border-secondary px-1.5 py-0.5 rounded font-medium">
                                                          Marks: {asg.maxMarks || 100}
                                                        </span>
                                                        <span className="text-[9px] bg-secondary/60 text-secondary-foreground border border-secondary px-1.5 py-0.5 rounded font-medium">
                                                          Mode: {asg.submissionType || 'File Upload'}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-1 shrink-0 ml-4">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditAssignment(asg)} className="h-7 text-[10px] px-2">
                                                      Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAssignment(asg.id)} className="h-7 text-[10px] px-2 text-destructive hover:bg-destructive/10">
                                                      Delete
                                                    </Button>
                                                  </div>
                                                </div>
                                              );
                                            })}
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
                    Pick one of your curriculum tracks from the left sidebar to add collapsible weeks, video links, files, assignments, and mock assessment tests.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Right Sidebar Calendar Widget (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-4 border border-border shadow-sm text-left space-y-4 bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-primary flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Timeline Agenda
                </h3>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => {
                      const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                      setCurrentMonth(prev);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-bold text-foreground font-display">
                    {currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => {
                      const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
                      setCurrentMonth(next);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Days Table */}
              <div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {getDaysInMonth(currentMonth).map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

                    const isToday = day.getDate() === new Date().getDate() &&
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear();

                    const isSelected = selectedCalendarDate &&
                      day.getDate() === selectedCalendarDate.getDate() &&
                      day.getMonth() === selectedCalendarDate.getMonth() &&
                      day.getFullYear() === selectedCalendarDate.getFullYear();

                    const dayEvents = getEventsForDate(day, getCalendarEvents());

                    const hasAssignment = dayEvents.some(e => e.type === 'assignment');
                    const hasQuiz = dayEvents.some(e => e.type === 'quiz');
                    const hasLive = dayEvents.some(e => e.type === 'live_session');

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelectedCalendarDate(day)}
                        className={`aspect-square flex flex-col justify-between items-center p-1 rounded-md hover:bg-secondary/40 cursor-pointer relative font-semibold transition-all ${isSelected ? 'bg-primary text-white scale-105 shadow-sm shadow-primary/30' :
                            isToday ? 'bg-primary/10 text-primary border border-primary/20' :
                              'text-foreground'
                          }`}
                      >
                        <span className="text-[10px]">{day.getDate()}</span>

                        {/* Event Dots */}
                        <div className="flex gap-0.5 justify-center w-full mt-0.5 h-1">
                          {hasAssignment && <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />}
                          {hasQuiz && <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />}
                          {hasLive && <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color Code Legend */}
              <div className="border-t border-border/50 pt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider justify-center">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Assignment</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Quiz</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Live Session</span>
              </div>
            </Card>

            {/* Selected Date Events Drawer */}
            {selectedCalendarDate && (
              <div className="p-4 border border-border bg-secondary/5 rounded-xl space-y-3 text-left animate-fade-in shadow-sm">
                <h4 className="text-[10px] font-black font-display uppercase tracking-widest text-primary border-b border-border/40 pb-1.5">
                  Schedule for {selectedCalendarDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </h4>
                {(() => {
                  const dayEvents = getEventsForDate(selectedCalendarDate, getCalendarEvents());
                  if (dayEvents.length === 0) {
                    return <p className="text-xs text-muted-foreground py-1">No activities listed on this date.</p>;
                  }
                  return (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className="p-2.5 border border-border/60 bg-background rounded-lg text-xs space-y-1 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-bold text-foreground leading-snug truncate">{ev.title}</span>
                            <span className={`h-2 w-2 rounded-full shrink-0 ${ev.type === 'assignment' ? 'bg-blue-500' :
                                ev.type === 'quiz' ? 'bg-emerald-500' : 'bg-purple-500'
                              }`} title={ev.type} />
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate font-medium">Course: {ev.courseName}</p>
                          <p className="text-[9px] font-bold uppercase text-primary font-mono tracking-wider">Due/Start: {ev.timeStr}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGrading = () => {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <HeroBanner
          title="Grading Assessment Portal"
          subtitle="Grader Console"
          description="Evaluate code, worksheets, and other submissions from interns."
          isCoordinator={true}
        />

        <Card className="text-left">
          <CardContent className="pt-6">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-500/50 mb-3" />
                <p className="font-semibold text-sm">All caught up! No pending submissions.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold bg-secondary/20">
                      <th className="p-4">Name</th>
                      <th className="p-4">Assignment</th>
                      <th className="p-4">Date Submitted</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{sub.studentName}</td>
                        <td className="p-4 text-muted-foreground">{sub.assignmentTitle}</td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant={sub.status === 'GRADED' ? 'success' : 'warning'}>
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSub(sub);
                              setGrade(sub.grade?.toString() || '');
                              setFeedback(sub.feedback || '');
                              setIsApproved(sub.isApproved || false);
                              setIsGradeModalOpen(true);
                            }}
                          >
                            {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const getDomainIcon = (domainName: string) => {
    const name = domainName.toLowerCase();
    if (name.includes('machine learning') || name.includes('ai') || name.includes('ml')) {
      return <Brain className="h-10 w-10 text-[#0F4C81]" />;
    }
    if (name.includes('data') || name.includes('analytics') || name.includes('database') || name.includes('sql') || name.includes('excel')) {
      return <Database className="h-10 w-10 text-[#0F4C81]" />;
    }
    if (name.includes('full stack') || name.includes('web') || name.includes('software') || name.includes('dev')) {
      return <Globe className="h-10 w-10 text-[#0F4C81]" />;
    }
    if (name.includes('cloud') || name.includes('devops') || name.includes('aws')) {
      return <Layers className="h-10 w-10 text-[#0F4C81]" />;
    }
    return <Grid className="h-10 w-10 text-[#0F4C81]" />;
  };

  const formatLastActivity = (isoString: string) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Never';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressColor = (pct: number) => {
    if (pct <= 30) return 'bg-rose-500';
    if (pct <= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderDomains = () => {
    const domainName = user?.domain || 'Not Assigned';
    const domainInterns = internsMonitoring.filter((i: any) => i.domain?.toLowerCase() === domainName?.toLowerCase());
    const totalDomainInterns = domainInterns.length;
    const activeInterns = domainInterns.filter((i: any) => (i.coursesProgress || []).length > 0).length;
    const domainCoursesCount = courses.length;

    // Average completion percentage
    const allProgressPcts = domainInterns.flatMap((i: any) =>
      (i.coursesProgress || []).map((cp: any) => cp.progressPercent || 0)
    );
    const avgCompletion = allProgressPcts.length > 0
      ? Math.round(allProgressPcts.reduce((a: number, b: number) => a + b, 0) / allProgressPcts.length)
      : 0;

    // Completed certificates count for domain
    const issuedCertsCount = domainInterns.reduce((acc: number, curr: any) => {
      const issued = (curr.coursesProgress || []).filter((cp: any) => cp.certStatus === 'Issued').length;
      return acc + issued;
    }, 0);

    const filteredInterns = domainInterns.filter(
      u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6 text-left animate-fade-in">
        {/* Glassmorphic Domain Header */}
        <HeroBanner
          title={`Division: ${domainName}`}
          subtitle="Managed Division"
          description="Domain-scoped learner tracking, completion audits, and progress analytics."
          isCoordinator={true}
        />

        {/* Analytics Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 flex items-center space-x-3 rounded-premium shadow-premium bg-white border border-slate-100/80 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,161,181,0.1)] transition-all duration-300">
            <div className="p-2.5 bg-[#0F4C81]/10 text-[#0F4C81] rounded-xl flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total Interns</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{totalDomainInterns}</h3>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3 rounded-premium shadow-premium bg-white border border-slate-100/80 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,161,181,0.1)] transition-all duration-300">
            <div className="p-2.5 bg-[#0F4C81]/10 text-[#0F4C81] rounded-xl flex-shrink-0">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Active Learners</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{activeInterns}</h3>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3 rounded-premium shadow-premium bg-white border border-slate-100/80 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,161,181,0.1)] transition-all duration-300">
            <div className="p-2.5 bg-[#0F4C81]/10 text-[#0F4C81] rounded-xl flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Curriculum Tracks</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{domainCoursesCount}</h3>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3 rounded-premium shadow-premium bg-white border border-slate-100/80 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,161,181,0.1)] transition-all duration-300">
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Avg Progress</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{avgCompletion}%</h3>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3 rounded-premium shadow-premium bg-white border border-slate-100/80 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,161,181,0.1)] transition-all duration-300">
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl flex-shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Issued Credentials</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{issuedCertsCount}</h3>
            </div>
          </div>
        </div>

        {/* Interns Monitoring Card */}
        <Card className="rounded-premium shadow-premium border border-slate-100 bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100/80 bg-slate-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base font-bold font-display text-slate-800">Domain Interns Directory</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, employee ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50 sticky top-0">
                    <th className="p-4">Intern Name</th>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4">Course Progress (%)</th>
                    <th className="p-4 text-center">Modules Completed</th>
                    <th className="p-4 text-center">Total Modules</th>
                    <th className="p-4">Certificate Status</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInterns.map((intern) => {
                    const primary = intern.coursesProgress?.[0];
                    const pct = intern.progressPercent || 0;
                    const hasActiveCourse = !!primary;

                    return (
                      <tr key={intern.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                        <td className="p-4 font-semibold text-slate-800 text-sm">{intern.name}</td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded text-[10px]">
                            {intern.employeeId || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{intern.email}</td>
                        <td className="p-4 text-slate-600 font-medium">{intern.domain}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50 flex-shrink-0">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(pct)}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-700 min-w-[28px]">{pct}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">{intern.modulesCompletedCount || 0}</td>
                        <td className="p-4 text-center font-semibold text-slate-500">{intern.totalModulesCount || 0}</td>
                        <td className="p-4">
                          <Badge
                            variant={intern.certStatus === 'Issued' ? 'success' : 'outline'}
                            className="font-bold text-[9px]"
                          >
                            {intern.certStatus}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500 whitespace-nowrap">{formatLastActivity(intern.lastActivity)}</td>
                        <td className="p-4 text-right">
                          {hasActiveCourse ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-7 px-3 border-slate-200 hover:border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 hover:scale-102 shadow-xs"
                              onClick={() => handleTrackProgress(intern, primary)}
                            >
                              View Details
                            </Button>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">No Course</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInterns.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400 italic font-medium">
                        No interns found matching the criteria in {domainName}.
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

  const renderCertificates = () => {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        {/* Page Banner Header */}
        <HeroBanner
          title="Certificate Requests Portal"
          subtitle="Administrative Portal"
          description="Review completion reports, audit syllabus requirements, and issue graduation credentials."
          isCoordinator={true}
        />

        {/* Requests Table Card */}
        <Card className="border border-slate-100 shadow-premium rounded-premium overflow-hidden bg-card">
          <CardHeader className="border-b border-slate-100 p-4 bg-slate-50/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Pending Approval Queue</CardTitle>
              <CardDescription className="text-xs">Certificates awaiting academic approval from managed curriculum tracks.</CardDescription>
            </div>
            <Badge variant="secondary" className="font-bold text-xs bg-[#0F4C81]/10 text-[#0F4C81] border-0">{certRequests.length} Total Requests</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            {certRequests.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Award className="h-12 w-12 mx-auto text-muted-foreground/35 mb-2" />
                <p className="font-bold text-foreground text-sm">No Pending Requests</p>
                <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed text-muted-foreground">
                  When interns complete 100% of their course materials, their claim requests will appear here for review.
                </p>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Intern Details</th>
                    <th className="p-4">Course Track</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4 text-center">Progress (Modules)</th>
                    <th className="p-4">Request Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {certRequests.map((req) => {
                    const stats = getStudentCourseProgress(req.studentId, req.courseId);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{req.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {req.studentEmployeeId || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-700 max-w-xs truncate">{req.courseTitle}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-[9px] font-semibold bg-[#0F4C81]/10 text-[#0F4C81] border-0">{req.courseDomain || 'Full Stack'}</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="font-bold text-slate-850">{stats.percentage}%</div>
                          <div className="text-[10px] text-slate-455 mt-0.5 font-medium">{stats.completedWeeks}/{stats.totalWeeks} Modules Done</div>
                        </td>
                        <td className="p-4 text-slate-500 whitespace-nowrap">
                          {req.requestDate ? new Date(req.requestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                        </td>
                        <td className="p-4">
                          <Badge variant={
                            req.status === 'Approved' ? 'success' :
                              req.status === 'Rejected' ? 'destructive' : 'outline'
                          } className="text-[9px] font-bold">
                            {req.status || 'Pending Approval'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewCourseProgress(req.studentId, req.courseId)} className="h-7 px-3 text-[10px] font-semibold border-slate-200 rounded-lg">
                            View Progress
                          </Button>
                          {req.status === 'Pending Approval' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveCertificate(req.id)}
                                disabled={approvingId === req.id || rejectingId === req.id}
                                className="h-7 px-3 text-[10px] bg-emerald-500 hover:bg-emerald-600 border-0 text-white font-bold rounded-lg shadow-xs disabled:opacity-60"
                              >
                                {approvingId === req.id ? '⏳ Approving…' : '✓ Approve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectCertificate(req.id)}
                                disabled={approvingId === req.id || rejectingId === req.id}
                                className="h-7 px-3 text-[10px] font-bold rounded-lg shadow-xs disabled:opacity-60"
                              >
                                {rejectingId === req.id ? '⏳ Rejecting…' : '✕ Reject'}
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await projectService.create({
        title: projectTitle,
        description: projectDesc,
        domain: projectDomain,
      });
      toast.success('Project created successfully');
      setProjectTitle('');
      setProjectDesc('');
      setIsProjectModalOpen(false);
      await loadProjectCoordinatorData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? All intern registrations for it will be deleted.')) {
      setLoading(true);
      try {
        await projectService.delete(projectId);
        toast.success('Project successfully deleted');
        await loadProjectCoordinatorData();
      } catch (err) {
        alert('Failed to delete project');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProjects = () => {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        <HeroBanner
          title="Project Presentation Portal"
          subtitle="Schedule presentations"
          description="Upload domain-specific presentations and view intern interest."
          isCoordinator={true}
          extraContent={
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button
                onClick={() => {
                  setProjectDomain(user?.domain || 'Full Stack');
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center gap-1.5 h-10 px-4 text-xs font-bold rounded-xl bg-white text-[#0F4C81] hover:bg-white/90 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" /> Post Project
              </Button>
            </div>
          }
        />

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="border border-border/80 p-12 text-center text-muted-foreground bg-card/50">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-semibold text-sm">No projects created yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Post Project" to upload a new project for interns.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((p) => (
              <Card key={p.id} className="border border-border/80 shadow-xs hover:border-[#0F4C81]/30 transition-all overflow-hidden bg-card/60">
                <CardHeader className="p-5 border-b border-border bg-secondary/20 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider mb-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                      {p.domain}
                    </Badge>
                    <CardTitle className="text-lg font-bold text-foreground font-display">{p.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(p.id)}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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
                                <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatLastActivity(reg.registeredAt)}</td>
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

        {/* Modal: Add Project */}
        <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Post New Project">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <Input
              label="Project Title"
              placeholder="e.g. Real-Time Chat Application"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
            <Textarea
              label="Project Description"
              placeholder="Outline project requirements, key deliverables, and technologies to use..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              required
              rows={5}
            />
            <Select
              label="Domain"
              value={projectDomain}
              onChange={(val) => setProjectDomain(val)}
              options={domains.map((d) => ({ value: d.name, label: d.name }))}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="ghost" type="button" onClick={() => setIsProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Post Project
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {location.pathname === '/project-coordinator' || location.pathname === '/project-coordinator/' ? renderDashboard() : null}
      {location.pathname.startsWith('/project-coordinator/courses') ? renderCourses() : null}
      {location.pathname.startsWith('/project-coordinator/grading') ? renderGrading() : null}
      {location.pathname.startsWith('/project-coordinator/projects') ? renderProjects() : null}
      {location.pathname.startsWith('/project-coordinator/domains') ? renderDomains() : null}
      {location.pathname.startsWith('/project-coordinator/certificates') ? renderCertificates() : null}

      {/* Modal: New Syllabus / Course */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Start New Course Module">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <Input label="Course Name" placeholder="e.g. NextJS Complete Architecture" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
          <Textarea label="Brief Summary" placeholder="Scope, duration, and prerequisites..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Domain"
              value={courseDomain}
              onChange={(val) => setCourseDomain(val)}
              options={domains.map(d => ({ value: d.name, label: d.name }))}
            />
            <Select
              label="Difficulty Level"
              value={courseDifficulty}
              onChange={(val) => setCourseDifficulty(val)}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Frontend Web / AI" value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} />
            <Input label="Estimated Duration" placeholder="e.g. 4 Weeks / 10 Hours" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
          </div>

          <Input label="Course Thumbnail Image URL" placeholder="e.g. https://images.unsplash.com/..." value={courseThumbnail} onChange={(e) => setCourseThumbnail(e.target.value)} />

          <Textarea
            label="Learning Outcomes (One outcome per line)"
            placeholder="Understand React hooks&#10;Implement dynamic state store&#10;Deploy projects on cloud..."
            value={courseOutcomes}
            onChange={(e) => setCourseOutcomes(e.target.value)}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Course Details */}
      <Modal isOpen={isEditCourseModalOpen} onClose={() => setIsEditCourseModalOpen(false)} title="Edit Course Details">
        <form onSubmit={handleEditCourse} className="space-y-4">
          <Input label="Course Name" placeholder="e.g. NextJS Complete Architecture" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
          <Textarea label="Brief Summary" placeholder="Scope, duration, and prerequisites..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Domain"
              value={courseDomain}
              onChange={(val) => setCourseDomain(val)}
              options={domains.map(d => ({ value: d.name, label: d.name }))}
            />
            <Select
              label="Difficulty Level"
              value={courseDifficulty}
              onChange={(val) => setCourseDifficulty(val)}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Frontend Web / AI" value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} />
            <Input label="Estimated Duration" placeholder="e.g. 4 Weeks / 10 Hours" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
          </div>

          <Input label="Course Thumbnail Image URL" placeholder="e.g. https://images.unsplash.com/..." value={courseThumbnail} onChange={(e) => setCourseThumbnail(e.target.value)} />

          <Textarea
            label="Learning Outcomes (One outcome per line)"
            placeholder="Understand React hooks&#10;Implement dynamic state store..."
            value={courseOutcomes}
            onChange={(e) => setCourseOutcomes(e.target.value)}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => {
              setIsEditCourseModalOpen(false);
              resetCourseForm();
            }}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
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

      {/* Modal: Grading Tool */}
      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title="Evaluate Submission">
        {selectedSub && (
          <form onSubmit={handleGradeSubmission} className="space-y-4">
            <div className="p-4 border border-border/80 rounded-lg bg-secondary/10">
              <p className="text-xs text-muted-foreground font-semibold">Student: {selectedSub.studentName}</p>
              <p className="text-sm font-semibold mt-1">Assignment: {selectedSub.assignmentTitle}</p>
              <div className="mt-3 text-xs bg-background p-3 rounded-lg border border-border overflow-x-auto whitespace-pre-wrap font-mono">
                {selectedSub.submissionText || 'No text content provided.'}
              </div>
              {selectedSub.fileUrl && (
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Attachment: </span>
                  <a href={selectedSub.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">
                    Open Submitted File
                  </a>
                </div>
              )}
            </div>

            <Input label="Assign Score (0-100)" type="number" min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} />
            <Textarea label="Feedback & Remarks" placeholder="Helpful corrections or details..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="isApproved"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="h-4 w-4 text-primary border-border rounded"
              />
              <label htmlFor="isApproved" className="text-xs font-semibold text-muted-foreground uppercase select-none">
                Approve Project Submission
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="ghost" type="button" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
              <Button type="submit">Publish Grade</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal: View Course Progress (Certificate Audit) */}
      <Modal isOpen={isProgressReportModalOpen} onClose={() => { setIsProgressReportModalOpen(false); setSelectedReportStudent(null); setSelectedReportCourse(null); setSelectedReportProgress(null); }} title="Audit Completion Report">
        {selectedReportStudent && selectedReportCourse && selectedReportProgress && (
          <div className="space-y-5 text-left">
            {/* Header info */}
            <div className="p-4 bg-gradient-to-br from-primary/5 via-secondary/15 to-transparent rounded-lg border border-border/80 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">{selectedReportCourse.title}</h4>
                <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-wider">{selectedReportCourse.domain || 'Full Stack'}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Intern Name: <span className="font-semibold text-foreground">{selectedReportStudent.name}</span></p>
              <p className="text-[10px] text-muted-foreground font-mono">Employee ID: {selectedReportStudent.employeeId || selectedReportStudent.username || 'EMP-999'}</p>
            </div>

            {/* Overall stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-border/75 rounded-lg text-center bg-secondary/5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Overall Completion</p>
                <p className="text-lg font-black text-primary mt-1">{selectedReportProgress.percentage}%</p>
              </div>
              <div className="p-3 border border-border/75 rounded-lg text-center bg-secondary/5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Quiz Average</p>
                <p className="text-lg font-black text-emerald-500 mt-1">{selectedReportProgress.quizAverage}%</p>
              </div>
              <div className="p-3 border border-border/75 rounded-lg text-center bg-secondary/5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Attendance</p>
                <p className="text-lg font-black text-purple-500 mt-1">{selectedReportProgress.attendance}%</p>
              </div>
            </div>

            {/* Assignments submitted details */}
            <div className="p-3 border border-border/70 rounded-lg bg-background flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="h-4 w-4" /> Assignments Completed</span>
              <span className="text-foreground font-bold">{selectedReportProgress.assignmentsSubmitted} / {selectedReportProgress.totalAssignments} Submitted</span>
            </div>

            {/* Weekly Completion Breakdown */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">Module Completion Audit</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {selectedReportProgress.weeksList.map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-secondary/5 text-xs">
                    <span className="font-semibold text-foreground">Module {w.number} — {w.title}</span>
                    {w.completed ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                        Completed ✅
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive font-bold text-[10px] bg-destructive/10 px-2 py-0.5 rounded border border-destructive/25">
                        Incomplete ❌
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end pt-2 border-t border-border/50">
              <Button onClick={() => { setIsProgressReportModalOpen(false); setSelectedReportStudent(null); setSelectedReportCourse(null); setSelectedReportProgress(null); }}>
                Close Audit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
