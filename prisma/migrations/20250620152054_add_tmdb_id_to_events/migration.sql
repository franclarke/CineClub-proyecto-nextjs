/*
  Warnings:

  - You are about to drop the column `spotifyUri` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "spotifyUri",
ADD COLUMN     "tmdbId" TEXT;
