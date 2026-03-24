import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EntityType } from "@/generated/prisma/client";
import { getRequestLocale } from "@/lib/locale.server";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

const typeLabels: Record<EntityType, string> = {
  CHARACTER: "Character",
  STORY: "Story",
  INSTITUTION: "Institution",
  LOCATION: "Location",
  DOCTRINE: "Doctrine",
  EVENT: "Event",
  TERM: "Term",
  ARTIFACT: "Artifact",
  OTHER: "Other",
};

type SearchEntity = {
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

function getPrimaryMedia(entity: SearchEntity) {
  return (
    entity.mediaLinks.find((link) => link.primary)?.mediaAsset ??
    entity.mediaLinks[0]?.mediaAsset ??
    null
  );
}

function getPrimaryMediaRole(entity: SearchEntity) {
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = await getRequestLocale();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = (query
    ? await prisma.entity.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { summary: { contains: query, mode: "insensitive" } },
            { body: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { aliases: { has: query } },
            { tags: { has: query } },
            { searchKeywords: { has: query } },
          ],
        },
        orderBy: [{ updatedAt: "desc" }],
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
      })
    : []) as SearchEntity[];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section>
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "بحث الكون" : "Search Universe"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "اعثر على أي شيء" : "Find anything"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "ابحث بالعنوان أو الملخص أو النص أو الرابط أو الاسم البديل أو الوسم أو الكلمة المفتاحية."
                : "Search by title, summary, body, slug, alias, tag, or keyword."}
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.06}>
          <form className="flex flex-col gap-3 md:flex-row" action="/search">
            <input
              name="q"
              defaultValue={query}
              placeholder={locale === "ar" ? "ابحث في الكون..." : "Search the universe..."}
              className="ms-input"
            />
            <button type="submit" className="ms-button">
              {locale === "ar" ? "بحث" : "Search"}
            </button>
          </form>
        </Reveal>

        {query ? (
          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">
                  {locale === "ar" ? "النتائج" : "Results"}
                </h2>
                <span className="text-sm text-muted-foreground">{results.length} found</span>
              </div>

              <div className="mt-4 space-y-3">
                {results.length > 0 ? (
                  results.map((item, index) => {
                    const storyHasExternalLinks =
                      item.type === EntityType.STORY && hasExternalLinks(item.metadata);
                    const primaryMedia = getPrimaryMedia(item);
                    const primaryMediaRole = getPrimaryMediaRole(item);
                    const mediaRoleLabel = getMediaRoleLabel(locale, primaryMediaRole);

                    return (
                      <Reveal key={item.id} delay={index * 0.03}>
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
                                        {locale === "ar" ? "فصل معاينة" : "Preview chapter"}
                                      </span>
                                      <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                                        {locale === "ar" ? "قراءة خارجية" : "External reading"}
                                      </span>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              <span className="text-xs text-muted-foreground">
                                {typeLabels[item.type]}
                              </span>
                            </div>

                            {item.summary ? (
                              <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                            ) : null}
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    <p>
                      {locale === "ar"
                        ? `لا توجد نتائج لـ “${query}”.`
                        : `No results found for “${query}”.`}
                    </p>
                    <p className="mt-2">
                      {locale === "ar" ? "جرّب مصطلحًا آخر أو " : "Try another term, or "}
                      <Link href="/browse" className="underline">
                        {locale === "ar" ? "تصفح الكون" : "browse the universe"}
                      </Link>
                      {locale === "ar" ? "." : "."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <section className="ms-panel p-6 text-sm text-muted-foreground">
              {locale === "ar" ? "أدخل كلمة بحث للبدء، أو " : "Enter a search term to begin, or "}
              <Link href="/browse" className="underline">
                {locale === "ar" ? "تصفح الكون" : "browse the universe"}
              </Link>
              {locale === "ar" ? "." : "."}
            </section>
          </Reveal>
        )}
      </div>
    </main>
  );
}