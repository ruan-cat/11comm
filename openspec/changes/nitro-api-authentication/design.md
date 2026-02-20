## Context

当前项目使用 Nitro v3 + Drizzle + Neon 技术栈构建后台管理系统。项目存在严重的安全隐患：**所有 Nitro API 接口无任何认证授权机制，可被任意访问**。

### 当前状态

- Nitro 服务运行在 `apps/admin/server/` 目录
- 使用 Drizzle ORM 连接 Neon 数据库
- 所有 API 路由 (`/api/**`) 均可匿名访问
- 无用户认证、无权限控制、无数据隔离

### 约束条件

- 需要兼容现有 Vue 3 前端架构
- 需要支持 Cloudflare Worker 部署
- 需要保持向后兼容，不破坏现有 Mock 数据接口
- 需要支持开发/生产多环境
- **需要支持 100+ 个 API 接口的批量认证**
- **需要支持组织+小区级别的数据隔离**
- **需要将现有账户体系迁移到 Neon Auth**

### 利益相关者

- 后端开发者：需要实现认证中间件
- 前端开发者：需要集成登录页面
- 运维人员：需要配置环境变量
- 安全合规：需要满足数据安全要求

## Goals / Non-Goals

**Goals:**

- 实现 Nitro 接口 JWT Token 认证机制
- 集成 Neon Auth 托管认证服务
- 配置 Drizzle RLS 策略实现数据行级安全
- 提供完整的登录/登出/Token 刷新流程

**Non-Goals:**

- 不破坏现有功能，确保平滑迁移
- 不实现复杂的动态权限管理（基于角色的静态配置）
- 不修改客户端路由守卫（前端独立任务）

## Decisions

### Decision 1: 认证服务选择 - Neon Auth vs 自托管 Better Auth

**选择：Neon Auth (托管服务)**

| 方案               | 优点                             | 缺点                 |
| ------------------ | -------------------------------- | -------------------- |
| Neon Auth          | 开箱即用、分支感知认证、RLS 集成 | 仅支持 AWS、需要托管 |
| 自托管 Better Auth | 完全控制、灵活配置               | 需要自行维护服务器   |

**理由**：

1. Neon Auth 与 Neon 数据库深度集成，原生支持 RLS
2. 分支感知认证非常适合预览环境测试
3. 开箱即用的 Google OAuth 开发凭证
4. 零服务器管理负担

### Decision 2: JWT 验证方案 - jose 库

**选择：`jose` 库**

**理由**：

1. 轻量级、零依赖
2. 支持 EdDSA (Neon Auth 默认算法)
3. 内置 JWKS 远程获取支持
4. 兼容 Cloudflare Worker

**替代方案考虑**：

- `jsonwebtoken`: 更流行但依赖较多
- `fast-jwt`: 性能更好但功能较少

### Decision 3: RLS 实现方式 - Drizzle crudPolicy

**选择：Drizzle ORM 的 crudPolicy 辅助函数**

**理由**：

1. 声明式配置，与 Schema 定义共存
2. 自动生成标准 RLS 策略
3. 支持常见访问模式（用户私有数据、角色访问）
4. 可与 pgPolicy 混合使用实现复杂场景

### Decision 4: 中间件架构 - 分层设计

**选择：双层中间件架构**

```plain
请求 → 1.logger.ts → 2.auth.ts → 3.validate.ts → 路由处理器
```

- **1.logger.ts**: 请求日志、requestId 生成
- **2.auth.ts**: Token 解析、JWT 验证、用户上下文注入
- **3.validate.ts**: 路由权限检查（可选）

**理由**：

1. 职责分离，便于维护
2. 数字前缀控制执行顺序
3. 可按需启用/禁用特定中间件
4. 符合 Nitro 最佳实践

### Decision 5: 认证范围策略 - 批量认证

**选择：渐进式批量认证 + 公开接口白名单**

| 方案         | 优点       | 缺点             |
| ------------ | ---------- | ---------------- |
| 全部强制认证 | 安全性最高 | 工作量大、风险高 |
| 渐进式认证   | 风险可控   | 需要维护两套逻辑 |
| 白名单认证   | 实现简单   | 白名单维护复杂   |

**选择理由**：

1. 用户确认"全部接口认证"
2. 使用白名单标识公开接口（通知公告、系统配置等）
3. 其他接口默认需要认证

**公开接口白名单**：

- `/api/*/notice/*` - 通知公告
- `/api/*/public/*` - 公共数据
- `/api/*/system-config/*` - 系统配置

### Decision 6: 数据隔离策略 - 组织+小区级别

**选择：基于组织(Organization) + 小区(Community) 的多层隔离**

```plain
┌─────────────────────────────────────────┐
│           用户角色层次                    │
├─────────────────────────────────────────┤
│ 1. 超级管理员 (Super Admin)              │
│    - 可访问所有组织和小区                 │
├─────────────────────────────────────────┤
│ 2. 组织管理员 (Org Admin)                │
│    - 可访问所管理的组织及下属小区          │
├─────────────────────────────────────────┤
│ 3. 小区管理员 (Community Admin)          │
│    - 可访问所管理的小区                   │
├─────────────────────────────────────────┤
│ 4. 物业员工 (Staff)                    │
│    - 按岗位权限访问所服务的小区            │
├─────────────────────────────────────────┤
│ 5. 业主/住户 (Owner/Resident)          │
│    - 只能访问自己的房产相关数据           │
└─────────────────────────────────────────┘
```

**RLS 策略设计**：

- `authenticate` 角色：所有已认证用户
- `staff` 角色：物业员工（关联组织 ID）
- `owner` 角色：业主（关联房产 ID）
- 动态策略：使用 `current_setting()` 获取当前用户上下文

### Decision 7: 账户迁移策略 - 迁移到 Neon Auth

**选择：批量迁移现有账户到 Neon Auth**

迁移步骤：

1. 导出现有账户（员工、业主）
2. 批量创建 Neon Auth 用户
3. 关联旧系统 ID 与新用户 ID
4. 旧系统账户标记为"已迁移"
5. 平滑切换认证方式

**注意**：密码需要重新设置或使用忘记密码流程

### Decision 8: 用户映射策略 - 字段关联

**选择：在现有业务表中添加 neon_auth_id 字段关联 Neon Auth**

```plain
┌─────────────────────────────────────────────────────────────────────┐
│                     用户数据映射架构                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────┐         ┌──────────────────────────┐       │
│   │   Neon Auth      │         │    业务表 (staffs)       │       │
│   │                  │         │                          │       │
│   │  user.id        │◄────────│  neon_auth_id            │       │
│   │  user.email     │         │  staff_id (保留现有ID)   │       │
│   │  user.name      │         │  organization_id         │       │
│   │  user.metadata  │         │  community_ids []       │       │
│   │                  │         │  role                   │       │
│   └──────────────────┘         └──────────────────────────┘       │
│                                                                     │
│   ┌──────────────────┐         ┌──────────────────────────┐       │
│   │   Neon Auth      │         │    业务表 (owners)        │       │
│   │                  │         │                          │       │
│   │  user.id        │◄────────│  neon_auth_id            │       │
│   │  user.email     │         │  owner_id (保留现有ID)    │       │
│   │  user.name      │         │  property_id             │       │
│   │  user.metadata  │         │  phone                   │       │
│   └──────────────────┘         └──────────────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**实现方式**：

- `staffs.neon_auth_id` → 关联 Neon Auth 用户 ID
- `owners.neon_auth_id` → 关联 Neon Auth 用户 ID
- 保留原有的 `staff_id` / `owner_id` 用于业务关联
- 通过 Neon Auth 用户 ID 查询业务数据时，使用 JOIN 查询

### Decision 9: Token 存储策略 - Cookies + localStorage

**选择：继续使用 Pure Admin 现有的双存储模式**

```plain
┌─────────────────────────────────────────────────────────────────────┐
│                       Token 存储架构                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Cookie (HttpOnly: false)                                  │   │
│  │  - key: authorized-token                                   │   │
│  │  - 存储: { accessToken, refreshToken, expires }          │   │
│  │  - 用途: 请求时自动携带                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  localStorage                                              │   │
│  │  - key: user-info                                         │   │
│  │  - 存储: { accessToken, refreshToken, roles, perms }     │   │
│  │  - 用途: 前端判断登录状态、权限控制                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Token 有效期**：

- Access Token: **15 分钟**（Neon Auth 默认）
- Refresh Token: **30 天**（Neon Auth 默认）

### Decision 10: 登录 API 响应格式 - 适配现有前端

**选择：适配现有 Pure Admin 前端的响应格式**

```typescript
// 请求 /api/auth/sign-in
{
  username: "user@example.com",
  password: "********",
  code: "1234",      // 验证码（可移除）
  uuid: "xxx"         // 验证码UUID（可移除）
}

// 响应
{
  code: 200,
  message: "登录成功",
  data: {
    token: "eyJhbGciOiJIUzI1NiIs...",        // Access Token
    refreshToken: "eyJhbGciOiJIUzI1NiIs...", // Refresh Token
    expiresIn: 1766321585,                    // 过期时间戳
    tokenHead: "Bearer",                      // Token 前缀
    clientId: "comm-manager"                  // 客户端标识（兼容）
  }
}
```

**API 端点设计**：

- `POST /api/auth/sign-in` - 邮箱密码登录
- `POST /api/auth/sign-up` - 用户注册
- `POST /api/auth/sign-out` - 登出
- `POST /api/auth/refresh` - 刷新 Token
- `GET /api/auth/me` - 获取当前用户信息
- `GET /api/auth/oauth/:provider` - OAuth 登录跳转
- `GET /api/auth/callback/:provider` - OAuth 回调处理

### Decision 11: OAuth 登录支持（完整设计）

**选择：支持 Google + GitHub OAuth 登录**

#### 11.1 OAuth 提供商支持

| 提供商 | 开发环境    | 生产环境 | 备注           |
| ------ | ----------- | -------- | -------------- |
| Google | ✅ 默认启用 | 需要配置 | 共享凭证可用   |
| GitHub | ❌ 需要配置 | 需要配置 | 必须自定义凭证 |
| Vercel | ❌ 需要配置 | 需要配置 | 必须自定义凭证 |

#### 11.2 Neon Auth OAuth SDK 集成

```typescript
// server/utils/auth-client.ts
import { createAuthClient } from "@neondatabase/auth";

const authClient = createAuthClient(process.env.NEON_AUTH_BASE_URL!);

export { authClient };
```

#### 11.3 OAuth 登录端点实现

```typescript
// server/api/auth/oauth/[provider].get.ts
import { authClient } from "@/server/utils/auth-client";

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, "provider");

	// 验证 provider 是否支持
	const supportedProviders = ["google", "github", "vercel"];
	if (!supportedProviders.includes(provider)) {
		throw createError({
			statusCode: 400,
			message: `不支持的 OAuth 提供商: ${provider}`,
		});
	}

	// 构建回调 URL
	const baseUrl = getRequestURL(event).origin;
	const callbackURL = `${baseUrl}/api/auth/callback/${provider}`;

	// 发起 OAuth 登录
	// 注意：前端需要监听 Neon Auth 的重定向
	const { url } = await authClient.authorizeOAuth2(provider, {
		redirectTo: callbackURL,
	});

	// 重定向到 OAuth 提供商
	return sendRedirect(event, url);
});
```

#### 11.4 OAuth 回调端点实现

```typescript
// server/api/auth/callback/[provider].get.ts
import { authClient } from "@/server/utils/auth-client";

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, "provider");

	try {
		// 交换 code 获取会话
		const { data, error } = await authClient.exchangeOAuth2Code(provider);

		if (error) {
			console.error("OAuth 回调错误:", error);
			return sendRedirect(event, `/login?error=oauth_failed`);
		}

		// 获取会话信息
		const session = await authClient.getSession();

		if (session.data?.session) {
			// 登录成功，重定向到首页或仪表盘
			return sendRedirect(event, "/");
		} else {
			// 会话创建失败
			return sendRedirect(event, "/login?error=session_failed");
		}
	} catch (error) {
		console.error("OAuth 回调异常:", error);
		return sendRedirect(event, "/login?error=unknown");
	}
});
```

#### 11.5 前端 OAuth 登录实现

```typescript
// 前端调用 OAuth 登录
const handleOAuthLogin = async (provider: "google" | "github") => {
	// 方式一：直接跳转（推荐）
	window.location.href = `/api/auth/oauth/${provider}`;

	// 方式二：使用 Neon Auth SDK
	// await authClient.signIn.social({
	//   provider,
	//   callbackURL: window.location.origin
	// });
};
```

#### 11.6 环境配置要求

**开发环境**：

```bash
# 无需配置即可使用 Google OAuth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

**生产环境**：

1. 在 Neon Console → Settings → Auth 配置 OAuth 凭证
2. Google：配置 Client ID 和 Client Secret
3. GitHub：配置 Client ID 和 Client Secret
4. Vercel：配置 Client ID 和 Client Secret

#### 11.7 错误处理

| 错误类型          | 处理方式   | 重定向 URL                    |
| ----------------- | ---------- | ----------------------------- |
| 用户拒绝授权      | 返回登录页 | `/login?error=denied`         |
| OAuth 提供商错误  | 返回登录页 | `/login?error=provider_error` |
| 会话创建失败      | 返回登录页 | `/login?error=session_failed` |
| 不支持的 Provider | 返回 400   | -                             |

#### 11.8 OAuth 状态保护（可选）

如需 CSRF 保护，可使用 state 参数：

```typescript
// 生成随机 state
const state = crypto.randomUUID();

// 存储到 session 或缓存
await redis.set(`oauth:state:${state}`, userId, { EX: 600 });

// 传递给 OAuth 授权
const { url } = await authClient.authorizeOAuth2(provider, {
	redirectTo: callbackURL,
	state,
});

// 回调时验证
const storedState = await redis.get(`oauth:state:${state}`);
if (storedState !== requestedState) {
	throw createError({ statusCode: 403, message: "CSRF 攻击检测" });
}
```

### Decision 8: 用户角色系统 - 6 层角色体系

**选择：基于业务场景的 6 层角色体系**

```plain
┌─────────────────────────────────────────────────────────────────────┐
│                        智慧社区用户角色体系                            │
├──────────────┬──────────────────────────────────────────────────────┤
│    角色       │                      权限范围                       │
├──────────────┼──────────────────────────────────────────────────────┤
│ 1. 超级管理员  │ 系统全局：可管理所有租户、所有组织、所有小区          │
│    (Super)   │ 无数据隔离限制                                      │
├──────────────┼──────────────────────────────────────────────────────┤
│ 2. 租户管理员  │ 租户级别：可管理所属租户下的所有组织和小区          │
│   (Tenant)   │ 数据隔离：按 tenant_id 隔离                          │
├──────────────┼──────────────────────────────────────────────────────┤
│ 3. 组织管理员  │ 组织级别：可管理所属组织及下属所有小区              │
│    (Org)     │ 数据隔离：按 organization_id 隔离                    │
├──────────────┼──────────────────────────────────────────────────────┤
│ 4. 小区管理员  │ 小区级别：可管理所属小区                           │
│  (Community) │ 数据隔离：按 community_id 隔离                       │
├──────────────┼──────────────────────────────────────────────────────┤
│ 5. 物业员工    │ 岗位级别：按岗位权限访问所服务的小区               │
│    (Staff)   │ 数据隔离：community_id + position_id 双重隔离        │
├──────────────┼──────────────────────────────────────────────────────┤
│ 6. 业主/住户   │ 个人级别：仅能访问自己的房产相关数据               │
│  (Owner/     │ 数据隔离：按 property_id 隔离                        │
│   Resident)  │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

**角色存储方案**：

- 使用 Neon Auth 的 `user.metadata` 存储自定义用户属性
- 或在业务表中维护用户角色映射（如 `staffs`, `owners` 表）

### Decision 9: 数据权限模型 - 4 维权限控制

**选择：组织+房产+职位+数据范围的 4 维权限模型**

```plain
┌─────────────────────────────────────────────────────────────────┐
│                     数据权限控制维度                              │
├─────────────────────────────────────────────────────────────────┤
│ 维度1: 组织隔离 (Organization Isolation)                        │
│   - 组织管理员可访问所属组织及下属所有小区                      │
│   - 实现方式：WHERE organization_id IN (get_user_org_ids())   │
├─────────────────────────────────────────────────────────────────┤
│ 维度2: 小区隔离 (Community Isolation)                          │
│   - 物业员工按岗位分配的小区访问                               │
│   - 实现方式：WHERE community_id IN (get_user_community_ids()) │
├─────────────────────────────────────────────────────────────────┤
│ 维度3: 房产隔离 (Property Isolation)                          │
│   - 业主/住户仅能访问自己的房产数据                            │
│   - 实现方式：WHERE property_id = current_property_id          │
└─────────────────────────────────────────────────────────────────┘
```

**权限优先级**：Organization > Community > Property

### Decision 10: API 权限码标准 - module:action 格式

**选择：统一的 API 权限码命名规范**

```plain
权限码格式：{module}:{action}

模块 (module) 命名规则：
- 使用业务模块英文名（不超过 20 字符）
- 多个单词用下划线分隔
- 示例：community, expense, patrol, repair, parking, contract

动作 (action) 命名规则：
- create  - 新增
- read    - 查询
- update  - 修改
- delete  - 删除
- export  - 导出
- import  - 导入
- approve - 审批

完整示例：
- community:read      - 查看小区
- community:create   - 创建小区
- expense:approve    - 审批费用
- patrol:read        - 查看巡检记录
- repair:update      - 处理报修
```

**权限码存储**：

- 存储在用户角色的 `permissions` 字段（JSON 数组）
- 或存储在独立的权限配置表中

### Decision 11: 单租户数据架构 - Organization + Community 两层结构

**选择：Organization → Community 的两层嵌套架构（单租户模式）**

```plain
┌─────────────────────────────────────────────────────────────────────┐
│                      单租户数据架构（两层）                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Organization (组织) - 物业公司/总公司                      │   │
│  │  - 组织ID: organization_id                                  │   │
│  │  - 组织名称: organization_name                               │   │
│  │  - 上级组织: parent_id (自关联，支持多级)                  │   │
│  │  - 包含 N 个 Community                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Community (小区) - 最小管理单元                             │   │
│  │  - 小区ID: community_id                                    │   │
│  │  - 组织ID: organization_id (外键)                          │   │
│  │  - 小区名称: community_name                                 │   │
│  │  - 小区地址: community_address                              │   │
│  │  - 包含 N 个 Property                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Property (房产) - 业主/住户拥有                             │   │
│  │  - 房产ID: property_id                                     │   │
│  │  - 小区ID: community_id (外键)                            │   │
│  │  - 房产编号: property_no                                    │   │
│  │  - 业主ID: owner_id (关联用户)                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**RLS 策略示例**：

```sql
-- 组织级别隔离策略
CREATE POLICY "organization_isolation_policy" ON communities
  FOR ALL
  USING (
    organization_id = current_setting('app.current_organization_id', true)::uuid
  );

-- 小区级别隔离策略
CREATE POLICY "community_isolation_policy" ON expenses
  FOR ALL
  USING (
    community_id = current_setting('app.current_community_id', true)::uuid
  );
```

**说明**：

- 无需 Tenant 层级（单租户）
- 保留 Organization + Community 两层管理结构
- 适合单个物业公司管理多个小区的场景

## Risks / Trade-offs

### Risk 1: Neon Auth 区域限制

**问题**: Neon Auth 仅支持 AWS 区域，不支持 Azure
**影响**: 如果项目部署在 Azure 环境，需要替代方案
**缓解**: 记录此限制，Azure 部署时切换到自托管 Better Auth

### Risk 2: JWT Token 刷新

**问题**: Neon Auth access token 有效期仅 15 分钟
**影响**: 前端需要频繁刷新 Token
**缓解**: 实现自动刷新机制，使用 Refresh Token

### Risk 3: 100+ 接口批量认证风险

**问题**: 一次性修改所有接口风险极高
**影响**: 可能导致全面服务中断
**缓解**:

- 使用中间件统一认证，避免逐个修改
- 先在测试环境全面验证
- 灰度发布逐步开放

### Risk 4: 数据隔离复杂度

**问题**: 组织+小区的多层隔离增加实现复杂度
**影响**: RLS 策略可能非常复杂
**缓解**:

- 使用 Drizzle 的 `sql` 模板定义复杂策略
- 分离不同角色的策略到不同表
- 充分测试各种场景

### Risk 5: 账户迁移数据丢失

**问题**: 迁移过程中可能丢失用户数据
**影响**: 用户无法登录或数据丢失
**缓解**:

- 迁移前完整备份
- 双轨运行一段时间
- 回滚预案准备

### Risk 6: RLS 性能影响

**问题**: RLS 策略可能影响查询性能
**影响**: 复杂策略可能导致查询变慢
**缓解**:

- 定期分析查询计划
- 优化 RLS 策略（避免子查询）
- 必要时使用物化视图

## Migration Plan

### Phase 1: 基础配置（Week 1）

1. 在 Neon Console 启用 Auth 功能
2. 配置环境变量 `NEON_AUTH_BASE_URL`
3. 安装依赖 `@neondatabase/auth`、`jose`
4. 创建基础中间件框架

### Phase 2: 认证流程（Week 2）

1. 实现 JWT 验证中间件
2. 创建登录/登出 API 路由
3. 集成 Neon Auth SDK
4. 前端登录页面集成

### Phase 3: 数据安全（Week 3）

1. 在用户相关表添加 RLS 策略
2. 实现数据隔离逻辑
3. 添加敏感数据保护

### Phase 4: 灰度发布（Week 4）

1. 开放部分接口进行测试
2. 收集日志和反馈
3. 逐步开放更多接口
4. 监控异常访问

### Rollback Strategy

如果出现问题：

1. 禁用认证中间件（注释掉中间件注册）
2. Neon Console 禁用 Auth 功能
3. 回滚数据库迁移（RDS 快照）

## Open Questions

### Q1: Session 存储方案？

**已解答**：当前使用 Neon Auth 托管 Session，默认使用 HTTP-only cookies 存储在客户端。Neon Auth 会话数据存储在 `neon_auth` schema 的数据库表中。

- 如需分布式 Session，可考虑 Redis 存储（但当前非必需）
- 后续如需扩展，可使用 Neon Auth 的自定义 Session 存储功能

### Q2: 密码策略？

**已解答**：密码策略由 Neon Auth 托管服务提供，默认包含：

- 最小长度要求
- 登录尝试限制

如需自定义密码复杂度，可在 Neon Console 中配置或使用自定义验证规则。

### Q3: 公开接口完整性？

**已解答**：

- 白名单路径（无需认证）：`/api/*/notice/*`, `/api/*/public/*`, `/api/*/system-config/*`
- 其他所有接口默认需要认证
- OAuth 回调路径：`/api/auth/callback/*`

### Q4: 迁移回滚预案？

**已解答**：

1. 迁移前完整备份现有账户数据
2. 保留旧账户 ID 与新用户 ID 映射表
3. 双轨运行一段时间（支持两种登录方式）
4. 回滚时：切换回旧认证，映射表保持兼容

### Q5: 多租户 vs 单租户？

**已确认**：智慧社区系统为**单租户模式**（单个物业公司管理多个小区）

- 使用 Organization + Community 两层架构
- 移除 Tenant 层级
- 简化 RLS 策略（无需租户隔离）
