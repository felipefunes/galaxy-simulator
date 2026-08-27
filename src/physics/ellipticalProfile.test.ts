import { describe, expect, it } from 'vitest'
import {
  findSersicEnvelopePeak,
  sampleFlattenedSphericalPosition,
  sampleSersicRadius,
  sersicIntensity,
} from './ellipticalProfile'
import { seededRandom } from './testUtils'

describe('sersicIntensity', () => {
  it('is 1 at the effective radius (by construction, bn cancels there)', () => {
    expect(sersicIntensity(3, 3, 4)).toBeCloseTo(1)
  })

  it('decreases monotonically with radius', () => {
    expect(sersicIntensity(6, 3, 4)).toBeLessThan(sersicIntensity(3, 3, 4))
  })
})

describe('sampleSersicRadius', () => {
  it('produces finite radii within [0, maxRadius]', () => {
    const random = seededRandom(1)
    const effectiveRadius = 3
    const sersicIndex = 4
    const maxRadius = effectiveRadius * 8
    const peak = findSersicEnvelopePeak(effectiveRadius, sersicIndex, maxRadius)

    for (let i = 0; i < 1000; i++) {
      const r = sampleSersicRadius(effectiveRadius, sersicIndex, peak, maxRadius, random)
      expect(Number.isFinite(r)).toBe(true)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(maxRadius)
    }
  })
})

describe('sampleFlattenedSphericalPosition', () => {
  it('keeps points on a sphere of the given radius before flattening', () => {
    const random = seededRandom(5)
    const radius = 4
    for (let i = 0; i < 500; i++) {
      const { radiusXZ, height } = sampleFlattenedSphericalPosition(radius, 0, random)
      const total = Math.sqrt(radiusXZ * radiusXZ + height * height)
      expect(total).toBeCloseTo(radius, 5)
    }
  })

  it('compresses the vertical extent as flattening increases', () => {
    const seedA = seededRandom(21)
    const seedB = seededRandom(21)
    const radius = 4

    let sumAbsHeightRound = 0
    let sumAbsHeightFlat = 0
    const n = 2000
    for (let i = 0; i < n; i++) {
      sumAbsHeightRound += Math.abs(sampleFlattenedSphericalPosition(radius, 0, seedA).height)
      sumAbsHeightFlat += Math.abs(sampleFlattenedSphericalPosition(radius, 0.6, seedB).height)
    }
    expect(sumAbsHeightFlat / n).toBeLessThan(sumAbsHeightRound / n)
  })
})
