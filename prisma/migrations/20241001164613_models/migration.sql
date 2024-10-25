/*
  Warnings:

  - You are about to drop the column `drink` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `familyDetails` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `favFood` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `pets` on the `Model` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Model_name_key";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "drink",
DROP COLUMN "familyDetails",
DROP COLUMN "favFood",
DROP COLUMN "pets",
ADD COLUMN     "boobSize" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daughterAge" INTEGER,
ADD COLUMN     "drinks" TEXT,
ADD COLUMN     "favoriteFood" TEXT,
ADD COLUMN     "pantsSize" INTEGER,
ADD COLUMN     "shirtSize" TEXT,
ADD COLUMN     "singleParentSince" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "height" SET DATA TYPE TEXT;
