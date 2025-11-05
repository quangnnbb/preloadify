/*
  Warnings:

  - You are about to drop the column `languages` on the `StoreSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "cssLoader" SET DEFAULT 'pulseOrbit';

-- AlterTable
ALTER TABLE "StoreSettings" DROP COLUMN "languages",
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'english';
