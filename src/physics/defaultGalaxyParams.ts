import type { SpiralGalaxyParams } from './galaxyGenerator'
import type { EllipticalGalaxyParams } from './ellipticalGenerator'

export const DEFAULT_SPIRAL_GALAXY_PARAMS: SpiralGalaxyParams = {
  particleCount: 8000,
  diskScaleRadius: 4,
  diskScaleHeight: 0.3,
  rotationV0: 220,
  rotationCoreRadius: 2,
  armCount: 2,
  pitchAngle: Math.PI / 8,
  armWidth: 0.6,
  armPopulationFraction: 0.35,
  starTemperatureBias: 50,
  barStrength: 0,
  barLength: 3,
  barWidth: 0.7,
  barPopulationFraction: 0.25,
  barPatternSpeed: 55, // faster than the plain spiral's ~35 pattern speed
}

export const DEFAULT_ELLIPTICAL_GALAXY_PARAMS: EllipticalGalaxyParams = {
  particleCount: 8000,
  effectiveRadius: 3,
  sersicIndex: 4, // de Vaucouleurs' classic r^(1/4) law
  flattening: 0.4, // roughly an E4
  // Same unscaled units as Ω(r) elsewhere (the renderer applies TIME_SCALE);
  // much slower than a spiral disk's typical Ω(r), consistent with ellipticals'
  // modest, near solid-body rotation.
  rotationSpeed: 14,
  starTemperatureBias: 50,
}
