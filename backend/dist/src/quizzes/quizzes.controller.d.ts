import { QuizzesService } from './quizzes.service';
export declare class QuizzesController {
    private quizzesService;
    constructor(quizzesService: QuizzesService);
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
    create(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        weekId: string | null;
        courseId: string;
        passingScore: number;
        timeLimit: number | null;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(id: string, req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        weekId: string | null;
        courseId: string;
        passingScore: number;
        timeLimit: number | null;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    submitAnswers(id: string, req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        score: number;
        passed: boolean;
        quizId: string;
    }>;
    getMyResults(req: any): Promise<({
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
