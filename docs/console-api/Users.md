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