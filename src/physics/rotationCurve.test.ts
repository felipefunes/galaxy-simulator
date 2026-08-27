import { describe, expect, it } from 'vitest'
import {
  angularVelocity,
  rotationV0FromDarkMatterFraction,
  rotationVelocity,
} from './rotationCurve'

describe('rotationVelocity', () => {
  it('is zero at the center', () => {
    expect(rotationVelocity(0, 220, 2)).toBe(0)
  })

  it('approaches v0 far from the core (flat rotation curve)', () => {
    const v0 = 220
    const v = rotationVelocity(1000, v0, 2)
    expect(v).toBeGreaterThan(v0 * 0.99)
    expect(v).toBeLessThanOrEqual(v0)
  })

  it('is monotonically increasing with radius', () => {
    const v0 = 220
    const coreRadius = 3
    const radii = [0, 1, 2, 5, 10, 20, 50]
    const velocities = radii.map((r) => rotationVelocity(r, v0, coreRadius))
    for (let i = 1; i < velocities.length; i++) {
      expect(velocities[i]).toBeGreaterThan(velocities[i - 1])
    }
  })
})

describe('angularVelocity', () => {
  it('has a finite limit at r = 0 equal to v0 / coreRadius', () => {
    expect(angularVelocity(0, 220, 4)).toBeCloseTo(220 / 4)
  })

  it('matches rotationVelocity(r) / r away from the center', () => {
    const v0 = 220
    const coreRadius = 3
    const r = 12
    expect(angularVelocity(r, v0, coreRadius)).toBeCloseTo(
      rotationVelocity(r, v0, coreRadius) / r,
    )
  })
})

describe('rotationV0FromDarkMatterFraction', () => {
  it('maps 0% dark matter to half the base v0', () => {
    expect(rotationV0FromDarkMatterFraction(0, 220)).toBeCloseTo(110)
  })

  it('maps 100% dark matter to the full base v0', () => {
    expect(rotationV0FromDarkMatterFraction(1, 220)).toBeCloseTo(220)
  })

  it('is monotonically increasing in the fraction', () => {
    const a = rotationV0FromDarkMatterFraction(0.2, 220)
    const b = rotationV0FromDarkMatterFraction(0.8, 220)
    expect(b).toBeGreaterThan(a)
  })

  it('clamps fractions outside [0, 1]', () => {
    expect(rotationV0FromDarkMatterFraction(-1, 220)).toBeCloseTo(110)
    expect(rotationV0FromDarkMatterFraction(5, 220)).toBeCloseTo(220)
  })
})
