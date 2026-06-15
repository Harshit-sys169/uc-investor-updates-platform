
# Operations

## Runtime signals

- `x-request-id` is attached by middleware
- API routes expose basic rate-limit headers
- `/api/health` reports environment readiness
- `/api/ready` exposes production readiness status
- `/api/observability` returns service metrics, traces, alerts, and incident state

## Log format

Structured logs are emitted as JSON with:
- level
- timestamp
- message
- optional request fields

## Observability surfaces

- Dashboard: summary cards and an observability entry point
- Observability page: metrics, traces, incidents, and alerts
- API: health, readiness, and observability JSON endpoints

## Deployment notes

This milestone keeps the observability stack scaffold-first. The metric and trace structures are ready for Datadog, OpenTelemetry, or another provider once the live integrations are added.
