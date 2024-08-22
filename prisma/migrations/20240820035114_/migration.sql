/*
  Warnings:

  - The primary key for the `Issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `IssueLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `issueId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `issueId` on the `IssueActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `issueId` on the `IssueLabel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueActivity" DROP CONSTRAINT "IssueActivity_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_issueId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "issueId",
ADD COLUMN     "issueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "IssueActivity" DROP COLUMN "issueId",
ADD COLUMN     "issueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_pkey",
DROP COLUMN "issueId",
ADD COLUMN     "issueId" INTEGER NOT NULL,
ADD CONSTRAINT "IssueLabel_pkey" PRIMARY KEY ("issueId", "labelId");

-- CreateIndex
CREATE INDEX "IssueActivity_issueId_createdAt_idx" ON "IssueActivity"("issueId", "createdAt");

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueActivity" ADD CONSTRAINT "IssueActivity_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
