import { describe, expect, it } from 'vitest'
import { generateSpiralGalaxyParticles, type SpiralGalaxyParams } from './galaxyGenerator'
import { seededRandom } from './testUtils'

const baseParams: SpiralGalaxyParams = {
  particleCount: 500,
  diskScaleRadius: 4,
  diskScaleHeight: 0.3,
  rotationV0: 220,
  rotationCoreRadius: 2,
  armCount: 2,
  pitchAngle: Math.PI / 8,
  armWidth: 0.5,
}

describe('generateSpiralGalaxyParticles', () => {
  it('returns exactly particleCount particles', () => {
    const particles = generateSpiralGalaxyParticles(baseParams, seededRandom(1))
    expect(particles).toHaveLength(baseParams.particleCount)
  })

  it('produces only finite, physically sane values', () => {
    const particles = generateSpiralGalaxyParticles(baseParams, seededRandom(2))
    for (const p of particles) {
      expect(Number.isFinite(p.radius)).toBe(true)
      expect(p.radius).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(p.angle0)).toBe(true)
      expect(Number.isFinite(p.height)).toBe(true)
      expect(Number.isFinite(p.angularVelocity)).toBe(true)
      expect(p.angularVelocity).toBeGreaterThan(0)
    }
  })

  it('is deterministic given the same random source', () => {
    const a = generateSpiralGalaxyParticles(baseParams, seededRandom(123))
    const b = generateSpiralGalaxyParticles(baseParams, seededRandom(123))
    expect(a).toEqual(b)
  })
})
