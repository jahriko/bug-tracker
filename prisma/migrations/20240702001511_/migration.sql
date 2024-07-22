/*
  Warnings:

  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `DescriptionActivity` table. All the data in the column will be lost.
  - You are about to drop the column `labelId` on the `LabelActivity` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `DescriptionActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `IssueActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelName` to the `LabelActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropIndex
DROP INDEX "AssigneeActivity_id_key";

-- DropIndex
DROP INDEX "Comment_id_key";

-- DropIndex
DROP INDEX "DescriptionActivity_id_key";

-- DropIndex
DROP INDEX "Issue_archivedAt_ownerId_idx";

-- DropIndex
DROP INDEX "Issue_projectId_status_idx";

-- DropIndex
DROP INDEX "IssueActivity_id_key";

-- DropIndex
DROP INDEX "IssueActivity_issueId_userId_issueActivity_key";

-- DropIndex
DROP INDEX "LabelActivity_id_key";

-- DropIndex
DROP INDEX "PriorityActivity_id_key";

-- DropIndex
DROP INDEX "PriorityActivity_name_key";

-- DropIndex
DROP INDEX "StatusActivity_id_key";

-- DropIndex
DROP INDEX "StatusActivity_name_key";

-- DropIndex
DROP INDEX "TitleActivity_id_key";

-- AlterTable
CREATE SEQUENCE comment_id_seq;
ALTER TABLE "Comment" DROP COLUMN "text",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "issueId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('comment_id_seq');
ALTER SEQUENCE comment_id_seq OWNED BY "Comment"."id";

-- AlterTable
ALTER TABLE "DescriptionActivity" DROP COLUMN "description",
ADD COLUMN     "body" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "IssueActivity" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LabelActivity" DROP COLUMN "labelId",
ADD COLUMN     "labelName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CommentActivity" (
    "id" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_issueId_idx" ON "Comment"("issueId");

-- CreateIndex
CREATE INDEX "Issue_projectId_assigneeId_idx" ON "Issue"("projectId", "assigneeId");

-- CreateIndex
CREATE INDEX "Issue_archivedAt_idx" ON "Issue"("archivedAt");

-- CreateIndex
CREATE INDEX "IssueActivity_issueId_createdAt_idx" ON "IssueActivity"("issueId", "createdAt");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentActivity" ADD CONSTRAINT "CommentActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
