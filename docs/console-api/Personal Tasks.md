# Personal Tasks

## Create and start a personal task

Creates a personal task in the user's Personal pipeline and starts it immediately.

```
POST /api/console/v1/personal-tasks
Authorization: Bearer <api_key>
Content-Type: application/json
```

### Request body

```json
[
  { "type": "text", "text": "Draft a launch checklist." }
]
```

### Response

```json
{
  "ok": true,
  "task": {
    "id": "<task_id>",
    "title": "Draft a launch checklist."
  }
}
```

### cURL

```bash
curl -X POST "https://api.syncless.ai/api/console/v1/personal-tasks" \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '[
    { "type": "text", "text": "Draft a launch checklist." }
  ]'
```