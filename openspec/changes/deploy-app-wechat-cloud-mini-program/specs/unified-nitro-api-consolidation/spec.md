## MODIFIED Requirements

### Requirement: Nitro runtime governance

统一 `apps/api` runtime MUST 使用 Nitro v3/H3 规范：H3 API 从 `nitro/h3` 导入，禁止直接从 `h3` 导入；禁止无设计地给所有接口套全局鉴权；允许在 scoped auth allowlist 范围内实现 admin 登录、小程序登录、Bearer access token、refresh token、logout、me、受保护业务 API，以及 `actor` / `role` / `tenant` 上下文；本轮不以 Neon Auth 承接小程序登录主方案；微信小程序登录、`code2Session`、token 签发、refresh、logout、me 和受保护业务 API MUST 落在统一 `apps/api` Nitro 服务内；CloudBase MUST 只作为小程序云开发环境关联、预览/上传/发布辅助、AI/MCP/运维工具层，不得承载 login 云函数、不得获取 openid/session_key、不得作为主业务 API、主数据库或主文件存储；配置通过 runtimeConfig/env 管理；不得在模块顶层创建 Neon/Drizzle 连接；CORS、日志、监控、错误追踪、admin/app API base URL、auth allowlist、微信合法域名、CloudBase 边界和 fallback 策略必须作为 runtime governance 证据记录。

#### Scenario: 新增 apps/api handler

- **WHEN** 后续代理新增或修改 `apps/api` route handler
- **THEN** handler 必须只做参数读取、运行时组装、错误包装和响应输出，业务逻辑进入 service/repository/adapter；普通业务接口默认公开，只有进入 scoped auth allowlist 的 handler 才能读取 `event.context.actor` 并执行受保护 API 的 actor/role/tenant 检查

#### Scenario: 小程序登录与 scoped auth 边界

- **WHEN** 后续代理实现微信小程序登录、`code2Session`、token 签发、刷新、logout、me 或受保护业务 API
- **THEN** 这些能力必须落在统一 `apps/api` Nitro 服务内，使用 scoped auth allowlist 管理保护范围；CloudBase 只能作为小程序云开发环境关联、发布、AI/MCP/运维工具层，不承载 login 云函数、不获取 openid、不作为主业务 API、主数据库或主文件存储；`WECHAT_MP_SECRET` 和微信 `session_key` 不得下发前端或写入日志

#### Scenario: 修改运行时配置

- **WHEN** 后续代理修改 runtimeConfig、env、CORS、日志、监控、错误追踪或 base URL 策略
- **THEN** 必须记录 local-dev 与 production 的配置来源、验证命令和回退影响

#### Scenario: 微信云小程序部署接入 Nitro

- **WHEN** `apps/app` 微信小程序体验版或开发版请求登录、refresh、me、logout 或受保护业务 API
- **THEN** 请求目标 MUST 使用 `apps/api/package.json` 的 `homepage` 所代表的统一 Nitro API 域名，当前为 `https://01s-11-server.ruan-cat.com`，不得绕到 CloudBase 云函数或旧 app 内置 Nitro 作为主链路

#### Scenario: 小程序部署不改变 H5 Vercel 入口

- **WHEN** 后续代理为微信小程序新增构建、预览、上传或 CloudBase 辅助配置
- **THEN** 不得修改 `apps/app` 的 `build:h5:prod` Windows loader、`build:vercel`、`.vercel/output` 搬运链路，不得新增或恢复任何 `vercel.json`

## ADDED Requirements

### Requirement: 微信小程序生产域名来源

系统 SHALL 从各子项目 `package.json` 的 `homepage` 字段读取生产域名。微信小程序 request 合法域名和 App production API base URL SHALL 以 `apps/api/package.json` 的 `homepage` 为权威来源；App H5 生产地址 SHALL 以 `apps/app/package.json` 的 `homepage` 为权威来源；不得从历史报告、截图、旧域名或 CloudBase 控制台反推生产域名。

#### Scenario: 配置 request 合法域名

- **WHEN** 后续任务配置微信公众平台 request 合法域名
- **THEN** 必须先读取 `apps/api/package.json` 的 `homepage`，并使用该值对应的域名配置微信后台

#### Scenario: 更新生产域名

- **WHEN** 生产 API 域名发生变化
- **THEN** 必须先更新 `apps/api/package.json` 的 `homepage`，再同步 App env、微信后台合法域名、部署文档和验证记录
