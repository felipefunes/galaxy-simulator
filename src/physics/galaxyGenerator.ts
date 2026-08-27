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
 * Generates a disk of stars whose radii follow an exponential disk profile and
 * whose initial angles cluster around a logarithmic spiral (one cluster per arm),
 * evenly spaced every 2π/armCount. Because each particle's angle evolves afterward
 * at its own Ω(r) (see `Particle`) rather than the pattern's, the arms this produces
 * will wind up over time exactly like solid-body rotation would — this generator
 * only fixes the *initial* condition. Keeping the arm pattern itself rigidly
 * rotating (density wave theory, Lin & Shu 1964) is the renderer's job in a later PR.
 */
export function generateSpiralGalaxyParticles(
  params: SpiralGalaxyParams,
  random: () => number = Math.random,
): Particle[] {
  const particles: Particle[] = []

  for (let i = 0; i < params.particleCount; i++) {
    const radius = sampleExponentialDiskRadius(params.diskScaleRadius, random)
    const armIndex = Math.floor(random() * params.armCount)
    const armSpacing = (2 * Math.PI) / params.armCount
    const scatter = sampleArmScatter(params.armWidth, random)

    const angle0 =
      logSpiralArmAngle(radius, params.diskScaleRadius, params.pitchAngle) +
      armIndex * armSpacing +
      scatter

    particles.push({
      radius,
      angle0,
      height: sampleVerticalOffset(params.diskScaleHeight, random),
      angularVelocity: angularVelocity(radius, params.rotationV0, params.rotationCoreRadius),
    })
  }

  return particles
}
