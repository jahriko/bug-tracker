/*
  Warnings:

  - You are about to drop the column `name` on the `PriorityActivity` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `StatusActivity` table. All the data in the column will be lost.
  - Added the required column `priorityName` to the `PriorityActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusName` to the `StatusActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriorityActivity" DROP COLUMN "name",
ADD COLUMN     "priorityName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StatusActivity" DROP COLUMN "name",
ADD COLUMN     "statusName" TEXT NOT NULL;
