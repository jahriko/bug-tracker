-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "IssueActivity" DROP CONSTRAINT "IssueActivity_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_labelId_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "archivedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "archivedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueActivity" ADD CONSTRAINT "IssueActivity_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
