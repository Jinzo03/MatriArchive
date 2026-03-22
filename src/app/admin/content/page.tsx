import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [entities, archived, relationships, revisions] = await Promise.all([
    prisma.entity.count(),
    prisma.entity.count({ where: { status: "ARCHIVED" } }),
    prisma.relationship.count(),
    prisma.entityRevision.count(),
  ]);

  const recent = await prisma.entity.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      status: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="rounded-2xl border border-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Admin / Content</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Content Maintenance</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Inspect the universe, keep content clean, and jump into entity maintenance quickly.
            </p>
            <div className="mt-4">
              <Link href="/admin" className="text-sm underline">
                Back to Admin Hub
              </Link>
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Entities", value: entities },
            { label: "Archived", value: archived },
            { label: "Relationships", value: relationships },
            { label: "Revisions", value: revisions },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.03}>
              <div className="rounded-2xl border border-border p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal delay={0.08}>
          <section className="rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Recent Content</h2>
              <Link href="/browse" className="text-sm text-muted-foreground hover:underline">
                Open browse
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recent.map((item) => (
                <Link
                  key={item.id}
                  href={`/entities/${item.slug}`}
                  className="block rounded-xl border border-border p-4 transition hover:bg-accent"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}