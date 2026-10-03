"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const themeOrder: ThemeMode[] = ["system", "light", "dark"];

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.72 5.28l-1.42 1.42M6.7 17.3l-1.42 1.42M18.72 18.72l-1.42-1.42M6.7 6.7 5.28 5.28" />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.25 15.45A8.3 8.3 0 0 1 8.55 3.75 8.75 8.75 0 1 0 20.25 15.45Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const saved: ThemeMode = stored === "light" || stored === "dark" ? stored : "system";
    apply(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if ((localStorage.getItem("theme") || "system") === "system") {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };

    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  function apply(value: ThemeMode) {
    setTheme(value);
    localStorage.setItem("theme", value);
    const dark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }

  function cycleTheme() {
    const index = themeOrder.indexOf(theme);
    apply(themeOrder[(index + 1) % themeOrder.length]);
  }

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Forum engineering · phpBB · XenForo · vBulletin</span>
          <a href="https://github.com/nextgen-solutions-gt" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
      <header className="site-header">
        <div className="nav-shell">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            <span className="brand-copy">nextgen <b>solutions</b></span>
          </Link>

          <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary navigation">
            <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/designs" onClick={() => setOpen(false)}>Designs</Link>
            <Link href="/extensions" onClick={() => setOpen(false)}>Extensions</Link>
            <Link href="/portfolio" onClick={() => setOpen(false)}>Work</Link>
            <Link href="/testimonials" onClick={() => setOpen(false)}>Reviews</Link>
          </nav>

          <div className="nav-tools">
            <button
              type="button"
              className="theme-toggle"
              onClick={cycleTheme}
              aria-label={`Theme: ${theme}. Click to change theme.`}
              title={`Theme: ${theme}`}
              data-mode={theme}
            >
              <ThemeIcon mode={theme} />
              <span className="theme-toggle-label">{theme}</span>
            </button>
            <Link href="/contact" className="nav-contact">Discuss a project</Link>
            <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
              <span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
