import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 6000
const DISK_RADIUS = 12
const DISK_THICKNESS = 0.4

function generatePlaceholderDiskPositions() {
  const buffer = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Exponential radial falloff: denser toward the center, thinning outward.
    const r = DISK_RADIUS * Math.sqrt(-Math.log(1 - Math.random()) / 3)
    const theta = Math.random() * Math.PI * 2
    const z = (Math.random() - 0.5) * DISK_THICKNESS

    buffer[i * 3] = r * Math.cos(theta)
    buffer[i * 3 + 1] = z
    buffer[i * 3 + 2] = r * Math.sin(theta)
  }
  return buffer
}

function PlaceholderDisk() {
  const pointsRef = useRef<THREE.Points>(null)
  const [positions] = useState(generatePlaceholderDiskPositions)

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#cdd8ff"
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  )
}

export function GalaxyCanvas() {
  return (
    <Canvas camera={{ position: [0, 7, 11], fov: 50 }}>
      <color attach="background" args={['#05050a']} />
      <ambientLight intensity={0.3} />
      <PlaceholderDisk />
      <OrbitControls enableDamping minDistance={4} maxDistance={40} />
    </Canvas>
  )
}
