import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getByCourse(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        attachmentUrl: string | null;
        weekId: string | null;
        courseId: string;
        instruction: string;
        dueDate: Date;
        maxMarks: number | null;
        submissionType: string | null;
        submissionRules: string | null;
    }[]>;
    create(courseId: string, title: string, instruction: string, dueDate: Date, userId: string, role: Role, attachmentUrl?: string, weekId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        attachmentUrl: string | null;
        weekId: string | null;
        courseId: string;
        instruction: string;
        dueDate: Date;
        maxMarks: number | null;
        submissionType: string | null;
        submissionRules: string | null;
    }>;
    update(id: string, data: {
        title?: string;
        instruction?: string;
        dueDate?: Date;
        weekId?: string;
    }, userId: string, role: Role): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        attachmentUrl: string | null;
        weekId: string | null;
        courseId: string;
        instruction: string;
        dueDate: Date;
        maxMarks: number | null;
        submissionType: string | null;
        submissionRules: string | null;
    }>;
    delete(id: string, userId: string, role: Role): Promise<{
        success: boolean;
    }>;
}
