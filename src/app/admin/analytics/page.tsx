import Link from "next/link";
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

export default async function AdminAnalyticsPage() {
  const locale = await getRequestLocale();

  const [entities, relationships, revisions, mediaAssets] = await Promise.all([
    prisma.entity.findMany({
      select: {
        id: true,
        type: true,
        title: true,
        slug: true,
        incomingRelationships: { select: { id: true } },
        outgoingRelationships: { select: { id: true } },
      },
    }),
    prisma.relationship.findMany({
      select: {
        id: true,
        sourceEntityId: true,
        targetEntityId: true,
      },
    }),
    prisma.entityRevision.findMany({
      select: { id: true },
    }),
    prisma.mediaAsset.findMany({
      select: { id: true },
    }),
  ]);

  const totalEntities = entities.length;
  const totalRelationships = relationships.length;
  const totalRevisions = revisions.length;
  const totalMedia = mediaAssets.length;

  const groupedByType = typeOrder.reduce<Record<string, number>>((acc, type) => {
    acc[type] = entities.filter((entity) => entity.type === type).length;
    return acc;
  }, {});

  const linkedCounts = entities
    .map((entity) => ({
      slug: entity.slug,
      title: entity.title,
      links: entity.incomingRelationships.length + entity.outgoingRelationships.length,
    }))
    .sort((a, b) => b.links - a.links)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "الإدارة / التحليلات" : "Admin / Analytics"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "تحليلات الأرشيف" : "Archive Analytics"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "مؤشرات سريعة لبنية الكون: عدد العناصر، الروابط، المراجعات، والوسائط."
                : "Quick structural metrics for the archive: entities, relationships, revisions, and media."}
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
                {locale === "ar" ? "العناصر" : "Entities"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalEntities}</p>
            </div>
          </Reveal>
          <Reveal delay={0.03}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "العلاقات" : "Relationships"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalRelationships}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "المراجعات" : "Revisions"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalRevisions}</p>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الوسائط" : "Media assets"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalMedia}</p>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.06}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "الهيكل حسب النوع" : "Type Breakdown"}
              </h2>

              <div className="mt-4 space-y-3">
                {typeOrder.map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                  >
                    <p className="font-medium">{typeLabels[type]}</p>
                    <span className="text-lg font-semibold">{groupedByType[type] ?? 0}</span>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "أكثر العناصر ترابطًا" : "Most Connected Entities"}
              </h2>

              <div className="mt-4 space-y-3">
                {linkedCounts.length > 0 ? (
                  linkedCounts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/entities/${item.slug}`}
                      className="block rounded-xl border border-border p-4 transition hover:bg-accent"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.slug}</p>
                        </div>
                        <span className="text-lg font-semibold">{item.links}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "ar" ? "لا توجد بيانات بعد." : "No data yet."}
                  </p>
                )}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}