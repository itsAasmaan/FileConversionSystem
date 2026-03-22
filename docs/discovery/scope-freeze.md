# Phase 0.5 Scope Freeze

## Purpose

Freeze the remaining default product decisions so Phase 1 repository work can proceed without reopening basic product assumptions.

## Frozen Defaults

### Authentication

- Default approach: `Auth.js`
- Reason: keeps auth under project control with lower vendor lock-in than a hosted auth dependency while still fitting a Next.js-based frontend.

### File Retention

- Source file retention: `7 days`
- Result file retention: `7 days`
- Reason: short enough to control storage growth and risk, long enough for normal user retrieval patterns in v1.

### File Size Limit

- Maximum upload size for v1: `10 MB`
- Reason: fits the current structured text conversion scope without forcing large-file handling complexity too early.

### Admin Scope

- Admin tooling is internal-only for v1
- Reason: reduces authorization surface area and lets us build operational tooling for platform health first.

## Implementation Consequences

- database schema should support retention timestamps from the start
- upload validation should enforce the 10 MB limit consistently
- frontend UX should clearly surface retention policy
- auth integration should be designed to support future provider swaps

## Deferred Decisions

- social login providers
- future anonymous conversion mode
- paid plan quotas
- organization/multi-tenant permissions
