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

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/personal-tasks",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <api_key>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { type: "text", text: "Draft a launch checklist." },
    ]),
  }
);
const data = await res.json();
console.log(data.task);
```

### Python

```py
import requests

res = requests.post(
    "https://api.syncless.ai/api/console/v1/personal-tasks",
    headers={
        "Authorization": "Bearer <api_key>",
        "Content-Type": "application/json",
    },
    json=[{"type": "text", "text": "Draft a launch checklist."}],
)
data = res.json()
print(data["task"])
```
