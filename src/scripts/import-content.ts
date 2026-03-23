import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { previewPackageFile } from "@/lib/importer";
import { applyUniverseImport } from "@/lib/import-apply";

async function main() {
  const filePath = process.argv[2];
  const shouldApply = process.argv.includes("--apply");

  if (!filePath) {
    console.error("Usage: pnpm import:content <path-to-package.json> [--apply]");
    process.exit(1);
  }

  try {
    const preview = await previewPackageFile(filePath);

    console.log(`\nPackage: ${preview.title}`);
    console.log(`ID: ${preview.packageId}`);
    console.log(`Version: ${preview.packageVersion}`);
    console.log(`Source: ${preview.sourcePath ?? filePath}`);

    console.log("\nCounts:");
    console.log(
      `Entities      create=${preview.counts.entities.create} update=${preview.counts.entities.update} skip=${preview.counts.entities.skip}`
    );
    console.log(
      `Media         create=${preview.counts.media.create} update=${preview.counts.media.update} skip=${preview.counts.media.skip}`
    );
    console.log(
      `Relationships create=${preview.counts.relationships.create} update=${preview.counts.relationships.update} skip=${preview.counts.relationships.skip}`
    );
    console.log(
      `EntityMedia   create=${preview.counts.entityMedia.create} update=${preview.counts.entityMedia.update} skip=${preview.counts.entityMedia.skip}`
    );

    if (preview.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const warning of preview.warnings) {
        console.log(`- ${warning}`);
      }
    }

    console.log("\nPreview items:");
    for (const item of preview.items) {
      console.log(`[${item.kind}] ${item.action} :: ${item.title} :: ${item.reason}`);
    }

    if (!shouldApply) {
      console.log("\nDry-run complete. Re-run with --apply to write changes.\n");
      return;
    }

    const rl = readline.createInterface({ input, output });
    const answer = await rl.question("\nType APPLY to confirm the write import: ");
    rl.close();

    if (answer.trim().toUpperCase() !== "APPLY") {
      console.log("Import cancelled.\n");
      return;
    }

    const result = await applyUniverseImport(filePath, {
      sourcePath: filePath,
      approvedPreview: preview,
    });

    console.log("\nImport complete:");
    console.log(`Job ID: ${result.jobId}`);
    console.log(`Created: ${result.createdCount}`);
    console.log(`Updated: ${result.updatedCount}`);
    console.log(`Skipped: ${result.skippedCount}`);
    console.log(`Failed: ${result.failedCount}`);

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const warning of result.warnings) {
        console.log(`- ${warning}`);
      }
    }

    console.log("");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();