import { PrismaService } from '../prisma/prisma.service';
export declare class DomainsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(all?: boolean): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
    }[]>;
    create(name: string, description?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
    }>;
    update(id: string, data: {
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
}
