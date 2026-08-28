import { describe, expect, it } from 'vitest'
import { generateSpiralGalaxyParticles, spiralArmReferenceRadius, type SpiralGalaxyParams } from './galaxyGenerator'
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
  armPopulationFraction: 0.35,
  starTemperatureBias: 50,
  barStrength: 0,
  barLength: 3,
  barWidth: 0.7,
  barPopulationFraction: 0.25,
  barPatternSpeed: 55,
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
      for (const channel of [p.color.r, p.color.g, p.color.b]) {
        expect(channel).toBeGreaterThanOrEqual(0)
        expect(channel).toBeLessThanOrEqual(1)
      }
    }
  })

  it('is deterministic given the same random source', () => {
    const a = generateSpiralGalaxyParticles(baseParams, seededRandom(123))
    const b = generateSpiralGalaxyParticles(baseParams, seededRandom(123))
    expect(a).toEqual(b)
  })

  it('has no bar stars at all when barStrength is 0 (plain spiral)', () => {
    const particles = generateSpiralGalaxyParticles(baseParams, seededRandom(4))
    const barStars = particles.filter((p) => p.angularVelocity === baseParams.barPatternSpeed)
    expect(barStars).toHaveLength(0)
  })

  describe('with a full-strength bar', () => {
    const barredParams: SpiralGalaxyParams = { ...baseParams, barStrength: 1 }

    it('keeps bar stars within the bar ellipse and gives them the bar pattern speed', () => {
      const particles = generateSpiralGalaxyParticles(barredParams, seededRandom(5))
      const barStars = particles.filter((p) => p.angularVelocity === barredParams.barPatternSpeed)
      expect(barStars.length).toBeGreaterThan(0)
      for (const p of barStars) {
        expect(p.radius).toBeLessThanOrEqual(barredParams.barLength)
      }
    })

    it('keeps disk/arm stars beyond the bar tips', () => {
      const particles = generateSpiralGalaxyParticles(barredParams, seededRandom(6))
      const diskStars = particles.filter((p) => p.angularVelocity !== barredParams.barPatternSpeed)
      expect(diskStars.length).toBeGreaterThan(0)
      for (const p of diskStars) {
        expect(p.radius).toBeGreaterThanOrEqual(barredParams.barLength)
      }
    })
  })
})

describe('spiralArmReferenceRadius', () => {
  it('is the disk scale radius with no bar', () => {
    expect(spiralArmReferenceRadius(4, 3, 0)).toBeCloseTo(4)
  })

  it('is the bar length at full bar strength', () => {
    expect(spiralArmReferenceRadius(4, 3, 1)).toBeCloseTo(3)
  })

  it('interpolates smoothly in between', () => {
    expect(spiralArmReferenceRadius(4, 3, 0.5)).toBeCloseTo(3.5)
  })
})
