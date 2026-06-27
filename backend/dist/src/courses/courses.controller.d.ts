import { CoursesService } from './courses.service';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    getMyEnrolled(req: any): Promise<({
        projectCoordinator: {
            name: string;
        };
    } & {
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    })[]>;
    uploadBrochure(id: string, req: any, file: any): Promise<{
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }>;
    getMyCreated(req: any): Promise<{
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }[]>;
    getById(id: string, req: any): Promise<{
        projectCoordinator: {
            name: string;
        };
        lessons: {
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
        }[];
        assignments: {
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
        }[];
        quizzes: {
            id: string;
            createdAt: Date;
            title: string;
            weekId: string | null;
            courseId: string;
            passingScore: number;
            timeLimit: number | null;
            questions: import("@prisma/client/runtime/client").JsonValue;
        }[];
    } & {
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }>;
    getAll(req: any): Promise<({
        projectCoordinator: {
            name: string;
        };
    } & {
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    })[]>;
    create(req: any, body: any): Promise<{
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }>;
    update(id: string, req: any, body: any): Promise<{
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }>;
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    enroll(req: any, courseId: string): Promise<{
        id: string;
        courseId: string;
        studentId: string;
        enrolledAt: Date;
    }>;
    deleteBrochure(id: string, req: any): Promise<{
        id: string;
        domain: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        coverImage: string | null;
        projectCoordinatorId: string;
        weeks: import("@prisma/client/runtime/client").JsonValue | null;
        status: string | null;
        difficulty: string | null;
        duration: string | null;
        category: string | null;
        learningOutcomes: import("@prisma/client/runtime/client").JsonValue | null;
        brochureUrl: string | null;
        brochureName: string | null;
        brochureFileName: string | null;
        brochureMimeType: string | null;
        uploadedBy: string | null;
        uploadedAt: Date | null;
    }>;
}
export declare class PublicCoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    getDomainBrochures(): Promise<Record<string, {
        brochureUrl: string;
        brochureName: string;
    }>>;
}
