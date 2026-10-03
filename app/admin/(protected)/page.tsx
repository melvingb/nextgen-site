import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

const areas = [
  { title: "Designs", value: "9", note: "phpBB styles" },
  { title: "Extensions", value: "1", note: "public project" },
  { title: "Portfolio", value: "2", note: "selected projects" },
  { title: "Testimonials", value: "10", note: "client reviews" },
];

export default function AdminDashboard() {
  return (
    <main className="admin-content">
      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">Dashboard</span><h1>Content control, without a traditional CMS.</h1><p>GitHub stays the source of truth. This panel will publish structured changes back to the repository.</p></div>
        <span className="admin-status"><i /> Authentication active</span>
      </div>
      <section className="admin-stat-grid">
        {areas.map((area) => <article className="admin-stat-card" key={area.title}><span>{area.title}</span><strong>{area.value}</strong><small>{area.note}</small></article>)}
      </section>
      <section className="admin-panel-grid">
        <article className="admin-panel"><div className="admin-panel-head"><div><span className="admin-eyebrow">Next step</span><h2>Connect repository publishing</h2></div><span className="admin-chip">pending</span></div><p>The login is protected first. Next we will add a scoped GitHub token so Save and Publish can create commits in <code>melvingb/nextgen-site</code>.</p></article>
        <article className="admin-panel"><div className="admin-panel-head"><div><span className="admin-eyebrow">Deployment</span><h2>Vercel production</h2></div><span className="admin-chip ok">online</span></div><p>Every published commit on <code>main</code> will trigger the existing Vercel production deployment.</p></article>
      </section>
    </main>
  );
}
