# Shadow Migration Strategy

本规范细化了 "影子迁移" 的具体执行步骤，确保只增不减（Add Only），最后切换（Switch Over）。

## Workflow Overview

1.  **Duplicate (复制)**: 在 `apps/type` 创建新 Schema，内容复制自 `apps/admin`。
2.  **Verify (验证)**: 确保 `apps/type` 编译通过，Schema 生成无误。
3.  **Use New (使用新版)**: 在新功能开发中优先使用 `apps/type`。
4.  **Switch Config (切换配置)**: 只有当所有表都迁移完毕后，才修改 Drizzle Config。
5.  **Refactor (重构)**: 逐个修改后端 API 和前端 Form 使用新类型。
6.  **Cleanup (清理)**: 删除旧文件。

## Detailed Steps per Module

对于每一个业务模块 (例如 `Community`)，执行以下微循环：

### 1. File Creation & Content Migration

- 找到 `apps/admin/server/db/schemas/community.ts`。
- 创建 `apps/type/src/business/property-manage/community-manage/schema.ts`。
- 复制 `pgTable` 定义。
- 添加 imports (`drizzle-orm/pg-core`, `drizzle-zod`, `zod`).
- 添加 Zod Schemas (`createInsertSchema`, etc.).
- 添加 Types (`z.infer`).

### 2. Export Exposure

- 已有: `apps/type/src/business/property-manage/community-manage/index.ts`
- 修改: 确保它 `export * from "./schema"`.
- 注意: 如果原 `index.ts` 导出了同名的手动 interface (如 `interface Community`), **必须删除或注释掉旧的手动定义**，完全让位给 `schema.ts` 导出的新 Type。
  - _Tip_: 如果为了兼容，可以使用 `type OldType = NewType` 做别名。

### 3. Verification

- 在 `apps/type` 根目录运行 typescript check (如果配置了) 或者简单的 build check。
- 确保没有 import errors。

## Global Switch Phase (Critical)

当所有模块都完成上述步骤后：

### 1. Database Connection Update

修改 `apps/admin/server/db/index.ts`:

```typescript
// Old
// import * as schema from "./schemas";
// New
import * as schema from "@01s-11comm/type/business"; // 或者是统一的出口
```

### 2. Drizzle Config Update

修改 `apps/admin/drizzle.config.ts`:

```typescript
export default defineConfig({
	// Old
	// schema: "./server/db/schemas/*.ts",
	// New
	schema: "../../apps/type/src/business/**/schema.ts",
	// ...
});
```

### 3. Drift Check

运行 `pnpm db:generate` 或 `drizzle-kit check`。

- **Success Criteria**: 输出 "No changes detected" 或生成的 migration 为空。
- **Failure Scenario**: 如果提示 Drop Table X, Create Table X，说明新旧 Schema 定义不一致（表名、字段属性差异）。
  - **Action**: 修改 `apps/type` 中的定义，使其与数据库现状完全匹配，直到 diff 为 0。

## Cleanup Phase

- `rm -rf apps/admin/server/db/schemas`
- 全局搜索项目中对旧路径的引用，替换为 `@01s-11comm/type`。
