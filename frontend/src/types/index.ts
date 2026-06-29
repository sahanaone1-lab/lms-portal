export type Role = 'ADMIN' | 'PROJECT_COORDINATOR' | 'INTERN';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  domain?: string;
  employeeId?: string;
  phone?: string;
  dob?: string;
  department?: string;
  designation?: string;
  collegeName?: string;
  batch?: string;
  mustChangePassword?: boolean;
  isApproved?: boolean;
  createdAt: string;
}

export interface CourseWeek {
  id: string;
  number: number;
  title: string;
  type?: 'Study' | 'Project';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  domain?: string;
  coverImage?: string;
  projectCoordinatorId: string;
  projectCoordinatorName?: string;
  lessons?: Lesson[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
  createdAt: string;
  updatedAt: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  learningOutcomes?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  weeks?: CourseWeek[];
  brochureUrl?: string;
  brochureName?: string;
  brochureFileName?: string;
  brochureMimeType?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  attachmentUrl?: string;
  pdfResource?: string;
  duration?: string;
  order: number;
  courseId: string;
  weekId?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  instruction: string;
  attachmentUrl?: string;
  dueDate: string;
  courseId: string;
  weekId?: string;
  maxMarks?: number;
  submissionType?: 'File Upload' | 'Text Entry' | 'External Link';
  submissionRules?: string;
  createdAt: string;
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
  grade?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED';
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  courseId?: string;
  courseName?: string;
  courseDomain?: string;
  moduleId?: string;
  moduleName?: string;
  projectFileName?: string;
  assignmentId: string;
  assignmentTitle?: string;
  assignmentInstruction?: string;
  createdAt: string;
  gradedAt?: string;
  isApproved?: boolean;
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projectCoordinatorsCount?: number;
  internsCount?: number;
}

export interface Question {
  id: string;
  text: string;
  type?: 'MCQ' | 'TF' | 'MS';
  options: string[];
  correctOption?: number; // Index 0..3 for MCQ/TF
  correctOptions?: number[]; // Indices for Multiple Select (MS)
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number; // percentage, e.g. 70
  timeLimit?: number; // in minutes
  courseId: string;
  weekId?: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  score: number;
  passed: boolean;
  studentId: string;
  quizId: string;
  quizTitle?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  studentId: string;
  studentName?: string;
  studentEmployeeId?: string;
  courseId: string;
  courseTitle?: string;
  courseDomain?: string;
  issuedAt?: string;
  requestDate?: string;
  status?: 'Pending Approval' | 'Approved' | 'Rejected';
  projectCoordinatorId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  entityId?: string;
  type?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  projectCoordinatorId: string;
  domain: string;
  isRegistered?: boolean;
  projectCoordinator?: {
    name: string;
    email: string;
  };
  registrations?: ProjectRegistration[];
}

export interface ProjectRegistration {
  id: string;
  projectId: string;
  internId: string;
  registeredAt: string;
  project?: Project;
  intern?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  presentationDate: string;
  presentationTime: string;
  status: 'UPCOMING' | 'CLOSED';
  coordinatorId: string;
  coordinator?: {
    id: string;
    name: string;
    email: string;
  };
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { registrations: number };
  registrations?: PresentationRegistrationRecord[];
}

export interface PresentationRegistrationRecord {
  id: string;
  presentationId: string;
  presentation?: Presentation;
  internId: string;
  intern?: {
    id: string;
    name: string;
    email: string;
    domain?: string;
  };
  fullName: string;
  domain: string;
  collegeName: string;
  yearOfStudy: string;
  internshipTiming: string;
  internshipStartDate: string;
  internshipEndDate: string;
  purpose: string;
  projectsWorkedOn: string;
  willingToAttend: boolean;
  qaQuestions: string;
  additionalRemarks?: string;
  internSignature: string;
  coordinatorSignature?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

