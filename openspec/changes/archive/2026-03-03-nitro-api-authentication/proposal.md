## Why

当前项目的 Nitro 接口完全开放，无任何认证授权机制，所有 API 可被任意访问，存在严重的数据安全隐患。随着业务发展，接口暴露的用户敏感数据（业主信息、房产数据、财务数据等）面临被未授权访问的风险。现在是实施安全认证方案的最佳时机，因为：

1. Neon 已提供成熟的托管认证服务 (Neon Auth)
2. Nitro + H3 提供了完善的中间件和 hooks 机制
3. Drizzle ORM 支持声明式 RLS 策略配置

## What Changes

- 集成 Neon Auth (Better Auth) 托管认证服务
- 创建 Nitro 中间件实现 JWT Token 验证
- 在 Drizzle Schema 中配置 Row Level Security (RLS) 策略
- 为敏感 API 路由添加角色权限检查
- 添加环境变量配置和安全最佳实践

## Capabilities

### New Capabilities

- **neon-auth-integration**: Neon Auth 认证服务集成，包括环境配置、SDK 集成和 JWT 验证
- **nitro-auth-middleware**: Nitro 中间件级别认证，实现 Token 解析和用户上下文注入
- **drizzle-rls-policies**: Drizzle ORM 行级安全策略配置，实现数据层面的访问控制

### Modified Capabilities

- 无（现有规格无变更）

## Impact

- **受影响代码**：
  - `apps/admin/nitro.config.ts` - 新增认证配置
  - `apps/admin/server/middleware/` - 新增认证中间件
  - `apps/type/src/` - 新增 RLS 策略定义
  - `apps/admin/.env*` - 新增认证相关环境变量

- **依赖项**：
  - `@neondatabase/auth` - Neon Auth SDK
  - `jose` - JWT 验证库
  - `drizzle-orm` - 需升级到支持 RLS 的版本

- **系统**：
  - Nitro 服务端 API
  - Neon 数据库
  - 前端登录认证流程
