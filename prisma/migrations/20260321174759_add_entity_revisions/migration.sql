-- CreateTable
CREATE TABLE "EntityRevision" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "status" "EntityStatus" NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityRevision_entityId_idx" ON "EntityRevision"("entityId");

-- CreateIndex
CREATE INDEX "EntityRevision_version_idx" ON "EntityRevision"("version");

-- CreateIndex
CREATE UNIQUE INDEX "EntityRevision_entityId_version_key" ON "EntityRevision"("entityId", "version");

-- AddForeignKey
ALTER TABLE "EntityRevision" ADD CONSTRAINT "EntityRevision_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
