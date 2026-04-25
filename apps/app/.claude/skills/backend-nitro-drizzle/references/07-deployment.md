# 部署指南

> 本文档介绍如何将 Nitro 后端部署到各种平台。

---

## 1. 部署概述

Nitro 支持多种部署目标，可以零配置部署到大多数主流平台。

| 平台                   | 类型       |  免费层   | 推荐程度 |
| :--------------------- | :--------- | :-------: | :------: |
| **Vercel**             | Serverless |    ✅     |  ⭐⭐⭐  |
| **Railway**            | Container  | ✅ (有限) |  ⭐⭐⭐  |
| **Render**             | Container  |    ✅     |   ⭐⭐   |
| **Cloudflare Workers** | Edge       |    ✅     |   ⭐⭐   |
| **Node.js Server**     | 传统服务器 |     -     |   ⭐⭐   |

---

## 2. 部署到 Vercel

### 2.1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2.2. 配置 Nitro

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	// Vercel 自动检测，通常不需要显式配置
	// preset: "vercel",

	runtimeConfig: {
		databaseUrl: "",
	},
});
```

### 2.3. 部署

```bash
# 首次部署 (会创建项目)
vercel

# 生产环境部署
vercel --prod
```

### 2.4. 配置环境变量

在 Vercel 仪表板中配置：

1. 进入项目设置 → Environment Variables
2. 添加 `NITRO_DATABASE_URL` 变量
3. 选择适用的环境 (Production, Preview, Development)

或使用 CLI：

```bash
vercel env add NITRO_DATABASE_URL production
```

---

## 3. 部署到 Railway

### 3.1. 创建项目

1. 访问 [Railway](https://railway.app/)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择后端仓库

### 3.2. 配置 Nitro

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	preset: "node-server",

	runtimeConfig: {
		databaseUrl: "",
	},
});
```

### 3.3. 配置 package.json

```json
{
	"scripts": {
		"build": "nitro build",
		"start": "node .output/server/index.mjs"
	}
}
```

### 3.4. 配置环境变量

在 Railway 仪表板中：

1. 进入项目 → Variables
2. 添加 `NITRO_DATABASE_URL`
3. 添加 `PORT` (Railway 会自动设置)

### 3.5. 配置域名

Railway 会自动分配域名，也可以配置自定义域名。

---

## 4. 部署到 Render

### 4.1. 创建 Web Service

1. 访问 [Render](https://render.com/)
2. 点击 "New" → "Web Service"
3. 连接 GitHub 仓库
4. 配置构建命令

### 4.2. 构建配置

| 配置项        | 值                              |
| :------------ | :------------------------------ |
| Build Command | `pnpm install && pnpm build`    |
| Start Command | `node .output/server/index.mjs` |
| Node Version  | `22`                            |

### 4.3. 配置 Nitro

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	preset: "node-server",
});
```

### 4.4. 环境变量

在 Render 仪表板的 Environment 中添加：

- `NITRO_DATABASE_URL`: Neon 连接字符串
- `NODE_ENV`: `production`

---

## 5. 部署到 Cloudflare Workers

### 5.1. 安装 Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 5.2. 配置 Nitro

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	preset: "cloudflare-pages",

	runtimeConfig: {
		databaseUrl: "",
	},
});
```

### 5.3. 创建 wrangler.toml

```toml
name = "smart-community-api"
compatibility_date = "2024-01-01"

[vars]
NODE_ENV = "production"
```

### 5.4. 部署

```bash
pnpm build
wrangler pages deploy .output/public
```

### 5.5. 配置 Secrets

```bash
wrangler secret put NITRO_DATABASE_URL
# 输入 Neon 连接字符串
```

---

## 6. 传统 Node.js 服务器

### 6.1. 构建

```bash
pnpm build
```

### 6.2. 输出结构

```plain
.output/
├── server/
│   ├── index.mjs          # 入口文件
│   ├── chunks/            # 代码块
│   └── node_modules/      # 依赖
└── public/                # 静态文件
```

### 6.3. 启动服务

```bash
# 直接运行
node .output/server/index.mjs

# 使用 PM2 (推荐生产环境)
pm2 start .output/server/index.mjs --name "smart-community-api"
```

### 6.4. PM2 配置文件

```javascript
// ecosystem.config.cjs
module.exports = {
	apps: [
		{
			name: "smart-community-api",
			script: ".output/server/index.mjs",
			instances: "max",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production",
				NITRO_DATABASE_URL: "postgresql://...",
			},
		},
	],
};
```

### 6.5. 使用 Docker

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.output .output

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

```bash
# 构建镜像
docker build -t smart-community-api .

# 运行容器
docker run -p 3000:3000 \
  -e NITRO_DATABASE_URL="postgresql://..." \
  smart-community-api
```

---

## 7. 生产环境检查清单

### 7.1. 环境变量

- [ ] `NITRO_DATABASE_URL` 已配置
- [ ] 使用生产环境的 Neon 数据库
- [ ] 敏感信息不在代码中硬编码

### 7.2. 数据库

- [ ] 已执行数据库迁移 (`pnpm db:migrate`)
- [ ] 使用 Pooled connection 字符串
- [ ] 配置了适当的连接池大小

### 7.3. 安全

- [ ] CORS 配置了正确的前端域名
- [ ] 不暴露敏感的环境变量
- [ ] 生产环境禁用了调试日志

### 7.4. 性能

- [ ] 启用了 gzip 压缩
- [ ] 配置了适当的缓存策略
- [ ] 监控了 API 响应时间

---

## 8. 前端部署配置

### 8.1. 更新前端环境变量

```env
# env/.env.production (uni-app 前端)
VITE_API_BASE_URL=https://api.your-domain.com
```

### 8.2. 构建和部署

```bash
# 构建 H5
pnpm build:h5

# 构建微信小程序
pnpm build:mp-weixin
```

### 8.3. 部署到 CDN/静态托管

- **Vercel**: 直接连接 GitHub 仓库
- **Netlify**: 拖拽 `dist/build/h5` 目录
- **GitHub Pages**: 使用 GitHub Actions

---

## 9. 监控和日志

### 9.1. 添加健康检查端点

```typescript
// routes/api/health.get.ts
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { sql } from "drizzle-orm";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	// 检查数据库连接
	let dbStatus = "ok";
	try {
		await db.execute(sql`SELECT 1`);
	} catch {
		dbStatus = "error";
	}

	return {
		success: true,
		data: {
			status: dbStatus === "ok" ? "healthy" : "unhealthy",
			timestamp: Date.now(),
			database: dbStatus,
			environment: process.env.NODE_ENV,
		},
	};
});
```

### 9.2. 日志配置

```typescript
// middleware/log.ts
import { defineEventHandler } from "nitro/h3";

export default defineEventHandler((event) => {
	const start = Date.now();

	// 响应后记录日志
	event.node.res.on("finish", () => {
		const duration = Date.now() - start;
		console.log(`[${new Date().toISOString()}] ${event.method} ${event.path} - ${duration}ms`);
	});
});
```

---

## 10. 常见问题

### 10.1. 数据库连接超时

**问题**: 生产环境数据库连接超时

**解决**:

1. 确保使用 Pooled connection 字符串
2. 检查 Neon 项目的地区设置
3. 增加连接超时时间

### 10.2. CORS 错误

**问题**: 前端请求被 CORS 阻止

**解决**:

```typescript
// nitro.config.ts
routeRules: {
  "/api/**": {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "https://your-frontend-domain.com",
    },
  },
},
```

### 10.3. 环境变量未生效

**问题**: 部署后环境变量不生效

**解决**:

1. 确保变量名以 `NITRO_` 开头
2. 重新部署应用
3. 检查平台的环境变量配置

---

## 11. 完成！

恭喜！你已经完成了 Nitro + Neon + Drizzle 后端的学习。

### 11.1. 学习总结

- ✅ Nitro v3 项目初始化
- ✅ 环境变量配置
- ✅ Neon Postgres + Drizzle ORM 设置
- ✅ Drizzle CRUD 操作
- ✅ Nitro 文件路由
- ✅ uni-app 前后端集成
- ✅ 部署到生产环境

### 11.2. 下一步建议

1. **实践**: 将维修工单模块迁移到真实后端
2. **扩展**: 添加更多业务模块 (公告、投诉等)
3. **优化**: 添加缓存、日志、监控
4. **学习**: 探索 Drizzle 的关系查询、事务等高级功能
