import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DUST_LANE_ANGULAR_OFFSET, logSpiralArmAngle } from '../../physics'
import { TIME_SCALE } from './constants'

const DUST_COLOR = '#3a2418'
const MAX_OPACITY = 0.85
const TUBE_RADIUS = 0.16
const CURVE_SEGMENTS = 48

interface DustLaneRibbonProps {
  armCount: number
  pitchAngle: number
  /** Radius where the arm curve's angle is 0 — diskScaleRadius for a plain spiral, barLength for a barred one. */
  armReferenceRadius: number
  minRadius: number
  maxRadius: number
  /** Unscaled pattern speed (same units as elsewhere — TIME_SCALE is applied internally). */
  patternSpeed: number
  dustPercent: number
}

/**
 * A continuous dark ribbon tracing each spiral arm, offset from the stellar
 * density peak (see DUST_LANE_ANGULAR_OFFSET in physics/spiralArms.ts). Built
 * as a static mesh in the pattern's own rotating frame, then animated by
 * rotating the whole group — the arm *pattern* rotates rigidly (Lin & Shu
 * 1964), unlike individual stars, which differentially rotate at their own
 * Ω(r), so this is exact rather than an approximation. A continuous mesh
 * reads as a real dark stroke; sparse particles couldn't (tried first — they
 * were too sparse and dim to be visible against a mostly-black background).
 */
export function DustLaneRibbon({
  armCount,
  pitchAngle,
  armReferenceRadius,
  minRadius,
  maxRadius,
  patternSpeed,
  dustPercent,
}: DustLaneRibbonProps) {
  const groupRef = useRef<THREE.Group>(null)

  const geometries = useMemo(() => {
    const armSpacing = (2 * Math.PI) / armCount
    const geoms: THREE.TubeGeometry[] = []

    for (let arm = 0; arm < armCount; arm++) {
      const angleOffset = arm * armSpacing + DUST_LANE_ANGULAR_OFFSET
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= CURVE_SEGMENTS; i++) {
        const r = minRadius + ((maxRadius - minRadius) * i) / CURVE_SEGMENTS
        const theta = logSpiralArmAngle(r, armReferenceRadius, pitchAngle) + angleOffset
        points.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)))
      }
      const curve = new THREE.CatmullRomCurve3(points)
      geoms.push(new THREE.TubeGeometry(curve, CURVE_SEGMENTS, TUBE_RADIUS, 6, false))
    }

    return geoms
  }, [armCount, pitchAngle, armReferenceRadius, minRadius, maxRadius])

  useFrame((state) => {
    if (groupRef.current) {
      // Rotating the group by -patternSpeed·t here is the mirror image of how
      // a star's angle advances by +Ω·t elsewhere: THREE's rotateY(δ) moves a
      // point from angle θ to θ-δ, so δ must be negative to make the pattern's
      // angle increase over time the same way a star's does.
      groupRef.current.rotation.y = -patternSpeed * TIME_SCALE * state.clock.elapsedTime
    }
  })

  if (dustPercent <= 0) return null

  const opacity = MAX_OPACITY * (dustPercent / 100)

  return (
    <group ref={groupRef}>
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={DUST_COLOR} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
