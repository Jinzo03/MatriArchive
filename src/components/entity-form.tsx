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
};

export function EntityForm({
  mode,
  title,
  description,
  submitLabel,
  onSubmit,
  values,
}: EntityFormProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <section>
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? "Create Entity" : "Edit Entity"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </section>

        <form action={onSubmit} className="space-y-6 rounded-2xl border border-border p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Title</span>
              <input
                name="title"
                defaultValue={values?.title ?? ""}
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Slug</span>
              <input
                name="slug"
                defaultValue={values?.slug ?? ""}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Summary</span>
            <textarea
              name="summary"
              rows={3}
              defaultValue={values?.summary ?? ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Body</span>
            <textarea
              name="body"
              rows={10}
              defaultValue={values?.body ?? ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">Status</span>
              <select
                name="status"
                defaultValue={values?.status ?? "DRAFT"}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
                <option value="DEPRECATED">Deprecated</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Visibility</span>
              <select
                name="visibility"
                defaultValue={values?.visibility ?? "PRIVATE"}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="PRIVATE">Private</option>
                <option value="SHARED">Shared</option>
                <option value="PUBLIC">Public</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Aliases</span>
              <input
                name="aliases"
                defaultValue={(values?.aliases ?? []).join(", ")}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="Comma-separated aliases"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Tags</span>
              <input
                name="tags"
                defaultValue={(values?.tags ?? []).join(", ")}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="Comma-separated tags"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Search Keywords</span>
            <input
              name="searchKeywords"
              defaultValue={(values?.searchKeywords ?? []).join(", ")}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              placeholder="Comma-separated keywords"
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
