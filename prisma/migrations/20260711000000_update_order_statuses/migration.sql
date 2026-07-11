-- Step 1: Add new enum values (must be committed before use)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'NOT_STARTED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'DONE';
