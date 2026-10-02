import type { Metadata } from "next";
import Link from "next/link";
import { extension } from "@/lib/data";
import { SafeImage } from "@/components/SafeImage";

export const metadata: Metadata = {
  title: "Extensions",
  description: "phpBB extensions developed and maintained by nextgen solutions.",
  alternates: { canonical: "/extensions" },
};

export default function Page() {
  return (
    <>
      <section className="listing-hero">
        <div className="shell listing-hero-grid">
          <div>
            <div className="eyebrow">Open-source development</div>
            <h1>Extensions built like software products.</h1>
            <p>Focused phpBB functionality with maintainable code, public history and a clear release lifecycle.</p>
          </div>
          <div className="listing-hero-note">
            <code>01 project</code>
            <strong>Actively developed</strong>
            <span>Public repository · release candidate</span>
          </div>
        </div>
      </section>

      <section className="page shell extension-index-section">
        <article className="extension-product-card">
          <div className="extension-product-visual">
            <SafeImage
              src={extension.image}
              alt={extension.title}
              width={1100}
              height={620}
              fallback="phpBB Directory interface preview"
              variant="extension"
              meta="ext-phpbb-directory / RC4"
            />
          </div>
          <div className="extension-product-copy">
            <div className="eyebrow">{extension.platform} · {extension.status}</div>
            <h2>{extension.title}</h2>
            <p>{extension.description}</p>
            <dl className="mini-specs">
              <div><dt>Version</dt><dd>{extension.version}</dd></div>
              <div><dt>License</dt><dd>Open source</dd></div>
              <div><dt>Status</dt><dd>{extension.status}</dd></div>
            </dl>
            <div className="actions">
              <Link href={`/extensions/${extension.slug}`} className="button primary">View project</Link>
              <a href={extension.repoUrl} className="button secondary" target="_blank" rel="noreferrer">Repository ↗</a>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
