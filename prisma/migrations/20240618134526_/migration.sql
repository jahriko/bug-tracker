/*
  Warnings:

  - Changed the type of `action` on the `IssueLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IssueUpdateAction" AS ENUM ('STATUS_UPDATED', 'PRIORITY_UPDATED', 'ASSIGNEE_UPDATED', 'LABELS_UPDATED', 'COMMENT_ADDED');

-- AlterTable
ALTER TABLE "IssueLog" DROP COLUMN "action",
ADD COLUMN     "action" "IssueUpdateAction" NOT NULL;
