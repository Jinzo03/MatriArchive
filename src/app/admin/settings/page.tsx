import Link from "next/link";
import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";
import { AdminIndexNav } from "@/components/admin-index-nav";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const locale = await getRequestLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section className="ms-panel p-6">
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "الإدارة / الإعدادات" : "Admin / Settings"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {locale === "ar" ? "إعدادات الموقع" : "Site Settings"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "إعدادات التشغيل العامة، وضع العرض، والخيارات الأساسية للنسخة الأولى."
                : "General operational settings, viewer mode, and the core V1 options."}
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
                {locale === "ar" ? "وضع التشغيل" : "Operating mode"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "Viewer" : "Viewer"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "عرض فقط بدون إنشاء أو تعديل."
                  : "Read-only public browsing with no write access."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.03}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "اللغة الافتراضية" : "Default language"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "العربية / English" : "Arabic / English"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "مفتاح التبديل يحدد لغة الواجهة."
                  : "The locale toggle controls the interface language."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الاستيراد" : "Importing"}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {locale === "ar" ? "آمن" : "Safe"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "الاستيراد يتم عبر dry-run ثم confirm-write."
                  : "Imports run through dry-run first, then confirm-write."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.09}>
            <div className="ms-panel-soft p-4">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "الأقسام" : "Sections"}
              </p>
              <p className="mt-2 text-2xl font-semibold">7</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "لوحة، محتوى، تحليلات، إعدادات، دعم، سجلات، استيراد/تصدير."
                  : "Dashboard, Content, Analytics, Settings, Support, Logs, Import/Export."}
              </p>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.06}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "خيارات التشغيل" : "Operational Options"}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "الوضع العام" : "Public mode"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "الزوار يتصفحون الكون كضيوف فقط."
                      : "Visitors browse as guests only."}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "الكتابة" : "Writing access"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "معطلة في النسخة العامة."
                      : "Disabled in the public build."}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {locale === "ar" ? "النسخ الاحتياطي" : "Backups"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {locale === "ar"
                      ? "يتم عبر التصدير JSON من صفحة Import/Export."
                      : "Handled through JSON export in Import/Export."}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className="ms-panel p-6">
              <h2 className="text-lg font-semibold">
                {locale === "ar" ? "ملاحظات مهمة" : "Important Notes"}
              </h2>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>
                  {locale === "ar"
                    ? "لا توجد حسابات مستخدمين في V1، لذلك هذه الإعدادات تخص النظام نفسه."
                    : "There are no user accounts in V1, so these settings apply to the system itself."}
                </p>
                <p>
                  {locale === "ar"
                    ? "أي وظيفة كتابة يجب أن تبقى مقفلة في الواجهة العامة ومحمية على مستوى الخادم."
                    : "Any write functionality should stay blocked in the public UI and protected server-side."}
                </p>
                <p>
                  {locale === "ar"
                    ? "يمكن توسيع هذه الصفحة لاحقًا إلى مفاتيح حقيقية في قاعدة البيانات."
                    : "This page can later expand into real database-backed settings keys."}
                </p>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}