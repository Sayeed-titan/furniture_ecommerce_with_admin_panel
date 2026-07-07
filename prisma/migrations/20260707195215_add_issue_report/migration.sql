-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('BUG', 'FEATURE', 'CHANGE', 'QUESTION');

-- CreateTable
CREATE TABLE "IssueReport" (
    "id" TEXT NOT NULL,
    "type" "IssueType" NOT NULL DEFAULT 'BUG',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "reporterName" TEXT,
    "reporterEmail" TEXT,
    "pageUrl" TEXT,
    "githubIssueNumber" INTEGER,
    "githubIssueUrl" TEXT,
    "syncError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IssueReport_type_idx" ON "IssueReport"("type");

-- CreateIndex
CREATE INDEX "IssueReport_createdAt_idx" ON "IssueReport"("createdAt");
