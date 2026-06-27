"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async normalizeDomain(domain) {
        if (!domain)
            return undefined;
        let searchName = domain.trim();
        if (/^(gen\s*ai|generative\s*ai)$/i.test(searchName)) {
            searchName = 'Generative AI';
        }
        else if (/^(full\s*stack)$/i.test(searchName)) {
            searchName = 'Full Stack';
        }
        else if (/^(data\s*science)$/i.test(searchName)) {
            searchName = 'Data Science';
        }
        else if (/^(machine\s*learning)$/i.test(searchName)) {
            searchName = 'Machine Learning';
        }
        else if (/^(cyber\s*security)$/i.test(searchName)) {
            searchName = 'Cyber Security';
        }
        else if (/^(digital\s*marketing)$/i.test(searchName)) {
            searchName = 'Digital Marketing';
        }
        const activeDomain = await this.prisma.domain.findFirst({
            where: {
                name: {
                    equals: searchName,
                    mode: 'insensitive',
                },
            },
        });
        return activeDomain ? activeDomain.name : domain.trim();
    }
    get userSelect() {
        return {
            id: true,
            email: true,
            username: true,
            name: true,
            role: true,
            domain: true,
            phone: true,
            dob: true,
            department: true,
            designation: true,
            collegeName: true,
            batch: true,
            employeeId: true,
            mustChangePassword: true,
            isApproved: true,
            createdAt: true,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: this.userSelect,
        });
        if (!user)
            throw new common_1.NotFoundException('User profile not found');
        return user;
    }
    async updateProfile(userId, name, email, domain) {
        const existing = await this.prisma.user.findFirst({
            where: { email, NOT: { id: userId } },
        });
        if (existing)
            throw new common_1.BadRequestException('Email is already taken');
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const normalizedDomain = domain ? await this.normalizeDomain(domain) : undefined;
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                domain: currentUser?.role === client_1.Role.INTERN
                    ? (normalizedDomain || currentUser.domain || 'Full Stack')
                    : (currentUser?.role === client_1.Role.PROJECT_COORDINATOR ? currentUser.domain : null),
            },
            select: this.userSelect,
        });
    }
    async changePassword(userId, oldPass, newPass) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Incorrect current password');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\[\]{}|\\:;"'<>,.?/~`]).{8,}$/;
        if (!passwordRegex.test(newPass)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
        }
        const hashed = await bcrypt.hash(newPass, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                mustChangePassword: false,
            },
        });
    }
    async getAll() {
        return this.prisma.user.findMany({
            select: this.userSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
        const username = data.username || data.employeeId;
        if (username) {
            const existingUser = await this.prisma.user.findUnique({
                where: { username },
            });
            if (existingUser)
                throw new common_1.BadRequestException('Username / ID already registered');
        }
        if (data.employeeId) {
            const existingEmp = await this.prisma.user.findUnique({
                where: { employeeId: data.employeeId },
            });
            if (existingEmp)
                throw new common_1.BadRequestException('Employee ID / ID already registered');
        }
        let defaultPass = data.password;
        if (!defaultPass && data.dob) {
            defaultPass = typeof data.dob === 'string' ? data.dob : data.dob.toISOString().split('T')[0];
        }
        if (!defaultPass) {
            defaultPass = 'welcome123';
        }
        const hashed = await bcrypt.hash(defaultPass, 10);
        const dobDate = data.dob ? new Date(data.dob) : null;
        const normalizedDomain = data.domain ? await this.normalizeDomain(data.domain) : undefined;
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                username: username || null,
                role: data.role,
                domain: (data.role === client_1.Role.INTERN || data.role === client_1.Role.PROJECT_COORDINATOR) ? normalizedDomain || 'Full Stack' : null,
                password: hashed,
                employeeId: data.employeeId || null,
                phone: data.phone || null,
                dob: dobDate,
                department: data.department || null,
                designation: data.role === client_1.Role.PROJECT_COORDINATOR ? data.designation || null : null,
                collegeName: data.role === client_1.Role.INTERN ? data.collegeName || null : null,
                batch: data.role === client_1.Role.INTERN ? data.batch || null : null,
                mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : (data.role !== client_1.Role.ADMIN),
                isApproved: data.isApproved !== undefined ? data.isApproved : true,
            },
            select: this.userSelect,
        });
        if (user.role === client_1.Role.INTERN && user.domain) {
            await this.autoEnrollInternInDomainCourses(user.id, user.domain);
        }
        return user;
    }
    async bulkCreate(usersData) {
        const created = [];
        const errors = [];
        for (let idx = 0; idx < usersData.length; idx++) {
            const uData = usersData[idx];
            try {
                const result = await this.create({
                    name: uData.name || uData.fullName,
                    email: uData.email,
                    role: uData.role,
                    domain: uData.domain,
                    employeeId: uData.employeeId || uData.internId,
                    username: uData.employeeId || uData.internId,
                    phone: uData.phone || uData.phoneNumber,
                    dob: uData.dob || uData.dateOfBirth,
                    department: uData.department,
                    designation: uData.designation,
                    collegeName: uData.collegeName,
                    batch: uData.batch || uData.assignedBatch,
                    mustChangePassword: true,
                    isApproved: true,
                });
                created.push(result);
            }
            catch (err) {
                errors.push(`Row ${idx + 1} (${uData.email || 'No Email'}): ${err.message || 'Validation failed'}`);
            }
        }
        if (errors.length > 0 && created.length === 0) {
            throw new common_1.BadRequestException(`Failed to import users:\n${errors.join('\n')}`);
        }
        return { created, errors };
    }
    async update(id, data) {
        if (data.email) {
            const existing = await this.prisma.user.findFirst({
                where: { email: data.email, NOT: { id } },
            });
            if (existing)
                throw new common_1.BadRequestException('Email already registered');
        }
        if (data.username) {
            const existingUser = await this.prisma.user.findFirst({
                where: { username: data.username, NOT: { id } },
            });
            if (existingUser)
                throw new common_1.BadRequestException('Username already registered');
        }
        if (data.employeeId) {
            const existingEmp = await this.prisma.user.findFirst({
                where: { employeeId: data.employeeId, NOT: { id } },
            });
            if (existingEmp)
                throw new common_1.BadRequestException('Employee ID already registered');
        }
        const currentUser = await this.prisma.user.findUnique({ where: { id } });
        const nextRole = data.role ?? currentUser?.role;
        let domainVal = data.domain;
        if (nextRole !== client_1.Role.INTERN && nextRole !== client_1.Role.PROJECT_COORDINATOR) {
            domainVal = null;
        }
        else if (domainVal === undefined) {
            domainVal = currentUser?.domain || 'Full Stack';
        }
        else if (domainVal !== null) {
            domainVal = await this.normalizeDomain(domainVal);
        }
        const dobDate = data.dob ? new Date(data.dob) : (data.dob === null ? null : undefined);
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                domain: domainVal,
                dob: dobDate,
            },
            select: this.userSelect,
        });
        if (user.role === client_1.Role.INTERN && user.domain) {
            await this.autoEnrollInternInDomainCourses(user.id, user.domain);
        }
        return user;
    }
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
        return { success: true };
    }
    async getSystemStats() {
        const totalUsers = await this.prisma.user.count();
        const totalCourses = await this.prisma.course.count();
        const totalEnrollments = await this.prisma.enrollment.count();
        const certificates = await this.prisma.certificate.count();
        const completionRate = totalEnrollments > 0
            ? Math.round((certificates / totalEnrollments) * 100)
            : 0;
        return {
            totalUsers,
            totalCourses,
            totalEnrollments,
            completionRate: Math.min(completionRate, 100),
        };
    }
    async getInternsMonitoring(projectCoordinatorId) {
        const projectCoordinator = await this.prisma.user.findUnique({
            where: { id: projectCoordinatorId },
        });
        if (!projectCoordinator || projectCoordinator.role !== client_1.Role.PROJECT_COORDINATOR || !projectCoordinator.domain) {
            return [];
        }
        const domain = projectCoordinator.domain;
        const interns = await this.prisma.user.findMany({
            where: {
                role: client_1.Role.INTERN,
                domain: {
                    equals: domain,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                employeeId: true,
                domain: true,
                email: true,
                phone: true,
                collegeName: true,
                batch: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        course: {
                            include: {
                                lessons: true,
                                quizzes: true,
                                assignments: true,
                            },
                        },
                    },
                },
                quizResults: true,
                submissions: true,
                certificates: true,
            },
        });
        const progressList = await this.prisma.lessonProgress.findMany({
            where: { studentId: { in: interns.map((i) => i.id) } },
        });
        return interns.map((intern) => {
            const completedLessonIds = progressList
                .filter((p) => p.studentId === intern.id)
                .map((p) => p.lessonId);
            const coursesProgress = intern.enrollments.map((e) => {
                const course = e.course;
                const lessons = course.lessons;
                const quizzes = course.quizzes;
                const assignments = course.assignments;
                const totalItems = lessons.length + quizzes.length + assignments.length;
                let progressPercent = 0;
                if (totalItems > 0) {
                    const completedLessonsCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                    const passedQuizzesCount = quizzes.filter((q) => intern.quizResults.some((r) => r.quizId === q.id && r.passed)).length;
                    const submittedAssignmentsCount = assignments.filter((a) => intern.submissions.some((s) => s.assignmentId === a.id)).length;
                    const completedItems = completedLessonsCount +
                        passedQuizzesCount +
                        submittedAssignmentsCount;
                    progressPercent = Math.round((completedItems / totalItems) * 100);
                }
                const weeks = course.weeks || [];
                const weeksList = weeks.map((w) => {
                    const wLessons = lessons.filter((l) => l.weekId === w.id);
                    const wQuizzes = quizzes.filter((q) => q.weekId === w.id);
                    const wAssignments = assignments.filter((a) => a.weekId === w.id);
                    if (wLessons.length === 0 &&
                        wQuizzes.length === 0 &&
                        wAssignments.length === 0)
                        return { id: w.id, number: w.number, title: w.title, completed: true };
                    const allL = wLessons.every((l) => completedLessonIds.includes(l.id));
                    const allQ = wQuizzes.every((q) => intern.quizResults.some((r) => r.quizId === q.id && r.passed));
                    const allA = wAssignments.every((a) => intern.submissions.some((s) => s.assignmentId === a.id));
                    return {
                        id: w.id,
                        number: w.number,
                        title: w.title,
                        completed: allL && allQ && allA,
                    };
                });
                const completedWeeks = weeksList.filter((w) => w.completed).length;
                const hasCertificate = intern.certificates.some((c) => c.courseId === course.id);
                const certStatus = hasCertificate ? 'Issued' : 'Not Claimed';
                const quizResultsForCourse = intern.quizResults.filter((r) => quizzes.some((q) => q.id === r.quizId));
                const quizAverage = quizResultsForCourse.length > 0
                    ? Math.round(quizResultsForCourse.reduce((acc, curr) => acc + curr.score, 0) /
                        quizResultsForCourse.length)
                    : 0;
                const submittedAssignmentsCount = assignments.filter((a) => intern.submissions.some((s) => s.assignmentId === a.id)).length;
                return {
                    courseId: course.id,
                    courseTitle: course.title,
                    progressPercent,
                    modulesCompleted: `${completedWeeks}/${weeks.length}`,
                    modulesCompletedCount: completedWeeks,
                    totalModulesCount: weeks.length,
                    certStatus,
                    weeksList,
                    quizAverage,
                    totalAssignments: assignments.length,
                    assignmentsSubmitted: submittedAssignmentsCount,
                    attendance: progressPercent === 100 ? 95 : Math.max(75, Math.round(75 + progressPercent * 0.2)),
                };
            });
            const primaryCourse = coursesProgress[0] || {
                courseTitle: 'Not Enrolled',
                progressPercent: 0,
                modulesCompleted: '0/0',
                modulesCompletedCount: 0,
                totalModulesCount: 0,
                certStatus: 'Not Claimed',
            };
            const submissionDates = intern.submissions.map((s) => new Date(s.createdAt).getTime());
            const quizDates = intern.quizResults.map((q) => new Date(q.createdAt).getTime());
            const progressDates = progressList
                .filter((p) => p.studentId === intern.id)
                .map((p) => new Date(p.createdAt).getTime());
            const allDates = [
                ...submissionDates,
                ...quizDates,
                ...progressDates,
                new Date(intern.updatedAt).getTime()
            ];
            const maxTime = Math.max(...allDates);
            const lastActivity = new Date(maxTime).toISOString();
            return {
                id: intern.id,
                name: intern.name,
                employeeId: intern.employeeId || 'N/A',
                domain: intern.domain,
                email: intern.email,
                phone: intern.phone,
                collegeName: intern.collegeName,
                batch: intern.batch,
                progressPercent: primaryCourse.progressPercent,
                modulesCompleted: primaryCourse.modulesCompleted,
                modulesCompletedCount: primaryCourse.modulesCompletedCount,
                totalModulesCount: primaryCourse.totalModulesCount,
                certStatus: primaryCourse.certStatus,
                lastActivity,
                coursesProgress,
            };
        });
    }
    async autoEnrollInternInDomainCourses(studentId, domain) {
        const courses = await this.prisma.course.findMany({
            where: { domain },
        });
        for (const course of courses) {
            await this.prisma.enrollment.upsert({
                where: {
                    studentId_courseId: {
                        studentId,
                        courseId: course.id,
                    },
                },
                update: {},
                create: {
                    studentId,
                    courseId: course.id,
                },
            }).catch(() => { });
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map