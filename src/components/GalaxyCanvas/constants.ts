// Ω(r) from the physics module is expressed in abstract simulation units — real
// galactic rotation periods span ~10^8 years, so this compresses that down to a
// pleasant few-rotations-per-minute animation, like a galactic time-lapse.
export const TIME_SCALE = 0.004

export const MIN_PARTICLE_COUNT = 500

// Per-star brightness multiplier range applied on top of each star's fixed
// spectral color. MAX exceeds 1 deliberately — combined with additive
// blending, the brightest stars (near an arm, near the core) genuinely glow
// instead of just reaching flat full color.
export const MIN_BRIGHTNESS = 0.55
export const MAX_BRIGHTNESS = 1.4

// Scaled up to match the camera sitting further back (the whole galaxy needs
// to fit in view on load) — with sizeAttenuation on, a farther camera shrinks
// apparent point size, so this compensates.
export const STAR_POINT_SIZE = 0.32
