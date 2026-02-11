# Infrastructure Configuration Standard

由于 `apps/type` 从纯类型库转变为运行时同构库 (Isomorphic Library)，其基础设施配置至关重要。

## ADDED Requirements

### Requirement: apps/type Package 配置标准

`apps/type/package.json` MUST 将运行时依赖 (`drizzle-orm`, `zod`, `drizzle-zod`) 放入 `dependencies` 字段（非 `devDependencies`）。MUST 配置 `exports` 字段支持子路径导入。

#### Scenario: 依赖安装验证

- **WHEN** 检查 `apps/type/package.json` 时
- **THEN** `drizzle-orm`, `zod`, `drizzle-zod` MUST 在 `dependencies` 中
- **AND** `exports` 字段 MUST 包含 `"."` 和 `"./business"` 子路径

参考配置:

```json
{
	"name": "@01s-11comm/type",
	"exports": {
		".": {
			"import": "./src/index.ts",
			"require": "./src/index.ts",
			"types": "./src/index.ts"
		},
		"./business": "./src/business/index.ts",
		"./*": "./src/*.ts"
	},
	"dependencies": {
		"drizzle-orm": "^0.42.0",
		"drizzle-zod": "^0.8.0",
		"zod": "^3.24.0"
	}
}
```

### Requirement: apps/type TSConfig 配置标准

`apps/type/tsconfig.json` MUST 配置 `@/*` 路径别名指向 `src/*`，**但此别名仅用于独立的 `tsc --noEmit` 类型检查**。

> **⚠ CRITICAL**: 源码文件中 MUST NOT 使用 `@/` 路径别名导入。MUST 使用相对路径。
>
> 原因：`apps/type` 作为 workspace 依赖被 `apps/admin` 消费时，Vite 构建工具使用的是消费端（admin）的路径别名配置，`@/` 会被错误解析为 `apps/admin/src/` 而非 `apps/type/src/`，导致构建失败。

#### Scenario: 路径别名验证

- **WHEN** 独立运行 `pnpm -F @01s-11comm/type typecheck` 时
- **THEN** TypeScript 编译器 MUST 能正确解析 `@/` 路径别名
- **BUT** 源码中 MUST NOT 使用 `@/` 路径别名，MUST 使用相对路径

#### Scenario: 源码导入路径验证

- **WHEN** 在 `apps/type/src` 下的任何 `.ts` 文件中编写导入语句时
- **THEN** MUST 使用相对路径（如 `../../common`、`../helpers`）
- **AND** MUST NOT 使用 `@/common`、`@/business` 等路径别名
- **AND** 此约束确保 type 包在被其他 workspace 项目消费时不会出现路径解析错误

参考配置:

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"baseUrl": ".",
		"paths": {
			"@/*": ["src/*"]
		},
		"allowImportingTsExtensions": true,
		"noEmit": true
	},
	"include": ["src/**/*.ts"]
}
```

### Requirement: apps/admin Drizzle 配置切换标准

`apps/admin/drizzle.config.ts` MUST 在 Phase 4 (Switch) 阶段修改 schema 扫描路径。MUST NOT 提前修改。

#### Scenario: 配置切换

- **WHEN** 所有模块完成影子迁移后
- **THEN** 修改 `schema` 字段指向 `../../apps/type/src/business/**/schema.ts`
- **AND** 运行 `drizzle-kit check` 验证无 drift

参考配置:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "../../apps/type/src/business/**/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

### Requirement: 环境验证标准

在执行迁移命令前 MUST 验证环境完整性。

#### Scenario: 环境检查

- **WHEN** 准备执行迁移或类型检查时
- **THEN** MUST 确保 `pnpm install` 已执行且无错误
- **AND** MUST 确保 `.env` 中 `DATABASE_URL` 有效
- **AND** MUST 运行 `pnpm -F @01s-11comm/type typecheck` 验证类型正确
