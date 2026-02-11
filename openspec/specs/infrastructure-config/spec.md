# Infrastructure Configuration Standard

由于 `apps/type` 从纯类型库转变为运行时同构库 (Isomorphic Library)，其基础设施配置至关重要。

## Requirements

### Requirement: apps/type Package 配置标准

`apps/type/package.json` MUST 将运行时依赖 (`drizzle-orm`, `zod`, `drizzle-zod`) 放入 `dependencies` 字段（非 `devDependencies`）。MUST 配置 `exports` 字段支持子路径导入。

#### Scenario: 依赖安装验证

- **WHEN** 检查 `apps/type/package.json` 时
- **THEN** `drizzle-orm`, `zod`, `drizzle-zod` MUST 在 `dependencies` 中
- **AND** `exports` 字段 MUST 包含 `"."` 和 `"./business"` 子路径

### Requirement: apps/type TSConfig 配置标准

`apps/type/tsconfig.json` MUST 配置 `@/*` 路径别名指向 `src/*`，**但此别名仅用于独立的 `tsc --noEmit` 类型检查**。

> **⚠ CRITICAL**: 源码文件中 MUST NOT 使用 `@/` 路径别名导入。MUST 使用相对路径。

#### Scenario: 路径别名验证

- **WHEN** 独立运行 `pnpm -F @01s-11comm/type typecheck` 时
- **THEN** TypeScript 编译器 MUST 能正确解析 `@/` 路径别名
- **BUT** 源码中 MUST NOT 使用 `@/` 路径别名，MUST 使用相对路径

### Requirement: apps/admin Drizzle 配置切换标准

`apps/admin/drizzle.config.ts` MUST 在 Phase 4 (Switch) 阶段修改 schema 扫描路径。MUST NOT 提前修改。

#### Scenario: 配置切换

- **WHEN** 所有模块完成影子迁移后
- **THEN** 修改 `schema` 字段指向 `../../apps/type/src/business/**/schema.ts`
- **AND** 运行 `drizzle-kit check` 验证无 drift

### Requirement: 环境验证标准

在执行迁移命令前 MUST 验证环境完整性。

#### Scenario: 环境检查

- **WHEN** 准备执行迁移或类型检查时
- **THEN** MUST 确保 `pnpm install` 已执行且无错误
- **AND** MUST 确保 `.env` 中 `DATABASE_URL` 有效
- **AND** MUST 运行 `pnpm -F @01s-11comm/type typecheck` 验证类型正确
