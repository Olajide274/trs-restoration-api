-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('WATER', 'FIRE', 'MOLD', 'STORM', 'OTHER');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('NEW', 'INSPECTION', 'ESTIMATING', 'PROPOSAL_SENT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "damageType" "DamageType" NOT NULL,
    "damageDescription" TEXT NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'NEW',
    "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_damageType_idx" ON "Job"("damageType");

-- CreateIndex
CREATE INDEX "StatusHistory_jobId_idx" ON "StatusHistory"("jobId");

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
