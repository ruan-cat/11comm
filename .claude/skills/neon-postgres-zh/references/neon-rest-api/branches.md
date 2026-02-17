## 概述

本文档概述了使用 Neon API 管理 Neon 项目中分支的规则。

## 管理分支

### 创建分支

1.  操作：在指定项目中创建一个新分支。默认情况下，分支是从项目的默认分支创建的，但您可以指定父分支、时间点（LSN 或时间戳），并附加计算端点。
2.  端点：`POST /projects/{project_id}/branches`
3.  路径参数：
    - `project_id` (string, required): 将在其中创建分支的项目的唯一标识符。
4.  正文参数：请求正文是可选的。如果提供，它可以包含 `endpoints` 和/或 `branch` 对象。

    `endpoints` (array of objects, optional): 要创建并附加到新分支的计算端点列表。
    - `type` (string, required): 端点类型。允许值：`read_write`, `read_only`。
    - `autoscaling_limit_min_cu` (number, optional): 最小计算单元 (CU) 数。最小值为 `0.25`。
    - `autoscaling_limit_max_cu` (number, optional): 最大计算单元 (CU) 数。最小值为 `0.25`。
    - `provisioner` (string, optional): 计算配置程序。指定 `k8s-neonvm` 以启用自动缩放。允许值：`k8s-pod`, `k8s-neonvm`。
    - `suspend_timeout_seconds` (integer, optional): 计算暂停前的非活动持续时间（秒）。范围从 -1（从不暂停）到 604800（1 周）。值为 `0` 使用默认值 300 秒（5 分钟）。

    `branch` (object, optional): 指定新分支的属性。
    - `name` (string, optional): 分支名称（最多 256 个字符）。如果省略，将自动生成名称。
    - `parent_id` (string, optional): 父分支的 ID。如果省略，则使用项目的默认分支作为父分支。
    - `parent_lsn` (string, optional): 父分支的日志序列号 (LSN)，用于从特定时间点创建新分支。
    - `parent_timestamp` (string, optional): ISO 8601 时间戳（例如 `2025-08-26T12:00:00Z`），用于从特定时间点创建分支。
    - `protected` (boolean, optional): 如果为 `true`，则将分支创建为受保护分支。
    - `init_source` (string, optional): 分支初始化的来源。`parent-data`（默认）复制架构和数据。`schema-only` 创建一个新的根分支，仅包含指定父分支的架构。
    - `expires_at` (string, optional): RFC 3339 时间戳，用于自动删除分支的时间（例如 `2025-06-09T18:02:16Z`）。

示例：从特定父分支创建带有读写计算的分支

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoints": [
    {
      "type": "read_write"
    }
  ],
  "branch": {
    "parent_id": "br-super-wildflower-adniii9u",
    "name": "my-new-feature-branch"
  }
}'
```

示例响应

```json
{
	"branch": {
		"id": "br-damp-glitter-adqd4hk5",
		"project_id": "hidden-river-50598307",
		"parent_id": "br-super-wildflower-adniii9u",
		"parent_lsn": "0/1A7F730",
		"name": "my-new-feature-branch",
		"current_state": "init",
		"pending_state": "ready",
		"state_changed_at": "2025-09-10T16:45:52Z",
		"creation_source": "console",
		"primary": false,
		"default": false,
		"protected": false,
		"cpu_used_sec": 0,
		"compute_time_seconds": 0,
		"active_time_seconds": 0,
		"written_data_bytes": 0,
		"data_transfer_bytes": 0,
		"create_time": "2025-09-10T16:45:52Z",
		"update_time": "2025-09-10T16:45:52Z",
		"created_by": {
			"name": "<USER_NAME>",
			"image": "<USER_IMAGE_URL>"
		},
		"init_source": "parent-data"
	},
	"endpoints": [
		{
			"host": "ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech",
			"id": "ep-raspy-glade-ad8e3gvy",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-damp-glitter-adqd4hk5",
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 2,
			"region_id": "aws-us-east-1",
			"type": "read_write",
			"current_state": "init",
			"pending_state": "active",
			"settings": {},
			"pooler_enabled": false,
			"pooler_mode": "transaction",
			"disabled": false,
			"passwordless_access": true,
			"creation_source": "console",
			"create_time": "2025-09-10T16:45:52Z",
			"update_time": "2025-09-10T16:45:52Z",
			"proxy_host": "c-2.us-east-1.aws.neon.tech",
			"suspend_timeout_seconds": 0,
			"provisioner": "k8s-neonvm"
		}
	],
	"operations": [
		{
			"id": "cf5d0923-fc13-4125-83d5-8fc31c6b0214",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-damp-glitter-adqd4hk5",
			"action": "create_branch",
			"status": "running",
			"failures_count": 0,
			"create_time": "2025-09-10T16:45:52Z",
			"update_time": "2025-09-10T16:45:52Z",
			"total_duration_ms": 0
		},
		{
			"id": "e3c60b62-00c8-4ad4-9cd1-cdc3e8fd8154",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-damp-glitter-adqd4hk5",
			"endpoint_id": "ep-raspy-glade-ad8e3gvy",
			"action": "start_compute",
			"status": "scheduling",
			"failures_count": 0,
			"create_time": "2025-09-10T16:45:52Z",
			"update_time": "2025-09-10T16:45:52Z",
			"total_duration_ms": 0
		}
	],
	"roles": [
		{
			"branch_id": "br-damp-glitter-adqd4hk5",
			"name": "neondb_owner",
			"protected": false,
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:14:58Z"
		}
	],
	"databases": [
		{
			"id": 9554148,
			"branch_id": "br-damp-glitter-adqd4hk5",
			"name": "neondb",
			"owner_name": "neondb_owner",
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:14:58Z"
		}
	],
	"connection_uris": [
		{
			"connection_uri": "postgresql://neondb_owner:npg_EwcS9IOgFfb7@ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
			"connection_parameters": {
				"database": "neondb",
				"password": "npg_EwcS9IOgFfb7",
				"role": "neondb_owner",
				"host": "ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech",
				"pooler_host": "ep-raspy-glade-ad8e3gvy-pooler.c-2.us-east-1.aws.neon.tech"
			}
		}
	]
}
```

### 列出分支

1.  操作：检索指定项目的分支列表。支持过滤、排序和分页。
2.  端点：`GET /projects/{project_id}/branches`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
4.  查询参数：
    - `search` (string, optional): 按名称或 ID 的部分匹配过滤分支。
    - `sort_by` (string, optional): 排序字段。允许值：`name`, `create_time`, `update_time`。默认为 `update_time`。
    - `sort_order` (string, optional): 排序顺序。允许值：`asc`, `desc`。默认为 `desc`。
    - `limit` (integer, optional): 返回的分支数量（1 到 10000）。
    - `cursor` (string, optional): 用于分页的上一个响应的游标。

示例：列出所有按创建日期排序的分支

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches?sort_by=create_time&sort_order=asc' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应

```json
{
	"branches": [
		{
			"id": "br-long-feather-adpbgzlx",
			"project_id": "hidden-river-50598307",
			"name": "production",
			"current_state": "ready",
			"state_changed_at": "2025-09-10T12:15:01Z",
			"logical_size": 30785536,
			"creation_source": "console",
			"primary": true,
			"default": true,
			"protected": false,
			"cpu_used_sec": 82,
			"compute_time_seconds": 82,
			"active_time_seconds": 316,
			"written_data_bytes": 29060360,
			"data_transfer_bytes": 0,
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:35:33Z",
			"created_by": {
				"name": "<USER_NAME>",
				"image": "<USER_IMAGE_URL>"
			},
			"init_source": "parent-data"
		},
		{
			"id": "br-super-wildflower-adniii9u",
			"project_id": "hidden-river-50598307",
			"parent_id": "br-long-feather-adpbgzlx",
			"parent_lsn": "0/1A33BC8",
			"parent_timestamp": "2025-09-10T12:15:03Z",
			"name": "development",
			"current_state": "ready",
			"state_changed_at": "2025-09-10T12:15:04Z",
			"logical_size": 30842880,
			"creation_source": "console",
			"primary": false,
			"default": false,
			"protected": false,
			"cpu_used_sec": 78,
			"compute_time_seconds": 78,
			"active_time_seconds": 312,
			"written_data_bytes": 310120,
			"data_transfer_bytes": 0,
			"create_time": "2025-09-10T12:15:04Z",
			"update_time": "2025-09-10T12:35:33Z",
			"created_by": {
				"name": "<USER_NAME>",
				"image": "<USER_IMAGE_URL>"
			},
			"init_source": "parent-data"
		}
	],
	"annotations": {
		"br-long-feather-adpbgzlx": {
			"object": {
				"type": "console/branch",
				"id": "br-long-feather-adpbgzlx"
			},
			"value": {
				"environment": "production"
			},
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:14:58Z"
		}
	},
	"pagination": {
		"sort_by": "create_time",
		"sort_order": "ASC"
	}
}
```

### 检索分支详情

1.  操作：检索有关特定分支的详细信息，包括其父级、创建时间戳和状态。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应：

```json
{
	"branch": {
		"id": "br-super-wildflower-adniii9u",
		"project_id": "hidden-river-50598307",
		"parent_id": "br-long-feather-adpbgzlx",
		"parent_lsn": "0/1A33BC8",
		"parent_timestamp": "2025-09-10T12:15:03Z",
		"name": "development",
		"current_state": "ready",
		"state_changed_at": "2025-09-10T12:15:04Z",
		"logical_size": 30842880,
		"creation_source": "console",
		"primary": false,
		"default": false,
		"protected": false,
		"cpu_used_sec": 78,
		"compute_time_seconds": 78,
		"active_time_seconds": 312,
		"written_data_bytes": 310120,
		"data_transfer_bytes": 0,
		"create_time": "2025-09-10T12:15:04Z",
		"update_time": "2025-09-10T12:35:33Z",
		"created_by": {
			"name": "<USER_NAME>",
			"image": "<USER_IMAGE_URL>"
		},
		"init_source": "parent-data"
	},
	"annotation": {
		"object": {
			"type": "console/branch",
			"id": "br-super-wildflower-adniii9u"
		},
		"value": {
			"environment": "development"
		},
		"create_time": "2025-09-10T12:15:04Z",
		"update_time": "2025-09-10T12:15:04Z"
	}
}
```

### 更新分支

1.  操作：更新指定分支的属性，例如其名称、保护状态或过期时间。
2.  端点：`PATCH /projects/{project_id}/branches/{branch_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 要更新的分支的唯一标识符。
4.  正文参数：
    `branch` (object, required): 要更新的分支属性的容器。
    - `name` (string, optional): 分支的新名称（最多 256 个字符）。
    - `protected` (boolean, optional): 设置为 `true` 以保护分支，或 `false` 以取消保护。
    - `expires_at` (string or null, optional): 设置新的 RFC 3339 过期时间戳，或 `null` 以移除过期。

示例：更改分支名称：

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-damp-glitter-adqd4hk5' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "branch": {
    "name": "updated-branch-name"
  }
}'
```

示例响应：

```json
{
	"branch": {
		"id": "br-damp-glitter-adqd4hk5",
		"project_id": "hidden-river-50598307",
		"parent_id": "br-super-wildflower-adniii9u",
		"parent_lsn": "0/1A7F730",
		"parent_timestamp": "2025-09-10T12:15:05Z",
		"name": "updated-branch-name",
		"current_state": "ready",
		"state_changed_at": "2025-09-10T16:45:52Z",
		"logical_size": 30842880,
		"creation_source": "console",
		"primary": false,
		"default": false,
		"protected": false,
		"cpu_used_sec": 68,
		"compute_time_seconds": 68,
		"active_time_seconds": 268,
		"written_data_bytes": 0,
		"data_transfer_bytes": 0,
		"create_time": "2025-09-10T16:45:52Z",
		"update_time": "2025-09-10T16:55:30Z",
		"created_by": {
			"name": "<USER_NAME>",
			"image": "<USER_IMAGE_URL>"
		},
		"init_source": "parent-data"
	},
	"operations": []
}
```

### 删除分支

1.  操作：从项目中删除指定的分支。此操作还将使所有关联的计算端点进入空闲状态，断开任何活动的客户端连接。
2.  端点：`DELETE /projects/{project_id}/branches/{branch_id}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 要删除的分支的唯一标识符。
4.  约束：
    - 您不能删除项目的根分支或默认分支。
    - 您不能删除具有子分支的分支。必须先删除所有子分支。

示例请求：

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 列出分支端点

1.  操作：检索与特定分支关联的所有计算端点的列表。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}/endpoints`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 要列出端点的分支的唯一标识符。
4.  一个分支可以有一个 `read_write` 端点和多个 `read_only` 端点。此方法返回当前附加到指定分支的所有端点的数组。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/endpoints' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

## 管理数据库

### 创建数据库

1.  操作：在指定分支内创建一个新数据库。一个分支可以包含多个数据库。
2.  端点：`POST /projects/{project_id}/branches/{branch_id}/databases`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 将在其中创建数据库的分支的唯一标识符。
4.  正文参数：
    `database` (object, required): 新数据库属性的容器。
    - `name` (string, required): 新数据库的名称。
    - `owner_name` (string, required): 将拥有该数据库的现有角色的名称。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "my_new_app_db",
    "owner_name": "app_owner_role"
  }
}'
```

### 列出数据库

1.  操作：检索指定分支内的所有数据库列表。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}/databases`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### 检索数据库详情

1.  操作：检索分支内特定数据库的详细信息。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。
    - `database_name` (string, required): 数据库的名称。

### 更新数据库

1.  操作：更新指定数据库的属性，例如其名称或所有者。
2.  端点：`PATCH /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。
    - `database_name` (string, required): 要更新的数据库的当前名称。
4.  正文参数：
    `database` (object, required): 要更新的数据库属性的容器。
    - `name` (string, optional): 数据库的新名称。
    - `owner_name` (string, optional): 将成为新所有者的不同现有角色的名称。

### 删除数据库

1.  操作：从分支中删除指定的数据库。此操作是永久性的，无法撤消。
2.  端点：`DELETE /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。
    - `database_name` (string, required): 要删除的数据库的名称。

## 管理角色

### 创建角色

1.  操作：在指定分支中创建一个新的 Postgres 角色。此操作可能会断开与活动计算端点的现有连接。
2.  端点：`POST /projects/{project_id}/branches/{branch_id}/roles`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 将在其中创建角色的分支的唯一标识符。
4.  正文参数：
    `role` (object, required): 新角色属性的容器。
    - `name` (string, required): 新角色的名称。长度不能超过 63 个字节。
    - `no_login` (boolean, optional): 如果为 `true`，则创建一个无法用于登录的角色。默认为 `false`。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "new_app_user"
  }
}'
```

### 列出角色

1.  操作：从指定分支检索所有 Postgres 角色的列表。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}/roles`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。

### 检索角色详情

1.  操作：检索分支内特定 Postgres 角色的详细信息。
2.  端点：`GET /projects/{project_id}/branches/{branch_id}/roles/{role_name}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。
    - `role_name` (string, required): 角色的名称。

### 删除角色

1.  操作：从分支中删除指定的 Postgres 角色。此操作是永久性的。
2.  端点：`DELETE /projects/{project_id}/branches/{branch_id}/roles/{role_name}`
3.  路径参数：
    - `project_id` (string, required): 项目的唯一标识符。
    - `branch_id` (string, required): 分支的唯一标识符。
    - `role_name` (string, required): 要删除的角色的名称。
