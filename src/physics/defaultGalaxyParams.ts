import type { SpiralGalaxyParams } from './galaxyGenerator'

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
}
