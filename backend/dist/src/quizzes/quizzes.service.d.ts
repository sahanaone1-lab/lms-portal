import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class QuizzesService {
    private prisma;
    constructor(prisma: PrismaService);
    getByCourse(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        weekId: string | null;
        courseId: string;
        passingScore: number;
        timeLimit: number | null;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    create(courseId: string, title: string, passingScore: number, questions: any, userId: string, role: Role, timeLimit?: number, weekId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        weekId: string | null;
        courseId: string;
        passingScore: number;
        timeLimit: number | null;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(id: string, data: {
        title?: string;
        passingScore?: number;
        questions?: any;
        timeLimit?: number;
        weekId?: string;
    }, userId: string, role: Role): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        weekId: string | null;
        courseId: string;
        passingScore: number;
        timeLimit: number | null;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    delete(id: string, userId: string, role: Role): Promise<{
        success: boolean;
    }>;
    submitAnswers(quizId: string, studentId: string, answers: {
        questionId: string;
        selectedOption: number;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        score: number;
        passed: boolean;
        quizId: string;
    }>;
    getMyResults(studentId: string): Promise<({
        quiz: {
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        studentId: string;
        score: number;
        passed: boolean;
        quizId: string;
    })[]>;
}
