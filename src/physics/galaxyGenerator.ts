import { angularVelocity } from './rotationCurve'
import { sampleExponentialDiskRadius, sampleVerticalOffset } from './diskProfile'
import { logSpiralArmAngle, sampleArmScatter } from './spiralArms'

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
}

/**
 * A star's state in cylindrical coordinates (r, θ, z), plus the angular velocity
 * Ω(r) it orbits at. θ0 is the angle at t = 0; a renderer animates it forward with
 * θ(t) = θ0 + angularVelocity * t — each star genuinely differentially rotates at
 * its own rate instead of the whole disk spinning as a rigid body.
 */
export interface Particle {
  radius: number
  angle0: number
  height: number
  angularVelocity: number
}

/**
 * Generates a disk of stars whose radii follow an exponential disk profile. Most
 * stars get a uniformly random initial angle (the smooth old disk); the rest
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

  for (let i = 0; i < params.particleCount; i++) {
    const radius = sampleExponentialDiskRadius(params.diskScaleRadius, random)

    const angle0 =
      random() < params.armPopulationFraction
        ? logSpiralArmAngle(radius, params.diskScaleRadius, params.pitchAngle) +
          Math.floor(random() * params.armCount) * armSpacing +
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
