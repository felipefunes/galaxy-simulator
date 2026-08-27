import * as THREE from 'three'
import type { Particle } from '../../physics'

/** Allocates and attaches fresh position/color buffers for a freshly generated star field. */
export function attachStarFieldBuffers(
  geometry: THREE.BufferGeometry,
  particles: Particle[],
): { positions: Float32Array; colors: Float32Array } {
  const positions = new Float32Array(particles.length * 3)
  const colors = new Float32Array(particles.length * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { positions, colors }
}

const MIN_OPACITY = 0.35
const MAX_OPACITY = 0.9

/** Global light-extinction stand-in: more dust dims the whole field, never to fully opaque. */
export function dustOpacity(dustPercent: number): number {
  return MAX_OPACITY - (dustPercent / 100) * (MAX_OPACITY - MIN_OPACITY)
}
