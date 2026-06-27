-- AlterEnum
ALTER TYPE "Role" RENAME VALUE 'INSTRUCTOR' TO 'PROJECT_COORDINATOR';

-- Rename Column instructor_id to project_coordinator_id in courses
ALTER TABLE "courses" RENAME COLUMN "instructor_id" TO "project_coordinator_id";

-- Rename Column instructor_id to project_coordinator_id in projects
ALTER TABLE "projects" RENAME COLUMN "instructor_id" TO "project_coordinator_id";

-- Rename foreign key constraints
ALTER TABLE "courses" RENAME CONSTRAINT "courses_instructor_id_fkey" TO "courses_project_coordinator_id_fkey";
ALTER TABLE "projects" RENAME CONSTRAINT "projects_instructor_id_fkey" TO "projects_project_coordinator_id_fkey";
