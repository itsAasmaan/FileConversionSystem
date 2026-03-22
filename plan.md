# File Conversion System Revamp Plan

## 1. Executive Summary

This repository is currently a TypeScript proof of concept that demonstrates adapter, facade, and decorator patterns for converting files between `csv`, `json`, `xml`, and `yaml`. It builds successfully, but it is not yet a product. It has no web application, no API, no persistence, no authentication, no job orchestration, no real cloud storage integration, no tests, and no production deployment path.

The right way to revamp this project is not to keep extending the current single-package demo. The right move is to turn it into a production-oriented platform with:

- A modern web app for uploads, conversions, job tracking, previews, and downloads.
- A backend API for authenticated job creation and file lifecycle management.
- An asynchronous worker pipeline for reliable conversion at scale.
- Real object storage, database persistence, observability, rate limiting, and security controls.
- A reusable conversion engine package that preserves the core ideas in the existing adapters/decorators while hardening them for real usage.

This plan assumes the end goal is a production-grade SaaS-style file conversion platform, not just a CLI library.

## 2. Current State Assessment

### What exists

- A small Node.js + TypeScript package with a compileable codebase.
- Format adapters:
  - `CSVAdapter`
  - `JSONAdapter`
  - `XMLAdapter`
  - `YAMLAdapter`
- A `FileConverterFacade` that routes conversions through JSON as an intermediate format.
- Decorators for validation, compression, and encryption.
- `LocalFileSource` and a fake in-memory `S3FileSource`.
- A demo-style `src/index.ts` entrypoint that reads local files and logs output.

### What is working

- TypeScript compilation passes with `npm run build`.
- The repository demonstrates basic conversion flow and pattern usage.
- The code is small enough to refactor safely if done in phases.

### What is missing

- No frontend or user experience.
- No HTTP API or server runtime.
- No database.
- No background job queue.
- No real S3 or cloud integration.
- No user accounts, auth, or access control.
- No file validation policy beyond basic parsing.
- No streaming support for large files.
- No tests.
- No CI/CD.
- No containerization.
- No metrics, tracing, or logging strategy.
- No multi-environment config strategy.
- No product definition for uploads, downloads, job history, retries, quotas, or billing.

## 3. Key Issues in the Existing Implementation

These should directly inform the redesign:

- `src/index.ts` is a demo script, not an application boundary.
- `FileConverterFacade` keeps adapters in-process and synchronous from a system design standpoint. That is fine for a library, but insufficient for production orchestration.
- All conversions route through JSON, which is convenient but lossy for some formats and too simplistic for broader file conversion use cases.
- `S3FileSource` is not a real S3 integration; it is an in-memory stub.
- Encryption uses direct symmetric crypto in a decorator, but there is no key management, rotation, secret storage, or transport policy.
- Compression and encryption are modeled as conversion decorators, but in production they should usually exist as pipeline stages or storage policies, not mixed with core format transformation logic.
- Error handling is basic and not structured for API clients.
- There is no schema validation for requests or output guarantees.
- There is no separation between domain logic, infrastructure, transport, and UI.

## 4. Product Vision

Build a platform where users can:

- Upload a file or connect cloud storage.
- Choose input/output formats and conversion options.
- Preview source and converted output when safe and practical.
- Track job progress in real time.
- Retry failed jobs.
- Download results securely.
- View conversion history and audit events.

For an admin/operator:

- View system health, queue depth, failure rate, storage consumption, and job latency.
- Manage supported formats and conversion rules.
- Enforce quotas, file size limits, and retention policies.

## 5. Recommended End-State Architecture

### Monorepo structure

Refactor into a workspace-based monorepo:

- `apps/web`
  - Next.js frontend
- `apps/api`
  - Node.js API service
- `apps/worker`
  - Background conversion worker
- `packages/conversion-core`
  - Pure conversion engine and adapters
- `packages/shared-types`
  - Shared DTOs, schemas, enums, errors
- `packages/ui`
  - Shared design system components
- `packages/config`
  - ESLint, TypeScript, Prettier, test config

### Core services

- Web App
  - Upload UI, dashboard, auth flows, job detail pages, admin views
- API Service
  - Handles auth, file registration, job creation, metadata, status reads, downloads
- Worker Service
  - Pulls queued jobs, performs conversion, stores results, updates status
- Object Storage
  - Source files, generated outputs, preview artifacts, logs if needed
- Database
  - Users, jobs, files, audit logs, quotas, retention settings
- Queue
  - Reliable asynchronous processing
- Cache
  - Sessions, rate limiting, temporary job state
- Observability Stack
  - Logs, metrics, traces, alerts

### Recommended technology stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui or a custom design system
- API: NestJS or Fastify with TypeScript
- Worker: Node.js worker process using BullMQ
- Database: PostgreSQL with Prisma
- Queue/Cache: Redis
- Storage: AWS S3 or S3-compatible storage
- Auth: Clerk, Auth.js, or custom JWT + refresh token flow
- Validation: Zod
- Testing: Vitest, Playwright, Supertest
- Infra: Docker, Docker Compose for local dev, Terraform for cloud provisioning
- CI/CD: GitHub Actions

Fastify is the leanest option if you want control. NestJS is the better option if you want explicit structure and long-term maintainability for a multi-service backend. For this project, NestJS is a reasonable default if the goal is "production-grade architecture" with clear module boundaries.

## 6. Domain Model

### Main entities

- User
  - `id`, `email`, `name`, `role`, `createdAt`
- Workspace
  - optional if multi-tenant is required later
- FileAsset
  - `id`, `ownerId`, `storageKey`, `filename`, `mimeType`, `size`, `checksum`, `uploadedAt`
- ConversionJob
  - `id`, `userId`, `sourceFileId`, `outputFileId`, `sourceFormat`, `targetFormat`, `status`, `progress`, `errorCode`, `errorMessage`, `createdAt`, `startedAt`, `completedAt`
- ConversionOption
  - `jobId`, `normalizeHeaders`, `flattenXml`, `yamlArrayMode`, `preserveFormatting`, etc.
- AuditEvent
  - `id`, `actorId`, `entityType`, `entityId`, `action`, `metadata`, `createdAt`
- QuotaPolicy
  - `maxFileSize`, `dailyJobLimit`, `concurrentJobLimit`, retention settings

### Status model

- `queued`
- `uploading`
- `validating`
- `processing`
- `post_processing`
- `completed`
- `failed`
- `cancelled`
- `expired`

## 7. Conversion Engine Strategy

### Guiding principle

Keep the existing adapter/facade ideas, but move them into a hardened library package. The library should be pure, testable, and isolated from transport concerns.

### Proposed `conversion-core` responsibilities

- Format detection
- Input validation
- Adapter registry
- Conversion pipeline orchestration
- Structured error taxonomy
- Streaming support where practical
- Conversion capability matrix
- Option handling per format pair

### Redesign notes

- Do not assume JSON is always the universal intermediate representation.
- Define a normalized internal document model where needed, but allow direct pairwise transforms if fidelity requires it.
- Keep decorators only if they map cleanly to reusable cross-cutting conversion concerns.
- Move encryption and compression out of converter decorators when they are storage or transport concerns.
- Introduce typed errors like:
  - `UnsupportedFormatError`
  - `MalformedInputError`
  - `ConversionFidelityWarning`
  - `OutputGenerationError`
  - `StorageReadError`

### Target conversion capabilities for v1

- CSV <-> JSON
- XML <-> JSON
- YAML <-> JSON
- CSV <-> YAML
- CSV <-> XML
- JSON <-> XML
- JSON <-> YAML

### v2 extension candidates

- XLSX
- TSV
- TOML
- PDF extraction to structured JSON
- image metadata extraction
- archive unpacking workflows

## 8. API Design

### Public user flows

- `POST /auth/login`
- `POST /files/upload-url`
- `POST /files/complete-upload`
- `POST /jobs`
- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs/:id/retry`
- `POST /jobs/:id/cancel`
- `GET /jobs/:id/download`
- `GET /jobs/:id/preview`
- `GET /formats`

### Admin flows

- `GET /admin/jobs`
- `GET /admin/metrics`
- `GET /admin/failed-jobs`
- `PATCH /admin/policies`

### API standards

- Versioned routes: `/api/v1/...`
- OpenAPI generation
- Zod or class-validator request validation
- Consistent error envelope
- Request id propagation
- Rate limiting
- Pagination for list endpoints

### Example error response shape

```json
{
  "error": {
    "code": "UNSUPPORTED_FORMAT",
    "message": "Conversion from pdf to yaml is not supported",
    "requestId": "req_123",
    "details": {}
  }
}
```

## 9. Frontend and UI Revamp Direction

### Product UX direction

The current project has no UI. The revamp should position the product as a clean, credible utility platform with a strong focus on trust, clarity, and visible progress.

### Recommended visual language

- Bright neutral base with deep slate text, electric blue or emerald action color, and restrained warm accents
- Strong spacing and large typography
- Clear drag-and-drop upload area
- Data-dense but readable job tables
- Real-time progress visuals with step-based statuses
- Split preview panes for source and converted output

### Core screens

- Landing page
  - Product pitch, supported formats, feature highlights, pricing placeholder, CTA
- Sign in / Sign up
- Dashboard
  - Recent jobs, usage stats, quick convert panel
- New Conversion page
  - Upload, source format, target format, options, validation hints
- Job Details page
  - Timeline, logs, file metadata, preview, download, retry
- History page
  - Search, filters, status pills
- Settings page
  - Profile, API tokens, retention preferences
- Admin panel
  - Queue health, job failures, system metrics

### UX behaviors

- Drag-and-drop upload with file type and size validation before submission
- Client-side preview for smaller files
- Polling or websockets for live job status
- Optimistic UI for job creation
- Clear failure states with actionable recovery steps
- Accessible keyboard navigation and screen-reader labels

### UI component inventory

- File uploader
- Format picker
- Conversion options drawer
- Progress stepper
- Preview panel
- Metadata cards
- Job status badge
- Toast system
- Error callout
- Empty state blocks
- Admin data tables

## 10. Security and Compliance Requirements

Minimum production-grade baseline:

- Signed upload URLs for object storage
- Authenticated downloads with short-lived signed URLs
- Input size limits and MIME/type validation
- Checksum verification
- Virus or malware scanning hook before processing untrusted files
- Secrets in environment or secret manager, never in source
- Encryption at rest in object storage
- TLS everywhere
- Audit logging for file access and downloads
- Rate limiting and abuse protection
- CSRF protection where session auth is used
- Secure headers and cookie policy
- Dependency scanning and SAST in CI

If handling business-sensitive files, add:

- KMS-backed encryption
- retention and deletion guarantees
- legal/privacy policy alignment
- data residency planning if needed

## 11. Scalability and Reliability Requirements

### Functional targets

- Handle concurrent uploads and conversions safely
- Avoid blocking request threads during conversion
- Support retryable jobs
- Make large-file processing possible without loading everything into memory

### Non-functional targets

- 99.9% API uptime target
- Observable queue latency and job completion times
- Idempotent job creation where possible
- Backpressure controls for spikes
- Dead-letter queue for failed jobs
- Graceful shutdown support for worker processes

### Reliability patterns

- Queue-based async processing
- Job retries with capped exponential backoff
- Status transitions enforced at the domain layer
- Object storage lifecycle policies
- Circuit breaking around downstream services where applicable

## 12. DevEx and Engineering Standards

### Tooling baseline

- ESLint
- Prettier
- Husky + lint-staged
- commitlint
- Changesets or semantic-release if package publishing matters

### Code quality standards

- Layered architecture
- No business logic in controllers or UI pages
- Shared schema definitions across API and frontend
- Structured logging
- Exhaustive error mapping
- Strict TypeScript everywhere

### Documentation

- Root architecture overview
- Local development setup
- API contract docs
- Runbooks for queue failure, storage issues, deploy rollback

## 13. Testing Strategy

### Unit tests

- Adapter conversions
- format validation
- error mapping
- status transition rules
- quota enforcement

### Integration tests

- API + database
- API + queue enqueue flow
- worker + storage + database
- auth-protected download flow

### End-to-end tests

- Upload file -> create job -> poll -> preview -> download
- invalid format submission
- oversized file rejection
- retry failed job

### Non-functional tests

- load tests for uploads and queue throughput
- security checks on upload endpoints
- accessibility checks for all primary user flows

## 14. CI/CD and Environment Strategy

### Environments

- `local`
- `development`
- `staging`
- `production`

### CI pipeline

- install dependencies
- lint
- typecheck
- unit tests
- integration tests
- build
- container build
- security scan

### CD pipeline

- deploy API
- deploy worker
- deploy web
- run migrations
- smoke tests
- rollback on failure

## 15. Recommended Delivery Phases

## Phase 0: Discovery and Product Framing

### Goals

- Define the exact product scope for v1
- Freeze the initial supported formats
- Decide if the product is single-user utility, authenticated SaaS, or admin-facing internal platform

### Deliverables

- Product requirements document
- supported-format matrix
- user journey map
- architecture decision records

### Exit criteria

- Scope approved
- success metrics agreed
- technical stack finalized

## Phase 1: Repository Re-architecture

### Goals

- Convert the current single-package repo into a monorepo
- Preserve the existing conversion logic in a reusable package

### Deliverables

- workspace setup
- `apps/web`, `apps/api`, `apps/worker`
- `packages/conversion-core`, `packages/shared-types`, `packages/ui`
- linting, formatting, shared tsconfig

### Exit criteria

- All apps build
- core package imports cleanly across services

## Phase 2: Conversion Core Hardening

### Goals

- Stabilize the current conversion logic as a real library

### Deliverables

- adapter registry abstraction
- structured errors
- fidelity notes per conversion pair
- test suite for all supported conversions
- better parsing/serialization boundaries

### Exit criteria

- conversion-core reaches strong unit test coverage
- deterministic outputs for fixture cases

## Phase 3: API Foundation

### Goals

- Stand up a production-quality API service

### Deliverables

- auth module
- file module
- job module
- health endpoint
- OpenAPI docs
- request validation
- database schema and migrations

### Exit criteria

- API can create and fetch jobs
- auth-protected routes work
- all endpoints validated and documented

## Phase 4: Storage and Queue Integration

### Goals

- Support real uploads and asynchronous processing

### Deliverables

- S3 integration
- signed upload/download URLs
- Redis + BullMQ queue
- job state persistence
- worker enqueue/dequeue flow

### Exit criteria

- Uploaded file can be converted asynchronously end to end
- retries and failures update job state correctly

## Phase 5: Worker Pipeline

### Goals

- Build a robust processing engine

### Deliverables

- worker service
- validation stage
- conversion stage
- post-processing stage
- artifact storage
- dead-letter handling

### Exit criteria

- worker recovers from transient failures
- job status updates are reliable and observable

## Phase 6: Frontend MVP

### Goals

- Deliver a usable product UI

### Deliverables

- landing page
- auth flows
- dashboard
- new conversion flow
- job details page
- history page

### Exit criteria

- user can upload, create job, monitor status, and download result from the web app

## Phase 7: Admin and Observability

### Goals

- Make the system operable in production

### Deliverables

- centralized logs
- metrics dashboards
- traces
- admin job monitor
- queue depth and failure dashboards
- alerting rules

### Exit criteria

- on-call debugging path exists for failed jobs
- dashboard coverage is sufficient for production monitoring

## Phase 8: Security Hardening

### Goals

- Close the obvious production security gaps

### Deliverables

- secret management
- rate limits
- abuse prevention
- malware scanning integration
- audit trail
- retention and deletion jobs

### Exit criteria

- security checklist passes
- threat model reviewed

## Phase 9: Quality and Launch Readiness

### Goals

- Validate product readiness and reduce launch risk

### Deliverables

- Playwright E2E suite
- load test report
- accessibility fixes
- production runbooks
- staged deployment validation

### Exit criteria

- staging environment passes smoke, regression, and performance thresholds

## Phase 10: Post-Launch Enhancements

### Goals

- Expand product capability after stable launch

### Deliverables

- additional formats
- team workspaces
- API keys for developer access
- usage billing
- webhook notifications
- batch conversion

## 16. UI Delivery Plan

### UI Phase A: Brand and Design System

- Define type scale, spacing, color system, shadows, forms, tables, badges
- Build core components in `packages/ui`
- Create responsive page shells and navigation patterns

### UI Phase B: Conversion Experience

- Build drag-and-drop upload surface
- Build source/target format selection
- Build option panels and inline validation
- Build job creation confirmation flow

### UI Phase C: Monitoring Experience

- Build job timeline
- Build live progress indicator
- Build history filters, sorting, and search
- Build failure diagnostics panels

### UI Phase D: Admin Experience

- Build operational dashboard
- Build failed-job inspection views
- Build quota and policy management screens

## 17. Suggested Project Structure After Revamp

```text
.
├── apps
│   ├── api
│   ├── web
│   └── worker
├── packages
│   ├── config
│   ├── conversion-core
│   ├── shared-types
│   └── ui
├── infrastructure
│   ├── docker
│   ├── terraform
│   └── scripts
├── docs
│   ├── architecture
│   ├── adr
│   ├── api
│   └── runbooks
└── tests
    ├── e2e
    ├── fixtures
    └── performance
```

## 18. Immediate Refactor Priorities in This Repository

These are the first practical steps from the current codebase:

1. Replace the current demo-only root package structure with workspace tooling.
2. Move existing adapters and facade code into `packages/conversion-core`.
3. Remove demo concerns from `src/index.ts` and convert that behavior into fixtures/tests.
4. Replace fake `S3FileSource` with an interface plus real storage adapters in service apps.
5. Separate conversion concerns from storage, encryption, and compression policies.
6. Add fixture-driven unit tests for all existing conversions before major refactors.
7. Introduce typed error classes and capability metadata for each adapter.
8. Write a real `README.md` with architecture, usage, and roadmap.

## 19. Risks and Mitigations

### Risk: conversion fidelity loss

Mitigation:

- Define a capability matrix and document lossy transformations explicitly.
- Store warnings with completed jobs when output may differ semantically.

### Risk: large-file memory pressure

Mitigation:

- Use streaming parsers/writers where possible.
- Enforce size limits for non-streaming formats in v1.

### Risk: queue backlog and worker saturation

Mitigation:

- concurrency controls, autoscaling, dead-letter queue, visibility dashboards

### Risk: security exposure from untrusted uploads

Mitigation:

- signed uploads, validation, malware scan hooks, strict file policies, isolated processing

### Risk: overbuilding too early

Mitigation:

- keep v1 narrow: a few formats, one clean UX, strong reliability fundamentals

## 20. Definition of Done for a Production-Ready v1

The project should be considered production-ready only when all of the following are true:

- Users can authenticate and manage their own files/jobs.
- Files are uploaded to object storage, not handled as raw API payloads.
- Conversions run asynchronously via a queue-backed worker.
- Job state is persisted and visible in the UI.
- Supported conversions have test coverage and fixture validation.
- Failures are observable with logs, metrics, and alerts.
- Security controls exist for upload, storage, auth, and download flows.
- CI/CD builds, tests, and deploys all services consistently.
- Documentation exists for setup, architecture, and operations.
- The frontend is responsive, accessible, and production-polished.

## 21. Recommended Next Build Order

If execution starts immediately, the best sequence is:

1. Monorepo setup and tooling baseline
2. Conversion-core extraction and tests
3. API service with PostgreSQL and auth
4. S3 + Redis + BullMQ integration
5. Worker pipeline
6. Frontend MVP
7. Observability and admin tooling
8. Security hardening
9. Launch validation

## 22. Final Recommendation

Treat the current repository as a strong conceptual seed, not as the foundation of a production deployment. The patterns are useful and should be preserved inside a dedicated conversion engine package, but almost every other concern needs to be built around that engine with proper application boundaries.

The revamp should optimize for:

- clear service separation
- testable conversion logic
- async job orchestration
- secure file handling
- excellent job visibility
- a polished, trustworthy UI

That approach turns this repo from a demo into an actual platform.
