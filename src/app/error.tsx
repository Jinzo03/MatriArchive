"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DatabaseUnavailableState } from "@/components/database-unavailable-state";
import { isDatabaseUnavailableError } from "@/lib/database-errors";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/ar") ? "ar" : "en";

  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isDatabaseUnavailableError(error)) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
          <DatabaseUnavailableState locale={locale} />
          <div className="flex">
            <button type="button" onClick={() => unstable_retry()} className="ms-button-ghost">
              {locale === "ar" ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <section className="ms-panel p-6">
          <h2 className="text-lg font-semibold">
            {locale === "ar" ? "حدث خطأ غير متوقع" : "Something went wrong"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === "ar"
              ? "يمكنك إعادة المحاولة، أو العودة إلى الصفحة الرئيسية."
              : "You can try again, or return to the home page."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => unstable_retry()} className="ms-button">
              {locale === "ar" ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
