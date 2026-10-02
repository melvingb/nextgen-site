import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Forum services",
  description: "Forum development, migrations, maintenance and custom technical work for phpBB, XenForo and vBulletin.",
  alternates: { canonical: "/services" },
};

export default function Page() {
  return (
    <>
      <section className="listing-hero">
        <div className="shell listing-hero-grid">
          <div>
            <div className="eyebrow">Forum engineering</div>
            <h1>Technical work with a clear scope and a safe path to production.</h1>
            <p>Upgrades, migrations, maintenance and custom development for established forum communities.</p>
          </div>
          <div className="listing-hero-note">
            <code>{String(services.length).padStart(2, "0")} service areas</code>
            <strong>phpBB · XenForo · vBulletin</strong>
            <span>Review · test · deploy · document</span>
          </div>
        </div>
      </section>
      <section className="page shell">
        <div className="service-grid refined-service-grid">
          {services.map((s, i) => (
            <Link className="service-card" href={`/services/${s.slug}`} key={s.slug}>
              <span>0{i + 1}</span><h3>{s.title}</h3><p>{s.summary}</p><b>Explore →</b>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
