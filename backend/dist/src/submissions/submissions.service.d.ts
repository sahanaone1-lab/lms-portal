import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class SubmissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(assignmentId: string, studentId: string, submissionText?: string, fileUrl?: string): Promise<{
        id: string;
        isApproved: boolean;
        createdAt: Date;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        submissionText: string | null;
        fileUrl: string | null;
        grade: number | null;
        feedback: string | null;
        assignmentId: string;
        gradedAt: Date | null;
    }>;
    grade(submissionId: string, grade: number, feedback: string, projectCoordinatorId: string, role: Role, isApproved?: boolean): Promise<{
        id: string;
        isApproved: boolean;
        createdAt: Date;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        submissionText: string | null;
        fileUrl: string | null;
        grade: number | null;
        feedback: string | null;
        assignmentId: string;
        gradedAt: Date | null;
    }>;
    getByAssignment(assignmentId: string, userId: string, role: Role): Promise<({
        student: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        isApproved: boolean;
        createdAt: Date;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        submissionText: string | null;
        fileUrl: string | null;
        grade: number | null;
        feedback: string | null;
        assignmentId: string;
        gradedAt: Date | null;
    })[]>;
    getProjectCoordinatorSubmissions(projectCoordinatorId: string): Promise<{
        id: string;
        submissionText: string | null;
        fileUrl: string | null;
        grade: number | null;
        feedback: string | null;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        studentName: string;
        assignmentId: string;
        assignmentTitle: string;
        isApproved: boolean;
        createdAt: Date;
        gradedAt: Date | null;
    }[]>;
    getMySubmissions(studentId: string): Promise<({
        assignment: {
            title: string;
        };
    } & {
        id: string;
        isApproved: boolean;
        createdAt: Date;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        submissionText: string | null;
        fileUrl: string | null;
        grade: number | null;
        feedback: string | null;
        assignmentId: string;
        gradedAt: Date | null;
    })[]>;
}
