import Link from "next/link";

export const dynamic = "force-dynamic";

const highlights = [
  "Connected lore archive",
  "Creator workspace",
  "Searchable universe graph",
];

export default function SplashPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.16),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.02),transparent)]" />
      <div className="absolute left-[-8rem] top-[-8rem] -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-6rem] -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between gap-4 rounded-full border border-border/70 bg-background/60 px-5 py-3 backdrop-blur">
          <p className="text-sm font-medium tracking-wide">Matriarchal Shari&apos;ah</p>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90"
          >
            Enter Dashboard
          </Link>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                A living universe platform for lore, structure, and creation
              </div>

              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">Welcome to the archive</p>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
                  Build, navigate, and preserve your universe.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  Matriarchal Shari&apos;ah is your connected world engine: a place to shape lore,
                  link characters and institutions, search everything, and grow a living canon.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-foreground px-6 text-sm font-medium text-background transition hover:opacity-90"
                >
                  Enter the Dashboard
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-border px-6 text-sm font-medium transition hover:bg-accent"
                >
                  Browse Universe
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-background/70 p-6 shadow-sm backdrop-blur">
                <p className="text-sm text-muted-foreground">What you can do</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="font-medium">Create</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add characters, stories, institutions, places, and concepts.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="font-medium">Connect</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Link everything into a navigable universe graph.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="font-medium">Preserve</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep revisions, history, and exports for long-term growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-foreground p-6 text-background shadow-lg">
                <p className="text-sm/6 text-background/80">A calm entry point before the workspace</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  Step inside when you are ready.
                </p>
                <p className="mt-2 text-sm leading-6 text-background/80">
                  The dashboard waits behind a single click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
