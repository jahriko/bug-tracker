/*
  Warnings:

  - You are about to drop the column `likes` on the `Discussion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "DiscussionLike" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscussionLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionLike_discussionId_idx" ON "DiscussionLike"("discussionId");

-- CreateIndex
CREATE INDEX "DiscussionLike_userId_idx" ON "DiscussionLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionLike_discussionId_userId_key" ON "DiscussionLike"("discussionId", "userId");

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
