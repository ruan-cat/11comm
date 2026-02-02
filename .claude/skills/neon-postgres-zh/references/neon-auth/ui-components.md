# Neon Auth - UI 组件参考

用于认证流程的预构建 UI 组件。

## 可用组件

- `AuthView` - 完整的认证页面 (登录、注册、忘记密码等) - **优先使用此组件**
- `SignedIn` / `SignedOut` - 基于认证状态的条件渲染
- `UserButton` - 带有下拉菜单的用户头像
- `NeonAuthUIProvider` - UI 组件必需的包装器

## CSS 导入

**关键:** 选择**一种**导入方法。切勿同时导入。

**不使用 Tailwind:**

```typescript
// 在 app/layout.tsx 或入口点
import "@neondatabase/auth/ui/css";
```

**使用 Tailwind v4:**

```css
/* 在 app/globals.css */
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind";
```

## NeonAuthUIProvider 设置

### Next.js App Router

```tsx
"use client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<NeonAuthUIProvider
			authClient={authClient}
			navigate={router.push}
			replace={router.replace}
			onSessionChange={() => router.refresh()}
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

### 带有 react-router-dom 的 React SPA

```tsx
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authClient } from "./lib/auth-client";

function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return <RouterLink to={href} {...props} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<NeonAuthUIProvider
			authClient={authClient}
			navigate={(path) => navigate(path)}
			replace={(path) => navigate(path, { replace: true })}
			onSessionChange={() => {}}
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

## AuthView 组件

渲染完整的认证页面。

### Next.js App Router

创建 `app/auth/[path]/page.tsx`:

```tsx
import { AuthView } from "@neondatabase/auth/react/ui";
import { authViewPaths } from "@neondatabase/auth/react/ui/server";

export function generateStaticParams() {
	return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
	const { path } = await params;
	return <AuthView pathname={path} />;
}
```

### React SPA

```tsx
import { Routes, Route, useParams } from "react-router-dom";
import { AuthView } from "@neondatabase/auth/react/ui";

function AuthPage() {
	const { pathname } = useParams();
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<AuthView pathname={pathname} />
		</div>
	);
}

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='/auth/:pathname' element={<AuthPage />} />
		</Routes>
	);
}
```

### 可用认证路径

| 路径              | 用途              |
| ----------------- | ----------------- |
| `sign-in`         | 登录页面          |
| `sign-up`         | 注册页面          |
| `forgot-password` | 密码重置请求      |
| `reset-password`  | 设置新密码        |
| `magic-link`      | 魔术链接登录      |
| `two-factor`      | 双重认证          |
| `callback`        | OAuth 回调 (内部) |
| `sign-out`        | 退出登录          |

## SignedIn / SignedOut 组件

基于认证状态的条件渲染。

```tsx
import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth/react/ui";

function Navbar() {
	return (
		<nav>
			<SignedOut>
				<a href='/auth/sign-in'>登录</a>
				<a href='/auth/sign-up'>注册</a>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</nav>
	);
}
```

## UserButton 组件

显示带有账户管理下拉菜单的用户头像。

```tsx
import { UserButton } from "@neondatabase/auth/react/ui";

function Header() {
	return (
		<header>
			<h1>我的应用</h1>
			<UserButton />
		</header>
	);
}
```

## 社交登录配置

**重要:** 社交提供商需要两步配置:

1. **在 Neon 控制台中启用** - 进入项目的 Auth 设置
2. **添加到 NeonAuthUIProvider** - 传递 `social` 属性

```tsx
<NeonAuthUIProvider
  authClient={authClient}
  // ... 其他属性
  social={{
    providers: ['google', 'github']
  }}
>
```

如果不同时进行这两步配置，社交登录按钮将不会出现。
