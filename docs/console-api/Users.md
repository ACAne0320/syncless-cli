# Users

## List workspace users

Lists active users in the API key user's workspace. Use this endpoint to find owner ids for template node assignment.

```
GET /api/console/v1/users
Authorization: Bearer <api_key>
```

### Response

```json
{
  "users": [
    {
      "userId": "<owner_id>",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "avatarUrl": "<https://api.syncless.ai/api/users/><owner_id>/avatar",
      "role": "member"
    }
  ]
}
```

### cURL

```bash
curl "https://api.syncless.ai/api/console/v1/users" \
  -H "Authorization: Bearer <api_key>"
```

### TypeScript

```ts
const res = await fetch(
  "https://api.syncless.ai/api/console/v1/users",
  {
    headers: { Authorization: "Bearer <api_key>" },
  }
);
const data = await res.json();
console.log(data.users);
```

### Python

```py
import requests

res = requests.get(
    "https://api.syncless.ai/api/console/v1/users",
    headers={"Authorization": "Bearer <api_key>"},
)
data = res.json()
print(data["users"])
```
