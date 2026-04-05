import Link from "next/link";

type DatabaseUnavailableStateProps = {
  locale: string;
  compact?: boolean;
  title?: string;
  detail?: string;
};

export function DatabaseUnavailableState({
  locale,
  compact = false,
  title,
  detail,
}: DatabaseUnavailableStateProps) {
  const isArabic = locale === "ar";

  const heading =
    title ??
    (isArabic ? "قاعدة البيانات غير متاحة حالياً" : "Database temporarily unavailable");

  const description =
    detail ??
    (isArabic
      ? "هذا القسم يحتاج اتصالاً بقاعدة البيانات. أضف عنوان Postgres مستضافاً في بيئة النشر لكي يعمل بالكامل."
      : "This section needs a database connection. Add a hosted Postgres connection string in your deployment environment to make it fully work.");

  return (
    <section className={`ms-panel ${compact ? "p-5" : "p-6"}`}>
      <h2 className="text-lg font-semibold">{heading}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/" className="ms-button">
          {isArabic ? "العودة إلى الرئيسية" : "Go home"}
        </Link>
        <Link href="/timeline" className="ms-button-ghost">
          {isArabic ? "فتح الخط الزمني" : "Open timeline"}
        </Link>
      </div>
    </section>
  );
}
