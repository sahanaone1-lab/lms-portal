import { PrismaService } from '../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyCertificates(studentId: string): Promise<({
        id: string;
        certificateCode: string;
        studentId: string;
        courseId: string;
        issuedAt: Date;
        status: string;
        studentName: string;
        courseTitle: string;
    } | {
        id: any;
        certificateCode: string;
        studentId: any;
        courseId: any;
        issuedAt: null;
        status: string;
        studentName: any;
        courseTitle: any;
        requestDate: any;
    })[]>;
    claim(studentId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CertificateRequestStatus;
        courseId: string;
        studentId: string;
    }>;
    getDomainCertificateRequests(projectCoordinatorId: string): Promise<{
        id: any;
        studentId: any;
        studentName: any;
        studentEmployeeId: any;
        courseId: any;
        courseTitle: any;
        courseDomain: any;
        requestDate: any;
        status: string;
    }[]>;
    approveRequest(requestId: string): Promise<{
        course: {
            title: string;
        };
        student: {
            name: string;
        };
    } & {
        id: string;
        courseId: string;
        studentId: string;
        certificateCode: string;
        issuedAt: Date;
    }>;
    rejectRequest(requestId: string): Promise<{
        success: boolean;
    }>;
    getById(id: string): Promise<{
        course: {
            title: string;
        };
        student: {
            name: string;
        };
    } & {
        id: string;
        courseId: string;
        studentId: string;
        certificateCode: string;
        issuedAt: Date;
    }>;
}
