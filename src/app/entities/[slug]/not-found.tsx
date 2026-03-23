import Link from "next/link";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";

export default async function NotFound() {
  const locale = await getRequestLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t(locale, "entityNotFound")}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t(locale, "thisEntityDoesNotExist")}</h1>
          <p className="max-w-xl text-sm text-muted-foreground">{t(locale, "slugDoesNotMatch")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/browse" className="ms-button">
            {t(locale, "browseUniverse")}
          </Link>
          <Link href="/dashboard" className="text-sm underline">
            {t(locale, "returnToDashboard")}
          </Link>
        </div>
      </div>
    </main>
  );
}
