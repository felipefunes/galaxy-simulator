import type { GalaxyShape } from '../../store/simulationStore'
import { useSimulationStore } from '../../store/simulationStore'
import './Sidebar.css'

const SHAPE_OPTIONS: { value: GalaxyShape; label: string }[] = [
  { value: 'spiral', label: 'Espiral' },
  { value: 'barred-spiral', label: 'Espiral barrada' },
  { value: 'elliptical', label: 'Elíptica' },
]

export function Sidebar() {
  const shape = useSimulationStore((s) => s.shape)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const starTemperatureBias = useSimulationStore((s) => s.starTemperatureBias)
  const setShape = useSimulationStore((s) => s.setShape)
  const setDustPercent = useSimulationStore((s) => s.setDustPercent)
  const setStarsPercent = useSimulationStore((s) => s.setStarsPercent)
  const setDarkMatterPercent = useSimulationStore((s) => s.setDarkMatterPercent)
  const setStarTemperatureBias = useSimulationStore((s) => s.setStarTemperatureBias)

  return (
    <aside className="sidebar">
      <h1 className="sidebar__title">Galaxy Simulator</h1>
      <p className="sidebar__subtitle">
        Simulación interactiva de estructura y cinemática galáctica.
      </p>

      <section className="sidebar__section">
        <h2 className="sidebar__section-title">Forma</h2>
        <div className="sidebar__shape-options">
          {SHAPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className="sidebar__shape-button"
              aria-pressed={shape === option.value}
              onClick={() => setShape(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__section-title">Composición</h2>

        <label className="sidebar__slider">
          <span>
            Materia oscura ({darkMatterPercent}%)
            {shape === 'elliptical' && ' — sin efecto en elípticas'}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={darkMatterPercent}
            disabled={shape === 'elliptical'}
            onChange={(e) => setDarkMatterPercent(Number(e.target.value))}
          />
        </label>

        <label className="sidebar__slider">
          <span>Estrellas ({starsPercent}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={starsPercent}
            onChange={(e) => setStarsPercent(Number(e.target.value))}
          />
        </label>

        <label className="sidebar__slider">
          <span>Polvo ({dustPercent}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={dustPercent}
            onChange={(e) => setDustPercent(Number(e.target.value))}
          />
        </label>

        <label className="sidebar__slider">
          <span>Temperatura estelar (frías ↔ calientes)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={starTemperatureBias}
            onChange={(e) => setStarTemperatureBias(Number(e.target.value))}
          />
        </label>
      </section>

      <p className="sidebar__note">
        La temperatura estelar sesga el muestreo de tipos espectrales (O-B-A-F-G-K-M,
        de calientes/azules a frías/rojas) de cada estrella. Los carriles de polvo
        siguiendo los brazos quedan para un próximo ajuste.
      </p>
    </aside>
  )
}
