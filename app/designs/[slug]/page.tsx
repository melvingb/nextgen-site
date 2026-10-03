import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { designs } from "@/lib/data";
import { getRepoActivity } from "@/lib/github";
import { SafeImage } from "@/components/SafeImage";
import { GitHubComments } from "@/components/GitHubComments";

export function generateStaticParams() {
  return designs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = designs.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: `/designs/${d.slug}` },
    openGraph: { images: [d.image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = designs.find((x) => x.slug === slug);
  if (!d) notFound();
  const activity = await getRepoActivity(d.repo);

  return (
    <>
      <section className="project-hero">
        <div className="shell project-hero-grid">
          <div className="project-hero-copy">
            <Link className="back" href="/designs">← All designs</Link>
            <div className="eyebrow">phpBB design · maintained project</div>
            <h1>{d.title}</h1>
            <p className="project-hero-lead">{d.description}</p>
            <div className="tags hero-tags">{d.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <div className="actions">
              <a className="button primary" href={`https://demo.nextgen.gt/demo/#${d.demoStyle}`} target="_blank" rel="noreferrer">Live demo</a>
              <a className="button secondary" href={`https://github.com/${d.repo}`} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>

          <div className="project-hero-visual">
            <SafeImage
              src={d.image}
              alt={`${d.title} preview`}
              width={1200}
              height={720}
              fallback={`${d.title} theme preview`}
              variant="theme"
              meta={`${d.slug} / phpBB 3.3`}
            />
          </div>
        </div>
        <div className="shell project-hero-meta">
          <div><span>Platform</span><strong>phpBB 3.3</strong></div>
          <div><span>Repository</span><strong>{d.repo.split("/")[1]}</strong></div>
          <div><span>Focus</span><strong>Responsive theme</strong></div>
        </div>
      </section>

      <section className="section shell detail-grid refined-detail-grid">
        <article className="detail-copy">
          <div className="eyebrow">Project overview</div>
          <h2>About this design</h2>
          <p>{d.details}</p>
          <h2>Features</h2>
          <ul className="feature-list">{d.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
        </article>
        <aside className="repo-card repo-card-polished">
          <div className="eyebrow">Repository activity</div>
          <h3>{d.repo.split("/")[1]}</h3>
          {activity.updatedAt ? (
            <>
              <p><strong>Last update</strong><br />{new Date(activity.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p><strong>Latest commit</strong><br />{activity.latestCommit}</p>
            </>
          ) : (
            <p>Repository metadata is temporarily unavailable. The public repository remains accessible below.</p>
          )}
          <a href={`https://github.com/${d.repo}`} target="_blank" rel="noreferrer">Open repository →</a>
        </aside>
      </section>

      <GitHubComments />
    </>
  );
}
