# Shadow Migration Strategy

本规范细化了 "影子迁移" 的具体执行步骤，确保只增不减（Add Only），最后切换（Switch Over）。

## ADDED Requirements

### Requirement: 影子迁移工作流 (Shadow Migration Workflow)

迁移 MUST 按照 Duplicate → Verify → Use New → Switch Config → Refactor → Cleanup 的顺序执行。在全部模块完成迁移前，MUST NOT 修改 `apps/admin` 的 Drizzle 配置。

#### Scenario: 单模块迁移微循环

- **WHEN** 迁移某个业务模块（如 Community）时
- **THEN** Step 1: 找到源文件 `apps/admin/server/db/schemas/<module>.ts`
- **AND** Step 2: 创建目标文件 `apps/type/src/business/<domain>/<module>/schema.ts`
- **AND** Step 3: 复制 `pgTable` 定义，添加 Zod Schemas 和 Types
- **AND** Step 4: 在 `index.ts` 中添加 `export * from "./schema"`
- **AND** Step 5: MUST 删除或注释掉与新推导类型冲突的旧 interface
- **AND** Step 6: 运行 `pnpm -F @01s-11comm/type typecheck` 验证无错误

### Requirement: 导出对齐规范 (Export Alignment)

迁移后 MUST 确保 `index.ts` 正确导出 schema，且旧的手动 interface 定义 MUST 被清理。

#### Scenario: 导出冲突处理

- **WHEN** 原 `index.ts` 导出了同名的手动 interface（如 `interface Community`）
- **THEN** MUST 删除旧的手动定义
- **AND** 让 `schema.ts` 导出的新 Type 完全替代
- **AND** 如需兼容，可使用 `type OldType = NewType` 做别名

### Requirement: 全局切换规范 (Global Switch Phase)

当所有模块都完成影子迁移后，MUST 执行全局切换。切换过程 MUST 包含 Drift Check 验证。

#### Scenario: 数据库连接切换

- **WHEN** 所有模块迁移完成后
- **THEN** 修改 `apps/admin/server/db/index.ts` 将导入替换为 `@01s-11comm/type`
- **AND** 修改 `apps/admin/drizzle.config.ts` 的 schema 路径
- **AND** 运行 `pnpm db:generate` 或 `drizzle-kit check`
- **AND** 成功标准: 输出 "No changes detected" 或生成的 migration 为空

#### Scenario: Drift Check 失败处理

- **WHEN** Drift Check 提示 Drop Table / Create Table 等差异
- **THEN** MUST 修改 `apps/type` 中的定义使其与数据库现状完全匹配
- **AND** 重复 Drift Check 直到 diff 为 0

### Requirement: 清理规范 (Cleanup Phase)

全局切换验证通过后，MUST 清理旧的 Schema 文件。

#### Scenario: 旧文件删除

- **WHEN** Drift Check 通过且应用运行正常后
- **THEN** 删除 `apps/admin/server/db/schemas/` 目录下的旧 Schema 文件
- **AND** 全局搜索项目中对旧路径的引用，替换为 `@01s-11comm/type`
