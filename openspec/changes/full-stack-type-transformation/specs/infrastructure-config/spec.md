# Infrastructure Configuration Standard

由于 `apps/type` 从纯类型库转变为运行时同构库 (Isomorphic Library)，其基础设施配置至关重要。

## 1. Package.json Configuration

`apps/type/package.json` 必须包含以下关键字段：

### Dependencies

必须将运行时依赖移入 `dependencies`。

```json
{
	"name": "@01s-11comm/type",
	"version": "0.0.1",
	"private": true,
	"type": "module",
	"main": "src/index.ts",
	"module": "src/index.ts",
	"exports": {
		".": {
			"import": "./src/index.ts",
			"require": "./src/index.ts",
			"types": "./src/index.ts"
		},
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

_注意版本号应与 workspace 保持一致。_

## 2. TSConfig Configuration

`apps/type/tsconfig.json` 必须支持被其他项目引用 (Composite Project) 并输出 ESM 兼容代码。

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"jsx": "preserve",
		"sourceMap": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"esModuleInterop": true,
		"lib": ["ESNext", "DOM"],
		"skipLibCheck": true,
		"composite": true,
		"declaration": true,
		"declarationMap": true,
		"rootDir": "src",
		// 关键：允许导入 .ts 扩展名 (如果项目风格如此)
		"allowImportingTsExtensions": true,
		"noEmit": true // 由 Vite/Bundler 处理构建，但在 monorepo 开发模式下 TS 只负责检查
	},
	"include": ["src"]
}
```

## 3. Bundling Strategy (Buildless for Dev)

在 Monorepo 开发模式下，我们依赖 Vite (apps/admin) 直接解析 `apps/type` 的 `.ts` 源码。

- **不构建**: 不需要运行 `tsc` 或 `vite build` 来生成 `dist` 目录供 `admin` 使用。
- **Source Dependency**: `admin` 的依赖解析会通过 workspace link 直接指向 `apps/type/src/index.ts`。

所以，`tasks.md` 中的 "Build Check" 主要是指 "Type Check" (`tsc --noEmit`)。
