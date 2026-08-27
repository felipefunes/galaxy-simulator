import * as THREE from 'three'

/**
 * THREE.Points renders each point as a flat square sprite by default. A small
 * radial-gradient texture (opaque center fading to transparent edge) applied as
 * the material's map turns that square into a soft round dot without needing an
 * image asset.
 */
export function createStarSpriteTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  if (!context) return new THREE.Texture()

  const center = size / 2
  const gradient = context.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}
