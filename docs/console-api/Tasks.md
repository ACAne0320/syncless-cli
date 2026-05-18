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

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"

curl "https://api.syncless.ai/api/console/v1/projects/personal/tasks?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks?index=0&pageSize=50",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.tasks);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks",
    headers={"Authorization": "Bearer <api_key>"},
    params={"index": 0, "pageSize": 50},
)
data = res.json()
print(data["tasks"])
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

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/tasks/<task_id>" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/tasks/<task_id>",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.task);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/tasks/<task_id>",
    headers={"Authorization": "Bearer <api_key>"},
)
data = res.json()
print(data["task"])
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

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/tasks/<task_id>/messages?limit=20" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/tasks/<task_id>/messages?limit=20",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.messages);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/tasks/<task_id>/messages",
    headers={"Authorization": "Bearer <api_key>"},
    params={"limit": 20},
)
data = res.json()
print(data["messages"])
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

### cURL

```bash
curl -X POST "https://api.syncless.ai/api/console/v1/tasks/<task_id>/send" \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '[
    { "type": "text", "text": "Continue with the implementation plan." }
  ]'
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/tasks/<task_id>/send",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <api_key>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { type: "text", text: "Continue with the implementation plan." },
    ]),
  }
);
const data = await res.json();
console.log(data);
```

### Python

```py
import requests

res = requests.post(
    "https://api.syncless.ai/api/console/v1/tasks/<task_id>/send",
    headers={
        "Authorization": "Bearer <api_key>",
        "Content-Type": "application/json",
    },
    json=[{"type": "text", "text": "Continue with the implementation plan."}],
)
data = res.json()
print(data)
```

## Create a project task

Creates a task in a standard project and starts it with an initial prompt. Optionally set `upstream_task_id` to create a downstream task.

```
POST /api/console/v1/projects/<project_id>/tasks
Authorization: Bearer <api_key>
Content-Type: application/json
```

### Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| blocks | ContentBlock[] | yes | Content block array for the initial prompt |
| upstream_task_id | string | no | Set to create as a downstream task of an existing task |

```json
{
  "blocks": [
    { "type": "text", "text": "Draft a launch checklist." }
  ],
  "upstream_task_id": "<optional_upstream_task_id>"
}
```

### Response

```json
{
  "ok": true,
  "task": {
    "id": "<task_id>",
    "title": "Draft a launch checklist.",
    "upstreamTaskId": "<upstream_task_id>"
  }
}
```

### cURL

```bash
curl -X POST "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks" \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      { "type": "text", "text": "Draft a launch checklist." }
    ]
  }'
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <api_key>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blocks: [{ type: "text", text: "Draft a launch checklist." }],
      upstream_task_id: "<optional_upstream_task_id>",
    }),
  }
);
const data = await res.json();
console.log(data.task);
```

### Python

```py
import requests

res = requests.post(
    "https://api.syncless.ai/api/console/v1/projects/<project_id>/tasks",
    headers={
        "Authorization": "Bearer <api_key>",
        "Content-Type": "application/json",
    },
    json={
        "blocks": [{"type": "text", "text": "Draft a launch checklist."}],
        "upstream_task_id": "<optional_upstream_task_id>",
    },
)
data = res.json()
print(data["task"])
```
