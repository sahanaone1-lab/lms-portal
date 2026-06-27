import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        read: boolean;
        userId: string;
    }[]>;
    markRead(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        read: boolean;
        userId: string;
    }>;
    markAllRead(req: any): Promise<{
        success: boolean;
    }>;
}
