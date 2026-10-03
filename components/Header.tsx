"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const themeOrder: ThemeMode[] = ["system", "light", "dark"];

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.25" />
        <path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.49 1.49M6.95 17.05l-1.49 1.49M18.54 18.54l-1.49-1.49M6.95 6.95 5.46 5.46" />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.6 15.2A7.75 7.75 0 0 1 8.8 4.4a8.25 8.25 0 1 0 10.8 10.8Z" />
        <path d="m17.9 4.25.38.9.9.38-.9.38-.38.9-.38-.9-.9-.38.9-.38.38-.9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.25" y="4.25" width="17.5" height="12.25" rx="2" />
      <path d="M8.5 20h7M12 16.5V20" />
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

    const dark =
      value === "dark" ||
      (value === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Forum engineering · phpBB · XenForo · vBulletin</span>
          <a href="https://github.com/nextgen-solutions-gt" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
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
            <div className="theme-control" role="group" aria-label="Color theme">
              {themeOrder.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={theme === mode ? "active" : ""}
                  onClick={() => apply(mode)}
                  aria-label={`Use ${mode} theme`}
                  aria-pressed={theme === mode}
                  title={mode === "system" ? "System theme" : `${mode[0].toUpperCase() + mode.slice(1)} theme`}
                >
                  <ThemeIcon mode={mode} />
                </button>
              ))}
            </div>

            <Link href="/contact" className="nav-contact">Discuss a project</Link>

            <button
              className="menu-button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
