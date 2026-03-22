# Conversion Core

`@file-conversion-system/conversion-core` is the reusable conversion engine package for the File Conversion System monorepo.

## Current Scope

- structured text format conversion
- `csv`, `json`, `xml`, and `yaml`
- adapter-based conversion through a shared facade
- local and stubbed file source abstractions

## Public API

The package exports:

- `FileConverterFacade`
- adapter classes
- decorator classes
- file source interfaces and implementations
- `SUPPORTED_FORMATS`
- `SupportedFormat`
- typed conversion errors

## Development

- `npm run build -w @file-conversion-system/conversion-core`
- `npm run test -w @file-conversion-system/conversion-core`

## Notes

This package is still an early internal package. The current API is suitable for monorepo use while we continue hardening conversion rules and fidelity handling.
