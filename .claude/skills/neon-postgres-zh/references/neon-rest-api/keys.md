## 概述

本文档概述了以编程方式管理 Neon API 密钥的规则。它涵盖了列出、创建和撤销密钥。

### 关于创建 API 密钥的重要说明

要使用 API 创建新的 API 密钥，您必须已经拥有有效的个人 API 密钥。第一个密钥必须从 Neon 控制台创建。如果您没有，可以要求用户为您创建一个。

### 列出 API 密钥

- 端点：`GET /api_keys`
- 授权：使用个人 API 密钥。

示例请求：

```bash
curl "https://console.neon.tech/api/v2/api_keys" \
  -H "Authorization: Bearer $PERSONAL_API_KEY"
```

示例响应：

```json
[
	{
		"id": 2291506,
		"name": "my-personal-key",
		"created_at": "2025-09-10T09:44:04Z",
		"created_by": {
			"id": "487de658-08ba-4363-b387-86d18b9ad1c8",
			"name": "<USER_NAME>",
			"image": "<USER_IMAGE_URL>"
		},
		"last_used_at": "2025-09-10T09:44:09Z",
		"last_used_from_addr": "49.43.218.132,34.211.200.85"
	}
]
```

### 创建 API 密钥

- 端点：`POST /api_keys`
- 授权：使用个人 API 密钥。
- 正文：必须包含 `key_name`。

示例请求：

```bash
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "my-new-key"}'
```

示例响应：

```json
{
	"id": 2291515,
	"key": "napi_9tlr13774gizljemrr133j5koy3bmsphj8iu38mh0yjl9q4r1b0jy2wuhhuxouzr",
	"name": "my-new-key",
	"created_at": "2025-09-10T09:47:59Z",
	"created_by": "487de658-08ba-4363-b387-86d18b9ad1c8"
}
```

### 撤销 API 密钥

- 端点：`DELETE /api_keys/{key_id}`
- 授权：使用个人 API 密钥。

示例请求：

```bash
curl -X DELETE \
  'https://console.neon.tech/api/v2/api_keys/2291515' \
  -H "Authorization: Bearer $PERSONAL_API_KEY"
```

示例响应：

```json
{
	"id": 2291515,
	"name": "mynewkey",
	"created_at": "2025-09-10T09:47:59Z",
	"created_by": "487de658-08ba-4363-b387-86d18b9ad1c8",
	"last_used_at": "2025-09-10T09:53:01Z",
	"last_used_from_addr": "2405:201:c01f:7013:d962:2b4f:2740:9750",
	"revoked": true
}
```
