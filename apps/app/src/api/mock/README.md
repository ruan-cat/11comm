# Mock API 开发说明

本目录用于管理 `vite-plugin-mock-dev-server` 的 H5 本地 mock 包装层。

## 1. 当前目录的真实职责

这里已经不是“每个 `*.mock.ts` 文件自己维护数据库对象 + 业务逻辑”的主战场。

当前推荐架构是：

```plain
src/api/{module}.ts
server/modules/{module}/repository.ts
server/modules/{module}/endpoints.ts
src/api/mock/{module}.mock.ts
```

含义如下：

|                  文件                   |        职责         |
| :-------------------------------------: | :-----------------: |
|          `src/api/{module}.ts`          | 前端 Alova 接口定义 |
| `server/modules/{module}/repository.ts` | 内存数据与仓储行为  |
| `server/modules/{module}/endpoints.ts`  | 共享 endpoint 映射  |
|     `src/api/mock/{module}.mock.ts`     |  H5 mock 薄包装层   |

## 2. 当前目录结构

```plain
src/api/mock/
├── shared/
│   ├── types.ts
│   └── utils.ts
├── repair.mock.ts
├── activity.mock.ts
├── complaint.mock.ts
└── README.md
```

说明：

1. `shared/utils.ts` 现在主要承担 Vite mock 包装层工具职责
2. 主要业务逻辑应优先写到 `server/modules/**`
3. 多数 `*.mock.ts` 都应当是薄包装文件

## 3. 标准写法

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

## 4. 什么时候允许直接写 legacy mock

只有在模块尚未共享化时，才允许直接在 `*.mock.ts` 中维护 legacy mock 定义。

即便如此，也要遵守：

1. URL 继续使用真实业务路径，如 `/app/**`
2. 不要手工补 `/dev-api`
3. 不要为 Nitro 再维护一套分叉逻辑

## 5. 重要提醒

- Mock 文件必须放在 `src/api/mock` 目录下
- `defineUniAppMock()` 仍然是 H5 mock 包装入口
- 新模块优先新增 `server/modules/{module}`，不是优先膨胀 `*.mock.ts`
- `src/api/mock` 只在 H5 Vite mock 运行时生效
