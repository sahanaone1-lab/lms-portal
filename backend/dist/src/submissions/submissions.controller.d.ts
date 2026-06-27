import { SubmissionsService } from './submissions.service';
export declare class SubmissionsController {
    private submissionsService;
    constructor(submissionsService: SubmissionsService);
    submit(req: any, body: any): Promise<{
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
    uploadFile(file: any): {
        fileUrl: string;
        originalName: any;
    };
    grade(id: string, req: any, body: any): Promise<{
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
    getByAssignment(assignmentId: string, req: any): Promise<({
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
    getProjectCoordinatorSubmissions(req: any): Promise<{
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
    getMySubmissions(req: any): Promise<({
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
