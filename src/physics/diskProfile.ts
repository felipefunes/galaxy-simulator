/**
 * Surface density of a galactic disk falls off exponentially with radius
 * (Freeman 1970): Σ(r) = Σ0 * exp(-r / scaleRadius).
 */
export function exponentialSurfaceDensity(r: number, scaleRadius: number): number {
  return Math.exp(-r / scaleRadius)
}

/**
 * Samples a radius from the 2D exponential disk. The radial probability density
 * (after folding in the r dθ dr area element) is p(r) ∝ r·exp(-r/scaleRadius), i.e.
 * a Gamma(shape=2, scale=scaleRadius) distribution. The sum of two independent
 * Exponential(scaleRadius) draws follows exactly that Gamma distribution, which
 * gives an exact, closed-form sampler with no rejection or numerical inversion:
 * r = -scaleRadius * ln(u1 * u2), u1, u2 ~ Uniform(0, 1).
 */
export function sampleExponentialDiskRadius(
  scaleRadius: number,
  random: () => number = Math.random,
): number {
  const u1 = 1 - random()
  const u2 = 1 - random()
  return -scaleRadius * Math.log(u1 * u2)
}

/**
 * Vertical structure of an isothermal disk follows a sech² profile
 * (van der Kruit & Searle 1981): ρ(z) ∝ sech²(z / (2·scaleHeight)).
 * That density is (up to scale) the logistic distribution, which has the
 * closed-form inverse CDF z = scaleHeight * ln(u / (1 - u)).
 */
export function sampleVerticalOffset(
  scaleHeight: number,
  random: () => number = Math.random,
): number {
  // Math.random() can return exactly 0, which would send ln(u / (1-u)) to -Infinity.
  // Clamp away from both ends of the (0, 1) open interval the inverse CDF needs.
  const u = Math.min(Math.max(random(), Number.EPSILON), 1 - Number.EPSILON)
  return scaleHeight * Math.log(u / (1 - u))
}
