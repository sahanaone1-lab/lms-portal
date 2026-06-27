import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(body: any): Promise<{
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
    login(body: any, res: any): Promise<{
        accessToken: string;
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
    logout(req: any, res: any): Promise<{
        message: string;
    }>;
    refresh(req: any, res: any): Promise<{
        accessToken: string;
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
}
