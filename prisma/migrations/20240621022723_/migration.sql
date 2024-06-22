/*
  Warnings:

  - You are about to drop the column `color` on the `LabelActivity` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LabelActivity` table. All the data in the column will be lost.
  - Added the required column `labelId` to the `LabelActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LabelActivity" DROP COLUMN "color",
DROP COLUMN "name",
ADD COLUMN     "labelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
