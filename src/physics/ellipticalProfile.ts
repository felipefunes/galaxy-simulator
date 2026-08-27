/**
 * Sérsic profile (Sérsic 1963), generalizing de Vaucouleurs' r^(1/4) law (n = 4)
 * and the exponential disk (n = 1) into one family: I(r) = Ie·exp(-bn·((r/re)^(1/n) - 1)).
 * bn is chosen so the effective radius re encloses half the total light; 2n - 1/3
 * is a standard, accurate approximation for n ≥ 0.5 (Ciotti & Bertin 1999).
 *
 * This uses the Sérsic law directly as a 3D radial density rather than properly
 * deprojecting the (2D, projected) surface-brightness law it actually describes —
 * a real deprojection has no closed form for general n. For a plausible-looking
 * galaxy rather than a research-grade model, that simplification is a fair trade.
 */
export function sersicIntensity(r: number, effectiveRadius: number, sersicIndex: number): number {
  const bn = 2 * sersicIndex - 1 / 3
  return Math.exp(-bn * ((r / effectiveRadius) ** (1 / sersicIndex) - 1))
}

/** The 3D radial sampling target: density times the r² spherical volume element. */
function sersicRadialWeight(r: number, effectiveRadius: number, sersicIndex: number): number {
  return r * r * sersicIntensity(r, effectiveRadius, sersicIndex)
}

/**
 * The Sérsic profile has no closed-form inverse CDF, so radii are drawn by
 * rejection sampling against a uniform envelope. Finding the envelope's height
 * (the target's peak) needs a scan over the profile — do that scan once per
 * generation run, not once per particle, by precomputing it here and passing it
 * into `sampleSersicRadius`.
 */
export function findSersicEnvelopePeak(
  effectiveRadius: number,
  sersicIndex: number,
  maxRadius: number,
  steps = 200,
): number {
  let peak = 0
  for (let i = 0; i <= steps; i++) {
    const r = (maxRadius * i) / steps
    peak = Math.max(peak, sersicRadialWeight(r, effectiveRadius, sersicIndex))
  }
  return peak
}

export function sampleSersicRadius(
  effectiveRadius: number,
  sersicIndex: number,
  envelopePeak: number,
  maxRadius: number,
  random: () => number = Math.random,
): number {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const r = random() * maxRadius
    const acceptThreshold = sersicRadialWeight(r, effectiveRadius, sersicIndex) / envelopePeak
    if (random() < acceptThreshold) return r
  }
  return effectiveRadius
}

/**
 * Places a point at 3D radius `radius` in a direction drawn uniformly over the
 * sphere, then flattens it along the vertical axis by (1 - flattening) — turning
 * an isotropic sphere into an oblate spheroid. flattening runs 0 (E0, round) to
 * ~0.7 (E7, the flattest ellipticals are classified), following the standard
 * En = 10(1 - b/a) classification. Returns cylindrical (radiusXZ, angle, height)
 * so it drops directly into the same Particle shape the spiral disk uses.
 */
export function sampleFlattenedSphericalPosition(
  radius: number,
  flattening: number,
  random: () => number = Math.random,
): { radiusXZ: number; angle: number; height: number } {
  const cosPolar = 2 * random() - 1
  const sinPolar = Math.sqrt(1 - cosPolar * cosPolar)
  const azimuth = random() * 2 * Math.PI

  return {
    radiusXZ: radius * sinPolar,
    angle: azimuth,
    height: radius * cosPolar * (1 - flattening),
  }
}
