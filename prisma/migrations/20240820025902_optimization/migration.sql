/*
  Warnings:

  - The values [PROJECT_MANAGER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Discussion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `IssueLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `workspaceId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'MEMBER');
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussionLike" DROP CONSTRAINT "DiscussionLike_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussionPost" DROP CONSTRAINT "DiscussionPost_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "IssueActivity" DROP CONSTRAINT "IssueActivity_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_issueId_fkey";

-- DropIndex
DROP INDEX "Comment_issueId_idx";

-- DropIndex
DROP INDEX "Discussion_likeCount_idx";

-- DropIndex
DROP INDEX "Discussion_projectId_createdAt_idx";

-- DropIndex
DROP INDEX "Discussion_projectId_isResolved_idx";

-- DropIndex
DROP INDEX "DiscussionPost_parentId_idx";

-- DropIndex
DROP INDEX "Issue_projectId_assignedUserId_status_idx";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "issueId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_pkey",
ADD COLUMN     "pinnedAt" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Discussion_id_seq";

-- AlterTable
ALTER TABLE "DiscussionLike" ALTER COLUMN "discussionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DiscussionPost" ALTER COLUMN "discussionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Issue_id_seq";

-- AlterTable
ALTER TABLE "IssueActivity" ALTER COLUMN "issueId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_pkey",
ALTER COLUMN "issueId" SET DATA TYPE TEXT,
ADD CONSTRAINT "IssueLabel_pkey" PRIMARY KEY ("issueId", "labelId");

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "workspaceId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Discussion_projectId_idx" ON "Discussion"("projectId");

-- CreateIndex
CREATE INDEX "Discussion_createdAt_idx" ON "Discussion"("createdAt");

-- CreateIndex
CREATE INDEX "Issue_status_idx" ON "Issue"("status");

-- CreateIndex
CREATE INDEX "Issue_priority_idx" ON "Issue"("priority");

-- CreateIndex
CREATE INDEX "Issue_createdAt_idx" ON "Issue"("createdAt");

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueActivity" ADD CONSTRAINT "IssueActivity_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
