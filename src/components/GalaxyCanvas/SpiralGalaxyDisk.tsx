import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  DEFAULT_SPIRAL_GALAXY_PARAMS,
  angularOffsetFromNearestArm,
  generateSpiralGalaxyParticles,
  rotationV0FromDarkMatterFraction,
  type Particle,
} from '../../physics'
import { useSimulationStore } from '../../store/simulationStore'
import { attachStarFieldBuffers, dustOpacity } from './starFieldBuffers'
import { createStarSpriteTexture } from './starSprite'
import { MIN_PARTICLE_COUNT, TIME_SCALE } from './constants'

// The spiral pattern rotates rigidly at a single speed (Lin & Shu 1964 density
// wave theory), close to Ω(r) at mid-disk — stars visibly stream in and out of the
// arms instead of the whole disk spinning in lockstep.
const SPIRAL_PATTERN_SPEED = 35 * TIME_SCALE

const DISK_COLOR = new THREE.Color('#8f7a63')
const ARM_COLOR = new THREE.Color('#bcd6ff')
const STAR_SPRITE = createStarSpriteTexture()

export function SpiralGalaxyDisk() {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const particlesRef = useRef<Particle[]>([])
  const buffersRef = useRef<{ positions: Float32Array; colors: Float32Array } | null>(null)

  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const dustPercent = useSimulationStore((s) => s.dustPercent)

  const particleCount = Math.max(
    MIN_PARTICLE_COUNT,
    Math.round((DEFAULT_SPIRAL_GALAXY_PARAMS.particleCount * starsPercent) / 100),
  )
  const rotationV0 = rotationV0FromDarkMatterFraction(
    darkMatterPercent / 100,
    DEFAULT_SPIRAL_GALAXY_PARAMS.rotationV0,
  )

  useEffect(() => {
    const geometry = geometryRef.current
    if (!geometry) return

    particlesRef.current = generateSpiralGalaxyParticles({
      ...DEFAULT_SPIRAL_GALAXY_PARAMS,
      particleCount,
      rotationV0,
    })
    buffersRef.current = attachStarFieldBuffers(geometry, particlesRef.current)
  }, [particleCount, rotationV0])

  useFrame((state) => {
    const geometry = pointsRef.current?.geometry
    const buffers = buffersRef.current
    const particles = particlesRef.current
    if (!geometry || !buffers || particles.length === 0) return

    const t = state.clock.elapsedTime
    const scratchColor = new THREE.Color()

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const angle = particle.angle0 + particle.angularVelocity * TIME_SCALE * t

      buffers.positions[i * 3] = particle.radius * Math.cos(angle)
      buffers.positions[i * 3 + 1] = particle.height
      buffers.positions[i * 3 + 2] = particle.radius * Math.sin(angle)

      const armOffset = angularOffsetFromNearestArm(
        angle - SPIRAL_PATTERN_SPEED * t,
        particle.radius,
        DEFAULT_SPIRAL_GALAXY_PARAMS.diskScaleRadius,
        DEFAULT_SPIRAL_GALAXY_PARAMS.pitchAngle,
        DEFAULT_SPIRAL_GALAXY_PARAMS.armCount,
      )
      const armProximity = Math.exp(-((armOffset / DEFAULT_SPIRAL_GALAXY_PARAMS.armWidth) ** 2))
      scratchColor.copy(DISK_COLOR).lerp(ARM_COLOR, armProximity)

      buffers.colors[i * 3] = scratchColor.r
      buffers.colors[i * 3 + 1] = scratchColor.g
      buffers.colors[i * 3 + 2] = scratchColor.b
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
        depthWrite={false}
      />
    </points>
  )
}
