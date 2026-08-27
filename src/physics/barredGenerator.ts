import type { Particle } from './galaxyGenerator'
import { angularVelocity } from './rotationCurve'
import { sampleExponentialDiskRadius, sampleVerticalOffset } from './diskProfile'
import { logSpiralArmAngle, sampleArmScatter } from './spiralArms'

export interface BarredSpiralGalaxyParams {
  particleCount: number
  diskScaleRadius: number
  diskScaleHeight: number
  rotationV0: number
  rotationCoreRadius: number
  pitchAngle: number
  armWidth: number
  armPopulationFraction: number
  barLength: number
  barWidth: number
  barPopulationFraction: number
  /** The bar is a rigid rotator — every bar star shares this one angular velocity. */
  barPatternSpeed: number
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
 * A bar (rigid, elongated, two-fold symmetric) at the center, with a disk and
 * spiral arms starting from the bar's tips rather than the galaxy's center — the
 * arm curve's reference radius is `barLength`, so logSpiralArmAngle is 0 exactly
 * at the bar's ends and the arms visually pick up where the bar leaves off. Bars
 * are inherently two-fold symmetric, so unlike the plain spiral generator this
 * always produces exactly 2 arms.
 */
export function generateBarredSpiralGalaxyParticles(
  params: BarredSpiralGalaxyParams,
  random: () => number = Math.random,
): Particle[] {
  const particles: Particle[] = []
  const armSpacing = Math.PI

  for (let i = 0; i < params.particleCount; i++) {
    if (random() < params.barPopulationFraction) {
      const { radius, angle } = sampleBarPosition(params.barLength, params.barWidth, random)
      particles.push({
        radius,
        angle0: angle,
        height: sampleVerticalOffset(params.diskScaleHeight * 0.6, random),
        angularVelocity: params.barPatternSpeed,
      })
      continue
    }

    // Disk/arm stars live beyond the bar's tips — shifting the exponential
    // profile outward by barLength keeps the bar visually distinct instead of
    // being swamped by disk stars sampled at small radii.
    const radius = params.barLength + sampleExponentialDiskRadius(params.diskScaleRadius, random)

    const angle0 =
      random() < params.armPopulationFraction
        ? logSpiralArmAngle(radius, params.barLength, params.pitchAngle) +
          Math.floor(random() * 2) * armSpacing +
          sampleArmScatter(params.armWidth, random)
        : random() * Math.PI * 2

    particles.push({
      radius,
      angle0,
      height: sampleVerticalOffset(params.diskScaleHeight, random),
      angularVelocity: angularVelocity(radius, params.rotationV0, params.rotationCoreRadius),
    })
  }

  return particles
}
