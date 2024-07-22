/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_userId_key" ON "ProjectMember"("userId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "ProjectMember"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
