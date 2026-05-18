# Projects

## List projects

Lists standard projects that the API key user has joined in the active workspace. Personal is not returned here; use the personal task list endpoint for Personal tasks.

```
GET /api/console/v1/projects?index=0&pageSize=50
Authorization: Bearer <api_key>
```

### Response

```json
{
  "projects": [
    {
      "projectId": "<project_id>",
      "name": "Launch checklist",
      "createdAt": "2026-05-17T00:00:00.000Z",
      "updatedAt": "2026-05-17T00:00:00.000Z"
    }
  ]
}
```

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/projects?index=0&pageSize=50" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/projects?index=0&pageSize=50",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.projects);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/projects",
    headers={"Authorization": "Bearer <api_key>"},
    params={"index": 0, "pageSize": 50},
)
data = res.json()
print(data["projects"])
```
