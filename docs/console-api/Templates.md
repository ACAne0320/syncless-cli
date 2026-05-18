# Templates

If you don't know what a project template is, [learn more about project template](https://cloud.syncless.ai/work/project-templates?show_onboarding=1).

## List templates

Lists templates in the active workspace.

```
GET /api/console/v1/templates?index=0&pageSize=50
Authorization: Bearer <api_key>
```

### Response

```json
{
  "templates": [
    {
      "id": "<template_id>",
      "workspaceId": "<workspace_id>",
      "createdByUserId": "<user_id>",
      "name": "Launch checklist",
      "graph": {}
    }
  ]
}
```

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/templates?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/templates?index=0&pageSize=50",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.templates);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/templates",
    headers={"Authorization": "Bearer <api_key>"},
    params={"index": 0, "pageSize": 50},
)
data = res.json()
print(data["templates"])
```

## Create project from template

Creates a project from a template. Each template node must be assigned to an owner by user id.

```
POST /api/console/v1/templates/<template_id>/projects
Authorization: Bearer <api_key>
Content-Type: application/json
```

### Request body

| Field | Type | Required |
| --- | --- | --- |
| name | string | yes |
| nodes | object | yes |

```json
{
  "name": "Launch checklist",
  "nodes": {
    "<node_id>": "<owner_id>"
  }
}
```

### Response

```json
{
  "ok": true,
  "pipelineId": "<pipeline_id>",
  "tasks": [],
  "taskDependencies": []
}
```

### cURL

```bash
curl -X POST "https://api.syncless.ai/api/console/v1/templates/<template_id>/projects" \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Launch checklist",
    "nodes": {
      "<node_id>": "<owner_id>"
    }
  }'
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/templates/<template_id>/projects",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <api_key>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Launch checklist",
      nodes: { "<node_id>": "<owner_id>" },
    }),
  }
);
const data = await res.json();
console.log(data);
```

### Python

```py
import requests

res = requests.post(
    "https://api.syncless.ai/api/console/v1/templates/<template_id>/projects",
    headers={
        "Authorization": "Bearer <api_key>",
        "Content-Type": "application/json",
    },
    json={
        "name": "Launch checklist",
        "nodes": {"<node_id>": "<owner_id>"},
    },
)
data = res.json()
print(data)
```
