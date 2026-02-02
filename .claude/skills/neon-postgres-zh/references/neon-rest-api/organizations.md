## 概述

本节提供了管理组织、组织成员、邀请和组织 API 密钥的规则。组织允许多个用户在 Neon 中协作处理项目并共享资源。

## 管理组织

### 检索组织详情

1.  操作：检索有关特定组织的详细信息。
2.  端点：`GET /organizations/{org_id}`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/organizations/{org_id}' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 列出组织成员

1.  操作：检索属于指定组织的所有成员列表。
2.  端点：`GET /organizations/{org_id}/members`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/organizations/{org_id}/members' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 检索组织成员详情

1.  操作：检索有关组织特定成员的信息。
2.  端点：`GET /organizations/{org_id}/members/{member_id}`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
    - `member_id` (UUID, required): 组织成员的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/organizations/{org_id}/members/{member_id}' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 更新组织成员的角色

1.  操作：更新组织内指定成员的角色。
2.  先决条件：此操作只能由组织 `admin` 执行。
3.  端点：`PATCH /organizations/{org_id}/members/{member_id}`
4.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
    - `member_id` (UUID, required): 组织成员的唯一标识符。
5.  正文参数：
    - `role` (string, required): 成员的新角色。允许值：`admin`, `member`。

示例：将成员的角色更改为 admin

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/organizations/{org_id}/members/{member_id}' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"role": "admin"}'
```

### 从组织中移除成员

1.  操作：从组织中移除指定成员。
2.  先决条件：
    - 此操作只能由组织 `admin` 执行。
    - 如果管理员是组织中仅剩的一位管理员，则无法将其移除。
3.  端点：`DELETE /organizations/{org_id}/members/{member_id}`
4.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
    - `member_id` (UUID, required): 要移除的组织成员的唯一标识符。

示例请求：

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/organizations/{org_id}/members/{member_id}' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 创建组织邀请

1.  操作：创建并发送一个或多个电子邮件邀请，邀请用户加入特定组织。
2.  端点：`POST /organizations/{org_id}/invitations`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
4.  正文参数：
    `invitations` (array of objects, required): 要创建的邀请列表。
    - `email` (string, required): 要邀请的用户的电子邮件地址。
    - `role` (string, required): 受邀用户将拥有的角色。允��值：`admin`, `member`。

示例：邀请两名具有不同角色的用户

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/organizations/{org_id}/invitations' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "invitations": [
    {
      "email": "developer@example.com",
      "role": "member"
    },
    {
      "email": "manager@example.com",
      "role": "admin"
    }
  ]
}'
```

### 列出组织邀请

1.  操作：检索有关指定组织未完成邀请的信息。
2.  端点：`GET /organizations/{org_id}/invitations`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/organizations/{org_id}/invitations' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 创建组织 API 密钥

1.  操作：为指定组织创建一个新的 API 密钥。密钥的范围可以是整个组织，也可以限制为其中的单个项目。
2.  端点：`POST /organizations/{org_id}/api_keys`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
4.  正文参数：
    - `key_name` (string, required): 用户指定的 API 密钥名称（最多 64 个字符）。
    - `project_id` (string, optional): 如果提供，API 密钥的访问权限将仅限于此项目。
5.  授权：使用组织 `admin` 的个人 API 密钥来创建组织 API 密钥。

示例：创建项目范围的 API 密钥

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $PERSONAL_API_KEY_OF_ADMIN" \
  -H 'Content-Type: application/json' \
  -d '{
  "key_name": "ci-pipeline-key-for-project-x",
  "project_id": "project-id-123"
}'
```

### 列出组织 API 密钥

1.  操作：检索为指定组织创建的所有 API 密钥列表。
2.  端点：`GET /organizations/{org_id}/api_keys`
3.  注意：响应包括有关密钥的元数据（如 `id` 和 `name`），但不包括密钥令牌本身。令牌仅在创建时可见。
4.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 撤销组织 API 密钥

1.  操作：永久撤销指定的组织 API 密钥。
2.  端点：`DELETE /organizations/{org_id}/api_keys/{key_id}`
3.  路径参数：
    - `org_id` (string, required): 组织的唯一标识符。
    - `key_id` (integer, required): 要撤销的 API 密钥的唯一标识符。您可以通过列出组织的 API 密钥来获取此 ID。

示例请求：

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys/{key_id}' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```
