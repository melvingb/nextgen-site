import type { Metadata } from "next";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Client testimonials",
  description: "Feedback from forum administrators and community owners.",
  alternates: { canonical: "/testimonials" },
};

export default function Page() {
  return (
    <>
      <section className="listing-hero">
        <div className="shell listing-hero-grid">
          <div>
            <div className="eyebrow">Client feedback</div>
            <h1>Work that community owners can rely on.</h1>
            <p>Feedback from administrators across phpBB and XenForo projects, from troubleshooting to full implementation work.</p>
          </div>
          <div className="listing-hero-note">
            <code>{String(testimonials.length).padStart(2, "0")} testimonials</code>
            <strong>Community-focused work</strong>
            <span>Technical support · implementation · customization</span>
          </div>
        </div>
      </section>
      <section className="page shell">
        <div className="quote-grid all-quotes">
          {testimonials.map((t, i) => (
            <blockquote key={`${t.name}-${i}`}>
              <div className="stars">★★★★★</div><p>“{t.text}”</p>
              <footer><strong>{t.name}</strong><span>{t.role} · {t.platform}</span></footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
