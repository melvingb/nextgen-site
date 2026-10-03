"use client";

import { uploadPresigned } from "@vercel/blob/client";
import { useEffect, useMemo, useState } from "react";
import type { MediaLibraryFile } from "@/components/admin/MediaPicker";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const stem = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${stem || "image"}${ext}`;
}

function sourceLabel(source: MediaLibraryFile["source"]) {
  if (source === "blob") return "Vercel Blob";
  if (source === "repository-upload") return "GitHub upload";
  return "Site asset";
}

export function MediaManager({ branch }: { branch: string }) {
  const [files, setFiles] = useState<MediaLibraryFile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [blobConnected, setBlobConnected] = useState(true);
  const [blobError, setBlobError] = useState("");
  const [message, setMessage] = useState<null | {
    type: "error" | "success";
    text: string;
  }>(null);

  async function load() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load media.");
      }

      setFiles(data.files || []);
      setBlobConnected(data.blobConnected !== false);
      setBlobError(data.blobError || "");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Could not load media.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;

    return files.filter((file) =>
      `${file.name} ${file.publicPath}`.toLowerCase().includes(needle)
    );
  }, [files, query]);

  async function upload(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Only image files are allowed." });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "Images must be 6 MB or smaller.",
      });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const pathname = `nextgen-media/${Date.now()}-${safeFileName(file.name)}`;

      const blob = await uploadPresigned(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/media/upload",
      });

      setMessage({
        type: "success",
        text: `Uploaded ${blob.pathname} to Vercel Blob. No Git commit was created.`,
      });

      await load();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove(file: MediaLibraryFile) {
    if (!file.deletable) return;

    const location =
      file.source === "blob" ? "Vercel Blob" : "the GitHub repository";

    if (!window.confirm(`Delete ${file.name} from ${location}?`)) return;

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: file.path,
          source: file.source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      setMessage({
        type: "success",
        text:
          file.source === "blob"
            ? `Removed ${file.name} from Vercel Blob. No Git commit was created.`
            : `Removed ${file.name} from GitHub.`,
      });

      setFiles((current) =>
        current.filter(
          (item) =>
            !(
              item.path === file.path &&
              item.source === file.source
            )
        )
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Delete failed.",
      });
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
          <p>
            Legacy assets stay in GitHub. New images are stored in Vercel Blob
            without creating commits.
          </p>
        </div>
        <div className="admin-editor-meta">
          <span className="admin-status">
            <i /> {files.length} images
          </span>
          <code>{branch}</code>
        </div>
      </div>

      {message && (
        <div className={`admin-flash ${message.type}`}>{message.text}</div>
      )}

      {!blobConnected && (
        <div className="admin-flash error">
          {blobError || "Vercel Blob is not connected yet."} Connect a public
          Blob store to this Vercel project to enable uploads.
        </div>
      )}

      <section className="admin-media-upload">
        <div>
          <span className="admin-eyebrow">Vercel Blob</span>
          <h2>Add an image without a commit</h2>
          <p>
            PNG, JPG, WebP, GIF, AVIF or SVG up to 6 MB. Uploads are available
            immediately and do not redeploy the site.
          </p>
        </div>

        <label className={busy || !blobConnected ? "disabled" : ""}>
          <input
            type="file"
            accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp"
            disabled={busy || !blobConnected}
            onChange={(event) => {
              const file = event.target.files?.[0];
              void upload(file);
              event.currentTarget.value = "";
            }}
          />
          {busy
            ? "Working…"
            : blobConnected
              ? "Upload image"
              : "Connect Blob first"}
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
          <article
            className="admin-media-card"
            key={`${file.source}:${file.path}`}
          >
            <div className="admin-media-preview">
              <img src={file.publicPath} alt="" />
            </div>

            <div className="admin-media-info">
              <div className="admin-media-card-head">
                <strong>{file.name}</strong>
                <span className={`admin-media-source ${file.source}`}>
                  {sourceLabel(file.source)}
                </span>
              </div>

              <small>{Math.max(1, Math.round(file.size / 1024))} KB</small>
              <code>{file.publicPath}</code>

              <div>
                <button
                  type="button"
                  onClick={() => void copy(file.publicPath)}
                >
                  Copy URL
                </button>

                {file.deletable && (
                  <button
                    className="danger"
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(file)}
                  >
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
