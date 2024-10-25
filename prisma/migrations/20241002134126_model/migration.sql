/*
  Warnings:

  - You are about to drop the column `background` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `daughterAge` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `drinks` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `family` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `familyBackground` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteFood` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteSubjects` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteTV` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `futureAspirations` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `legalDrinkingStatus` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `morningRoutine` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `naturalHairColor` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `nichesFetishes` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `occupationDetails` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `offDutyActivities` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `onlineBehavior` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `partnerPreferences` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `personalRestrictions` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `personalityAndHobbies` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `previousIdentity` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `privacyConcerns` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `religiousBackground` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `sexualExperience` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `sexualPreferences` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `singleParentSince` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `workLifeBalance` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacSign` on the `Model` table. All the data in the column will be lost.
  - Added the required column `drink` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favFood` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `height` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Made the column `weight` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hairColor` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shoeSize` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ethnicity` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hobbies` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `relationStatus` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `boobSize` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Made the column `pantsSize` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shirtSize` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pets` on table `Model` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "background",
DROP COLUMN "createdAt",
DROP COLUMN "daughterAge",
DROP COLUMN "drinks",
DROP COLUMN "family",
DROP COLUMN "familyBackground",
DROP COLUMN "favoriteFood",
DROP COLUMN "favoriteSubjects",
DROP COLUMN "favoriteTV",
DROP COLUMN "fullName",
DROP COLUMN "futureAspirations",
DROP COLUMN "legalDrinkingStatus",
DROP COLUMN "morningRoutine",
DROP COLUMN "naturalHairColor",
DROP COLUMN "nichesFetishes",
DROP COLUMN "occupationDetails",
DROP COLUMN "offDutyActivities",
DROP COLUMN "onlineBehavior",
DROP COLUMN "partnerPreferences",
DROP COLUMN "personalRestrictions",
DROP COLUMN "personalityAndHobbies",
DROP COLUMN "previousIdentity",
DROP COLUMN "privacyConcerns",
DROP COLUMN "religiousBackground",
DROP COLUMN "sexualExperience",
DROP COLUMN "sexualPreferences",
DROP COLUMN "singleParentSince",
DROP COLUMN "summary",
DROP COLUMN "updatedAt",
DROP COLUMN "workLifeBalance",
DROP COLUMN "zodiacSign",
ADD COLUMN     "drink" TEXT NOT NULL,
ADD COLUMN     "familyDetails" TEXT,
ADD COLUMN     "favFood" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "birthday" SET NOT NULL,
DROP COLUMN "height",
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "hairColor" SET NOT NULL,
ALTER COLUMN "shoeSize" SET NOT NULL,
ALTER COLUMN "shoeSize" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "ethnicity" SET NOT NULL,
ALTER COLUMN "occupation" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "hobbies" SET NOT NULL,
ALTER COLUMN "relationStatus" SET NOT NULL,
DROP COLUMN "boobSize",
ADD COLUMN     "boobSize" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "pantsSize" SET NOT NULL,
ALTER COLUMN "pantsSize" SET DATA TYPE TEXT,
ALTER COLUMN "shirtSize" SET NOT NULL,
ALTER COLUMN "pets" SET NOT NULL;
