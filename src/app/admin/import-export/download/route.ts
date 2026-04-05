import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SHOW_ADMIN_UI } from "@/lib/app-flags";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!SHOW_ADMIN_UI) {
    notFound();
  }

  const exportBundle = {
    entities: await prisma.entity.findMany({ orderBy: { createdAt: "asc" } }),
    relationships: await prisma.relationship.findMany({ orderBy: { createdAt: "asc" } }),
    revisions: await prisma.entityRevision.findMany({ orderBy: { createdAt: "asc" } }),
  };

  const exportJson = JSON.stringify(exportBundle, null, 2);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = "matriarchive-export-" + timestamp + ".json";

  return new Response(exportJson, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"" + filename + "\"",
      "Cache-Control": "no-store",
    },
  });
}
