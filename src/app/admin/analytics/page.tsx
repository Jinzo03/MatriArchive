import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [
    entityCount,
    archivedCount,
    relationshipCount,
    revisionCount,
    recentCount,
  ] = await Promise.all([
    prisma.entity.count(),
    prisma.entity.count({ where: { status: "ARCHIVED" } }),
    prisma.relationship.count(),
    prisma.entityRevision.count(),
    prisma.entity.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      },
    }),
  ]);

  const metrics = [
    { label: "Total Entities", value: entityCount },
    { label: "Archived Entities", value: archivedCount },
    { label: "Relationships", value: relationshipCount },
    { label: "Revisions", value: revisionCount },
    { label: "Updated This Week", value: recentCount },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="rounded-2xl border border-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Admin / Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Analytics</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Simple structural signals and usage counts for the universe.
            </p>
            <div className="mt-4">
              <Link href="/admin" className="text-sm underline">
                Back to Admin Hub
              </Link>
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.03}>
              <div className="rounded-2xl border border-border p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal delay={0.12}>
          <section className="rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">What this page is for</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              This is the first analytics layer: counts, activity, and basic health signals.
              Later it can grow into charts, growth trends, content breakdowns, and maintenance
              alerts.
            </p>
          </section>
        </Reveal>
      </div>
    </main>
  );
}