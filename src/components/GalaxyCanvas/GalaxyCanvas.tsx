import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
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
import { createStarSpriteTexture } from './starSprite'

// Ω(r) from the physics module is expressed in abstract simulation units — real
// galactic rotation periods span ~10^8 years, so this compresses that down to a
// pleasant few-rotations-per-minute animation, like a galactic time-lapse.
const TIME_SCALE = 0.004

// The spiral pattern rotates rigidly at a single speed (Lin & Shu 1964 density
// wave theory), close to Ω(r) at mid-disk — stars visibly stream in and out of the
// arms instead of the whole disk spinning in lockstep.
const SPIRAL_PATTERN_SPEED = 35 * TIME_SCALE

const MIN_PARTICLE_COUNT = 500
// Extinction is dimmed but never fully opaque, even at 100% dust.
const MIN_OPACITY = 0.35
const MAX_OPACITY = 0.9

const DISK_COLOR = new THREE.Color('#8f7a63')
const ARM_COLOR = new THREE.Color('#bcd6ff')
const STAR_SPRITE = createStarSpriteTexture()

function GalaxyDisk() {
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

  // Regenerates the star field whenever a parameter that changes its *initial*
  // distribution (how many stars, how fast they orbit) changes. Re-running the
  // generator reshuffles individual stars, which is expected — the slider
  // controls the population's statistics, not any one star's identity.
  useEffect(() => {
    const geometry = geometryRef.current
    if (!geometry) return

    particlesRef.current = generateSpiralGalaxyParticles({
      ...DEFAULT_SPIRAL_GALAXY_PARAMS,
      particleCount,
      rotationV0,
    })

    const positions = new Float32Array(particlesRef.current.length * 3)
    const colors = new Float32Array(particlesRef.current.length * 3)
    buffersRef.current = { positions, colors }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
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
      materialRef.current.opacity = MAX_OPACITY - (dustPercent / 100) * (MAX_OPACITY - MIN_OPACITY)
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
        opacity={MAX_OPACITY}
        depthWrite={false}
      />
    </points>
  )
}

export function GalaxyCanvas() {
  return (
    <Canvas camera={{ position: [0, 7, 11], fov: 50 }}>
      <color attach="background" args={['#05050a']} />
      <ambientLight intensity={0.3} />
      <GalaxyDisk />
      <OrbitControls enableDamping minDistance={4} maxDistance={40} />
    </Canvas>
  )
}
