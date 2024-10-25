-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "birthday" TIMESTAMP(3),
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "hairColor" TEXT,
    "shoeSize" INTEGER,
    "ethnicity" TEXT,
    "occupation" TEXT,
    "location" TEXT,
    "drink" TEXT,
    "familyDetails" TEXT,
    "favFood" TEXT,
    "hobbies" TEXT,
    "pets" TEXT,
    "relationStatus" TEXT,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwitterAccount" (
    "id" TEXT NOT NULL,
    "proxyId" TEXT,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "password" VARCHAR(100),
    "status" VARCHAR(20),
    "creationDate" DATE,
    "ctaLink" VARCHAR(200),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "notes" VARCHAR(200),
    "bio" VARCHAR(200),
    "profileAdsPower" INTEGER,
    "followersCount" INTEGER,
    "totalDmsToday" INTEGER,
    "totalDms" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,
    "proxy" TEXT NOT NULL,

    CONSTRAINT "TwitterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditAccount" (
    "id" TEXT NOT NULL,
    "proxyId" TEXT,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100),
    "status" VARCHAR(20),
    "creationDate" DATE,
    "ctaLink" VARCHAR(200),
    "notes" VARCHAR(200),
    "bio" VARCHAR(200),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" VARCHAR(20),
    "botStatus" BOOLEAN,
    "messageAcceptedToday" INTEGER,
    "profileAdsPower" INTEGER,
    "proxyChangedDate" DATE,
    "startPostingDate" DATE,
    "state" VARCHAR(100),
    "todayCommentKarma" INTEGER,
    "yesterdayCommentKarma" INTEGER,
    "modelId" TEXT NOT NULL,
    "proxy" TEXT NOT NULL,

    CONSTRAINT "RedditAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnapchatAccount" (
    "id" TEXT NOT NULL,
    "proxyId" TEXT,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "emailPassword" VARCHAR(100),
    "password" VARCHAR(100),
    "status" VARCHAR(20),
    "creationDate" DATE,
    "ctaLink" VARCHAR(200),
    "state" VARCHAR(100),
    "totalFriends" INTEGER,
    "previousDay" INTEGER,
    "hourAdds" INTEGER,
    "profileAdsPower" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "SnapchatAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountServer" (
    "id" TEXT NOT NULL,
    "redditAccountId" TEXT,
    "serverId" TEXT NOT NULL,
    "snapchatAccountId" TEXT,
    "twitterAccountId" TEXT,

    CONSTRAINT "AccountServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CupidBot" (
    "id" TEXT NOT NULL,
    "twitterAccountId" TEXT,
    "redditAccountId" TEXT,
    "snapchatAccountId" TEXT,
    "status" VARCHAR(20),
    "lastRunDate" TIMESTAMP(3),
    "totalMessagesSent" INTEGER,
    "totalResponses" INTEGER,
    "conversionRate" DECIMAL(5,2),

    CONSTRAINT "CupidBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "socialMedia" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnusedProxy" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "billingCycleStart" TIMESTAMP(3) NOT NULL,
    "billingCycleEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnusedProxy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RedditAccount_username_key" ON "RedditAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AccountServer_serverId_twitterAccountId_redditAccountId_sna_key" ON "AccountServer"("serverId", "twitterAccountId", "redditAccountId", "snapchatAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CupidBot_twitterAccountId_key" ON "CupidBot"("twitterAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CupidBot_redditAccountId_key" ON "CupidBot"("redditAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CupidBot_snapchatAccountId_key" ON "CupidBot"("snapchatAccountId");

-- AddForeignKey
ALTER TABLE "TwitterAccount" ADD CONSTRAINT "TwitterAccount_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditAccount" ADD CONSTRAINT "RedditAccount_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapchatAccount" ADD CONSTRAINT "SnapchatAccount_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountServer" ADD CONSTRAINT "AccountServer_redditAccountId_fkey" FOREIGN KEY ("redditAccountId") REFERENCES "RedditAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountServer" ADD CONSTRAINT "AccountServer_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountServer" ADD CONSTRAINT "AccountServer_snapchatAccountId_fkey" FOREIGN KEY ("snapchatAccountId") REFERENCES "SnapchatAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountServer" ADD CONSTRAINT "AccountServer_twitterAccountId_fkey" FOREIGN KEY ("twitterAccountId") REFERENCES "TwitterAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupidBot" ADD CONSTRAINT "CupidBot_twitterAccountId_fkey" FOREIGN KEY ("twitterAccountId") REFERENCES "TwitterAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupidBot" ADD CONSTRAINT "CupidBot_redditAccountId_fkey" FOREIGN KEY ("redditAccountId") REFERENCES "RedditAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupidBot" ADD CONSTRAINT "CupidBot_snapchatAccountId_fkey" FOREIGN KEY ("snapchatAccountId") REFERENCES "SnapchatAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
