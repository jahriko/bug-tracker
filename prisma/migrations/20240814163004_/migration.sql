/*
  Warnings:

  - You are about to drop the column `color` on the `DiscussionCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscussionCategory" DROP COLUMN "color",
ADD COLUMN     "emoji" TEXT;
