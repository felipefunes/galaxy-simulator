import type { GalaxyShape } from '../../store/simulationStore'
import { useSimulationStore } from '../../store/simulationStore'
import './Sidebar.css'

const SHAPE_OPTIONS: { value: GalaxyShape; label: string }[] = [
  { value: 'spiral', label: 'Espiral' },
  { value: 'elliptical', label: 'Elíptica' },
]

export function Sidebar() {
  const shape = useSimulationStore((s) => s.shape)
  const barStrength = useSimulationStore((s) => s.barStrength)
  const dustPercent = useSimulationStore((s) => s.dustPercent)
  const starsPercent = useSimulationStore((s) => s.starsPercent)
  const darkMatterPercent = useSimulationStore((s) => s.darkMatterPercent)
  const starTemperatureBias = useSimulationStore((s) => s.starTemperatureBias)
  const timeSpeed = useSimulationStore((s) => s.timeSpeed)
  const setShape = useSimulationStore((s) => s.setShape)
  const setBarStrength = useSimulationStore((s) => s.setBarStrength)
  const setDustPercent = useSimulationStore((s) => s.setDustPercent)
  const setStarsPercent = useSimulationStore((s) => s.setStarsPercent)
  const setDarkMatterPercent = useSimulationStore((s) => s.setDarkMatterPercent)
  const setStarTemperatureBias = useSimulationStore((s) => s.setStarTemperatureBias)
  const setTimeSpeed = useSimulationStore((s) => s.setTimeSpeed)

  const isElliptical = shape === 'elliptical'

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

        {!isElliptical && (
          <label className="sidebar__slider sidebar__slider--nested">
            <span>Fuerza de barra</span>
            <div className="sidebar__endpoints">
              <span>Sin barra</span>
              <span>Barra fuerte</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={barStrength}
              onChange={(e) => setBarStrength(Number(e.target.value))}
            />
            <p className="sidebar__hint">
              Una barra no es una forma aparte: es una espiral cuyo centro, con el
              tiempo, desarrolla una estructura rígida y alargada que rota como un
              bloque — el resto del disco sigue girando a su propio ritmo alrededor.
            </p>
          </label>
        )}
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__section-title">Composición</h2>

        <label className="sidebar__slider">
          <span>Cantidad de estrellas</span>
          <div className="sidebar__endpoints">
            <span>Pocas</span>
            <span>Muchas</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={starsPercent}
            onChange={(e) => setStarsPercent(Number(e.target.value))}
          />
        </label>

        <label className="sidebar__slider">
          <span>Temperatura de las estrellas</span>
          <div className="sidebar__endpoints">
            <span>
              <i className="sidebar__swatch" style={{ background: '#ffcc6f' }} />
              Frías
            </span>
            <span>
              Calientes
              <i className="sidebar__swatch" style={{ background: '#9bb0ff' }} />
            </span>
          </div>
          <div className="sidebar__temperature-track">
            <div className="sidebar__temperature-gradient" />
            <input
              type="range"
              min={0}
              max={100}
              value={starTemperatureBias}
              onChange={(e) => setStarTemperatureBias(Number(e.target.value))}
            />
          </div>
          <p className="sidebar__hint">
            Es como un metal calentándose: primero brilla rojo, y al ponerse muy
            caliente brilla blanco-azulado. Acá pasa lo mismo — mové el control para
            cambiar qué tan calientes (y azules) o frías (y rojas) son, en promedio,
            las estrellas de la galaxia.
          </p>
        </label>

        <label className="sidebar__slider">
          <span>
            Materia oscura ({darkMatterPercent}%)
            {isElliptical && ' — sin efecto en elípticas'}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={darkMatterPercent}
            disabled={isElliptical}
            onChange={(e) => setDarkMatterPercent(Number(e.target.value))}
          />
          {isElliptical && (
            <p className="sidebar__hint">
              Las elípticas no giran de forma ordenada como un disco — sus estrellas
              orbitan en direcciones más aleatorias, así que no hay una curva de
              rotación a la que la materia oscura le dé forma.
            </p>
          )}
        </label>

        <label className="sidebar__slider">
          <span>
            Polvo
            {isElliptical && ' — sin efecto en elípticas'}
          </span>
          <div className="sidebar__endpoints">
            <span>Poco</span>
            <span>Mucho</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={dustPercent}
            disabled={isElliptical}
            onChange={(e) => setDustPercent(Number(e.target.value))}
          />
          {isElliptical && (
            <p className="sidebar__hint">
              Las elípticas ya usaron casi todo su gas para formar estrellas hace
              mucho tiempo, así que casi no les queda polvo.
            </p>
          )}
        </label>
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__section-title">Tiempo</h2>

        <label className="sidebar__slider">
          <span>Velocidad de la simulación (×{timeSpeed.toFixed(1)})</span>
          <div className="sidebar__endpoints">
            <span>Pausado</span>
            <span>Rápido</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={timeSpeed}
            onChange={(e) => setTimeSpeed(Number(e.target.value))}
          />
          <p className="sidebar__hint">
            En ×1 ya es un time-lapse: una órbita real tarda millones de años, acá
            unos segundos. Este control acelera o frena ese time-lapse — en 0 la
            galaxia queda congelada.
          </p>
        </label>
      </section>
    </aside>
  )
}
