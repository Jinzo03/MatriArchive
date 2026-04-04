import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOW_ADMIN_UI } from "@/lib/app-flags";
import { prisma } from "@/lib/prisma";
import { EntityType } from "@/generated/prisma/client";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

const typeOrder: EntityType[] = [
  EntityType.CHARACTER,
  EntityType.STORY,
  EntityType.INSTITUTION,
  EntityType.LOCATION,
  EntityType.DOCTRINE,
  EntityType.EVENT,
  EntityType.TERM,
  EntityType.ARTIFACT,
  EntityType.OTHER,
];

const typeLabels: Record<EntityType, string> = {
  CHARACTER: "Characters",
  STORY: "Stories",
  INSTITUTION: "Institutions",
  LOCATION: "Locations",
  DOCTRINE: "Doctrines",
  EVENT: "Events",
  TERM: "Terms",
  ARTIFACT: "Artifacts",
  OTHER: "Other",
};

function hasMissingMetadata(type: EntityType, metadata: unknown) {
  if (type !== EntityType.STORY) return false;
  if (!metadata || typeof metadata !== "object") return true;

  const value = metadata as Record<string, unknown>;
  return !value.externalLinks;
}

export default async function AdminContentPage() {
  if (!SHOW_ADMIN_UI) {
    notFound();
  }

  const locale = await getRequestLocale();

  const entities = await prisma.entity.findMany({
    orderBy: [{ type: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      summary: true,
      status: true,
      visibility: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const grouped = typeOrder.reduce<Record<string, typeof entities>>((acc, type) => {
    acc[type] = entities.filter((entity) => entity.type === type);
    return acc;
  }, {});

  const total = entities.length;
  const storiesMissingMetadata = entities.filter((entity) =>
    hasMissingMetadata(entity.type, entity.metadata)
  ).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "الإدارة / المحتوى" : "Admin / Content"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "محتوى الأرشيف" : "Archive Content"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "راقب عناصر الكون، أحدث التحديثات، والحالات التي تحتاج مراجعة."
                : "Monitor archive entities, recent updates, and items that may need review."}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Link href="/admin" className="text-sm underline">
                {t(locale, "backToAdminHub")}
              </Link>
              <AdminIndexNav />
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Reveal>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "إجمالي العناصر" : "Total entities"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{total}</p>
            </div>
          </Reveal>
          <Reveal delay={0.03}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "شخصيات" : "Characters"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{grouped.CHARACTER?.length ?? 0}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "قصص" : "Stories"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{grouped.STORY?.length ?? 0}</p>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "قصص بلا روابط خارجية" : "Stories missing external links"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{storiesMissingMetadata}</p>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.06}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "أحدث العناصر" : "Recent Entities"}
              </h2>

              <div className="mt-4 space-y-3">
                {entities.slice(0, 12).map((entity) => (
                  <Link
                    key={entity.id}
                    href={`/entities/${entity.slug}`}
                    className="block rounded-xl border border-border p-4 transition hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{entity.title}</p>
                        <p className="text-sm text-muted-foreground">{typeLabels[entity.type]}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{entity.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "مراجعة حسب النوع" : "Type Breakdown"}
              </h2>

              <div className="mt-4 space-y-3">
                {typeOrder.map((type) => {
                  const items = grouped[type] ?? [];

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{typeLabels[type]}</p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "ar" ? "عناصر" : "items"}
                        </p>
                      </div>
                      <span className="text-lg font-semibold">{items.length}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
