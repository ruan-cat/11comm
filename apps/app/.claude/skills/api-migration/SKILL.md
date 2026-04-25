---
name: api-migration
description: |
  专业的接口迁移与编写专家。从 Java110Context + uni.request 迁移到 Alova + TypeScript，并同时适配当前仓库的 Nitro / Vite mock 双运行时架构。

  触发条件（满足任意一项即触发）：
  - 需要新增或修改 `src/api/*.ts` 接口定义
  - 需要新增或修改 `server/modules/*/{endpoints,repository}.ts`
  - 需要为 H5 mock / Nitro 双运行时补齐同一份接口实现
  - 需要从旧项目 `examples/gitee-exampl-app/constant/url.js` 迁移接口地址
  - 需要维护 `src/api/mock/*.mock.ts` 本地 mock 包装层
  - 用户提及“API 迁移”“接口定义”“Nitro 接口”“本地 mock”“useRequest”等关键词

  必须协同的技能：
  - api-error-handling（几乎所有接口调用都需要）
  - z-paging-integration（分页列表时）
  - use-wd-form（表单提交时）
  - code-migration（从 Vue2 页面迁移时）

  禁止项：
  - 禁止为已共享化模块把业务数据和 CRUD 逻辑继续堆回 `src/api/mock/*.mock.ts`
  - 禁止把迁移后的前端接口统一改成 `/api/**`，应继续兼容旧业务路径
  - 禁止在 API 泛型里包裹 `ApiResponse`
  - 禁止使用 `try/catch` 包装 `send()`
  - 禁止在 `server/**` 运行时代码中使用 `@/` alias 或省略相对导入 `.ts` 扩展名
  - 禁止为了写 H5 mock 再维护一套与 Nitro 分叉的业务实现

  覆盖场景：列表、详情、创建、更新、状态流转、字典查询、分页接口，以及双运行时下的接口复用。
context: fork
---

# 接口请求迁移专家

## 1. 多技能协同

常见组合场景：

- 表单提交接口：`use-wd-form` + `api-error-handling`
- 列表分页接口：`z-paging-integration` + `api-error-handling`
- Vue2 页面迁移接口：`code-migration` + `api-error-handling`

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 2. 实施前必读

必须先阅读下面这些真实实现文件，再开始写接口：

- `examples/gitee-exampl-app/constant/url.js`
- `src/api/repair.ts`
- `src/http/alova.ts`
- `src/http/runtime-base.ts`
- `server/modules/repair/endpoints.ts`
- `server/modules/repair/repository.ts`
- `src/api/mock/repair.mock.ts`
- `server/shared/runtime/mock-definition-adapter.ts`
- `server/handlers/legacy-dispatch.ts`

配套参考文档：

- [references/api-定义示例.md](references/api-定义示例.md)
- [references/mock-实现指南.md](references/mock-实现指南.md)
- [references/mock-规范.md](references/mock-规范.md)
- [references/mock-响应格式.md](references/mock-响应格式.md)
- [references/接口地址迁移.md](references/接口地址迁移.md)

---

## 3. 当前仓库的真实架构

### 3.1. 核心结论

当前仓库已经不是“每个 `*.mock.ts` 文件自己维护数据库对象 + 接口逻辑”的模式了。

对于已经共享化的业务模块，标准落点是：

```plain
src/api/{module}.ts                     # 前端 Alova 接口定义
server/modules/{module}/repository.ts   # 业务数据与仓储行为
server/modules/{module}/endpoints.ts    # 共享 endpoint 定义
src/api/mock/{module}.mock.ts           # H5 Vite mock 薄包装层
```

### 3.2. 双运行时分工

|                  层                  |                       当前职责                       |                说明                 |
| :----------------------------------: | :--------------------------------------------------: | :---------------------------------: |
|            `src/api/*.ts`            |                 前端统一接口入口定义                 |  始终保持旧业务路径，如 `/app/**`   |
|   `server/modules/*/repository.ts`   |            内存数据、筛选、聚合、状态流转            | H5 mock 与 Nitro 共用同一份业务逻辑 |
|   `server/modules/*/endpoints.ts`    |             把旧业务 URL 映射到 handler              | 返回统一响应结构，供两个运行时复用  |
|       `src/api/mock/*.mock.ts`       |           调用 adapter 输出 Vite mock 定义           |        不再承载主要业务实现         |
| `server/handlers/legacy-dispatch.ts` | Nitro 下承接 `/app/**`、`/callComponent/**` 等旧路径 |        不要求你平铺文件路由         |

### 3.3. 你必须遵守的实施准则

1. 新增共享化模块时，业务逻辑优先写进 `server/modules/*/{repository,endpoints}.ts`。
2. `src/api/mock/*.mock.ts` 只负责把共享 endpoint 转成 Vite mock 可消费的定义。
3. 前端接口仍然继续调用旧业务路径，不要自作主张替换成 `/api/**`。
4. `src/http/alova.ts` 已自动解包响应；API 泛型写业务数据类型即可。
5. `server/**` 可能被 standalone Nitro / Node 直接执行，运行时代码必须使用相对路径并显式补 `.ts`。

---

## 4. 标准实施流程

### 4.1. 第一步：从旧项目确认接口地址

先在 `examples/gitee-exampl-app/constant/url.js` 查到旧接口，再提取真实路径，例如：

```typescript
listOwnerRepairs: baseUrl + "app/ownerRepair.listOwnerRepairs";
```

提取后在新项目中使用：

```typescript
"/app/ownerRepair.listOwnerRepairs";
```

### 4.2. 第二步：补齐 TypeScript 类型

优先在 `src/types/{module}.ts` 中定义请求参数和业务返回结构。分页接口优先复用基础类型，业务字段单独声明。

### 4.3. 第三步：编写前端 API 定义

在 `src/api/{module}.ts` 中：

- 继续使用旧业务路径
- 泛型直接写业务数据
- 查询参数放 `{ params }`
- 提交参数直接传 body

### 4.4. 第四步：编写共享 repository

在 `server/modules/{module}/repository.ts` 中：

- 维护内存数据源或仓储行为
- 处理筛选、分页、字典映射、状态流转
- 统一返回纯业务数据，不直接关心 Alova

### 4.5. 第五步：编写共享 endpoints

在 `server/modules/{module}/endpoints.ts` 中：

- 把旧路径映射成 `EndpointDefinition[]`
- 统一参数收敛
- 用 `successResponse` / `errorResponse` 返回标准结构
- 让 H5 mock 与 Nitro 共用同一份 endpoint 逻辑

### 4.6. 第六步：补齐 H5 mock 薄包装

在 `src/api/mock/{module}.mock.ts` 中：

- 导入共享的 `*EndpointDefinitions`
- 通过 `createLegacyMockDefinitionsFromEndpoints(...)` 输出 Vite mock 定义
- 用 `defineUniAppMock(...)` 包装

### 4.7. 第七步：页面侧接入 useRequest

页面层的 `useRequest` 规范交由 `api-error-handling` 负责，但这里有两条硬约束：

1. 必须 `immediate: false`
2. 禁止 `try/catch` 包 `send()`

---

## 5. API 定义硬性规则

### 5.1. 响应解包规则

`src/http/alova.ts` 已经自动处理：

1. HTTP 状态码异常
2. 业务码非成功时的错误提示
3. 成功时只返回 `rawData.data`

因此 API 定义必须写成：

```typescript
/** 查询维修工单详情 */
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<{ ownerRepair?: RepairOrder }>("/app/ownerRepair.queryOwnerRepair", {
		params,
	});
}
```

而不是：

```typescript
// 错误示例
return http.Get<ApiResponse<{ ownerRepair?: RepairOrder }>>(...)
```

### 5.2. URL 规则

- 保留旧业务路径，如 `/app/**`、`/callComponent/**`
- 不要在迁移后的 API 上加 `/api`
- `defineUniAppMock` 会在 H5 mock 运行时补齐代理前缀，你不需要手工写 `/dev-api`

### 5.3. 分页规则

分页接口返回什么，前端就按什么写类型，不要为了追求统一强行改旧字段名。

例如维修模块当前返回：

```typescript
interface RepairListResponse {
	ownerRepairs: RepairOrder[];
	total: number;
	page: number;
	row: number;
}
```

那就直接按这个结构定义，不要硬改成通用 `list` 字段。

---

## 6. 本地 mock 编写规则

### 6.1. 新模式

对于共享化模块，`src/api/mock/*.mock.ts` 的标准形态应当像这样：

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

### 6.2. 旧模式只用于过渡维护

如果某个模块还没共享化，才允许继续在 `*.mock.ts` 里直接写 legacy mock 定义。

但即使是过渡维护，也要遵守：

- URL 使用旧业务路径
- 统一使用 `defineUniAppMock`
- 返回值遵守统一响应结构

不要再把“legacy 过渡写法”写成新模块的推荐标准。

---

## 7. server 运行时代码规则

这是当前仓库很容易踩坑的地方：

1. `server/**` 运行时代码禁止使用 `@/` alias
2. 相对导入必须显式写 `.ts`
3. 共享响应工具应来自 `server/shared/runtime/response-builder.ts`
4. 共享工具应优先来自 `server/shared/runtime/*`

错误示例：

```typescript
import { http } from "@/http/alova";
import { successResponse } from "../../shared/runtime/response-builder";
```

正确示例：

```typescript
import { successResponse } from "../../shared/runtime/response-builder.ts";
```

---

## 8. 验证清单

### 8.1. 代码落点检查

- [ ] `src/api/{module}.ts` 已定义前端接口
- [ ] `server/modules/{module}/repository.ts` 已承载业务数据与仓储行为
- [ ] `server/modules/{module}/endpoints.ts` 已暴露共享 endpoint
- [ ] `src/api/mock/{module}.mock.ts` 已收敛为薄包装层

### 8.2. 路径契约检查

- [ ] 接口路径来自 `examples/gitee-exampl-app/constant/url.js`
- [ ] 没有错误引入 `/api/**`
- [ ] H5 mock 没有手工拼 `/dev-api`

### 8.3. 类型检查清单

- [ ] API 泛型没有包裹 `ApiResponse`
- [ ] 查询 / 提交参数类型明确
- [ ] 业务返回结构与真实 endpoint 一致

### 8.4. 运行时约束检查

- [ ] `server/**` 运行时代码没有使用 `@/` alias
- [ ] `server/**` 相对导入都补了 `.ts`
- [ ] 没有在 `src/api/mock/*.mock.ts` 重复维护第二套业务实现

---

## 9. 相关文档

- [references/api-定义示例.md](references/api-定义示例.md)
- [references/mock-实现指南.md](references/mock-实现指南.md)
- [references/mock-规范.md](references/mock-规范.md)
- [references/mock-响应格式.md](references/mock-响应格式.md)
- [references/接口地址迁移.md](references/接口地址迁移.md)
- [references/类型定义规范.md](references/类型定义规范.md)
