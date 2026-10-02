import Link from "next/link";

export function ServicePage({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <>
      <section className="service-hero">
        <div className="shell service-hero-grid">
          <div className="service-hero-copy">
            <div className="eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div className="actions">
              <Link href="/contact" className="button primary">Discuss your project</Link>
              <Link href="/portfolio" className="button secondary">See selected work</Link>
            </div>
          </div>

          <aside className="service-profile" aria-label={`${eyebrow} technical scope`}>
            <div className="service-profile-head">
              <code>service / {eyebrow.toLowerCase().replace(/\s+/g, "-")}</code>
              <span className="status ok">available</span>
            </div>
            <div className="service-profile-body">
              <div className="profile-row"><span>Scope</span><strong>Defined before changes</strong></div>
              <div className="profile-row"><span>Workflow</span><strong>Review → test → deploy</strong></div>
              <div className="profile-row"><span>Safety</span><strong>Backup + rollback plan</strong></div>
              <div className="profile-row"><span>Delivery</span><strong>Documented handoff</strong></div>
            </div>
            <div className="service-profile-foot">
              <span className="profile-pulse" />
              <span>Production-minded forum engineering</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section shell service-detail-section">
        <div className="detail-grid refined-detail-grid">
          <article className="detail-copy">
            <div className="eyebrow">Technical scope</div>
            <h2>What I can help with</h2>
            <ul className="feature-list">{items.map((x) => <li key={x}>✓ {x}</li>)}</ul>
          </article>
          <aside className="repo-card repo-card-polished process-card">
            <div className="eyebrow">How it works</div>
            <h3>Clear scope before implementation</h3>
            <p>We review your platform, version, constraints and desired result before any production change.</p>
            <p>For migrations and upgrades, the plan includes backups, testing and a rollback path.</p>
            <div className="process-steps" aria-hidden="true">
              <span>01 · review</span><span>02 · validate</span><span>03 · implement</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
