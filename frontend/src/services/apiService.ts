/**
 * apiService.ts
 * All data operations go through the real NestJS backend via HTTP.
 * No localStorage mock — all data is persisted in PostgreSQL.
 */
import { api } from './api';
import { User, Course, Lesson, Assignment, Submission, Quiz, QuizResult, Certificate, Notification, Role, Domain, Project, ProjectRegistration } from '../types';

// ---------------------------------------------------------------------------
// Auth (profile only — login/logout/register live in AuthContext)
// ---------------------------------------------------------------------------
export const authService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  updateProfile: async (data: { name: string; email: string; domain?: string }): Promise<User> => {
    const res = await api.patch('/users/profile', data);
    return res.data;
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const res = await api.patch('/users/change-password', { oldPassword, newPassword });
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get('/users');
    return res.data;
  },

  create: async (data: {
    name: string;
    email: string;
    role: Role;
    password?: string;
    domain?: string;
    employeeId?: string;
    username?: string;
    phone?: string;
    dob?: string;
    department?: string;
    designation?: string;
    collegeName?: string;
    batch?: string;
    mustChangePassword?: boolean;
    isApproved?: boolean;
  }): Promise<User> => {
    const res = await api.post('/users', data);
    return res.data;
  },

  bulkCreate: async (users: any[]): Promise<{ created: User[]; errors: string[] }> => {
    const res = await api.post('/users/bulk', { users });
    return res.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  getSystemStats: async () => {
    const res = await api.get('/users/stats');
    return res.data;
  },

  getInternsMonitoring: async (allDomains = false): Promise<any[]> => {
    const res = await api.get(`/users/interns-monitoring${allDomains ? '?all=true' : ''}`);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const res = await api.get('/courses');
    return res.data;
  },

  getById: async (id: string): Promise<Course> => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  create: async (data: Partial<Course>): Promise<Course> => {
    const res = await api.post('/courses', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Course>): Promise<Course> => {
    const res = await api.patch(`/courses/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },

  enroll: async (courseId: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/courses/${courseId}/enroll`);
    return res.data;
  },

  getMyEnrolled: async (): Promise<Course[]> => {
    const res = await api.get('/courses/enrolled');
    return res.data;
  },

  getMyCreated: async (): Promise<Course[]> => {
    const res = await api.get('/courses/created');
    return res.data;
  },

  uploadBrochure: async (id: string, file: File, onProgress?: (percent: number) => void): Promise<Course> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/courses/${id}/brochure`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return res.data;
  },

  deleteBrochure: async (id: string): Promise<Course> => {
    const res = await api.delete(`/courses/${id}/brochure`);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------
export const lessonService = {
  getByCourse: async (courseId: string): Promise<Lesson[]> => {
    const res = await api.get(`/lessons/course/${courseId}`);
    return res.data;
  },

  create: async (data: Partial<Lesson>): Promise<Lesson> => {
    const res = await api.post('/lessons', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Lesson>): Promise<Lesson> => {
    const res = await api.patch(`/lessons/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/lessons/${id}`);
    return res.data;
  },

  getProgress: async (): Promise<string[]> => {
    const res = await api.get('/lessons/progress');
    return res.data;
  },

  toggleProgress: async (lessonId: string, completed: boolean): Promise<any> => {
    const res = await api.post(`/lessons/${lessonId}/progress`, { completed });
    return res.data;
  },

  suggestReplacement: async (lessonId: string): Promise<{ videoUrl: string; title: string }> => {
    const res = await api.get(`/lessons/${lessonId}/suggest-video`);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------
export const assignmentService = {
  getByCourse: async (courseId: string): Promise<Assignment[]> => {
    const res = await api.get(`/assignments/course/${courseId}`);
    return res.data;
  },

  create: async (data: Partial<Assignment>): Promise<Assignment> => {
    const res = await api.post('/assignments', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
    const res = await api.patch(`/assignments/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/assignments/${id}`);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------
export const submissionService = {
  getByAssignment: async (assignmentId: string): Promise<Submission[]> => {
    const res = await api.get(`/submissions/assignment/${assignmentId}`);
    return res.data;
  },

  getProjectCoordinatorSubmissions: async (): Promise<Submission[]> => {
    const res = await api.get('/submissions/project-coordinator');
    return res.data;
  },

  getMySubmissions: async (): Promise<Submission[]> => {
    const res = await api.get('/submissions/my');
    return res.data;
  },

  submit: async (
    assignmentId: string,
    data: { submissionText?: string; fileUrl?: string; fileName?: string },
  ): Promise<Submission> => {
    const res = await api.post('/submissions', { assignmentId, ...data });
    return res.data;
  },

  grade: async (
    id: string,
    data: { grade: number; feedback: string; isApproved?: boolean },
  ): Promise<Submission> => {
    const res = await api.patch(`/submissions/${id}/grade`, data);
    return res.data;
  },

  upload: async (file: File, assignmentId: string): Promise<{ fileUrl: string; originalName: string; submission: Submission }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    const res = await api.post('/submissions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/submissions/${id}`);
    return res.data;
  },
};// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------
export const quizService = {
  getByCourse: async (courseId: string): Promise<Quiz[]> => {
    const res = await api.get(`/quizzes/course/${courseId}`);
    return res.data;
  },

  create: async (data: Partial<Quiz>): Promise<Quiz> => {
    const res = await api.post('/quizzes', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
    const res = await api.patch(`/quizzes/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/quizzes/${id}`);
    return res.data;
  },

  submitAnswers: async (
    id: string,
    answers: { questionId: string; selectedOption: number }[],
  ): Promise<QuizResult> => {
    const res = await api.post(`/quizzes/${id}/submit`, { answers });
    return res.data;
  },

  getMyResults: async (): Promise<QuizResult[]> => {
    const res = await api.get('/quizzes/results/my');
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export const certificateService = {
  getMyCertificates: async (): Promise<Certificate[]> => {
    const res = await api.get('/certificates/my');
    return res.data;
  },

  claim: async (courseId: string): Promise<Certificate> => {
    const res = await api.post(`/certificates/claim/${courseId}`);
    return res.data;
  },

  getProjectCoordinatorRequests: async (): Promise<any[]> => {
    const res = await api.get('/certificates/requests');
    return res.data;
  },

  approve: async (id: string): Promise<any> => {
    const res = await api.post(`/certificates/approve/${id}`);
    return res.data;
  },

  reject: async (id: string): Promise<any> => {
    const res = await api.post(`/certificates/reject/${id}`);
    return res.data;
  },

  downloadPdfUrl: (id: string): string => {
    return `http://localhost:3000/certificates/${id}/pdf`;
  },
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get('/notifications');
    return res.data;
  },

  markRead: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: async (): Promise<{ success: boolean }> => {
    const res = await api.post('/notifications/read-all');
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Domains
// ---------------------------------------------------------------------------
export const domainService = {
  getAll: async (all = false): Promise<Domain[]> => {
    const res = await api.get('/domains', { params: { all } });
    return res.data;
  },

  getStats: async (): Promise<Domain[]> => {
    const res = await api.get('/domains/stats');
    return res.data;
  },

  create: async (data: { name: string; description?: string }): Promise<Domain> => {
    const res = await api.post('/domains', data);
    return res.data;
  },

  update: async (
    id: string,
    data: { name?: string; description?: string; isActive?: boolean },
  ): Promise<Domain> => {
    const res = await api.patch(`/domains/${id}`, data);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data;
  },

  create: async (data: { title: string; description: string; domain: string }): Promise<Project> => {
    const res = await api.post('/projects', data);
    return res.data;
  },

  register: async (projectId: string): Promise<ProjectRegistration> => {
    const res = await api.post(`/projects/${projectId}/register`);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};
