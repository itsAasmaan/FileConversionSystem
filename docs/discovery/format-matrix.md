# Supported Format Matrix

## Purpose

Define the v1 conversion capability boundaries and identify likely fidelity risks before implementation.

## v1 Formats

- `csv`
- `json`
- `xml`
- `yaml`

## Capability Matrix

| Source | Target | v1 Support | Risk Level | Notes |
| --- | --- | --- | --- | --- |
| csv | json | Yes | Low | Current prototype already supports this path. |
| json | csv | Yes | Medium | Nested JSON must be normalized or rejected. |
| xml | json | Yes | Medium | Attributes, arrays, and mixed content can be ambiguous. |
| json | xml | Yes | Medium | JSON root shape must map to valid XML structure. |
| yaml | json | Yes | Low | Good fit for structured text conversion. |
| json | yaml | Yes | Low | Straightforward for most object/array shapes. |
| csv | yaml | Yes | Medium | Usually routed through normalized row objects. |
| yaml | csv | Yes | Medium | Non-tabular YAML must be rejected or flattened. |
| csv | xml | Yes | High | Requires a stable XML schema convention for rows. |
| xml | csv | Yes | High | Only tabular XML should be supported in v1. |
| xml | yaml | Deferred | High | Better added after core pipeline stabilizes. |
| yaml | xml | Deferred | High | Better added after XML fidelity rules are defined. |

## Validation Rules

### General

- reject empty files
- reject unsupported MIME types and extensions
- enforce max file size
- calculate checksum at upload completion

### CSV

- require consistent headers
- reject malformed delimiters or broken rows
- define header normalization policy

### JSON

- require valid JSON syntax
- define whether root arrays and root objects are both allowed
- reject unsupported circular references by definition

### XML

- require well-formed XML
- define root element convention
- define how attributes and repeated nodes are treated

### YAML

- require valid YAML
- define whether anchors, aliases, and custom tags are allowed in v1

## Fidelity Warnings

The system should attach warnings to completed jobs when conversion may change structure or semantics.

Examples:

- nested JSON flattened to CSV columns
- XML attributes merged into node objects
- YAML anchors resolved and not preserved
- repeated XML nodes collapsed differently than expected

## v1 Rejection Policy

The product should reject inputs that cannot be converted predictably under the v1 rules instead of producing misleading output.

Reject examples:

- deeply nested JSON to CSV without an explicit flattening strategy
- XML with mixed content to CSV
- YAML with unsupported custom tags
- malformed CSV with inconsistent headers

## Future Expansion Candidates

- xlsx
- tsv
- toml
- ndjson
- zip-based batch conversion
