# ADR 0001: V1 Scope and Product Shape

## Status

Accepted

## Context

The current repository is a TypeScript conversion prototype. Before implementation begins, the project needs a clear product shape. Without an explicit scope, there is a high risk of overbuilding broad conversion features without a stable v1.

## Decision

The project will target a narrow, production-grade v1 with:

- authenticated users
- structured text format conversion only
- asynchronous queue-backed job processing
- secure upload and download
- history and job detail views
- admin operations visibility

The initial supported formats are:

- `csv`
- `json`
- `xml`
- `yaml`

The initial supported user roles are:

- `user`
- `admin`

Anonymous conversion, billing, API keys, multi-tenant workspaces, and advanced enterprise controls are deferred until after v1 launch stability.

## Consequences

Positive:

- allows faster delivery of a credible product
- keeps architecture focused on real reliability needs
- reduces complexity in auth, permissions, and billing

Negative:

- some user requests will be deferred
- public utility use cases are intentionally excluded at launch

## Follow-Up

- default to `Auth.js` for v1 auth integration
- default source/result retention to `7 days`
- default max upload size to `10 MB`
- keep admin tooling internal-only in v1
