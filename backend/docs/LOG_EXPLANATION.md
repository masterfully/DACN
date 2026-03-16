# API Log Explanation

This document explains how to read the request logs in the backend.

## Example Log

Start line:

[2026-03-16T13:29:31.507Z] INFO 37a8abb6 --> GET /api/health | ip=::1 | ua="PostmanRuntime/7.51.1"

End line:

[2026-03-16T13:29:31.508Z] INFO 37a8abb6 <-- GET /api/health | status=200 | time=0.92ms | size=103

## Field Meaning

- Timestamp: The time when the log event happened, in UTC.
  - Example: 2026-03-16T13:29:31.507Z
- Level: Log severity.
  - INFO: Normal behavior
  - WARN: Suspicious or slow request
  - ERROR: Failure or server error
- Request ID: Short request identifier used to connect start/end/error logs from the same request.
  - Example: 37a8abb6
- Direction marker:
  - --> Request started (incoming)
  - <-- Request completed (outgoing)
- Method + Path: HTTP method and endpoint.
  - Example: GET /api/health
- ip: Client IP address.
  - ::1 means localhost (IPv6 loopback)
- ua: User-Agent (tool/client creating the request).
  - Example: PostmanRuntime/7.51.1
- status: HTTP response status code.
  - 200 means successful request
- time: Total server processing time for that request.
  - Example: 0.92ms
- size: Response body size in bytes.
  - Example: 103

## How To Debug Quickly

- Find one request ID and inspect all lines with the same ID.
- Read order:
  1. Start line (-->): who called what
  2. End line (<--): result, duration, response size
  3. Error line (if any): failure details
- Focus on these checks first:
  - status >= 400: request failed
  - high time value: performance issue
  - repeated requests from same ip/ua: possible retry loop or client issue

## Common Cases

- Healthy endpoint call:
  - status=200
  - low time
  - no ERROR line
- Validation error:
  - status=400
  - usually WARN level
- Unauthorized:
  - status=401 or 403
- Server crash:
  - status=500 with ERROR log in error handler

## Notes

- For local development, pretty logs are easier to scan.
- For log aggregation tools, set LOG_FORMAT=json.
