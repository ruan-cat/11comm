# Neon JS - 常见错误

使用 `@neondatabase/neon-js` 时的常见错误参考指南。

## 导入错误

### BetterAuthReactAdapter 子路径要求

`BetterAuthReactAdapter` **没有**从主包入口导出。

**错误：**

```typescript
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
```

**正确：**

```typescript
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
```

### 适配器工厂函数

所有适配器必须使用 `()` 调用。

**错误：**

```typescript
const client = createClient({
	auth: {
		adapter: BetterAuthReactAdapter, // 缺少 ()
		url: process.env.NEON_AUTH_URL!,
	},
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**正确：**

```typescript
const client = createClient({
	auth: {
		adapter: BetterAuthReactAdapter(), // 作为函数调用
		url: process.env.NEON_AUTH_URL!,
	},
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

---

## CSS 导入错误

选择 **一种** CSS 导入方法：

**使用 Tailwind v4：**

```css
@import "tailwindcss";
@import "@neondatabase/neon-js/ui/tailwind";
```

**不使用 Tailwind：**

```typescript
import "@neondatabase/neon-js/ui/css";
```

**切勿同时导入两者** - 会导致样式重复。

---

## 环境变量

**Next.js 必需：**

```bash
# .env.local
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Vite/React SPA 必需：**

```bash
# .env
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

---

## 用法错误

### 缺少 "use client" 指令

```typescript
"use client"; // 必需！

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
	const session = authClient.useSession();
	// ...
}
```

### 适配器的错误 API

| 适配器                 | 登录                                      | 注册                                |
| ---------------------- | ----------------------------------------- | ----------------------------------- |
| BetterAuthReactAdapter | `signIn.email({ email, password })`       | `signUp.email({ email, password })` |
| SupabaseAuthAdapter    | `signInWithPassword({ email, password })` | `signUp({ email, password })`       |

### 仅将 neon-js 用于 Auth

如果你只需要 auth（不需要数据库查询），请使用 `@neondatabase/auth` 以获得更小的包体积：

```bash
# 仅 Auth - 更小的包体积
npm install @neondatabase/auth

# Auth + Data API - 完整 SDK
npm install @neondatabase/neon-js
```
