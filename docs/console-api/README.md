# Console API

## What is Console API

Console API is the user-level HTTP API for automating Syncless from external tools. It runs as the API key user, uses that user's active workspace context, and currently exposes personal tasks, project templates, project and task reads, task prompts, task messages, and workspace user listing.

## Server URL

Use this base URL for all Console API requests:

```
https://api.syncless.ai
```

## Get an API key

Open [API Keys](https://cloud.syncless.ai/settings/api-keys) to create a user API key. Copy it immediately after creation; the full key is shown only once.

## Authentication

Authenticate every HTTP request with the Authorization: Bearer <api_key> header. The Console API does not support x-api-key.

```
Authorization: Bearer <api_key>
```