import Link from "next/link";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>

        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}