# Galaxy Simulator

Interactive simulator of galactic structure and kinematics: a 3D canvas with a procedural
galaxy (spiral, barred spiral, or elliptical) and a sidebar of visualization parameters —
shape, % dust, % stars, and % dark matter.

## Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run test` — vitest suite
- `npm run lint` — eslint

## Deploy

This repo is deployed on [Render](https://render.com) as a Static Site via blueprint
(`render.yaml`).

See [`CLAUDE.md`](./CLAUDE.md) for architecture details and the physical model used.

## License

Open source under the [MIT](./LICENSE) license.
