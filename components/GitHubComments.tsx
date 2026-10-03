"use client";

import { useEffect, useRef } from "react";

function getGiscusTheme() {
  return document.documentElement.dataset.theme === "dark"
    ? "transparent_dark"
    : "light";
}

export function GitHubComments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "nextgen-solutions-gt/site-comments");
    script.setAttribute("data-repo-id", "R_kgDOQul2Fg");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQul2Fs4C0OPZ");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", getGiscusTheme());
    script.setAttribute("data-lang", "es");
    script.setAttribute("data-loading", "lazy");

    container.appendChild(script);

    const syncTheme = () => {
      const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      iframe?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: getGiscusTheme(),
            },
          },
        },
        "https://giscus.app"
      );
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, []);

  return (
    <section className="github-comments shell">
      <div className="github-comments-heading">
        <div>
          <div className="eyebrow">GitHub Discussions</div>
          <h2>Comments</h2>
        </div>
        <p>
          Comments are powered by GitHub Discussions. A GitHub account is required to participate.
        </p>
      </div>
      <div ref={containerRef} className="giscus-container" />
    </section>
  );
}
