import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  DEFAULT_SPIRAL_GALAXY_PARAMS,
  angularOffsetFromNearestArm,
  generateSpiralGalaxyParticles,
  rotationV0FromDarkMatterFraction,
  spiralArmReferenceRadius,
  type Particle,
} from '../../physics'
import { useSimulationStore } from '../../store/simulationStore'
import { DustLaneRibbon } from './DustLaneRibbon'
import { attachStarFieldBuffers } from './starFieldBuffers'
import { createStarSpriteTexture } from './starSprite'
import {
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
  MIN_PARTICLE_COUNT,
  STAR_POINT_SIZE,
  TIME_SCALE,
} from './constants'

// A plain spiral's arms have their own pattern speed (Lin & Shu 1964), close
// to Ω(r) at mid-disk. A bar rotates faster and, when present, the arms it
// feeds are locked to *its* pattern speed instead — real barred galaxies
// typically show the bar and inner spiral corotating. Blended by barStrength
// so the transition from one regime to the other is continuous.
const SPIRAL_PATTERN_SPEED_UNSCALED = 35
const BAR_PATTERN_SPEED_UNSCALED = DEFAULT_SPIRAL_GALAXY_PARAMS.barPatternSpeed
const BAR_BRIGHTNESS = MAX_BRIGHTNESS

const STAR_SPRITE = createStarSpriteTexture()

export function SpiralGalaxyDisk() {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const particlesRef = useRef<Particle[]>([])
  const buffersRef = useRef<{ positions: Float32Array; colors: Float32Array } | null>(null)

  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starTemperatureBias = useSimulationStore((s) => s.starTemperatureBias)
  const barStrength = useSimulationStore((s) => s.barStrength) / 100

  const particleCount = Math.max(
    MIN_PARTICLE_COUNT,
    Math.round((DEFAULT_SPIRAL_GALAXY_PARAMS.particleCount * starsPercent) / 100),
  )
  const rotationV0 = rotationV0FromDarkMatterFraction(
    darkMatterPercent / 100,
    DEFAULT_SPIRAL_GALAXY_PARAMS.rotationV0,
  )

  const effectiveBarLength = DEFAULT_SPIRAL_GALAXY_PARAMS.barLength * barStrength
  const armReferenceRadius = spiralArmReferenceRadius(
    DEFAULT_SPIRAL_GALAXY_PARAMS.diskScaleRadius,
    DEFAULT_SPIRAL_GALAXY_PARAMS.barLength,
    barStrength,
  )
  const patternSpeedUnscaled =
    SPIRAL_PATTERN_SPEED_UNSCALED * (1 - barStrength) + BAR_PATTERN_SPEED_UNSCALED * barStrength
  const patternSpeed = patternSpeedUnscaled * TIME_SCALE

  useEffect(() => {
    const geometry = geometryRef.current
    if (!geometry) return

    particlesRef.current = generateSpiralGalaxyParticles({
      ...DEFAULT_SPIRAL_GALAXY_PARAMS,
      particleCount,
      rotationV0,
      starTemperatureBias,
      barStrength,
    })
    buffersRef.current = attachStarFieldBuffers(geometry, particlesRef.current)
  }, [particleCount, rotationV0, starTemperatureBias, barStrength])

  useFrame((state) => {
    const geometry = pointsRef.current?.geometry
    const buffers = buffersRef.current
    const particles = particlesRef.current
    if (!geometry || !buffers || particles.length === 0) return

    const t = state.clock.elapsedTime

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const angle = particle.angle0 + particle.angularVelocity * TIME_SCALE * t

      buffers.positions[i * 3] = particle.radius * Math.cos(angle)
      buffers.positions[i * 3 + 1] = particle.height
      buffers.positions[i * 3 + 2] = particle.radius * Math.sin(angle)

      let brightness = BAR_BRIGHTNESS
      if (particle.radius > effectiveBarLength) {
        const armOffset = angularOffsetFromNearestArm(
          angle - patternSpeed * t,
          particle.radius,
          armReferenceRadius,
          DEFAULT_SPIRAL_GALAXY_PARAMS.pitchAngle,
          DEFAULT_SPIRAL_GALAXY_PARAMS.armCount,
        )
        const armProximity = Math.exp(-((armOffset / DEFAULT_SPIRAL_GALAXY_PARAMS.armWidth) ** 2))
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
          size={STAR_POINT_SIZE}
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
        armCount={DEFAULT_SPIRAL_GALAXY_PARAMS.armCount}
        pitchAngle={DEFAULT_SPIRAL_GALAXY_PARAMS.pitchAngle}
        armReferenceRadius={armReferenceRadius}
        minRadius={Math.max(effectiveBarLength, DEFAULT_SPIRAL_GALAXY_PARAMS.diskScaleRadius * 0.3)}
        maxRadius={effectiveBarLength + DEFAULT_SPIRAL_GALAXY_PARAMS.diskScaleRadius * 5}
        patternSpeed={patternSpeedUnscaled}
        dustPercent={dustPercent}
      />
    </>
  )
}
