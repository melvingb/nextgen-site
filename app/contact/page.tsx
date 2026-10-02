import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Discuss a phpBB, XenForo or vBulletin project with nextgen solutions.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <>
      <section className="contact-hero">
        <div className="shell contact-hero-grid">
          <div>
            <div className="eyebrow">Start a conversation</div>
            <h1>Tell me what is running, what needs to change and what is getting in the way.</h1>
            <p>Platform, version, desired outcome and constraints are enough to start defining a useful technical scope.</p>
          </div>
          <aside className="contact-brief">
            <code>good first message</code>
            <ul>
              <li><span>01</span>Forum platform + version</li>
              <li><span>02</span>What you want to change</li>
              <li><span>03</span>Current issue or limitation</li>
              <li><span>04</span>Deadline, if there is one</li>
            </ul>
          </aside>
        </div>
      </section>
      <section className="section shell contact-layout refined-contact-layout">
        <div className="contact-context">
          <div className="eyebrow">Project context</div>
          <h2>Useful details</h2>
          <p className="lead">The more context you provide, the more useful the first reply can be.</p>
          <div className="contact-notes">
            <div><strong>Good for</strong><span>Migrations, upgrades, styles, extensions, troubleshooting</span></div>
            <div><strong>Platforms</strong><span>phpBB, XenForo, vBulletin</span></div>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
