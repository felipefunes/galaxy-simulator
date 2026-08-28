import { useState } from 'react'
import { t } from '../../i18n'
import type { GalaxyShape } from '../../store/simulationStore'
import { useSimulationStore } from '../../store/simulationStore'
import './Sidebar.css'

const SHAPE_OPTIONS: { value: GalaxyShape; label: string }[] = [
  { value: 'spiral', label: t.shapeSpiral },
  { value: 'elliptical', label: t.shapeElliptical },
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="sidebar__mobile-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? t.mobileToggleClose : t.mobileToggleOpen}
      </button>

      {isOpen && (
        <div
          className="sidebar__backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={isOpen ? 'sidebar sidebar--open' : 'sidebar'}>
        <h1 className="sidebar__title">{t.appTitle}</h1>
        <p className="sidebar__subtitle">{t.appSubtitle}</p>

        <section className="sidebar__section">
          <h2 className="sidebar__section-title">{t.shapeSectionTitle}</h2>
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
              <span>{t.barStrengthLabel}</span>
              <div className="sidebar__endpoints">
                <span>{t.barStrengthMin}</span>
                <span>{t.barStrengthMax}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={barStrength}
                onChange={(e) => setBarStrength(Number(e.target.value))}
              />
              <p className="sidebar__hint">{t.barStrengthHint}</p>
            </label>
          )}
        </section>

        <section className="sidebar__section">
          <h2 className="sidebar__section-title">{t.compositionSectionTitle}</h2>

          <label className="sidebar__slider">
            <span>{t.starsLabel}</span>
            <div className="sidebar__endpoints">
              <span>{t.starsMin}</span>
              <span>{t.starsMax}</span>
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
            <span>{t.temperatureLabel}</span>
            <div className="sidebar__endpoints">
              <span>
                <i className="sidebar__swatch" style={{ background: '#ffcc6f' }} />
                {t.temperatureCold}
              </span>
              <span>
                {t.temperatureHot}
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
            <p className="sidebar__hint">{t.temperatureHint}</p>
          </label>

          <label className="sidebar__slider">
            <span>
              {t.darkMatterLabel(darkMatterPercent)}
              {isElliptical && t.ellipticalSuffix}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={darkMatterPercent}
              disabled={isElliptical}
              onChange={(e) => setDarkMatterPercent(Number(e.target.value))}
            />
            {isElliptical && <p className="sidebar__hint">{t.darkMatterEllipticalHint}</p>}
          </label>

          <label className="sidebar__slider">
            <span>
              {t.dustLabel}
              {isElliptical && t.ellipticalSuffix}
            </span>
            <div className="sidebar__endpoints">
              <span>{t.dustMin}</span>
              <span>{t.dustMax}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={dustPercent}
              disabled={isElliptical}
              onChange={(e) => setDustPercent(Number(e.target.value))}
            />
            {isElliptical && <p className="sidebar__hint">{t.dustEllipticalHint}</p>}
          </label>
        </section>

        <section className="sidebar__section">
          <h2 className="sidebar__section-title">{t.timeSectionTitle}</h2>

          <label className="sidebar__slider">
            <span>{t.timeSpeedLabel(timeSpeed.toFixed(1))}</span>
            <div className="sidebar__endpoints">
              <span>{t.timeMin}</span>
              <span>{t.timeMax}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={timeSpeed}
              onChange={(e) => setTimeSpeed(Number(e.target.value))}
            />
            <p className="sidebar__hint">{t.timeHint}</p>
          </label>
        </section>
      </aside>
    </>
  )
}
