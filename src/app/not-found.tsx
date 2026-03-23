import Link from "next/link";
import { getRequestLocale } from "@/lib/locale.server";

export default async function NotFound() {
  const locale = await getRequestLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">404</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "ar" ? "الصفحة غير موجودة" : "Page not found"}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {locale === "ar"
              ? "الصفحة التي حاولت فتحها غير موجودة في هذا الكون."
              : "The page you tried to open does not exist in this universe."}
          </p>
        </div>

        <Link href="/dashboard" className="ms-button">
          {locale === "ar" ? "العودة إلى لوحة التحكم" : "Return to Dashboard"}
        </Link>
      </div>
    </main>
  );
}
