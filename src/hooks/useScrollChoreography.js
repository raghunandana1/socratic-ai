import { useEffect } from 'react';

/**
 * useScrollChoreography
 * 
 * One centralized scroll engine with requestAnimationFrame.
 * Caches all layout measurements (offsetTop, offsetHeight, scrollWidth) on resize/load.
 * Computes normalized progress for each cinematic scene (0 -> begins, 0.5 -> middle, 1 -> ends)
 * and directly updates CSS custom properties (--progress, --track-x, --hero-y, --hero-scale, --hero-opacity).
 * Also runs ONE shared IntersectionObserver with threshold 0.12 for [data-rev] and .word-reveal.
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

      // Find hero element
      heroEl = document.querySelector('.hero-scrub') || document.querySelector('#hero-root');

      // Find all pinned scene containers marked with [data-scene] or .scene
      const sceneElements = document.querySelectorAll('[data-scene], .scene');
      scenes = Array.from(sceneElements).map((el) => {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const top = rect.top + scrollTop;
        const height = el.offsetHeight;
        const scrollDist = Math.max(1, height - windowHeight);

        return {
          el,
          top,
          height,
          scrollDist,
        };
      });

      // Find any horizontal card rails marked with .scene-track or [data-track]
      const trackElements = document.querySelectorAll('.scene-track, [data-track]');
      tracks = Array.from(trackElements).map((track) => {
        const parentScene = track.closest('.scene') || track.closest('[data-scene]');
        const scrollWidth = track.scrollWidth;
        const overflow = Math.max(0, scrollWidth - windowWidth + 64);
        return {
          track,
          parentScene,
          overflow,
        };
      });
    }

    // Measure initially and after layout settles
    measureLayout();
    const t1 = setTimeout(measureLayout, 150);
    const t2 = setTimeout(measureLayout, 500);

    // Re-measure on window resize or when fonts/images load
    window.addEventListener('resize', measureLayout, { passive: true });
    window.addEventListener('load', measureLayout, { passive: true });

    // 2. Single requestAnimationFrame loop
    let rafId = null;
    let lastScrollY = -1;

    function update() {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

      if (scrollY !== lastScrollY) {
        lastScrollY = scrollY;

        // A. Hero Scrubbing (Independent Y, Scale, and Opacity)
        if (heroEl) {
          const heroDist = Math.min(windowHeight * 0.85, 600);
          const heroProgress = Math.min(1, Math.max(0, scrollY / heroDist));
          
          const heroY = -90 * heroProgress;
          const heroScale = 1 - 0.25 * heroProgress;
          const heroOpacity = Math.max(0, 1 - heroProgress * 1.35);

          heroEl.style.setProperty('--hero-y', `${heroY.toFixed(2)}px`);
          heroEl.style.setProperty('--hero-scale', `${heroScale.toFixed(3)}`);
          heroEl.style.setProperty('--hero-opacity', `${heroOpacity.toFixed(3)}`);
        }

        // B. Pinned Scenes Normalized Progress (0.0 -> 1.0)
        for (let i = 0; i < scenes.length; i++) {
          const s = scenes[i];
          const rawProgress = (scrollY - s.top) / s.scrollDist;
          const progress = Math.min(1, Math.max(0, rawProgress));

          s.el.style.setProperty('--progress', progress.toFixed(4));
        }

        // C. Horizontal Rail Translation (translateX = -progress * overflowWidth)
        for (let i = 0; i < tracks.length; i++) {
          const t = tracks[i];
          if (!t.parentScene) continue;
          
          const parentRaw = t.parentScene.style.getPropertyValue('--progress');
          const progress = parentRaw ? parseFloat(parentRaw) : 0;
          
          const trackX = -progress * t.overflow;
          t.track.style.setProperty('--track-x', `${trackX.toFixed(2)}px`);
        }
      }

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    // 3. Shared IntersectionObserver for micro-motion reveals ([data-rev] and .word-reveal)
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
      if (!el.style.getPropertyValue('--d')) {
        const staggerDelay = Math.min(600, (index % 6) * 60);
        el.style.setProperty('--d', `${staggerDelay}ms`);
      }
      observer.observe(el);
    });

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
