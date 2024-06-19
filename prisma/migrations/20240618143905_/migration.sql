/*
  Warnings:

  - You are about to drop the column `projectLeadId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectLeadId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectLeadId";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "leadId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "UserTeam" (
    "teamId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("teamId","userId")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
