import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { t } from '../../i18n'
import { useSimulationStore } from '../../store/simulationStore'
import './GalaxyCanvas.css'
import { EllipticalGalaxyDisk } from './EllipticalGalaxyDisk'
import { SimulationClockDriver } from './SimulationClockDriver'
import { SpiralGalaxyDisk } from './SpiralGalaxyDisk'

const ZOOM_IN_SCALE = 0.8
const ZOOM_OUT_SCALE = 1.25

function GalaxyDisk() {
  const shape = useSimulationStore((s) => s.shape)

  switch (shape) {
    case 'elliptical':
      return <EllipticalGalaxyDisk />
    case 'spiral':
    default:
      return <SpiralGalaxyDisk />
  }
}

export function GalaxyCanvas() {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  function zoomBy(scale: number) {
    const controls = controlsRef.current
    if (!controls) return

    const camera = controls.object
    const target = controls.target
    const offset = camera.position.clone().sub(target).multiplyScalar(scale)
    const distance = offset.length()
    if (distance < controls.minDistance || distance > controls.maxDistance) return

    camera.position.copy(target.clone().add(offset))
    controls.update()
  }

  return (
    <>
      <Canvas camera={{ position: [0, 18, 28], fov: 50 }}>
        <color attach="background" args={['#05050a']} />
        <ambientLight intensity={0.3} />
        <SimulationClockDriver />
        <GalaxyDisk />
        <OrbitControls ref={controlsRef} enableDamping minDistance={6} maxDistance={90} />
      </Canvas>

      <div className="galaxy-canvas__zoom-controls">
        <button
          type="button"
          className="galaxy-canvas__zoom-button"
          aria-label={t.zoomIn}
          onClick={() => zoomBy(ZOOM_IN_SCALE)}
        >
          +
        </button>
        <button
          type="button"
          className="galaxy-canvas__zoom-button"
          aria-label={t.zoomOut}
          onClick={() => zoomBy(ZOOM_OUT_SCALE)}
        >
          −
        </button>
      </div>
    </>
  )
}
