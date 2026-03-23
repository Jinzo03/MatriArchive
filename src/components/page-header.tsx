import Link from "next/link";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  framed?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  framed = true,
}: PageHeaderProps) {
  return (
    <section className={framed ? "ms-panel" : ""}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>

        {actionHref && actionLabel ? (
          <Link href={actionHref} className="ms-button">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
