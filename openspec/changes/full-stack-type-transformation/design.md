## Context

项目目前在 `apps/admin` (Drizzle) 中维护数据库定义，在 `apps/type` 中维护 TypeScript 接口。这种隔离导致了同步问题，并阻碍了验证逻辑的共享。我们正在重构 `apps/type`，使其成为类型和运行时验证的“单一事实来源”。

## Goals / Non-Goals

**Goals:**

- **统一 Schema 注册中心**: `apps/type` 导出 Drizzle Tables, Zod Schemas, 和 TS Types。
- **运行时验证**: 后端 (Nitro) 和 前端 (Vue) 使用同一套 Zod Schemas。
- **影子迁移 (Shadow Migration)**: 通过先创建并行 Schema 的方式，实现不破坏现有功能的平滑迁移。

**Non-Goals:**

- **tRPC**: 我们**不会**实现 tRPC。我们将继续使用 Nitro 的 API 处理器，但会通过 Zod 验证进行增强。

## Decisions

### 1. 影子迁移策略 (Shadow Migration Strategy)

我们不会进行破坏性的文件移动。相反：

1.  **复制**: 将表定义复制到 `apps/type`。
2.  **增强**: 添加 Zod 生成和导出逻辑。
3.  **切换**: 将 `apps/admin` 的引用指向 `apps/type`。
4.  **清理**: 删除 `apps/admin` 中的旧 Schemas。
    这样可以最大限度地降低迁移过程中构建中断的风险。

### 2. 业务路径结构 (Business Path Structure)

Schemas **不会**被集中在一个单一的 `db` 文件夹中。它们将遵循 `apps/type` 中现有的“业务路径”：
`apps/type/src/business/<domain>/<subdomain>/schema.ts`
这符合领域驱动设计 (DDD)，并保持相关的业务逻辑（类型、Schema、常量）在一起。

### 3. 运行时依赖 (Runtime Dependency)

`apps/type` 将从仅含 `devDependencies` 的包转变为包含 `drizzle-orm`, `zod`, 和 `drizzle-zod` 的 `dependencies` 包。这允许它导出运行时代码。

## Risks / Trade-offs

- **风险: 增加打包体积**: 引入 Zod 会增加前端打包体积。
  - _缓解_: 带来的安全性收益远大于几 KB 的成本。现代打包工具 (Bundlers) 的 Tree-shaking 效果很好。
- **风险: 迁移疲劳**: 移动大量文件很繁琐。
  - _缓解_: 我们将先使用一个试点模块（"Dictionary" 或 "OperationTeam"）来验证工作流，然后再进行批量迁移。
