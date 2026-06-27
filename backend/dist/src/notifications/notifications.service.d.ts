import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        read: boolean;
        userId: string;
    }[]>;
    markRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        read: boolean;
        userId: string;
    }>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
}
