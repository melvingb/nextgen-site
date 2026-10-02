import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand-block">
          <div className="brand footer-brand">
            <span className="brand-mark">N</span>
            <span className="brand-copy">nextgen <b>solutions</b></span>
          </div>
          <p>Forum engineering, migrations, maintenance and custom development for established online communities.</p>
          <code>Guatemala · working worldwide</code>
        </div>
        <div>
          <strong>Work</strong>
          <Link href="/services">Services</Link>
          <Link href="/designs">phpBB designs</Link>
          <Link href="/extensions">Extensions</Link>
          <Link href="/portfolio">Portfolio</Link>
        </div>
        <div>
          <strong>Elsewhere</strong>
          <a href="https://github.com/nextgen-solutions-gt" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.phpbb.com/community/memberlist.php?mode=viewprofile&u=1292660" target="_blank" rel="noreferrer">phpBB profile ↗</a>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} nextgen solutions.</span>
        <span>Built for communities that plan to stay online.</span>
      </div>
    </footer>
  );
}
