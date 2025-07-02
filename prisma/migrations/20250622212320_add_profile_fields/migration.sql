-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
