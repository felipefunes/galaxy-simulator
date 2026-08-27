export interface StarColor {
  r: number
  g: number
  b: number
}

function hexToStarColor(hex: string): StarColor {
  const n = parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

/**
 * Morgan-Keenan spectral classes, ordered coolest (M) to hottest (O) — array
 * index doubles as the "hotness rank" the temperature bias multiplies against.
 * Colors are the standard approximate blackbody tints per class. Real
 * main-sequence abundances are far more heavily skewed toward M dwarfs (~75%+
 * of all stars) than the baseFraction values below; those are compressed here
 * so a temperature-bias slider has a visible effect across its whole range,
 * instead of needing an extreme exponent to ever surface a blue O star.
 */
const SPECTRAL_TYPES: { color: StarColor; baseFraction: number }[] = [
  { color: hexToStarColor('#ffcc6f'), baseFraction: 0.4 }, // M
  { color: hexToStarColor('#ffd2a1'), baseFraction: 0.25 }, // K
  { color: hexToStarColor('#fff4ea'), baseFraction: 0.15 }, // G
  { color: hexToStarColor('#f8f7ff'), baseFraction: 0.1 }, // F
  { color: hexToStarColor('#cad7ff'), baseFraction: 0.05 }, // A
  { color: hexToStarColor('#aabfff'), baseFraction: 0.03 }, // B
  { color: hexToStarColor('#9bb0ff'), baseFraction: 0.02 }, // O
]

/** Shifts a temperature bias by `offset` and clamps back into [0, 100]. */
export function offsetTemperatureBias(base: number, offset: number): number {
  return Math.min(Math.max(base + offset, 0), 100)
}

/**
 * Samples a spectral type's color, biased toward hot/blue as temperatureBias
 * rises toward 100 or cool/red as it falls toward 0; 50 reproduces the (already
 * cool-skewed) base abundances above unmodified.
 */
export function sampleStarColor(
  temperatureBias: number,
  random: () => number = Math.random,
): StarColor {
  const clamped = Math.min(Math.max(temperatureBias, 0), 100)
  const exponent = (clamped - 50) / 25

  const weights = SPECTRAL_TYPES.map((type, i) => type.baseFraction * 1.8 ** (exponent * i))
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  let remaining = random() * totalWeight
  for (let i = 0; i < SPECTRAL_TYPES.length; i++) {
    remaining -= weights[i]
    if (remaining <= 0) return SPECTRAL_TYPES[i].color
  }
  return SPECTRAL_TYPES[SPECTRAL_TYPES.length - 1].color
}
