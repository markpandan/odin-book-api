-- DropForeignKey
ALTER TABLE "public"."Images" DROP CONSTRAINT "Images_postId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Images" ADD CONSTRAINT "Images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
