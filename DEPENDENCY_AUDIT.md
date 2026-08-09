# Dependency audit

Audited against imports, configuration, build tooling, and runtime use on 10 August 2026.

## Removed

- `@types/three` and `three`: no direct import or configuration owner; the shader component uses `@paper-design/shaders-react`, which owns its renderer dependency.
- `@next/bundle-analyzer`: no analyzer wrapper in `next.config.js`; the `build:analyze` script did not enable an analyzer.
- `puppeteer-core`: no script or runtime import; release checks use HTTP and browser tooling outside the application dependency graph.
- `@typescript-eslint/eslint-plugin`: no direct configuration owner; `eslint-config-next` supplies the TypeScript rules used by the flat config.

## Retained

- Framework: `next`, `react`, `react-dom`, `@next/third-parties`.
- UI and interaction: `@base-ui/react`, `@calcom/embed-react`, `@paper-design/shaders-react`, `@tabler/icons-react`, `motion`, `react-intersection-observer`.
- Styling: `tailwindcss`, `autoprefixer`, `postcss`, `@tailwindcss/typography`, `tailwindcss-animate`, `tailwind-merge`, `clsx`, `class-variance-authority`.
- Content: `gray-matter`, `marked`.
- Observability: `@vercel/analytics`, `@vercel/speed-insights`.
- Tooling and types: `typescript`, `eslint`, `eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`.

Tailwind remains on 3.4 because the current design system and plugin configuration are Tailwind 3-specific; a Tailwind 4 migration is separate product work, not part of the Next.js/React compatibility upgrade.
