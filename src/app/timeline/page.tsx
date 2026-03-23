import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const locale = await getRequestLocale();
  const events = await prisma.entity.findMany({
    where: { type: "EVENT" },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      body: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section>
            <p className="text-sm text-muted-foreground">{t(locale, "timeline")}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t(locale, "historicalFlow")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t(locale, "timelineIntro")}</p>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="ms-panel">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">{t(locale, "events")}</h2>
              <span className="text-sm text-muted-foreground">
                {events.length} {t(locale, "total")}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Reveal key={event.id} delay={index * 0.03}>
                    <Link
                      href={`/entities/${event.slug}`}
                      className="block rounded-xl border border-border p-4 transition hover:bg-accent"
                    >
                      <p className="font-medium">{event.title}</p>
                      {event.summary ? (
                        <p className="mt-1 text-sm text-muted-foreground">{event.summary}</p>
                      ) : null}
                    </Link>
                  </Reveal>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "لا توجد أحداث بعد. أنشئ أول حدث لتبدأ بناء الخط الزمني."
                    : "No events yet. Create your first event to start building the timeline."}
                </div>
              )}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
