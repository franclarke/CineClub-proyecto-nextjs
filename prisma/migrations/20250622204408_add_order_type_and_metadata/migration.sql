-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'cart';
