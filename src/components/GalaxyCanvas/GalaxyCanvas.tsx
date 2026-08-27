import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useSimulationStore } from '../../store/simulationStore'
import { BarredSpiralGalaxyDisk } from './BarredSpiralGalaxyDisk'
import { EllipticalGalaxyDisk } from './EllipticalGalaxyDisk'
import { SpiralGalaxyDisk } from './SpiralGalaxyDisk'

function GalaxyDisk() {
  const shape = useSimulationStore((s) => s.shape)

  switch (shape) {
    case 'elliptical':
      return <EllipticalGalaxyDisk />
    case 'barred-spiral':
      return <BarredSpiralGalaxyDisk />
    case 'spiral':
    default:
      return <SpiralGalaxyDisk />
  }
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
