/*
  Warnings:

  - Added the required column `imageUrl` to the `MembershipTier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MembershipTier" ADD COLUMN     "imageUrl" TEXT NOT NULL;
