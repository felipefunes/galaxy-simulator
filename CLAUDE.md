# Galaxy Simulator

Simulador interactivo de estructura y cinemática galáctica: una vista con un canvas 3D
(react-three-fiber / three.js) donde se renderiza una galaxia procedural (espiral, espiral
barrada o elíptica), y un sidebar con parámetros de visualización (forma, % de polvo,
% de estrellas, % de materia oscura, velocidad de rotación).

No es un N-body real. La cinemática se modela con curvas de rotación paramétricas y teoría
de ondas de densidad (Lin-Shu) para los brazos espirales — ver el módulo `src/physics`
(a partir del PR 2) para el detalle y las referencias de cada fórmula.

## Stack

- Vite + React + TypeScript
- react-three-fiber + drei + three.js para el render 3D
- zustand para el estado de los parámetros del sidebar
- vitest para tests (especialmente el módulo de física, que debe testearse aislado del render)

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (`tsc -b && vite build`) a `dist/`
- `npm run test` — corre la suite de vitest
- `npm run lint` — eslint

## Estructura

```
src/
  components/       componentes de UI (Sidebar, GalaxyCanvas, ...)
  physics/          modelo cinemático puro, sin dependencias de React/three (desde PR 2)
  store/            estado global (zustand) de los parámetros de simulación
```

El módulo `physics/` debe mantenerse como funciones puras testeables sin DOM ni three.js,
para poder testear la matemática (curvas de rotación, generación de espirales, perfiles de
densidad) de forma aislada del render.

## Deploy

Blueprint de Render.com como Static Site: ver `render.yaml` en la raíz. Build command
`npm ci && npm run build`, publish path `./dist`.

## Flujo de trabajo

Se trabaja por PR, una rama por feature (`pr-N-descripcion`). Cada PR debe incluir una
captura de pantalla del estado visual resultante en el body del PR.
