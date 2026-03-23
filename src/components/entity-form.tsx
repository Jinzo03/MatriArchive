"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/components/locale-provider";
import { t, getEntityStatusLabel, getVisibilityLabel } from "@/lib/locale";

type EntityFormMode = "create" | "edit";

type EntityFormValues = {
  title?: string;
  slug?: string;
  summary?: string | null;
  body?: string | null;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED" | "DEPRECATED";
  visibility?: "PRIVATE" | "SHARED" | "PUBLIC";
  aliases?: string[];
  tags?: string[];
  searchKeywords?: string[];
};

type EntityFormProps = {
  mode: EntityFormMode;
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void>;
  values?: EntityFormValues;
  footer?: ReactNode;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`ms-input ${props.className ?? ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`ms-textarea ${props.className ?? ""}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`ms-input ${props.className ?? ""}`} />;
}

export function EntityForm({
  mode,
  title,
  description,
  submitLabel,
  onSubmit,
  values,
  footer,
}: EntityFormProps) {
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? t(locale, "createEntity") : t(locale, "editEntity")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </section>

        <form action={onSubmit} className="ms-panel space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <FieldLabel>{t(locale, "title")}</FieldLabel>
              <Input name="title" defaultValue={values?.title ?? ""} required placeholder={t(locale, "enterTitle")} />
            </label>

            <label className="space-y-2">
              <FieldLabel>{t(locale, "slug")}</FieldLabel>
              <Input name="slug" defaultValue={values?.slug ?? ""} placeholder={t(locale, "optionalSlug")} />
            </label>
          </div>

          <label className="block space-y-2">
            <FieldLabel>{t(locale, "summary")}</FieldLabel>
            <Textarea name="summary" rows={3} defaultValue={values?.summary ?? ""} placeholder={t(locale, "shortDescription")} />
          </label>

          <label className="block space-y-2">
            <FieldLabel>{t(locale, "body")}</FieldLabel>
            <Textarea name="body" rows={10} defaultValue={values?.body ?? ""} placeholder={t(locale, "mainContent")} />
          </label>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2">
              <FieldLabel>{t(locale, "status")}</FieldLabel>
              <Select name="status" defaultValue={values?.status ?? "DRAFT"}>
                <option value="DRAFT">{getEntityStatusLabel(locale, "DRAFT")}</option>
                <option value="ACTIVE">{getEntityStatusLabel(locale, "ACTIVE")}</option>
                <option value="ARCHIVED">{getEntityStatusLabel(locale, "ARCHIVED")}</option>
                <option value="DEPRECATED">{getEntityStatusLabel(locale, "DEPRECATED")}</option>
              </Select>
            </label>

            <label className="space-y-2">
              <FieldLabel>{t(locale, "visibility")}</FieldLabel>
              <Select name="visibility" defaultValue={values?.visibility ?? "PRIVATE"}>
                <option value="PRIVATE">{getVisibilityLabel(locale, "PRIVATE")}</option>
                <option value="SHARED">{getVisibilityLabel(locale, "SHARED")}</option>
                <option value="PUBLIC">{getVisibilityLabel(locale, "PUBLIC")}</option>
              </Select>
            </label>

            <label className="space-y-2">
              <FieldLabel>{t(locale, "aliases")}</FieldLabel>
              <Input
                name="aliases"
                defaultValue={(values?.aliases ?? []).join(", ")}
                placeholder={t(locale, "commaSeparatedAliases")}
              />
            </label>

            <label className="space-y-2">
              <FieldLabel>{t(locale, "tags")}</FieldLabel>
              <Input
                name="tags"
                defaultValue={(values?.tags ?? []).join(", ")}
                placeholder={t(locale, "commaSeparatedTags")}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <FieldLabel>{t(locale, "searchKeywords")}</FieldLabel>
            <Input
              name="searchKeywords"
              defaultValue={(values?.searchKeywords ?? []).join(", ")}
              placeholder={t(locale, "commaSeparatedKeywords")}
            />
          </label>

          {footer ? <div>{footer}</div> : null}

          <div className="flex items-center justify-end gap-3">
            <button type="submit" className="ms-button">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
