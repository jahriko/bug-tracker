/*
  Warnings:

  - The values [TODO] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AssigneeActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `DescriptionActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `IssueActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `LabelActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `PriorityActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `StatusActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TitleActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'DONE', 'CANCELLED');
ALTER TABLE "Issue" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Issue" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Issue" ALTER COLUMN "status" SET DEFAULT 'BACKLOG';
COMMIT;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "status" SET DEFAULT 'BACKLOG';

-- CreateIndex
CREATE UNIQUE INDEX "AssigneeActivity_id_key" ON "AssigneeActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DescriptionActivity_id_key" ON "DescriptionActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IssueActivity_id_key" ON "IssueActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LabelActivity_id_key" ON "LabelActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PriorityActivity_id_key" ON "PriorityActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StatusActivity_id_key" ON "StatusActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TitleActivity_id_key" ON "TitleActivity"("id");
