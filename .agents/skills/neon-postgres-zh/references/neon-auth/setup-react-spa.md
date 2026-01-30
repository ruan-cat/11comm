# Neon Auth 设置 - React SPA (Vite)

React 单页应用 (Vite, Create React App 等) 中 Neon Auth 的完整设置指南。

---

## 1. 安装包

```bash
npm install @neondatabase/auth
# 或者: npm install @neondatabase/neon-js
npm install react-router-dom  # UI 组件需要
```

## 2. 环境变量

创建或更新 `.env`:

**对于 Vite:**

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**对于 Create React App:**

```bash
REACT_APP_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**如何找到你的 Auth URL:**

1. 进入 Neon 项目仪表板
2. 导航到 "Auth" 选项卡
3. 复制 Auth URL

## 3. Auth 客户端配置

创建 `src/lib/auth-client.ts`:

**对于 `@neondatabase/auth`:**

```typescript
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
	adapter: BetterAuthReactAdapter(),
});
```

**对于 `@neondatabase/neon-js`:**

```typescript
import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

export const client = createClient({
	auth: {
		adapter: BetterAuthReactAdapter(),
		url: import.meta.env.VITE_NEON_AUTH_URL,
	},
	dataApi: {
		url: import.meta.env.VITE_NEON_DATA_API_URL,
	},
});

export const authClient = client.auth;
```

**关键点:**

- `BetterAuthReactAdapter` 必须从 `/react/adapters` 子路径导入
- 适配器必须作为函数调用: `BetterAuthReactAdapter()`

## 4. 在组件中使用

```typescript
import { authClient } from "./lib/auth-client";

function App() {
  const session = authClient.useSession();

  if (session.isPending) return <div>加载中...</div>;
  if (!session.data) return <LoginForm />;

  return <Dashboard user={session.data.user} />;
}
```

---

## 5. UI Provider 设置 (可选)

如果你在构建自定义认证表单，请跳过此部分。如果你想要预构建的 UI 组件，请使用此部分。

### 5a. 导入 CSS

**关键:** 选择**一种**导入方法。切勿同时导入 - 这会导致重复样式。

**检查项目是否使用 Tailwind CSS:**

- 根目录有 `tailwind.config.js` 或 `tailwind.config.ts`
- CSS 文件中有 `@import 'tailwindcss'` 或 `@tailwind` 指令
- package.json 依赖中有 `tailwindcss`

**如果不使用 Tailwind** - 添加到 `src/main.tsx` 或入口点:

```typescript
import "@neondatabase/auth/ui/css";
```

**如果使用 Tailwind CSS v4** - 添加到主 CSS 文件 (例如 index.css):

```css
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind";
```

### 5b. 使用 BrowserRouter 更新 main.tsx

```tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@neondatabase/auth/ui/css"; // 如果不使用 Tailwind
import App from "./App";
import { Providers } from "./providers";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Providers>
			<App />
		</Providers>
	</BrowserRouter>,
);
```

### 5c. 创建 Auth Provider

创建 `src/providers.tsx`:

```tsx
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authClient } from "./lib/auth-client";
import type { ReactNode } from "react";

// react-router-dom Link 的适配器
function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return <RouterLink to={href} {...props} />;
}

export function Providers({ children }: { children: ReactNode }) {
	const navigate = useNavigate();

	return (
		<NeonAuthUIProvider
			authClient={authClient}
			navigate={(path) => navigate(path)}
			replace={(path) => navigate(path, { replace: true })}
			onSessionChange={() => {
				// 可选: 刷新数据或使缓存失效
			}}
			Link={Link}
			social={{
				providers: ["google", "github"],
			}}
		>
			{children}
		</NeonAuthUIProvider>
	);
}
```

**Provider 属性解释:**

- `navigate`: 导航到新路由的函数
- `replace`: 替换当前路由的函数 (用于重定向)
- `onSessionChange`: 认证状态变更时的回调 (用于缓存失效)
- `Link`: react-router-dom Link 的适配器组件
- `social`: 显示 Google 和 GitHub 登录按钮 (Neon 默认启用两者)

### 5d. 添加路由到 App.tsx

```tsx
import { Routes, Route, useParams } from "react-router-dom";
import { AuthView, UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";

// 认证页面 - 处理 /auth/sign-in, /auth/sign-up 等
function AuthPage() {
	const { pathname } = useParams();
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<AuthView pathname={pathname} />
		</div>
	);
}

// 简单导航栏示例
function Navbar() {
	return (
		<nav className='flex items-center justify-between p-4 border-b'>
			<a href='/'>我的应用</a>
			<div className='flex items-center gap-4'>
				<SignedOut>
					<a href='/auth/sign-in'>登录</a>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	);
}

function HomePage() {
	return <div>欢迎来到我的应用!</div>;
}

export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/auth/:pathname' element={<AuthPage />} />
			</Routes>
		</>
	);
}
```

**创建的认证路由:**

- `/auth/sign-in` - 登录页面
- `/auth/sign-up` - 注册页面
- `/auth/forgot-password` - 密码重置请求
- `/auth/reset-password` - 设置新密码
- `/auth/sign-out` - 退出登录
- `/auth/callback` - OAuth 回调 (内部)
