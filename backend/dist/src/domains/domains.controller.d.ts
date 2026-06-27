import { DomainsService } from './domains.service';
export declare class DomainsController {
    private domainsService;
    constructor(domainsService: DomainsService);
    getAll(all?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
    }[]>;
    getStats(): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        projectCoordinatorsCount: number;
        internsCount: number;
    }[]>;
    create(body: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
    }>;
    update(id: string, body: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
    }>;
}
