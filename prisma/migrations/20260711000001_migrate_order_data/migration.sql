-- Migrate existing data to new statuses
UPDATE "Order" SET "status" = 'NOT_STARTED' WHERE "status" = 'PENDING';
UPDATE "Order" SET "status" = 'DONE' WHERE "status" = 'DELIVERED';

-- Remove old enum values by recreating the enum
-- Step 1: Create new enum type
CREATE TYPE "OrderStatus_new" AS ENUM ('NOT_STARTED', 'PROCESSING', 'DONE');

-- Step 2: Update column to use new type
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING "status"::text::"OrderStatus_new";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- Step 3: Drop old enum type
DROP TYPE "OrderStatus";

-- Step 4: Rename new type
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
