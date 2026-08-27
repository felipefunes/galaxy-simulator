import * as THREE from 'three'
import type { Particle } from '../../physics'

/** Allocates and attaches fresh position/color buffers for `count` points. */
export function attachPositionColorBuffers(
  geometry: THREE.BufferGeometry,
  count: number,
): { positions: Float32Array; colors: Float32Array } {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { positions, colors }
}

/** Allocates and attaches fresh position/color buffers for a freshly generated star field. */
export function attachStarFieldBuffers(
  geometry: THREE.BufferGeometry,
  particles: Particle[],
): { positions: Float32Array; colors: Float32Array } {
  return attachPositionColorBuffers(geometry, particles.length)
}
