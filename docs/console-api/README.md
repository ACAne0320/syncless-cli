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

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/console/v1/projects` | [List projects](Projects.md) |
| `GET` | `/api/console/v1/projects/<id>/tasks` | [List tasks](Tasks.md) |
| `POST` | `/api/console/v1/projects/<id>/tasks` | [Create a project task](Tasks.md#create-a-project-task) |
| `GET` | `/api/console/v1/tasks/<id>` | [Get a task](Tasks.md) |
| `GET` | `/api/console/v1/tasks/<id>/messages` | [List task messages](Tasks.md) |
| `POST` | `/api/console/v1/tasks/<id>/send` | [Send a prompt](Tasks.md) |
| `POST` | `/api/console/v1/personal-tasks` | [Create a personal task](Personal%20Tasks.md) |
| `GET` | `/api/console/v1/templates` | [List templates](Templates.md) |
| `POST` | `/api/console/v1/templates/<id>/projects` | [Create project from template](Templates.md) |
| `GET` | `/api/console/v1/users` | [List workspace users](Users.md) |

## Code examples

Each endpoint page includes code examples in **cURL**, **TypeScript** (`fetch`), and **Python** (`requests`).
