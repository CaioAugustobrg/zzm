/*
  Warnings:

  - You are about to drop the column `proxyId` on the `RedditAccount` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `SnapchatAccount` table. All the data in the column will be lost.
  - You are about to drop the column `hourAdds` on the `SnapchatAccount` table. All the data in the column will be lost.
  - You are about to drop the column `proxyId` on the `SnapchatAccount` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `TwitterAccount` table. All the data in the column will be lost.
  - You are about to drop the column `proxyId` on the `TwitterAccount` table. All the data in the column will be lost.
  - You are about to drop the column `totalDms` on the `TwitterAccount` table. All the data in the column will be lost.
  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `SnapchatAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `TwitterAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RedditAccount" DROP COLUMN "proxyId",
ALTER COLUMN "proxy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SnapchatAccount" DROP COLUMN "creationDate",
DROP COLUMN "hourAdds",
DROP COLUMN "proxyId",
ADD COLUMN     "acceptedFriends" INTEGER,
ADD COLUMN     "accessCode" VARCHAR(100),
ADD COLUMN     "dailyNotes" TEXT,
ADD COLUMN     "hourAds" INTEGER,
ADD COLUMN     "pendingAds" INTEGER,
ADD COLUMN     "proxy" TEXT,
ADD COLUMN     "proxyExpDate" DATE;

-- AlterTable
ALTER TABLE "TwitterAccount" DROP COLUMN "lastUpdated",
DROP COLUMN "proxyId",
DROP COLUMN "totalDms",
ADD COLUMN     "newPassword" VARCHAR(100),
ADD COLUMN     "oldPassword" VARCHAR(100),
ADD COLUMN     "yesterdayDms" INTEGER;

-- DropTable
DROP TABLE "Accounts";

-- CreateIndex
CREATE UNIQUE INDEX "SnapchatAccount_username_key" ON "SnapchatAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TwitterAccount_username_key" ON "TwitterAccount"("username");
