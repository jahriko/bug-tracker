/*
  Warnings:

  - Added the required column `action` to the `LabelActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabelActivity" ADD COLUMN     "action" TEXT NOT NULL;
