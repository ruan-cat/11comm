# 2026-03-03 500 错误验证报告

## 验证概述

本报告验证了导致生产环境 `https://01s-11comm.ruan-cat.com/` 出现 500 错误的修复是否完整。

## 问题根因分析

根据代码检查和生产问题描述，导致 500 错误的原因有两个：

### 1. 认证中间件白名单不完整

**问题描述**：认证中间件 (`2.auth.ts`) 只包含 API 路由白名单，未包含前端页面路由。

**影响**：访问首页 `/`、登录页 `/login` 等前端页面时，认证中间件错误地要求 Token，导致返回 401 错误（后续可能引发 500 错误）。

### 2. Token 格式解析错误

**问题描述**：前端使用 Cookie 存储 `{accessToken, expires, refreshToken}` 的 JSON 字符串，后端直接使用整个 JSON 字符串作为 Token 进行验证。

**影响**：JWT 验证失败，返回 401 错误。

### 3. Nitro 配置中包含不支持的 middleware 配置

**问题描述**：`nitro.config.ts` 中包含 `middleware` 配置对象，但 Nitro v3 不支持此配置。

**影响**：构建时可能产生类型错误或运行时问题。

## 已应用的修复

### 修复 1：添加前端页面路由到白名单

**提交**：`2fcf40cc`

**修改文件**：`apps/admin/server/middleware/2.auth.ts`

**变更内容**：

- 添加前端页面路由到公开路由白名单：
  - `/`
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/oauth/callback`
- 添加静态资源路由白名单：
  - `/public/`
  - `/assets/`
  - `/favicon`
  - `/__/`

### 修复 2：修复 Token 解析逻辑

**提交**：`2fcf40cc`

**修改文件**：`apps/admin/server/middleware/2.auth.ts`

**变更内容**：

- 从 Cookie JSON 中提取 `accessToken` 字段
- 添加错误处理，向后兼容非 JSON 格式的 Token

```typescript
// 从 Cookie 中提取 accessToken（Cookie 存储的是 JSON 字符串）
let token: string | undefined;
if (cookieToken) {
	try {
		const tokenData = JSON.parse(cookieToken);
		token = tokenData.accessToken;
	} catch {
		// 如果不是 JSON 格式，直接使用（向后兼容）
		token = cookieToken;
	}
} else {
	token = headerToken;
}
```

### 修复 3：移除不支持的 middleware 配置

**提交**：`6afd7066`

**修改文件**：`apps/admin/nitro.config.ts`

**变更内容**：

- 移除了 `middleware` 配置对象
- 添加注释说明：中间件应放在 `server/middleware` 目录中，Nitro 会自动加载

## 验证结果

### 代码审查结果

| 检查项                | 状态      | 说明                                     |
| --------------------- | --------- | ---------------------------------------- |
| 前端路由白名单        | ✅ 已修复 | 已添加 `/`、`/login`、`/register` 等路由 |
| 静态资源路由白名单    | ✅ 已修复 | 已添加 `/public/`、`/assets/` 等路由     |
| Token 解析逻辑        | ✅ 已修复 | 已从 Cookie JSON 中提取 accessToken      |
| Nitro middleware 配置 | ✅ 已修复 | 已移除不支持的配置                       |
| 环境变量配置          | ✅ 正常   | NEON_AUTH_BASE_URL 已正确配置            |
| auth-client.ts        | ✅ 正常   | 懒加载模式正确实现                       |

### 新发现的遗漏问题

| 检查项                                  | 状态      | 说明         |
| --------------------------------------- | --------- | ------------ |
| `server/plugins/auth.ts` 公开路由白名单 | ❌ 未修复 | **需要修复** |

**问题详情**：

`apps/admin/server/plugins/auth.ts` 只检查了 `/_nuxt` 和 `/favicon` 路径：

```typescript
if (path.startsWith("/_nuxt") || path.startsWith("/favicon")) {
	return;
}
```

但没有添加完整的公开路由白名单检查（如 `/`、`/login`、`/register` 等），导致首页 `/` 仍然会尝试调用 Neon Auth 服务。

**影响**：

- 访问首页 `/` 时，会尝试调用 `authClient.getSession()`
- 如果 Neon Auth 服务不可用或环境变量配置问题，可能导致 500 错误

### 环境配置验证

**NEON_AUTH_BASE_URL**：

- 配置位置：`apps/admin/.env`
- 值：`https://ep-cold-surf-a1x1hkmn.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth`
- 状态：✅ 已配置

**NEON_AUTH_COOKIE_SECRET**：

- 配置位置：`apps/admin/.env`
- 值：已配置（32+ 字符）
- 状态：✅ 已配置

## 结论

**修复状态**：⚠️ 部分完成

已完成的修复：

1. ✅ 认证中间件 (`2.auth.ts`) 白名单已完善
2. ✅ Token 解析逻辑已修复
3. ✅ Nitro 配置已修正

**遗漏的修复**：

1. ❌ `server/plugins/auth.ts` 缺少完整的公开路由白名单检查

**建议**：

1. 修复 `apps/admin/server/plugins/auth.ts`，添加完整的公开路由白名单检查
2. 重新部署生产环境以应用修复
3. 监控部署后的错误日志，确认 500 错误不再出现
4. 测试以下关键路径：
   - 首页 `/`
   - 登录页 `/login`
   - 静态资源加载

## 修复文件清单

| 文件路径                                 | 提交 ID   | 修复类型               |
| ---------------------------------------- | --------- | ---------------------- |
| `apps/admin/server/middleware/2.auth.ts` | 2fcf40cc  | Bug Fix                |
| `apps/admin/nitro.config.ts`             | 6afd7066  | Config Fix             |
| `apps/admin/server/plugins/auth.ts`      | ❌ 待修复 | 需要添加公开路由白名单 |

## 待修复项详情

### `server/plugins/auth.ts` 需要添加公开路由白名单

**当前代码**（第 15-19 行）：

```typescript
if (path.startsWith("/_nuxt") || path.startsWith("/favicon")) {
	return;
}
```

**建议修改**：添加完整的公开路由白名单检查：

```typescript
const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/register",
	"/forgot-password",
	"/oauth/callback",
	/^\/public\//,
	/^\/assets\//,
	/^\/favicon/,
	/^\/__/,
	/^\/_nuxt/,
];

function isPublicRoute(path: string): boolean {
	for (const route of PUBLIC_ROUTES) {
		if (typeof route === "string") {
			if (path.startsWith(route)) {
				return true;
			}
		} else if (route instanceof RegExp) {
			if (route.test(path)) {
				return true;
			}
		}
	}
	return false;
}

// 在请求处理中使用
if (isPublicRoute(path)) {
	return;
}
```
