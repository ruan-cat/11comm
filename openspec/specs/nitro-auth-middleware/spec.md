# nitro-auth-middleware Specification

## Purpose

TBD - created by archiving change nitro-api-authentication. Update Purpose after archive.

## Requirements

### Requirement: JWT Token 解析中间件

系统 SHALL 实现 Nitro 中间件用于解析 HTTP 请求中的 JWT Token。

#### Scenario: 有效 Token 请求

- **WHEN** 请求包含有效的 `Authorization: Bearer <token>` 头
- **THEN** 中间件 SHALL 在 `event.context.auth` 中设置用户信息并放行请求

#### Scenario: 无 Token 请求

- **WHEN** 请求不包含 Authorization 头
- **THEN** 中间件 SHALL 在 `event.context.auth` 中设置 `isAuthenticated: false`

#### Scenario: 无效 Token 请求

- **WHEN** 请求包含无效或过期的 Token
- **THEN** 中间件 SHALL 返回 401 错误响应

### Requirement: 受保护路由

系统 SHALL 支持对特定路由实施认证保护。

#### Scenario: 访问受保护路由 - 已登录

- **WHEN** 已登录用户访问受保护的 API 路由
- **THEN** 系统 SHALL 正常返回请求的数据

#### Scenario: 访问受保护路由 - 未登录

- **WHEN** 未登录用户访问受保护的 API 路由
- **THEN** 系统 SHALL 返回 401 未授权错误

### Requirement: 公开路由白名单

系统 SHALL 支持配置无需认证即可访问的路由白名单。

#### Scenario: 访问公开路由

- **WHEN** 用户访问白名单中的路由（如 `/api/public/*`）
- **THEN** 系统 SHALL 跳过认证检查并正常响应

#### Scenario: 配置白名单

- **WHEN** 管理员在配置文件中添加路径到白名单
- **THEN** 系统 SHALL 对匹配路径跳过认证中间件

### Requirement: 用户上下文传递

系统 SHALL 将已验证的用户信息传递到后续路由处理器。

#### Scenario: 路由处理器获取用户信息

- **WHEN** 认证中间件验证通过后，路由处理器访问 `event.context.auth`
- **THEN** 处理器 SHALL 能够获取 `userId`、`email`、`role` 等信息

### Requirement: 请求日志记录

系统 SHALL 记录每个 API 请求的基本信息。

#### Scenario: 记录请求日志

- **WHEN** 任意请求进入系统
- **THEN** 系统 SHALL 记录请求时间、方法、路径和用户状态

### Requirement: Token 刷新

系统 SHALL 支持使用 Refresh Token 获取新的 Access Token。

#### Scenario: 刷新 Token 成功

- **WHEN** 用户提交有效的 Refresh Token
- **THEN** 系统 SHALL 返回新的 Access Token

#### Scenario: 刷新 Token 失败

- **WHEN** 用户提交无效或过期的 Refresh Token
- **THEN** 系统 SHALL 返回 401 错误提示重新登录
