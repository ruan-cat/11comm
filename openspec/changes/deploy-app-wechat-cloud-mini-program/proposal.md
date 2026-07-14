## Why

`apps/app` 已经具备 uni-app 微信小程序构建基础，但缺少可执行、可审计、可回滚的微信云小程序部署方案。当前更大的风险不是单个命令缺失，而是 CloudBase、微信登录、Nitro API、合法域名、Vercel H5 部署链路和密钥边界容易被混在一起，导致未来实现时把登录主链路放错位置、泄露微信密钥、误把上传当正式发布，或破坏已有 H5/Vercel 构建。

本变更把用户确认的 A 方案固化为 OpenSpec 任务：微信小程序登录和受保护 API 统一落在 `apps/api` Nitro，CloudBase 只作为小程序云开发环境关联、预览/上传/发布辅助和 AI/MCP/运维工具层。

## What Changes

- 新增微信云小程序部署能力规划，覆盖 `apps/app` 的 `mp-weixin` 生产构建、产物验收、预览、上传、发布门禁、微信后台合法域名、CloudBase 环境关联和回滚证据。
- 明确 `apps/api` Nitro 是微信小程序登录主链路承载方，包含 `wx.login` code 入参、服务端 `code2Session`、Nitro 自有 token 签发、refresh、logout、me、Bearer scoped auth、actor/role/tenant 上下文和受保护业务 API。
- 明确 CloudBase 的职责边界：允许环境关联、发布辅助、AI/MCP/运维工具；禁止承载 login 云函数、禁止获取 openid/session_key、禁止作为主业务 API、主数据库或主文件存储。
- 明确本项目允许恢复一部分鉴权能力，但只能是 Nitro scoped auth allowlist，禁止无设计全局鉴权。
- 规划项目级 `miniprogram-ci` 或 CloudBase CLI/MCP 工具接入方式，禁止全局安装工具包。
- 将微信后台合法域名配置纳入任务：request 域名使用 `apps/api/package.json` 的 `homepage`，upload/download/socket 只在实际功能需要时配置。
- 保护现有 H5/Vercel 部署链路：不得修改 `apps/app` 的 Windows ESM loader、`build:h5:prod`、`build:vercel`、`.vercel/output` 搬运链路，不得新增或恢复任何 `vercel.json`。
- 不把 Neon Auth 作为微信小程序登录主方案；Neon/Drizzle 仍作为数据与账号映射的后端能力，由 Nitro 服务端按 scoped auth 设计调用。

## Capabilities

### New Capabilities

- `wechat-cloud-mini-program-deployment`: 定义 `apps/app` 微信云小程序部署、CloudBase 边界、微信后台合法域名、构建产物、预览上传、发布门禁、密钥与回滚证据。

### Modified Capabilities

- `nitro-auth-middleware`: 收紧并细化微信小程序登录必须由统一 Nitro 服务承接的接口契约、token 语义、scoped auth 边界和 CloudBase 禁区。
- `unified-nitro-api-consolidation`: 将微信云小程序部署纳入统一 Nitro runtime governance，明确小程序部署不得绕过或削弱 `apps/api` 作为唯一长期 API 服务目标。

## Impact

- `apps/app`：微信小程序 manifest/env、`mp-weixin` 构建脚本、登录 API 调用、token store、请求拦截器、微信小程序登录入口、构建产物、预览上传脚本和部署文档。
- `apps/api`：Nitro 微信登录路由、`code2Session` 服务端调用、scoped auth allowlist、token 签发/刷新/注销/me、actor/role/tenant 上下文、请求日志脱敏、受保护业务 API 约束。
- 微信公众平台：小程序 AppID、代码上传密钥、IP 白名单、request/uploadFile/downloadFile/socket 合法域名、开发版 robot、体验版、提交审核和发布流程。
- CloudBase：环境 ID、环境查询、环境关联、MCP/CLI 运维辅助和发布辅助；不进入登录主链路、不成为主 API/DB/存储。
- Vercel/H5：仅作为被保护的既有链路参与回归验证，不作为本变更的小程序发布路径。
- 安全与配置：`WECHAT_MP_SECRET`、微信 `session_key`、小程序代码上传私钥、CI secrets、前端 `VITE_*` 公开变量、生产域名和日志脱敏策略。
