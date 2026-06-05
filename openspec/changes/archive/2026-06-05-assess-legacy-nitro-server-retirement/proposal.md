## Why

`migrate-superpowers-docs-to-openspec-longtask` 已完成并通过严格校验，但它的结论是“迁移与证据体系完成”，不是 `apps/admin/server` 与 `apps/app/server` 的目录级删除许可。当前两个旧 Nitro server 目录仍被 OpenSpec 标记为受保护路径，并且代码、构建脚本、mock、测试和 fallback 链路仍存在直接依赖。

本变更用于建立独立的旧 Nitro server 退役评审流程：先把 admin/app 两个旧 server 目录的可删性、保留项、阻断项、dry-run 验证和回滚方案审清楚，再决定是否允许后续进入删除执行。

## What Changes

- 新增独立的旧 Nitro server 退役评审 OpenSpec change，避免把旧目录删除夹带进已完成的 Phase7/OpenSpec 迁移任务。
- 明确 `apps/admin/server` 与 `apps/app/server` 当前状态为 `protected`，不得删除、移动、归档、重命名或清空。
- 建立目录级退役门禁：全仓引用扫描、endpoint 分类、构建脚本依赖、mock/test 依赖、fallback/shadow-off 证据、DB/write 证据、dry-run rename/delete 验证和 rollback 方案。
- 把 admin 与 app 分开评审：admin 重点检查 legacy `/api/**`、DB/seed、R2/upload、Nitro config、兼容 drizzle 入口；app 重点检查 `/app/**`、`/callComponent/**`、fallback-only 路径、Vite mock、runtime tests 和旧 Nitro build。
- 要求任何删除执行都必须基于本 change 后续产出的 `delete-candidate` 决策、验证证据和用户明确确认；本 change 创建时不授权删除。
- 不改变生产 API、数据库 schema、前端页面行为、部署目标或现有旧 server 代码。

## Capabilities

### New Capabilities

- `legacy-nitro-server-retirement`: 定义 `apps/admin/server` 与 `apps/app/server` 的独立退役评审、删除门禁、证据矩阵、dry-run 验证和回滚要求。

### Modified Capabilities

- 无。现有 `migrate-superpowers-docs-to-openspec-longtask` 已完成，本变更不修改其历史结论，只在新的独立 change 中承接旧 Nitro server 退役评审。

## Impact

- 受影响文档：
  - `openspec/changes/assess-legacy-nitro-server-retirement/proposal.md`
  - `openspec/changes/assess-legacy-nitro-server-retirement/design.md`
  - `openspec/changes/assess-legacy-nitro-server-retirement/tasks.md`
  - `openspec/changes/assess-legacy-nitro-server-retirement/specs/legacy-nitro-server-retirement/spec.md`
- 受审计但当前不得直接删除的路径：
  - `apps/admin/server`
  - `apps/app/server`
- 后续可能需要检查或修改的入口：
  - `apps/admin/nitro.config.ts`
  - `apps/admin/package.json`
  - `apps/admin/drizzle.config.ts`
  - `apps/app/nitro.config.ts`
  - `apps/app/vite.config.ts`
  - `apps/app/package.json`
  - `apps/app/src/api/mock/**`
  - `apps/app/src/tests/nitro-runtime/**`
  - `apps/api/server/handlers/legacy-dispatch.ts`
  - `apps/api/server/shared/runtime/legacy-fallback.ts`
- 本变更本身不触发生产写入、不读取敏感环境变量、不推送远程、不删除旧目录。
