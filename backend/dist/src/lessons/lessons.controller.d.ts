import { LessonsService } from './lessons.service';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    getProgress(req: any): Promise<string[]>;
    toggleProgress(id: string, req: any, body: {
        completed: boolean;
    }): Promise<import("@prisma/client").Prisma.BatchPayload | {
        id: string;
        createdAt: Date;
        studentId: string;
        lessonId: string;
        completed: boolean;
        videoWatched: boolean;
    }>;
    getByCourse(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        duration: string | null;
        content: string;
        videoUrl: string | null;
        attachmentUrl: string | null;
        pdfResource: string | null;
        order: number;
        weekId: string | null;
        courseId: string;
    }[]>;
    create(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        duration: string | null;
        content: string;
        videoUrl: string | null;
        attachmentUrl: string | null;
        pdfResource: string | null;
        order: number;
        weekId: string | null;
        courseId: string;
    }>;
    update(id: string, req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        duration: string | null;
        content: string;
        videoUrl: string | null;
        attachmentUrl: string | null;
        pdfResource: string | null;
        order: number;
        weekId: string | null;
        courseId: string;
    }>;
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    suggestVideo(id: string): Promise<{
        videoUrl: string;
        title: string;
    }>;
}
