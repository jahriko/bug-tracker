/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PriorityActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StatusActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PriorityActivity_name_key" ON "PriorityActivity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StatusActivity_name_key" ON "StatusActivity"("name");
