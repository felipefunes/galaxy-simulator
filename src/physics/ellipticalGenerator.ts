import type { Particle } from './galaxyGenerator'
import {
  findSersicEnvelopePeak,
  sampleFlattenedSphericalPosition,
  sampleSersicRadius,
} from './ellipticalProfile'
import { offsetTemperatureBias, sampleStarColor } from './stellarClassification'

/** Ellipticals are "red and dead" — old population, no ongoing star formation. */
const ELLIPTICAL_TEMPERATURE_OFFSET = -30

export interface EllipticalGalaxyParams {
  particleCount: number
  effectiveRadius: number
  sersicIndex: number
  /** 0 (E0, round) to ~0.7 (E7, flattest classified) — see sampleFlattenedSphericalPosition. */
  flattening: number
  /**
   * Ellipticals are pressure- (velocity dispersion-) supported, not centrifugally
   * supported like disks — there's no strong Ω(r) rotation curve. A slow, ~uniform
   * angular velocity for every star is a reasonable stand-in for the modest solid
   * body-like rotation observed in real "fast rotator" ellipticals.
   */
  rotationSpeed: number
  /** 0-100 spectral temperature baseline; shifted cooler internally — see stellarClassification.ts. */
  starTemperatureBias: number
}

export function generateEllipticalGalaxyParticles(
  params: EllipticalGalaxyParams,
  random: () => number = Math.random,
): Particle[] {
  const maxRadius = params.effectiveRadius * 8
  const envelopePeak = findSersicEnvelopePeak(params.effectiveRadius, params.sersicIndex, maxRadius)
  const temperatureBias = offsetTemperatureBias(
    params.starTemperatureBias,
    ELLIPTICAL_TEMPERATURE_OFFSET,
  )

  const particles: Particle[] = []
  for (let i = 0; i < params.particleCount; i++) {
    const radius3D = sampleSersicRadius(
      params.effectiveRadius,
      params.sersicIndex,
      envelopePeak,
      maxRadius,
      random,
    )
    const { radiusXZ, angle, height } = sampleFlattenedSphericalPosition(
      radius3D,
      params.flattening,
      random,
    )

    particles.push({
      radius: radiusXZ,
      angle0: angle,
      height,
      angularVelocity: params.rotationSpeed,
      color: sampleStarColor(temperatureBias, random),
    })
  }

  return particles
}
