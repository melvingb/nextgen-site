"use client";

import { useEffect, useState } from "react";

type CsrfResponse = {
  csrfToken?: string;
};

export function GitHubSignInButton() {
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/csrf", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to fetch CSRF token");
        return (await response.json()) as CsrfResponse;
      })
      .then((data) => {
        if (!active) return;
        if (!data.csrfToken) throw new Error("Missing CSRF token");
        setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {error && (
        <div className="admin-auth-error" role="alert">
          The sign-in service could not be prepared. Refresh this page and try again.
        </div>
      )}

      <form action="/api/auth/signin/github" method="post">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value="/admin" />
        <button
          className="admin-github-button"
          type="submit"
          disabled={!csrfToken || error}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.8-.25.8-.56v-2.2c-3.25.7-3.94-1.38-3.94-1.38-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.6-.3-5.33-1.3-5.33-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.14c.98 0 1.97.13 2.89.39 2.2-1.5 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.4-2.74 5.38-5.35 5.67.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
            />
          </svg>
          {csrfToken ? "Continue with GitHub" : "Preparing GitHub sign-in…"}
        </button>
      </form>
    </>
  );
}
