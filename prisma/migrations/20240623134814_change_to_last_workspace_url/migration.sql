/*
  Warnings:

  - You are about to drop the column `lastWorkspace` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastWorkspace",
ADD COLUMN     "lastWorkspaceUrl" TEXT;
