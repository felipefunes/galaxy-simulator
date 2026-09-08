# Galaxy Simulator

Interactive simulator of galactic structure and kinematics: a view with a 3D canvas
(react-three-fiber / three.js) rendering a procedural galaxy (spiral, barred spiral, or
elliptical), plus a sidebar with visualization parameters (shape, % dust, % stars,
% dark matter, rotation speed).

This is not a real N-body simulation. The kinematics are modeled with parametric rotation
curves and density-wave theory (Lin-Shu) for the spiral arms — see the `src/physics`
module (starting from PR 2) for details and the references for each formula.

## Stack

- Vite + React + TypeScript
- react-three-fiber + drei + three.js for the 3D render
- zustand for the sidebar parameter state
- vitest for tests (especially the physics module, which must be testable in isolation
  from the render)

## Commands

- `npm run dev` — development server
- `npm run build` — production build (`tsc -b && vite build`) to `dist/`
- `npm run test` — runs the vitest suite
- `npm run lint` — eslint

## Structure

```
src/
  components/       UI components (Sidebar, GalaxyCanvas, ...)
  physics/          pure kinematic model, no React/three dependencies (since PR 2)
  store/            global state (zustand) for the simulation parameters
  i18n/             EN/ES translations (see below)
```

The `physics/` module must stay as pure, testable functions with no DOM or three.js
dependency, so the math (rotation curves, spiral generation, density profiles) can be
tested in isolation from the render.

## Language

The site detects the browser language (`navigator.languages`) once on load — Spanish if
the preferred language starts with "es", English otherwise (fallback). There is no manual
switcher. `src/i18n/detectLocale.ts` holds the pure (tested) logic, `src/i18n/translations.ts`
the dictionary, and `src/i18n/index.ts` exposes `t` (the active strings) and `locale`.
Components import `t` and use `t.textKey` instead of hardcoded text. The static meta tags
in `index.html` (SEO/Open Graph, which a crawler without JS can only see in one language)
stay in English, consistent with the app's fallback.

## Deploy

Render.com blueprint as a Static Site: see `render.yaml` at the repo root. Build command
`npm ci && npm run build`, publish path `./dist`.

## Workflow

Work happens by PR, one branch per feature (`pr-N-description`). Every PR must include a
screenshot of the resulting visual state in the PR body.
