import { describe, expect, it } from 'vitest'
import { generateBarredSpiralGalaxyParticles, type BarredSpiralGalaxyParams } from './barredGenerator'
import { seededRandom } from './testUtils'

const baseParams: BarredSpiralGalaxyParams = {
  particleCount: 500,
  diskScaleRadius: 4,
  diskScaleHeight: 0.3,
  rotationV0: 220,
  rotationCoreRadius: 2,
  pitchAngle: Math.PI / 8,
  armWidth: 0.6,
  armPopulationFraction: 0.35,
  barLength: 3,
  barWidth: 0.7,
  barPopulationFraction: 0.25,
  barPatternSpeed: 55,
  starTemperatureBias: 50,
}

describe('generateBarredSpiralGalaxyParticles', () => {
  it('returns exactly particleCount particles', () => {
    const particles = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(1))
    expect(particles).toHaveLength(baseParams.particleCount)
  })

  it('produces only finite, physically sane values', () => {
    const particles = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(2))
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

  it('keeps bar stars within the bar ellipse and gives them the bar pattern speed', () => {
    const particles = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(3))
    const barStars = particles.filter((p) => p.angularVelocity === baseParams.barPatternSpeed)
    expect(barStars.length).toBeGreaterThan(0)
    for (const p of barStars) {
      expect(p.radius).toBeLessThanOrEqual(baseParams.barLength)
    }
  })

  it('keeps disk/arm stars beyond the bar tips', () => {
    const particles = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(4))
    const diskStars = particles.filter((p) => p.angularVelocity !== baseParams.barPatternSpeed)
    expect(diskStars.length).toBeGreaterThan(0)
    for (const p of diskStars) {
      expect(p.radius).toBeGreaterThanOrEqual(baseParams.barLength)
    }
  })

  it('is deterministic given the same random source', () => {
    const a = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(123))
    const b = generateBarredSpiralGalaxyParticles(baseParams, seededRandom(123))
    expect(a).toEqual(b)
  })
})
