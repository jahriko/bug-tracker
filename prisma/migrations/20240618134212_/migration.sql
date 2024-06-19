/*
  Warnings:

  - You are about to drop the column `newValue` on the `IssueLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `IssueLog` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_workspaceId_fkey";

-- AlterTable
ALTER TABLE "IssueLog" DROP COLUMN "newValue",
DROP COLUMN "oldValue",
ADD COLUMN     "value" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "ownerId" TEXT;

-- CreateTable
CREATE TABLE "UserWorkspace" (
    "workspaceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',

    CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY ("workspaceId","userId")
);

-- CreateTable
CREATE TABLE "CommentLog" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueLogId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLog" ADD CONSTRAINT "CommentLog_issueLogId_fkey" FOREIGN KEY ("issueLogId") REFERENCES "IssueLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLog" ADD CONSTRAINT "CommentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
