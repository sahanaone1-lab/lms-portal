import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { CertificatesModule } from './certificates/certificates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DomainsModule } from './domains/domains.module';
import { ProjectsModule } from './projects/projects.module';
import { PresentationsModule } from './presentations/presentations.module';
import { PresentationRegistrationsModule } from './presentation-registrations/presentation-registrations.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    AssignmentsModule,
    SubmissionsModule,
    QuizzesModule,
    CertificatesModule,
    NotificationsModule,
    DomainsModule,
    ProjectsModule,
    PresentationsModule,
    PresentationRegistrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

