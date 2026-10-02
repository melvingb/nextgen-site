"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallback?: string;
  className?: string;
  variant?: "theme" | "extension" | "screenshot" | "portfolio" | "generic";
  meta?: string;
};

export function SafeImage({
  src,
  alt,
  width,
  height,
  fallback = "Preview",
  className,
  variant = "generic",
  meta,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`visual-placeholder placeholder-${variant} ${className ?? ""}`} aria-label={alt}>
        <div className="placeholder-topbar">
          <span className="placeholder-dots"><i /><i /><i /></span>
          <code>{meta ?? "nextgen / preview"}</code>
        </div>
        <div className="placeholder-stage" aria-hidden="true">
          <div className="placeholder-sidebar">
            <span className="placeholder-logo" />
            <span /><span /><span /><span />
          </div>
          <div className="placeholder-main">
            <div className="placeholder-toolbar"><span /><span /><span /></div>
            <div className="placeholder-heading"><span /><span /></div>
            <div className="placeholder-grid">
              <span /><span /><span /><span />
            </div>
          </div>
        </div>
        <div className="placeholder-caption">
          <strong>{fallback}</strong>
          <span>Preview image will appear here</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
