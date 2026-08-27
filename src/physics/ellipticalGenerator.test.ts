import { describe, expect, it } from 'vitest'
import { generateEllipticalGalaxyParticles, type EllipticalGalaxyParams } from './ellipticalGenerator'
import { seededRandom } from './testUtils'

const baseParams: EllipticalGalaxyParams = {
  particleCount: 500,
  effectiveRadius: 3,
  sersicIndex: 4,
  flattening: 0.4,
  rotationSpeed: 14,
}

describe('generateEllipticalGalaxyParticles', () => {
  it('returns exactly particleCount particles', () => {
    const particles = generateEllipticalGalaxyParticles(baseParams, seededRandom(1))
    expect(particles).toHaveLength(baseParams.particleCount)
  })

  it('produces only finite, physically sane values', () => {
    const particles = generateEllipticalGalaxyParticles(baseParams, seededRandom(2))
    for (const p of particles) {
      expect(Number.isFinite(p.radius)).toBe(true)
      expect(p.radius).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(p.angle0)).toBe(true)
      expect(Number.isFinite(p.height)).toBe(true)
      expect(p.angularVelocity).toBe(baseParams.rotationSpeed)
    }
  })

  it('is deterministic given the same random source', () => {
    const a = generateEllipticalGalaxyParticles(baseParams, seededRandom(123))
    const b = generateEllipticalGalaxyParticles(baseParams, seededRandom(123))
    expect(a).toEqual(b)
  })
})
