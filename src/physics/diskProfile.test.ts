import { describe, expect, it } from 'vitest'
import {
  exponentialSurfaceDensity,
  sampleExponentialDiskRadius,
  sampleVerticalOffset,
} from './diskProfile'
import { seededRandom } from './testUtils'

describe('exponentialSurfaceDensity', () => {
  it('is 1 at the center', () => {
    expect(exponentialSurfaceDensity(0, 5)).toBe(1)
  })

  it('equals exp(-1) at one scale radius', () => {
    expect(exponentialSurfaceDensity(5, 5)).toBeCloseTo(Math.exp(-1))
  })

  it('decreases monotonically with radius', () => {
    expect(exponentialSurfaceDensity(10, 5)).toBeLessThan(exponentialSurfaceDensity(5, 5))
  })
})

describe('sampleExponentialDiskRadius', () => {
  it('produces finite, non-negative radii', () => {
    const random = seededRandom(1)
    for (let i = 0; i < 1000; i++) {
      const r = sampleExponentialDiskRadius(5, random)
      expect(Number.isFinite(r)).toBe(true)
      expect(r).toBeGreaterThanOrEqual(0)
    }
  })

  it('has empirical mean close to 2 * scaleRadius (mean of a Gamma(2, scale))', () => {
    const random = seededRandom(42)
    const scaleRadius = 4
    const n = 50000
    let sum = 0
    for (let i = 0; i < n; i++) sum += sampleExponentialDiskRadius(scaleRadius, random)
    const mean = sum / n
    expect(mean).toBeGreaterThan(2 * scaleRadius * 0.95)
    expect(mean).toBeLessThan(2 * scaleRadius * 1.05)
  })
})

describe('sampleVerticalOffset', () => {
  it('produces finite offsets, never Infinity/NaN', () => {
    const random = seededRandom(2)
    for (let i = 0; i < 5000; i++) {
      const z = sampleVerticalOffset(0.3, random)
      expect(Number.isFinite(z)).toBe(true)
    }
  })

  it('is symmetric around zero (empirical mean close to 0)', () => {
    const random = seededRandom(7)
    const scaleHeight = 0.5
    const n = 50000
    let sum = 0
    for (let i = 0; i < n; i++) sum += sampleVerticalOffset(scaleHeight, random)
    const mean = sum / n
    expect(Math.abs(mean)).toBeLessThan(0.05)
  })
})
