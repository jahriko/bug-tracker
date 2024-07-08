/*
  Warnings:

  - The `status` column on the `Issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[issueId,userId,issueActivity]` on the table `IssueActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NO_PRIORITY', 'HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'TODO',
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NO_PRIORITY';

-- CreateTable
CREATE TABLE "DescriptionActivity" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "DescriptionActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Issue_projectId_status_idx" ON "Issue"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "IssueActivity_issueId_userId_issueActivity_key" ON "IssueActivity"("issueId", "userId", "issueActivity");

-- AddForeignKey
ALTER TABLE "DescriptionActivity" ADD CONSTRAINT "DescriptionActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
