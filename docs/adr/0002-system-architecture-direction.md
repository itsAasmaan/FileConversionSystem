# ADR 0002: System Architecture Direction

## Status

Accepted

## Context

The current codebase is a single TypeScript package with no application boundaries. A production-grade file conversion platform needs clear separation between UI, API, worker processing, shared domain logic, and infrastructure concerns.

## Decision

The project will be re-architected as a monorepo with:

- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/conversion-core`
- `packages/shared-types`
- `packages/ui`

The platform architecture will use:

- web frontend for user experience
- API service for authenticated orchestration
- Redis-backed queue for background processing
- PostgreSQL for durable metadata
- S3-compatible object storage for source and result files

The existing adapter/facade logic will be preserved conceptually, but moved into a dedicated conversion package and decoupled from storage, encryption, and transport concerns.

## Consequences

Positive:

- supports production operational needs
- isolates conversion logic for testing
- enables independent scaling of API and workers

Negative:

- significantly more initial setup than the current repository
- requires migration of current code into new package boundaries

## Rejected Alternatives

### Keep the repository as a single package

Rejected because it would mix UI, API, worker, and conversion concerns into one boundary and make scaling and testing harder.

### Use synchronous conversion directly in API requests

Rejected because it reduces reliability for larger files and creates poor request lifecycle behavior.

## Follow-Up

- create monorepo scaffolding in Phase 1
- define package boundaries in detail
- choose exact backend framework during implementation
