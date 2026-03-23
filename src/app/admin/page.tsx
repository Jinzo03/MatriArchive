import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [entityCount, archivedCount, relationshipCount, revisionCount] = await Promise.all([
    prisma.entity.count(),
    prisma.entity.count({ where: { status: "ARCHIVED" } }),
    prisma.relationship.count(),
    prisma.entityRevision.count(),
  ]);

  const adminSections = [
    {
      title: "Dashboard",
      description: "System overview, maintenance shortcuts, and universe health.",
      href: "/admin",
    },
    {
      title: "Content",
      description: "Browse, archive, delete, and inspect universe content.",
      href: "/admin/content",
    },
    {
      title: "Analytics",
      description: "View basic counts and structural signals across the universe.",
      href: "/admin/analytics",
    },
    {
      title: "Settings",
      description: "Simple maintenance preferences and admin configuration.",
      href: "/admin/settings",
    },
    {
      title: "Logs",
      description: "Inspect recent changes, revision activity, and system notes.",
      href: "/admin/logs",
    },
    {
      title: "Support",
      description: "Basic support and maintenance notes for the project.",
      href: "/admin/support",
    },
    {
      title: "Import / Export",
      description: "Backup or restore the universe in JSON form.",
      href: "/admin/import-export",
    },
  ];

  const stats = [
    { label: "Entities", value: entityCount },
    { label: "Archived", value: archivedCount },
    { label: "Relationships", value: relationshipCount },
    { label: "Revisions", value: revisionCount },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel">
            <p className="text-sm text-muted-foreground">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Maintenance Hub</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              A lightweight control center for content, structure, logs, settings, and basic
              operational tasks.
            </p>

            <div className="mt-5">
              <AdminIndexNav />
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.03}>
              <div className="ms-panel-soft">
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
                className="block ms-panel-soft transition hover:bg-accent"
              >
                <p className="text-lg font-semibold">{section.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
              </Link>
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}