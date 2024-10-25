/*
  Warnings:

  - You are about to drop the column `userId` on the `Model` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_userId_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "modelId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
