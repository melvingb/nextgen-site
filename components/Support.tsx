"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { site } from "@/lib/site";

export function Support() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    const form = e.currentTarget;
    const res = await fetch(site.formspree, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      form.reset();
      setStatus("Thanks — your message was sent.");
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) setOpen(false);
  }

  return (
    <>
      <button className="support-fab" onClick={() => setOpen(true)}>Need help?</button>

      {open && (
        <div className="support-layer" role="presentation" onMouseDown={closeFromBackdrop}>
          <section className="support-panel" role="dialog" aria-modal="true" aria-labelledby="support-title">
            <div className="support-head">
              <div>
                <span className="support-kicker">Project inquiry</span>
                <strong id="support-title">Tell me about your forum</strong>
                <p>Share the essentials. I’ll reply with the best technical approach.</p>
              </div>
              <button className="support-close" onClick={() => setOpen(false)} aria-label="Close contact form">×</button>
            </div>

            <form onSubmit={submit}>
              <div className="support-form-row">
                <label>Name<input name="name" autoComplete="name" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              </div>
              <label>What do you need?<textarea name="message" rows={5} required /></label>
              <input type="hidden" name="source" value="nextgen.gt Next.js" />
              <div className="support-actions">
                <span>No account or commitment required.</span>
                <button className="button primary" type="submit">Send message</button>
              </div>
              {status && <p className="form-status">{status}</p>}
            </form>
          </section>
        </div>
      )}
    </>
  );
}
