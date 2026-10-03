"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaLibraryFile } from "@/components/admin/MediaPicker";

export function MediaManager({ branch }: { branch: string }) {
  const [files, setFiles] = useState<MediaLibraryFile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<null | { type: "error" | "success"; text: string }>(null);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load media.");
      setFiles(data.files || []);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not load media." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((file) =>
      `${file.name} ${file.publicPath}`.toLowerCase().includes(needle)
    );
  }, [files, query]);

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setMessage({ type: "success", text: `Uploaded ${data.publicPath}. Vercel will redeploy automatically.` });
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed." });
    } finally {
      setBusy(false);
    }
  }

  async function remove(file: MediaLibraryFile) {
    if (!file.deletable) return;
    if (!window.confirm(`Delete ${file.name} from GitHub?`)) return;

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: file.path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setMessage({ type: "success", text: `Removed ${file.name}. Vercel will redeploy automatically.` });
      setFiles((current) => current.filter((item) => item.path !== file.path));
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Delete failed." });
    } finally {
      setBusy(false);
    }
  }

  async function copy(path: string) {
    await navigator.clipboard.writeText(path);
    setMessage({ type: "success", text: `Copied ${path}` });
  }

  return (
    <main className="admin-content">
      <div className="admin-page-heading admin-editor-heading">
        <div>
          <span className="admin-eyebrow">Media library</span>
          <h1>All images used by the site.</h1>
          <p>Legacy assets and new admin uploads live together in the Next.js repository.</p>
        </div>
        <div className="admin-editor-meta">
          <span className="admin-status"><i /> {files.length} images</span>
          <code>{branch}</code>
        </div>
      </div>

      {message && <div className={`admin-flash ${message.type}`}>{message.text}</div>}

      <section className="admin-media-upload">
        <div>
          <span className="admin-eyebrow">Upload</span>
          <h2>Add an image</h2>
          <p>PNG, JPG, WebP, GIF or SVG up to 6 MB. New files go to <code>/assets/images/uploads/</code>.</p>
        </div>
        <label className={busy ? "disabled" : ""}>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              void upload(file);
              event.currentTarget.value = "";
            }}
          />
          {busy ? "Working…" : "Upload image"}
        </label>
      </section>

      <div className="admin-media-search">
        <input
          type="search"
          placeholder="Search images…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span>{filtered.length} shown</span>
      </div>

      <section className="admin-media-grid">
        {loading && <p className="admin-empty">Loading media…</p>}
        {!loading && !filtered.length && (
          <div className="admin-media-empty">
            <span className="admin-eyebrow">No matches</span>
            <h2>No images found.</h2>
            <p>Try another search or upload a new image.</p>
          </div>
        )}

        {filtered.map((file) => (
          <article className="admin-media-card" key={file.path}>
            <div className="admin-media-preview">
              <img src={file.publicPath} alt="" />
            </div>
            <div className="admin-media-info">
              <div className="admin-media-card-head">
                <strong>{file.name}</strong>
                <span className={`admin-media-source ${file.source}`}>
                  {file.source === "upload" ? "Upload" : "Site asset"}
                </span>
              </div>
              <small>{Math.max(1, Math.round(file.size / 1024))} KB</small>
              <code>{file.publicPath}</code>
              <div>
                <button type="button" onClick={() => void copy(file.publicPath)}>Copy path</button>
                {file.deletable && (
                  <button className="danger" type="button" disabled={busy} onClick={() => void remove(file)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
