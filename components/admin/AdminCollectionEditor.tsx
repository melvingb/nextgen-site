"use client";

import { useMemo, useState } from "react";

export type AdminField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "tags" | "lines";
  placeholder?: string;
  help?: string;
  defaultValue?: string | number | string[];
};

type Props = {
  kind: string;
  title: string;
  description: string;
  initialItems: Array<Record<string, unknown>>;
  fields: AdminField[];
  branch: string;
  source: string;
  loadError?: string;
  previewBase?: string;
};

function itemLabel(item: Record<string, unknown>, index: number) {
  return String(item.title || item.name || item.slug || `Item ${index + 1}`);
}

function previewHref(
  item: Record<string, unknown>,
  previewBase?: string
) {
  if (!previewBase) return "";
  const slug = String(item.slug || "");
  if (!slug) return previewBase;
  return `${previewBase}/${slug}`;
}

export function AdminCollectionEditor({
  kind,
  title,
  description,
  initialItems,
  fields,
  branch,
  source,
  loadError,
  previewBase,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState(initialItems.length ? 0 : -1);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState(
    loadError ? { type: "error", text: loadError } : null as null | {type:"error"|"success";text:string}
  );

  const current = selected >= 0 ? items[selected] : null;
  const currentPreview = current ? previewHref(current, previewBase) : "";

  const defaultItem = useMemo(() => {
    const item: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.defaultValue !== undefined) item[field.key] = field.defaultValue;
      else if (field.type === "number") item[field.key] = 5;
      else if (field.type === "tags" || field.type === "lines") item[field.key] = [];
      else item[field.key] = "";
    }
    return item;
  }, [fields]);

  function updateField(field: AdminField, raw: string) {
    if (selected < 0) return;

    let value: unknown = raw;
    if (field.type === "number") value = Number(raw);
    if (field.type === "tags") {
      value = raw.split(",").map((entry) => entry.trim()).filter(Boolean);
    }
    if (field.type === "lines") {
      value = raw.split("\n").map((entry) => entry.trim()).filter(Boolean);
    }

    setItems((previous) =>
      previous.map((item, index) =>
        index === selected ? { ...item, [field.key]: value } : item
      )
    );
    setDirty(true);
    setMessage(null);
  }

  function addItem() {
    const next = [...items, { ...defaultItem }];
    setItems(next);
    setSelected(next.length - 1);
    setDirty(true);
    setMessage(null);
  }

  function removeItem() {
    if (selected < 0 || !current) return;
    if (!window.confirm(`Remove "${itemLabel(current, selected)}" from this collection?`)) {
      return;
    }

    const next = items.filter((_, index) => index !== selected);
    setItems(next);
    setSelected(next.length ? Math.min(selected, next.length - 1) : -1);
    setDirty(true);
    setMessage(null);
  }

  async function publish() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/content/${kind}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Publish failed.");

      setItems(data.items);
      setDirty(false);

      if (data.changed === false) {
        setMessage({
          type: "success",
          text: `No changes to publish. ${data.branch} is already up to date.`,
        });
      } else {
        setMessage({
          type: "success",
          text: `Published commit ${String(data.sha || "").slice(0, 7)} to ${data.branch}. Vercel will redeploy automatically.`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Publish failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-page-heading admin-editor-heading">
        <div>
          <span className="admin-eyebrow">Content editor</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="admin-editor-meta">
          <span className="admin-status"><i /> {source === "github" ? "GitHub source" : "Bundled fallback"}</span>
          <code>{branch}</code>
        </div>
      </div>

      {message && (
        <div className={`admin-flash ${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <div className="admin-editor-shell">
        <aside className="admin-collection-list">
          <div className="admin-collection-toolbar">
            <div>
              <strong>{items.length}</strong>
              <span>{kind}</span>
            </div>
            <button type="button" onClick={addItem}>+ New</button>
          </div>

          <div className="admin-collection-items">
            {items.map((item, index) => (
              <button
                className={index === selected ? "active" : ""}
                key={`${itemLabel(item, index)}-${index}`}
                type="button"
                onClick={() => setSelected(index)}
              >
                <span>{itemLabel(item, index)}</span>
                <small>{String(item.slug || item.platform || item.role || "")}</small>
              </button>
            ))}
            {!items.length && <p className="admin-empty">No items yet.</p>}
          </div>
        </aside>

        <section className="admin-editor-panel">
          {current ? (
            <>
              <div className="admin-editor-actions">
                <div>
                  <span className="admin-eyebrow">Editing</span>
                  <h2>{itemLabel(current, selected)}</h2>
                </div>
                <div className="admin-action-row">
                  {currentPreview && (
                    <a href={currentPreview} target="_blank" rel="noreferrer">
                      Preview ↗
                    </a>
                  )}
                  <button className="danger" type="button" onClick={removeItem}>
                    Remove
                  </button>
                  <button
                    className="primary"
                    type="button"
                    onClick={publish}
                    disabled={saving || !dirty}
                  >
                    {saving ? "Publishing…" : dirty ? "Publish changes" : "Published"}
                  </button>
                </div>
              </div>

              <div className="admin-form-grid">
                {fields.map((field) => {
                  const rawValue = current[field.key];
                  const value =
                    field.type === "tags"
                      ? Array.isArray(rawValue) ? rawValue.join(", ") : ""
                      : field.type === "lines"
                        ? Array.isArray(rawValue) ? rawValue.join("\n") : ""
                        : String(rawValue ?? "");

                  return (
                    <label
                      className={field.type === "textarea" || field.type === "lines" ? "wide" : ""}
                      key={field.key}
                    >
                      <span>{field.label}</span>
                      {field.type === "textarea" || field.type === "lines" ? (
                        <textarea
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(event) => updateField(field, event.target.value)}
                          rows={field.type === "lines" ? 6 : 5}
                        />
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(event) => updateField(field, event.target.value)}
                        />
                      )}
                      {field.help && <small>{field.help}</small>}
                    </label>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="admin-editor-empty">
              <span className="admin-eyebrow">Empty collection</span>
              <h2>Create the first item</h2>
              <p>Use “+ New” to add an entry, then publish it as a GitHub commit.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
