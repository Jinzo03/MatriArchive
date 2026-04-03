import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const locale = await getRequestLocale();

  const [entityCount, archivedCount, relationshipCount, revisionCount, importJobCount, mediaCount] =
    await Promise.all([
      prisma.entity.count(),
      prisma.entity.count({ where: { status: "ARCHIVED" } }),
      prisma.relationship.count(),
      prisma.entityRevision.count(),
      prisma.importJob.count(),
      prisma.mediaAsset.count(),
    ]);

  const adminSections = [
    {
      title: t(locale, "content"),
      description:
        locale === "ar"
          ? "تصفح المحتوى وأرشفه واحذفه وافحصه بسرعة."
          : "Browse, archive, delete, and inspect universe content.",
      href: "/admin/content",
    },
    {
      title: t(locale, "analytics"),
      description:
        locale === "ar"
          ? "اعرض الأعداد الأساسية والإشارات البنيوية عبر الكون."
          : "View basic counts and structural signals across the universe.",
      href: "/admin/analytics",
    },
    {
      title: t(locale, "settings"),
      description:
        locale === "ar"
          ? "تفضيلات الصيانة البسيطة وإعدادات الإدارة."
          : "Simple maintenance preferences and admin configuration.",
      href: "/admin/settings",
    },
    {
      title: t(locale, "logs"),
      description:
        locale === "ar"
          ? "راجع التغييرات الأخيرة ونشاط المراجعات وملاحظات النظام."
          : "Inspect recent changes, revision activity, and system notes.",
      href: "/admin/logs",
    },
    {
      title: t(locale, "support"),
      description:
        locale === "ar"
          ? "ملاحظات دعم وصيانة أساسية للمشروع."
          : "Basic support and maintenance notes for the project.",
      href: "/admin/support",
    },
    {
      title: t(locale, "importExport"),
      description:
        locale === "ar"
          ? "أنشئ نسخة احتياطية أو استعد الكون بصيغة JSON."
          : "Backup or restore the universe in JSON form.",
      href: "/admin/import-export",
    },
  ];

  const stats = [
    { label: t(locale, "entities"), value: entityCount },
    { label: t(locale, "archived"), value: archivedCount },
    { label: t(locale, "relationships"), value: relationshipCount },
    { label: t(locale, "revisions"), value: revisionCount },
    { label: locale === "ar" ? "عمليات الاستيراد" : "Import jobs", value: importJobCount },
    { label: locale === "ar" ? "الوسائط" : "Media assets", value: mediaCount },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "لوحة الإدارة" : "Admin Panel"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "مركز الصيانة" : "Maintenance Hub"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "مركز تحكم خفيف للمحتوى والبنية والسجلات والإعدادات ومهام التشغيل الأساسية."
                : "A lightweight control center for content, structure, logs, settings, and basic operational tasks."}
            </p>

            <div className="mt-5">
              <AdminIndexNav />
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.03}>
              <div className="ms-panel-soft p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminSections.map((section, index) => (
            <Reveal key={section.href} delay={index * 0.03}>
              <Link
                href={section.href}
                className="block ms-panel-soft p-5 transition hover:bg-accent"
              >
                <p className="text-lg font-semibold">{section.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
              </Link>
            </Reveal>
          ))}
        </section>

        <Reveal delay={0.12}>
          <section className="ms-panel p-6">
            <h2 className="text-lg font-semibold">
              {locale === "ar" ? "ملاحظات التشغيل" : "Operational Notes"}
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="font-medium">
                  {locale === "ar" ? "وضع الزوار" : "Guest mode"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "الواجهة العامة للزوار للقراءة فقط."
                    : "Public browsing stays read-only for guests."}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="font-medium">
                  {locale === "ar" ? "الاستيراد الآمن" : "Safe imports"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "الاستيراد يتم عبر dry-run ثم confirm-write."
                    : "Imports run through dry-run before confirm-write."}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="font-medium">
                  {locale === "ar" ? "المراجعات" : "Revisions"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "كل تعديل مهم يكتب نسخة جديدة في التاريخ."
                    : "Important edits create a new historical snapshot."}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="font-medium">
                  {locale === "ar" ? "الوسائط" : "Media"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "الصور اختيارية وتستخدم فقط عند الحاجة."
                    : "Images are optional and only used where useful."}
                </p>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}