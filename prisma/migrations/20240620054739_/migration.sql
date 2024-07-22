/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `CommentLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IssueLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWorkspace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Made the column `ownerId` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLog" DROP CONSTRAINT "CommentLog_issueLogId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLog" DROP CONSTRAINT "CommentLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_userId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLog" DROP CONSTRAINT "IssueLog_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLog" DROP CONSTRAINT "IssueLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_leadId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_ownerId_fkey";

-- DropIndex
DROP INDEX "Issue_deletedAt_userId_idx";

-- DropIndex
DROP INDEX "Project_deletedAt_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "createdAt",
DROP COLUMN "issueId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "deletedAt",
DROP COLUMN "isHidden",
DROP COLUMN "label",
DROP COLUMN "userId",
ADD COLUMN     "archivedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "issueId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "deletedAt",
DROP COLUMN "teamId",
ADD COLUMN     "archivedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "ownerId" SET NOT NULL;

-- DropTable
DROP TABLE "CommentLog";

-- DropTable
DROP TABLE "IssueLog";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "UserTeam";

-- DropTable
DROP TABLE "UserWorkspace";

-- DropEnum
DROP TYPE "IssueUpdateAction";

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "workspaceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("workspaceId","userId")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateTable
CREATE TABLE "IssueActivity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "issueActivity" TEXT NOT NULL,

    CONSTRAINT "IssueActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusActivity" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StatusActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorityActivity" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PriorityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleActivity" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "TitleActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssigneeActivity" (
    "id" INTEGER NOT NULL,
    "assignedUser" TEXT NOT NULL,

    CONSTRAINT "AssigneeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabelActivity" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "LabelActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Issue_archivedAt_ownerId_idx" ON "Issue"("archivedAt", "ownerId");

-- CreateIndex
CREATE INDEX "Project_archivedAt_idx" ON "Project"("archivedAt");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueActivity" ADD CONSTRAINT "IssueActivity_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueActivity" ADD CONSTRAINT "IssueActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusActivity" ADD CONSTRAINT "StatusActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityActivity" ADD CONSTRAINT "PriorityActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleActivity" ADD CONSTRAINT "TitleActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigneeActivity" ADD CONSTRAINT "AssigneeActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabelActivity" ADD CONSTRAINT "LabelActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
