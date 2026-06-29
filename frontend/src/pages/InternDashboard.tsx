import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../components/Toast';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Modal, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';
import { VideoPlayer } from '../components/VideoPlayer';
import { courseService, lessonService, assignmentService, submissionService, quizService, certificateService, projectService, authService, presentationService, presentationRegistrationService } from '../services/apiService';
import { Course, Lesson, Assignment, Submission, Quiz, QuizResult, Certificate, Project, ProjectRegistration, Presentation, PresentationRegistrationRecord } from '../types';
import { BookOpen, Award, CheckCircle, Play, FileText, HelpCircle, GraduationCap, ArrowLeft, ArrowRight, ExternalLink, Check, Users, Send, Sparkles, Bot, X, Briefcase, Eye, ChevronDown, ChevronRight, Clock, Calendar, Download } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { getAuthenticatedFileUrl } from '../services/api';


interface ProjectSubmissionFormProps {
  assignment: Assignment;
  onSuccess: (sub: Submission) => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({ assignment, onSuccess }) => {
  const [textVal, setTextVal] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await submissionService.upload(file, assignment.id);
      setFileUrl(res.fileUrl);
      setFileName(res.originalName);
      alert('File uploaded successfully!');
      if (res.submission) {
        onSuccess(res.submission);
      }
    } catch (err) {
      alert('Failed to upload file to backend.');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      alert('Please upload a file first.');
      return;
    }

    try {
      const payload = {
        submissionText: textVal || undefined,
        fileUrl: fileUrl,
      };
      const sub = await submissionService.submit(assignment.id, payload);
      onSuccess(sub);
      // Reset
      setTextVal('');
      setFileUrl('');
      setFileName('');
    } catch (err) {
      alert('Failed to submit project stage.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in text-left">
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-muted-foreground uppercase">Choose Submission File</label>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            onChange={handleFileUpload}
            className="text-xs text-muted-foreground border border-border rounded-lg p-2 flex-1"
          />
          {uploading && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
        </div>
        {fileName && (
          <p className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 p-2 rounded inline-block">
            ✓ Attached: {fileName}
          </p>
        )}
      </div>

      <Textarea
        label="Syllabus Notes / Answers (Optional)"
        placeholder="Provide any additional comments or outline notes for the projectCoordinator..."
        value={textVal}
        onChange={(e) => setTextVal(e.target.value)}
      />

      <Button type="submit" disabled={uploading} className="w-full">
        Submit Project Assignment
      </Button>
    </form>
  );
};

const getBulletPoints = (contentText: string) => {
  if (!contentText) return [];
  const sentences = contentText
    .split(/[.;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  return sentences.map((sentence) => {
    if (sentence.includes(':')) {
      const [boldPart, rest] = sentence.split(':', 2);
      return { bold: boldPart.trim() + ':', text: rest.trim() };
    }
    const words = sentence.split(' ');
    if (words.length <= 3) {
      return { bold: sentence, text: '' };
    }
    const boldWordCount = Math.min(3, Math.max(1, Math.round(words.length * 0.25)));
    const boldPart = words.slice(0, boldWordCount).join(' ');
    const rest = words.slice(boldWordCount).join(' ');
    return { bold: boldPart, text: rest };
  });
};

export const InternDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [myResults, setMyResults] = useState<QuizResult[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedProjectToReg, setSelectedProjectToReg] = useState<Project | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDomain, setRegDomain] = useState('');

  // ── Presentations state ───────────────────────────────────────────────────
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [myPresentationRegistrations, setMyPresentationRegistrations] = useState<string[]>([]); // presentationIds registered
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [isPresentationRegModalOpen, setIsPresentationRegModalOpen] = useState(false);
  // Registration form fields
  const [prFullName, setPrFullName] = useState('');
  const [prDomain, setPrDomain] = useState('');
  const [prCollegeName, setPrCollegeName] = useState('');
  const [prYearOfStudy, setPrYearOfStudy] = useState('');
  const [prInternshipTiming, setPrInternshipTiming] = useState('');
  const [prInternshipStartDate, setPrInternshipStartDate] = useState('');
  const [prInternshipEndDate, setPrInternshipEndDate] = useState('');
  const [prPurpose, setPrPurpose] = useState('');
  const [prProjectsWorkedOn, setPrProjectsWorkedOn] = useState('');
  const [prWillingToAttend, setPrWillingToAttend] = useState('Yes');
  const [prQaQuestions, setPrQaQuestions] = useState('');
  const [prAdditionalRemarks, setPrAdditionalRemarks] = useState('');
  const [prInternSignature, setPrInternSignature] = useState('');

  // Navigation inside dashboard
  const [activeTab, setActiveTab] = useState<'browse' | 'enrolled' | 'certificates'>('enrolled');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Lesson player state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>({});
  const [activeProjectWeekId, setActiveProjectWeekId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const courseId = params.get('id');

    if (tab === 'certificates') {
      setActiveTab('certificates');
    } else if (tab === 'enrolled') {
      setActiveTab('enrolled');
    }

    if (courseId && enrolledCourses.length > 0) {
      const c = enrolledCourses.find(course => course.id === courseId);
      if (c) {
        setActiveCourse(c);
        setActiveTab('enrolled');
      }
    }
  }, [location.search, enrolledCourses]);


  useEffect(() => {
    if (user?.id) {
      const savedWatched = localStorage.getItem(`lms_watched_videos_${user.id}`);
      setWatchedVideos(savedWatched ? JSON.parse(savedWatched) : {});
    } else {
      setWatchedVideos({});
    }
  }, [user?.id]);

  // Submission state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitText, setSubmitText] = useState('');
  const [submitFile, setSubmitFile] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');
  const [submitFileUploading, setSubmitFileUploading] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<Record<string, Submission>>({});

  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // AI assistant states
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string }>>([
    { id: 'welcome', sender: 'ai', text: 'Hello! I am your AI learning assistant for this course. Click one of the quick prompts below or ask me any question about the curriculum!' }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);

  useEffect(() => {
    setShowAiAssistant(false);
    setAiChatMessages([
      { id: 'welcome', sender: 'ai', text: 'Hello! I am your AI learning assistant for this course. Click one of the quick prompts below or ask me any question about the curriculum!' }
    ]);
  }, [activeCourse?.id]);

  const [loading, setLoading] = useState(false);

  const loadInternData = async () => {
    try {
      // Backend already filters courses by intern's domain (via Role.INTERN check in CoursesService)
      const domainCourses = await courseService.getAll().catch(() => []);

      // Also fetch enrolled courses for the Enrolled tab
      const enrolled = await courseService.getMyEnrolled().catch(() => []);

      const certs = await certificateService.getMyCertificates().catch(() => []);
      const results = await quizService.getMyResults().catch(() => []);
      const subs = await submissionService.getMySubmissions().catch(() => []);
      const progress = await lessonService.getProgress().catch(() => []);
      const projectsData = await projectService.getAll().catch(() => []);

      setAllCourses(domainCourses);
      setEnrolledCourses(enrolled);
      setCertificates(certs);
      setMyResults(results);
      setProjects(projectsData);

      // Load presentations
      const presData = await presentationService.getAll().catch(() => []);
      setPresentations(presData);

      const completedMap: Record<string, boolean> = {};
      progress.forEach((pId: string) => {
        completedMap[pId] = true;
      });
      setCompletedLessons(completedMap);

      // Index submissions by assignmentId
      const subsMap: Record<string, Submission> = {};
      subs.forEach((s) => {
        subsMap[s.assignmentId] = s;
      });
      setMySubmissions(subsMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInternData();
    // Auto-refresh every 30 seconds so new courses added by projectCoordinators appear immediately
    const interval = setInterval(loadInternData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      await courseService.enroll(courseId);
      await loadInternData();
      setActiveTab('enrolled');
    } catch (err) {
      alert('Failed to enroll in course');
    }
  };

  const handleOpenRegisterModal = (project: Project) => {
    setSelectedProjectToReg(project);
    setRegName(user?.name || '');
    setRegEmail(user?.email || '');
    setRegDomain(user?.domain || '');
    setIsRegModalOpen(true);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectToReg) return;
    try {
      await updateProfile(regName, regEmail, regDomain);
      await projectService.register(selectedProjectToReg.id);
      toast.success('Interest registered successfully!');
      setIsRegModalOpen(false);
      setSelectedProjectToReg(null);
      await loadInternData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register interest.');
    }
  };

  const handleOpenStudyMode = async (course: Course) => {
    setLoading(true);
    try {
      const detailedCourse = await courseService.getById(course.id);
      setActiveCourse(detailedCourse);
      const weeks = detailedCourse.weeks || [];
      // Select first module by default
      if (weeks.length > 0) {
        setActiveModuleId(weeks[0].id);
        if (weeks[0].type === 'Project') {
          setActiveProjectWeekId(weeks[0].id);
          setActiveLesson(null);
        } else {
          setActiveProjectWeekId(null);
          setActiveLesson(null);
        }
      } else if (detailedCourse.lessons && detailedCourse.lessons.length > 0) {
        setActiveLesson(detailedCourse.lessons.sort((a, b) => a.order - b.order)[0]);
        setActiveProjectWeekId(null);
        setActiveModuleId(null);
      } else {
        setActiveLesson(null);
        setActiveProjectWeekId(null);
        setActiveModuleId(null);
      }
      setExpandedLessonId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleLessonComplete = async (lessonId: string) => {
    const currentlyCompleted = !!completedLessons[lessonId];
    const nextCompleted = !currentlyCompleted;

    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: nextCompleted
    }));

    try {
      await lessonService.toggleProgress(lessonId, nextCompleted);
    } catch (err) {
      console.error("Failed to toggle progress on backend", err);
      setCompletedLessons(prev => ({
        ...prev,
        [lessonId]: currentlyCompleted
      }));
      alert("Failed to update progress on backend. Please try again.");
    }
  };

  const getCourseWeeks = (course: Course) => {
    if (course.weeks && course.weeks.length > 0) {
      return course.weeks;
    }
    return [{ id: 'w_default', number: 1, title: 'Introduction', type: 'Study' as const }];
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

  const calculateProgress = (course: Course) => {
    const lessons = course.lessons || [];
    const quizzes = course.quizzes || [];
    const assignments = course.assignments || [];

    const totalItems = lessons.length + quizzes.length + assignments.length;
    if (totalItems === 0) return 0;

    const completedLessonsCount = lessons.filter(l => completedLessons[l.id]).length;
    const passedQuizzesCount = quizzes.filter(q => myResults.some(r => r.quizId === q.id && r.passed)).length;
    const submittedAssignmentsCount = assignments.filter(a => {
      const sub = mySubmissions[a.id];
      if (!sub) return false;
      const weeks = getCourseWeeks(course);
      const wObj = weeks.find(w => w.id === a.weekId);
      if (wObj?.type === 'Project') {
        return sub.isApproved === true;
      }
      return true;
    }).length;

    const completedItems = completedLessonsCount + passedQuizzesCount + submittedAssignmentsCount;
    return Math.round((completedItems / totalItems) * 100);
  };

  const isWeekCompleted = (weekId: string, course: Course) => {
    const weeks = getCourseWeeks(course);
    const wObj = weeks.find(w => w.id === weekId);
    const isProjectWeek = wObj?.type === 'Project';

    const { lessons, assignments, quizzes } = getWeekItems(weekId, course);

    if (lessons.length === 0 && quizzes.length === 0 && assignments.length === 0) {
      return true;
    }

    const allLessonsDone = lessons.every(l => completedLessons[l.id]);
    const allQuizzesDone = quizzes.every(q => myResults.some(r => r.quizId === q.id && r.passed));
    const allAssignmentsDone = assignments.every(a => {
      const sub = mySubmissions[a.id];
      if (!sub) return false;
      if (isProjectWeek) {
        return sub.isApproved === true;
      }
      return true;
    });

    return allLessonsDone && allQuizzesDone && allAssignmentsDone;
  };

  const getWeekProgressDetails = (course: Course) => {
    const weeks = getCourseWeeks(course);
    const totalWeeks = weeks.length;
    const completedWeeks = weeks.filter(w => isWeekCompleted(w.id, course)).length;
    const remainingWeeks = totalWeeks - completedWeeks;
    const percentage = calculateProgress(course);

    const allWeeksDone = weeks.every(w => isWeekCompleted(w.id, course));
    const isFullyCompleted = allWeeksDone;

    return {
      totalWeeks,
      completedWeeks,
      remainingWeeks,
      percentage,
      isFullyCompleted,
      weeksList: weeks.map(w => ({
        ...w,
        completed: isWeekCompleted(w.id, course)
      }))
    };
  };

  const handleTriggerAiQuery = async (queryText: string) => {
    if (aiIsTyping) return;

    // Add user message
    const userMsg = { id: Math.random().toString(), sender: 'user' as const, text: queryText };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiInputText('');
    setAiIsTyping(true);

    // Simulate AI response latency
    await new Promise(r => setTimeout(r, 1200));

    let responseText = '';
    const qLower = queryText.toLowerCase();

    if (qLower.includes('react hooks') || qLower.includes('explain react hooks')) {
      responseText = "React Hooks are functions that allow functional components to hook into React state and lifecycle methods. \n\nKey Hooks:\n1. `useState`: Manages dynamic state values inside a function component.\n2. `useEffect`: Executes side effects (data fetching, page title changes, cleanup listeners).\n3. `useContext`: Accesses values stored in a React Context directly.\n\nExample:\n```jsx\nconst [count, setCount] = useState(0);\nuseEffect(() => {\n  document.title = `Count is ${count}`;\n}, [count]);\n```";
    } else if (qLower.includes('typescript') || qLower.includes('what is typescript')) {
      responseText = "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, adding optional static typing.\n\nBenefits of TypeScript:\n- **Catch Bugs Early**: Finds type mismatches at design-time in your editor, before compiling.\n- **Modern JavaScript**: Supports the latest ESNext syntax features out of the box.\n- **Rich IDE Support**: Powerful code-completion, symbol renaming, and refactoring utilities.\n\nExample:\n```typescript\ninterface Learner {\n  name: string;\n  employeeId: string;\n  isApproved: boolean;\n}\n```";
    } else if (qLower.includes('quiz') || qLower.includes('practice questions') || qLower.includes('give quiz practice questions')) {
      responseText = `Here are some course-related quiz practice questions:\n\n1. *Which TypeScript utility type makes all properties of an interface optional?*\n   - A) Pick\n   - B) Partial (Correct)\n   - C) Omit\n\n2. *What dependency array configuration makes a useEffect hook run exactly once?*\n   - An empty array: \`[]\` (Correct)\n\n3. *Can you use React Hooks inside a conditional block (e.g. if statements)?*\n   - No, hooks must always be called at the top level of the functional component to ensure consistent call order across renders.`;
    } else {
      responseText = `That is an interesting question regarding our curriculum domain! Here are a few educational points to consider:\n\n1. **Core Concept**: Align your implementation with the clean architecture design patterns discussed in early weeks.\n2. **Best Practice**: Document types and handle edge-case exceptions gracefully.\n3. **Quiz Check**: Make sure you practice the weekly quiz questions to prepare for the certificate approval checks.\n\nFeel free to ask me to "Explain React Hooks", "What is TypeScript?", or request "Quiz Practice Questions"!`;
    }

    const aiMsg = { id: Math.random().toString(), sender: 'ai' as const, text: responseText };
    setAiChatMessages(prev => [...prev, aiMsg]);
    setAiIsTyping(false);
  };

  const handleOpenAssignment = (asg: Assignment) => {
    setSelectedAssignment(asg);
    const existing = mySubmissions[asg.id];
    setSubmitText(existing?.submissionText || '');
    setSubmitFile(existing?.fileUrl || '');
    if (existing?.fileUrl) {
      const parts = existing.fileUrl.split('/');
      setSubmitFileName(parts[parts.length - 1]);
    } else {
      setSubmitFileName('');
    }
  };

  const handleAssignmentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssignment) return;

    setSubmitFileUploading(true);
    try {
      const res = await submissionService.upload(file, selectedAssignment.id);
      setSubmitFile(res.fileUrl);
      setSubmitFileName(res.originalName);
      alert('File uploaded successfully!');
      if (res.submission) {
        setMySubmissions(prev => ({
          ...prev,
          [selectedAssignment.id]: res.submission
        }));
      }
    } catch (err) {
      alert('Failed to upload file.');
    } finally {
      setSubmitFileUploading(false);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!submitFile) {
      alert('Please upload a file first.');
      return;
    }
    try {
      const newSub = await submissionService.submit(selectedAssignment.id, {
        submissionText: submitText,
        fileUrl: submitFile
      });
      setMySubmissions(prev => ({
        ...prev,
        [selectedAssignment.id]: newSub
      }));
      setSelectedAssignment(null);
      alert('Assignment submitted successfully!');
    } catch (err) {
      alert('Failed to submit assignment');
    }
  };

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    const answersArray = Object.keys(quizAnswers).map((qId) => ({
      questionId: qId,
      selectedOption: quizAnswers[qId]
    }));

    if (answersArray.length < activeQuiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const result = await quizService.submitAnswers(activeQuiz.id, answersArray);
      setQuizResult(result);
      setMyResults(prev => [...prev, result]);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  const handleClaimCertificate = async (courseId: string) => {
    if (!activeCourse) return;
    const details = getWeekProgressDetails(activeCourse);
    if (!details.isFullyCompleted) {
      alert("Complete all course weeks, lessons, quizzes, and assignments to unlock your certificate.");
      return;
    }
    const alreadyClaimed = certificates.some(c => c.courseId === courseId && (c.status === 'Pending Approval' || c.status === 'Approved'));
    if (alreadyClaimed) {
      alert('You have already claimed the certificate for this course.');
      return;
    }
    try {
      await certificateService.claim(courseId);
      const updatedCerts = await certificateService.getMyCertificates().catch(() => []);
      setCertificates(updatedCerts);
      alert('Certificate request submitted successfully. Your projectCoordinator will review your completion and approve the certificate.');
    } catch (err: any) {
      alert(err.message || 'Ensure you have passed all quizzes and submitted all assignments first!');
    }
  };

  const renderProjectWorkspace = () => {
    if (!activeProjectWeekId || !activeCourse) return null;
    const weeks = getCourseWeeks(activeCourse);
    const currentWeekObj = weeks.find(w => w.id === activeProjectWeekId);
    const { assignments } = getWeekItems(activeProjectWeekId, activeCourse);

    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/25">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 block">
            Capstone Workspace
          </span>
          <h3 className="text-xl font-black text-foreground mt-1 uppercase">
            {currentWeekObj?.title || 'Project Workspace'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Welcome to the classroom project repository. This workspace contains sequential project assignments/stages. You must submit each stage in order. Later stages will unlock once prior stages are submitted.
          </p>
        </div>

        {assignments.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/45 mb-2" />
            <p className="text-sm font-semibold">No project stages defined for this week.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment, index) => {
              const prevAssignment = index > 0 ? assignments[index - 1] : null;
              const isPrevSubmitted = prevAssignment ? !!mySubmissions[prevAssignment.id] : true;
              const isLocked = !isPrevSubmitted;

              const submission = mySubmissions[assignment.id];
              const isSubmitted = !!submission;
              const isGraded = submission?.status === 'GRADED';
              const isApproved = submission?.isApproved === true;

              return (
                <Card key={assignment.id} className={`overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-60 border-dashed bg-secondary/5' : 'hover:shadow-md'
                  }`}>
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-secondary/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                          Stage {index + 1}
                        </span>
                        {isLocked && <Badge variant="outline" className="text-[9px] bg-muted text-muted-foreground">Locked</Badge>}
                        {isSubmitted && !isApproved && <Badge variant="secondary" className="text-[9px]">Awaiting Evaluation</Badge>}
                        {isSubmitted && isApproved && <Badge variant="success" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>}
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSubmitted && (
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Status</span>
                          <span className={`text-xs font-bold ${isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {isApproved ? 'Approved ✓' : 'Submitted (Awaiting Approval)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isLocked && (
                    <CardContent className="p-5 space-y-4">
                      {/* Description / Instructions */}
                      <div className="text-xs text-muted-foreground bg-background p-3 rounded-lg border border-border/80 leading-relaxed whitespace-pre-wrap">
                        <span className="font-bold text-foreground block mb-1">Instructions:</span>
                        {assignment.instruction}
                      </div>

                      {/* Attachment */}
                      {assignment.attachmentUrl && (
                        <div className="p-3 border border-primary/10 bg-primary/[0.02] rounded-lg flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 min-w-0">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground">Project Stage Materials</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-md">{assignment.attachmentUrl}</p>
                            </div>
                          </div>
                          <a
                            href={assignment.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs text-primary hover:underline font-semibold shrink-0 ml-2"
                          >
                            Open <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}

                      {/* Submission details or Submission Form */}
                      {isSubmitted ? (
                        <div className="space-y-4 border-t border-border/40 pt-4 text-left">
                          <h5 className="text-xs font-bold text-foreground">Your Submission:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/5 p-3 rounded-lg border border-border/50 text-xs">
                            <div>
                              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Attached Asset / Link</span>
                              <div className="mt-1">
                                {submission.fileUrl ? (
                                  <div className="flex items-center justify-between gap-2 mt-1">
                                    <a
                                      href={getAuthenticatedFileUrl(submission.fileUrl)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center text-primary font-bold hover:underline"
                                    >
                                      View Submitted Work <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-7 px-2.5 rounded-lg flex items-center gap-1.5 shrink-0 ml-2"
                                      onClick={() => {
                                        setDeleteConfirm({
                                          show: true,
                                          title: 'Delete Uploaded File',
                                          message: 'Are you sure you want to delete this uploaded project file? This will permanently delete the file record and physical file.',
                                          onConfirm: async () => {
                                            try {
                                              await submissionService.delete(submission.id);
                                              setMySubmissions(prev => {
                                                const next = { ...prev };
                                                delete next[assignment.id];
                                                return next;
                                              });
                                              toast.success('Project deleted successfully.');
                                            } catch (err: any) {
                                              toast.error(err.response?.data?.message || 'Failed to delete project.');
                                            }
                                          },
                                        });
                                      }}
                                    >
                                      Delete Project
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">No file link</span>
                                )}
                              </div>
                            </div>
                            {submission.submissionText && (
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Outline / Notes</span>
                                <p className="mt-1 text-muted-foreground leading-relaxed whitespace-pre-wrap">{submission.submissionText}</p>
                              </div>
                            )}
                          </div>

                          {/* Evaluation remarks */}
                          {isGraded && (
                            <div className={`p-4 rounded-lg border text-xs space-y-1.5 ${isApproved
                              ? 'bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : 'bg-destructive/[0.02] border-destructive/20 text-destructive'
                              }`}>
                              <p className="font-bold flex items-center gap-1.5">
                                {isApproved ? <CheckCircle className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
                                {isApproved ? 'Graded & Approved' : 'Needs Modification'}
                              </p>
                              <p><span className="font-semibold text-foreground">Score:</span> {submission.grade}/100</p>
                              {submission.feedback && (
                                <p><span className="font-semibold text-foreground">Project Coordinator Feedback:</span> {submission.feedback}</p>
                              )}
                            </div>
                          )}

                          {/* Resubmission: if not approved, allow resubmitting */}
                          {!isApproved && (
                            <div className="border-t border-border/40 pt-4">
                              <h6 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
                                ↻ Resubmit Stage Update
                              </h6>
                              <ProjectSubmissionForm
                                assignment={assignment}
                                onSuccess={(newSub) => {
                                  setMySubmissions(prev => ({
                                    ...prev,
                                    [assignment.id]: newSub
                                  }));
                                  alert('Project stage updated successfully!');
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border-t border-border/40 pt-4">
                          <ProjectSubmissionForm
                            assignment={assignment}
                            onSuccess={(newSub) => {
                              setMySubmissions(prev => ({
                                ...prev,
                                [assignment.id]: newSub
                              }));
                              alert('Project stage submitted successfully!');
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDashboard = () => {
    const completedCount = Object.values(completedLessons).filter(Boolean).length;
    const passedQuizzesCount = myResults.filter(r => r.passed).length;

    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title={`Welcome Back, ${user?.name || 'Intern'}! 👋`}
          subtitle={`${user?.domain || 'Full Stack'} Pathway`}
          description="Your professional skill-building path is active. Keep climbing to earn verified certificates, finish practical module assignments, and master industry-demanded tools."
          initials={user?.name.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase() || 'CS'}
          badgeText="MEMBER"
          badgeSubText="INTERN"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Enrolled Courses</p>
              <h3 className="text-xl font-bold mt-0.5">{enrolledCourses.length}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Completed Lessons</p>
              <h3 className="text-xl font-bold mt-0.5">{completedCount}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Passed Quizzes</p>
              <h3 className="text-xl font-bold mt-0.5 text-emerald-500">{passedQuizzesCount}</h3>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Earned Badges</p>
              <h3 className="text-xl font-bold mt-0.5 text-amber-500">{certificates.length}</h3>
            </div>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Enrolled Courses */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold font-display">Resume Enrolled Courses</h3>
            {enrolledCourses.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground border border-dashed rounded-xl flex flex-col justify-center items-center h-48">
                <GraduationCap className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-semibold">No courses assigned yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Please contact your coordinator.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrolledCourses.slice(0, 2).map((course) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      {course.domain && (
                        <Badge variant="secondary" className="mb-1.5 text-[10px] w-fit">
                          {course.domain}
                        </Badge>
                      )}
                      <CardTitle className="text-sm line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1">{course.description}</CardDescription>
                      {course.lessons && course.lessons.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                            <span>Progress</span>
                            <span>{calculateProgress(course)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(course)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex items-center justify-between border-t border-border/50 mt-2">
                      <span className="text-[10px] text-muted-foreground">By: {course.projectCoordinatorName || 'Academy'}</span>
                      <Button size="sm" onClick={() => {
                        handleOpenStudyMode(course);
                        navigate('/intern/enrolled');
                      }} className="text-xs h-8">Resume</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info / Certs */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-base font-bold font-display">Latest Achievement</h3>
            {certificates.length === 0 ? (
              <Card className="p-5 text-center text-muted-foreground flex flex-col justify-center items-center h-48">
                <Award className="h-8 w-8 text-muted-foreground/45 mb-2" />
                <p className="text-xs">Pass all quizzes & submit tasks in a course to earn graduation credentials!</p>
              </Card>
            ) : (
              <Card className="p-4 border-2 border-amber-500/20 bg-amber-500/5 text-center flex flex-col justify-between h-48">
                <div>
                  <Award className="h-7 w-7 mx-auto text-amber-500 mb-1" />
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Graduate Badge</p>
                  <p className="text-xs font-semibold truncate mt-1">{certificates[certificates.length - 1].courseTitle}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/intern/certificates')} className="text-xs w-full mt-2">
                  View Certificates
                </Button>
              </Card>
            )}

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

  const renderBrowse = () => {
    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title="Browse Curriculum"
          subtitle="Catalog browse"
          description="Select any of the available courses to enroll and begin studying."
          icon={BookOpen}
          badgeText="BROWSE"
          badgeSubText="INTERN"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allCourses.map((course) => {
            const isEnrolled = enrolledCourses.some((c) => c.id === course.id);
            return (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
                <div className="h-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-t-xl flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-lg font-bold line-clamp-2">{course.title}</span>
                  {course.domain && (
                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-transparent text-[10px]">
                      {course.domain}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Project Coordinator: {course.projectCoordinatorName || 'Academy'}</span>
                    <Button
                      size="sm"
                      variant={isEnrolled ? 'secondary' : 'primary'}
                      onClick={() => !isEnrolled && handleEnroll(course.id)}
                      disabled={isEnrolled}
                      className="text-xs"
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEnrolled = () => {
    if (activeCourse) {
      const weeks = getCourseWeeks(activeCourse);
      const selectedWeek = weeks.find(w => w.id === activeModuleId);
      const selectedWeekIdx = weeks.findIndex(w => w.id === activeModuleId);
      const isProjectWeek = selectedWeek?.type === 'Project';
      const { lessons: moduleItems, quizzes: moduleQuizzes, assignments: moduleAssignments } =
        activeModuleId ? getWeekItems(activeModuleId, activeCourse) : { lessons: [], quizzes: [], assignments: [] };
      const details = getWeekProgressDetails(activeCourse);

      // Calculate per-module progress
      const moduleProgress = activeModuleId ? (() => {
        const { lessons: ls, quizzes: qs, assignments: as } = getWeekItems(activeModuleId, activeCourse);
        const total = ls.length + qs.length + as.length;
        if (total === 0) return 0;
        const done = ls.filter(l => completedLessons[l.id]).length +
          qs.filter(q => myResults.some(r => r.quizId === q.id && r.passed)).length +
          as.filter(a => !!mySubmissions[a.id]).length;
        return Math.round((done / total) * 100);
      })() : 0;

      // Detailed Study view — premium two-column layout
      return (
        <div className="text-left animate-fade-in">
          {/* ── Controls Row ── */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => { setActiveCourse(null); setActiveLesson(null); setActiveModuleId(null); setExpandedLessonId(null); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Exit Classroom
              </button>
              <button
                onClick={() => setShowAiAssistant(!showAiAssistant)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all shadow-sm ${showAiAssistant
                  ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:text-teal-700'
                  }`}
              >
                <Bot className="h-4 w-4 text-teal-500" />
                {showAiAssistant ? 'Hide AI' : 'AI Assistant'}
              </button>
            </div>
            {activeCourse.domain && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF4F8] dark:bg-[#0F4C81]/20 text-[#0F4C81] dark:text-blue-400 border border-[#0F4C81]/20">
                {activeCourse.domain}
              </span>
            )}
          </div>

          {/* ── Premium Hero Banner ── */}
          {(() => {
            // Domain → domain-specific SVG illustration (fully dynamic)
            const domainIcon = (() => {
              const d = (activeCourse.domain || '').toLowerCase();
              if (d.includes('cyber') || d.includes('security')) return (
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 8L14 20v18c0 15.5 11.1 30 26 34 14.9-4 26-18.5 26-34V20L40 8z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M40 18L22 27v13c0 10.8 7.8 20.9 18 23.7C50.2 61 58 50.9 58 40V27L40 18z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <circle cx="40" cy="38" r="7" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                  <line x1="40" y1="45" x2="40" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              );
              if (d.includes('full stack') || d.includes('web') || d.includes('frontend') || d.includes('backend')) return (
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="16" width="60" height="42" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <rect x="10" y="16" width="60" height="10" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <circle cx="18" cy="21" r="2" fill="rgba(255,120,120,0.7)" />
                  <circle cx="25" cy="21" r="2" fill="rgba(255,200,100,0.7)" />
                  <circle cx="32" cy="21" r="2" fill="rgba(100,220,100,0.7)" />
                  <path d="M22 36l-8 6 8 6" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M58 36l8 6-8 6" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M46 32l-12 18" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              );
              if (d.includes('data') || d.includes('analytics') || d.includes('ml') || d.includes('ai')) return (
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="55" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
                  <rect x="26" y="42" width="12" height="29" rx="2" fill="rgba(255,255,255,0.22)" />
                  <rect x="42" y="30" width="12" height="41" rx="2" fill="rgba(255,255,255,0.18)" />
                  <rect x="58" y="18" width="12" height="53" rx="2" fill="rgba(255,255,255,0.15)" />
                  <path d="M16 54L32 41L48 29L64 17" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16" cy="54" r="3" fill="rgba(255,255,255,0.8)" /><circle cx="32" cy="41" r="3" fill="rgba(255,255,255,0.8)" />
                  <circle cx="48" cy="29" r="3" fill="rgba(255,255,255,0.8)" /><circle cx="64" cy="17" r="3" fill="rgba(255,255,255,0.8)" />
                </svg>
              );
              if (d.includes('network') || d.includes('cisco') || d.includes('ccna')) return (
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="6" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                  <circle cx="14" cy="24" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <circle cx="66" cy="24" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <circle cx="14" cy="56" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <circle cx="66" cy="56" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <line x1="19" y1="26" x2="34" y2="37" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="61" y1="26" x2="46" y2="37" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="19" y1="54" x2="34" y2="43" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="61" y1="54" x2="46" y2="43" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </svg>
              );
              // Default tech / learning illustration
              return (
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="20" width="56" height="40" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <path d="M12 30h56" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M28 20v40" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <circle cx="49" cy="46" r="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M46 46l2 2 4-5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 36h7M17 41h7M17 46h7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              );
            })();

            const initials = activeCourse.title
              .split(' ')
              .filter((w: string) => w.length > 0)
              .map((w: string) => w[0])
              .join('')
              .substring(0, 4)
              .toUpperCase();

            return (
              <HeroBanner
                title={activeCourse.title}
                subtitle="Certification Programme"
                description={
                  <>
                    {(activeCourse.domain || activeCourse.difficulty) && (
                      <p className="text-sm font-semibold mb-3 tracking-wide text-white/70">
                        {activeCourse.domain}
                        {activeCourse.domain && activeCourse.difficulty && <span className="mx-2 text-white/30">·</span>}
                        {activeCourse.difficulty && <span>{activeCourse.difficulty} Level</span>}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2 text-white/60">
                      {activeCourse.description}
                    </p>
                  </>
                }
                initials={initials}
                badgeText="COURSE"
                badgeSubText="CERT"
                extraContent={
                  <div className="space-y-4">
                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {activeCourse.duration && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)' }}>
                          <Clock className="h-3 w-3 flex-shrink-0 text-[#7ee8f8]" />
                          {activeCourse.duration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)' }}>
                        <BookOpen className="h-3 w-3 flex-shrink-0 text-[#7ee8f8]" />
                        {weeks.length} Modules
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)' }}>
                        <GraduationCap className="h-3 w-3 flex-shrink-0 text-[#7ee8f8]" />
                        {(activeCourse.lessons || []).length} Lessons
                      </span>
                      {activeCourse.projectCoordinatorName && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)' }}>
                          <Users className="h-3 w-3 flex-shrink-0 text-[#7ee8f8]" />
                          {activeCourse.projectCoordinatorName}
                        </span>
                      )}
                    </div>

                    {/* Learning outcomes */}
                    {activeCourse.learningOutcomes && activeCourse.learningOutcomes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider self-center mr-1 text-white/40">You'll learn:</span>
                        {activeCourse.learningOutcomes.slice(0, 3).map((outcome: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.78)' }}>
                            <span className="text-[#7ee8f8]">✓</span> {outcome}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 max-w-xs mx-auto md:mx-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0 text-white/45">Progress</span>
                      <div className="flex-1 rounded-full h-1.5 overflow-hidden bg-white/15">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${details.percentage}%`, background: 'linear-gradient(90deg, #7ee8f8, #38bdf8)' }} />
                      </div>
                      <span className="text-xs font-bold tabular-nums flex-shrink-0 text-[#7ee8f8]">{details.percentage}%</span>
                    </div>
                  </div>
                }
              />
            );
          })()}
          {/* ── Brochure Card ── */}
          {activeCourse.brochureUrl && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4 px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/40 flex-shrink-0">
                  <FileText className="h-5 w-5 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Course Brochure</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{activeCourse.brochureName || 'curriculum-brochure.pdf'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => window.open(activeCourse.brochureUrl, '_blank')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#0F4C81]/30 bg-[#EAF4F8] dark:bg-[#0F4C81]/20 text-[#0F4C81] dark:text-blue-400 hover:bg-[#0F4C81]/10 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <a href={getAuthenticatedFileUrl(activeCourse.brochureUrl)} download
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C81] text-white hover:bg-[#1B6CA8] transition-colors shadow-sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── TWO-COLUMN LEARNING LAYOUT ── */}
          <div className="flex gap-4 items-start">

            {/* LEFT COLUMN — Module List (30%) — sticky */}
            <div className="w-[30%] flex-shrink-0 sticky top-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Course Modules</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {weeks.map((week, wIdx) => {
                    const isSelected = activeModuleId === week.id;
                    const isCompleted = isWeekCompleted(week.id, activeCourse);
                    const isProject = week.type === 'Project';
                    const projectIndex = isProject
                      ? weeks.slice(0, wIdx + 1).filter((w) => w.type === 'Project').length
                      : 0;

                    return (
                      <button
                        key={week.id}
                        onClick={() => {
                          setActiveModuleId(week.id);
                          setExpandedLessonId(null);
                          if (isProject) { setActiveProjectWeekId(week.id); setActiveLesson(null); }
                          else { setActiveProjectWeekId(null); setActiveLesson(null); }
                        }}
                        className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-200 border-l-[3px] ${isSelected
                          ? 'bg-[#EAF4F8] dark:bg-[#0F4C81]/15 border-[#0F4C81] dark:border-blue-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent'
                          }`}
                      >
                        <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${isSelected
                          ? 'bg-[#0F4C81] dark:bg-blue-600 text-white shadow-sm'
                          : isCompleted ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                          {isCompleted ? <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">✓</span> : <span>{isProject ? `P${projectIndex}` : wIdx + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-[#17A2B8]' : isProject ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>
                            {isProject ? `Project ${projectIndex}` : `Module ${wIdx + 1}`}
                          </div>
                          <div className={`text-xs leading-snug font-medium ${isSelected ? 'text-[#0F4C81] dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                            {week.title}
                          </div>
                          {isCompleted && (
                            <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {(() => {
                                const { assignments } = getWeekItems(week.id, activeCourse);
                                const grades = assignments
                                  .map(a => mySubmissions[a.id]?.grade)
                                  .filter(g => g !== undefined && g !== null);
                                const dates = assignments
                                  .map(a => mySubmissions[a.id]?.gradedAt || mySubmissions[a.id]?.createdAt)
                                  .filter(Boolean);
                                
                                const avgGrade = grades.length > 0
                                  ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)
                                  : null;
                                const completionDate = dates.length > 0
                                  ? new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toLocaleDateString()
                                  : null;

                                return (
                                  <>
                                    {avgGrade !== null && <span>Grade: {avgGrade}/100</span>}
                                    {completionDate && <span>Completed: {completionDate}</span>}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-colors ${isSelected ? 'text-[#0F4C81] dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>
                {/* Progress + Certificate */}
                {(() => {
                  const activeRequest = certificates.find(c => c.courseId === activeCourse.id);
                  return (
                    <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/60 dark:bg-slate-800/20">
                      <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Progress</h6>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] transition-all duration-700" style={{ width: `${details.percentage}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#0F4C81] dark:text-blue-400 flex-shrink-0">{details.percentage}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-2.5 text-center border border-slate-100 dark:border-slate-700">
                          <p className="text-base font-bold text-slate-800 dark:text-slate-200">{details.completedWeeks}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">Done</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-2.5 text-center border border-slate-100 dark:border-slate-700">
                          <p className="text-base font-bold text-slate-800 dark:text-slate-200">{details.remainingWeeks}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">Left</p>
                        </div>
                      </div>
                      {!details.isFullyCompleted ? (
                        <button disabled className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700">🎓 Claim Certificate</button>
                      ) : !activeRequest ? (
                        <button onClick={() => handleClaimCertificate(activeCourse.id)} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0F4C81] to-[#1B6CA8] text-white hover:from-[#1B6CA8] hover:to-[#0F4C81] transition-all shadow-sm">🎓 Claim Certificate</button>
                      ) : activeRequest.status === 'Pending Approval' ? (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-center">Pending coordinator review</p>
                      ) : activeRequest.status === 'Approved' ? (
                        <div className="space-y-1.5">
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/30 text-center flex items-center justify-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Approved!</div>
                          <button onClick={() => setActiveTab('certificates')} className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">View Certificates</button>
                        </div>
                      ) : (
                        <button onClick={() => handleClaimCertificate(activeCourse.id)} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0F4C81] to-[#1B6CA8] text-white hover:from-[#1B6CA8] hover:to-[#0F4C81] transition-all shadow-sm">🎓 Re-claim Certificate</button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* RIGHT COLUMN — Lesson Accordion (70%) */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {isProjectWeek && activeProjectWeekId ? (
                renderProjectWorkspace()
              ) : selectedWeek ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  {/* Module Header */}
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#F8FAFC] to-white dark:from-[#0b1a2e]/60 dark:to-slate-900">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#17A2B8] mb-1">Module {selectedWeekIdx + 1}</div>
                    <h2 className="text-xl font-black font-display text-slate-800 dark:text-white">{selectedWeek.title}</h2>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] transition-all duration-700" style={{ width: `${moduleProgress}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0 tabular-nums">{moduleProgress}% complete</span>
                    </div>
                  </div>

                  {/* Accordion items */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Lessons */}
                    {moduleItems.map((lesson, lIdx) => {
                      const isExpanded = expandedLessonId === lesson.id;
                      const isCompleted = completedLessons[lesson.id];
                      return (
                        <div key={lesson.id} className="transition-colors duration-150">
                          <button
                            onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 ${isExpanded ? 'bg-[#EAF4F8] dark:bg-[#0F4C81]/10' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'}`}
                          >
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : isExpanded ? 'bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 text-[#0F4C81] dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                              {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Play className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lesson {lIdx + 1}</div>
                              <div className={`text-sm font-semibold truncate mt-0.5 ${isExpanded ? 'text-[#0F4C81] dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{lesson.title}</div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {lesson.videoUrl && !isExpanded && <span className="text-[9px] font-bold text-[#17A2B8] bg-teal-50 dark:bg-teal-950/30 px-1.5 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/60">VIDEO</span>}
                              {lesson.attachmentUrl && !isExpanded && <span className="text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-800/60">PDF</span>}
                              <ChevronDown className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-6 pt-3 bg-[#EAF4F8]/40 dark:bg-[#0F4C81]/5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in text-left">
                              {lesson.content && (
                                <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
                                  <CardHeader className="pb-2.5 pt-3.5 px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950/40 dark:text-sky-400 rounded-md">
                                        <BookOpen className="h-3.5 w-3.5" />
                                      </div>
                                      <div>
                                        <CardTitle className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                          Key Concepts & Topics
                                        </CardTitle>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <ul className="space-y-2 text-xs leading-relaxed text-slate-650 dark:text-slate-350 list-none pl-0">
                                      {getBulletPoints(lesson.content).map((pt, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-2">
                                          <span className="text-[#0F4C81] dark:text-sky-400 font-extrabold select-none mt-0.5">•</span>
                                          <span className="flex-1">
                                            <strong className="text-slate-850 dark:text-white font-black">{pt.bold}</strong> {pt.text}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </CardContent>
                                </Card>
                              )}
                              {lesson.videoUrl && (
                                <VideoPlayer url={lesson.videoUrl} lessonId={lesson.id} onPlayOrWatched={() => {
                                  if (!watchedVideos[lesson.id]) {
                                    setWatchedVideos(prev => {
                                      const next = { ...prev, [lesson.id]: true };
                                      if (user?.id) localStorage.setItem(`lms_watched_videos_${user.id}`, JSON.stringify(next));
                                      return next;
                                    });
                                  }
                                }} />
                              )}
                              {lesson.attachmentUrl && (
                                <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200/60 dark:border-rose-900/40 flex-shrink-0"><FileText className="h-4 w-4 text-rose-500" /></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Study Material / PDF</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{lesson.attachmentUrl}</p>
                                  </div>
                                  <a href={getAuthenticatedFileUrl(lesson.attachmentUrl)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#0F4C81] dark:text-blue-400 bg-[#EAF4F8] dark:bg-[#0F4C81]/20 border border-[#0F4C81]/20 hover:bg-[#0F4C81]/10 transition-colors">
                                    <ExternalLink className="h-3 w-3" /> View
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                {lesson.videoUrl && !watchedVideos[lesson.id] ? (
                                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">⚠️ Watch the video to unlock completion</p>
                                ) : <div />}
                                <button
                                  onClick={() => {
                                    if (lesson.videoUrl && !watchedVideos[lesson.id]) { alert('Please start or watch the video first before marking this lesson as completed.'); return; }
                                    handleToggleLessonComplete(lesson.id);
                                  }}
                                  disabled={!!(lesson.videoUrl && !watchedVideos[lesson.id] && !completedLessons[lesson.id])}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${completedLessons[lesson.id] ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' : 'bg-[#0F4C81] text-white hover:bg-[#1B6CA8] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'}`}
                                >
                                  {completedLessons[lesson.id] ? <><Check className="h-4 w-4" /> Completed</> : 'Mark Complete'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Quizzes */}
                    {moduleQuizzes.map((quiz) => {
                      const hasTaken = myResults.some(r => r.quizId === quiz.id);
                      const passed = myResults.find(r => r.quizId === quiz.id)?.passed;
                      return (
                        <button key={quiz.id} onClick={() => { setActiveQuiz(quiz); setQuizAnswers({}); setQuizResult(null); }}
                          className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : hasTaken ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-500' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'}`}>
                            <HelpCircle className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quiz</div>
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">{quiz.title}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {hasTaken && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${passed ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-900/40' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-200 dark:border-rose-900/40'}`}>{passed ? 'Passed' : 'Failed'}</span>}
                            <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          </div>
                        </button>
                      );
                    })}

                    {/* Assignments */}
                    {moduleAssignments.map((assignment) => {
                      const isSubmitted = !!mySubmissions[assignment.id];
                      const isGraded = mySubmissions[assignment.id]?.status === 'GRADED';
                      const isApproved = mySubmissions[assignment.id]?.isApproved === true;
                      return (
                        <button key={assignment.id} onClick={() => handleOpenAssignment(assignment)}
                          className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isApproved ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : isSubmitted ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assessment</div>
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">{assignment.title}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isGraded && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">{mySubmissions[assignment.id].grade}/100</span>}
                            {isSubmitted && !isGraded && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200 dark:border-amber-900/40">Submitted</span>}
                            <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          </div>
                        </button>
                      );
                    })}

                    {moduleItems.length === 0 && moduleQuizzes.length === 0 && moduleAssignments.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 dark:text-slate-500">
                        <BookOpen className="h-10 w-10 mb-3 opacity-30" />
                        <p className="text-sm font-semibold">No lessons in this module yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center py-24 text-center text-slate-400 dark:text-slate-500">
                  <div><BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm font-semibold">Select a module from the left to begin.</p></div>
                </div>
              )}

              {/* AI Assistant Panel */}
              {showAiAssistant && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-50/80 to-white dark:from-teal-950/20 dark:to-slate-900">
                    <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-500 animate-pulse" /><span className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Tutor</span></div>
                    <button onClick={() => setShowAiAssistant(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {aiChatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-[#0F4C81] text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none'}`}>
                          {msg.sender === 'ai' && <div className="text-[9px] font-bold uppercase text-teal-600 dark:text-teal-400 mb-1 flex items-center gap-1"><Bot className="h-3 w-3" /> AI Tutor</div>}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {aiIsTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2.5 rounded-tl-none flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-2">
                    <div className="flex flex-col gap-1">
                      {['Explain React Hooks', 'What is TypeScript?', 'Give Quiz Practice Questions'].map(prompt => (
                        <button key={prompt} onClick={() => handleTriggerAiQuery(prompt)} className="text-[10px] font-medium text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors">💡 {prompt}</button>
                      ))}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); if (aiInputText.trim()) handleTriggerAiQuery(aiInputText.trim()); }} className="flex gap-1.5">
                      <input value={aiInputText} onChange={(e) => setAiInputText(e.target.value)} placeholder="Ask AI..." className="flex-1 h-8 px-3 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" disabled={aiIsTyping} />
                      <button type="submit" className="h-8 w-8 bg-[#0F4C81] hover:bg-[#1B6CA8] text-white rounded-lg flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50" disabled={aiIsTyping || !aiInputText.trim()}><Send className="h-3.5 w-3.5" /></button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">My Classroom</h2>
          <p className="text-sm text-muted-foreground">Access your enrolled courses and enter study mode to progress.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrolledCourses.length === 0 ? (
            <div className="col-span-3 p-12 text-center text-muted-foreground border border-dashed rounded-xl">
              <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-semibold text-sm">No courses assigned yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Please contact your coordinator to get started.</p>
            </div>
          ) : (
            enrolledCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
                <div className="h-32 bg-gradient-to-r from-[#0F4C81] via-[#1B6CA8] to-[#17A2B8] rounded-t-xl flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-lg font-bold line-clamp-2">{course.title}</span>
                  {course.domain && (
                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-transparent text-[10px]">
                      {course.domain}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                  {course.lessons && course.lessons.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Course Completion</span>
                        <span>{calculateProgress(course)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(course)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Project Coordinator: {course.projectCoordinatorName || 'Academy'}</span>
                    <Button size="sm" onClick={() => handleOpenStudyMode(course)} className="text-xs">
                      Study Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderCertificates = () => {
    return (
      <div className="space-y-6 text-left">
        <HeroBanner
          title="Earned Badges & Certificates"
          subtitle="Graduation Credentials"
          description="View and download completion credentials for your finished tracks."
          icon={Award}
          badgeText="CREDENTIALS"
          badgeSubText="INTERN"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificates.length === 0 ? (
            <div className="col-span-3 p-12 text-center text-muted-foreground border border-dashed rounded-xl">
              <Award className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-semibold text-sm">No graduation credentials claimed yet.</p>
            </div>
          ) : (
            certificates.map((cert) => {
              const status = cert.status || 'Approved';

              if (status === 'Approved') {
                return (
                  <Card key={cert.id} className="hover:shadow-lg transition-all duration-300 border-2 border-amber-500/25 bg-amber-500/[0.01]">
                    <CardHeader className="bg-amber-500/5 p-6 text-center border-b border-border/50">
                      <Award className="h-10 w-10 mx-auto text-amber-500 mb-2" />
                      <div className="flex items-center justify-center gap-1.5">
                        <CardTitle className="text-base text-amber-600 dark:text-amber-400">Completion Certificate</CardTitle>
                        <Badge variant="success" className="text-[9px]">Approved</Badge>
                      </div>
                      <CardDescription className="text-xs font-mono">{cert.certificateCode}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 text-center space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Awarded to:</p>
                        <p className="text-sm font-semibold mt-0.5">{cert.studentName || 'Academy Graduate'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">For completing:</p>
                        <p className="text-sm font-semibold mt-0.5">{cert.courseTitle || 'Learning Track'}</p>
                      </div>
                      <div className="text-[10px] text-muted-foreground border-t border-border/50 pt-4">
                        Issued on: {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Your projectCoordinator will provide the certificate
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              if (status === 'Pending Approval') {
                return (
                  <Card key={cert.id} className="hover:shadow-lg transition-all duration-300 border-2 border-slate-300/60 bg-slate-500/[0.02]">
                    <CardHeader className="bg-slate-500/5 p-6 text-center border-b border-border/50">
                      <HelpCircle className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                      <div className="flex items-center justify-center gap-1.5">
                        <CardTitle className="text-base text-slate-600 dark:text-slate-400 font-bold">Certificate Request</CardTitle>
                        <Badge variant="secondary" className="text-[9px]">Pending Review</Badge>
                      </div>
                      <CardDescription className="text-[10px] text-muted-foreground">Awaiting review from projectCoordinator</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 text-center space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Claimant:</p>
                        <p className="text-sm font-semibold mt-0.5">{cert.studentName || 'Academy Graduate'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Course Track:</p>
                        <p className="text-sm font-semibold mt-0.5">{cert.courseTitle || 'Learning Track'}</p>
                      </div>
                      <div className="text-[10px] text-muted-foreground border-t border-border/50 pt-4">
                        Requested: {cert.requestDate ? new Date(cert.requestDate).toLocaleDateString() : 'Just now'}
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground bg-muted p-2 rounded">
                        Your projectCoordinator will review your completion and approve the certificate.
                      </p>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <Card key={cert.id} className="hover:shadow-lg transition-all duration-300 border-2 border-destructive/20 bg-destructive/[0.01]">
                  <CardHeader className="bg-destructive/5 p-6 text-center border-b border-border/50">
                    <CheckCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                    <div className="flex items-center justify-center gap-1.5">
                      <CardTitle className="text-base text-destructive font-bold">Request Rejected</CardTitle>
                      <Badge variant="destructive" className="text-[9px]">Rejected</Badge>
                    </div>
                    <CardDescription className="text-[10px] text-destructive">Syllabus requirements incomplete</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 text-center space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Claimant:</p>
                      <p className="text-sm font-semibold mt-0.5">{cert.studentName || 'Academy Graduate'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Course Track:</p>
                      <p className="text-sm font-semibold mt-0.5">{cert.courseTitle || 'Learning Track'}</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground border-t border-border/50 pt-4">
                      Requested: {cert.requestDate ? new Date(cert.requestDate).toLocaleDateString() : 'Just now'}
                    </div>
                    <p className="text-xs font-semibold text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                      Your request was rejected. Please review and ensure all course components are 100% complete before re-submitting.
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <HeroBanner
          title="Presentation Registration"
          subtitle="Milestones"
          description={`Explore available topics/projects in your domain (${user?.domain || 'N/A'}) and register your interest for presentations.`}
          icon={Briefcase}
          badgeText="PROJECTS"
          badgeSubText="INTERN"
        />

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="border border-border/80 p-12 text-center text-muted-foreground bg-card/50">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-semibold text-sm">No projects currently available.</p>
            <p className="text-xs text-muted-foreground mt-1">Please check back later or contact your projectCoordinator.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Card key={p.id} className="border border-border/80 shadow-xs hover:border-[#0F4C81]/30 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between bg-card/60 rounded-xl">
                <div>
                  <CardHeader className="p-5 border-b border-border bg-secondary/10 flex flex-col items-start gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                      {p.domain}
                    </Badge>
                    <CardTitle className="text-base font-bold text-foreground font-display leading-tight">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 flex-1">
                    <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-1.5 font-display">Description</h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{p.description}</p>
                  </CardContent>
                </div>
                <div className="p-5 pt-4 border-t border-border/40 flex items-center justify-between bg-secondary/5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider font-display">Project Coordinator</span>
                    <span className="text-xs font-bold text-foreground">{p.projectCoordinator?.name || 'Academy'}</span>
                  </div>
                  {p.isRegistered ? (
                    <Badge variant="success" className="text-xs h-9 px-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold flex items-center gap-1.5 rounded-lg">
                      <Check className="h-3.5 w-3.5" /> Registered
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleOpenRegisterModal(p)}
                      className="text-xs h-9 bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white hover:from-[#17A2B8] hover:to-[#0F4C81] font-semibold cursor-pointer shadow-sm hover:shadow hover:-translate-y-0.5 transition-all rounded-lg"
                    >
                      Register Interest
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── renderUpcomingPresentations (Intern) ───────────────────────────────────
  const renderUpcomingPresentations = () => {
    const handleOpenRegForm = (pres: Presentation) => {
      setSelectedPresentation(pres);
      setPrFullName(user?.name || '');
      setPrDomain(user?.domain || '');
      setPrCollegeName(user?.collegeName || '');
      setPrYearOfStudy('');
      setPrInternshipTiming('');
      setPrInternshipStartDate('');
      setPrInternshipEndDate('');
      setPrPurpose('');
      setPrProjectsWorkedOn('');
      setPrWillingToAttend('Yes');
      setPrQaQuestions('');
      setPrAdditionalRemarks('');
      setPrInternSignature('');
      setIsPresentationRegModalOpen(true);
    };

    const handleSubmitRegistration = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPresentation) return;
      setLoading(true);
      try {
        await presentationRegistrationService.create({
          presentationId: selectedPresentation.id,
          fullName: prFullName,
          domain: prDomain,
          collegeName: prCollegeName,
          yearOfStudy: prYearOfStudy,
          internshipTiming: prInternshipTiming,
          internshipStartDate: prInternshipStartDate,
          internshipEndDate: prInternshipEndDate,
          purpose: prPurpose,
          projectsWorkedOn: prProjectsWorkedOn,
          willingToAttend: prWillingToAttend === 'Yes',
          qaQuestions: prQaQuestions,
          additionalRemarks: prAdditionalRemarks || undefined,
          internSignature: prInternSignature,
        });
        toast.success('Registration submitted successfully!');
        setIsPresentationRegModalOpen(false);
        setMyPresentationRegistrations(prev => [...prev, selectedPresentation.id]);
        setSelectedPresentation(null);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to submit registration');
      } finally {
        setLoading(false);
      }
    };

    const label = (text: string, required = true) => (
      <label className="block text-xs font-semibold text-foreground mb-1">
        {text}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    );

    const inputCls = "w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30";

    return (
      <div className="space-y-6 animate-fade-in text-left">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#17A2B8] p-6 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">INTERN · PRESENTATIONS</p>
          <h1 className="text-2xl font-bold">Upcoming Presentations</h1>
          <p className="text-sm text-white/80 mt-1">Register for scheduled presentations and showcase your internship journey.</p>
        </div>

        {presentations.length === 0 ? (
          <Card className="border border-border/80 p-12 text-center text-muted-foreground bg-card/50">
            <Award className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-semibold text-sm">No upcoming presentations at this time.</p>
            <p className="text-xs mt-1">Check back later or contact your coordinator.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {presentations.map(pres => {
              const isRegistered = myPresentationRegistrations.includes(pres.id);
              const isClosed = pres.status === 'CLOSED';
              return (
                <Card key={pres.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all bg-card/60 rounded-xl overflow-hidden flex flex-col">
                  <CardHeader className="p-4 border-b border-border bg-secondary/10">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-bold leading-tight">{pres.title}</CardTitle>
                      <Badge className={`text-[10px] shrink-0 font-bold px-2 py-0.5 border ${isClosed ? 'bg-gray-500/10 text-gray-500 border-gray-400/20' : 'bg-teal-500/10 text-teal-600 border-teal-500/20'}`}>
                        {pres.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(pres.presentationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pres.presentationTime}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">{pres.description}</p>
                    {pres.coordinator && (
                      <p className="text-[10px] text-muted-foreground mt-3 font-semibold">Coordinator: {pres.coordinator.name}</p>
                    )}
                  </CardContent>
                  <div className="p-4 pt-0">
                    {isRegistered ? (
                      <Badge className="w-full justify-center py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
                        <Check className="h-3 w-3 mr-1" /> Registered
                      </Badge>
                    ) : isClosed ? (
                      <button disabled className="w-full py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                        Registration Closed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRegForm(pres)}
                        className="w-full py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white hover:opacity-90 transition-opacity"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Registration Modal */}
        <Modal
          isOpen={isPresentationRegModalOpen}
          onClose={() => setIsPresentationRegModalOpen(false)}
          title={`Register: ${selectedPresentation?.title}`}
        >
          <form onSubmit={handleSubmitRegistration} className="space-y-5 max-h-[70vh] overflow-y-auto px-1 py-1">
            {/* Section: Personal Information */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Personal Information</h3>
              <div>
                {label('Full Name')}
                <input className={inputCls} value={prFullName} onChange={e => setPrFullName(e.target.value)} required placeholder="Your full legal name" />
              </div>
              <div>
                {label('Domain')}
                <input className={inputCls} value={prDomain} onChange={e => setPrDomain(e.target.value)} required placeholder="e.g. Full Stack, AI/ML" />
              </div>
              <div>
                {label('College Name')}
                <input className={inputCls} value={prCollegeName} onChange={e => setPrCollegeName(e.target.value)} required placeholder="Your college / university name" />
              </div>
              <div>
                {label('Year of Study')}
                <input className={inputCls} value={prYearOfStudy} onChange={e => setPrYearOfStudy(e.target.value)} required placeholder="e.g. 3rd Year B.E. / Final Year" />
              </div>
            </div>

            {/* Section: Internship Information */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Internship Information</h3>
              <div>
                {label('Internship Timing')}
                <input className={inputCls} value={prInternshipTiming} onChange={e => setPrInternshipTiming(e.target.value)} required placeholder="e.g. 9 AM - 5 PM or Full Day" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  {label('Internship Start Date')}
                  <input type="date" className={inputCls} value={prInternshipStartDate} onChange={e => setPrInternshipStartDate(e.target.value)} required />
                </div>
                <div>
                  {label('Internship End Date')}
                  <input type="date" className={inputCls} value={prInternshipEndDate} onChange={e => setPrInternshipEndDate(e.target.value)} required />
                </div>
              </div>
              <div>
                {label('Purpose of Doing the Internship')}
                <textarea rows={3} className={inputCls} value={prPurpose} onChange={e => setPrPurpose(e.target.value)} required placeholder="Describe your purpose and learning goals..." />
              </div>
              <div>
                {label('Projects You Worked On')}
                <textarea rows={3} className={inputCls} value={prProjectsWorkedOn} onChange={e => setPrProjectsWorkedOn(e.target.value)} required placeholder="List the projects you worked on during the internship..." />
              </div>
            </div>

            {/* Section: Presentation */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Presentation</h3>
              <div>
                {label('Willing to Attend Project Presentation')}
                <div className="flex gap-4 mt-1">
                  {['Yes', 'No'].map(v => (
                    <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="willingToAttend" value={v} checked={prWillingToAttend === v} onChange={() => setPrWillingToAttend(v)} className="accent-[#0F4C81]" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Q&A */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Q&amp;A Session</h3>
              <div>
                {label('Questions for Q&A Session')}
                <textarea rows={4} className={inputCls} value={prQaQuestions} onChange={e => setPrQaQuestions(e.target.value)} required placeholder="List your questions for the Q&amp;A session..." />
              </div>
            </div>

            {/* Section: Remarks */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Remarks</h3>
              <div>
                {label('Additional Remarks', false)}
                <textarea rows={2} className={inputCls} value={prAdditionalRemarks} onChange={e => setPrAdditionalRemarks(e.target.value)} placeholder="Optional additional notes..." />
              </div>
            </div>

            {/* Section: Signature */}
            <div className="rounded-lg bg-secondary/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Signature</h3>
              <div>
                {label('Intern Signature')}
                <input className={inputCls} value={prInternSignature} onChange={e => setPrInternSignature(e.target.value)} required placeholder="Type your full name as your digital signature" />
                <p className="text-[10px] text-muted-foreground mt-1">By entering your name, you confirm the information provided is accurate.</p>
              </div>
              <div className="p-3 border border-border/50 rounded-lg bg-background/40">
                <p className="text-xs font-semibold text-muted-foreground">Coordinator Signature</p>
                <p className="text-xs text-muted-foreground mt-0.5 italic">To be added by coordinator after review</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsPresentationRegModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-secondary/50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {location.pathname === '/intern' || location.pathname === '/intern/' ? renderDashboard() : null}
      {location.pathname.startsWith('/intern/enrolled') ? renderEnrolled() : null}
      {location.pathname.startsWith('/intern/certificates') ? renderCertificates() : null}
      {location.pathname.startsWith('/intern/projects') ? renderProjects() : null}
      {location.pathname.startsWith('/intern/presentations') ? renderUpcomingPresentations() : null}

      {/* Modal: Assignment Submission Panel */}
      <Modal isOpen={!!selectedAssignment} onClose={() => setSelectedAssignment(null)} title="Assignment Submission Workspace">
        {selectedAssignment && (
          <form onSubmit={handleSubmitAssignment} className="space-y-4">
            <div className="p-4 border border-border/85 rounded-lg bg-secondary/15">
              <p className="text-xs text-muted-foreground font-semibold">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
              <p className="text-sm font-semibold mt-1">Instructions:</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedAssignment.instruction}</p>
              {selectedAssignment.attachmentUrl && (
                <div className="mt-3 p-3 border border-border/80 bg-background/50 rounded-lg flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">Reference Dataset / Material</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-xs">{selectedAssignment.attachmentUrl}</p>
                    </div>
                  </div>
                  <a
                    href={getAuthenticatedFileUrl(selectedAssignment.attachmentUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs text-primary hover:underline font-semibold shrink-0 ml-2"
                  >
                    Open <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {mySubmissions[selectedAssignment.id]?.status === 'GRADED' && (
              <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs">
                <span className="font-bold">Score: </span> {mySubmissions[selectedAssignment.id].grade}/100 <br />
                <span className="font-bold">Project Coordinator feedback: </span> {mySubmissions[selectedAssignment.id].feedback || 'No remarks provided.'}
              </div>
            )}

            {mySubmissions[selectedAssignment.id]?.status !== 'GRADED' && (
              <>
                {mySubmissions[selectedAssignment.id] && (
                  <div className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs flex items-center justify-between mb-4">
                    <div className="min-w-0 flex-1 text-left">
                      <span className="font-bold block mb-1">Attached Project File:</span>
                      <a
                        href={getAuthenticatedFileUrl(mySubmissions[selectedAssignment.id].fileUrl || '#')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-semibold break-all text-left"
                      >
                        {mySubmissions[selectedAssignment.id].fileName || 'View uploaded file'}
                      </a>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-7 px-2.5 rounded-lg flex items-center gap-1.5 shrink-0 ml-2"
                      onClick={() => {
                        setDeleteConfirm({
                          show: true,
                          title: 'Delete Uploaded File',
                          message: 'Are you sure you want to delete this uploaded project file? This will permanently delete the file record and physical file.',
                          onConfirm: async () => {
                            try {
                              await submissionService.delete(mySubmissions[selectedAssignment.id].id);
                              setMySubmissions(prev => {
                                const next = { ...prev };
                                delete next[selectedAssignment.id];
                                return next;
                              });
                              setSubmitFile('');
                              setSubmitFileName('');
                              toast.success('Project deleted successfully.');
                            } catch (err: any) {
                              toast.error(err.response?.data?.message || 'Failed to delete project.');
                            }
                          },
                        });
                      }}
                    >
                      Delete Project
                    </Button>
                  </div>
                )}

                <Textarea
                  label="Submission Text / Answers"
                  placeholder="Paste code snippet or answers here..."
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                />

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase text-left">Choose Submission File</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      onChange={handleAssignmentFileUpload}
                      className="text-xs text-muted-foreground border border-border rounded-lg p-2 flex-1"
                    />
                    {submitFileUploading && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
                  </div>
                  {submitFileName && (
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 p-2 rounded inline-block">
                      ✓ Attached: {submitFileName}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
                  <Button type="submit" disabled={submitFileUploading}>Submit Assignment</Button>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>

      {/* Modal: Quiz Assessment Overlay */}
      <Modal isOpen={!!activeQuiz} onClose={() => { setActiveQuiz(null); setQuizAnswers({}); setQuizResult(null); }} title="Interactive Quiz Portal">
        {activeQuiz && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-display text-muted-foreground">{activeQuiz.title}</h4>

            {quizResult ? (
              // Quiz Completed Screen
              <div className="p-6 border rounded-lg text-center space-y-4">
                <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${quizResult.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                  }`}>
                  {quizResult.passed ? <CheckCircle className="h-7 w-7" /> : <HelpCircle className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">
                    {quizResult.passed ? 'Assessments Passed!' : 'Assessments Failed'}
                  </h3>
                  <p className="text-2xl font-bold font-display mt-2">{quizResult.score}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Passing threshold is {activeQuiz.passingScore}%</p>
                </div>
                <Button onClick={() => { setActiveQuiz(null); setQuizAnswers({}); setQuizResult(null); }} className="w-full text-xs">
                  Done
                </Button>
              </div>
            ) : (
              // Quiz questionnaire screen
              <div className="space-y-6">
                {activeQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-semibold">Q{qIdx + 1}. {q.text}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary/30 transition-colors text-xs ${quizAnswers[q.id] === oIdx ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            className="mr-3 h-4 w-4 accent-primary"
                            checked={quizAnswers[q.id] === oIdx}
                            onChange={() => handleSelectQuizAnswer(q.id, oIdx)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
                  <Button variant="ghost" onClick={() => { setActiveQuiz(null); setQuizAnswers({}); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuiz}>
                    Submit Quiz
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: Project Registration Form */}
      <Modal isOpen={isRegModalOpen} onClose={() => { setIsRegModalOpen(false); setSelectedProjectToReg(null); }} title="Register for Project">
        {selectedProjectToReg && (
          <form onSubmit={handleRegSubmit} className="space-y-4">
            <div className="p-4 border border-border/80 bg-secondary/15 rounded-lg text-left">
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Project Selection</span>
              <h4 className="text-sm font-bold text-foreground mt-0.5">{selectedProjectToReg.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{selectedProjectToReg.description}</p>
            </div>

            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Domain</label>
              <select
                value={regDomain}
                onChange={(e) => setRegDomain(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                required
              >
                <option value="" disabled>Select your domain</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
              <Button variant="ghost" type="button" onClick={() => { setIsRegModalOpen(false); setSelectedProjectToReg(null); }}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Registration
              </Button>
            </div>
          </form>
        )}
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
    </div>
  );
};
