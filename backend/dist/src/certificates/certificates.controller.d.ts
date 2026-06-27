import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
    getMyCertificates(req: any): Promise<({
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
    claim(req: any, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CertificateRequestStatus;
        courseId: string;
        studentId: string;
    }>;
    getDomainCertificateRequests(req: any): Promise<{
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
    approveRequest(id: string): Promise<{
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
    rejectRequest(id: string): Promise<{
        success: boolean;
    }>;
    downloadPdf(id: string, res: any): Promise<void>;
}
