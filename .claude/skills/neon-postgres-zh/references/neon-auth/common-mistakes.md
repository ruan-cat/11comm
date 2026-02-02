# Neon Auth - 常见错误

在使用 `@neondatabase/auth` 或 `@neondatabase/neon-js` 时的常见错误参考指南。

## 导入错误

### BetterAuthReactAdapter 子路径要求

`BetterAuthReactAdapter` **不会**从主包入口导出。你必须从子路径导入。

**错误:**

```typescript
// 这些都无法工作
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/auth";
```

**正确:**

```typescript
// 对于 @neondatabase/neon-js
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

// 对于 @neondatabase/auth
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";
```

**原因:** React 适配器有特定于 React 的依赖，并且为了非 React 环境从主包中 tree-shake 掉了。使用子路径导出可以让主包对非 React 环境保持更小。

### 适配器工厂函数

所有适配器都是**工厂函数**，必须使用 `()` 调用。

**错误:**

```typescript
const client = createClient({
	auth: {
		adapter: BetterAuthReactAdapter, // 缺少 ()
		url: process.env.NEON_AUTH_URL!,
	},
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**正确:**

```typescript
const client = createClient({
	auth: {
		adapter: BetterAuthReactAdapter(), // 作为函数调用
		url: process.env.NEON_AUTH_URL!,
	},
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

这适用于所有适配器：

- `BetterAuthReactAdapter()`
- `BetterAuthVanillaAdapter()`
- `SupabaseAuthAdapter()`

---

## CSS 导入错误

Auth UI 组件需要 CSS。根据你的项目选择**一种**方法。

### 使用 Tailwind v4

```css
/* 在 app/globals.css 中 */
@import "tailwindcss";
@import "@neondatabase/neon-js/ui/tailwind";
/* 或: @import '@neondatabase/auth/ui/tailwind'; */
```

### 不使用 Tailwind

```typescript
// 在 app/layout.tsx 中
import "@neondatabase/neon-js/ui/css";
// 或: import "@neondatabase/auth/ui/css";
```

### 切勿同时导入

**错误:**

```css
/* 导致约 94KB 的重复样式 */
@import "@neondatabase/neon-js/ui/css";
@import "@neondatabase/neon-js/ui/tailwind";
```

**原因:** `ui/css` 导入包含预构建的 CSS (~47KB)。`ui/tailwind` 导入提供 Tailwind token (~2KB)，生成类似的样式。同时使用会使你的 CSS 包大小加倍。

---

## 配置错误

### 错误的 createAuthClient 签名

`createAuthClient` 函数将 URL 作为第一个参数，而不是作为选项对象中的属性。

**错误:**

```typescript
// 这将无法工作
createAuthClient({ baseURL: url });
createAuthClient({ url: myUrl });
```

**正确:**

```typescript
// 原生客户端 - URL 作为第一个参数
createAuthClient(url);

// 带适配器 - URL 作为第一个参数，选项作为第二个参数
createAuthClient(url, { adapter: BetterAuthReactAdapter() });

// Next.js 客户端 - 无参数 (自动使用环境变量)
import { createAuthClient } from "@neondatabase/auth/next";
const authClient = createAuthClient();
```

### 缺少环境变量

**Next.js 必需:**

```bash
# .env.local
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# 对于 neon-js (auth + data)
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Vite/React SPA 必需:**

```bash
# .env
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**重要:**

- `NEON_AUTH_BASE_URL` - 服务端认证
- `NEXT_PUBLIC_*` 前缀 - Next.js 客户端访问必需
- `VITE_*` 前缀 - Vite 客户端访问必需
- 添加环境变量后重启开发服务器

---

## 用法错误

### 缺少 "use client" 指令

使用 `useSession()` 的客户端组件需要 `"use client"` 指令。

**错误:**

```typescript
// 缺少指令 - 将导致 hydration 错误
import { authClient } from "@/lib/auth/client";

function AuthStatus() {
	const session = authClient.useSession();
	// ...
}
```

**正确:**

```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
	const session = authClient.useSession();
	// ...
}
```

### 适配器 API 错误

每个适配器都有自己的 API 风格。不要混用。

**错误 - BetterAuth API 混用 SupabaseAuthAdapter:**

```typescript
const client = createClient({
	auth: { adapter: SupabaseAuthAdapter(), url },
	dataApi: { url },
});

// 这在 SupabaseAuthAdapter 中无法工作
await client.auth.signIn.email({ email, password });
```

**正确 - Supabase API 配合 SupabaseAuthAdapter:**

```typescript
const client = createClient({
	auth: { adapter: SupabaseAuthAdapter(), url },
	dataApi: { url },
});

// 使用 Supabase 风格的方法
await client.auth.signInWithPassword({ email, password });
```

**按适配器分类的 API 参考:**

| 适配器                   | 登录                                      | 注册                                | 获取会话                        |
| ------------------------ | ----------------------------------------- | ----------------------------------- | ------------------------------- |
| BetterAuthVanillaAdapter | `signIn.email({ email, password })`       | `signUp.email({ email, password })` | `getSession()`                  |
| BetterAuthReactAdapter   | `signIn.email({ email, password })`       | `signUp.email({ email, password })` | `useSession()` / `getSession()` |
| SupabaseAuthAdapter      | `signInWithPassword({ email, password })` | `signUp({ email, password })`       | `getSession()`                  |
