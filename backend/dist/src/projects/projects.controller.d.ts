import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, body: {
        title: string;
        description: string;
        domain: string;
    }): Promise<{
        id: string;
        domain: string;
        title: string;
        description: string;
        projectCoordinatorId: string;
    }>;
    findAll(req: any): Promise<({
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
    registerInterest(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
