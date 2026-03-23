"use client";

import type { ReactNode } from "react";

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
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? "Create Entity" : "Edit Entity"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </section>

        <form action={onSubmit} className="ms-panel space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <FieldLabel>Title</FieldLabel>
              <Input name="title" defaultValue={values?.title ?? ""} required placeholder="Enter a title" />
            </label>

            <label className="space-y-2">
              <FieldLabel>Slug</FieldLabel>
              <Input name="slug" defaultValue={values?.slug ?? ""} placeholder="optional-slug" />
            </label>
          </div>

          <label className="block space-y-2">
            <FieldLabel>Summary</FieldLabel>
            <Textarea name="summary" rows={3} defaultValue={values?.summary ?? ""} placeholder="Short description" />
          </label>

          <label className="block space-y-2">
            <FieldLabel>Body</FieldLabel>
            <Textarea name="body" rows={10} defaultValue={values?.body ?? ""} placeholder="Main content" />
          </label>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2">
              <FieldLabel>Status</FieldLabel>
              <Select name="status" defaultValue={values?.status ?? "DRAFT"}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
                <option value="DEPRECATED">Deprecated</option>
              </Select>
            </label>

            <label className="space-y-2">
              <FieldLabel>Visibility</FieldLabel>
              <Select name="visibility" defaultValue={values?.visibility ?? "PRIVATE"}>
                <option value="PRIVATE">Private</option>
                <option value="SHARED">Shared</option>
                <option value="PUBLIC">Public</option>
              </Select>
            </label>

            <label className="space-y-2">
              <FieldLabel>Aliases</FieldLabel>
              <Input
                name="aliases"
                defaultValue={(values?.aliases ?? []).join(", ")}
                placeholder="Comma-separated aliases"
              />
            </label>

            <label className="space-y-2">
              <FieldLabel>Tags</FieldLabel>
              <Input
                name="tags"
                defaultValue={(values?.tags ?? []).join(", ")}
                placeholder="Comma-separated tags"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <FieldLabel>Search Keywords</FieldLabel>
            <Input
              name="searchKeywords"
              defaultValue={(values?.searchKeywords ?? []).join(", ")}
              placeholder="Comma-separated keywords"
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
