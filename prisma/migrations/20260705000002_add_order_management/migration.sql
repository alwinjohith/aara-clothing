-- AlterEnum
ALTER TYPE "OrderStatus" RENAME VALUE 'DELIVERED' TO 'COMPLETED';

-- AlterTable: Product
ALTER TABLE "Product" ADD COLUMN "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable: Order
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "notes" TEXT;

-- Backfill order numbers (sequential ORD-XXXXX format)
DO $$
DECLARE
  rec RECORD;
  counter INT := 1;
BEGIN
  FOR rec IN SELECT "id" FROM "Order" ORDER BY "createdAt" LOOP
    UPDATE "Order" SET "orderNumber" = 'ORD-' || LPAD(counter::text, 5, '0') WHERE "id" = rec."id";
    counter := counter + 1;
  END LOOP;
END $$;

-- Make orderNumber NOT NULL and UNIQUE after backfill
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
