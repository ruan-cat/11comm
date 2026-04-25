# 环境配置

> 本文档介绍 Nitro v3 的环境变量管理和运行时配置。

---

## 1. Nitro runtimeConfig

Nitro v3 使用 `runtimeConfig` 进行环境变量管理，支持自动绑定 `NITRO_*` 前缀的环境变量。

### 1.1. 基本配置

```typescript
// nitro.config.ts
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	runtimeConfig: {
		// 服务端变量 (仅服务端可访问)
		// 自动绑定: NITRO_DATABASE_URL -> databaseUrl
		databaseUrl: "postgresql://localhost/dev",
		apiSecret: "dev-secret-key",

		// 嵌套配置
		// 自动绑定: NITRO_OAUTH_CLIENT_ID -> oauth.clientId
		oauth: {
			clientId: "",
			clientSecret: "",
		},

		// 公开变量 (可在响应中返回给客户端)
		public: {
			apiBase: "http://localhost:3000",
			appVersion: "1.0.0",
		},
	},
});
```

### 1.2. 环境变量命名规则

| 配置路径             | 环境变量名                  |
| :------------------- | :-------------------------- |
| `databaseUrl`        | `NITRO_DATABASE_URL`        |
| `apiSecret`          | `NITRO_API_SECRET`          |
| `oauth.clientId`     | `NITRO_OAUTH_CLIENT_ID`     |
| `oauth.clientSecret` | `NITRO_OAUTH_CLIENT_SECRET` |
| `public.apiBase`     | `NITRO_PUBLIC_API_BASE`     |

---

## 2. 环境变量文件

### 2.1. 开发环境

```env
# .env (本地开发)
NITRO_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dev_db?sslmode=require
NITRO_API_SECRET=dev-secret-key-32-chars-minimum
```

### 2.2. 生产环境

```env
# .env.production
NITRO_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/prod_db?sslmode=require
NITRO_API_SECRET=production-secret-key-32-chars-min
NITRO_PUBLIC_API_BASE=https://api.your-domain.com
```

---

## 3. 在路由中使用配置

### 3.1. 基本用法

```typescript
// routes/api/config.get.ts
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export default defineHandler((event) => {
	const config = useRuntimeConfig(event);

	return {
		// ✅ 安全: 公开配置可以返回
		apiBase: config.public.apiBase,
		version: config.public.appVersion,

		// ✅ 内部使用: 服务端配置
		hasDatabase: !!config.databaseUrl,

		// ❌ 禁止: 永远不要返回密钥!
		// secret: config.apiSecret,
	};
});
```

### 3.2. 数据库连接示例

```typescript
// routes/api/repair/list.get.ts
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);

	// 使用配置中的数据库 URL
	const db = useDb(config.databaseUrl);

	const list = await db.select().from(repairOrders);

	return { success: true, data: list };
});
```

---

## 4. 类型安全验证

### 4.1. 使用 Zod 验证配置

```typescript
// lib/config/validate.ts
import { z } from "zod";

/** 环境配置 Schema */
const envSchema = z.object({
	databaseUrl: z
		.string()
		.url("DATABASE_URL 必须是有效的 URL")
		.refine((url) => url.startsWith("postgresql://"), "DATABASE_URL 必须是 PostgreSQL 连接字符串"),
	apiSecret: z.string().min(32, "API_SECRET 至少需要 32 个字符"),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 验证运行时配置
 * @example validateConfig(useRuntimeConfig(event))
 */
export function validateConfig(config: Record<string, unknown>): EnvConfig {
	const result = envSchema.safeParse(config);

	if (!result.success) {
		console.error("❌ 环境配置验证失败:");
		result.error.issues.forEach((issue) => {
			console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
		});
		throw new Error("环境配置验证失败，请检查 .env 文件");
	}

	return result.data;
}
```

### 4.2. 启动时验证

```typescript
// plugins/validate-config.ts
import { defineNitroPlugin } from "nitro/runtime";
import { validateConfig } from "@/config/validate";

export default defineNitroPlugin((nitroApp) => {
	// 应用启动时验证配置
	nitroApp.hooks.hook("ready", () => {
		const config = useRuntimeConfig();

		try {
			validateConfig(config);
			console.log("✅ 环境配置验证通过");
		} catch (error) {
			console.error("❌ 环境配置验证失败，服务启动中止");
			process.exit(1);
		}
	});
});
```

---

## 5. 配置最佳实践

### 5.1. ✅ 推荐做法

```typescript
// ✅ 使用 runtimeConfig 访问环境变量
const config = useRuntimeConfig(event);
const dbUrl = config.databaseUrl;

// ✅ 公开配置可以返回给客户端
return { apiBase: config.public.apiBase };

// ✅ 使用 Zod 验证配置
const validated = validateConfig(config);
```

### 5.2. ❌ 避免做法

```typescript
// ❌ 直接访问 process.env
const dbUrl = process.env.NITRO_DATABASE_URL;

// ❌ 返回服务端密钥
return { secret: config.apiSecret };

// ❌ 硬编码敏感信息
const dbUrl = "postgresql://user:password@host/db";
```

---

## 6. 多环境配置

### 6.1. 环境文件优先级

Nitro 按以下顺序加载环境文件 (后者覆盖前者):

1. `.env` - 基础配置
2. `.env.local` - 本地覆盖 (不提交到 Git)
3. `.env.[mode]` - 模式特定配置 (如 `.env.production`)
4. `.env.[mode].local` - 模式特定的本地覆盖

### 6.2. 配置示例

```env
# .env (基础配置，提交到 Git)
NITRO_PUBLIC_API_BASE=http://localhost:3000

# .env.local (本地覆盖，不提交)
NITRO_DATABASE_URL=postgresql://local-user:local-pass@localhost/local_db

# .env.production (生产配置，提交到 Git)
NITRO_PUBLIC_API_BASE=https://api.your-domain.com

# .env.production.local (生产密钥，不提交)
NITRO_DATABASE_URL=postgresql://prod-user:prod-pass@host/prod_db
```

### 6.3. .gitignore 配置

```gitignore
# 忽略本地环境文件
.env.local
.env.*.local
```

---

## 7. 下一步

环境配置完成后，继续阅读：

1. [03-neon-drizzle.md](./03-neon-drizzle.md) - 设置 Neon 数据库和 Drizzle ORM
