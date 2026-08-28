import { useFrame } from '@react-three/fiber'
import { useSimulationStore } from '../../store/simulationStore'
import { simulationClock } from './simulationClock'

/** The single place simulationClock.time is advanced — everything else only reads it. */
export function SimulationClockDriver() {
  const timeSpeed = useSimulationStore((s) => s.timeSpeed)

  useFrame((_, delta) => {
    simulationClock.time += delta * timeSpeed
  })

  return null
}
