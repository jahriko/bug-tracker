-- CreateTable
CREATE TABLE "ProjectActivity" (
    "id" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,

    CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_id_fkey" FOREIGN KEY ("id") REFERENCES "IssueActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
