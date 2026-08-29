# Galaxy Simulator

Simulador interactivo de estructura y cinemática galáctica: un canvas 3D con una galaxia
procedural (espiral, espiral barrada o elíptica) y un sidebar de parámetros de
visualización — forma, % de polvo, % de estrellas y % de materia oscura.

## Desarrollo

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción a `dist/`
- `npm run test` — suite de vitest
- `npm run lint` — eslint

## Deploy

Este repo se despliega en [Render](https://render.com) como Static Site vía blueprint
(`render.yaml`).

Ver [`CLAUDE.md`](./CLAUDE.md) para el detalle de arquitectura y el modelo físico usado.

## Licencia

Open source bajo licencia [MIT](./LICENSE).
