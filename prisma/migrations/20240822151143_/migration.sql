/*
  Warnings:

  - The primary key for the `Discussion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Discussion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `discussionId` on the `DiscussionLike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `discussionId` on the `DiscussionPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "DiscussionLike" DROP CONSTRAINT "DiscussionLike_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussionPost" DROP CONSTRAINT "DiscussionPost_discussionId_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DiscussionLike" DROP COLUMN "discussionId",
ADD COLUMN     "discussionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DiscussionPost" DROP COLUMN "discussionId",
ADD COLUMN     "discussionId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "DiscussionLike_discussionId_idx" ON "DiscussionLike"("discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionLike_discussionId_userId_key" ON "DiscussionLike"("discussionId", "userId");

-- CreateIndex
CREATE INDEX "DiscussionPost_discussionId_idx" ON "DiscussionPost"("discussionId");

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
