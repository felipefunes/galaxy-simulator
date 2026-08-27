/**
 * Logarithmic spiral, the standard shape for galactic arms: r = r0 * exp(b·θ),
 * equivalently θ(r) = (1 / b)·ln(r / r0), where b = 1/tan(pitchAngle). A constant
 * pitch angle is what keeps the arm's "tightness" the same at every radius, matching
 * observed spiral galaxies (Kennicutt 1981).
 */
export function logSpiralArmAngle(
  r: number,
  referenceRadius: number,
  pitchAngle: number,
): number {
  const b = 1 / Math.tan(pitchAngle)
  return (1 / b) * Math.log(r / referenceRadius)
}

/**
 * Angular offset of a star from the nearest arm, for an m-armed spiral. Arms are
 * evenly spaced every 2π/armCount in angle (at fixed r), so we fold the star's
 * angle relative to the arm pattern into [-π/armCount, π/armCount] — the signed
 * distance, in radians, to the closest arm's centerline.
 */
export function angularOffsetFromNearestArm(
  theta: number,
  r: number,
  referenceRadius: number,
  pitchAngle: number,
  armCount: number,
): number {
  const armPhase = logSpiralArmAngle(r, referenceRadius, pitchAngle)
  const spacing = (2 * Math.PI) / armCount
  let delta = (theta - armPhase) % spacing
  if (delta > spacing / 2) delta -= spacing
  if (delta < -spacing / 2) delta += spacing
  return delta
}

/**
 * Samples an angular offset clustered around an arm's centerline. Summing two
 * uniform draws (a triangular distribution) concentrates stars near the arm while
 * still allowing some inter-arm scatter, which is a cheap stand-in for the density
 * enhancement produced by a real Lin-Shu density wave without simulating one.
 */
export function sampleArmScatter(
  armWidth: number,
  random: () => number = Math.random,
): number {
  return ((random() + random() - 1) * armWidth) / 2
}
