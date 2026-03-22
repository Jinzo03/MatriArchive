import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Entity not found</p>
          <h1 className="text-3xl font-semibold tracking-tight">This entity does not exist</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            The slug you opened does not match any entity in the universe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/browse"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Browse Universe
          </Link>
          <Link href="/dashboard" className="text-sm underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}