import type { Metadata } from "next";
import { designs, extensions, portfolio, testimonials } from "@/lib/data";
import { getPublishingStatus } from "@/lib/github-admin";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const publishing = await getPublishingStatus();
  const areas = [
    { title: "Designs", value: String(designs.length), note: "phpBB styles" },
    { title: "Extensions", value: String(extensions.length), note: "public projects" },
    { title: "Portfolio", value: String(portfolio.length), note: "selected projects" },
    { title: "Testimonials", value: String(testimonials.length), note: "client reviews" },
  ];

  return (
    <main className="admin-content">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Dashboard</span>
          <h1>Content control, without a traditional CMS.</h1>
          <p>GitHub stays the source of truth. Editing here produces reviewable commits and lets Vercel deploy the result.</p>
        </div>
        <span className="admin-status"><i /> Authentication active</span>
      </div>

      <section className="admin-stat-grid">
        {areas.map((area) => (
          <article className="admin-stat-card" key={area.title}>
            <span>{area.title}</span>
            <strong>{area.value}</strong>
            <small>{area.note}</small>
          </article>
        ))}
      </section>

      <section className="admin-panel-grid">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="admin-eyebrow">Repository publishing</span>
              <h2>{publishing.connected ? "GitHub App connected" : "GitHub App setup required"}</h2>
            </div>
            <span className={`admin-chip ${publishing.connected ? "ok" : ""}`}>
              {publishing.connected ? "connected" : "pending"}
            </span>
          </div>
          <p>{publishing.message}</p>
          <dl className="admin-repo-meta">
            <div><dt>Repository</dt><dd>{publishing.repository}</dd></div>
            <div><dt>Branch</dt><dd>{publishing.branch}</dd></div>
            {!!publishing.missing.length && (
              <div><dt>Missing</dt><dd>{publishing.missing.join(", ")}</dd></div>
            )}
          </dl>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="admin-eyebrow">Deployment</span>
              <h2>Git-backed publishing</h2>
            </div>
            <span className="admin-chip ok">online</span>
          </div>
          <p>
            Preview publishes to <code>feat/admin-auth</code>. Production publishes to <code>main</code>.
            Every commit triggers the matching Vercel deployment automatically.
          </p>
        </article>
      </section>
    </main>
  );
}
