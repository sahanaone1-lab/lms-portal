import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get('my')
  @Roles(Role.INTERN)
  getMyCertificates(@Req() req: any) {
    return this.certificatesService.getMyCertificates(req.user.id);
  }

  @Post('claim/:courseId')
  @Roles(Role.INTERN)
  claim(@Req() req: any, @Param('courseId') courseId: string) {
    return this.certificatesService.claim(req.user.id, courseId);
  }

  @Get('requests')
  @Roles(Role.PROJECT_COORDINATOR)
  getDomainCertificateRequests(@Req() req: any) {
    return this.certificatesService.getDomainCertificateRequests(req.user.id);
  }

  @Post('approve/:id')
  @Roles(Role.PROJECT_COORDINATOR)
  approveRequest(@Param('id') id: string) {
    return this.certificatesService.approveRequest(id);
  }

  @Post('reject/:id')
  @Roles(Role.PROJECT_COORDINATOR)
  rejectRequest(@Param('id') id: string) {
    return this.certificatesService.rejectRequest(id);
  }

  // PDF Download Mock
  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: any) {
    try {
      const cert = await this.certificatesService.getById(id);

      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8fafc; color: #1e293b; }
              .certificate { border: 10px double #e2e8f0; padding: 40px; background-color: white; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              h1 { font-size: 32px; color: #7c3aed; margin-bottom: 5px; }
              h2 { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 30px; }
              p { font-size: 16px; margin: 15px 0; }
              .name { font-size: 24px; font-weight: bold; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 5px; margin: 10px 0 20px; }
              .code { font-family: monospace; font-size: 12px; color: #94a3b8; margin-top: 45px; }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>ELEVATE ACADEMY</h1>
              <h2>Certificate of Course Completion</h2>
              <p>This document proudly certifies that</p>
              <div class="name">${cert.student.name}</div>
              <p>has successfully met all instructional criteria and completed the learning course</p>
              <p style="font-weight: bold; font-size: 18px; color: #1e293b;">${cert.course.title}</p>
              <p>on this day, ${new Date(cert.issuedAt).toLocaleDateString()}</p>
              <div class="code">Verification ID: ${cert.certificateCode}</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      res.status(404).send('Certificate not found');
    }
  }
}
