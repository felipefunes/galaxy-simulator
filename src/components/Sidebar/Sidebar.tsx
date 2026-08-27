import type { GalaxyShape } from '../../store/simulationStore'
import { useSimulationStore } from '../../store/simulationStore'
import './Sidebar.css'

const SHAPE_OPTIONS: { value: GalaxyShape; label: string; available: boolean }[] = [
  { value: 'spiral', label: 'Espiral', available: true },
  { value: 'barred-spiral', label: 'Espiral barrada', available: false },
  { value: 'elliptical', label: 'Elíptica', available: false },
]

export function Sidebar() {
  const shape = useSimulationStore((s) => s.shape)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const setShape = useSimulationStore((s) => s.setShape)
  const setDustPercent = useSimulationStore((s) => s.setDustPercent)
  const setStarsPercent = useSimulationStore((s) => s.setStarsPercent)
  const setDarkMatterPercent = useSimulationStore((s) => s.setDarkMatterPercent)

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
              disabled={!option.available}
              onClick={() => setShape(option.value)}
            >
              {option.label}
              {!option.available && <span className="sidebar__badge">próximamente</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__section-title">Composición</h2>

        <label className="sidebar__slider">
          <span>Materia oscura ({darkMatterPercent}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={darkMatterPercent}
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
      </section>

      <p className="sidebar__note">
        Espiral barrada y elíptica llegan en un próximo PR. El polvo hoy atenúa el
        brillo general; los carriles de polvo siguiendo los brazos son un ajuste
        futuro.
      </p>
    </aside>
  )
}
