import { create } from 'zustand'

export type GalaxyShape = 'spiral' | 'barred-spiral' | 'elliptical'

interface SimulationState {
  shape: GalaxyShape
  /**
   * % dust — controls how much material populates the dust lanes tracing the
   * spiral arms (see physics/dustLane). No effect on ellipticals, which are
   * gas/dust-poor in reality.
   */
  dustPercent: number
  /** % of the particle budget actually rendered as stars — controls disk density. */
  starsPercent: number
  /** % dark matter — feeds the rotation curve's asymptotic velocity (see physics/rotationCurve). */
  darkMatterPercent: number
  /** 0 (cool/red) - 100 (hot/blue) spectral bias for sampled star colors (see physics/stellarClassification). */
  starTemperatureBias: number
  setShape: (shape: GalaxyShape) => void
  setDustPercent: (value: number) => void
  setStarsPercent: (value: number) => void
  setDarkMatterPercent: (value: number) => void
  setStarTemperatureBias: (value: number) => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  shape: 'spiral',
  dustPercent: 30,
  starsPercent: 70,
  darkMatterPercent: 60,
  starTemperatureBias: 50,
  setShape: (shape) => set({ shape }),
  setDustPercent: (dustPercent) => set({ dustPercent }),
  setStarsPercent: (starsPercent) => set({ starsPercent }),
  setDarkMatterPercent: (darkMatterPercent) => set({ darkMatterPercent }),
  setStarTemperatureBias: (starTemperatureBias) => set({ starTemperatureBias }),
}))
