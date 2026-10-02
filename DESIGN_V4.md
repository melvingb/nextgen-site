# Design V4 — Jekyll refined

This version intentionally moves away from the generic SaaS/AI landing-page look and uses the current Jekyll site as the visual reference.

Main changes:
- Cleaner, conventional header with readable navigation.
- Compact hero with moderate type scale; no fake console or decorative floating cards.
- `h2` headings stay around 30–38px on desktop and smaller on mobile.
- Services are presented as simple technical rows instead of bento cards.
- Designs return to a clean light catalog with real screenshots as the visual focus.
- Featured extension is a restrained two-column block rather than a full-width blue banner.
- Portfolio and testimonials use simple bordered components with subtle shadows only on interaction.
- CTA and footer are intentionally quiet and consistent with the rest of the site.
- Fallback images are styled so missing assets do not look broken during local development.
- Dark mode remains supported.

Replace the files from this patch in your current Next.js project, then restart the dev server and hard-refresh the page.
