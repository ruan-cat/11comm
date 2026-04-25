# 本地 Mock 规范

## 1. 总体原则

### 1.1. 共享化模块优先

当前仓库默认要求：

1. 业务逻辑写在 `server/modules/*/{repository,endpoints}.ts`
2. `src/api/mock/*.mock.ts` 只做 H5 Vite mock 薄包装

### 1.2. legacy mock 只作过渡

如果某模块还没共享化，允许暂时继续维护旧式 `*.mock.ts`。但不能把这种过渡写法继续写进新文档当成推荐模式。

## 2. URL 规范

### 2.1. 只写真实业务路径

正确示例：

```typescript
url: "/app/ownerRepair.listOwnerRepairs";
url: "/callComponent/core/list";
```

错误示例：

```typescript
url: "/api/app/ownerRepair.listOwnerRepairs";
url: "/dev-api/app/ownerRepair.listOwnerRepairs";
```

### 2.2. 前缀由运行时处理

- H5 mock：`defineUniAppMock` 负责补齐代理前缀
- Nitro：`legacy-dispatch` 直接承接旧业务路径

因此实现文件里不要手工拼前缀。

## 3. 目录与职责规范

|                  文件                   |        职责         |                 备注                 |
| :-------------------------------------: | :-----------------: | :----------------------------------: |
|          `src/api/{module}.ts`          | 前端 Alova 接口定义 |          路径继续保持旧契约          |
| `server/modules/{module}/repository.ts` | 内存数据与仓储行为  | 推荐放字典映射、筛选、分页、状态流转 |
| `server/modules/{module}/endpoints.ts`  | URL 与 handler 映射 |         统一输出标准响应结构         |
|     `src/api/mock/{module}.mock.ts`     |  H5 mock 薄包装层   |         不再承载主要业务实现         |

## 4. server 运行时代码规范

### 4.1. 导入规则

`server/**` 代码要兼容 standalone Nitro / Node 直接执行，因此：

- 禁止 `@/` alias
- 相对导入必须显式补 `.ts`

正确示例：

```typescript
import { successResponse } from "../../shared/runtime/response-builder.ts";
```

错误示例：

```typescript
import { successResponse } from "@/server/shared/runtime/response-builder";
```

### 4.2. 响应工具来源

共享 endpoint 应使用：

```typescript
server / shared / runtime / response - builder.ts;
```

不要把 `src/api/mock/shared/utils.ts` 当成 server 运行时代码的响应工具入口。

## 5. 数据字典规范

### 5.1. 常量位置

字典 / 下拉常量统一放在：

```plain
src/constants/{module}.ts
```

### 5.2. 使用位置

当前推荐在 `server/modules/*/repository.ts` 或前端组件里消费这些常量，而不是继续把字典散落在 `*.mock.ts`。

示例：

```typescript
import { REPAIR_PAY_TYPE_OPTIONS, REPAIR_STATUSES, REPAIR_TYPE_OPTIONS } from "../../../src/constants/repair.ts";
```

## 6. 响应格式规范

共享 endpoint 统一使用：

- `successResponse`
- `errorResponse`

它们来自：

```plain
server/shared/runtime/response-builder.ts
```

`ResultEnumMap` 只保留给仍未共享化的 legacy `*.mock.ts` 维护场景，不是新模块首选。

## 7. H5 mock 包装层规范

标准写法：

```typescript
import { exampleEndpointDefinitions } from "../../../server/modules/example/endpoints";
import { createLegacyMockDefinitionsFromEndpoints } from "../../../server/shared/runtime/mock-definition-adapter";
import { defineUniAppMock } from "./shared/utils";

export default defineUniAppMock(createLegacyMockDefinitionsFromEndpoints(exampleEndpointDefinitions));
```

不要再写：

```typescript
export default defineUniAppMock([
	{
		url: "/app/example.listExamples",
		body: () => {
			// 这里再维护一套业务实现
		},
	},
]);
```

## 8. 自检清单

- [ ] URL 未手工补 `/api` 或 `/dev-api`
- [ ] 共享化模块没有把业务逻辑塞回 `*.mock.ts`
- [ ] `server/**` 导入已补 `.ts`
- [ ] `server/**` 未使用 `@/` alias
- [ ] 字典优先放在 `src/constants`
- [ ] 响应工具优先来自 `response-builder.ts`
