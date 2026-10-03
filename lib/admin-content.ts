import designs from "@/content/designs.json";
import extensions from "@/content/extensions.json";
import portfolio from "@/content/portfolio.json";
import testimonials from "@/content/testimonials.json";

export const contentKinds = ["designs", "extensions", "portfolio", "testimonials"] as const;
export type ContentKind = (typeof contentKinds)[number];

export const contentPaths: Record<ContentKind, string> = {
  designs: "content/designs.json",
  extensions: "content/extensions.json",
  portfolio: "content/portfolio.json",
  testimonials: "content/testimonials.json",
};

export const bundledContent: Record<ContentKind, unknown[]> = {
  designs,
  extensions,
  portfolio,
  testimonials,
};

export function isContentKind(value: string): value is ContentKind {
  return contentKinds.includes(value as ContentKind);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => text(item)).filter(Boolean)
    : [];
}

function slug(value: unknown) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeContent(kind: ContentKind, value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Content must be an array.");

  if (kind === "designs") {
    return value.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const normalized = {
        slug: slug(row.slug),
        title: text(row.title),
        description: text(row.description),
        image: text(row.image),
        tags: stringList(row.tags),
        repo: text(row.repo),
        demoStyle: text(row.demoStyle),
        features: stringList(row.features),
        details: text(row.details),
      };
      if (!normalized.slug || !normalized.title) {
        throw new Error("Every design needs a slug and title.");
      }
      return normalized;
    });
  }

  if (kind === "extensions") {
    return value.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const normalized = {
        slug: slug(row.slug),
        title: text(row.title),
        description: text(row.description),
        image: text(row.image),
        platform: text(row.platform),
        status: text(row.status),
        version: text(row.version),
        repo: text(row.repo),
        repoUrl: text(row.repoUrl),
        download: text(row.download),
        features: stringList(row.features),
        screenshots: stringList(row.screenshots),
      };
      if (!normalized.slug || !normalized.title) {
        throw new Error("Every extension needs a slug and title.");
      }
      return normalized;
    });
  }

  if (kind === "portfolio") {
    return value.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const normalized = {
        name: text(row.name),
        description: text(row.description),
        image: text(row.image),
      };
      if (!normalized.name) throw new Error("Every portfolio item needs a name.");
      return normalized;
    });
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const rating = Math.max(1, Math.min(5, Number(row.rating) || 5));
    const normalized = {
      name: text(row.name),
      role: text(row.role),
      platform: text(row.platform),
      rating,
      text: text(row.text),
    };
    if (!normalized.name || !normalized.text) {
      throw new Error("Every testimonial needs a name and testimonial text.");
    }
    return normalized;
  });
}
