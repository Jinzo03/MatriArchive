import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EntityType } from "@/generated/prisma/client";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";

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

type BrowseEntity = {
  id: string;
  title: string;
  slug: string;
  type: EntityType;
  summary: string | null;
  metadata: unknown;
  mediaLinks: Array<{
    role: string;
    primary: boolean;
    sortOrder: number;
    mediaAsset: {
      src: string;
      alt: string | null;
      title: string;
      type: "IMAGE" | "VIDEO" | "AUDIO" | "OTHER";
    };
  }>;
};

function hasExternalLinks(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object") return false;

  const value = metadata as Record<string, unknown>;
  const links = value.externalLinks;

  if (!links || typeof links !== "object") return false;

  const record = links as Record<string, unknown>;
  return typeof record.wattpad === "string" || typeof record.ao3 === "string";
}

function getPrimaryMedia(entity: BrowseEntity) {
  return (
    entity.mediaLinks.find((link) => link.primary)?.mediaAsset ??
    entity.mediaLinks[0]?.mediaAsset ??
    null
  );
}

function getPrimaryMediaRole(entity: BrowseEntity) {
  return entity.mediaLinks.find((link) => link.primary)?.role ?? entity.mediaLinks[0]?.role ?? null;
}

function getMediaRoleLabel(locale: string, role: string | null) {
  if (!role) return null;

  switch (role) {
    case "PORTRAIT":
      return locale === "ar" ? "صورة شخصية" : "Portrait";
    case "COVER":
      return locale === "ar" ? "غلاف" : "Cover";
    case "ICON":
      return locale === "ar" ? "أيقونة" : "Icon";
    case "EMBLEM":
      return locale === "ar" ? "شعار" : "Emblem";
    case "SCENE":
      return locale === "ar" ? "مشهد" : "Scene";
    case "TIMELINE_ART":
      return locale === "ar" ? "فن زمني" : "Timeline art";
    case "THUMBNAIL":
      return locale === "ar" ? "مصغّر" : "Thumbnail";
    case "GALLERY":
      return locale === "ar" ? "معرض" : "Gallery";
    default:
      return locale === "ar" ? "وسائط" : "Media";
  }
}

export default async function BrowsePage() {
  const locale = await getRequestLocale();

  const entities = (await prisma.entity.findMany({
    orderBy: [{ type: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      summary: true,
      metadata: true,
      mediaLinks: {
        orderBy: [{ primary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          role: true,
          primary: true,
          sortOrder: true,
          mediaAsset: {
            select: {
              src: true,
              alt: true,
              title: true,
              type: true,
            },
          },
        },
      },
    },
  })) as BrowseEntity[];

  const grouped = typeOrder.reduce<Record<string, BrowseEntity[]>>((acc, type) => {
    acc[type] = entities.filter((entity) => entity.type === type);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section>
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "تصفح الكون" : "Browse Universe"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "كل العناصر" : "All Entities"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "استعرض الكون حسب النوع وافتح أي صفحة عنصر."
                : "Explore the universe by category and jump into any entity page."}
            </p>
          </section>
        </Reveal>

        {entities.length === 0 ? (
          <section className="ms-panel p-8 text-center">
            <h2 className="text-lg font-semibold">
              {locale === "ar" ? "لا يوجد شيء بعد" : "Nothing here yet"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "ar"
                ? "أنشئ أول عنصر لبدء بناء الكون."
                : "Create your first entity to begin building the universe."}
            </p>
            <div className="mt-5">
              <Link href="/create" className="ms-button">
                {locale === "ar" ? "إنشاء أول عنصر" : "Create First Entity"}
              </Link>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {typeOrder.map((type, index) => (
            <Reveal key={type} delay={index * 0.03}>
              <div className="ms-panel-soft p-4">
                <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
                <p className="mt-2 text-2xl font-semibold">{grouped[type]?.length ?? 0}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="space-y-8">
          {typeOrder.map((type) => {
            const items = grouped[type] ?? [];

            return (
              <div key={type} className="ms-panel p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">{typeLabels[type]}</h2>
                  <span className="text-sm text-muted-foreground">{items.length} items</span>
                </div>

                {items.length > 0 ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {items.map((item, itemIndex) => {
                      const storyHasExternalLinks =
                        item.type === EntityType.STORY && hasExternalLinks(item.metadata);
                      const primaryMedia = getPrimaryMedia(item);
                      const primaryMediaRole = getPrimaryMediaRole(item);
                      const mediaRoleLabel = getMediaRoleLabel(locale, primaryMediaRole);

                      return (
                        <Reveal key={item.id} delay={itemIndex * 0.03}>
                          <Link
                            href={`/entities/${item.slug}`}
                            className="block overflow-hidden rounded-xl border border-border transition hover:bg-accent"
                          >
                            {primaryMedia && primaryMedia.type === "IMAGE" ? (
                              <div className="relative aspect-[16/7] w-full overflow-hidden border-b border-border/60 bg-muted/30">
                                <img
                                  src={primaryMedia.src}
                                  alt={primaryMedia.alt || primaryMedia.title || item.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : null}

                            <div className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-medium">{item.title}</p>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {primaryMedia && mediaRoleLabel ? (
                                      <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                                        {mediaRoleLabel}
                                      </span>
                                    ) : null}

                                    {storyHasExternalLinks ? (
                                      <>
                                        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                                          {locale === "ar"
                                            ? "فصل معاينة"
                                            : "Preview chapter"}
                                        </span>
                                        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                                          {locale === "ar"
                                            ? "قراءة خارجية"
                                            : "External reading"}
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>

                              {item.summary ? (
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                  {item.summary}
                                </p>
                              ) : null}
                            </div>
                          </Link>
                        </Reveal>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    {locale === "ar"
                      ? `لا توجد ${typeLabels[type].toLowerCase()} بعد.`
                      : `No ${typeLabels[type].toLowerCase()} yet.`}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}