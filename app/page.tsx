import Link from "next/link";
import { designs, extension, portfolio, testimonials } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { SafeImage } from "@/components/SafeImage";

const capabilities = [
  {
    id: "01",
    title: "Upgrades & maintenance",
    copy: "Version upgrades, compatibility work, troubleshooting and long-term technical maintenance.",
    href: "/services/phpbb",
    tag: "maintenance",
  },
  {
    id: "02",
    title: "Forum migrations",
    copy: "Platform-to-platform migrations planned around data integrity, permissions and continuity.",
    href: "/services/migrations",
    tag: "migration",
  },
  {
    id: "03",
    title: "Custom development",
    copy: "Extensions, integrations and targeted functionality built around established communities.",
    href: "/services/custom-development",
    tag: "development",
  },
  {
    id: "04",
    title: "Styles & front-end",
    copy: "phpBB design work, modernization and responsive implementation without unnecessary complexity.",
    href: "/designs",
    tag: "frontend",
  },
];

const principles = [
  ["01", "Maintainability first", "Prefer code that can still be understood, upgraded and supported after launch."],
  ["02", "Respect existing communities", "Modernize carefully without forcing a forum to become something it is not."],
  ["03", "Platform-aware work", "Build around the conventions and constraints of phpBB, XenForo and vBulletin."],
  ["04", "Useful over decorative", "Performance, clarity and reliability matter more than adding visual noise."],
];

export default function Home() {
  return (
    <>
      <section className="hero developer-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-dot" /> Forum engineering &amp; development</div>
            <h1>
              Better engineering for <em>serious</em> forum communities.
            </h1>
            <p className="hero-lead">
              I build, migrate and maintain phpBB, XenForo and vBulletin communities — from upgrades and custom development to styles, extensions and performance work.
            </p>
            <div className="actions hero-actions">
              <Link className="button primary" href="/contact">Discuss a project</Link>
              <Link className="button secondary" href="/portfolio">View selected work</Link>
            </div>
            <div className="hero-stack" aria-label="Supported platforms">
              <span>phpBB</span><span>XenForo</span><span>vBulletin</span><span>GitHub</span>
            </div>
          </div>

          <aside className="dev-panel" aria-label="Current engineering overview">
            <div className="dev-panel-bar">
              <span className="window-dots"><i /><i /><i /></span>
              <code>nextgen / forum-engineering</code>
            </div>
            <div className="dev-panel-body">
              <div className="dev-command"><span>$</span> project status</div>
              <div className="status-row"><span>maintained styles</span><strong>{String(designs.length).padStart(2, "0")}</strong><b className="status ok">active</b></div>
              <div className="status-row"><span>phpBB Directory</span><strong>{extension.version}</strong><b className="status rc">RC</b></div>
              <div className="status-row"><span>platforms</span><strong>03</strong><b className="status ok">supported</b></div>
              <div className="dev-divider" />
              <div className="dev-note">
                <code>// approach</code>
                <p>Stable upgrades. Clean code. Practical support. No unnecessary rebuilds.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="metrics-strip" aria-label="Nextgen at a glance">
        <div className="shell metrics-grid">
          <div><strong>{designs.length}</strong><span>maintained phpBB styles</span></div>
          <div><strong>3</strong><span>forum platforms supported</span></div>
          <div><strong>Open source</strong><span>public repositories &amp; project history</span></div>
        </div>
      </section>

      <section className="section shell capability-section" id="services">
        <div className="section-intro split-intro">
          <div>
            <div className="eyebrow">What I work on</div>
            <p className="intro-note">Focused technical work for communities that already have users, history and infrastructure worth protecting.</p>
          </div>
          <div>
            <h2>Forum software deserves disciplined engineering.</h2>
            <p>Most forum work is not a greenfield app. It is careful maintenance: understanding the platform, preserving data, reducing risk and changing only what needs to change.</p>
          </div>
        </div>

        <div className="capability-grid">
          {capabilities.map((item) => (
            <Link href={item.href} className="capability-card" key={item.id}>
              <div className="capability-meta"><code>{item.id}</code><span>{item.tag}</span></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="capability-link">Explore service <b>→</b></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalog-section" id="designs">
        <div className="shell">
          <div className="catalog-heading">
            <div>
              <div className="eyebrow">phpBB style catalogue</div>
              <h2>Maintained work, with public code behind it.</h2>
              <p>Styles are presented as software projects: repository, compatibility and project details — not just screenshots.</p>
            </div>
            <Link href="/designs" className="text-link">Browse all designs <span>→</span></Link>
          </div>
          <div className="project-grid professional-grid">
            {designs.slice(0, 6).map((design) => <ProjectCard key={design.slug} item={design} />)}
          </div>
        </div>
      </section>

      <section className="section shell extension-section" id="extensions">
        <article className="extension-feature developer-extension">
          <div className="extension-copy">
            <div className="eyebrow">Featured open-source project</div>
            <h2>{extension.title}</h2>
            <p>{extension.description} Built as a real phpBB extension with permissions, ACP configuration, responsive views and a public development history.</p>
            <dl className="extension-specs">
              <div><dt>Platform</dt><dd>{extension.platform}</dd></div>
              <div><dt>Version</dt><dd>{extension.version}</dd></div>
              <div><dt>Status</dt><dd>{extension.status}</dd></div>
            </dl>
            <div className="actions">
              <Link className="button primary" href="/extensions/phpbb-directory">Project details</Link>
              <a className="button secondary" href={extension.repoUrl} target="_blank" rel="noreferrer">Repository ↗</a>
            </div>
          </div>
          <div className="extension-visual browser-frame">
            <div className="browser-bar"><span><i /><i /><i /></span><code>ext-phpbb-directory</code></div>
            <SafeImage src={extension.image} alt="phpBB Directory preview" width={1100} height={620} fallback="phpBB Directory · project preview" variant="extension" meta="ext-phpbb-directory / preview" />
          </div>
        </article>
      </section>

      <section className="engineering-band">
        <div className="shell engineering-grid">
          <div className="engineering-copy">
            <div className="eyebrow inverse">Engineering principles</div>
            <h2>Maintainable first.<br /><em>Flashy second.</em></h2>
            <p>A forum can run for years. The work around it should be understandable, upgradeable and boring in the best possible way.</p>
            <Link className="button light-button" href="/custom-work">How I approach custom work</Link>
          </div>
          <div className="principle-list">
            {principles.map(([n, title, copy]) => (
              <div className="principle-row" key={n}>
                <code>{n}</code>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell work-section" id="portfolio">
        <div className="compact-heading">
          <div><div className="eyebrow">Selected work</div><h2>Real communities, real constraints.</h2></div>
          <p>Implementation and modernization work where reliability, usability and maintainability matter more than visual tricks.</p>
        </div>
        <div className="portfolio-grid professional-portfolio">
          {portfolio.map((project, index) => (
            <article key={project.name} className="portfolio-card">
              <div className="portfolio-image-wrap">
                <SafeImage src={project.image} alt={project.name} width={1200} height={720} fallback={`0${index + 1} / ${project.name}`} variant="portfolio" meta={`${project.name.toLowerCase().replace(/\s+/g, "-")} / project`} />
              </div>
              <div className="portfolio-copy">
                <span className="project-type">Community platform work</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews-section" id="testimonials">
        <div className="shell reviews-layout">
          <div className="reviews-side">
            <div className="eyebrow">Client feedback</div>
            <h2>Technical work should feel dependable.</h2>
            <Link href="/testimonials" className="text-link">Read all testimonials <span>→</span></Link>
          </div>
          <div className="quote-list">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <blockquote key={`${testimonial.name}-${index}`}>
                <span className="quote-index">0{index + 1}</span>
                <p>“{testimonial.text}”</p>
                <footer><strong>{testimonial.name}</strong><span>{testimonial.role} · {testimonial.platform}</span></footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="cta developer-cta" id="contact">
        <div className="shell cta-inner">
          <div>
            <div className="eyebrow">Have a forum problem?</div>
            <h2>Tell me what is running, what is changing and what is failing.</h2>
            <p>I will help you turn it into a clear technical plan.</p>
          </div>
          <Link href="/contact" className="button primary">Start a conversation</Link>
        </div>
      </section>
    </>
  );
}
