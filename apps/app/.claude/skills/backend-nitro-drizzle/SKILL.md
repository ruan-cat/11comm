---
name: backend-nitro-drizzle
description: Nitro v3 + Neon + Drizzle 后端开发技能。指导如何使用 Nitro v3 构建独立后端服务，配合 Neon Postgres 和 Drizzle ORM 实现类型安全的数据库操作。适用于智慧社区物业管理系统后端开发。
---

# Nitro v3 + Neon + Drizzle 后端开发技能

> 本技能文档指导如何使用 Nitro v3 构建独立后端服务，配合 Neon Postgres 和 Drizzle ORM 实现类型安全的数据库操作。
>
> 适用于：智慧社区物业管理系统后端开发

---

## 1. 概述

### 1.1. 技术栈

|      技术       |  版本  | 用途                           |
| :-------------: | :----: | :----------------------------- |
|    **Nitro**    |  v3.x  | 服务端框架，文件路由，API 服务 |
|    **Neon**     |   -    | Serverless Postgres 数据库     |
| **Drizzle ORM** | v0.30+ | 类型安全的 ORM                 |
|     **Zod**     |  v3.x  | 运行时类型验证                 |
| **TypeScript**  |  v5.x  | 类型系统                       |

### 1.2. 为什么选择这个技术栈？

1. **Nitro v3**：
   - 文件系统路由（与 uni-app 约定式路由风格一致）
   - 原生 Vite 支持，开发体验优秀
   - 零配置多平台部署（Vercel, Netlify, Cloudflare, Node.js）
   - 内置 HMR 热重载

2. **Neon Postgres**：
   - Serverless，按需付费
   - 免费层足够开发和学习
   - 与 Drizzle ORM 完美集成

3. **Drizzle ORM**：
   - 类型安全，TypeScript 优先
   - 轻量级，性能优秀
   - API 接近原生 SQL，学习成本低

### 1.3. 项目架构

```plain
前端 (uni-app)                    后端 (Nitro)
┌─────────────────┐              ┌─────────────────┐
│  H5 / 小程序 / APP │  ──HTTP──▶  │  Nitro API Server │
└─────────────────┘              └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │  Neon Postgres   │
                                 └─────────────────┘
```

---

## 2. 文档目录

| 序号 | 文档                                                                       | 内容                           |
| :--: | :------------------------------------------------------------------------- | :----------------------------- |
|  1   | [references/01-nitro-setup.md](references/01-nitro-setup.md)               | Nitro v3 项目初始化和配置      |
|  2   | [references/02-env-config.md](references/02-env-config.md)                 | 环境变量和运行时配置           |
|  3   | [references/03-neon-drizzle.md](references/03-neon-drizzle.md)             | Neon 数据库 + Drizzle ORM 设置 |
|  4   | [references/04-drizzle-operations.md](references/04-drizzle-operations.md) | Drizzle CRUD 数据库操作        |
|  5   | [references/05-nitro-routes.md](references/05-nitro-routes.md)             | Nitro 文件路由系统             |
|  6   | [references/06-integration.md](references/06-integration.md)               | uni-app 前后端集成             |
|  7   | [references/07-deployment.md](references/07-deployment.md)                 | 部署指南                       |

---

## 3. 快速开始

### 3.1. 创建后端项目

```bash
# 创建项目目录
mkdir smart-community-backend
cd smart-community-backend

# 初始化 pnpm 项目
pnpm init

# 安装依赖
pnpm add nitro@^3
pnpm add drizzle-orm @neondatabase/serverless zod
pnpm add -D drizzle-kit @types/node typescript
```

### 3.2. 创建配置文件

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	experimental: {
		database: true,
	},
	runtimeConfig: {
		databaseUrl: "",
	},
	devServer: {
		port: 3000,
	},
	routeRules: {
		"/api/**": {
			cors: true,
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			},
		},
	},
});
```

### 3.3. 创建第一个 API

```typescript
// routes/api/health.get.ts
import { defineHandler } from "nitro/h3";

export default defineHandler(() => {
	return {
		success: true,
		message: "API is running",
		timestamp: Date.now(),
	};
});
```

### 3.4. 启动开发服务器

```bash
pnpm nitro dev
```

访问 http://localhost:3000/api/health 验证 API 是否正常。

---

## 4. 技能触发条件

当遇到以下任务时，应使用本技能文档：

- 需要创建后端 API 接口
- 需要设计数据库表结构
- 需要实现数据持久化
- 需要将 Mock 数据迁移到真实数据库
- 需要部署后端服务

---

## 5. 与其他技能的协同

| 协同技能               | 场景                        |
| :--------------------- | :-------------------------- |
| `api-migration`        | 前端 Alova 请求对接后端 API |
| `api-error-handling`   | 统一错误处理和响应格式      |
| `z-paging-integration` | 分页接口实现                |

---

## 6. 参考资源

- [Nitro v3 官方文档](https://v3.nitro.build)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Neon Postgres 文档](https://neon.tech/docs)
- [db0 数据库连接器](https://db0.unjs.io)

---

## 7. 示例代码

完整示例代码位于 `examples/` 目录：

- `examples/repair-order/` - 维修工单模块完整示例
- `examples/notice/` - 公告模块完整示例
