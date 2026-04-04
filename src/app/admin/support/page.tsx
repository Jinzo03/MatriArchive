import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOW_ADMIN_UI } from "@/lib/app-flags";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  if (!SHOW_ADMIN_UI) {
    notFound();
  }

  const locale = await getRequestLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "الإدارة / الدعم" : "Admin / Support"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "الدعم والتشغيل" : "Support & Operations"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "دليل سريع للمشاكل الشائعة، الاستعادة، والنشر."
                : "A quick guide for common issues, recovery, and deployment."}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Link href="/admin" className="text-sm underline">
                {t(locale, "backToAdminHub")}
              </Link>
              <AdminIndexNav />
            </div>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Reveal>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "النسخ الاحتياطي" : "Backup"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "JSON" : "JSON"}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.03}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الاستعادة" : "Restore"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "dry-run" : "dry-run"}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الوصول" : "Access"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "ضيوف" : "Guests"}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الحالة" : "Status"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "مستقر" : "Stable"}
              </p>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.06}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "مشاكل شائعة" : "Common Issues"}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "عنصر لا يظهر" : "An entity does not appear"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "تحقق من الـ slug، الحالة، والروابط."
                      : "Check the slug, status, and relations."}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "الاستيراد فشل" : "Import failed"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "راجع dry-run أولاً، ثم logs، ثم أعد المحاولة."
                      : "Review dry-run first, then logs, then retry."}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "صورة مفقودة" : "Missing image"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "تأكد من أن ملف الصورة موجود داخل public/media."
                      : "Make sure the image file exists inside public/media."}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "خطوات الاستعادة" : "Recovery Steps"}
              </h2>

              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="rounded-xl border border-border p-4">
                  {locale === "ar"
                    ? "1. افحص السجلات في صفحة Logs."
                    : "1. Check the logs page first."}
                </li>
                <li className="rounded-xl border border-border p-4">
                  {locale === "ar"
                    ? "2. راجع Import/Export على شكل dry-run قبل أي كتابة."
                    : "2. Run Import/Export in dry-run mode before any write."}
                </li>
                <li className="rounded-xl border border-border p-4">
                  {locale === "ar"
                    ? "3. تأكد من العلاقات المفقودة أو الأسماء غير المطابقة."
                    : "3. Check for missing relations or slug mismatches."}
                </li>
                <li className="rounded-xl border border-border p-4">
                  {locale === "ar"
                    ? "4. إن لزم، أعد الاستيراد من ملف JSON المصحح."
                    : "4. If needed, re-import from the corrected JSON package."}
                </li>
              </ol>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
