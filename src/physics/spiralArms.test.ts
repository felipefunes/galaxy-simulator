import { describe, expect, it } from 'vitest'
import {
  DUST_LANE_ANGULAR_OFFSET,
  angularOffsetFromNearestArm,
  logSpiralArmAngle,
  sampleArmScatter,
} from './spiralArms'
import { seededRandom } from './testUtils'

describe('logSpiralArmAngle', () => {
  it('is zero at the reference radius', () => {
    expect(logSpiralArmAngle(5, 5, Math.PI / 6)).toBeCloseTo(0)
  })

  it('is finite and changes with radius', () => {
    const pitch = Math.PI / 8
    const a = logSpiralArmAngle(3, 5, pitch)
    const b = logSpiralArmAngle(12, 5, pitch)
    expect(Number.isFinite(a)).toBe(true)
    expect(Number.isFinite(b)).toBe(true)
    expect(a).not.toBeCloseTo(b)
  })
})

describe('angularOffsetFromNearestArm', () => {
  it('is ~0 for a point exactly on the arm', () => {
    const r = 8
    const referenceRadius = 5
    const pitchAngle = Math.PI / 7
    const armCount = 2
    const armAngle = logSpiralArmAngle(r, referenceRadius, pitchAngle)
    const offset = angularOffsetFromNearestArm(armAngle, r, referenceRadius, pitchAngle, armCount)
    expect(Math.abs(offset)).toBeLessThan(1e-9)
  })

  it('stays within [-pi/armCount, pi/armCount]', () => {
    const referenceRadius = 5
    const pitchAngle = Math.PI / 7
    const armCount = 3
    const random = seededRandom(3)
    for (let i = 0; i < 500; i++) {
      const r = 1 + random() * 20
      const theta = random() * Math.PI * 4 - Math.PI * 2
      const offset = angularOffsetFromNearestArm(theta, r, referenceRadius, pitchAngle, armCount)
      expect(offset).toBeGreaterThanOrEqual(-Math.PI / armCount - 1e-9)
      expect(offset).toBeLessThanOrEqual(Math.PI / armCount + 1e-9)
    }
  })
})

describe('DUST_LANE_ANGULAR_OFFSET', () => {
  it('is a small nonzero offset, not accidentally the arm centerline itself', () => {
    expect(DUST_LANE_ANGULAR_OFFSET).not.toBe(0)
    expect(Math.abs(DUST_LANE_ANGULAR_OFFSET)).toBeLessThan(Math.PI / 4)
  })
})

describe('sampleArmScatter', () => {
  it('stays within [-armWidth/2, armWidth/2]', () => {
    const random = seededRandom(9)
    const armWidth = 0.4
    for (let i = 0; i < 2000; i++) {
      const scatter = sampleArmScatter(armWidth, random)
      expect(scatter).toBeGreaterThanOrEqual(-armWidth / 2)
      expect(scatter).toBeLessThanOrEqual(armWidth / 2)
    }
  })

  it('has empirical mean close to 0', () => {
    const random = seededRandom(11)
    const armWidth = 0.6
    const n = 20000
    let sum = 0
    for (let i = 0; i < n; i++) sum += sampleArmScatter(armWidth, random)
    expect(Math.abs(sum / n)).toBeLessThan(0.02)
  })
})
