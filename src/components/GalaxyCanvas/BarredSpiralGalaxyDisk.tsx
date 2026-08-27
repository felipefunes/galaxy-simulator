import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS,
  angularOffsetFromNearestArm,
  generateBarredSpiralGalaxyParticles,
  rotationV0FromDarkMatterFraction,
  type Particle,
} from '../../physics'
import { useSimulationStore } from '../../store/simulationStore'
import { DustLaneRibbon } from './DustLaneRibbon'
import { attachStarFieldBuffers } from './starFieldBuffers'
import { createStarSpriteTexture } from './starSprite'
import { MAX_BRIGHTNESS, MIN_BRIGHTNESS, MIN_PARTICLE_COUNT, TIME_SCALE } from './constants'

// The bar and the arms it feeds are locked to one shared pattern speed — real
// barred galaxies typically show the bar and inner spiral corotating, at least
// approximately (unlike a plain spiral's arms, which have their own pattern
// speed independent of the disk's rotation curve).
const BAR_PATTERN_SPEED_UNSCALED = DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.barPatternSpeed
const BAR_PATTERN_SPEED = BAR_PATTERN_SPEED_UNSCALED * TIME_SCALE
const BAR_BRIGHTNESS = MAX_BRIGHTNESS

const STAR_SPRITE = createStarSpriteTexture()

export function BarredSpiralGalaxyDisk() {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const particlesRef = useRef<Particle[]>([])
  const buffersRef = useRef<{ positions: Float32Array; colors: Float32Array } | null>(null)

  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starTemperatureBias = useSimulationStore((s) => s.starTemperatureBias)

  const particleCount = Math.max(
    MIN_PARTICLE_COUNT,
    Math.round((DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.particleCount * starsPercent) / 100),
  )
  const rotationV0 = rotationV0FromDarkMatterFraction(
    darkMatterPercent / 100,
    DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.rotationV0,
  )

  useEffect(() => {
    const geometry = geometryRef.current
    if (!geometry) return

    particlesRef.current = generateBarredSpiralGalaxyParticles({
      ...DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS,
      particleCount,
      rotationV0,
      starTemperatureBias,
    })
    buffersRef.current = attachStarFieldBuffers(geometry, particlesRef.current)
  }, [particleCount, rotationV0, starTemperatureBias])

  useFrame((state) => {
    const geometry = pointsRef.current?.geometry
    const buffers = buffersRef.current
    const particles = particlesRef.current
    if (!geometry || !buffers || particles.length === 0) return

    const t = state.clock.elapsedTime
    const barLength = DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.barLength

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const angle = particle.angle0 + particle.angularVelocity * TIME_SCALE * t

      buffers.positions[i * 3] = particle.radius * Math.cos(angle)
      buffers.positions[i * 3 + 1] = particle.height
      buffers.positions[i * 3 + 2] = particle.radius * Math.sin(angle)

      let brightness = BAR_BRIGHTNESS
      if (particle.radius > barLength) {
        const armOffset = angularOffsetFromNearestArm(
          angle - BAR_PATTERN_SPEED * t,
          particle.radius,
          barLength,
          DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.pitchAngle,
          2,
        )
        const armProximity = Math.exp(
          -((armOffset / DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.armWidth) ** 2),
        )
        brightness = MIN_BRIGHTNESS + (MAX_BRIGHTNESS - MIN_BRIGHTNESS) * armProximity
      }

      buffers.colors[i * 3] = particle.color.r * brightness
      buffers.colors[i * 3 + 1] = particle.color.g * brightness
      buffers.colors[i * 3 + 2] = particle.color.b * brightness
    }

    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
    positionAttribute.needsUpdate = true
    const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute
    colorAttribute.needsUpdate = true
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef} />
        <pointsMaterial
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
      <DustLaneRibbon
        armCount={2}
        pitchAngle={DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.pitchAngle}
        armReferenceRadius={DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.barLength}
        minRadius={DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.barLength}
        maxRadius={
          DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.barLength +
          DEFAULT_BARRED_SPIRAL_GALAXY_PARAMS.diskScaleRadius * 5
        }
        patternSpeed={BAR_PATTERN_SPEED_UNSCALED}
        dustPercent={dustPercent}
      />
    </>
  )
}
