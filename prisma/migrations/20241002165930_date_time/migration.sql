/*
  Warnings:

  - You are about to drop the `AccountServer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CupidBot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `RedditAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RedditAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `SnapchatAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SnapchatAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `TwitterAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TwitterAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UnusedProxy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountServer" DROP CONSTRAINT "AccountServer_redditAccountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountServer" DROP CONSTRAINT "AccountServer_serverId_fkey";

-- DropForeignKey
ALTER TABLE "AccountServer" DROP CONSTRAINT "AccountServer_snapchatAccountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountServer" DROP CONSTRAINT "AccountServer_twitterAccountId_fkey";

-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CupidBot" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RedditAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "serverId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SnapchatAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "serverId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TwitterAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "serverId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UnusedProxy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AccountServer";

-- AddForeignKey
ALTER TABLE "TwitterAccount" ADD CONSTRAINT "TwitterAccount_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditAccount" ADD CONSTRAINT "RedditAccount_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapchatAccount" ADD CONSTRAINT "SnapchatAccount_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
