# Vivaline

A mobile-first, PWA-ready web app that shows a patient's medication history
as a visual timeline instead of a list. See [ARCHITECTURE.md](ARCHITECTURE.md)
for the design and technical decisions behind it.

## Stack

- React + TypeScript, built with Vite
- Tailwind CSS with a custom design-token theme (`src/index.css`)
- IndexedDB for local persistence, behind a repository interface
- `vite-plugin-pwa` for offline support / installability

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint