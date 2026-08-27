/**
 * v(r) = v0 * r / sqrt(r² + rc²) — a smooth curve that rises near-linearly inside
 * the core radius (solid-body-like) and flattens to ~v0 beyond it, matching the
 * observed flat rotation curves of spiral galaxies (evidence for dark matter halos,
 * e.g. Rubin & Ford 1970; Bosma 1981), instead of the Keplerian falloff you'd expect
 * from visible mass alone.
 */
export function rotationVelocity(r: number, v0: number, coreRadius: number): number {
  return (v0 * r) / Math.sqrt(r * r + coreRadius * coreRadius)
}

/** Ω(r) = v(r) / r, with a finite limit at r → 0 (Ω → v0 / coreRadius). */
export function angularVelocity(r: number, v0: number, coreRadius: number): number {
  if (r === 0) return v0 / coreRadius
  return rotationVelocity(r, v0, coreRadius) / r
}

/**
 * Maps the user-facing "% dark matter" slider to the rotation curve's asymptotic
 * velocity v0. More dark matter means a more massive, more extended halo, which
 * observationally shows up as a higher and flatter rotation curve at large radius —
 * so we scale v0 up with the fraction rather than modeling halo mass directly.
 */
export function rotationV0FromDarkMatterFraction(
  darkMatterFraction: number,
  baseV0: number,
): number {
  const clamped = Math.min(Math.max(darkMatterFraction, 0), 1)
  return baseV0 * (0.5 + 0.5 * clamped)
}
