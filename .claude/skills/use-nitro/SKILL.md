---
name: use-nitro
description: 使用 Nitro v3 框架编写服务端接口的技能规范。适用于初始化纯后端 Nitro 项目、为 Vite 项目赋予全栈能力、编写符合规范的 Nitro 接口。当用户需要创建 Nitro 接口、初始化 Nitro 配置、或咨询 Nitro 开发规范时使用此技能。
---

# Nitro v3 接口开发技能规范

本技能用于指导使用 Nitro v3 框架编写服务端接口，包括项目初始化、配置、接口编写规范等完整流程。

## 1. 适用场景

- **纯后端 Nitro 项目初始化**：对非 Vite 的 Node.js 项目，初始化 Nitro 示例代码和配置
- **Vite 项目全栈化**：对 Vite 项目，初始化 Nitro 接口和配置，赋予全栈能力
- **接口开发与维护**：按规范编写 Nitro v3 格式的接口代码

## 2. 开发模式

本技能支持两种开发模式：

| 模式                    | 描述                       | 适用阶段             | 关键特征                             |
| :---------------------- | :------------------------- | :------------------- | :----------------------------------- |
| **Mock 模式 (Legacy)**  | 使用静态 JSON 数组模拟数据 | 原型开发、无 DB 环境 | `mock-data.ts`, `filterDataByQuery`  |
| **Neon + Drizzle 模式** | 连接真实 PostgreSQL 数据库 | 生产开发、正式交付   | `server/db`, `drizzle-orm`, SQL 查询 |

## 3. 核心依赖

```bash
# Nitro v3 核心包
pnpm add nitro

# Drizzle ORM (生产环境数据库)
pnpm add drizzle-orm
pnpm add -D drizzle-kit

# 可选：日志工具
pnpm add consola
```

## 4. 目录结构规范

```plain
project-root/
├── server/                          # Nitro 服务端目录
│   ├── api/                         # API 接口目录
│   │   └── {module}/{sub-module}/{page}/
│   │       ├── list.post.ts         # 列表查询接口
│   │       ├── tree.post.ts         # 树形数据接口
│   │       └── mock-data.ts         # Mock 数据文件 (仅 Mock 模式)
│   ├── db/                          # 数据库配置 (Neon + Drizzle 模式)
│   │   ├── index.ts                 # Drizzle 实例导出
│   │   └── schemas/                 # 数据库表定义
│   └── utils/
│       └── filter-data.ts           # 通用数据筛选工具 (仅 Mock 模式)
├── nitro.config.ts                  # Nitro 配置文件
└── package.json
```

## 5. 核心规范 [CRITICAL]

### 5.1 通用规范 (所有模式)

1.  **导入来源**：必须从 `nitro/h3` 导入 `defineHandler`, `readBody`。
2.  **处理器函数**：必须使用 `defineHandler`。
3.  **响应格式**：必须返回 `JsonVO<PageDTO<T>>` 结构。
4.  **参数处理**：使用 `defaultParams` 对象合并模式。

### 5.2 模式选择指引

- **新功能开发**：默认使用 **Neon + Drizzle 模式**。
- **快速原型/演示**：可以使用 **Mock 模式**，但需规划迁移路径。
- **遗留代码维护**：Mock 模式代码维持现状，直至安排迁移。

> 详细代码模板请参考 [templates.md](templates.md)

## 6. 迁移指南 (Mock -> Neon)

当从 Mock 模式迁移到真实数据库时，请遵循以下步骤：

### Step 1: 准备数据库 Schema

1.  在 `server/db/schemas/` 下创建对应的 Schema 定义文件。
2.  确保导出 Drizzle Table 对象 (e.g., `smSystemConfigs`)。
3.  运行 `drizzle-kit generate` 和 `migrate` 更新数据库。

### Step 2: 替换接口实现

修改 `list.post.ts` 文件：

1.  **移除 Mock 依赖**：
    - 删除 `import { filterDataByQuery } ...`
    - 删除 `import { mockData } ...`
2.  **导入 DB 依赖**：
    - 添加 `import { db, yourSchema } from "server/db"`
    - 添加 `import { count, eq, like, ... } from "drizzle-orm"`
3.  **重写查询逻辑**：
    - 将 `filterDataByQuery` 替换为 `whereConditions` 数组构建。
    - 将 `slice` 分页替换为 `db.select().limit().offset()`。
    - 添加 `await` 关键字（DB 操作是异步的）。

### Step 3: 数据映射 (Data Mapping)

- **自动映射**：Drizzle 通常会自动将 `snake_case` 列名映射为 Schema 定义中的 `camelCase` 属性名。
- **手动映射**：如果前端类型 (`apps/type`) 与 DB Schema 结构不一致 (如 KV 存储 vs 对象)，需要在 `records.map(...)` 中手动转换。

### Step 4: 清理

- 删除同目录下的 `mock-data.ts` 文件。
- 验证接口返回格式是否保持不变。

## 7. 附加资源

详细的代码模板和参考文档请查阅：

- **代码模板**：[templates.md](templates.md) - 包含 Mock 和 Drizzle 两种模式的完整代码模板
- **快速参考**：[reference.md](reference.md) - 函数速查、配置选项和常用类型
- **本项目规范**：`openspec/specs/nitro-api/spec.md` (当前生效规范)
- **官方文档**：https://v3.nitro.build/
