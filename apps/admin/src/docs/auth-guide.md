# 认证系统使用指南

本文档详细介绍 11comm 智慧社区项目的认证系统，包括环境变量配置、API 接口和前端集成说明。

## 1. 目录

- [环境变量配置](#2-环境变量配置)
- [API 接口说明](#3-api-接口说明)
- [前端集成说明](#4-前端集成说明)
- [中间件说明](#5-中间件说明)

## 2. 环境变量配置

### 2.1. 必需的环境变量

| 环境变量名                | 说明                                   | 示例值                                                             |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| `NEON_AUTH_BASE_URL`      | Neon Auth 服务的基础 URL               | `https://ep-xxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth` |
| `NEON_AUTH_COOKIE_SECRET` | 用于加密 Cookie 的密钥（至少 32 字符） | `njwWxbW4uNsGoqm+QE8hufLX/xl8664iEaf3L/FTGoY=`                     |

### 2.2. Vercel 部署环境变量前缀

在 Vercel 部署时，需要添加项目前缀：

| Vercel 环境变量名                        | 对应值                       |
| ---------------------------------------- | ---------------------------- |
| `comm_admin_11__NEON_AUTH_BASE_URL`      | 同 `NEON_AUTH_BASE_URL`      |
| `comm_admin_11__NEON_AUTH_COOKIE_SECRET` | 同 `NEON_AUTH_COOKIE_SECRET` |

### 2.3. 环境变量配置示例

```bash
# .env.local 开发环境配置
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

```bash
# Vercel 环境变量
comm_admin_11__NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth
comm_admin_11__NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

## 3. API 接口说明

### 3.1. 认证相关接口

| 接口路径                       | 方法 | 说明             | 认证要求 |
| ------------------------------ | ---- | ---------------- | -------- |
| `/api/auth/sign-in`            | POST | 邮箱密码登录     | 公开     |
| `/api/auth/sign-up`            | POST | 用户注册         | 公开     |
| `/api/auth/sign-out`           | POST | 退出登录         | 公开     |
| `/api/auth/me`                 | GET  | 获取当前用户信息 | 需要     |
| `/api/auth/oauth/:provider`    | GET  | OAuth 授权跳转   | 公开     |
| `/api/auth/callback/:provider` | GET  | OAuth 回调处理   | 公开     |
| `/api/auth/refresh`            | POST | 刷新 Token       | 需要     |

### 3.2. 登录接口

**请求**

```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**响应**

```json
{
	"success": true,
	"code": 200,
	"message": "登录成功",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"refreshToken": "",
		"expiresIn": 1710000000000,
		"tokenHead": "Bearer",
		"clientId": "comm-manager"
	}
}
```

### 3.3. 获取当前用户信息

**请求**

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**响应**

```json
{
	"success": true,
	"code": 200,
	"message": "获取成功",
	"data": {
		"id": "user-123",
		"email": "user@example.com",
		"name": "测试用户",
		"role": "admin",
		"organizationId": "org-1",
		"communityId": "comm-1"
	}
}
```

### 3.4. 公开路由白名单

以下路由不需要认证即可访问：

- `/api/auth/sign-in` - 登录
- `/api/auth/sign-up` - 注册
- `/api/auth/sign-out` - 登出
- `/api/auth/me` - 当前用户
- `/api/auth/oauth/*` - OAuth 授权
- `/api/auth/callback/*` - OAuth 回调
- `/api/*/notice/*` - 通知公告
- `/api/*/public/*` - 公共数据
- `/api/*/system-config/*` - 系统配置
- `/health` - 健康检查
- `/_health` - 健康检查

## 4. 前端集成说明

### 4.1. 登录流程

```typescript
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

// 调用登录接口
await userStore.login({
	email: "user@example.com",
	password: "your-password",
});
```

### 4.2. Token 存储

登录成功后，系统会将 Token 存储在 Cookie 中：

```typescript
// Cookie 设置
setCookie("authorized-token", token, {
	httpOnly: false, // 允许前端 JavaScript 访问
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	maxAge: 15 * 60, // 15 分钟
	path: "/",
});
```

### 4.3. 请求拦截

系统使用 Axios 拦截器自动添加 Token 到请求头// 请求：

```typescript
拦截器;
service.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
```

### 4.4. 路由守卫

```typescript
// 路由守卫示例
router.beforeEach((to, from, next) => {
	const hasToken = getToken();

	if (hasToken) {
		if (to.path === "/login") {
			next({ path: "/" });
		} else {
			// 验证用户信息
			next();
		}
	} else {
		if (to.path === "/login") {
			next();
		} else {
			next(`/login?redirect=${to.path}`);
		}
	}
});
```

## 5. 中间件说明

### 5.1. 认证中间件

认证中间件位于 `server/middleware/2.auth.ts`，主要功能：

1. **公开路由检查**：检查请求路径是否在白名单中
2. **Token 提取**：从 Cookie 或 Authorization Header 获取 Token
3. **Token 验证**：使用 jose 库验证 JWT Token
4. **用户信息注入**：将用户信息注入到请求上下文中

### 5.2. 中间件执行流程

```typescript
export const authMiddleware = defineMiddleware(async (event: H3Event) => {
	// 1. 获取请求路径
	const path = event.path;

	// 2. 检查是否是公开路由
	if (isPublicRoute(path)) {
		return;
	}

	// 3. 获取 Token
	const token =
		getCookie(event, "authorized-token") || event.request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

	// 4. 无 Token 则返回 401
	if (!token) {
		throw createError({ statusCode: 401, message: "未登录或 Token 已过期" });
	}

	// 5. 验证 Token
	const { payload } = await jose.jwtVerify(token, secret, {
		algorithms: ["HS256"],
	});

	// 6. 注入用户信息
	event.context.user = {
		id: payload.sub,
		email: payload.email,
		name: payload.name,
		role: payload.metadata?.role,
		organizationId: payload.metadata?.organizationId,
		communityId: payload.metadata?.communityId,
	};

	event.context.authenticated = true;
});
```

### 5.3. 用户上下文类型定义

```typescript
interface UserContext {
	id: string;
	email: string;
	name?: string;
	role: string;
	organizationId?: string;
	communityId?: string;
}

interface AuthContext {
	authenticated: boolean;
	user?: UserContext;
}
```

## 6. 测试

### 6.1. 运行认证相关测试

```bash
# 运行认证中间件测试
pnpm vitest run tests/nitro/middleware/auth.test.ts --node
```

### 6.2. 测试覆盖范围

- 公开路由白名单逻辑
- JWT Token 生成与验证
- Token 载荷解析
- 错误 Token 处理

## 7. 常见问题

### 7.1. Token 过期

当 Token 过期时，中间件会返回 401 错误。前端应捕获此错误并引导用户重新登录。

### 7.2. CORS 配置

确保 Neon Auth 服务的 CORS 配置允许前端域名的请求。

### 7.3. Cookie 安全

生产环境下应设置 `secure: true`，确保 Cookie 仅在 HTTPS 连接中传输。
