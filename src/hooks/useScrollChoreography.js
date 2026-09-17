import { useEffect } from 'react';

/**
 * useScrollChoreography
 * 
 * Exact Architecture Implementation:
 * 
 *                    WINDOW SCROLL / LENIS
 *                              │
 *                              ▼
 *               ONE CENTRALIZED SCROLL LOOP
 *                        (requestAnimationFrame)
 *                              │
 *              ┌───────────────┼────────────────┐
 *              ▼               ▼                ▼
 *       PINNED SCENE       HERO SCRUB       HORIZONTAL TRACK
 *        PROGRESS          ANIMATION            PROGRESS
 *     (--progress)       (Y / Scale / α)      (--track-x)
 *              │               │                │
 *              ▼               ▼                ▼
 *       STICKY VIEWPORT     HERO FADE       RAIL TRANSLATION
 *       250–350svh          Scale 1→0.75     0→-overflowWidth
 *       WRAPPER             Y 0→-90          measured dynamically
 *              │
 *              ▼
 *       SHARED INTERSECTION
 *          OBSERVER
 *              │
 *              ▼
 *      MICRO-STAGGER REVEALS
 *       [data-rev] + --d
 */
export default function useScrollChoreography() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-rev]').forEach(el => el.classList.add('is-revealed'));
      document.querySelectorAll('.word-reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    // 1. Cached layout geometry registry
    let scenes = [];
    let tracks = [];
    let heroEl = null;
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    function measureLayout() {
      windowHeight = window.innerHeight;
      windowWidth = window.innerWidth;

      // Find hero container
      heroEl = document.querySelector('.hero-scrub') || document.querySelector('#hero-root');

      // Find all pinned scene containers (.scene or [data-scene])
      const sceneElements = document.querySelectorAll('.scene, [data-scene]');
      const scrollTop = window.__lenis ? window.__lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0);

      scenes = Array.from(sceneElements).map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollTop;
        const height = el.offsetHeight;
        // Total scrollable travel distance within this pinned scene
        const scrollDist = Math.max(1, height - windowHeight);

        return {
          el,
          top,
          height,
          scrollDist,
        };
      });

      // Find any horizontal card rails (.scene-track or [data-track])
      const trackElements = document.querySelectorAll('.scene-track, [data-track]');
      tracks = Array.from(trackElements).map((track) => {
        const parentScene = track.closest('.scene') || track.closest('[data-scene]');
        const scrollWidth = track.scrollWidth;
        // Measure real available overflow: track.scrollWidth - window.innerWidth
        const overflow = Math.max(0, scrollWidth - windowWidth + 48);
        return {
          track,
          parentScene,
          overflow,
        };
      });
    }

    // Measure initially and after layout settle
    measureLayout();
    const t1 = setTimeout(measureLayout, 150);
    const t2 = setTimeout(measureLayout, 500);

    // Recalculate cached geometry ONLY when necessary (primarily on resize & load)
    window.addEventListener('resize', measureLayout, { passive: true });
    window.addEventListener('load', measureLayout, { passive: true });

    // 2. ONE Centralized Scroll Loop (requestAnimationFrame)
    let rafId = null;
    let lastScrollY = -1;

    function update() {
      // Read current scroll position (integrated with Lenis or window scroll)
      const scrollY = window.__lenis
        ? window.__lenis.scroll
        : (window.scrollY || document.documentElement.scrollTop || 0);

      // Only update styles if scroll position actually changed
      if (Math.abs(scrollY - lastScrollY) > 0.1) {
        lastScrollY = scrollY;

        // A. HERO SCRUB ANIMATION (--hero-type-y, --hero-type-scale, --hero-type-alpha)
        if (heroEl) {
          // Distance over which hero transitions
          const heroDist = Math.min(windowHeight * 0.85, 580);
          const heroProgress = Math.min(1, Math.max(0, scrollY / heroDist));
          
          // Eased hero mapping: Y: 0 -> -90px, Scale: 1 -> 0.75, Opacity: 1 -> 0
          const heroY = -90 * heroProgress;
          const heroScale = 1 - 0.25 * heroProgress;
          const heroAlpha = Math.max(0, 1 - heroProgress * 1.3);

          heroEl.style.setProperty('--hero-type-y', `${heroY.toFixed(2)}px`);
          heroEl.style.setProperty('--hero-type-scale', `${heroScale.toFixed(3)}`);
          heroEl.style.setProperty('--hero-type-alpha', `${heroAlpha.toFixed(3)}`);
          
          // Backward-compatible fallback aliases
          heroEl.style.setProperty('--hero-y', `${heroY.toFixed(2)}px`);
          heroEl.style.setProperty('--hero-scale', `${heroScale.toFixed(3)}`);
          heroEl.style.setProperty('--hero-opacity', `${heroAlpha.toFixed(3)}`);
        }

        // B. PINNED SCENE PROGRESS (--progress: 0 → 1)
        for (let i = 0; i < scenes.length; i++) {
          const s = scenes[i];
          const rawProgress = (scrollY - s.top) / s.scrollDist;
          const progress = Math.min(1, Math.max(0, rawProgress));

          s.el.style.setProperty('--progress', progress.toFixed(4));
        }

        // C. HORIZONTAL TRACK PROGRESS (--track-x: 0 → -overflowWidth)
        for (let i = 0; i < tracks.length; i++) {
          const t = tracks[i];
          if (!t.parentScene) continue;
          
          const parentRaw = t.parentScene.style.getPropertyValue('--progress');
          const progress = parentRaw ? parseFloat(parentRaw) : 0;
          
          // trackX = -progress * overflowWidth
          const trackX = -progress * t.overflow;
          t.track.style.setProperty('--track-x', `${trackX.toFixed(2)}px`);
        }
      }

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    // 3. ONE SHARED INTERSECTION OBSERVER FOR MICRO-STAGGER REVEALS ([data-rev] + --d)
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const revElements = document.querySelectorAll('[data-rev], .word-reveal');
    revElements.forEach((el, index) => {
      // If --d is not assigned, set staggered delay: 0ms, 50ms, 100ms, 150ms...
      if (!el.style.getPropertyValue('--d')) {
        const staggerDelay = (index % 6) * 50;
        el.style.setProperty('--d', `${staggerDelay}ms`);
      }
      observer.observe(el);
    });

    // Cleanup to prevent memory leaks
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measureLayout);
      window.removeEventListener('load', measureLayout);
      observer.disconnect();
    };
  }, []);
}
