import Link from "next/link";
import { getEntityTypeLabel, t } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { EntityType } from "@/generated/prisma/client";
import { Reveal } from "@/components/reveal";

export default async function CreateIndexPage() {
  const locale = await getRequestLocale();
  const createOptions = [
    { type: EntityType.CHARACTER, href: "/create/character" },
    { type: EntityType.STORY, href: "/create/story" },
    { type: EntityType.INSTITUTION, href: "/create/institution" },
    { type: EntityType., href: "/create/" },
    { type: EntityType.DOCTRINE, href: "/create/doctrine" },
    { type: EntityType.EVENT, href: "/create/event" },
    { type: EntityType.TERM, href: "/create/term" },
    { type: EntityType.ARTIFACT, href: "/create/artifact" },
    { type: EntityType.OTHER, href: "/create/other" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        
        {/* FIXED: Removed the undefined map. Just wrap the header once. */}
        <section>
          <Reveal delay={0}>
            <p className="text-sm text-muted-foreground">{t(locale, "create")}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t(locale, "chooseType")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "اختر نوع العنصر الذي تريد إنشاءه داخل الكون."
                : "Select what kind of entity you want to create in the universe."}
            </p>
          </Reveal>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {createOptions.map((option, index) => {
            const label = getEntityTypeLabel(locale, option.type);

            return (
              /* FIXED: Added Reveal here so your cards stagger in beautifully! */
              <Reveal key={option.href} delay={index * 0.05}>
                <Link
                  href={option.href}
                  className="block h-full rounded-xl border border-border p-5 transition hover:bg-accent ms-panel-soft"
                >
                  <p className="text-lg font-semibold">{label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === "ar" ? `أنشئ ${label} جديدة.` : `Create a new ${label.toLowerCase()}.`}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </section>
        
      </div>
    </main>
  );
}