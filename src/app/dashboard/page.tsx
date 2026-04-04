import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SHOW_ADMIN_UI } from "@/lib/app-flags";
import { getEntityTypeLabel, t } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { PageHeader } from "@/components/page-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardCta } from "@/components/dashboard-cta";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const locale = await getRequestLocale();
  const [characters, stories, institutions, locations, recentItems] = await Promise.all([
    prisma.entity.count({ where: { type: "CHARACTER" } }),
    prisma.entity.count({ where: { type: "STORY" } }),
    prisma.entity.count({ where: { type: "INSTITUTION" } }),
    prisma.entity.count({ where: { type: "LOCATION" } }),
    prisma.entity.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        updatedAt: true,
      },
    }),
  ]);

  const quickStats = [
    { label: locale === "ar" ? "الشخصيات" : "Characters", value: characters },
    { label: locale === "ar" ? "القصص" : "Stories", value: stories },
    { label: locale === "ar" ? "المؤسسات" : "Institutions", value: institutions },
    { label: locale === "ar" ? "الأماكن" : "Locations", value: locations },
  ];

  const quickActions = [
    ...(SHOW_ADMIN_UI
      ? [
          {
            label: locale === "ar" ? "شخصية جديدة" : "New Character",
            href: "/create/character",
          },
          {
            label: locale === "ar" ? "قصة جديدة" : "New Story",
            href: "/create/story",
          },
          {
            label: locale === "ar" ? "مؤسسة جديدة" : "New Institution",
            href: "/create/institution",
          },
          {
            label: locale === "ar" ? "افتح الخط الزمني" : "Open Timeline",
            href: "/timeline",
          },
        ]
      : []),
    ...(SHOW_ADMIN_UI
      ? [
          { label: t(locale, "importExport"), href: "/admin/import-export" },
          {
            label: locale === "ar" ? "مركز الإدارة" : "Admin Hub",
            href: "/admin",
          },
        ]
      : []),
  ];

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="MatriArchive"
        title={t(locale, "dashboardTitle")}
        description={t(locale, "dashboardIntro")}
      />
      {SHOW_ADMIN_UI ? (
        <div className="mt-4">
          <DashboardCta />
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="ms-panel-soft">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="ms-panel-soft lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">{t(locale, "recentItems")}</h2>
            <Link href="/browse" className="text-sm text-muted-foreground hover:underline">
              {t(locale, "browseAll")}
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentItems.map((item) => (
              <Link
                key={item.id}
                href={`/entities/${item.slug}`}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {getEntityTypeLabel(locale, item.type)}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{t(locale, "open")}</span>
              </Link>
            ))}
          </div>
        </div>

        {SHOW_ADMIN_UI ? (
          <div className="ms-panel-soft">
            <h2 className="text-lg font-semibold">{t(locale, "quickActions")}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-accent"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </DashboardShell>
  );
}
