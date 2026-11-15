# Helen's portfolio: subtle GSAP motion

This update replaces the older CSS + IntersectionObserver reveal system with GSAP 3.15.0 and ScrollTrigger. It does **not** change Helen's text, media, CMS fields, layout, colors, or contact links.

## What you'll see

- **Hero:** The eyebrow, headline, introduction, calls to action, proof line, and illustrated card softly reveal on first load.
- **About, writing, experience and contact:** Existing `data-reveal` blocks rise by roughly 23px once as they enter the viewport.
- **Skills, featured cards and SEO results:** Each card rises by 18px, with a tiny stagger. Newly added cards inherit the animation automatically.
- **Desktop only:** Three decorative elements move a few pixels with scrolling to provide depth, without affecting reading text or interactive controls.

## Files changed

- `src/pages/index.astro`: loads version-pinned GSAP and ScrollTrigger scripts and initializes the new animation module.
- `src/scripts/animations.js`: holds **all** GSAP configuration.
- `src/styles/site.css`: removes the old CSS reveal rules to avoid animation conflicts.

## Why use CDN here?

The project previously had no GSAP dependency, and these version-pinned CDN scripts let you deploy the update **without updating `package.json` or `package-lock.json`**. The same script references work on Netlify and with Astro's development server. GSAP and ScrollTrigger are both available from jsDelivr. If the CDN is blocked, the site stays readable and fully usable; animations simply won't run.

If you later prefer a self-hosted npm version, install `gsap` and replace the two CDN script tags with imports inside `src/scripts/animations.js`. Keep a single animation system (don't restore the old IntersectionObserver transitions).

## Accessibility and maintenance

- `prefers-reduced-motion: reduce` disables these GSAP effects.
- Animations don't block navigation or scrolling and don't change semantic HTML or keyboard focus.
- Animated elements are visible without JavaScript or if the CDN scripts fail.
- CMS edits do **not** require changes to animation code. If an entirely new section is added in code, give its container `data-reveal` to inherit the general entrance animation.

## Quick QA

1. Run `npm run check:content && npm run build` and preview locally.
2. Reload at the top: check the hero loads in about a second and buttons remain clickable.
3. Scroll slowly: check sections and cards appear without jumping or overlapping.
4. Check mobile widths (especially 375px and 768px) and that the navigation still opens.
5. With the OS/browser **Reduce motion** setting enabled, reload and verify all content is present without GSAP reveals.
6. If testing offline, the layout and links must still work with no animation.

To make reveals even subtler, lower the `rise` numbers (23px / 18px) or reduce `duration` in `src/scripts/animations.js`.
