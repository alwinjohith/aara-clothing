-- This migration was already applied to the database.
-- Creating this file to keep migration history in sync.

-- Add orderNumber column to Order table
ALTER TABLE "Order" ADD COLUMN "orderNumber" SERIAL;

-- Add price column to Product table
ALTER TABLE "Product" ADD COLUMN "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Add unique constraint on Customer.phone
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- Remove categoryId from Product (already done in database)
-- ALTER TABLE "Product" DROP COLUMN "categoryId";

-- Drop Category table (already done in database)
-- DROP TABLE "Category";
