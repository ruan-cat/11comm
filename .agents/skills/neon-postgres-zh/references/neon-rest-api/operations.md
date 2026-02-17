## 概述

本文档概述了管理和监控 Neon 中长时间运行的操作（包括分支创建和计算管理）的规则。

## 操作

操作是由 Neon 控制平面执行的动作（例如 `create_branch`、`start_compute`）。以编程方式使用 API 时，监控长时间运行的操作的状态至关重要，以确保在启动依赖于该操作的另一个操作之前，该操作已完成。超过 6 个月的操作可能会从 Neon 系统中删除。

### 列出操作

1.  操作：检索指定 Neon 项目的操作列表。操作数量可能很大，因此建议分页。
2.  端点：`GET /projects/{project_id}/operations`
3.  路径参数：
    - `project_id` (string, required): 要列出其操作的项目的唯一标识符。
4.  查询参数：
    - `limit` (integer, optional): 响应中返回的操作数。必须在 1 到 1000 之间。
    - `cursor` (string, optional): 来自先前响应的游标值，用于获取下一页操作。
5.  步骤：
    - 使用 `limit` 发出初始请求以获取第一页结果。
    - 响应将包含 `pagination.cursor` 值。
    - 要获取下一页，请发出后续请求，包括 `limit` 和来自先前响应的 `cursor`。

示例请求

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/operations' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应

```json
{
	"operations": [
		{
			"id": "639f7f73-0b76-4749-a767-2d3c627ca5a6",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-long-feather-adpbgzlx",
			"endpoint_id": "ep-round-morning-adtpn2oc",
			"action": "apply_config",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:15:23Z",
			"update_time": "2025-09-10T12:15:23Z",
			"total_duration_ms": 87
		},
		{
			"id": "b5a7882b-a5b3-4292-ad27-bffe733feae4",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-super-wildflower-adniii9u",
			"endpoint_id": "ep-ancient-brook-ad5ea04d",
			"action": "apply_config",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:15:23Z",
			"update_time": "2025-09-10T12:15:23Z",
			"total_duration_ms": 49
		},
		{
			"id": "36a1cba0-97f1-476d-af53-d9e0d3a3606d",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-super-wildflower-adniii9u",
			"endpoint_id": "ep-ancient-brook-ad5ea04d",
			"action": "start_compute",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:15:04Z",
			"update_time": "2025-09-10T12:15:05Z",
			"total_duration_ms": 913
		},
		{
			"id": "409c35ef-cbc3-4f1b-a4ca-f2de319f5360",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-super-wildflower-adniii9u",
			"action": "create_branch",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:15:04Z",
			"update_time": "2025-09-10T12:15:04Z",
			"total_duration_ms": 136
		},
		{
			"id": "274e240f-e2fb-4719-b796-c1ab7c4ae91c",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-long-feather-adpbgzlx",
			"endpoint_id": "ep-round-morning-adtpn2oc",
			"action": "start_compute",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:15:03Z",
			"total_duration_ms": 4843
		},
		{
			"id": "22ef6fbd-21c5-4cdb-9825-b0f9afddbb0d",
			"project_id": "hidden-river-50598307",
			"branch_id": "br-long-feather-adpbgzlx",
			"action": "create_timeline",
			"status": "finished",
			"failures_count": 0,
			"create_time": "2025-09-10T12:14:58Z",
			"update_time": "2025-09-10T12:15:01Z",
			"total_duration_ms": 3096
		}
	],
	"pagination": {
		"cursor": "2025-09-10T12:14:58.848485Z"
	}
}
```

### 检索操作详情

1.  操作：检索单个指定操作的详情和状态。`operation_id` 可在启动它的初始 API 调用的响应正文中找到，或通过列出操作找到。
2.  端点：`GET /projects/{project_id}/operations/{operation_id}`
3.  路径参数：
    - `project_id` (string, required): 发生操作的项目的唯一标识符。
    - `operation_id` (UUID, required): 操作的唯一标识符。此 ID 在启动操作的 API 调用的响应正文中返回。

示例请求：

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/operations/274e240f-e2fb-4719-b796-c1ab7c4ae91c' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

示例响应：

```json
{
	"operation": {
		"id": "274e240f-e2fb-4719-b796-c1ab7c4ae91c",
		"project_id": "hidden-river-50598307",
		"branch_id": "br-long-feather-adpbgzlx",
		"endpoint_id": "ep-round-morning-adtpn2oc",
		"action": "start_compute",
		"status": "finished",
		"failures_count": 0,
		"create_time": "2025-09-10T12:14:58Z",
		"update_time": "2025-09-10T12:15:03Z",
		"total_duration_ms": 4843
	}
}
```
