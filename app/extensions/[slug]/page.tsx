import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { extension } from "@/lib/data";
import { getRepoActivity } from "@/lib/github";
import { SafeImage } from "@/components/SafeImage";

export function generateStaticParams() { return [{ slug: extension.slug }]; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== extension.slug) return {};
  return {
    title: extension.title,
    description: extension.description,
    alternates: { canonical: `/extensions/${slug}` },
    openGraph: { images: [extension.image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== extension.slug) notFound();
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
              <span>Open-source phpBB project</span>
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
              fallback="phpBB Directory product preview"
              variant="extension"
              meta="directory / admin + frontend"
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
          <p>phpBB Directory adds a modern searchable directory to your forum for links, resources and community listings.</p>
          <ul className="feature-list">{extension.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
        </article>
        <aside className="repo-card repo-card-polished">
          <div className="eyebrow">Project status</div>
          <h3>{extension.status}</h3>
          <p><strong>Version</strong><br />{extension.version}</p>
          {activity.updatedAt && <p><strong>Last repository update</strong><br />{new Date(activity.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}
          <a href={extension.repoUrl} target="_blank" rel="noreferrer">Open repository →</a>
        </aside>
      </section>

      <section className="section shell screenshot-section">
        <div className="section-heading compact-section-heading">
          <div className="eyebrow">Interface</div>
          <h2>Screenshots</h2>
          <p>Frontend, category, permission and administration views from the extension.</p>
        </div>
        <div className="screenshots polished-screenshots">
          {extension.screenshots.map((s, index) => (
            <SafeImage
              key={s}
              src={`/assets/images/extensions/phpbb-directory/${s}`}
              alt={`${extension.title} screenshot ${index + 1}`}
              width={1100}
              height={700}
              fallback={`Screen ${String(index + 1).padStart(2, "0")} · ${s.replace(".png", "").replace(/_/g, " ")}`}
              variant="screenshot"
              meta={`directory / screen-${String(index + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
