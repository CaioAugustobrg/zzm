-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('RUNNING', 'DOWN', 'WORKINPROGRESS');

-- CreateEnum
CREATE TYPE "ServerQuality" AS ENUM ('FAST', 'MEDIUM', 'SLOW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "primaryIp" TEXT NOT NULL,
    "status" "ServerStatus" NOT NULL,
    "powerStatus" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "lastRefreshDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Server_deviceId_key" ON "Server"("deviceId");
