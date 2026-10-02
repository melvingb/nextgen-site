import type { Metadata } from "next";
import { designs } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "phpBB designs",
  description: "Responsive phpBB themes maintained by nextgen solutions.",
  alternates: { canonical: "/designs" },
};

export default function Page() {
  return (
    <>
      <section className="listing-hero">
        <div className="shell listing-hero-grid">
          <div>
            <div className="eyebrow">Design library</div>
            <h1>phpBB themes maintained as real software projects.</h1>
            <p>Responsive styles with public repositories, live demos and a clear compatibility target.</p>
          </div>
          <div className="listing-hero-note">
            <code>{String(designs.length).padStart(2, "0")} maintained styles</code>
            <strong>phpBB 3.3</strong>
            <span>Public code · responsive front-end</span>
          </div>
        </div>
      </section>
      <section className="page shell">
        <div className="project-grid">
          {designs.map((d) => <ProjectCard key={d.slug} item={d} />)}
        </div>
      </section>
    </>
  );
}
