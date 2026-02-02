# Neon Auth

Neon Auth 为您的应用提供身份验证。它可以作为：

- `@neondatabase/auth` - 仅身份验证（更小的包）
- `@neondatabase/neon-js` - Auth + Data API（完整 SDK，参见 `neon-js.md`）

获取官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/auth/overview
```

## 包选择

| 需求              | 包                      | 大小 |
| ----------------- | ----------------------- | ---- |
| 仅身份验证        | `@neondatabase/auth`    | 更小 |
| Auth + 数据库查询 | `@neondatabase/neon-js` | 完整 |

## 安装

```bash
# 仅身份验证
npm install @neondatabase/auth

# Auth + Data API
npm install @neondatabase/neon-js
```

## 快速设置模式

### Next.js App Router

**1. API 路由处理程序：**

```typescript
// app/api/auth/[...path]/route.ts
import { authApiHandler } from "@neondatabase/auth/next";
export const { GET, POST } = authApiHandler();
```

**2. Auth 客户端：**

```typescript
// lib/auth/client.ts
import { createAuthClient } from "@neondatabase/auth/next";
export const authClient = createAuthClient();
```

**3. 在组件中使用：**

```typescript
"use client";
import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();
  if (session.isPending) return <div>Loading...</div>;
  if (!session.data) return <SignInButton />;
  return <div>Hello, {session.data.user.name}</div>;
}
```

### React SPA

```typescript
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
	adapter: BetterAuthReactAdapter(),
});
```

### Node.js 后端

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);
await auth.signIn.email({ email, password });
const session = await auth.getSession();
```

## 环境变量

```bash
# Next.js (.env.local)
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# Vite/React (.env)
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

## 子资源

获取详细文档：

| 主题                    | 资源                           |
| ----------------------- | ------------------------------ |
| Next.js App Router 设置 | `neon-auth/setup-nextjs.md`    |
| React SPA 设置          | `neon-auth/setup-react-spa.md` |
| Auth 方法参考           | `neon-auth/auth-methods.md`    |
| UI 组件                 | `neon-auth/ui-components.md`   |
| 常见错误                | `neon-auth/common-mistakes.md` |

## 关键导入

```typescript
// Auth client (Next.js)
import { authApiHandler, createAuthClient } from "@neondatabase/auth/next";

// Auth client (vanilla)
import { createAuthClient } from "@neondatabase/auth";

// React adapter (NOT from main entry)
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// UI components
import { NeonAuthUIProvider, AuthView, SignInForm } from "@neondatabase/auth/react/ui";
import { authViewPaths } from "@neondatabase/auth/react/ui/server";

// CSS
import "@neondatabase/auth/ui/css";
```

## 常见错误

1. **错误的适配器导入**：从 `auth/react/adapters` 子路径导入 `BetterAuthReactAdapter`
2. **忘记调用适配器**：使用带括号的 `BetterAuthReactAdapter()`
3. **缺少 CSS**：从 `ui/css` 或 `ui/tailwind` 导入（不要同时导入）
4. **缺少 "use client"**：使用 `useSession()` 的组件需要
5. **错误的 createAuthClient 签名**：第一个参数是 URL：`createAuthClient(url, { adapter })`

有关详细示例，请参阅 `neon-auth/common-mistakes.md`。
