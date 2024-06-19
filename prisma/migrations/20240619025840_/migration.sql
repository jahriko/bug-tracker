-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_userId_fkey";

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Issue_deletedAt_userId_idx" ON "Issue"("deletedAt", "userId");

-- CreateIndex
CREATE INDEX "Project_deletedAt_idx" ON "Project"("deletedAt");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
