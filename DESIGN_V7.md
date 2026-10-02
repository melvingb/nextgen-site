# Design V7

Small interaction refinement focused on two UI details:

- The theme `<select>` is replaced by a compact icon button. It cycles System → Light → Dark and keeps the current preference in `localStorage`.
- The floating support form is now a centered, content-sized modal instead of a full-height side drawer.
- The modal closes with Escape, by clicking the backdrop, or with the close button.
- Name and email share a row on desktop to keep the form compact.
- Mobile uses a bottom-aligned compact sheet, but it no longer fills the whole screen by default.
