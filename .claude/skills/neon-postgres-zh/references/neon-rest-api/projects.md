## 概述

本文档概述了以编程方式管理 Neon 项目的规则。它涵盖了创建、检索、更新和删除。

## 管理项目

### 列出项目

1.  操作：检索与 API 密钥关联的帐户可访问的所有项目列表。这是获取其他 API 调用所需的 `project_id` 值的主要方法。
2.  端点：`GET /projects`
3.  查询参数：
    - `limit` (optional, integer, default: 10): 指定要返回的项目数，从 1 到 400。
    - `cursor` (optional, string): 用于分页。提供来自先前响应的 `cursor` 值以获取下一组项目。
    - `search` (optional, string): 通过项目 `name` 或 `id` 的部分匹配过滤项目。
    - `org_id` (optional, string): 按特定组织 ID 过滤项目。
4.  当遍历所有项目时，结合使用 `limit` 和 `cursor` 参数以正确处理分页。

示例请求：

```bash
# 检索前 10 个项目
curl 'https://console.neon.tech/api/v2/projects?limit=10' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应：

```json
{
	"projects": [
		{
			"id": "old-fire-32990194",
			"platform_id": "aws",
			"region_id": "aws-ap-southeast-1",
			"name": "old-fire-32990194",
			"provisioner": "k8s-neonvm",
			"default_endpoint_settings": {
				"autoscaling_limit_min_cu": 0.25,
				"autoscaling_limit_max_cu": 2,
				"suspend_timeout_seconds": 0
			},
			"settings": {
				"allowed_ips": {
					"ips": [],
					"protected_branches_only": false
				},
				"enable_logical_replication": false,
				"maintenance_window": {
					"weekdays": [5],
					"start_time": "19:00",
					"end_time": "20:00"
				},
				"block_public_connections": false,
				"block_vpc_connections": false,
				"hipaa": false
			},
			"pg_version": 17,
			"proxy_host": "ap-southeast-1.aws.neon.tech",
			"branch_logical_size_limit": 512,
			"branch_logical_size_limit_bytes": 536870912,
			"store_passwords": true,
			"active_time": 0,
			"cpu_used_sec": 0,
			"creation_source": "console",
			"created_at": "2025-09-10T06:58:33Z",
			"updated_at": "2025-09-10T06:58:39Z",
			"synthetic_storage_size": 0,
			"quota_reset_at": "2025-10-01T00:00:00Z",
			"owner_id": "org-royal-sun-91776391",
			"compute_last_active_at": "2025-09-10T06:58:38Z",
			"org_id": "org-royal-sun-91776391",
			"history_retention_seconds": 86400
		}
	],
	"pagination": {
		"cursor": "old-fire-32990194"
	},
	"applications": {},
	"integrations": {}
}
```

### 创建项目

1.  操作：创建一个新的 Neon 项目。您可以在创建时指定各种设置，包括区域、Postgres 版本、默认分支和计算配置以及安全设置。
2.  端点：`POST /projects`
3.  正文参数：请求正文必须包含具有以下嵌套属性的顶级 `project` 对象：

    `project` (object, required): 所有项目设置的主容器。
    - `name` (string, optional): 项���的描述性名称（1-256 个字符）。如果省略，项目名称将与其生成的 ID 相同。
    - `pg_version` (integer, optional): 主要 Postgres 版本。默认为 `17`。支持的版本：14, 15, 16, 17, 18。
    - `region_id` (string, optional): 将在其中创建项目的区域的标识符（例如 `aws-us-east-1`）。
    - `org_id` (string, optional): 项目将属于的组织的 ID。如果使用组织 API 密钥，则为必需。
    - `store_passwords` (boolean, optional): 是否在 Neon 中存储角色密码。SQL 编辑器和集成等功能需要存储密码。
    - `history_retention_seconds` (integer, optional): 保留项目历史记录以用于时间点恢复等功能的持续时间（秒）（0 到 2,592,000）。默认为 86400（1 天）。
    - `provisioner` (string, optional): 计算配置程序。指定 `k8s-neonvm` 以启用自动缩放。允许值：`k8s-pod`, `k8s-neonvm`。
    - `default_endpoint_settings` (object, optional): 在此项目中创建的新计算端点的默认设置。
      - `autoscaling_limit_min_cu` (number, optional): 最小计算单元 (CU) 数。最小值为 `0.25`。
      - `autoscaling_limit_max_cu` (number, optional): 最大计算单元 (CU) 数。最小值为 `0.25`。
      - `suspend_timeout_seconds` (integer, optional): 计算暂停前的非活动持续时间（秒）。范围从 -1（从不暂停）到 604800（1 周）。值为 `0` 使用默认值 300 秒（5 分钟）。
    - `settings` (object, optional): 项目范围设置。
      - `quota` (object, optional): 每个项目的消耗配额。零或空值表示“无限制”。
        - `active_time_seconds` (integer, optional): 活动计算的时钟时间配额。
        - `compute_time_seconds` (integer, optional): CPU 秒数配额。
        - `written_data_bytes` (integer, optional): 数据写入配额。
        - `data_transfer_bytes` (integer, optional): 数据传输配额。
        - `logical_size_bytes` (integer, optional): 每个分支的逻辑数据大小限制。
      - `allowed_ips` (object, optional): 配置 IP 允许列表。
        - `ips` (array of strings, optional): 允许的 IP 地址或 CIDR 范围列表。
        - `protected_branches_only` (boolean, optional): 如果为 `true`，则 IP 允许列表仅适用于受保护的分支。
      - `enable_logical_replication` (boolean, optional): 设置 `wal_level=logical`。
      - `maintenance_window` (object, optional): 计划维护的时间段。
        - `weekdays` (array of integers, required if `maintenance_window` is set): 一周中的日子（1=星期一，7=星期日）。
        - `start_time` (string, required if `maintenance_window` is set): "HH:MM" UTC 格式的开始时间。
        - `end_time` (string, required if `maintenance_window` is set): "HH:MM" UTC 格式的结束时间。
    - `branch` (object, optional): 项目默认分支的配置。
      - `name` (string, optional): 默认分支的名称。默认为 `main`。
      - `role_name` (string, optional): 默认角色的名称。默认为 `{database_name}_owner`。
      - `database_name` (string, optional): 默认数据库的名称。默认为 `neondb`。

示例请求

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "my-new-api-project",
    "pg_version": 17
  }
}'
```

示例响应

```json
{
	"project": {
		"data_storage_bytes_hour": 0,
		"data_transfer_bytes": 0,
		"written_data_bytes": 0,
		"compute_time_seconds": 0,
		"active_time_seconds": 0,
		"cpu_used_sec": 0,
		"id": "sparkling-hill-99143322",
		"platform_id": "aws",
		"region_id": "aws-us-west-2",
		"name": "my-new-api-project",
		"provisioner": "k8s-neonvm",
		"default_endpoint_settings": {
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 0.25,
			"suspend_timeout_seconds": 0
		},
		"settings": {
			"allowed_ips": {
				"ips": [],
				"protected_branches_only": false
			},
			"enable_logical_replication": false,
			"maintenance_window": {
				"weekdays": [5],
				"start_time": "07:00",
				"end_time": "08:00"
			},
			"block_public_connections": false,
			"block_vpc_connections": false,
			"hipaa": false
		},
		"pg_version": 17,
		"proxy_host": "c-2.us-west-2.aws.neon.tech",
		"branch_logical_size_limit": 512,
		"branch_logical_size_limit_bytes": 536870912,
		"store_passwords": true,
		"creation_source": "console",
		"history_retention_seconds": 86400,
		"created_at": "2025-09-10T07:58:16Z",
		"updated_at": "2025-09-10T07:58:16Z",
		"consumption_period_start": "0001-01-01T00:00:00Z",
		"consumption_period_end": "0001-01-01T00:00:00Z",
		"owner_id": "org-royal-sun-91776391",
		"org_id": "org-royal-sun-91776391"
	},
	"connection_uris": [
		{
			"connection_uri": "postgresql://neondb_owner:npg_N67FDMtGvJke@ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require",
			"connection_parameters": {
				"database": "neondb",
				"password": "npg_N67FDMtGvJke",
				"role": "neondb_owner",
				"host": "ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech",
				"pooler_host": "ep-round-unit-afbn7qv4-pooler.c-2.us-west-2.aws.neon.tech"
			}
		}
	],
	"roles": [
		{
			"branch_id": "br-green-mode-afe3fl9y",
			"name": "neondb_owner",
			"password": "npg_N67FDMtGvJke",
			"protected": false,
			"created_at": "2025-09-10T07:58:16Z",
			"updated_at": "2025-09-10T07:58:16Z"
		}
	],
	"databases": [
		{
			"id": 6677853,
			"branch_id": "br-green-mode-afe3fl9y",
			"name": "neondb",
			"owner_name": "neondb_owner",
			"created_at": "2025-09-10T07:58:16Z",
			"updated_at": "2025-09-10T07:58:16Z"
		}
	],
	"operations": [
		{
			"id": "08b9367d-6918-4cd5-b4a6-41c8fd984b7e",
			"project_id": "sparkling-hill-99143322",
			"branch_id": "br-green-mode-afe3fl9y",
			"action": "create_timeline",
			"status": "running",
			"failures_count": 0,
			"created_at": "2025-09-10T07:58:16Z",
			"updated_at": "2025-09-10T07:58:16Z",
			"total_duration_ms": 0
		},
		{
			"id": "c6917f04-5cd3-48a2-97c9-186b1d9729f0",
			"project_id": "sparkling-hill-99143322",
			"branch_id": "br-green-mode-afe3fl9y",
			"endpoint_id": "ep-round-unit-afbn7qv4",
			"action": "start_compute",
			"status": "scheduling",
			"failures_count": 0,
			"created_at": "2025-09-10T07:58:16Z",
			"updated_at": "2025-09-10T07:58:16Z",
			"total_duration_ms": 0
		}
	],
	"branch": {
		"id": "br-green-mode-afe3fl9y",
		"project_id": "sparkling-hill-99143322",
		"name": "main",
		"current_state": "init",
		"pending_state": "ready",
		"state_changed_at": "2025-09-10T07:58:16Z",
		"creation_source": "console",
		"primary": true,
		"default": true,
		"protected": false,
		"cpu_used_sec": 0,
		"compute_time_seconds": 0,
		"active_time_seconds": 0,
		"written_data_bytes": 0,
		"data_transfer_bytes": 0,
		"created_at": "2025-09-10T07:58:16Z",
		"updated_at": "2025-09-10T07:58:16Z",
		"init_source": "parent-data"
	},
	"endpoints": [
		{
			"host": "ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech",
			"id": "ep-round-unit-afbn7qv4",
			"project_id": "sparkling-hill-99143322",
			"branch_id": "br-green-mode-afe3fl9y",
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 0.25,
			"region_id": "aws-us-west-2",
			"type": "read_write",
			"current_state": "init",
			"pending_state": "active",
			"settings": {},
			"pooler_enabled": false,
			"pooler_mode": "transaction",
			"disabled": false,
			"passwordless_access": true,
			"creation_source": "console",
			"created_at": "2025-09-10T07:58:16Z",
			"updated_at": "2025-09-10T07:58:16Z",
			"proxy_host": "c-2.us-west-2.aws.neon.tech",
			"suspend_timeout_seconds": 0,
			"provisioner": "k8s-neonvm"
		}
	]
}
```

### 检索项目详情

1.  操作：检索单个特定项目的详细信息。
2.  端点：`GET /projects/{project_id}`
3.  先决条件：您必须拥有要检索的项目的 `project_id`。
4.  路径参数：
    - `project_id` (required, string): 项目的唯一标识符。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应

```json
{
	"project": {
		"data_storage_bytes_hour": 0,
		"data_transfer_bytes": 0,
		"written_data_bytes": 0,
		"compute_time_seconds": 0,
		"active_time_seconds": 0,
		"cpu_used_sec": 0,
		"id": "sparkling-hill-99143322",
		"platform_id": "aws",
		"region_id": "aws-us-west-2",
		"name": "my-new-api-project",
		"provisioner": "k8s-neonvm",
		"default_endpoint_settings": {
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 0.25,
			"suspend_timeout_seconds": 0
		},
		"settings": {
			"allowed_ips": {
				"ips": [],
				"protected_branches_only": false
			},
			"enable_logical_replication": false,
			"maintenance_window": {
				"weekdays": [5],
				"start_time": "07:00",
				"end_time": "08:00"
			},
			"block_public_connections": false,
			"block_vpc_connections": false,
			"hipaa": false
		},
		"pg_version": 17,
		"proxy_host": "c-2.us-west-2.aws.neon.tech",
		"branch_logical_size_limit": 512,
		"branch_logical_size_limit_bytes": 536870912,
		"store_passwords": true,
		"creation_source": "console",
		"history_retention_seconds": 86400,
		"created_at": "2025-09-10T07:58:16Z",
		"updated_at": "2025-09-10T07:58:25Z",
		"synthetic_storage_size": 0,
		"consumption_period_start": "2025-09-10T06:58:15Z",
		"consumption_period_end": "2025-10-01T00:00:00Z",
		"owner_id": "org-royal-sun-91776391",
		"owner": {
			"email": "<USER_EMAIL>",
			"name": "My Personal Account",
			"branches_limit": 10,
			"subscription_type": "free_v3"
		},
		"compute_last_active_at": "2025-09-10T07:58:21Z",
		"org_id": "org-royal-sun-91776391"
	}
}
```

### 更新项目

1.  操作：更新指定项目的设置。此端点用于修改创建后的各种项目属性，例如其名称、默认计算设置、安全策略和维护计划。
2.  端点：`PATCH /projects/{project_id}`
3.  路径参数：
    - `project_id` (string, required): 要更新的项目的唯一标识符。
4.  正文参数：请求正文必须包含具有要更新的属性的顶级 `project` 对象。

    `project` (object, required): 您要修改的设置的主容器。
    - `name` (string, optional): 项目的新的描述性名称。
    - `history_retention_seconds` (integer, optional): 保留项目历史记录的持续时间（秒）（0 到 2,592,000）。
    - `default_endpoint_settings` (object, optional): 在此项目中创建的计算端点的新默认设置。
      - `autoscaling_limit_min_cu` (number, optional): 最小计算单元 (CU) 数。最小 `0.25`。
      - `autoscaling_limit_max_cu` (number, optional): 最大计算单元 (CU) 数。最小 `0.25`。
      - `suspend_timeout_seconds` (integer, optional): 计算暂停前的非活动持续时间（秒）。范围从 -1（从不暂停）到 604800（1 周）。值为 `0` 使用默认值 300 秒（5 分钟）。
    - `settings` (object, optional): 要更新的项目范围设置。
      - `quota` (object, optional): 每个项目的消耗配额。
        - `active_time_seconds` (integer, optional): 活动计算的时钟时间配额。
        - `compute_time_seconds` (integer, optional): CPU 秒数配额。
        - `written_data_bytes` (integer, optional): 数据写入配额。
        - `data_transfer_bytes` (integer, optional): 数据传输配额。
        - `logical_size_bytes` (integer, optional): 每个分支的逻辑数据大小限制。
      - `allowed_ips` (object, optional): 修改 IP 允许列表。
        - `ips` (array of strings, optional): 允许的 IP 地址或 CIDR 范围的新列表。
        - `protected_branches_only` (boolean, optional): 如果为 `true`，则 IP 允许列表仅适用于受保护的分支。
      - `enable_logical_replication` (boolean, optional): 设置 `wal_level=logical`。这是不可逆的。
      - `maintenance_window` (object, optional): 计划维护的时间段。
        - `weekdays` (array of integers, required if `maintenance_window` is set): 一周中的日子（1=星期一，7=星期日）。
        - `start_time` (string, required if `maintenance_window` is set): "HH:MM" UTC 格式的开始时间。
        - `end_time` (string, required if `maintenance_window` is set): "HH:MM" UTC 格式的结束时间。
      - `block_public_connections` (boolean, optional): 如果为 `true`，则禁止来自公共互联网的连接。
      - `block_vpc_connections` (boolean, optional): 如果为 `true`，则禁止来自 VPC 端点的连接。
      - `audit_log_level` (string, optional): 设置审核日志级别。允许值：`base`, `extended`, `full`。
      - `hipaa` (boolean, optional): 切换 HIPAA 合规性设置。
      - `preload_libraries` (object, optional): 预加载到计算实例中的库。
        - `use_defaults` (boolean, optional): 切换使用默认库。
        - `enabled_libraries` (array of strings, optional): 要启用的特定库的列表。

示例请求

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "updated-project-name"
  }
}'
```

示例响应

```json
{
	"project": {
		"data_storage_bytes_hour": 0,
		"data_transfer_bytes": 0,
		"written_data_bytes": 29060360,
		"compute_time_seconds": 79,
		"active_time_seconds": 308,
		"cpu_used_sec": 79,
		"id": "sparkling-hill-99143322",
		"platform_id": "aws",
		"region_id": "aws-us-west-2",
		"name": "updated-project-name",
		"provisioner": "k8s-neonvm",
		"default_endpoint_settings": {
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 0.25,
			"suspend_timeout_seconds": 0
		},
		"settings": {
			"allowed_ips": {
				"ips": [],
				"protected_branches_only": false
			},
			"enable_logical_replication": false,
			"maintenance_window": {
				"weekdays": [5],
				"start_time": "07:00",
				"end_time": "08:00"
			},
			"block_public_connections": false,
			"block_vpc_connections": false,
			"hipaa": false
		},
		"pg_version": 17,
		"proxy_host": "c-2.us-west-2.aws.neon.tech",
		"branch_logical_size_limit": 512,
		"branch_logical_size_limit_bytes": 536870912,
		"store_passwords": true,
		"creation_source": "console",
		"history_retention_seconds": 86400,
		"created_at": "2025-09-10T07:58:16Z",
		"updated_at": "2025-09-10T08:08:23Z",
		"synthetic_storage_size": 0,
		"consumption_period_start": "0001-01-01T00:00:00Z",
		"consumption_period_end": "0001-01-01T00:00:00Z",
		"owner_id": "org-royal-sun-91776391",
		"compute_last_active_at": "2025-09-10T07:58:21Z"
	},
	"operations": []
}
```

### 删除项目

1.  操作：永久删除项目及其所有相关资源，包括所有分支、计算、数据库和角色。
2.  端点：`DELETE /projects/{project_id}`
3.  先决条件：您必须拥有要删除的项目的 `project_id`。
4.  警告：这是一个不可逆的破坏性操作。它会删除项目中的所有数据、数据库和资源。请极其谨慎地进行操作，并在执行此操作之前与用户确认。
5.  路径参数：
    - `project_id` (required, string): 要删除的项目的唯一标识符。

示例请求：

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应：

```json
{
	"project": {
		"data_storage_bytes_hour": 0,
		"data_transfer_bytes": 0,
		"written_data_bytes": 29060360,
		"compute_time_seconds": 79,
		"active_time_seconds": 308,
		"cpu_used_sec": 79,
		"id": "sparkling-hill-99143322",
		"platform_id": "aws",
		"region_id": "aws-us-west-2",
		"name": "updated-project-name",
		"provisioner": "k8s-neonvm",
		"default_endpoint_settings": {
			"autoscaling_limit_min_cu": 0.25,
			"autoscaling_limit_max_cu": 0.25,
			"suspend_timeout_seconds": 0
		},
		"settings": {
			"allowed_ips": {
				"ips": [],
				"protected_branches_only": false
			},
			"enable_logical_replication": false,
			"maintenance_window": {
				"weekdays": [5],
				"start_time": "07:00",
				"end_time": "08:00"
			},
			"block_public_connections": false,
			"block_vpc_connections": false,
			"hipaa": false
		},
		"pg_version": 17,
		"proxy_host": "c-2.us-west-2.aws.neon.tech",
		"branch_logical_size_limit": 512,
		"branch_logical_size_limit_bytes": 536870912,
		"store_passwords": true,
		"creation_source": "console",
		"history_retention_seconds": 86400,
		"created_at": "2025-09-10T07:58:16Z",
		"updated_at": "2025-09-10T08:08:23Z",
		"synthetic_storage_size": 0,
		"consumption_period_start": "0001-01-01T00:00:00Z",
		"consumption_period_end": "0001-01-01T00:00:00Z",
		"owner_id": "org-royal-sun-91776391",
		"compute_last_active_at": "2025-09-10T07:58:21Z",
		"org_id": "org-royal-sun-91776391"
	}
}
```

### 检索连接 URI

1.  操作：检索项目中特定数据库的即用型连接 URI。
2.  端点：`GET /projects/{project_id}/connection_uri`
3.  先决条件：您必须知道 `project_id`、`database_name` 和 `role_name`。
4.  查询参数：
    - `project_id` (path, required): 项目的唯一标识符。
    - `database_name` (query, required): 目标数据库的名称。
    - `role_name` (query, required): 用于连接的角色。
    - `branch_id` (query, optional): 分支 ID。如果未指定，默认为项目的主分支。
    - `pooled` (query, optional, boolean): 如果设置为 `false`，则返回直接连接 URI，而不是池化 URI。默认为 `true`。
    - `endpoint_id` (query, optional): 要连接的特定端点 ID。如果未指定，默认为与 `branch_id` 关联的 `read-write` endpoint_id。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/old-fire-32990194/connection_uri?database_name=neondb&role_name=neondb_owner' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应：

```json
{
	"uri": "postgresql://neondb_owner:npg_IDNnorOST71P@ep-shiny-morning-a1bfdvjs-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
}
```
