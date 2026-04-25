# API 接口定义完整示例

## 1. 当前推荐的文件落点

```plain
src/api/repair.ts
server/modules/repair/repository.ts
server/modules/repair/endpoints.ts
src/api/mock/repair.mock.ts
```

这四层分别承担：

1. 前端接口定义
2. 共享业务数据与仓储行为
3. 共享 endpoint 映射
4. H5 Vite mock 薄包装

## 2. 前端 API 定义示例

```typescript
/**
 * 维修工单模块 API 接口定义
 * 对应业务：维修工单流程管理
 */

import type { CreateRepairReq, RepairListParams, RepairListResponse, RepairOrder } from "@/types/repair";
import { http } from "@/http/alova";

/** 查询维修工单列表 */
export function getRepairOrderList(params: RepairListParams) {
	return http.Get<RepairListResponse>("/app/ownerRepair.listOwnerRepairs", { params });
}

/** 查询维修工单详情 */
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<{ ownerRepair?: RepairOrder }>("/app/ownerRepair.queryOwnerRepair", {
		params,
	});
}

/** 创建维修工单 */
export function createRepairOrder(data: CreateRepairReq) {
	return http.Post<{ ownerRepair: RepairOrder }>("/app/ownerRepair.saveOwnerRepair", data);
}
```

## 3. 共享 endpoint 定义示例

```typescript
import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry.ts";
import { errorResponse, successResponse } from "../../shared/runtime/response-builder.ts";
import { repairMockRepository } from "./repository.ts";

export function createRepairEndpointDefinitions(): EndpointDefinition[] {
	return [
		{
			url: "/app/ownerRepair.listOwnerRepairs",
			method: ["GET", "POST"],
			handler: ({ params }) => {
				const result = repairMockRepository.list({
					page: Number(params.page) || 1,
					row: Number(params.row) || 10,
					communityId: String(params.communityId || ""),
				} as any);

				return successResponse(
					{
						ownerRepairs: result.list,
						total: result.total,
						page: result.page,
						row: result.pageSize,
					},
					"查询成功",
				);
			},
		},
		{
			url: "/app/ownerRepair.queryOwnerRepair",
			method: ["GET", "POST"],
			handler: ({ params }) => {
				const repairId = String(params.repairId || "").trim();
				if (!repairId) {
					return errorResponse("维修工单ID不能为空", "400");
				}

				const repair = repairMockRepository.getById(repairId);
				if (!repair) {
					return errorResponse("维修工单不存在", "404");
				}

				return successResponse({ ownerRepair: repair }, "查询成功");
			},
		},
	];
}
```

## 4. H5 mock 薄包装示例

```typescript
/**
 * 维修工单模块 Mock 接口
 * 共享业务逻辑已迁移到 `server/modules/repair`，这里仅保留 Vite mock 包装层。
 */

import { repairEndpointDefinitions } from "../../../server/modules/repair/endpoints";
import { createLegacyMockDefinitionsFromEndpoints } from "../../../server/shared/runtime/mock-definition-adapter";
import { defineUniAppMock } from "./shared/utils";

export default defineUniAppMock(createLegacyMockDefinitionsFromEndpoints(repairEndpointDefinitions));
```

## 5. 关键说明

### 5.1. 为什么 API 泛型不包 `ApiResponse`

`src/http/alova.ts` 已经自动把成功响应的 `data` 字段解包给页面，因此页面拿到的是业务数据，不是整包响应对象。

正确写法：

```typescript
return http.Get<{ ownerRepair?: RepairOrder }>(...)
```

错误写法：

```typescript
return http.Get<ApiResponse<{ ownerRepair?: RepairOrder }>>(...)
```

### 5.2. 为什么不要再把业务逻辑塞回 `*.mock.ts`

因为当前仓库的目标是：

- H5 mock 复用共享 endpoint
- Nitro 复用同一份共享 endpoint

如果 `*.mock.ts` 再维护一份业务逻辑，就会重新分叉。

## 6. 新旧模式对照

|       维度        |              旧误导写法              |                 当前推荐写法                 |
| :---------------: | :----------------------------------: | :------------------------------------------: |
|   业务实现位置    |       `src/api/mock/*.mock.ts`       | `server/modules/*/{repository,endpoints}.ts` |
| H5 mock 暴露方式  | `defineUniAppMock([...业务实现...])` |     `defineUniAppMock(createLegacy... )`     |
|  Nitro 暴露方式   |             另写一套接口             |     `legacy-dispatch` 复用共享 endpoint      |
| 前端 API URL 契约 |          试图改成 `/api/**`          |   继续兼容 `/app/**`、`/callComponent/**`    |

## 7. 自检清单

- [ ] 先写 `src/api/{module}.ts`
- [ ] 再写 `server/modules/{module}/repository.ts`
- [ ] 再写 `server/modules/{module}/endpoints.ts`
- [ ] 最后补 `src/api/mock/{module}.mock.ts`
- [ ] API 泛型未包 `ApiResponse`
- [ ] URL 保持旧业务路径
