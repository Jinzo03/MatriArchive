import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

const settingsGroups = [
  {
    title: "General",
    items: [
      "Dashboard theme and layout defaults",
      "Default visibility for new entries",
      "Archive behavior and maintenance rules",
    ],
  },
  {
    title: "Content",
    items: [
      "Required fields for entities",
      "Slug and title conventions",
      "Revision tracking preferences",
    ],
  },
  {
    title: "Maintenance",
    items: [
      "Import/export permissions",
      "Deletion safeguards",
      "Admin-only operations",
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="rounded-2xl border border-border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Admin / Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Basic admin preferences and maintenance rules for the universe.
            </p>
            <div className="mt-4">
              <Link href="/admin" className="text-sm underline">
                Back to Admin Hub
              </Link>
            </div>

            <div className="mt-5">
              <AdminIndexNav />
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.03}>
              <div className="rounded-2xl border border-border p-5 shadow-sm">
                <h2 className="text-lg font-semibold">{group.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-xl border border-dashed border-border px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}