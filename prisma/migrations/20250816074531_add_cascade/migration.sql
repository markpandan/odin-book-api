-- DropForeignKey
ALTER TABLE "public"."Follows" DROP CONSTRAINT "Follows_followedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Follows" ADD CONSTRAINT "Follows_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
