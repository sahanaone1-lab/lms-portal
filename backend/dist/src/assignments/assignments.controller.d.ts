import { AssignmentsService } from './assignments.service';
export declare class AssignmentsController {
    private assignmentsService;
    constructor(assignmentsService: AssignmentsService);
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
    create(req: any, body: any): Promise<{
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
    update(id: string, req: any, body: any): Promise<{
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
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
