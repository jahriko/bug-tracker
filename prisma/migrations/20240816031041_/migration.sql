-- AlterTable
ALTER TABLE "DiscussionLike" ALTER COLUMN "id" SET DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "DiscussionLike_id_seq";
