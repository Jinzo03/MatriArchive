import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  EntityType,
  EntityStatus,
  Visibility,
  RelationshipType,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") {
    throw new Error(
      "Seeding is disabled by default because this script deletes existing data. Set ALLOW_DESTRUCTIVE_SEED=true to run it intentionally."
    );
  }

  await prisma.relationship.deleteMany();
  await prisma.entity.deleteMany();

  const sheikha = await prisma.entity.create({
    data: {
      type: EntityType.CHARACTER,
      title: "Sheikha Example",
      slug: "sheikha-example",
      summary: "A first sample character for the universe.",
      body: "This is a starter entity used to test the system.",
      status: EntityStatus.ACTIVE,
      visibility: Visibility.PRIVATE,
      tags: ["starter", "character"],
      aliases: ["Example Sheikha"],
      searchKeywords: ["sheikha", "example"],
    },
  });

  const institution = await prisma.entity.create({
    data: {
      type: EntityType.INSTITUTION,
      title: "The First Council",
      slug: "the-first-council",
      summary: "A sample governing body.",
      body: "This institution exists to test relationships.",
      status: EntityStatus.ACTIVE,
      visibility: Visibility.PRIVATE,
      tags: ["starter", "institution"],
    },
  });

  await prisma.relationship.create({
    data: {
      type: RelationshipType.BELONGS_TO,
      sourceEntityId: sheikha.id,
      targetEntityId: institution.id,
      notes: "Starter relationship for navigation testing.",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
