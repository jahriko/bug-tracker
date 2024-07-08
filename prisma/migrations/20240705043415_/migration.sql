/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `IssueActivity` table. All the data in the column will be lost.
  - You are about to drop the `AssigneeActivity` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `labelColor` to the `LabelActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssigneeActivity" DROP CONSTRAINT "AssigneeActivity_id_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- DropIndex
DROP INDEX "Issue_projectId_assigneeId_idx";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "assigneeId",
ADD COLUMN     "assignedUserId" TEXT;

-- AlterTable
ALTER TABLE "IssueActivity" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "LabelActivity" ADD COLUMN     "labelColor" TEXT NOT NULL;

-- DropTable
DROP TABLE "AssigneeActivity";

-- CreateTable
CREATE TABLE "AssignedActivity" (
    "id" INTEGER NOT NULL,
    "assignedUsername" TEXT NOT NULL,
    "assignedUserImage" TEXT NOT NULL,

    CONSTRAINT "AssignedActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Issue_projectId_assignedUserId_idx" ON "Issue"("projectId", "assignedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedActivity" ADD CONSTRAINT "AssignedActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
