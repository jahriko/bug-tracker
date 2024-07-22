-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- DropIndex
DROP INDEX "ProjectMember_userId_key";

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
