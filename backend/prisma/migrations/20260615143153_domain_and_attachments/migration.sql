-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "attachmentUrl" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT 'Full Stack';

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "attachmentUrl" TEXT;
