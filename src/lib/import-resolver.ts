import type { UniversePackage } from "@/lib/import-schema";

export type NormalizedPackageEntity =
  UniversePackage["characters"][number] |
  UniversePackage["stories"][number] |
  UniversePackage["lore"][number] |
  UniversePackage["timeline"][number];

export type NormalizedPackageMedia = UniversePackage["media"][number];

export type ImportIndexes = {
  entitiesById: Map<string, NormalizedPackageEntity>;
  entitiesBySlug: Map<string, NormalizedPackageEntity>;
  mediaById: Map<string, NormalizedPackageMedia>;
  mediaBySlug: Map<string, NormalizedPackageMedia>;
};

export function flattenPackage(packageData: UniversePackage) {
  const entities: NormalizedPackageEntity[] = [
    ...packageData.characters,
    ...packageData.stories,
    ...packageData.lore,
    ...packageData.timeline,
  ];

  const media: NormalizedPackageMedia[] = packageData.media ?? [];

  return { entities, media };
}

export function buildImportIndexes(packageData: UniversePackage): ImportIndexes {
  const { entities, media } = flattenPackage(packageData);

  const entitiesById = new Map<string, NormalizedPackageEntity>();
  const entitiesBySlug = new Map<string, NormalizedPackageEntity>();
  const mediaById = new Map<string, NormalizedPackageMedia>();
  const mediaBySlug = new Map<string, NormalizedPackageMedia>();

  for (const entity of entities) {
    entitiesById.set(entity.id, entity);
    entitiesBySlug.set(entity.slug, entity);
  }

  for (const asset of media) {
    mediaById.set(asset.id, asset);
    mediaBySlug.set(asset.slug, asset);
  }

  return {
    entitiesById,
    entitiesBySlug,
    mediaById,
    mediaBySlug,
  };
}

export function resolveTargetEntity(
  targetId: string,
  indexes: ImportIndexes
): NormalizedPackageEntity | undefined {
  return (
    indexes.entitiesById.get(targetId) ??
    indexes.entitiesBySlug.get(targetId)
  );
}

export function resolveMediaAsset(
  assetId: string,
  indexes: ImportIndexes
): NormalizedPackageMedia | undefined {
  return (
    indexes.mediaById.get(assetId) ??
    indexes.mediaBySlug.get(assetId)
  );
}