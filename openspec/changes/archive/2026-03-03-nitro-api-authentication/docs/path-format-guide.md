# OpenSpec 路径格式规范说明

## 背景

在 `nitro-api-authentication` 任务执行过程中，发现了路径格式不一致的问题。本文档记录正确的路径格式规范，防止后续 openspec 任务出现路径生产故障。

## Nitro/H3 路由路径格式规范

### 1. 动态路由参数格式

**正确格式（使用目录结构）：**

```plain
apps/admin/server/api/auth/oauth/[provider]/get.ts
apps/admin/server/api/auth/callback/[provider]/get.ts
```

**错误格式（使用点号）：**

```plain
apps/admin/server/api/auth/oauth/[provider].get.ts
apps/admin/server/api/auth/callback/[provider].get.ts
```

### 2. HTTP 方法文件命名

Nitro/H3 支持两种路由定义方式：

#### 方式一：目录结构（推荐）

```plain
server/api/auth/sign-in/post.ts    # POST /api/auth/sign-in
server/api/auth/sign-in/get.ts     # GET /api/auth/sign-in
server/api/auth/me/get.ts          # GET /api/auth/me
```

#### 方式二：文件后缀（不推荐用于复杂路由）

```plain
server/api/auth/sign-in.post.ts    # POST /api/auth/sign-in
server/api/auth/sign-in.get.ts     # GET /api/auth/sign-in
```

### 3. 中间件文件命名

中间件文件使用数字前缀控制执行顺序：

```plain
server/middleware/1.logger.ts     # 第1个执行
server/middleware/2.auth.ts        # 第2个执行
server/middleware/3.validate.ts    # 第3个执行
```

### 4. 插件文件命名

插件文件放在 `server/plugins/` 目录：

```plain
server/plugins/auth.ts             # 认证插件
server/plugins/db-init.ts          # 数据库初始化插件
```

### 5. 工具函数文件命名

工具函数放在 `server/utils/` 目录：

```plain
server/utils/auth-client.ts        # Auth 客户端
server/utils/rls-helpers.ts       # RLS 辅助函数
```

## 实际项目路径验证

以下是 `nitro-api-authentication` 任务中涉及的实际路径，已验证存在：

| 文档描述路径                               | 实际路径                                   | 状态    |
| ------------------------------------------ | ------------------------------------------ | ------- |
| server/api/auth/sign-in/post.ts            | server/api/auth/sign-in/post.ts            | ✅ 匹配 |
| server/api/auth/sign-up/post.ts            | server/api/auth/sign-up/post.ts            | ✅ 匹配 |
| server/api/auth/sign-out/post.ts           | server/api/auth/sign-out/post.ts           | ✅ 匹配 |
| server/api/auth/me/get.ts                  | server/api/auth/me/get.ts                  | ✅ 匹配 |
| server/api/auth/oauth/[provider]/get.ts    | server/api/auth/oauth/[provider]/get.ts    | ✅ 匹配 |
| server/api/auth/callback/[provider]/get.ts | server/api/auth/callback/[provider]/get.ts | ✅ 匹配 |
| server/middleware/1.logger.ts              | server/middleware/1.logger.ts              | ✅ 匹配 |
| server/middleware/2.auth.ts                | server/middleware/2.auth.ts                | ✅ 匹配 |
| server/middleware/3.validate.ts            | server/middleware/3.validate.ts            | ✅ 匹配 |
| server/plugins/auth.ts                     | server/plugins/auth.ts                     | ✅ 匹配 |
| server/utils/auth-client.ts                | server/utils/auth-client.ts                | ✅ 匹配 |

## 已修复的问题

### 1. design.md 路径格式错误（已修复）

- 第 367 行：`oauth/[provider].get.ts` → `oauth/[provider]/get.ts`
- 第 419 行：`callback/[provider].get.ts` → `callback/[provider]/get.ts`

### 2. tasks.md 注册页面路径说明（已更新）

- 原描述：创建注册页面 `apps/admin/src/views/register/index.vue`
- 实际实现：注册功能集成在 `apps/admin/src/views/login/components/LoginRegist.vue`
- 更新说明：已在 tasks.md 中注明实际实现路径

## 前端页面路径规范

| 页面类型     | 路径规范                                     |
| ------------ | -------------------------------------------- |
| 登录页面     | `src/views/login/index.vue`                  |
| 注册组件     | `src/views/login/components/LoginRegist.vue` |
| 登录相关组件 | `src/views/login/components/*.vue`           |

## 验证命令

执行 openspec 任务前，可使用以下命令验证路径是否存在：

```bash
# 检查 server 目录结构
ls -la apps/admin/server/api/auth/
ls -la apps/admin/server/middleware/
ls -la apps/admin/server/plugins/
ls -la apps/admin/server/utils/

# 检查前端页面
ls -la apps/admin/src/views/login/
```

## 总结

1. **动态路由参数必须使用目录结构**：`[param]/get.ts` 而不是 `[param].get.ts`
2. **HTTP 方法文件必须放在对应目录下**：`sign-in/post.ts` 而不是 `sign-in.post.ts`
3. **中间件使用数字前缀控制顺序**：`1.xxx.ts`, `2.xxx.ts`, `3.xxx.ts`
4. **注册功能可能集成在登录页面**，不一定需要独立页面

## 导入路径规范（重要）

### 正确的导入路径

| 导入内容    | 正确路径                                                    | 错误路径                                                      |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| 数据库实例  | `import { useDb } from "server/db"`                         | `import { useDb } from "~/server/db"`                         |
| 工具函数    | `import { formatDateTime } from "server/utils/format-date"` | `import { formatDateTime } from "@/server/utils/format-date"` |
| Auth 客户端 | `import { useAuthClient } from "server/utils/auth-client"`  | `import { useAuthClient } from "@/server/utils/auth-client"`  |
| 类型定义    | `import type { JsonVO } from "@01s-11comm/type"`            | -                                                             |

### 中间件导出规范（关键）

**必须使用默认导出**：

```typescript
// ✅ 正确：使用默认导出
export default defineMiddleware(async (event) => {
	// 中间件逻辑
});

// ❌ 错误：使用具名导出
export const loggerMiddleware = defineMiddleware(async (event) => {
	// 中间件逻辑
});
```

### 原因说明

1. **项目未配置 `@/server` 别名**：项目只配置了 `@` 别名指向 `src/`，没有 `@/server` 别名
2. **Nitro 要求中间件默认导出**：Nitro 框架期望中间件文件导出默认导出，而不是具名导出
