import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

const supportBlocks = [
  {
    title: "Maintenance checklist",
    items: [
      "Use archive before delete whenever possible.",
      "Review relationships after major edits.",
      "Keep imports/export JSON backups in a safe place.",
      "Check revisions before restoring old states.",
    ],
  },
  {
    title: "Recommended workflow",
    items: [
      "Create entities first.",
      "Link them into the universe graph.",
      "Use history when edits need recovery.",
      "Use logs to review recent structural changes.",
    ],
  },
  {
    title: "Emergency actions",
    items: [
      "Restore from revision history.",
      "Re-import a saved JSON export.",
      "Archive unstable content instead of deleting it.",
      "Use browse/search to verify data health quickly.",
    ],
  },
];

export default function AdminSupportPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel">
            <p className="text-sm text-muted-foreground">Admin / Support</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Support</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Practical notes for maintenance, recovery, and safe universe editing.
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
          {supportBlocks.map((block, index) => (
            <Reveal key={block.title} delay={index * 0.03}>
              <div className="ms-panel-soft">
                <h2 className="text-lg font-semibold">{block.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {block.items.map((item) => (
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