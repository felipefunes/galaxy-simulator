import { create } from 'zustand'

export type GalaxyShape = 'spiral' | 'barred-spiral' | 'elliptical'

interface SimulationState {
  shape: GalaxyShape
  /** % of stars concentrated in dust lanes / extinguishing background light. */
  dustPercent: number
  /** % of the particle budget actually rendered as stars — controls disk density. */
  starsPercent: number
  /** % dark matter — feeds the rotation curve's asymptotic velocity (see physics/rotationCurve). */
  darkMatterPercent: number
  setShape: (shape: GalaxyShape) => void
  setDustPercent: (value: number) => void
  setStarsPercent: (value: number) => void
  setDarkMatterPercent: (value: number) => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  shape: 'spiral',
  dustPercent: 30,
  starsPercent: 70,
  darkMatterPercent: 60,
  setShape: (shape) => set({ shape }),
  setDustPercent: (dustPercent) => set({ dustPercent }),
  setStarsPercent: (starsPercent) => set({ starsPercent }),
  setDarkMatterPercent: (darkMatterPercent) => set({ darkMatterPercent }),
}))
