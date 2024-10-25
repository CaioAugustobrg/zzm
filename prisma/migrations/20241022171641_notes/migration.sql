/*
  Warnings:

  - You are about to drop the column `dailyNotes` on the `SnapchatAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SnapchatAccount" DROP COLUMN "dailyNotes",
ADD COLUMN     "notes" TEXT;
