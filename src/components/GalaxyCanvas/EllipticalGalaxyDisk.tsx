import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DEFAULT_ELLIPTICAL_GALAXY_PARAMS, generateEllipticalGalaxyParticles, type Particle } from '../../physics'
import { useSimulationStore } from '../../store/simulationStore'
import { attachStarFieldBuffers, dustOpacity } from './starFieldBuffers'
import { createStarSpriteTexture } from './starSprite'
import { MAX_BRIGHTNESS, MIN_BRIGHTNESS, MIN_PARTICLE_COUNT, TIME_SCALE } from './constants'

const STAR_SPRITE = createStarSpriteTexture()

export function EllipticalGalaxyDisk() {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const particlesRef = useRef<Particle[]>([])
  const buffersRef = useRef<{ positions: Float32Array; colors: Float32Array } | null>(null)

  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starTemperatureBias = useSimulationStore((s) => s.starTemperatureBias)

  const particleCount = Math.max(
    MIN_PARTICLE_COUNT,
    Math.round((DEFAULT_ELLIPTICAL_GALAXY_PARAMS.particleCount * starsPercent) / 100),
  )

  useEffect(() => {
    const geometry = geometryRef.current
    if (!geometry) return

    particlesRef.current = generateEllipticalGalaxyParticles({
      ...DEFAULT_ELLIPTICAL_GALAXY_PARAMS,
      particleCount,
      starTemperatureBias,
    })
    buffersRef.current = attachStarFieldBuffers(geometry, particlesRef.current)
  }, [particleCount, starTemperatureBias])

  useFrame((state) => {
    const geometry = pointsRef.current?.geometry
    const buffers = buffersRef.current
    const particles = particlesRef.current
    if (!geometry || !buffers || particles.length === 0) return

    const t = state.clock.elapsedTime
    const effectiveRadius = DEFAULT_ELLIPTICAL_GALAXY_PARAMS.effectiveRadius

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const angle = particle.angle0 + particle.angularVelocity * TIME_SCALE * t

      buffers.positions[i * 3] = particle.radius * Math.cos(angle)
      buffers.positions[i * 3 + 1] = particle.height
      buffers.positions[i * 3 + 2] = particle.radius * Math.sin(angle)

      const distanceFromCenter = Math.hypot(particle.radius, particle.height)
      const centralProximity = Math.exp(-distanceFromCenter / effectiveRadius)
      const brightness = MIN_BRIGHTNESS + (MAX_BRIGHTNESS - MIN_BRIGHTNESS) * centralProximity

      buffers.colors[i * 3] = particle.color.r * brightness
      buffers.colors[i * 3 + 1] = particle.color.g * brightness
      buffers.colors[i * 3 + 2] = particle.color.b * brightness
    }

    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
    positionAttribute.needsUpdate = true
    const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute
    colorAttribute.needsUpdate = true

    if (materialRef.current) {
      materialRef.current.opacity = dustOpacity(dustPercent)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        ref={materialRef}
        size={0.12}
        map={STAR_SPRITE}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
