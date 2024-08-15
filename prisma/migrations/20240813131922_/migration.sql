-- DropIndex
DROP INDEX "Issue_archivedAt_idx";

-- DropIndex
DROP INDEX "Issue_projectId_assignedUserId_idx";

-- DropIndex
DROP INDEX "Project_archivedAt_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "DiscussionCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "DiscussionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionLike" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionPost" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" INTEGER,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiscussionPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionCategory_projectId_idx" ON "DiscussionCategory"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionCategory_projectId_name_key" ON "DiscussionCategory"("projectId", "name");

-- CreateIndex
CREATE INDEX "Discussion_projectId_createdAt_idx" ON "Discussion"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Discussion_projectId_isResolved_idx" ON "Discussion"("projectId", "isResolved");

-- CreateIndex
CREATE INDEX "Discussion_categoryId_idx" ON "Discussion"("categoryId");

-- CreateIndex
CREATE INDEX "Discussion_likeCount_idx" ON "Discussion"("likeCount");

-- CreateIndex
CREATE INDEX "DiscussionLike_discussionId_idx" ON "DiscussionLike"("discussionId");

-- CreateIndex
CREATE INDEX "DiscussionLike_userId_idx" ON "DiscussionLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionLike_discussionId_userId_key" ON "DiscussionLike"("discussionId", "userId");

-- CreateIndex
CREATE INDEX "DiscussionPost_discussionId_idx" ON "DiscussionPost"("discussionId");

-- CreateIndex
CREATE INDEX "DiscussionPost_parentId_idx" ON "DiscussionPost"("parentId");

-- CreateIndex
CREATE INDEX "Issue_projectId_assignedUserId_status_idx" ON "Issue"("projectId", "assignedUserId", "status");

-- CreateIndex
CREATE INDEX "Project_archivedAt_workspaceId_idx" ON "Project"("archivedAt", "workspaceId");

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");

-- AddForeignKey
ALTER TABLE "DiscussionCategory" ADD CONSTRAINT "DiscussionCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DiscussionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DiscussionPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
