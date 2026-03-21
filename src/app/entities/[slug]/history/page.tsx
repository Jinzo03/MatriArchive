import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EntityHistoryPage({ params }: PageProps) {
  const { slug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      type: true,
    },
  });

  if (!entity) notFound();

  const revisions = await prisma.entityRevision.findMany({
    where: { entityId: entity.id },
    orderBy: { version: "desc" },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">History</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{entity.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Type: {entity.type}</p>
          <div className="mt-4 flex gap-3">
            <Link href={`/entities/${entity.slug}`} className="text-sm underline">
              Back to entity
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Revisions</h2>

          <div className="mt-4 space-y-4">
            {revisions.length > 0 ? (
              revisions.map((revision) => (
                <article
                  key={revision.id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">Version {revision.version}</p>
                    <p className="text-xs text-muted-foreground">
                      {revision.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {revision.slug}
                  </p>

                  {revision.summary ? (
                    <p className="mt-2 text-sm">{revision.summary}</p>
                  ) : null}

                  {revision.body ? (
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                      {revision.body}
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border px-3 py-1">
                      {revision.status}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1">
                      {revision.visibility}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No revisions yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}