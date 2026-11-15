/**
 * Helen's portfolio — tasteful, progressive-enhancement motion.
 *
 * GSAP + ScrollTrigger are loaded from version-pinned CDN scripts in index.astro.
 * If they're unavailable (or motion is reduced), all content remains visible.
 * Newly added CMS cards automatically inherit these selectors and animations.
 */
export function initAnimations() {
  const start = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Quiet first impression: short, overlapping transitions, no text splitting.
      const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
      intro
        .fromTo('.hero .eyebrow', { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.65, clearProps: 'opacity,visibility,transform' }, 0.08)
        .fromTo('.hero h1', { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.95, clearProps: 'opacity,visibility,transform' }, 0.2)
        .fromTo('.hero-intro', { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.75, clearProps: 'opacity,visibility,transform' }, 0.42)
        .fromTo('.hero-actions', { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'opacity,visibility,transform' }, 0.55)
        .fromTo('.hero-proof', { autoAlpha: 0, y: 9 },
          { autoAlpha: 1, y: 0, duration: 0.6, clearProps: 'opacity,visibility,transform' }, 0.69)
        .fromTo('.hero-editorial', { autoAlpha: 0, y: 28, rotation: 1.2 },
          { autoAlpha: 1, y: 0, rotation: 0, duration: 1.15, ease: 'power3.out',
            clearProps: 'opacity,visibility,transform' }, 0.25);

      // A tiny hand-drawn flourish in the existing decorative SVG.
      // It doesn't alter text or imagery, and remains visible without GSAP.
      document.querySelectorAll('.art-scribble path').forEach((path, index) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        intro.to(path, {
          strokeDashoffset: 0, duration: 1.05, ease: 'power2.inOut',
          clearProps: 'strokeDasharray,strokeDashoffset'
        }, 0.95 + index * 0.12);
      });

      // The CMS may add any number of content blocks. Animate each independently,
      // so cards farther down a narrow/mobile grid aren't revealed offscreen.
      const reveal = (element, delay = 0, rise = 23) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: rise },
          { autoAlpha: 1, y: 0, duration: 0.78, delay,
            ease: 'power2.out', clearProps: 'opacity,visibility,transform',
            scrollTrigger: { trigger: element, start: 'top 89%', once: true } });
      };

      document.querySelectorAll('[data-reveal]:not(.skill-group):not(.featured-card):not(.result-card)')
        .forEach((element) => reveal(element));

      // Small rhythm between neighboring cards, without a long animation queue.
      document.querySelectorAll('.skill-group, .featured-card, .result-card')
        .forEach((element) => {
          const siblingIndex = Array.prototype.indexOf.call(element.parentElement.children, element);
          reveal(element, (siblingIndex % 3) * 0.075, 18);
        });

      // Fonts and portrait dimensions can affect ScrollTrigger positions.
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });

    // A separate media query makes desktop depth effects cleanly reversible.
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      gsap.to('.art-circle-one', {
        y: -18, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
      gsap.to('.art-circle-two', {
        y: 13, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
      gsap.to('.spotlight-sun', {
        y: -22, ease: 'none',
        scrollTrigger: { trigger: '.spotlight', start: 'top bottom', end: 'bottom top', scrub: 0.9 }
      });
    });
  };

  // The external `defer` scripts finish before DOMContentLoaded. Astro's
  // bundled module may run before OR after that event, depending on caching.
  if (window.gsap && window.ScrollTrigger) {
    start();
  } else if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
}
