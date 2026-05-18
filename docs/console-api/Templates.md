# Templates

If you don't know what a project template is, [learn more about project template](https://cloud.syncless.ai/work/project-templates?show_onboarding=1).

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
curl -X POST "https://api.syncless.ai/api/console/v1/templates/<template_id>/projects" \\
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Launch checklist",
    "nodes": {
      "<node_id>": "<owner_id>"
    }
  }'
```