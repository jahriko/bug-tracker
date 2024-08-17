/*
  Warnings:

  - You are about to drop the `DiscussionLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DiscussionLike" DROP CONSTRAINT "DiscussionLike_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussionLike" DROP CONSTRAINT "DiscussionLike_userId_fkey";

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "DiscussionLike";
