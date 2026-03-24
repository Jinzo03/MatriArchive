import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  EntityStatus,
  EntityType,
  Visibility,
} from "@/generated/prisma/client";
import { getRequestLocale } from "@/lib/locale.server";
import {
  getEntityTypeLabel,
  t,
} from "@/lib/locale";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMetadata(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("Metadata must be valid JSON.");
  }
}

export default async function EditEntityPage({ params }: PageProps) {
  const locale = await getRequestLocale();
  const { slug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug },
    select: {
      id: true,
      type: true,
      title: true,
      slug: true,
      summary: true,
      body: true,
      status: true,
      visibility: true,
      aliases: true,
      tags: true,
      searchKeywords: true,
      metadata: true,
      version: true,
    },
  });

  if (!entity) notFound();

  async function updateEntity(formData: FormData) {
    "use server";
  if (!entity) return;

    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;

    const slugInput = String(formData.get("slug") ?? "").trim();
    const nextSlug = slugInput || slugify(title);
    const summary = String(formData.get("summary") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const status = String(formData.get("status") ?? "DRAFT") as EntityStatus;
    const visibility = String(formData.get("visibility") ?? "PRIVATE") as Visibility;
    const metadata = parseMetadata(formData.get("metadata"));

    const aliases = splitList(formData.get("aliases"));
    const tags = splitList(formData.get("tags"));
    const searchKeywords = splitList(formData.get("searchKeywords"));

    const updated = await prisma.$transaction(async (tx) => {
      const updatedEntity = await tx.entity.update({
        where: { id: entity.id },
        data: {
          title,
          slug: nextSlug,
          summary: summary || null,
          body: body || null,
          status,
          visibility,
          aliases,
          tags,
          searchKeywords,
          metadata,
          version: { increment: 1 },
        },
      });

      await tx.entityRevision.create({
        data: {
          entityId: updatedEntity.id,
          version: updatedEntity.version,
          title: updatedEntity.title,
          slug: updatedEntity.slug,
          summary: updatedEntity.summary,
          body: updatedEntity.body,
          status: updatedEntity.status,
          visibility: updatedEntity.visibility,
          aliases: updatedEntity.aliases,
          tags: updatedEntity.tags,
          searchKeywords: updatedEntity.searchKeywords,
          metadata: updatedEntity.metadata,
        },
      });

      return updatedEntity;
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/browse");
    revalidatePath("/search");
    revalidatePath("/timeline");
    revalidatePath(`/entities/${slug}`);
    revalidatePath(`/entities/${updated.slug}`);
    revalidatePath(`/entities/${updated.slug}/history`);
    revalidatePath(`/entities/${updated.slug}/relationships`);
    revalidatePath(`/entities/${updated.slug}/archive`);
    revalidatePath(`/entities/${updated.slug}/delete`);
    redirect(`/entities/${updated.slug}`);
  }

  const typeLabels: Record<EntityType, string> = {
    CHARACTER: locale === "ar" ? "شخصية" : "Character",
    STORY: locale === "ar" ? "قصة" : "Story",
    INSTITUTION: locale === "ar" ? "مؤسسة" : "Institution",
    LOCATION: locale === "ar" ? "موقع" : "Location",
    DOCTRINE: locale === "ar" ? "عقيدة" : "Doctrine",
    EVENT: locale === "ar" ? "حدث" : "Event",
    TERM: locale === "ar" ? "مصطلح" : "Term",
    ARTIFACT: locale === "ar" ? "أثر" : "Artifact",
    OTHER: locale === "ar" ? "أخرى" : "Other",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <PageHeader
              eyebrow={locale === "ar" ? "تعديل عنصر" : "Edit Entity"}
              title={`${locale === "ar" ? "تعديل" : "Edit"} ${typeLabels[entity.type]}`}
              description={
                locale === "ar"
                  ? "حدّث هذا العنصر مع الحفاظ على الترابط، المراجعات، والبيانات الوصفية."
                  : "Update this entity and keep the universe connected, versioned, and metadata-aware."
              }
              framed={false}
            />

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                v{entity.version}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {getEntityTypeLabel(locale, entity.type)}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {entity.status}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {entity.visibility}
              </span>
            </div>
          </section>
        </Reveal>

        <form action={updateEntity} className="ms-panel space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "title")}</span>
              <input
                name="title"
                defaultValue={entity.title}
                required
                className="ms-input"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "slug")}</span>
              <input
                name="slug"
                defaultValue={entity.slug}
                className="ms-input"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">{t(locale, "summary")}</span>
            <textarea
              name="summary"
              rows={3}
              defaultValue={entity.summary ?? ""}
              className="ms-textarea"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">{t(locale, "body")}</span>
            <textarea
              name="body"
              rows={10}
              defaultValue={entity.body ?? ""}
              className="ms-textarea"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "status")}</span>
              <select
                name="status"
                defaultValue={entity.status}
                className="ms-input"
              >
                <option value="DRAFT">{locale === "ar" ? "مسودة" : "Draft"}</option>
                <option value="ACTIVE">{locale === "ar" ? "نشط" : "Active"}</option>
                <option value="ARCHIVED">{locale === "ar" ? "مؤرشف" : "Archived"}</option>
                <option value="DEPRECATED">{locale === "ar" ? "قديم" : "Deprecated"}</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "visibility")}</span>
              <select
                name="visibility"
                defaultValue={entity.visibility}
                className="ms-input"
              >
                <option value="PRIVATE">{locale === "ar" ? "خاص" : "Private"}</option>
                <option value="SHARED">{locale === "ar" ? "مشترك" : "Shared"}</option>
                <option value="PUBLIC">{locale === "ar" ? "عام" : "Public"}</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "aliases")}</span>
              <input
                name="aliases"
                defaultValue={entity.aliases.join(", ")}
                className="ms-input"
                placeholder={locale === "ar" ? "أسماء بديلة مفصولة بفواصل" : "Comma-separated aliases"}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">{t(locale, "tags")}</span>
              <input
                name="tags"
                defaultValue={entity.tags.join(", ")}
                className="ms-input"
                placeholder={locale === "ar" ? "وسوم مفصولة بفواصل" : "Comma-separated tags"}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">{t(locale, "searchKeywords")}</span>
            <input
              name="searchKeywords"
              defaultValue={entity.searchKeywords.join(", ")}
              className="ms-input"
              placeholder={locale === "ar" ? "كلمات مفتاحية مفصولة بفواصل" : "Comma-separated keywords"}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              {locale === "ar" ? "البيانات الوصفية JSON" : "Metadata JSON"}
            </span>
            <textarea
              name="metadata"
              rows={8}
              defaultValue={entity.metadata ? JSON.stringify(entity.metadata, null, 2) : ""}
              className="ms-textarea font-mono text-xs"
              placeholder={
                locale === "ar"
                  ? '{\n  "externalLinks": {\n    "wattpad": "https://...",\n    "ao3": "https://..."\n  }\n}'
                  : '{\n  "externalLinks": {\n    "wattpad": "https://...",\n    "ao3": "https://..."\n  }\n}'
              }
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button type="submit" className="ms-button">
              {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
