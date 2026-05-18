# Tasks

## List tasks

Lists tasks owned by the API key user in a project. Use project_id personal to list Personal tasks.

```
GET /api/console/v1/projects/<project_id>/tasks?index=0&pageSize=50
Authorization: Bearer <api_key>
```

```
GET /api/console/v1/projects/personal/tasks?index=0&pageSize=50
Authorization: Bearer <api_key>
```

### Response

```json
{
  "tasks": [
    {
      "id": "<task_id>",
      "title": "Draft a launch checklist."
    }
  ]
}
```

## Get a task

Gets one task owned by the API key user in the active workspace.

```
GET /api/console/v1/tasks/<task_id>
Authorization: Bearer <api_key>
```

### Response

```json
{
  "task": {
    "id": "<task_id>",
    "title": "Draft a launch checklist."
  }
}
```

## List task messages

Lists historical messages for one task owned by the API key user. The limit is capped at 20.

```
GET /api/console/v1/tasks/<task_id>/messages?limit=20
Authorization: Bearer <api_key>
```

### Response

```json
{
  "ok": true,
  "taskId": "<task_id>",
  "messages": []
}
```

## Send a prompt to a task

Sends a text prompt to an existing task and returns immediately. If the task is already running, the API returns 400 with code TASK_RUNNING.

```
POST /api/console/v1/tasks/<task_id>/send
Authorization: Bearer <api_key>
Content-Type: application/json
```

### Request body

```json
[
  { "type": "text", "text": "Continue with the implementation plan." }
]
```

### Response

```json
{ "ok": true }
```

### Running task error

```json
{
  "error": "Task is currently running",
  "details": {
    "code": "TASK_RUNNING"
  }
}
```

## List project tasks

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"

curl "https://api.syncless.ai/api/console/v1/projects/personal/tasks?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"
```

## Get a task

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/tasks/<task_id>" \
  -H "Authorization: Bearer <api_key>"
```

## List task messages

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/tasks/<task_id>/messages?limit=20" \
  -H "Authorization: Bearer <api_key>"
```

## Send a prompt

### cURL

```bash
curl -X POST "https://api.syncless.ai/api/console/v1/tasks/<task_id>/send" \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '[
    { "type": "text", "text": "Continue with the implementation plan." }
  ]'
```