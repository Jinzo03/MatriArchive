-- CreateEnum
CREATE TYPE "MediaRole" AS ENUM ('PORTRAIT', 'COVER', 'ICON', 'SCENE', 'GALLERY', 'TIMELINE_ART', 'EMBLEM', 'THUMBNAIL');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "ImportJobStatus" AS ENUM ('DRAFT', 'RUNNING', 'SUCCEEDED', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "ImportLogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "src" TEXT NOT NULL,
    "alt" TEXT,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "credit" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMedia" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "role" "MediaRole" NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageVersion" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourcePath" TEXT,
    "status" "ImportJobStatus" NOT NULL DEFAULT 'DRAFT',
    "dryRun" BOOLEAN NOT NULL DEFAULT true,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "summary" JSONB,

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportLog" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "level" "ImportLogLevel" NOT NULL DEFAULT 'INFO',
    "stage" TEXT,
    "message" TEXT NOT NULL,
    "entitySlug" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_slug_key" ON "MediaAsset"("slug");

-- CreateIndex
CREATE INDEX "MediaAsset_slug_idx" ON "MediaAsset"("slug");

-- CreateIndex
CREATE INDEX "MediaAsset_type_idx" ON "MediaAsset"("type");

-- CreateIndex
CREATE INDEX "EntityMedia_entityId_idx" ON "EntityMedia"("entityId");

-- CreateIndex
CREATE INDEX "EntityMedia_mediaAssetId_idx" ON "EntityMedia"("mediaAssetId");

-- CreateIndex
CREATE INDEX "EntityMedia_role_idx" ON "EntityMedia"("role");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMedia_entityId_mediaAssetId_role_key" ON "EntityMedia"("entityId", "mediaAssetId", "role");

-- CreateIndex
CREATE INDEX "ImportJob_packageId_idx" ON "ImportJob"("packageId");

-- CreateIndex
CREATE INDEX "ImportJob_status_idx" ON "ImportJob"("status");

-- CreateIndex
CREATE INDEX "ImportJob_startedAt_idx" ON "ImportJob"("startedAt");

-- CreateIndex
CREATE INDEX "ImportLog_importJobId_idx" ON "ImportLog"("importJobId");

-- CreateIndex
CREATE INDEX "ImportLog_level_idx" ON "ImportLog"("level");

-- CreateIndex
CREATE INDEX "ImportLog_stage_idx" ON "ImportLog"("stage");

-- AddForeignKey
ALTER TABLE "EntityMedia" ADD CONSTRAINT "EntityMedia_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMedia" ADD CONSTRAINT "EntityMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLog" ADD CONSTRAINT "ImportLog_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
