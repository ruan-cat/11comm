# Nitro v3 项目初始化

> 本文档指导如何创建和配置 Nitro v3 后端项目。

---

## 1. 创建项目

### 1.1. 初始化目录

```bash
# 创建后端项目目录 (与 uni-app 前端分离)
mkdir smart-community-backend
cd smart-community-backend

# 初始化 pnpm 项目
pnpm init
```

### 1.2. 安装依赖

```bash
# Nitro v3 核心
pnpm add nitro@^3

# 数据库相关
pnpm add drizzle-orm @neondatabase/serverless

# 工具库
pnpm add zod

# 开发依赖
pnpm add -D drizzle-kit @types/node typescript
```

---

## 2. 项目结构

```plain
smart-community-backend/
├── routes/                       # API 路由目录 (自动注册)
│   └── api/
│       ├── health.get.ts         # GET /api/health
│       ├── repair/
│       │   ├── list.get.ts       # GET /api/repair/list
│       │   ├── create.post.ts    # POST /api/repair/create
│       │   ├── [id].get.ts       # GET /api/repair/:id
│       │   └── [id].put.ts       # PUT /api/repair/:id
│       └── notice/
│           ├── list.get.ts
│           └── [id].get.ts
├── lib/                          # 库代码
│   ├── db/
│   │   ├── client.ts             # Drizzle 客户端
│   │   ├── schema/               # 数据库模式
│   │   │   ├── repair.ts
│   │   │   ├── notice.ts
│   │   │   └── index.ts
│   │   └── migrations/           # 迁移文件 (自动生成)
│   └── utils/
│       ├── assert.ts             # 断言工具
│       └── response.ts           # 响应格式化
├── middleware/                   # 中间件
│   └── error.ts                  # 错误处理中间件
├── nitro.config.ts               # Nitro 配置
├── drizzle.config.ts             # Drizzle 配置
├── tsconfig.json                 # TypeScript 配置
├── .env                          # 环境变量 (本地开发)
├── .env.production               # 生产环境变量
└── package.json
```

---

## 3. 配置文件

### 3.1. nitro.config.ts

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	// 启用实验性数据库功能
	experimental: {
		database: true,
	},

	// 运行时配置
	// 环境变量自动绑定: NITRO_DATABASE_URL -> databaseUrl
	runtimeConfig: {
		databaseUrl: "", // 绑定 NITRO_DATABASE_URL

		public: {
			apiBase: "http://localhost:3000",
		},
	},

	// 开发服务器
	devServer: {
		port: 3000,
	},

	// 路由规则
	routeRules: {
		// 所有 API 路由启用 CORS
		"/api/**": {
			cors: true,
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000", // uni-app H5
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	},

	// 路径别名
	alias: {
		"~": "./",
		"@": "./lib",
	},
});
```

### 3.2. tsconfig.json

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"resolveJsonModule": true,
		"declaration": true,
		"outDir": "./dist",
		"baseUrl": ".",
		"paths": {
			"~/*": ["./*"],
			"@/*": ["./lib/*"]
		}
	},
	"include": ["**/*.ts"],
	"exclude": ["node_modules", "dist"]
}
```

### 3.3. package.json 脚本

```json
{
	"name": "smart-community-backend",
	"type": "module",
	"scripts": {
		"dev": "nitro dev",
		"build": "nitro build",
		"preview": "nitro preview",
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:push": "drizzle-kit push",
		"db:studio": "drizzle-kit studio"
	}
}
```

---

## 4. 工具函数

### 4.1. 断言函数

```typescript
// lib/utils/assert.ts
const prefix = "Assertion failed";

/**
 * TypeScript 断言函数，当条件为真时收窄类型
 * @example assert(user, "User must exist")
 */
export default function assert(condition: unknown, message?: string | (() => string)): asserts condition {
	if (condition) return;

	const provided = typeof message === "function" ? message() : message;
	const value = provided ? `${prefix}: ${provided}` : prefix;
	throw new Error(value);
}
```

### 4.2. 响应格式化

```typescript
// lib/utils/response.ts

/** 成功响应 */
export function success<T>(data: T, message = "操作成功") {
	return {
		success: true,
		message,
		data,
		timestamp: Date.now(),
	};
}

/** 分页响应 */
export function paginated<T>(data: T[], pagination: { page: number; pageSize: number; total: number }) {
	return {
		success: true,
		data,
		pagination: {
			...pagination,
			totalPages: Math.ceil(pagination.total / pagination.pageSize),
		},
		timestamp: Date.now(),
	};
}

/** 错误响应 */
export function error(message: string, code = 500) {
	return {
		success: false,
		message,
		code,
		timestamp: Date.now(),
	};
}
```

---

## 5. 错误处理中间件

```typescript
// middleware/error.ts
import { defineEventHandler, createError, H3Error } from "nitro/h3";
import { ZodError } from "zod";

export default defineEventHandler((event) => {
	// 这是一个前置中间件，用于捕获后续路由的错误
	// 实际的错误处理在 nitro.config.ts 的 errorHandler 中配置
});

/**
 * 统一错误处理函数
 * 在路由中使用: throw formatError(error)
 */
export function formatError(err: unknown): H3Error {
	// Zod 验证错误
	if (err instanceof ZodError) {
		const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
		return createError({
			statusCode: 400,
			message: `参数验证失败: ${messages.join("; ")}`,
		});
	}

	// 已知的 H3 错误
	if (err instanceof H3Error) {
		return err;
	}

	// 未知错误
	if (err instanceof Error) {
		return createError({
			statusCode: 500,
			message: err.message,
		});
	}

	return createError({
		statusCode: 500,
		message: "未知错误",
	});
}
```

---

## 6. 第一个 API 路由

### 6.1. 健康检查

```typescript
// routes/api/health.get.ts
import { defineHandler } from "nitro/h3";
import { success } from "@/utils/response";

export default defineHandler(() => {
	return success({
		status: "ok",
		version: "1.0.0",
		environment: process.env.NODE_ENV || "development",
	});
});
```

### 6.2. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 输出:
# Nitro server running on http://localhost:3000
```

### 6.3. 测试 API

```bash
# 使用 curl 测试
curl http://localhost:3000/api/health

# 预期响应:
# {
#   "success": true,
#   "message": "操作成功",
#   "data": {
#     "status": "ok",
#     "version": "1.0.0",
#     "environment": "development"
#   },
#   "timestamp": 1705708800000
# }
```

---

## 7. 下一步

项目初始化完成后，继续阅读：

1. [02-env-config.md](./02-env-config.md) - 配置环境变量
2. [03-neon-drizzle.md](./03-neon-drizzle.md) - 设置 Neon 数据库和 Drizzle ORM
