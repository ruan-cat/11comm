# Infrastructure Configuration Standard

由于 `apps/type` 从纯类型库转变为运行时同构库 (Isomorphic Library)，其基础设施配置至关重要。

## 1. apps/type Package Configuration

`apps/type/package.json` 必须包含以下关键字段：

### Dependencies

必须将运行时依赖移入 `dependencies`，因为这些代码将在前端和后端运行时被执行。

```json
{
	"name": "@01s-11comm/type",
	"version": "0.0.1",
	// ...
	"main": "src/index.ts",
	"module": "src/index.ts",
	"exports": {
		".": {
			"import": "./src/index.ts",
			"require": "./src/index.ts",
			"types": "./src/index.ts"
		},
		"./business": "./src/business/index.ts", // 方便按需引用
		"./*": "./src/*.ts"
	},
	"dependencies": {
		"drizzle-orm": "^0.39.1",
		"drizzle-zod": "^0.7.0",
		"zod": "^3.24.1"
	},
	"devDependencies": {
		"typescript": "^5.7.3"
	}
}
```

## 2. apps/type TSConfig Configuration

`apps/type/tsconfig.json` 必须支持被外部引用。

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"jsx": "preserve",
		"composite": true, // 允许被引用
		"declaration": true,
		"declarationMap": true,
		"rootDir": "src",
		"allowImportingTsExtensions": true,
		"noEmit": true // 由使用者负责编译
	},
	"include": ["src"]
}
```

## 3. apps/admin Drizzle Configuration (Critical)

为了支持影子迁移后的切换，`apps/admin/drizzle.config.ts` 需要修改 schema 扫描路径。

此配置应在 **Phase 4: Switch** 阶段才进行修改，不要提前修改。

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	// 旧配置（迁移前）
	// schema: "./server/db/schemas/*.ts",

	// 新配置（迁移后）
	// 指向 apps/type 的源码目录
	// 注意这里使用了 glob pattern 匹配所有业务目录下的 schema.ts
	schema: "../../apps/type/src/business/**/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

## 4. Environment Validation

在执行任何迁移命令前，必须验证环境：

1.  **Node Environment**: 确保 `apps/type` 目录下没有 `node_modules` 混乱，必要时运行 `pnpm install`。
2.  **Database Connection**: 确保 `.env` 中的 `DATABASE_URL` 有效，以便运行 `drizzle-kit check`。
