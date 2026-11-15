# Helen Wells Portfolio V2 — targeted content and résumé update

The V1 design, writing archive, SEO results, and interactions remain unchanged.

## Changes

- Refined About and Experience prose using Helen’s brief and publicly available Bluetent biography.
- Added one optional editable Education line to the About section.
- Added an optional **Résumé PDF** Pages CMS `file` field, backed by named `documents` media under `public/documents`.
- Added conditional downloadable résumé buttons to the hero and contact areas. They do not display until Helen selects a PDF.
- Added content validation for local PDF paths.
- Updated README and content review checklist.

## Important

The user's follow-up mentions attaching Helen’s résumé, but no résumé file was present in the received attachments when V2 was prepared. No placeholder PDF or invented résumé details were added. Upload the real PDF through Pages CMS or supply it for the next package.

## Deploy update

Merge the changed files into Helen’s existing GitHub repository and commit. Netlify will rebuild automatically. Pages CMS will show the new file picker once the updated `.pages.yml` is on the branch it is editing.
