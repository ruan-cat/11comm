## 概述

本节提供了管理与项目中分支关联的计算端点的规则。计算端点是 Neon 计算实例，允许您连接到数据库并与之交互。

## 管理计算端点

### 创建计算端点

1.  操作：创建一个新的计算端点（Neon 计算实例）并将其与指定分支关联。
2.  端点：`POST /projects/{project_id}/endpoints`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
4.  正文参数：
    `endpoint` (object, required): 新端点属性的容器。
    - `branch_id` (string, required): 要关联端点的分支 ID。
    - `type` (string, required): 端点类型。一个分支只能有一个 `read_write` 端点，但可以有多个 `read_only` 端点。允许值：`read_write`, `read_only`。
    - `region_id` (string, optional): 端点将被创建的区域。必须与项目的区域匹配。
    - `autoscaling_limit_min_cu` (number, optional): 最小计算单元 (CU)。最小 `0.25`。
    - `autoscaling_limit_max_cu` (number, optional): 最大计算单元 (CU)。最小 `0.25`。
    - `provisioner` (string, optional): 计算配置程序。指定 `k8s-neonvm` 以启用自动缩放。允许值：`k8s-pod`, `k8s-neonvm`。
    - `suspend_timeout_seconds` (integer, optional): 暂停计算前的非活动持续时间（秒）。范围从 -1（从不暂停）到 604800（1 周）。
    - `disabled` (boolean, optional): 如果为 `true`，则限制连接到端点。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-your-branch-id",
    "type": "read_only"
  }
}'
```

示例响应：

```json
{
	"endpoint": {
		"host": "ep-proud-mud-adwmnxz4.c-2.us-east-1.aws.neon.tech",
		"id": "ep-proud-mud-adwmnxz4",
		"project_id": "hidden-river-50598307",
		"branch_id": "br-super-wildflower-adniii9u",
		"autoscaling_limit_min_cu": 0.25,
		"autoscaling_limit_max_cu": 2,
		"region_id": "aws-us-east-1",
		"type": "read_only",
		"current_state": "init",
		"pending_state": "active",
		"settings": {},
		"pooler_enabled": false,
		"pooler_mode": "transaction",
		"disabled": false,
		"passwordless_access": true,
		"creation_source": "console",
		"create_time": "2025-09-11T06:25:12Z",
		"update_time": "2025-09-11T06:25:12Z",
		"proxy_host": "c-2.us-east-1.aws.neon.tech",
		"suspend_timeout_seconds": 0,
		"provisioner": "k8s-neonvm"
	},
	"operations": [
		{
			"id": "4d10642f-5212-4517-ad60-afd28c9096e2",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-super-wildflower-adniii9u",
			"endpoint_id": "ep-proud-mud-adwmnxz4",
			"action": "start_compute",
			"status": "running",
			"failures_count": 0,
			"create_time": "2025-09-11T06:25:12Z",
			"update_time": "2025-09-11T06:25:12Z",
			"total_duration_ms": 0
		}
	]
}
```

### 列出计算端点

1.  操作：检索指定项目的所有计算端点列表。
2.  端点：`GET /projects/{project_id}/endpoints`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 检索计算端点详情

1.  操作：检索有关特定计算端点的详细信息，包括其配置（例如自动缩放限制）、当前状态（`active` 或 `idle`）和关联的分支 ID。
2.  端点：`GET /projects/{project_id}/endpoints/{endpoint_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 计算端点的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-proud-mud-adwmnxz4' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 更新计算端点

1.  操作：更新指定计算端点的配置。
2.  端点：`PATCH /projects/{project_id}/endpoints/{endpoint_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 计算端点的唯一标识符。
4.  正文参数：
    `endpoint` (object, required): 要更新的端点属性的容器。
    - `autoscaling_limit_min_cu` (number, optional): 新的最小计算单元 (CU) 数。
    - `autoscaling_limit_max_cu` (number, optional): 新的最大计算单元 (CU) 数。
    - `suspend_timeout_seconds` (integer, optional): 新的暂停前非活动时间（秒）。
    - `disabled` (boolean, optional): 设置为 `true` 以禁用连接，或 `false` 以启用连接。
    - `provisioner` (string, optional): 更改计算配置程序。

示例：更新自动缩放限制

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-proud-mud-adwmnxz4' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "autoscaling_limit_min_cu": 0.5,
    "autoscaling_limit_max_cu": 1
  }
}'
```

### 删除计算端点

1.  操作：删除指定的计算端点。此操作将断开与该端点的任何现有网络连接。
2.  端点：`DELETE /projects/{project_id}/endpoints/{endpoint_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 要删除的计算端点的唯一标识符。

示例请求：

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-proud-mud-adwmnxz4' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 启动计算端点

1.  操作：手动启动当前处于 `idle` 状态的计算端点。一旦启动操作成功完成，端点即可准备好进行连接。
2.  端点：`POST /projects/{project_id}/endpoints/{endpoint_id}/start`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 计算端点的唯一标识符。

示例请求：

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-ancient-brook-ad5ea04d/start' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 暂停计算端点

1.  操作：手动暂停 `active` 计算端点，强制其进入 `idle` 状态。这将立即断开与该端点的任何活动连接。
2.  端点：`POST /projects/{project_id}/endpoints/{endpoint_id}/suspend`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 计算端点的唯一标识符。

示例请求：

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-ancient-brook-ad5ea04d/suspend' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 重启计算端点

1.  操作：重启指定的计算端点。这涉及立即暂停操作，然后进行启动操作。这对于应用配置更改或刷新计算实例非常有用。所有活动连接都将被断开。
2.  端点：`POST /projects/{project_id}/endpoints/{endpoint_id}/restart`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `endpoint_id` (string, required): 计算端点的唯一标识符。

示例请求：

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/endpoints/ep-ancient-brook-ad5ea04d/restart' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```
