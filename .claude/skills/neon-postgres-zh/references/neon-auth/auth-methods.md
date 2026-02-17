# Neon Auth - 认证方法参考

认证方法、会话管理和错误处理的完整参考。

## 认证方法

### 注册 (Sign Up)

```typescript
await auth.signUp.email({
	email: "user@example.com",
	password: "securepassword",
	name: "John Doe", // 可选
});
```

### 登录 (Sign In)

```typescript
// 邮箱/密码
await auth.signIn.email({
	email: "user@example.com",
	password: "securepassword",
});

// 社交账号 (Google, GitHub)
await auth.signIn.social({
	provider: "google", // 或 "github"
	callbackURL: "/dashboard",
});
```

### 退出登录 (Sign Out)

```typescript
await auth.signOut();
```

### 获取会话 (Get Session)

```typescript
// 异步 (Node.js, 服务端组件)
const session = await auth.getSession();

// React hook (客户端组件)
const session = auth.useSession();
// 返回值: { data: Session | null, isPending: boolean }
```

## 会话数据结构

```typescript
interface Session {
	user: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
		emailVerified: boolean;
		createTime: Date;
		updateTime: Date;
	};
	session: {
		id: string;
		expiresAt: Date;
		token: string;
		createTime: Date;
		updateTime: Date;
		userId: string;
	};
}
```

## 错误处理

```typescript
const { error } = await auth.signIn.email({ email, password });

if (error) {
	switch (error.code) {
		case "INVALID_EMAIL_OR_PASSWORD":
			showError("Invalid email or password");
			break;
		case "EMAIL_NOT_VERIFIED":
			showError("Please verify your email");
			break;
		case "USER_NOT_FOUND":
			showError("User not found");
			break;
		case "TOO_MANY_REQUESTS":
			showError("Too many attempts. Please wait.");
			break;
		default:
			showError("Authentication failed");
	}
}
```

## 构建认证页面

### 使用 AuthView (推荐用于 React 应用)

对于认证页面，建议使用预构建的 `AuthView` 组件，而不是构建自定义表单。

**AuthView 提供的内容：**

- 登录、注册、密码重置、魔术链接页面
- 社交提供商 (Google, GitHub) - 需要两步配置：在 Neon 控制台中启用，并向 NeonAuthUIProvider 添加 `social` 属性
- 表单验证、错误处理、加载状态
- 通过 CSS 变量实现一致的样式

**设置 (Next.js App Router):**

1. **导入 CSS** (在 `app/layout.tsx` 或 `app/globals.css` 中):

```tsx
import "@neondatabase/auth/ui/css";
```

2. **使用 Provider 包裹应用** (创建 `app/auth-provider.tsx`):

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
		>
			{children}
		</NeonAuthUIProvider>
	);
}
```

3. **创建认证页面** (`app/auth/[path]/page.tsx`):

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

**结果:** 现在你有了 `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password` 等页面。

**可用路径:** `"sign-in"`, `"sign-up"`, `"forgot-password"`, `"reset-password"`, `"magic-link"`, `"two-factor"`, `"callback"`, `"sign-out"`

### 何时使用底层方法

如果遇到以下情况，请直接使用 `authClient.signIn.email()`, `authClient.signUp.email()`:

- **Node.js 后端** - 无 React，仅服务端认证
- **自定义设计系统** - 你的设计团队提供了表单组件
- **移动端/CLI 应用** - 非 Web 前端
- **无头认证** - 测试或非标准流程

对于标准的 React Web 应用，**请使用 AuthView**。

### 常见反模式

```tsx
// ❌ 不要构建自定义表单，除非你有特殊需求
function CustomSignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await authClient.signIn.email({ email, password });
		if (error) setError(error.message);
		setLoading(false);
	};

	// ... 50+ more lines of form JSX, validation, error display
}

// ✅ 请使用 AuthView 代替 - 一个组件处理所有事情
<AuthView pathname='sign-in' />;
```

## 样式

Neon Auth UI **会自动继承你应用现有的主题**。如果你定义了 `--primary`, `--background` 等 CSS 变量（来自 Tailwind, shadcn/ui, 或自定义 CSS），认证组件将无需配置即可使用它们。

**主要特性:**

- **自动继承**: 使用你现有的 `--primary`, `--background` 等变量
- **无冲突**: 认证样式位于 `@layer neon-auth` 中，所以你的样式总是优先
- **导入顺序不重要**: CSS 层会自动处理优先级

### 与 shadcn/ui 集成

如果你使用 shadcn/ui 或类似定义了 `--primary`, `--background` 等变量的库，Neon Auth 将自动继承这些颜色。无需额外配置。

### 使用现有 CSS 变量

创建自定义组件时，使用 CSS 变量以保持一致性：

| 变量                                | 用途          |
| ----------------------------------- | ------------- |
| `--background`, `--foreground`      | 页面背景/文本 |
| `--card`, `--card-foreground`       | 卡片表面      |
| `--primary`, `--primary-foreground` | 主要按钮/操作 |
| `--muted`, `--muted-foreground`     | 柔和/次要元素 |
| `--border`, `--ring`                | 边框和焦点环  |
| `--radius`                          | 边框圆角      |

### 认证专用自定义

要对认证组件进行不同于主应用的自定义，请使用 `--neon-*` 前缀：

```css
:root {
	--primary: oklch(0.55 0.25 250); /* 你应用的蓝色 */
	--neon-primary: oklch(0.55 0.18 145); /* 认证使用绿色 */
}
```
