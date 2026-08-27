import { describe, expect, it } from 'vitest'
import { sampleStarColor } from './stellarClassification'
import { seededRandom } from './testUtils'

function luminance(color: { r: number; g: number; b: number }) {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
}

function blueness(color: { r: number; g: number; b: number }) {
  return color.b - color.r
}

describe('sampleStarColor', () => {
  it('always returns valid 0-1 RGB', () => {
    const random = seededRandom(1)
    for (let i = 0; i < 2000; i++) {
      const color = sampleStarColor(50, random)
      for (const channel of [color.r, color.g, color.b]) {
        expect(channel).toBeGreaterThanOrEqual(0)
        expect(channel).toBeLessThanOrEqual(1)
      }
    }
  })

  it('skews bluer on average as temperatureBias rises', () => {
    const n = 3000
    const cool = seededRandom(7)
    const hot = seededRandom(7)

    let coolBlueness = 0
    let hotBlueness = 0
    for (let i = 0; i < n; i++) {
      coolBlueness += blueness(sampleStarColor(10, cool))
      hotBlueness += blueness(sampleStarColor(90, hot))
    }

    expect(hotBlueness / n).toBeGreaterThan(coolBlueness / n)
  })

  it('clamps out-of-range bias without throwing', () => {
    const random = seededRandom(3)
    expect(() => sampleStarColor(-50, random)).not.toThrow()
    expect(() => sampleStarColor(500, random)).not.toThrow()
  })

  it('sanity: luminance stays away from pure black across the bias range', () => {
    const random = seededRandom(9)
    for (const bias of [0, 25, 50, 75, 100]) {
      const color = sampleStarColor(bias, random)
      expect(luminance(color)).toBeGreaterThan(0.2)
    }
  })
})
