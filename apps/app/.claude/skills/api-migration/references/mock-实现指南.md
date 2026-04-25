# 本地 Mock 实现完整指南

## 1. 先判断你写的是哪一种 mock

当前仓库存在两种状态：

1. **共享化模块**
   业务逻辑在 `server/modules/*/{repository,endpoints}.ts`
2. **遗留模块**
   还没完成共享化，只能暂时继续维护 legacy `*.mock.ts`

新需求默认按第 1 种处理，不要再把第 2 种写法当成首选模板。

## 2. 共享化模块的标准结构

```plain
server/modules/{module}/repository.ts
server/modules/{module}/endpoints.ts
src/api/mock/{module}.mock.ts
```

### 2.1. repository.ts 放什么

- 内存数据源
- CRUD / 状态流转
- 分页筛选
- 字典映射

### 2.2. endpoints.ts 放什么

- URL
- method
- 参数收敛
- `successResponse` / `errorResponse`

### 2.3. `*.mock.ts` 放什么

只放 Vite mock 包装层，不放主要业务逻辑。

## 3. 标准代码模板

### 3.1. repository.ts 模板

```typescript
export interface ExampleRepository {
	getById: (id: string) => ExampleItem | undefined;
	list: (params: ExampleListParams) => ExampleListResult;
}

export function createExampleMockRepository(): ExampleRepository {
	const items: ExampleItem[] = [];

	return {
		getById(id) {
			return items.find((item) => item.id === id);
		},
		list(params) {
			return buildListResult(items, params);
		},
	};
}

export const exampleMockRepository = createExampleMockRepository();
```

### 3.2. endpoints.ts 模板

```typescript
import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry.ts";
import { errorResponse, successResponse } from "../../shared/runtime/response-builder.ts";
import { exampleMockRepository } from "./repository.ts";

export const exampleEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/example.listExamples",
		method: ["GET", "POST"],
		handler: ({ params }) => {
			const result = exampleMockRepository.list({
				page: Number(params.page) || 1,
				row: Number(params.row) || 10,
			} as any);

			return successResponse(
				{
					examples: result.list,
					total: result.total,
				},
				"查询成功",
			);
		},
	},
	{
		url: "/app/example.queryExample",
		method: ["GET", "POST"],
		handler: ({ params }) => {
			const id = String(params.id || "").trim();
			if (!id) {
				return errorResponse("ID不能为空", "400");
			}

			const item = exampleMockRepository.getById(id);
			if (!item) {
				return errorResponse("资源不存在", "404");
			}

			return successResponse({ example: item }, "查询成功");
		},
	},
];
```

### 3.3. `*.mock.ts` 模板

```typescript
import { exampleEndpointDefinitions } from "../../../server/modules/example/endpoints";
import { createLegacyMockDefinitionsFromEndpoints } from "../../../server/shared/runtime/mock-definition-adapter";
import { defineUniAppMock } from "./shared/utils";

export default defineUniAppMock(createLegacyMockDefinitionsFromEndpoints(exampleEndpointDefinitions));
```

## 4. 遗留模块的临时写法

如果你维护的是尚未共享化的旧模块，才允许直接在 `*.mock.ts` 里写 mock 定义。

但这只是过渡态，不是推荐态。

过渡态至少要满足：

- 使用 `defineUniAppMock`
- URL 与前端 API 完全一致
- 返回值遵守统一响应结构

## 5. 常见误区

### 5.1. 误区一：在 `*.mock.ts` 里维护数据库对象

这是旧方案。当前共享化模块不应继续这样做。

### 5.2. 误区二：为了 Nitro 再写一套接口

Nitro 通过 `legacy-dispatch` 复用共享 endpoint，不需要重复造一套 `/api/**`。

### 5.3. 误区三：手工补 `/dev-api`

`defineUniAppMock` 会处理代理前缀，URL 只写真实业务路径即可。

## 6. 自检清单

- [ ] 业务逻辑已写入 `repository.ts`
- [ ] endpoint 已写入 `endpoints.ts`
- [ ] `*.mock.ts` 只保留薄包装
- [ ] 没有新写第二套分叉逻辑
- [ ] Nitro 与 H5 mock 共用同一份 endpoint 定义
