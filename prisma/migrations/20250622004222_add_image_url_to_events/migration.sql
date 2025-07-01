-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'cart';
