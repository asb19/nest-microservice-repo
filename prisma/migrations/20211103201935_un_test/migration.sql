/*
  Warnings:

  - A unique constraint covering the columns `[unSlug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "unSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_unSlug_key" ON "Post"("unSlug");
