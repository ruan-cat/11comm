# Neon Auth 设置 - Next.js App Router

Next.js App Router 应用中 Neon Auth 的完整设置指南。

---

## 1. 安装包

```bash
npm install @neondatabase/auth
# 或者: npm install @neondatabase/neon-js
```

## 2. 环境变量

创建或更新 `.env.local`:

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**重要:** 两个变量都是必需的:

- `NEON_AUTH_BASE_URL` - 由服务端 API 路由使用
- `NEXT_PUBLIC_NEON_AUTH_URL` - 由客户端组件使用 (以 NEXT*PUBLIC* 为前缀)

**如何找到你的 Auth URL:**

1. 进入 Neon 项目仪表板
2. 导航到 "Auth" 选项卡
3. 复制 Auth URL

## 3. API 路由处理程序

创建 `app/api/auth/[...path]/route.ts`:

```typescript
import { authApiHandler } from "@neondatabase/auth/next";
// 或者: import { authApiHandler } from "@neondatabase/neon-js/auth/next";

export const { GET, POST } = authApiHandler();
```

这将为以下内容创建端点:

- `/api/auth/sign-in` - 登录
- `/api/auth/sign-up` - 注册
- `/api/auth/sign-out` - 退出登录
- `/api/auth/session` - 获取会话
- 以及其他认证相关端点

## 4. Auth 客户端配置

创建 `lib/auth/client.ts`:

```typescript
import { createAuthClient } from "@neondatabase/auth/next";
// 或者: import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export const authClient = createAuthClient();
```

## 5. 在组件中使用

```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();

  if (session.isPending) return <div>加载中...</div>;
  if (!session.data) return <SignInButton />;

  return (
    <div>
      <p>你好, {session.data.user.name}</p>
      <button onClick={() => authClient.signOut()}>退出登录</button>
    </div>
  );
}

function SignInButton() {
  return (
    <button onClick={() => authClient.signIn.email({
      email: "user@example.com",
      password: "password"
    })}>
      登录
    </button>
  );
}
```

## 6. UI Provider 设置 (可选)

对于预构建的 UI 组件 (AuthView, UserButton 等), 请参阅 `ui-components.md`。

---

## 包选择

| 需求              | 包                      | 包体积        |
| ----------------- | ----------------------- | ------------- |
| 仅认证            | `@neondatabase/auth`    | 较小 (~50KB)  |
| 认证 + 数据库查询 | `@neondatabase/neon-js` | 完整 (~150KB) |

**建议:** 如果你只需要认证，使用 `@neondatabase/auth`。如果你还需要 PostgREST 风格的数据库查询，使用 `@neondatabase/neon-js`。
