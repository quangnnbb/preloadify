-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "cssLoader" TEXT NOT NULL DEFAULT 'spinner',
    "background" TEXT NOT NULL DEFAULT '#ffffff',
    "primary" TEXT NOT NULL DEFAULT '#000000',
    "secondary" TEXT NOT NULL DEFAULT '#ffffff',
    "animationSpeed" TEXT NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
