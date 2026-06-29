"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresentationRegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const PDFDocumentModule = __importStar(require("pdfkit"));
// Handle CommonJS / ESM interop
const PDFDocument = PDFDocumentModule.default ?? PDFDocumentModule;
let PresentationRegistrationsService = class PresentationRegistrationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, internId) {
        // Check presentation exists and is upcoming
        const presentation = await this.prisma.presentation.findUnique({
            where: { id: dto.presentationId },
            include: {
                coordinator: { select: { id: true, name: true } },
            },
        });
        if (!presentation || presentation.isDeleted) {
            throw new common_1.NotFoundException('Presentation not found');
        }
        if (presentation.status !== client_1.PresentationStatus.UPCOMING) {
            throw new common_1.BadRequestException('Registration is closed for this presentation');
        }
        // Check for duplicate registration
        const existing = await this.prisma.presentationRegistration.findUnique({
            where: {
                presentationId_internId: {
                    presentationId: dto.presentationId,
                    internId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already registered for this presentation');
        }
        const registration = await this.prisma.presentationRegistration.create({
            data: {
                presentationId: dto.presentationId,
                internId,
                fullName: dto.fullName,
                domain: dto.domain,
                collegeName: dto.collegeName,
                yearOfStudy: dto.yearOfStudy,
                internshipTiming: dto.internshipTiming,
                internshipStartDate: new Date(dto.internshipStartDate),
                internshipEndDate: new Date(dto.internshipEndDate),
                purpose: dto.purpose,
                projectsWorkedOn: dto.projectsWorkedOn,
                willingToAttend: dto.willingToAttend,
                qaQuestions: dto.qaQuestions,
                additionalRemarks: dto.additionalRemarks,
                internSignature: dto.internSignature,
            },
            include: {
                presentation: true,
                intern: { select: { id: true, name: true, email: true } },
            },
        });
        // Notify coordinator
        await this.prisma.notification
            .create({
            data: {
                userId: presentation.coordinatorId,
                title: 'New Presentation Registration',
                message: `Intern "${registration.intern.name}" has registered for "${presentation.title}".`,
                type: 'presentation_registration',
                entityId: registration.id,
            },
        })
            .catch(() => { });
        return registration;
    }
    async findAll(userId, role, filters) {
        const where = {};
        if (role === client_1.Role.PROJECT_COORDINATOR) {
            // Only show registrations for presentations created by this coordinator
            where.presentation = { coordinatorId: userId, isDeleted: false };
        }
        if (filters?.presentationId) {
            where.presentationId = filters.presentationId;
        }
        if (filters?.internId) {
            where.internId = filters.internId;
        }
        if (filters?.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            where.createdAt = { gte: startOfDay, lte: endOfDay };
        }
        return this.prisma.presentationRegistration.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                presentation: {
                    select: {
                        id: true,
                        title: true,
                        presentationDate: true,
                        presentationTime: true,
                        status: true,
                    },
                },
                intern: {
                    select: { id: true, name: true, email: true, domain: true },
                },
            },
        });
    }
    async findOne(id, userId, role) {
        const registration = await this.prisma.presentationRegistration.findUnique({
            where: { id },
            include: {
                presentation: {
                    include: {
                        coordinator: { select: { id: true, name: true, email: true } },
                    },
                },
                intern: { select: { id: true, name: true, email: true, domain: true } },
            },
        });
        if (!registration)
            throw new common_1.NotFoundException('Registration not found');
        if (role === client_1.Role.PROJECT_COORDINATOR &&
            registration.presentation.coordinatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return registration;
    }
    async update(id, dto, userId, role) {
        const registration = await this.prisma.presentationRegistration.findUnique({
            where: { id },
            include: {
                presentation: {
                    select: { coordinatorId: true, title: true },
                },
                intern: { select: { id: true, name: true } },
            },
        });
        if (!registration)
            throw new common_1.NotFoundException('Registration not found');
        if (role === client_1.Role.PROJECT_COORDINATOR &&
            registration.presentation.coordinatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const data = {};
        if (dto.status) {
            data.status = dto.status;
        }
        if (dto.coordinatorSignature !== undefined) {
            data.coordinatorSignature = dto.coordinatorSignature;
        }
        const updated = await this.prisma.presentationRegistration.update({
            where: { id },
            data,
            include: {
                presentation: {
                    select: { id: true, title: true },
                },
                intern: { select: { id: true, name: true } },
            },
        });
        // Notify intern on approval
        if (dto.status === client_1.PresentationRegistrationStatus.APPROVED) {
            await this.prisma.notification
                .create({
                data: {
                    userId: registration.intern.id,
                    title: 'Registration Approved',
                    message: `Your registration for "${registration.presentation.title}" has been approved!`,
                    type: 'presentation_approved',
                    entityId: registration.id,
                },
            })
                .catch(() => { });
        }
        if (dto.status === client_1.PresentationRegistrationStatus.REJECTED) {
            await this.prisma.notification
                .create({
                data: {
                    userId: registration.intern.id,
                    title: 'Registration Rejected',
                    message: `Your registration for "${registration.presentation.title}" has been rejected.`,
                    type: 'presentation_rejected',
                    entityId: registration.id,
                },
            })
                .catch(() => { });
        }
        return updated;
    }
    async generatePdf(id, userId, role) {
        if (role === client_1.Role.INTERN) {
            throw new common_1.ForbiddenException('Interns cannot download PDF reports');
        }
        const registration = await this.findOne(id, userId, role);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 60, right: 60 },
            });
            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            const primaryColor = '#0F4C81';
            const accentColor = '#17A2B8';
            const lightGray = '#f5f7fa';
            const textDark = '#1a1a2e';
            const textMid = '#4a4a6a';
            // ── Header Banner ────────────────────────────────────────────────────
            doc.rect(0, 0, doc.page.width, 110).fill(primaryColor);
            doc
                .fillColor('#ffffff')
                .fontSize(22)
                .font('Helvetica-Bold')
                .text('Career Solution', 60, 28);
            doc
                .fillColor('#cce8f4')
                .fontSize(10)
                .font('Helvetica')
                .text('Internship & Training Division', 60, 54);
            doc
                .fillColor('#ffffff')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Presentation Registration Report', 60, 76);
            // Status badge top-right
            const statusColor = registration.status === 'APPROVED'
                ? '#27ae60'
                : registration.status === 'REJECTED'
                    ? '#e74c3c'
                    : '#f39c12';
            doc
                .rect(doc.page.width - 140, 35, 90, 26)
                .fill(statusColor);
            doc
                .fillColor('#ffffff')
                .fontSize(10)
                .font('Helvetica-Bold')
                .text(registration.status, doc.page.width - 140, 43, {
                width: 90,
                align: 'center',
            });
            // ── Presentation Section ─────────────────────────────────────────────
            let y = 130;
            const sectionHeader = (title, yPos) => {
                doc
                    .rect(60, yPos, doc.page.width - 120, 26)
                    .fill(accentColor);
                doc
                    .fillColor('#ffffff')
                    .fontSize(11)
                    .font('Helvetica-Bold')
                    .text(title, 68, yPos + 7);
                return yPos + 36;
            };
            const field = (label, value, xL, xV, yPos, options) => {
                doc
                    .fillColor(textMid)
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text(label, xL, yPos, { width: xV - xL - 8 });
                doc
                    .fillColor(textDark)
                    .fontSize(9)
                    .font('Helvetica')
                    .text(value || '—', xV, yPos, {
                    width: doc.page.width - 120 - (xV - xL) + 60,
                    ...options,
                });
                const valueHeight = doc.heightOfString(value || '—', {
                    width: doc.page.width - 120 - (xV - xL) + 60,
                    ...options,
                });
                return yPos + Math.max(18, valueHeight + 6);
            };
            // Presentation Details
            y = sectionHeader('PRESENTATION DETAILS', y);
            y = field('Title', registration.presentation.title, 60, 220, y);
            y = field('Date', new Date(registration.presentation.presentationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), 60, 220, y);
            y = field('Time', registration.presentation.presentationTime, 60, 220, y);
            y = field('Coordinator', registration.presentation.coordinator?.name || '—', 60, 220, y);
            y += 10;
            // Personal Information
            y = sectionHeader('INTERN PERSONAL INFORMATION', y);
            y = field('Full Name', registration.fullName, 60, 220, y);
            y = field('Domain', registration.domain, 60, 220, y);
            y = field('College Name', registration.collegeName, 60, 220, y);
            y = field('Year of Study', registration.yearOfStudy, 60, 220, y);
            y += 10;
            // Internship Information
            y = sectionHeader('INTERNSHIP INFORMATION', y);
            y = field('Internship Timing', registration.internshipTiming, 60, 220, y);
            y = field('Start Date', new Date(registration.internshipStartDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }), 60, 220, y);
            y = field('End Date', new Date(registration.internshipEndDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }), 60, 220, y);
            y = field('Purpose', registration.purpose, 60, 220, y, {
                lineBreak: true,
            });
            y = field('Projects Worked On', registration.projectsWorkedOn, 60, 220, y, { lineBreak: true });
            y += 10;
            // Presentation & Q&A
            if (y > 650) {
                doc.addPage();
                y = 60;
            }
            y = sectionHeader('PRESENTATION & Q&A', y);
            y = field('Willing to Attend', registration.willingToAttend ? 'Yes' : 'No', 60, 220, y);
            y = field('Q&A Questions', registration.qaQuestions, 60, 220, y, {
                lineBreak: true,
            });
            if (registration.additionalRemarks) {
                y = field('Additional Remarks', registration.additionalRemarks, 60, 220, y, { lineBreak: true });
            }
            y += 10;
            // Signatures & Status
            if (y > 650) {
                doc.addPage();
                y = 60;
            }
            y = sectionHeader('SIGNATURES & APPROVAL', y);
            y = field('Intern Signature', registration.internSignature, 60, 220, y);
            y = field('Coordinator Signature', registration.coordinatorSignature || 'Pending', 60, 220, y);
            y = field('Approval Status', registration.status, 60, 220, y);
            y = field('Registration Date', new Date(registration.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }), 60, 220, y);
            // ── Footer ───────────────────────────────────────────────────────────
            const footerY = doc.page.height - 50;
            doc
                .rect(0, footerY - 10, doc.page.width, 60)
                .fill(lightGray);
            doc
                .fillColor(textMid)
                .fontSize(8)
                .font('Helvetica')
                .text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} · Career Solution Internship Division · Confidential`, 60, footerY, { align: 'center', width: doc.page.width - 120 });
            doc.end();
        });
    }
};
exports.PresentationRegistrationsService = PresentationRegistrationsService;
exports.PresentationRegistrationsService = PresentationRegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresentationRegistrationsService);
//# sourceMappingURL=presentation-registrations.service.js.map