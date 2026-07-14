## MODIFIED Requirements

### Requirement: 微信小程序登录由 Nitro 承接

系统 SHALL 将微信小程序登录、`code2Session`、token 签发、刷新、logout、me 能力落在统一 `apps/api` Nitro 服务内。本轮不采用 Neon Auth 作为小程序登录主方案。系统 SHALL 允许恢复一部分鉴权能力，但只能通过 Nitro scoped auth allowlist 管理，普通公开路由默认公开。微信小程序端只提交 `wx.login` / `uni.login` 产生的临时 `code`，Nitro 服务端负责调用微信 `code2Session`、建立 actor、签发 access token 和 refresh token，并向后续受保护业务 API 提供 `event.context.actor`、role、tenant 上下文。

#### Scenario: 小程序 code2Session 登录

- **WHEN** 小程序端提交微信 login code
- **THEN** Nitro SHALL 在服务端调用微信 `code2Session`，根据返回的 openid/unionid 建立 actor，并签发 Nitro 自有登录态 token；`WECHAT_MP_SECRET` 和微信 `session_key` 不得下发前端或写入日志

#### Scenario: CloudBase 边界

- **WHEN** 后续任务配置 CloudBase
- **THEN** CloudBase SHALL 只作为小程序云开发环境关联、发布、AI/MCP/运维工具层，不承载 login 云函数、不获取 openid、不作为主业务 API、主数据库或主文件存储

#### Scenario: App 端只提交 code 字段

- **WHEN** `apps/app` 在微信小程序环境调用登录接口
- **THEN** App SHALL 从 `uni.login` / `wx.login` 返回值中提取 `res.code` 并提交 `{ code: res.code }`，不得把完整 `UniApp.LoginRes` 对象作为登录请求体

#### Scenario: 受保护业务 API 使用 Bearer token

- **WHEN** 已登录小程序调用 scoped auth allowlist 内的受保护 API
- **THEN** 请求 SHALL 携带 Nitro 签发的 `Authorization: Bearer access-token` 形式的请求头，scoped auth SHALL 解析 actor/role/tenant context 并放行

#### Scenario: 公开路由不因缺少 token 失败

- **WHEN** 未登录小程序访问普通公开路由或 legacy app fallback 路由
- **THEN** Nitro SHALL 默认跳过认证检查，不得因为未携带 Bearer token 返回 401

## ADDED Requirements

### Requirement: 微信登录接口契约

系统 SHALL 为微信小程序登录提供稳定接口契约。登录请求体 SHALL 至少包含 `code`；响应 SHALL 返回本项目自有 token 信息和用户摘要；响应 MUST NOT 包含微信 `session_key`、`WECHAT_MP_SECRET`、小程序代码上传私钥或原始微信敏感响应全文。

#### Scenario: 登录成功响应

- **WHEN** Nitro 成功完成 `code2Session` 并建立 actor
- **THEN** 响应 SHALL 返回 access token、refresh token、过期时间和用户摘要，并且不得返回微信 `session_key`

#### Scenario: 登录失败响应

- **WHEN** 微信 `code2Session` 返回错误或 code 已过期
- **THEN** Nitro SHALL 返回可诊断但脱敏的错误响应，并不得把 `WECHAT_MP_SECRET`、`session_key`、完整请求 URL 或 access token 写入日志

### Requirement: App Bearer token 来源一致

系统 SHALL 在 `apps/app` 内保持登录返回 token、持久化 token、请求拦截器 Bearer 注入和 refresh 行为的事实源一致。受保护 API 的 Authorization 头 SHALL 来自 token store 或明确同步后的唯一 token 字段，不得依赖漂移的 user store token 字段。

#### Scenario: 登录后调用受保护 API

- **WHEN** 微信登录成功后立即调用受保护 API
- **THEN** 请求拦截器 SHALL 注入刚签发的 access token，Nitro scoped auth SHALL 能解析 actor context

#### Scenario: access token 过期

- **WHEN** access token 过期且 refresh token 仍有效
- **THEN** App SHALL 调用 Nitro refresh 接口获取新 access token，并用新 token 重试或继续后续受保护请求
