# nitro-auth-middleware Specification

## Purpose

TBD - created by archiving change nitro-api-authentication. Update Purpose after archive.

## Requirements

### Requirement: Scoped Nitro Auth 解析中间件

系统 SHALL 在统一 `apps/api` Nitro 服务内实现 scoped auth 解析能力。普通公开路由默认跳过认证检查；只有明确进入 scoped auth allowlist 的 admin 登录、小程序登录、Bearer access token、refresh token、logout、me 和受保护业务 API 才能启用局部鉴权。系统 SHALL 使用 `event.context.actor` 传递 actor/role/tenant 上下文，actor 上下文字段是后续 handler 的唯一鉴权事实源。

#### Scenario: 有效 Bearer access token 请求

- **WHEN** allowlist 范围内的受保护请求包含有效的 `Authorization: Bearer <accessToken>` 头
- **THEN** scoped auth SHALL 在 `event.context.actor` 中设置 actorId、role、tenantId、登录来源和必要的权限信息，并放行请求

#### Scenario: 公开路由无 token 请求

- **WHEN** 普通公开路由请求不包含 Authorization 头
- **THEN** scoped auth SHALL 跳过认证检查并正常放行，且不得因为缺少 actor 而返回 401

#### Scenario: 受保护路由无 token 请求

- **WHEN** allowlist 范围内的受保护 API 请求不包含 Authorization 头
- **THEN** scoped auth SHALL 返回 401 未授权错误

#### Scenario: 无效 access token 请求

- **WHEN** allowlist 范围内的受保护请求包含无效或过期的 access token
- **THEN** scoped auth SHALL 返回 401 错误响应，且不得把 token、`WECHAT_MP_SECRET` 或微信 `session_key` 写入日志

### Requirement: 受保护路由 allowlist

系统 SHALL 只对明确列入 allowlist 的受保护路由实施认证保护，不得把鉴权中间件无设计地套到全部接口。公开路由默认跳过 scoped auth。

#### Scenario: 访问受保护路由 - 已登录

- **WHEN** 已登录用户访问受保护的 API 路由
- **THEN** 系统 SHALL 正常返回请求的数据

#### Scenario: 访问受保护路由 - 未登录

- **WHEN** 未登录用户访问受保护的 API 路由
- **THEN** 系统 SHALL 返回 401 未授权错误

### Requirement: 公开路由白名单

系统 SHALL 支持配置无需认证即可访问的公开路由，并将公开路由作为默认行为。

#### Scenario: 访问公开路由

- **WHEN** 用户访问白名单中的路由（如 `/api/public/*`）
- **THEN** 系统 SHALL 跳过认证检查并正常响应

#### Scenario: 配置白名单

- **WHEN** 管理员在配置文件中添加路径到白名单
- **THEN** 系统 SHALL 对匹配路径跳过认证中间件

### Requirement: 用户上下文传递

系统 SHALL 将已验证的 actor 信息传递到后续路由处理器。

#### Scenario: 路由处理器获取用户信息

- **WHEN** scoped auth 验证通过后，路由处理器访问 `event.context.actor`
- **THEN** 处理器 SHALL 能够获取 actorId、role、tenantId、登录来源和必要的权限信息

### Requirement: 微信小程序登录由 Nitro 承接

系统 SHALL 将微信小程序登录、`code2Session`、token 签发、刷新、logout 和 me 能力落在统一 `apps/api` Nitro 服务内。本轮不采用 Neon Auth 作为小程序登录主方案。

#### Scenario: 小程序 code2Session 登录

- **WHEN** 小程序端提交微信 login code
- **THEN** Nitro SHALL 在服务端调用微信 `code2Session`，根据返回的 openid/unionid 建立 actor，并签发 Nitro 自有登录态 token；`WECHAT_MP_SECRET` 和微信 `session_key` 不得下发前端或写入日志

#### Scenario: CloudBase 边界

- **WHEN** 后续任务配置 CloudBase
- **THEN** CloudBase SHALL 只作为小程序云开发环境关联、发布、AI/MCP/运维工具层，不承载 login 云函数、不获取 openid、不作为主业务 API、主数据库或主文件存储

### Requirement: 请求日志记录

系统 SHALL 记录每个 API 请求的基本信息。

#### Scenario: 记录请求日志

- **WHEN** 任意请求进入系统
- **THEN** 系统 SHALL 记录请求时间、方法、路径和 actor 状态，但不得记录 access token、refresh token、`WECHAT_MP_SECRET` 或微信 `session_key`

### Requirement: Token 刷新

系统 SHALL 支持使用 refresh token 获取新的 access token，作为 Nitro 自有登录态机制的一部分。

#### Scenario: 刷新 Token 成功

- **WHEN** 用户提交有效的 refresh token
- **THEN** 系统 SHALL 返回新的 access token，并保持 actor/role/tenant 上下文一致

#### Scenario: 刷新 Token 失败

- **WHEN** 用户提交无效或过期的 refresh token
- **THEN** 系统 SHALL 返回 401 错误提示重新登录
