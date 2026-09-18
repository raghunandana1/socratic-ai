import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Custom hook to calculate smooth, GPU-accelerated parallax translation
 * based on the target element's scroll progress through the viewport.
 *
 * @param {React.RefObject} targetRef - Ref to the container or element being tracked
 * @param {number} distance - Distance in pixels to shift (default: 40)
 * @param {string[]} offset - Viewport intersection offset (default: ['start end', 'end start'])
 * @returns {import('framer-motion').MotionValue} - Animated translateY value
 */
export function useParallax(targetRef, distance = 40, offset = ['start end', 'end start']) {
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  const from = -distance;
  const to = distance;

  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [from, to]);

  return y;
}

export default useParallax;
