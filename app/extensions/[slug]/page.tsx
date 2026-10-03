import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { extensions } from "@/lib/data";
import { getRepoActivity } from "@/lib/github";
import { SafeImage } from "@/components/SafeImage";
import { GitHubComments } from "@/components/GitHubComments";

export function generateStaticParams() {
  return extensions.map((extension) => ({ slug: extension.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const extension = extensions.find((item) => item.slug === slug);
  if (!extension) return {};

  return {
    title: extension.title,
    description: extension.description,
    alternates: { canonical: `/extensions/${slug}` },
    openGraph: { images: [extension.image] },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const extension = extensions.find((item) => item.slug === slug);
  if (!extension) notFound();

  const activity = await getRepoActivity(extension.repo);

  return (
    <>
      <section className="project-hero extension-detail-hero">
        <div className="shell project-hero-grid">
          <div className="project-hero-copy">
            <Link className="back" href="/extensions">← Extensions</Link>
            <div className="eyebrow">{extension.platform} extension · {extension.version}</div>
            <h1>{extension.title}</h1>
            <p className="project-hero-lead">{extension.description}</p>
            <div className="hero-status-line">
              <span className="status rc">{extension.status}</span>
              <span>Open-source project</span>
            </div>
            <div className="actions">
              <a className="button primary" href={extension.download} target="_blank" rel="noreferrer">Download releases</a>
              <a className="button secondary" href={extension.repoUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>

          <div className="project-hero-visual">
            <SafeImage
              src={extension.image}
              alt={extension.title}
              width={1200}
              height={720}
              fallback={`${extension.title} product preview`}
              variant="extension"
              meta={`${extension.slug} / product`}
            />
          </div>
        </div>

        <div className="shell project-hero-meta">
          <div><span>Platform</span><strong>{extension.platform}</strong></div>
          <div><span>Version</span><strong>{extension.version}</strong></div>
          <div><span>Status</span><strong>{extension.status}</strong></div>
        </div>
      </section>

      <section className="section shell detail-grid refined-detail-grid">
        <article className="detail-copy">
          <div className="eyebrow">Functionality</div>
          <h2>What it adds</h2>
          <p>{extension.description}</p>
          <ul className="feature-list">
            {extension.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
          </ul>
        </article>

        <aside className="repo-card repo-card-polished">
          <div className="eyebrow">Project status</div>
          <h3>{extension.status}</h3>
          <p><strong>Version</strong><br />{extension.version}</p>
          {activity.updatedAt && (
            <p>
              <strong>Last repository update</strong><br />
              {new Date(activity.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <a href={extension.repoUrl} target="_blank" rel="noreferrer">Open repository →</a>
        </aside>
      </section>

      {!!extension.screenshots.length && (
        <section className="section shell screenshot-section">
          <div className="section-heading compact-section-heading">
            <div className="eyebrow">Interface</div>
            <h2>Screenshots</h2>
            <p>Frontend and administration views from the extension.</p>
          </div>
          <div className="screenshots polished-screenshots">
            {extension.screenshots.map((screenshot, index) => (
              <SafeImage
                key={screenshot}
                src={screenshot.startsWith("/") ? screenshot : `/assets/images/extensions/${extension.slug}/${screenshot}`}
                alt={`${extension.title} screenshot ${index + 1}`}
                width={1100}
                height={700}
                fallback={`Screen ${String(index + 1).padStart(2, "0")} · ${screenshot.replace(/\.png$/i, "").replace(/_/g, " ")}`}
                variant="screenshot"
                meta={`${extension.slug} / screen-${String(index + 1).padStart(2, "0")}`}
              />
            ))}
          </div>
        </section>
      )}

      <GitHubComments />
    </>
  );
}
