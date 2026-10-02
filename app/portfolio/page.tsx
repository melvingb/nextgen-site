import type { Metadata } from "next";
import { portfolio } from "@/lib/data";
import { SafeImage } from "@/components/SafeImage";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected forum development and customization work by nextgen solutions.",
  alternates: { canonical: "/portfolio" },
};

export default function Page() {
  return (
    <>
      <section className="listing-hero portfolio-listing-hero">
        <div className="shell listing-hero-grid">
          <div>
            <div className="eyebrow">Selected work</div>
            <h1>Forum projects built around real communities.</h1>
            <p>Platform-specific implementation, modernization and maintenance where continuity matters as much as the interface.</p>
          </div>
          <div className="listing-hero-note">
            <code>{String(portfolio.length).padStart(2, "0")} selected projects</code>
            <strong>Production work</strong>
            <span>Community platforms · responsive implementation</span>
          </div>
        </div>
      </section>

      <section className="page shell">
        <div className="portfolio-grid portfolio-page-grid">
          {portfolio.map((p, index) => (
            <article className="portfolio-card portfolio-page-card" key={p.name}>
              <div className="portfolio-image-wrap">
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  width={1200}
                  height={720}
                  fallback={`${String(index + 1).padStart(2, "0")} · ${p.name}`}
                  variant="portfolio"
                  meta={`${p.name.toLowerCase().replaceAll(" ", "-")} / project`}
                />
              </div>
              <div className="portfolio-copy">
                <span className="project-type">Community platform work</span>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
