import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getEntityStatusLabel,
  getEntityTypeLabel,
  getVisibilityLabel,
  t,
} from "@/lib/locale";
import { SHOW_ADMIN_UI } from "@/lib/app-flags";
import { getRequestLocale } from "@/lib/locale.server";
import { getRelationshipLabel } from "@/lib/relationships";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { EntityMediaFrame } from "@/components/entity-media-frame";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ExternalLinks = {
  wattpad?: string;
  ao3?: string;
};

function renderLongFormBody(body: string) {
  const blocks = body
    .split(/\r?\n\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const isSectionBreak =
          block.startsWith("PART ") ||
          block.startsWith("Chapter ") ||
          block.startsWith("Chapter I") ||
          block.startsWith("Chapter II") ||
          block.startsWith("Chapter III") ||
          block.startsWith("Chapter IV") ||
          block.startsWith("Chapter V") ||
          block.startsWith("Chapter VI") ||
          block.startsWith("Chapter VII") ||
          block.startsWith("THE FATWA") ||
          block.startsWith("Opening Verse") ||
          block.startsWith("Closing Addendum");

        return (
          <div
            key={`${index}-${block.slice(0, 24)}`}
            className={
              isSectionBreak
                ? "rounded-2xl border border-border/60 bg-background/40 px-4 py-3"
                : undefined
            }
          >
            <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-foreground/95 sm:text-base">
              {block}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function renderPreviewBody(body: string, maxBlocks = 5) {
  const blocks = body
    .split(/\r?\n\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, maxBlocks);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <p
          key={`${index}-${block.slice(0, 24)}`}
          className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground/90"
        >
          {block}
        </p>
      ))}
    </div>
  );
}

function getExternalLinks(metadata: unknown): ExternalLinks | null {
  if (!metadata || typeof metadata !== "object") return null;

  const value = metadata as Record<string, unknown>;
  const links = value.externalLinks;

  if (!links || typeof links !== "object") return null;

  const record = links as Record<string, unknown>;
  const wattpad = typeof record.wattpad === "string" ? record.wattpad : undefined;
  const ao3 = typeof record.ao3 === "string" ? record.ao3 : undefined;

  if (!wattpad && !ao3) return null;

  return { wattpad, ao3 };
}

function WattpadMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="#fe5009" />
      <path
        d="M7.2 8.2l1.6 7.7 1.8-4.9 1.7 4.9 1.6-7.7"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ao3Mark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="currentColor" />
      <path
        d="M8 16l8-8M10 16l8-8M6.8 9.2h3.8M13.2 15h3.8"
        stroke="hsl(var(--background))"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function EntityPage({ params }: PageProps) {
  const locale = await getRequestLocale();
  const { slug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug },
    include: {
      incomingRelationships: {
        include: {
          sourceEntity: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
      outgoingRelationships: {
        include: {
          targetEntity: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
      mediaLinks: {
        include: {
          mediaAsset: true,
        },
        orderBy: [
          { primary: "desc" },
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!entity) {
    notFound();
  }

  const externalLinks = getExternalLinks(entity.metadata);

  const primaryMedia =
    entity.mediaLinks.find((link) => link.primary)?.mediaAsset ??
    entity.mediaLinks[0]?.mediaAsset ??
    null;

  const primaryMediaRole =
    entity.mediaLinks.find((link) => link.primary)?.role ??
    entity.mediaLinks[0]?.role ??
    null;

  const isExternallyContinuedArtifact = entity.type === "ARTIFACT" && !!externalLinks;
  const isLongFormArtifact = entity.type === "ARTIFACT" && !externalLinks;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className={`mx-auto flex w-full flex-col gap-8 px-6 py-8 ${
          isLongFormArtifact ? "max-w-6xl" : "max-w-5xl"
        }`}
      >
        <Reveal>
          <section className="ms-panel overflow-hidden">
            {primaryMedia ? (
              <EntityMediaFrame
                src={primaryMedia.src}
                alt={primaryMedia.alt || entity.title}
                title={primaryMedia.title}
                width={primaryMedia.width}
                height={primaryMedia.height}
                variant="hero"
              />
            ) : null}

            <div className="p-6">
              <PageHeader
                eyebrow={getEntityTypeLabel(locale, entity.type)}
                title={entity.title}
                description={entity.summary || t(locale, "noSummaryYet")}
                framed={false}
              />

              {primaryMedia ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-3 py-1">
                    {primaryMediaRole === "PORTRAIT"
                      ? locale === "ar"
                        ? "صورة شخصية"
                        : "Portrait"
                      : primaryMediaRole === "COVER"
                        ? locale === "ar"
                          ? "غلاف"
                          : "Cover"
                        : primaryMediaRole === "ICON"
                          ? locale === "ar"
                            ? "أيقونة"
                            : "Icon"
                          : primaryMediaRole === "EMBLEM"
                            ? locale === "ar"
                              ? "شعار"
                              : "Emblem"
                            : primaryMediaRole === "SCENE"
                              ? locale === "ar"
                                ? "مشهد"
                                : "Scene"
                              : primaryMediaRole === "TIMELINE_ART"
                                ? locale === "ar"
                                  ? "فن زمني"
                                  : "Timeline art"
                                : primaryMediaRole === "THUMBNAIL"
                                  ? locale === "ar"
                                    ? "مصغّر"
                                    : "Thumbnail"
                                  : locale === "ar"
                                    ? "وسائط"
                                    : "Media"}
                  </span>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {SHOW_ADMIN_UI ? (
                  <Link
                    href={`/entities/${entity.slug}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm transition hover:bg-accent"
                  >
                    {t(locale, "edit")}
                  </Link>
                ) : null}
                {SHOW_ADMIN_UI ? (
                  <Link
                    href={`/entities/${entity.slug}/relationships`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm transition hover:bg-accent"
                  >
                    {t(locale, "relationships")}
                  </Link>
                ) : null}
                {SHOW_ADMIN_UI ? (
                  <Link
                    href={`/entities/${entity.slug}/archive`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm transition hover:bg-accent"
                  >
                    {t(locale, "archive")}
                  </Link>
                ) : null}
                {SHOW_ADMIN_UI ? (
                  <Link
                    href={`/entities/${entity.slug}/history`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm transition hover:bg-accent"
                  >
                    {t(locale, "history")}
                  </Link>
                ) : null}
                {SHOW_ADMIN_UI ? (
                  <Link
                    href={`/entities/${entity.slug}/delete`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm transition hover:bg-accent"
                  >
                    {t(locale, "delete")}
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1">
                  {getEntityStatusLabel(locale, entity.status)}
                </span>
                <span className="rounded-full border border-border px-3 py-1">
                  {getVisibilityLabel(locale, entity.visibility)}
                </span>
                {entity.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              {(entity.type === "STORY" || isExternallyContinuedArtifact) && externalLinks ? (
                <div className="mt-6 ms-panel-soft p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                      {entity.type === "ARTIFACT"
                        ? "Preview excerpt"
                        : locale === "ar"
                          ? "فصل معاينة"
                          : "Preview chapter"}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                      {locale === "ar" ? "قراءة خارجية" : "External reading"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {entity.type === "ARTIFACT"
                      ? "Read the excerpt here, then continue on the external platform for the full long-form artifact text."
                      : locale === "ar"
                        ? "اقرأ المعاينة هنا، ثم تابع على المنصة الخارجية إذا أردت إكمال القصة الطويلة."
                        : "Read the preview here, then continue on the external platform if you want the full long-form story."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {externalLinks.wattpad ? (
                      <a
                        href={externalLinks.wattpad}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm transition hover:bg-accent"
                      >
                        <WattpadMark />
                        <span>
                          {locale === "ar" ? "متابعة على Wattpad" : "Continue on Wattpad"}
                        </span>
                      </a>
                    ) : null}

                    {externalLinks.ao3 ? (
                      <a
                        href={externalLinks.ao3}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm transition hover:bg-accent"
                      >
                        <Ao3Mark />
                        <span>{locale === "ar" ? "متابعة على AO3" : "Continue on AO3"}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </Reveal>

        {isLongFormArtifact ? (
          <>
            <Reveal delay={0.08}>
              <section className="ms-panel-strong p-6">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
                  <h2 className="text-lg font-semibold">{t(locale, "contentSection")}</h2>
                  <p className="max-w-3xl text-sm text-muted-foreground">
                    {locale === "ar"
                      ? "عرض تجريبي كامل للنص الطويل كما تم استيراده، حتى يمكن تقييم ما إذا كان هذا الشكل مناسباً."
                      : "Experimental full display of the imported long-form text so you can judge whether showing it all at once is worth keeping."}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {entity.body ? `${entity.body.length.toLocaleString(locale === "ar" ? "ar" : "en")} characters` : null}
                  </p>
                </div>
                <div className="mt-6">
                  {entity.body ? renderLongFormBody(entity.body) : t(locale, "noBodyYet")}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.14}>
              <section className="ms-panel p-6">
                <h2 className="text-lg font-semibold">{t(locale, "details")}</h2>
                <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "slug")}</dt>
                    <dd>{entity.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "version")}</dt>
                    <dd>{entity.version}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "aliases")}</dt>
                    <dd>{entity.aliases.length > 0 ? entity.aliases.join(", ") : t(locale, "none")}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "searchKeywords")}</dt>
                    <dd>
                      {entity.searchKeywords.length > 0
                        ? entity.searchKeywords.join(", ")
                        : t(locale, "none")}
                    </dd>
                  </div>
                </dl>
              </section>
            </Reveal>
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal delay={0.08} className="lg:col-span-2">
              <section className="ms-panel p-6">
                <h2 className="text-lg font-semibold">
                  {isExternallyContinuedArtifact
                    ? "Preview excerpt"
                    : t(locale, "contentSection")}
                </h2>
                <div className="mt-4">
                  {isExternallyContinuedArtifact
                    ? entity.body
                      ? renderPreviewBody(entity.body)
                      : t(locale, "noBodyYet")
                    : (
                        <div className="whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                          {entity.body || t(locale, "noBodyYet")}
                        </div>
                      )}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.14}>
              <section className="ms-panel p-6">
                <h2 className="text-lg font-semibold">{t(locale, "details")}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "slug")}</dt>
                    <dd>{entity.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "aliases")}</dt>
                    <dd>
                      {entity.aliases.length > 0 ? entity.aliases.join(", ") : t(locale, "none")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "searchKeywords")}</dt>
                    <dd>
                      {entity.searchKeywords.length > 0
                        ? entity.searchKeywords.join(", ")
                        : t(locale, "none")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t(locale, "version")}</dt>
                    <dd>{entity.version}</dd>
                  </div>
                </dl>
              </section>
            </Reveal>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.18}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">{t(locale, "incomingRelationships")}</h2>
              <div className="mt-4 space-y-3">
                {entity.incomingRelationships.length > 0 ? (
                  entity.incomingRelationships.map((relationship) => (
                    <Link
                      key={relationship.id}
                      href={`/entities/${relationship.sourceEntity.slug}`}
                      className="block rounded-xl border border-border px-4 py-3 transition hover:bg-accent"
                    >
                      <p className="font-medium">{relationship.sourceEntity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getRelationshipLabel(relationship.type, locale, "incoming")}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "ar"
                      ? "لا توجد علاقات واردة بعد."
                      : "No incoming relationships yet."}
                  </p>
                )}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.24}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">{t(locale, "outgoingRelationships")}</h2>
              <div className="mt-4 space-y-3">
                {entity.outgoingRelationships.length > 0 ? (
                  entity.outgoingRelationships.map((relationship) => (
                    <Link
                      key={relationship.id}
                      href={`/entities/${relationship.targetEntity.slug}`}
                      className="block rounded-xl border border-border px-4 py-3 transition hover:bg-accent"
                    >
                      <p className="font-medium">{relationship.targetEntity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getRelationshipLabel(relationship.type, locale, "outgoing")}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "ar"
                      ? "لا توجد علاقات صادرة بعد."
                      : "No outgoing relationships yet."}
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
