"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const lessons_module_1 = require("./lessons/lessons.module");
const assignments_module_1 = require("./assignments/assignments.module");
const submissions_module_1 = require("./submissions/submissions.module");
const quizzes_module_1 = require("./quizzes/quizzes.module");
const certificates_module_1 = require("./certificates/certificates.module");
const notifications_module_1 = require("./notifications/notifications.module");
const domains_module_1 = require("./domains/domains.module");
const projects_module_1 = require("./projects/projects.module");
const presentations_module_1 = require("./presentations/presentations.module");
const presentation_registrations_module_1 = require("./presentation-registrations/presentation-registrations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            assignments_module_1.AssignmentsModule,
            submissions_module_1.SubmissionsModule,
            quizzes_module_1.QuizzesModule,
            certificates_module_1.CertificatesModule,
            notifications_module_1.NotificationsModule,
            domains_module_1.DomainsModule,
            projects_module_1.ProjectsModule,
            presentations_module_1.PresentationsModule,
            presentation_registrations_module_1.PresentationRegistrationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map