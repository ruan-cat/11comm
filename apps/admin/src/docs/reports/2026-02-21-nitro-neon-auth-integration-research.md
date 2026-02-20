# 2026-02-21 Nitro + Neon Auth 深度集成方案调研报告

## 一、Neon Auth 与 Nitro 的集成方式

### 1.1 Neon Auth 概述

Neon Auth 是基于 **Better Auth** 构建的托管认证服务，具有以下核心特性：

- **身份数据存储在数据库中**：所有认证数据存储在 `neon_auth` schema，可用 SQL 查询，支持 RLS 策略
- **零服务器管理**：作为托管 REST API 服务运行，无需维护基础设施
- **分支感知认证**：每个 Neon 分支都有独立的隔离认证环境，支持在预览环境中测试完整认证流程
- **内置 Data API 集成**：JWT Token 验证对 Neon Data API 有原生支持

### 1.2 官方支持的集成方式

Neon Auth 官方提供以下 SDK：

| SDK 类型   | 用途           | 包名                             |
| ---------- | -------------- | -------------------------------- |
| Server SDK | Next.js 服务端 | `@neondatabase/auth/next/server` |
| Client SDK | 浏览器端       | `@neondatabase/auth/next`        |
| Client SDK | React/Vite     | `@neondatabase/neon-js/auth`     |

**重要提示**：Neon Auth 当前仅支持 **AWS 区域**，Azure 支持尚未可用。

### 1.3 Nitro 集成方案

Nitro 没有官方 Neon Auth SDK，但可以通过以下方式集成：

1. **使用 Neon Server SDK**：在 Nitro 插件或中间件中调用 Neon Auth API
2. **JWT 验证中间件**：通过验证 Neon Auth 签发的 JWT 来实现认证
3. **自定义 API 路由**：在 Nitro 中创建认证代理路由

### 1.4 环境变量配置

```bash
# Neon Auth 配置（必需）
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long

# 生成 secure cookie secret
openssl rand -base64 32
```

### 1.5 Cookie 和 Session 处理方式

Neon Auth 默认使用 **安全的 HTTP-only cookies** 进行基于会话的认证：

- 会话 cookie 自动管理
- 支持自定义 cookie 配置
- 推荐使用默认的会话 cookie 机制，而非 JWT（除非有特殊需求）

---

## 二、JWT 验证细节

### 2.1 JWT 格式和 Claims

Neon Auth 签发的 JWT payload 示例：

```json
{
	"iat": 1766320685,
	"name": "User Name",
	"email": "user@email.com",
	"emailVerified": false,
	"image": null,
	"createdAt": "2025-12-20T11:04:41.437Z",
	"updatedAt": "2025-12-20T11:04:41.437Z",
	"role": "authenticated",
	"banned": false,
	"banReason": null,
	"banExpires": null,
	"id": "860dc360-609f-4b7d-9e70-ec93fe6414d3",
	"sub": "860dc360-609f-4b7d-9e70-ec93fe6414d3",
	"exp": 1766321585,
	"iss": "<YOUR_NEON_AUTH_URL_ORIGIN>",
	"aud": "<YOUR_NEON_AUTH_URL_ORIGIN>"
}
```

### 2.2 获取 JWT Token 的方式

**方式一：使用 SDK 方法**

```typescript
import { authClient } from "./auth";

export async function getJwtToken() {
	const { data, error } = await authClient.token();
	if (error) throw error;
	return data.token;
}
```

**方式二：使用 session header**

```typescript
await authClient.getSession({
	fetchOptions: {
		onSuccess: (ctx) => {
			const jwt = ctx.response.headers.get("set-auth-jwt");
			console.log("JWT:", jwt);
		},
	},
});
```

### 2.3 JWT 验证逻辑

#### JWKS 端点

```plain
<YOUR_NEON_AUTH_URL>/.well-known/jwks.json
```

#### 验证示例（Node.js + jose）

```typescript
import { jwtVerify, createRemoteJWKSet } from "jose";

const NEON_JWKS_URL = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(NEON_JWKS_URL));

export async function validateNeonToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: new URL(process.env.NEON_AUTH_BASE_URL!).origin,
		});
		return payload;
	} catch (error) {
		console.error("Token validation failed:", error);
		return null;
	}
}
```

### 2.4 Token 刷新机制

- **访问令牌有效期**：**15 分钟**
- **刷新方式**：使用 `authClient.token()` 获取新令牌

### 2.5 重要限制

| 限制项        | 说明                |
| ------------- | ------------------- |
| 签名算法      | EdDSA (Ed25519)     |
| 有效期        | 15 分钟（访问令牌） |
| 自定义 Claims | 暂不支持            |

---

## 三、实际集成代码示例

### 3.1 Nitro 中间件验证 Neon Auth Token

```typescript
// server/plugins/auth.ts
import { jwtVerify, createRemoteJWKSet } from "jose";
import { defineNitroPlugin } from "nitropack";

const NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL!;
const JWKS = createRemoteJWKSet(new URL(`${NEON_AUTH_BASE_URL}/.well-known/jwks.json`));

async function validateToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: new URL(NEON_AUTH_BASE_URL).origin,
			algorithms: ["EdDSA"],
		});
		return payload;
	} catch {
		return null;
	}
}

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("beforeRequest", async (event) => {
		// 排除公开路由
		const publicPaths = ["/api/auth", "/api/public"];
		if (publicPaths.some((p) => event.path.startsWith(p))) {
			return;
		}

		const authHeader = getHeader(event, "authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			// 未认证，重定向或返回 401
			setResponseStatus(event, 401);
			return send(event, JSON.stringify({ error: "Unauthorized" }));
		}

		const token = authHeader.slice(7);
		const payload = await validateToken(token);

		if (!payload) {
			setResponseStatus(event, 401);
			return send(event, JSON.stringify({ error: "Invalid token" }));
		}

		// 将用户信息注入到 event 上下文
		event.context.user = payload;
	});
});
```

### 3.2 用户信息传递到业务代码

```typescript
// server/api/protected-data.get.ts
export default defineEventHandler((event) => {
	const user = event.context.user;

	if (!user) {
		throw createError({
			statusCode: 401,
			message: "Unauthorized",
		});
	}

	return {
		message: "Protected data",
		user: {
			id: user.sub,
			email: user.email,
			name: user.name,
		},
	};
});
```

### 3.3 环境变量配置示例

```bash
# .env
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-32-character-minimum-secret-key
```

---

## 四、Cloudflare Worker 兼容性

### 4.1 Neon Auth 在 Cloudflare Worker 中的支持状态

**Neon Auth 不直接在 Cloudflare Worker 中运行**，但可以通过以下方式实现兼容：

1. **Nitro 部署到 Cloudflare Workers**：Nitro 原生支持 Cloudflare Workers 部署
2. **通过 Neon Data API**：使用 Neon Data API 的自定义认证提供者功能
3. **JWT 验证**：在 Worker 中验证 Neon Auth 签发的 JWT

### 4.2 Neon Data API 自定义认证集成

Neon Data API 支持配置自定义认证提供者，包括：

| 提供商       | JWKS URL 格式                                                                               |
| ------------ | ------------------------------------------------------------------------------------------- |
| Auth0        | `https://{domain}/.well-known/jwks.json`                                                    |
| Clerk        | `https://{domain}/.well-known/jwks.json`                                                    |
| AWS Cognito  | `https://cognito-idp.{region}.amazonaws.com/{pool_id}/.well-known/jwks.json`                |
| Azure AD     | `https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys`                         |
| Firebase/GCP | `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com` |

**注意**：Neon Auth 当前不支持直接作为 Neon Data API 的自定义认证提供者，但可以通过配置 JWT 验证实现类似功能。

### 4.3 Cloudflare Workers 连接 Neon

有两种推荐方式连接 Neon 数据库：

1. **Hyperdrive（推荐）**：Cloudflare 的连接池服务，提供最低延迟
2. **Neon Serverless Driver**：通过 HTTP/WebSocket 连接

```typescript
// 使用 Neon Serverless Driver
import { Client } from "@neondatabase/serverless";

export default {
	async fetch(request, env, ctx) {
		const client = new Client(env.DATABASE_URL);
		await client.connect();
		const { rows } = await client.query("SELECT * FROM books;");
		return new Response(JSON.stringify(rows));
	},
};
```

### 4.4 兼容性注意事项

- Neon Auth 仅在 **AWS 区域**可用
- Cloudflare Workers 部署需要配置 `nodejs_compat` 兼容标志
- 使用 Nitro 部署到 Cloudflare Workers 时，需要确保 JWT 验证库（如 `jose`）兼容 Workers 环境

---

## 五、总结与建议

### 5.1 推荐集成方案

1. **Nitro + Neon Auth 中间件方案**：
   - 创建 Nitro 插件验证 JWT
   - 使用 `jose` 库进行 EdDSA 签名验证
   - 将用户信息注入 `event.context`

2. **环境变量**：
   - 配置 `NEON_AUTH_BASE_URL` 和 `NEON_AUTH_COOKIE_SECRET`
   - 确保 JWT 验证使用正确的 issuer

3. **Cloudflare Workers 部署**：
   - Nitro 原生支持 Workers 部署
   - 使用 `jose` 库（兼容 Workers）
   - 或通过 Neon Data API 的自定义认证功能

### 5.2 已知限制

- Neon Auth 仅支持 AWS 区域
- JWT 有效期 15 分钟，需实现刷新机制
- 暂不支持自定义 claims
- EdDSA (Ed25519) 签名算法需确保验证库支持

---

## 六、参考文档

- [Neon Auth Overview](https://neon.com/docs/auth/overview)
- [Neon Auth JWT Guide](https://neon.com/docs/auth/guides/plugins/jwt)
- [Neon Auth Next.js API](https://neon.com/docs/auth/quick-start/nextjs-api-only)
- [Cloudflare Workers + Neon](https://neon.com/docs/guides/cloudflare-workers)
- [Custom Auth Providers](https://neon.com/docs/data-api/custom-authentication-providers)
