import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { EntityStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArchiveEntityPage({ params }: PageProps) {
  const { slug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      type: true,
    },
  });

  if (!entity) notFound();

  const isArchived = entity.status === EntityStatus.ARCHIVED;

  async function toggleArchive() {
    "use server";
  if (!entity) return;
    await prisma.entity.update({
      where: { slug: entity.slug },
      data: {
        status: isArchived ? EntityStatus.ACTIVE : EntityStatus.ARCHIVED,
        version: { increment: 1 },
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/browse");
    revalidatePath("/search");
    revalidatePath(`/entities/${entity.slug}`);
    revalidatePath(`/entities/${entity.slug}/edit`);
    revalidatePath(`/entities/${entity.slug}/relationships`);
    revalidatePath(`/entities/${entity.slug}/history`);
    redirect(`/entities/${entity.slug}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel">
            <p className="text-sm text-muted-foreground">Archive</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{entity.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Current status: {entity.status}
            </p>
            <div className="mt-4">
              <Link href={`/entities/${entity.slug}`} className="text-sm underline">
                Back to entity
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="ms-panel">
            <form action={toggleArchive} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isArchived
                  ? "This entity is archived. Restore it to make it active again."
                  : "This entity is active. Archive it to keep it out of the main active flow without deleting it."}
              </p>

              <button
                type="submit"
                className="ms-button"
              >
                {isArchived ? "Unarchive" : "Archive"}
              </button>
            </form>
          </section>
        </Reveal>
      </div>
    </main>
  );
}