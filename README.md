# File Conversion System

This repository is being re-architected from a TypeScript conversion prototype into a production-grade file conversion platform.

## Current Direction

- Phase 0 discovery artifacts live in [`docs/`](./docs)
- The implementation roadmap lives in [`plan.md`](./plan.md)
- Phase 1 introduces a workspace monorepo structure

## Workspace Layout

```text
apps/
  api/
  web/
  worker/
packages/
  config/
  conversion-core/
  shared-types/
  ui/
docs/
```

## Available Scripts

- `npm run build`
- `npm run build:core`
- `npm run start:core`

## Notes

The current runnable prototype now lives in `packages/conversion-core`.
