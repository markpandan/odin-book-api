-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
