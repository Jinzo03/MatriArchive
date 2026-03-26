import { prisma } from "@/lib/prisma";

type DeleteMode = "inspect" | "delete";

type ParsedArgs = {
  identifiers: string[];
  confirmDelete: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const identifiers: string[] = [];
  let confirmDelete = false;
  let help = false;

  for (const arg of argv) {
    if (arg === "--yes" || arg === "--delete") {
      confirmDelete = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }

    identifiers.push(arg);
  }

  return {
    identifiers,
    confirmDelete,
    help,
  };
}

function printHelp() {
  console.log(`Usage:
  npm run media:delete -- <media-slug-or-id> [more-identifiers...]
  npm run media:delete -- <media-slug-or-id> --yes

Behavior:
  Without --yes, the script only inspects the media and shows linked entities.
  With --yes, the script deletes the media from the database.

Examples:
  npm run media:delete -- qamar-cover-01
  npm run media:delete -- media.qamar.cover-01
  npm run media:delete -- qamar-cover-01 another-slug --yes
`);
}

async function findMedia(identifier: string) {
  return prisma.mediaAsset.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
      ],
    },
    include: {
      entityLinks: {
        include: {
          entity: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
        orderBy: [
          { role: "asc" },
          { sortOrder: "asc" },
        ],
      },
    },
  });
}

function summarizeMedia(
  media:
    | Awaited<ReturnType<typeof findMedia>>
    | null,
  identifier: string,
  mode: DeleteMode
) {
  if (!media) {
    return {
      identifier,
      mode,
      found: false,
      deleted: false,
      reason: "Media asset not found.",
    };
  }

  return {
    identifier,
    mode,
    found: true,
    deleted: mode === "delete",
    media: {
      id: media.id,
      slug: media.slug,
      title: media.title,
      src: media.src,
      type: media.type,
    },
    linkedEntities: media.entityLinks.map((link) => ({
      id: link.entity.id,
      slug: link.entity.slug,
      title: link.entity.title,
      role: link.role,
      primary: link.primary,
      sortOrder: link.sortOrder,
      alt: link.alt,
    })),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.identifiers.length === 0) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const results: unknown[] = [];

  for (const identifier of args.identifiers) {
    const media = await findMedia(identifier);

    if (!args.confirmDelete || !media) {
      results.push(
        summarizeMedia(media, identifier, "inspect")
      );
      continue;
    }

    await prisma.mediaAsset.delete({
      where: { id: media.id },
    });

    results.push(
      summarizeMedia(media, identifier, "delete")
    );
  }

  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
