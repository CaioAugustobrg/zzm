-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "hairColor" DROP NOT NULL,
ALTER COLUMN "shoeSize" DROP NOT NULL,
ALTER COLUMN "occupation" DROP NOT NULL,
ALTER COLUMN "hobbies" DROP NOT NULL,
ALTER COLUMN "relationStatus" DROP NOT NULL,
ALTER COLUMN "pantsSize" DROP NOT NULL,
ALTER COLUMN "shirtSize" DROP NOT NULL,
ALTER COLUMN "pets" DROP NOT NULL,
ALTER COLUMN "drink" DROP NOT NULL,
ALTER COLUMN "favFood" DROP NOT NULL,
ALTER COLUMN "boobSize" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TwitterAccount" ALTER COLUMN "proxy" DROP NOT NULL;