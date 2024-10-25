/*
  Warnings:

  - Changed the type of `deviceId` on the `Server` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Server_deviceId_key" ON "Server"("deviceId");
