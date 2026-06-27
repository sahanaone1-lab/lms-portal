import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { YoutubeService } from './youtube.service';
export declare class LessonsService {
    private prisma;
    private youtubeService;
    constructor(prisma: PrismaService, youtubeService: YoutubeService);
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
    create(courseId: string, title: string, content: string, videoUrl: string | undefined, order: number, userId: string, role: Role, attachmentUrl?: string, pdfResource?: string, duration?: string, weekId?: string): Promise<{
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
    update(id: string, data: {
        title?: string;
        content?: string;
        videoUrl?: string;
        pdfResource?: string;
        duration?: string;
        weekId?: string;
        order?: number;
    }, userId: string, role: Role): Promise<{
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
    delete(id: string, userId: string, role: Role): Promise<{
        success: boolean;
    }>;
    toggleProgress(lessonId: string, studentId: string, completed: boolean): Promise<import("@prisma/client").Prisma.BatchPayload | {
        id: string;
        createdAt: Date;
        studentId: string;
        lessonId: string;
        completed: boolean;
        videoWatched: boolean;
    }>;
    getProgress(studentId: string): Promise<string[]>;
    suggestReplacement(id: string): Promise<{
        videoUrl: string;
        title: string;
    }>;
}
