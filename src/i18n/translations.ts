import type { Locale } from './detectLocale'

export interface Translations {
  appTitle: string
  appSubtitle: string

  shapeSectionTitle: string
  shapeSpiral: string
  shapeElliptical: string

  barStrengthLabel: string
  barStrengthMin: string
  barStrengthMax: string
  barStrengthHint: string

  compositionSectionTitle: string

  starsLabel: string
  starsMin: string
  starsMax: string

  temperatureLabel: string
  temperatureCold: string
  temperatureHot: string
  temperatureHint: string

  darkMatterLabel: (percent: number) => string
  ellipticalSuffix: string
  darkMatterEllipticalHint: string

  dustLabel: string
  dustMin: string
  dustMax: string
  dustEllipticalHint: string

  timeSectionTitle: string
  timeSpeedLabel: (speed: string) => string
  timeMin: string
  timeMax: string
  timeHint: string

  mobileToggleOpen: string
  mobileToggleClose: string

  zoomIn: string
  zoomOut: string
}

const es: Translations = {
  appTitle: 'Galaxy Simulator',
  appSubtitle: 'Simulación interactiva de estructura y cinemática galáctica.',

  shapeSectionTitle: 'Forma',
  shapeSpiral: 'Espiral',
  shapeElliptical: 'Elíptica',

  barStrengthLabel: 'Fuerza de barra',
  barStrengthMin: 'Sin barra',
  barStrengthMax: 'Barra fuerte',
  barStrengthHint:
    'Una barra no es una forma aparte: es una espiral cuyo centro, con el tiempo, desarrolla una estructura rígida y alargada que rota como un bloque — el resto del disco sigue girando a su propio ritmo alrededor.',

  compositionSectionTitle: 'Composición',

  starsLabel: 'Cantidad de estrellas',
  starsMin: 'Pocas',
  starsMax: 'Muchas',

  temperatureLabel: 'Temperatura de las estrellas',
  temperatureCold: 'Frías',
  temperatureHot: 'Calientes',
  temperatureHint:
    'Es como un metal calentándose: primero brilla rojo, y al ponerse muy caliente brilla blanco-azulado. Acá pasa lo mismo — mové el control para cambiar qué tan calientes (y azules) o frías (y rojas) son, en promedio, las estrellas de la galaxia.',

  darkMatterLabel: (percent) => `Materia oscura (${percent}%)`,
  ellipticalSuffix: ' — sin efecto en elípticas',
  darkMatterEllipticalHint:
    'Las elípticas no giran de forma ordenada como un disco — sus estrellas orbitan en direcciones más aleatorias, así que no hay una curva de rotación a la que la materia oscura le dé forma.',

  dustLabel: 'Polvo',
  dustMin: 'Poco',
  dustMax: 'Mucho',
  dustEllipticalHint:
    'Las elípticas ya usaron casi todo su gas para formar estrellas hace mucho tiempo, así que casi no les queda polvo.',

  timeSectionTitle: 'Tiempo',
  timeSpeedLabel: (speed) => `Velocidad de la simulación (×${speed})`,
  timeMin: 'Pausado',
  timeMax: 'Rápido',
  timeHint:
    'En ×1 ya es un time-lapse: una órbita real tarda millones de años, acá unos segundos. Este control acelera o frena ese time-lapse — en 0 la galaxia queda congelada.',

  mobileToggleOpen: 'Controles ⚙',
  mobileToggleClose: 'Cerrar ✕',

  zoomIn: 'Acercar',
  zoomOut: 'Alejar',
}

const en: Translations = {
  appTitle: 'Galaxy Simulator',
  appSubtitle: 'Interactive simulation of galactic structure and kinematics.',

  shapeSectionTitle: 'Shape',
  shapeSpiral: 'Spiral',
  shapeElliptical: 'Elliptical',

  barStrengthLabel: 'Bar strength',
  barStrengthMin: 'No bar',
  barStrengthMax: 'Strong bar',
  barStrengthHint:
    "A bar isn't a separate shape — it's a spiral whose center, over time, develops a rigid, elongated structure that rotates as a single block, while the rest of the disk keeps spinning around it at its own pace.",

  compositionSectionTitle: 'Composition',

  starsLabel: 'Star count',
  starsMin: 'Few',
  starsMax: 'Many',

  temperatureLabel: 'Star temperature',
  temperatureCold: 'Cool',
  temperatureHot: 'Hot',
  temperatureHint:
    "Think of a metal heating up: it glows red at first, then white-blue once it's very hot. Stars work the same way — move this control to shift how hot (and blue) or cool (and red) the galaxy's stars are, on average.",

  darkMatterLabel: (percent) => `Dark matter (${percent}%)`,
  ellipticalSuffix: ' — no effect on ellipticals',
  darkMatterEllipticalHint:
    "Ellipticals don't rotate in an orderly disk — their stars orbit in more random directions, so there's no rotation curve for dark matter to shape.",

  dustLabel: 'Dust',
  dustMin: 'Little',
  dustMax: 'A lot',
  dustEllipticalHint:
    'Ellipticals used up almost all their gas forming stars long ago, so they have almost no dust left.',

  timeSectionTitle: 'Time',
  timeSpeedLabel: (speed) => `Simulation speed (×${speed})`,
  timeMin: 'Paused',
  timeMax: 'Fast',
  timeHint:
    'Even at ×1 this is already a time-lapse: a real orbit takes millions of years, here it takes seconds. This control speeds up or slows down that time-lapse — at 0 the galaxy freezes.',

  mobileToggleOpen: 'Controls ⚙',
  mobileToggleClose: 'Close ✕',

  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
}

export const translations: Record<Locale, Translations> = { en, es }
