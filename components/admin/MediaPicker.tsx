"use client";

import { useEffect, useMemo, useState } from "react";

export type MediaLibraryFile = {
  path: string;
  publicPath: string;
  name: string;
  size: number;
  deletable: boolean;
  source: "site" | "upload";
};

type Props = {
  current?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
};

export function MediaPicker({ current, onSelect, onClose }: Props) {
  const [files, setFiles] = useState<MediaLibraryFile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/media", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load media.");
        if (active) setFiles(data.files || []);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Could not load media.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      active = false;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((file) =>
      `${file.name} ${file.publicPath}`.toLowerCase().includes(needle)
    );
  }, [files, query]);

  return (
    <div className="admin-media-picker-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-media-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Choose image"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-media-picker-head">
          <div>
            <span className="admin-eyebrow">Media library</span>
            <h2>Choose an image</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close image picker">×</button>
        </div>

        <div className="admin-media-picker-toolbar">
          <input
            autoFocus
            type="search"
            placeholder="Search by filename or path…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <a href="/admin/media" target="_blank" rel="noreferrer">Open Media ↗</a>
        </div>

        {error && <div className="admin-flash error">{error}</div>}
        {loading && <p className="admin-empty">Loading images…</p>}

        {!loading && !error && (
          <div className="admin-media-picker-grid">
            {filtered.map((file) => (
              <button
                type="button"
                key={file.path}
                className={current === file.publicPath ? "selected" : ""}
                onClick={() => {
                  onSelect(file.publicPath);
                  onClose();
                }}
              >
                <span className="admin-media-picker-thumb">
                  <img src={file.publicPath} alt="" />
                </span>
                <span className="admin-media-picker-name">{file.name}</span>
                <small>{file.source === "upload" ? "Admin upload" : "Site asset"}</small>
              </button>
            ))}
            {!filtered.length && <p className="admin-empty">No images match that search.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
