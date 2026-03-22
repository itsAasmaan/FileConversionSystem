# User Journeys

## Purpose

Capture the primary user flows the product must support in v1 and clarify the expected UX and backend behavior.

## Persona 1: Authenticated Converter User

### Journey 1: Upload and convert a file

1. User signs in.
2. User opens the dashboard and selects `New Conversion`.
3. User drags in a `csv`, `json`, `xml`, or `yaml` file.
4. Client validates file type and size before upload.
5. Client requests a signed upload URL from the API.
6. File uploads directly to object storage.
7. Client confirms upload completion with the API.
8. User selects target format and available conversion options.
9. User submits the conversion job.
10. UI shows job status as `queued`, then `processing`.
11. Worker completes the conversion and stores the output artifact.
12. UI updates job status to `completed`.
13. User previews output if file size permits.
14. User downloads the converted file.

Expected product behavior:

- no page refresh required for status updates
- clear validation errors before job submission
- visible failure state with retry option

### Journey 2: Retry a failed job

1. User opens job history.
2. User filters to failed jobs.
3. User opens a failed job detail page.
4. UI displays failure reason and source metadata.
5. User clicks `Retry`.
6. API creates a new attempt or requeues according to domain rules.
7. UI tracks new processing state until completion or failure.

Expected product behavior:

- original failure reason remains visible
- retry action is idempotent from the user perspective

### Journey 3: Review previous conversions

1. User opens job history.
2. User filters by status, source format, target format, or date.
3. User selects a job.
4. User views metadata, warnings, and download action.

Expected product behavior:

- history is paginated and searchable
- completed artifacts respect retention policy

## Persona 2: Platform Admin

### Journey 4: Investigate failing jobs

1. Admin signs in.
2. Admin opens the operational dashboard.
3. Admin sees a spike in failed `xml -> csv` jobs.
4. Admin opens the failed jobs view.
5. Admin inspects structured error data, queue attempts, and timing.
6. Admin identifies whether issue is input-related, parser-related, or infrastructure-related.

Expected product behavior:

- errors are grouped and searchable
- queue metrics and failure trends are visible

### Journey 5: Monitor platform health

1. Admin opens metrics dashboard.
2. Admin views queue depth, worker concurrency, API error rate, and p95 job times.
3. Admin checks alerts for sustained failures or stuck jobs.

Expected product behavior:

- operational state is visible without shell access
- failed jobs link directly to relevant records

## UX Requirements Derived from Journeys

- drag-and-drop upload
- progress tracking with discrete status stages
- clear error messaging
- preview for supported text outputs
- reliable job history
- admin monitoring views

## Edge Cases

- file upload completes but job creation fails
- job completes but preview generation fails
- user retries a job after source artifact expires
- target format selected is unsupported for given input
- file exceeds size limit
- uploaded file passes extension check but fails parser validation
