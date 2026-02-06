# 基础设施准备规范 (Infrastructure Preparation Specification)

## ADDED Requirements (新增需求)

### Requirement: Apps/Type Runtime Support (Apps/Type 运行时支持)

`apps/type` 包必须配置为支持运行时 JavaScript 执行，从纯类型定义库转型。

#### Scenario: Configure Dependencies (配置依赖)

- **WHEN** 检查 `apps/type/package.json` 时
- **THEN** `dependencies` 必须包含 `drizzle-orm`, `zod`, 和 `drizzle-zod`
- **AND** `private` 字段应保持 `true`（monorepo 内部）
- **AND** `main` 和 `exports` 字段必须配置为解析到源码 (ts) 或构建产物 (js)

#### Scenario: Configure Compiler Options (配置编译器选项)

- **WHEN** 检查 `apps/type/tsconfig.json` 时
- **THEN** `noEmit` 必须设为 `false`（或移除）以允许 Emit，或如果仅使用 `vite`/`bundler` 解析则保持 `true`（Design Decision Check: Design said remove noEmit. Sticking to design 遵循设计）。
- **AND** `moduleResolution` 必须兼容 Drizzle/Nitro（如 `bundler` 或 `node16`）

### Requirement: Update Global Skills (更新全局 Skills)

Agent 使用的全局 Skills 必须指向新的 Schema 位置。

#### Scenario: Update Neon DB List Skill (更新 Neon DB List Skill)

- **WHEN** 执行 `neon-db-list` skill 时
- **THEN** 它必须在 `apps/type/src/business/**/schema.ts` 中搜索 Schemas
- **AND** 它绝不能在 `apps/admin/server/db/schemas` 中搜索（除非保留为只读旧版）

#### Scenario: Update Schema Guardian (更新 Schema Guardian)

- **WHEN** 执行 `schema-and-seed-guardian` skill 时
- **THEN** 指令必须引导新列的添加操作到 `apps/type`
