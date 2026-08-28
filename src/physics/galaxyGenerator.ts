import { angularVelocity } from './rotationCurve'
import { sampleExponentialDiskRadius, sampleVerticalOffset } from './diskProfile'
import { logSpiralArmAngle, sampleArmScatter } from './spiralArms'
import { offsetTemperatureBias, sampleStarColor, type StarColor } from './stellarClassification'

/** Arm stars sample hotter than the disk baseline — recent star formation. */
const ARM_TEMPERATURE_BOOST = 40

export interface SpiralGalaxyParams {
  particleCount: number
  diskScaleRadius: number
  diskScaleHeight: number
  rotationV0: number
  rotationCoreRadius: number
  armCount: number
  pitchAngle: number
  armWidth: number
  /**
   * Fraction of stars whose initial angle clusters onto a spiral arm rather than
   * being spread uniformly. Real disks are mostly an old, smooth population with
   * only a minority of young stars concentrated where the density wave most
   * recently triggered star formation — putting *everyone* on the arm curve would
   * turn the disk into a thin ribbon instead of a galaxy.
   */
  armPopulationFraction: number
  /** 0-100 spectral temperature baseline for the disk population; see stellarClassification.ts. */
  starTemperatureBias: number
  /**
   * 0 (no bar, a plain spiral) to 1 (a fully-developed bar). A bar isn't a
   * separate galaxy type the way an elliptical is — it's a secular
   * instability that develops *within* a disk over time (Sellwood &
   * Wilkinson 1993), so it's modeled as a continuum blended into the same
   * generator rather than a discrete alternate shape.
   */
  barStrength: number
  /** Full-strength (barStrength = 1) semi-major axis of the bar. */
  barLength: number
  /** Full-strength (barStrength = 1) semi-minor axis of the bar. */
  barWidth: number
  /** Full-strength (barStrength = 1) fraction of stars belonging to the bar. */
  barPopulationFraction: number
  /** The bar is a rigid rotator — every bar star shares this one angular velocity. */
  barPatternSpeed: number
}

/**
 * A star's state in cylindrical coordinates (r, θ, z), plus the angular velocity
 * Ω(r) it orbits at. θ0 is the angle at t = 0; a renderer animates it forward with
 * θ(t) = θ0 + angularVelocity * t — each star genuinely differentially rotates at
 * its own rate instead of the whole disk spinning as a rigid body. color is fixed
 * at generation time (a star's spectral type doesn't change); the renderer is
 * free to modulate brightness dynamically without changing hue.
 */
export interface Particle {
  radius: number
  angle0: number
  height: number
  angularVelocity: number
  color: StarColor
}

/** Uniform sampling inside an ellipse of semi-axes (length, width) via rejection. */
function sampleBarPosition(
  length: number,
  width: number,
  random: () => number,
): { radius: number; angle: number } {
  for (let attempt = 0; attempt < 50; attempt++) {
    const u = (random() * 2 - 1) * length
    const v = (random() * 2 - 1) * width
    if ((u / length) ** 2 + (v / width) ** 2 <= 1) {
      return { radius: Math.hypot(u, v), angle: Math.atan2(v, u) }
    }
  }
  return { radius: 0, angle: 0 }
}

/**
 * The radius where the arm curve's angle is defined to be 0. With no bar this
 * is the disk scale radius (arms wind up from near the visually "typical"
 * radius); with a full bar it's the bar's own tip (arms visually pick up
 * where the bar ends). Blended linearly in between so the curve's anchor
 * moves continuously as barStrength changes instead of jumping.
 */
export function spiralArmReferenceRadius(
  diskScaleRadius: number,
  barLength: number,
  barStrength: number,
): number {
  return diskScaleRadius * (1 - barStrength) + barLength * barStrength
}

/**
 * Generates a disk of stars whose radii follow an exponential disk profile,
 * optionally with a bar at the center (see `barStrength`). Most non-bar stars
 * get a uniformly random initial angle (the smooth old disk); the rest
 * cluster around a logarithmic spiral, one cluster per arm evenly spaced every
 * 2π/armCount. Because each particle's angle evolves afterward at its own Ω(r)
 * (see `Particle`) rather than the pattern's, the arm-clustered stars will drift
 * relative to the (separately, rigidly rotating) arm pattern over time exactly as
 * density wave theory predicts (Lin & Shu 1964) — this generator only fixes the
 * *initial* condition; animating the pattern's own rotation is the renderer's job.
 */
export function generateSpiralGalaxyParticles(
  params: SpiralGalaxyParams,
  random: () => number = Math.random,
): Particle[] {
  const particles: Particle[] = []
  const armSpacing = (2 * Math.PI) / params.armCount

  const effectiveBarLength = params.barLength * params.barStrength
  const effectiveBarWidth = params.barWidth * params.barStrength
  const effectiveBarPopulationFraction = params.barPopulationFraction * params.barStrength
  const armReferenceRadius = spiralArmReferenceRadius(
    params.diskScaleRadius,
    params.barLength,
    params.barStrength,
  )

  for (let i = 0; i < params.particleCount; i++) {
    // effectiveBarPopulationFraction is exactly 0 when barStrength is 0, so
    // this branch is naturally unreachable for a bar-less spiral — no
    // separate "if barStrength > 0" guard needed.
    if (random() < effectiveBarPopulationFraction) {
      const { radius, angle } = sampleBarPosition(effectiveBarLength, effectiveBarWidth, random)
      particles.push({
        radius,
        angle0: angle,
        height: sampleVerticalOffset(params.diskScaleHeight * 0.6, random),
        angularVelocity: params.barPatternSpeed,
        color: sampleStarColor(params.starTemperatureBias, random),
      })
      continue
    }

    // Disk/arm stars live beyond the bar's tips (0 when there's no bar) —
    // shifting the exponential profile outward keeps a real bar visually
    // distinct instead of being swamped by disk stars sampled at small radii.
    const radius = effectiveBarLength + sampleExponentialDiskRadius(params.diskScaleRadius, random)
    const isArmStar = random() < params.armPopulationFraction

    const angle0 = isArmStar
      ? logSpiralArmAngle(radius, armReferenceRadius, params.pitchAngle) +
        Math.floor(random() * params.armCount) * armSpacing +
        sampleArmScatter(params.armWidth, random)
      : random() * Math.PI * 2

    const temperatureBias = isArmStar
      ? offsetTemperatureBias(params.starTemperatureBias, ARM_TEMPERATURE_BOOST)
      : params.starTemperatureBias

    particles.push({
      radius,
      angle0,
      height: sampleVerticalOffset(params.diskScaleHeight, random),
      angularVelocity: angularVelocity(radius, params.rotationV0, params.rotationCoreRadius),
      color: sampleStarColor(temperatureBias, random),
    })
  }

  return particles
}
