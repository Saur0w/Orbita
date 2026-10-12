/**
 * Custom Easing functions and cubic-bezier solver for Lenis Smooth Scroll.
 *
 * Lenis easing functions accept a normalized progress value `t` (0 to 1)
 * and return the eased progress value (0 to 1).
 */

/**
 * High-performance cubic-bezier solver using the Newton-Raphson method.
 * Reproduces CSS cubic-bezier(x1, y1, x2, y2) curves mathematically.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return function (t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    // Newton-Raphson iteration to find parameter u for input t
    let u = t;
    for (let i = 0; i < 8; i++) {
      const currentX =
        3 * (1 - u) * (1 - u) * u * x1 +
        3 * (1 - u) * u * u * x2 +
        u * u * u;
      const dx =
        3 * (1 - u) * (1 - u) * x1 +
        6 * (1 - u) * u * (x2 - x1) +
        3 * u * u * (1 - x2);

      if (Math.abs(currentX - t) < 1e-6) break;
      if (Math.abs(dx) < 1e-6) break;
      u -= (currentX - t) / dx;
    }

    return (
      3 * (1 - u) * (1 - u) * u * y1 +
      3 * (1 - u) * u * u * y2 +
      u * u * u
    );
  };
}

/**
 * Curated custom easing curves for luxury smooth scrolling:
 */

/**
 * 1. "Apple Ease" / Studio Freight curve: cubic-bezier(0.16, 1, 0.3, 1)
 * Highly responsive initial movement with an ultra-graceful, natural deceleration.
 */
export const appleEase = cubicBezier(0.16, 1, 0.3, 1);

/**
 * 2. "Ease Out Quint" (The Velvet Glide): 1 - (1 - t)^5
 * Starts immediately with momentum and eases out with extreme smoothness.
 * Eliminates mechanical stops and feels exceptionally buttery.
 */
export const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

/**
 * 3. "Ease Out Quart": 1 - (1 - t)^4
 * Slightly snappier than Quint, great for interactive product pages.
 */
export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

/**
 * 4. "Smooth Expo Out": Exponential ease-out with a clamped tail.
 * Classic smooth-scroll feel with extended inertial glide.
 */
export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * 5. "Cinematic Fluid": cubic-bezier(0.22, 1, 0.36, 1)
 * Balanced between responsiveness and luxurious inertial glide.
 */
export const cinematicEase = cubicBezier(0.22, 1, 0.36, 1);
