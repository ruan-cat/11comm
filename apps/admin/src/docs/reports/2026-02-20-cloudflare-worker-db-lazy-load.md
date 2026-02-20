# 2026-02-20 Cloudflare Worker 数据库连接懒加载改造报告

## 背景

### 问题描述

在 Cloudflare Worker 生产环境中，Nitro 接口无法连接 Neon 数据库，所有接口都失败。

### 根本原因分析

通过代码分析和 Nitro 文档，发现问题根源：

1. **当前代码**：`apps/admin/server/db/index.ts` 在**模块顶层**同步调用 `neon(getDatabaseUrl())`

2. **Cloudflare Worker 环境限制**：
   - 环境变量（`process.env`）**只在请求处理函数的生命周期内可用**
   - 在模块顶层、全局作用域访问环境变量会得到 `undefined`
   - 这与 Node.js 环境完全不同

3. **关键文档说明**：

   > Note that accessing environment variables in global scope will be undefined on Cloudflare.
   > (在 Cloudflare 全局作用域访问环境变量会是 undefined)

4. **当前 `vercel-env.ts` 的问题**：
   - 使用 `@dotenvx/dotenvx` 加载 `.env` 文件
   - 在模块顶层调用 `config({ path: ... })`
   - 这在 Cloudflare Worker 构建时执行，但此时 Vercel 的环境变量尚未注入

### 解决方案概述

将数据库连接改为**懒加载**模式，在请求处理时动态初始化数据库连接，而不是在模块顶层初始化。

---

## 实施内容

### 步骤 1：修改 `nitro.config.ts` - 已完成

在 `nitro.config.ts` 中添加运行时配置：

```typescript
runtimeConfig: {
  // 数据库连接 URL - Nitro 会自动从 NITRO_DATABASE_URL 或 DATABASE_URL 环境变量读取
  databaseUrl: process.env.DATABASE_URL || "",
}
```

### 步骤 2：创建 Nitro 插件 `server/plugins/db-init.ts` - 已完成

创建懒加载数据库连接插件框架。

### 步骤 3：修改 `server/db/index.ts` - 已完成

将数据库连接改为使用事件上下文，并使用 `getVercelEnvRequired` 获取带 Vercel 前缀的环境变量：

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "h3";
import { getVercelEnvRequired } from "server/utils/vercel-env";
import * as schema from "./schema";

export function useDb(event: H3Event) {
	// 如果事件上下文中已有数据库实例，直接返回（单例模式）
	if (event.context.db) {
		return event.context.db;
	}

	// 从环境变量获取数据库 URL（使用 Vercel 前缀）
	// getVercelEnvRequired 会自动添加 comm_admin_11__ 前缀
	const envDatabaseUrl = getVercelEnvRequired("DATABASE_URL");

	// 创建新的数据库连接并缓存到事件上下文中
	const envSql = neon(envDatabaseUrl);
	const envDbInstance = drizzle(envSql, { schema });
	event.context.db = envDbInstance;

	return envDbInstance;
}
```

### 步骤 4-5：更新所有 API 路由 - 进行中

将所有使用 `import { db } from "server/db"` 的路由改为使用 `useDb(event)`。

**需要修改的文件数量**：140 个

**修改模式**：

```typescript
// 修改前
import { db } from "server/db";
const result = await db.select().from(table);

// 修改后
import { useDb } from "server/db";
const db = useDb(event);
const result = await db.select().from(table);
```

---

## 团队分工

### 团队结构

1. **主代理**：协调任务、收集结果
2. **子代理 1-4**：并行更新 API 路由文件
3. **子代理 5**：校验和验证

### 子代理任务划分

- **子代理 1**：dev-team, setting-manage/system-manage, operation-team 目录
- **子代理 2**：property-manage/expense-manage, property-manage/report-manage 目录
- **子代理 3**：property-manage/community-manage, property-manage/contract-manage, property-manage/house-property-manage 目录
- **子代理 4**：property-manage/patrol-manage, property-manage/repairs-manage, property-manage/parking-manage 目录
- **子代理 5**：校验所有修改是否正确

---

## 验证方法

1. **本地开发测试**：运行 `pnpm dev` 确保开发环境正常工作
2. **构建测试**：运行 `pnpm build` 确保 Cloudflare Worker 构建成功
3. **生产环境验证**：部署到 Vercel 后，测试 API 接口是否返回正确数据

---

## 关键文件清单

| 文件路径                                    | 操作 | 状态      |
| ------------------------------------------- | ---- | --------- |
| apps/admin/nitro.config.ts                  | 修改 | ✅ 已完成 |
| apps/admin/server/plugins/db-init.ts        | 新建 | ✅ 已完成 |
| apps/admin/server/db/index.ts               | 修改 | ✅ 已完成 |
| apps/admin/server/api/\*_/_.ts (140 个文件) | 修改 | 🔄 进行中 |
