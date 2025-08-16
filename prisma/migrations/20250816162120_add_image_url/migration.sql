/*
  Warnings:

  - Added the required column `url` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Images" ADD COLUMN     "url" TEXT NOT NULL;
