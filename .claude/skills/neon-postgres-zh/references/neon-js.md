# Neon JS SDK

`@neondatabase/neon-js` SDK 为 Neon Auth 和 Data API 提供了统一的客户端。它结合了身份验证处理和兼容 PostgREST 的数据库查询。

**仅需 Auth？** 如果是为了更小的包体积，请使用 `neon-auth.md` 代替。

官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/javascript-sdk
```

## 包的选择

| 用例            | 包                           | 备注         |
| --------------- | ---------------------------- | ------------ |
| Auth + Data API | `@neondatabase/neon-js`      | 完整 SDK     |
| 仅 Auth         | `@neondatabase/auth`         | 更小的包体积 |
| 仅 Data API     | `@neondatabase/postgrest-js` | 自带 auth    |

## 安装

```bash
npm install @neondatabase/neon-js
```

## 快速设置模式

### Next.js (最常用)

**1. API 路由处理程序:**

```typescript
// app/api/auth/[...path]/route.ts
import { authApiHandler } from "@neondatabase/neon-js/auth/next";
export const { GET, POST } = authApiHandler();
```

**2. Auth 客户端:**

```typescript
// lib/auth/client.ts
import { createAuthClient } from "@neondatabase/neon-js/auth/next";
export const authClient = createAuthClient();
```

**3. 数据库客户端:**

```typescript
// lib/db/client.ts
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types";

export const dbClient = createClient<Database>({
	auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

### React SPA

```typescript
import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const client = createClient<Database>({
	auth: {
		adapter: BetterAuthReactAdapter(),
		url: import.meta.env.VITE_NEON_AUTH_URL,
	},
	dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});
```

### Node.js 后端

```typescript
import { createClient } from "@neondatabase/neon-js";

const client = createClient<Database>({
	auth: { url: process.env.NEON_AUTH_URL! },
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

## 环境变量

```bash
# Next.js (.env.local)
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1

# Vite/React (.env)
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

## 数据库查询

所有查询方法均遵循 PostgREST 语法（与 Supabase 相同）：

```typescript
// 带过滤条件的查询
const { data } = await client
	.from("items")
	.select("id, name, status")
	.eq("status", "active")
	.order("created_at", { ascending: false })
	.limit(10);

// 插入
const { data, error } = await client.from("items").insert({ name: "New Item", status: "pending" }).select().single();

// 更新
await client.from("items").update({ status: "completed" }).eq("id", 1);

// 删除
await client.from("items").delete().eq("id", 1);
```

有关完整的 Data API 查询参考，请参阅 `neon-js/data-api.md`。

## Auth 方法

### BetterAuth API (默认)

```typescript
// 登录/注册
await client.auth.signIn.email({ email, password });
await client.auth.signUp.email({ email, password, name });
await client.auth.signOut();

// 获取会话
const session = await client.auth.getSession();

// 社交登录
await client.auth.signIn.social({
	provider: "google",
	callbackURL: "/dashboard",
});
```

### 兼容 Supabase 的 API

```typescript
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

const client = createClient({
	auth: { adapter: SupabaseAuthAdapter(), url },
	dataApi: { url },
});

await client.auth.signInWithPassword({ email, password });
await client.auth.signUp({ email, password });
const {
	data: { session },
} = await client.auth.getSession();
```

## 子资源

| 主题          | 资源                         |
| ------------- | ---------------------------- |
| Data API 查询 | `neon-js/data-api.md`        |
| 常见错误      | `neon-js/common-mistakes.md` |

## 关键导入

```typescript
// 主客户端
import { createClient, SupabaseAuthAdapter, BetterAuthVanillaAdapter } from "@neondatabase/neon-js";

// Next.js 集成
import { authApiHandler, createAuthClient } from "@neondatabase/neon-js/auth/next";

// React 适配器 (不是从主入口导入 - 必须使用子路径)
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

// UI 组件
import { NeonAuthUIProvider, AuthView, SignInForm } from "@neondatabase/neon-js/auth/react/ui";
import { authViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";

// CSS (任选其一)
import "@neondatabase/neon-js/ui/css"; // 不带 Tailwind
// @import '@neondatabase/neon-js/ui/tailwind'; // 带 Tailwind v4 (在 CSS 文件中)
```

## 生成类型

```bash
npx neon-js gen-types --db-url "postgresql://..." --output src/types/database.ts
```

## 常见错误

1. **错误的适配器导入**: 从 `auth/react/adapters` 子路径导入 `BetterAuthReactAdapter`
2. **忘记调用适配器**: 使用带括号的 `SupabaseAuthAdapter()`
3. **缺少 CSS 导入**: 从 `ui/css` 或 `ui/tailwind` 导入（不要同时导入）
4. **仅 auth 时用错包**: 使用 `@neondatabase/auth` 以获得更小的包体积
5. **缺少 "use client"**: auth 客户端组件必须使用

详见 `neon-js/common-mistakes.md` 中的详细示例。
