# Nitro API 认证系统使用文档

## 1. 系统概述

本系统基于 Neon Auth（托管认证服务）实现安全的用户认证功能，支持：

- 邮箱/密码登录注册
- OAuth 2.0 第三方登录（Google、GitHub）
- JWT Token 验证
- 基于角色的访问控制（RBAC）
- API 频率限制

## 2. 快速开始

### 2.1 环境配置

在 `.env` 文件中配置以下环境变量：

```bash
# Neon Auth 配置
NEON_AUTH_BASE_URL=https://your-project.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-32-character-secret-key

# 前端基础 URL
PUBLIC_BASE_URL=http://localhost:8080

# OAuth 配置（可选）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2.2 登录流程

1. 用户访问登录页面
2. 输入邮箱和密码，或点击 OAuth 登录按钮
3. 后端验证凭证，签发 JWT Token
4. 前端将 Token 存储在 Cookie 中
5. 后续请求自动携带 Token

## 3. API 接口

### 3.1 认证接口

| 接口                           | 方法 | 说明             |
| ------------------------------ | ---- | ---------------- |
| `/api/auth/sign-in`            | POST | 邮箱密码登录     |
| `/api/auth/sign-up`            | POST | 用户注册         |
| `/api/auth/sign-out`           | POST | 登出             |
| `/api/auth/me`                 | GET  | 获取当前用户信息 |
| `/api/auth/oauth/:provider`    | GET  | 发起 OAuth 登录  |
| `/api/auth/callback/:provider` | GET  | OAuth 回调处理   |

### 3.2 请求示例

**登录请求：**

```bash
curl -X POST http://localhost:8080/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**响应：**

```json
{
	"success": true,
	"data": {
		"user": {
			"id": "user-uuid",
			"email": "user@example.com",
			"name": "User Name"
		},
		"session": {
			"token": "eyJhbGciOiJIUzI1NiIs..."
		}
	}
}
```

## 4. 前端集成

### 4.1 登录页面

登录页面位于 `src/views/login/index.vue`。

使用 `useAuth` composable 进行认证状态管理：

```typescript
import { useAuth } from "@/composables/use-auth";

const { login, logout, user, isAuthenticated } = useAuth();

// 登录
await login({ email, password });

// 登出
await logout();
```

### 4.2 OAuth 登录

```typescript
// Google 登录
window.location.href = "/api/auth/oauth/google";

// GitHub 登录
window.location.href = "/api/auth/oauth/github";
```

## 5. 权限系统

### 5.1 角色定义

系统定义了 5 种角色：

| 角色       | 代码            | 说明         |
| ---------- | --------------- | ------------ |
| 超级管理员 | super_admin     | 拥有所有权限 |
| 组织管理员 | org_admin       | 管理多个小区 |
| 小区管理员 | community_admin | 管理单个小区 |
| 物业员工   | staff           | 执行日常操作 |
| 业主/住户  | owner           | 业主/住户    |

### 5.2 权限码

权限码采用 `module:action` 格式：

```typescript
// 示例权限码
"user:create"; // 创建用户
"user:read"; // 读取用户
"user:update"; // 更新用户
"user:delete"; // 删除用户
```

### 5.3 权限验证

在 API 路由中验证权限：

```typescript
import { validatePermission } from "../../utils/permission-validator";

export default defineHandler(async (event) => {
	// 验证权限
	validatePermission(event, "staff:create");

	// ... 业务逻辑
});
```

## 6. 安全配置

### 6.1 公开路由

以下路由不需要认证：

- `/api/auth/*` - 认证相关
- `/api/*/notice/*` - 通知公告
- `/api/*/public/*` - 公共数据
- `/api/*/system-config/*` - 系统配置
- `/health` - 健康检查

### 6.2 频率限制

系统实现了 API 频率限制：

| 类型     | 限制        |
| -------- | ----------- |
| 登录     | 5 次/5 分钟 |
| API      | 100 次/分钟 |
| 文件上传 | 10 次/分钟  |

### 6.3 敏感数据

系统自动对敏感数据进行掩码处理：

- 手机号：138\*\*\*\*1234
- 身份证：1101**\*\*\*\***1234
- 邮箱：a\*\*\*d@example.com
- 银行卡：6222 \***\* \*\*** 1234

## 7. 审计日志

系统记录以下操作日志：

- 登录/登出
- Token 刷新
- OAuth 登录
- 数据访问（读/写/删/改）
- 配置变更

## 8. 常见问题

### 8.1 Token 过期

Token 过期后，系统会自动尝试刷新。如果刷新失败，需要重新登录。

### 8.2 OAuth 登录失败

1. 检查 OAuth 配置是否正确
2. 确认回调 URL 与配置一致
3. 查看服务器日志获取详细错误信息

### 8.3 权限不足

如果遇到 403 错误，检查用户角色是否具有相应权限。
