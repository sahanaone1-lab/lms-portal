import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(name: string, email: string, role: Role, password?: string, domain?: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        domain: string | null;
        employeeId: string | null;
        username: string | null;
        phone: string | null;
        dob: Date | null;
        department: string | null;
        designation: string | null;
        collegeName: string | null;
        batch: string | null;
        mustChangePassword: boolean;
        isApproved: boolean;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(emailOrUsername: string, pass: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            domain: string | null;
            employeeId: string | null;
            username: string | null;
            phone: string | null;
            dob: Date | null;
            department: string | null;
            designation: string | null;
            collegeName: string | null;
            batch: string | null;
            mustChangePassword: boolean;
            isApproved: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            domain: string | null;
            employeeId: string | null;
            username: string | null;
            phone: string | null;
            dob: Date | null;
            department: string | null;
            designation: string | null;
            collegeName: string | null;
            batch: string | null;
            mustChangePassword: boolean;
            isApproved: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private generateTokens;
    private updateRefreshToken;
}
