import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEntityTypeLabel, t } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = await getRequestLocale();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = query
    ? await prisma.entity.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { summary: { contains: query, mode: "insensitive" } },
            { body: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { aliases: { has: query } },
            { tags: { has: query } },
            { searchKeywords: { has: query } },
          ],
        },
        orderBy: [{ updatedAt: "desc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          summary: true,
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section>
            <p className="text-sm text-muted-foreground">{t(locale, "searchUniverse")}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t(locale, "findAnything")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t(locale, "searchIntro")}</p>
          </section>
        </Reveal>

        <Reveal delay={0.06}>
          <form className="flex flex-col gap-3 md:flex-row" action="/search">
            <input
              name="q"
              defaultValue={query}
              placeholder={locale === "ar" ? "ابحث في الكون..." : "Search the universe..."}
              className="ms-input"
            />
            <button type="submit" className="ms-button">
              {t(locale, "search")}
            </button>
          </form>
        </Reveal>

        {query ? (
          <Reveal delay={0.1}>
            <section className="ms-panel">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">{t(locale, "results")}</h2>
                <span className="text-sm text-muted-foreground">
                  {results.length} {t(locale, "found")}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <Reveal key={item.id} delay={index * 0.03}>
                      <Link
                        href={`/entities/${item.slug}`}
                        className="block rounded-xl border border-border p-4 transition hover:bg-accent"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-medium">{item.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {getEntityTypeLabel(locale, item.type)}
                          </span>
                        </div>
                        {item.summary ? (
                          <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                        ) : null}
                      </Link>
                    </Reveal>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    <p>
                      {t(locale, "noResultsFor")} &quot;{query}&quot;.
                    </p>
                    <p className="mt-2">
                      {t(locale, "tryAnotherTerm")}{" "}
                      <Link href="/browse" className="underline">
                        {t(locale, "browseUniverseLower")}
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <section className="ms-panel text-sm text-muted-foreground">
              {t(locale, "enterSearchTerm")}{" "}
              <Link href="/browse" className="underline">
                {t(locale, "browseUniverseLower")}
              </Link>
              .
            </section>
          </Reveal>
        )}
      </div>
    </main>
  );
}
