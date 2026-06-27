import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(title: string, description: string, domain: string, projectCoordinatorId: string): Promise<{
        id: string;
        domain: string;
        title: string;
        description: string;
        projectCoordinatorId: string;
    }>;
    findAll(userId: string, role: Role, domain?: string): Promise<({
        registrations: ({
            intern: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            internId: string;
            projectId: string;
            registeredAt: Date;
        })[];
    } & {
        id: string;
        domain: string;
        title: string;
        description: string;
        projectCoordinatorId: string;
    })[] | {
        isRegistered: boolean;
        projectCoordinator: {
            email: string;
            name: string;
        };
        id: string;
        domain: string;
        title: string;
        description: string;
        projectCoordinatorId: string;
    }[]>;
    registerInterest(projectId: string, internId: string): Promise<{
        project: {
            id: string;
            domain: string;
            title: string;
            description: string;
            projectCoordinatorId: string;
        };
    } & {
        id: string;
        internId: string;
        projectId: string;
        registeredAt: Date;
    }>;
    remove(id: string, userId: string, role: Role): Promise<{
        success: boolean;
    }>;
}
