import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";
import { ImportLogLevel, ImportJobStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function levelBadgeClass(level: ImportLogLevel) {
  switch (level) {
    case "ERROR":
      return "border-red-500/30 bg-red-500/10 text-red-200";
    case "WARN":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "INFO":
      return "border-sky-500/30 bg-sky-500/10 text-sky-200";
    default:
      return "border-border bg-background/50 text-muted-foreground";
  }
}

function statusBadgeClass(status: ImportJobStatus) {
  switch (status) {
    case "SUCCEEDED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "FAILED":
      return "border-red-500/30 bg-red-500/10 text-red-200";
    case "RUNNING":
      return "border-sky-500/30 bg-sky-500/10 text-sky-200";
    case "PARTIAL":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    default:
      return "border-border bg-background/50 text-muted-foreground";
  }
}

export default async function AdminLogsPage() {
  const locale = await getRequestLocale();

  const [importJobs, recentLogs] = await Promise.all([
    prisma.importJob.findMany({
      orderBy: { startedAt: "desc" },
      take: 12,
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    }),
    prisma.importLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        importJob: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "الإدارة / السجلات" : "Admin / Logs"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "سجل العمليات" : "Activity Logs"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "راجع آخر عمليات الاستيراد، التحذيرات، والأحداث المهمة داخل النظام."
                : "Review recent imports, warnings, and important system activity."}
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
                {locale === "ar" ? "عمليات الاستيراد" : "Import jobs"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{importJobs.length}</p>
            </div>
          </Reveal>
          <Reveal delay={0.03}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "أحداث السجل" : "Recent log entries"}
              </p>
              <p className="mt-2 text-2xl font-semibold">{recentLogs.length}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "ناجح" : "Succeeded"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {importJobs.filter((job) => job.status === "SUCCEEDED").length}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "فاشل / جزئي" : "Failed / partial"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {importJobs.filter((job) => job.status === "FAILED" || job.status === "PARTIAL").length}
              </p>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.06}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "عمليات الاستيراد الأخيرة" : "Recent Import Jobs"}
              </h2>

              <div className="mt-4 space-y-3">
                {importJobs.length > 0 ? (
                  importJobs.map((job) => (
                    <div key={job.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.packageId} · {job.packageVersion}
                          </p>
                        </div>

                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-[11px]",
                            statusBadgeClass(job.status),
                          ].join(" ")}
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-4">
                        <span>+ {job.createdCount}</span>
                        <span>↺ {job.updatedCount}</span>
                        <span>≈ {job.skippedCount}</span>
                        <span>! {job.failedCount}</span>
                      </div>

                      {job.logs.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {job.logs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-start justify-between gap-4 rounded-lg border border-border/60 px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium">{log.stage ?? "LOG"}</p>
                                <p className="text-sm text-muted-foreground">{log.message}</p>
                              </div>
                              <span
                                className={[
                                  "rounded-full border px-2.5 py-1 text-[11px]",
                                  levelBadgeClass(log.level),
                                ].join(" ")}
                              >
                                {log.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "ar" ? "لا توجد عمليات استيراد بعد." : "No import jobs yet."}
                  </p>
                )}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "أحدث الأحداث" : "Latest Events"}
              </h2>

              <div className="mt-4 space-y-3">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{log.stage ?? "LOG"}</p>
                          <p className="text-sm text-muted-foreground">{log.message}</p>
                        </div>
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-[11px]",
                            levelBadgeClass(log.level),
                          ].join(" ")}
                        >
                          {log.level}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {log.importJob ? (
                          <span className="rounded-full border border-border px-3 py-1">
                            {log.importJob.title}
                          </span>
                        ) : null}
                        {log.entitySlug ? (
                          <span className="rounded-full border border-border px-3 py-1">
                            {log.entitySlug}
                          </span>
                        ) : null}
                        <span className="rounded-full border border-border px-3 py-1">
                          {new Date(log.createdAt).toLocaleString(locale === "ar" ? "ar" : "en")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "ar" ? "لا توجد أحداث بعد." : "No events yet."}
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