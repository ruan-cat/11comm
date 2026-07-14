## 1. 基线盘点与任务冻结

- [x] 1.1 读取 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`，确认本任务采用 A 方案：微信登录与受保护 API 全部落在 Nitro，CloudBase 只做环境和发布辅助。
- [x] 1.2 读取 `.claude/skills/nitro-api-development/SKILL.md`，确认 H3 从 `nitro/h3` 导入、runtimeConfig/env、数据库连接和 scoped auth 边界。
- [x] 1.3 读取 `.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md` 及相关事故文件，特别确认 Windows H5 构建 loader 和 Vercel monorepo `vercel.json` 污染事故。
- [x] 1.4 读取 `apps/app/package.json`，记录 `homepage=https://01s-11-app.ruan-cat.com`、`build:mp:prod`、`build:mp-weixin`、`build:h5:prod`、`build:vercel` 当前值。
- [x] 1.5 读取 `apps/api/package.json`，记录 `homepage=https://01s-11-server.ruan-cat.com`、Nitro build/test/typecheck 脚本当前值。
- [x] 1.6 读取 `apps/app/manifest.config.ts` 和 `apps/app/env/.env*`，确认 `VITE_WX_APPID`、`VITE_SERVER_BASEURL`、`VITE_11COMM_API_BASE_URL`、production API base URL 和是否已有 CloudBase env 公开配置。
- [x] 1.7 读取 `apps/app/src/api/login.ts`、`apps/app/src/store/token.ts`、`apps/app/src/http/interceptor.ts`、`apps/app/src/pages/me/me.vue`，列出现有微信登录、token 存储、Bearer 注入和页面入口缺口。
- [x] 1.8 读取 `apps/api/nitro.config.ts` 和 `apps/api/server/**` 登录相关 routes，确认是否存在旧“禁止 JWT/Token”注释、是否缺失 `/auth/wxLogin`、refresh、logout、me 路由。
- [x] 1.9 检查仓库是否存在根目录或子项目 `vercel.json`；若存在，先确认是否为用户已有改动，不得擅自删除，必须在任务风险中记录。
- [x] 1.10 建立本任务证据目录或报告位置，用于记录命令输出、微信后台截图、二维码、上传结果、域名配置和回滚证据。

## 2. 账号、权限与密钥准备

- [ ] 2.1 确认微信小程序 AppID 与 `VITE_WX_APPID` 一致；如果不一致，先明确哪个 AppID 是生产目标。
- [ ] 2.2 在微信公众平台确认当前账号具备开发者、体验版管理、代码上传、提交审核或发布所需权限。
- [ ] 2.3 在微信公众平台生成或确认小程序代码上传密钥，并记录密钥创建时间、用途和保管位置；不得把私钥内容写入仓库。
- [ ] 2.4 配置或确认小程序代码上传 IP 白名单；若 CI runner IP 不固定，记录风险例外和人工处理策略。
- [x] 2.5 规划 `miniprogram-ci` robot 槽位：例如 preview 使用 robot 1，CI upload 使用 robot 2，人工应急上传使用 robot 3，并写入部署文档。
- [x] 2.6 确认 `WECHAT_MP_SECRET` 只进入 `apps/api` 服务端运行环境或 CI secret，不进入 `apps/app/env/**`、`VITE_*`、前端 bundle、Markdown 日志或截图。
- [x] 2.7 确认 CloudBase env ID、TencentCloud SecretId/SecretKey/SessionToken 的用途，仅用于环境查询或发布辅助，不用于登录主链路。
- [x] 2.8 设计 CI secret 命名：微信 AppID、微信 AppSecret、上传私钥、privateKeyPath、robot、CloudBase env、TencentCloud 凭据分别命名，不复用含义。
- [x] 2.9 设计密钥日志脱敏规则，确保任何失败输出不打印 AppSecret、session_key、private key、access token、refresh token。

## 3. App manifest 与环境变量

- [x] 3.1 确认 `manifest.config.ts` 的 `mp-weixin.appid` 只读取公开 AppID，不读取服务端 secret。
- [ ] 3.2 若需要 CloudBase env ID 作为前端公开配置，只新增公开 env key，并明确它不具备服务端权限。
- [ ] 3.3 若新增公开 env key，同步更新 `apps/app/src/env.d.ts` 或项目现有 env 类型声明。
- [x] 3.4 确认 `apps/app/env/.env.production` 的 `VITE_SERVER_BASEURL` 与 `VITE_11COMM_API_BASE_URL` 均指向 `https://01s-11-server.ruan-cat.com`。
- [x] 3.5 判断开发环境是否需要把 `VITE_SERVER_BASEURL` 从旧 Laf 地址切到本地或远程 Nitro；如果改动，必须记录本地开发、体验版和生产三种模式差异。
- [x] 3.6 禁止新增 `VITE_WECHAT_MP_SECRET`、`VITE_SESSION_KEY`、`VITE_PRIVATE_KEY` 等会泄露服务端密钥的变量。
- [x] 3.7 构建前扫描 `apps/app/env/**`，确认没有真实 `WECHAT_MP_SECRET`、session_key、代码上传私钥、access token、refresh token。

## 4. Nitro 微信登录与 scoped auth 设计

- [x] 4.1 更新 `apps/api/nitro.config.ts` 中与“禁止 JWT/Token”冲突的旧注释，改为“禁止无设计全局鉴权，允许 scoped auth allowlist”口径。
- [x] 4.2 设计 Nitro 微信登录 route 路径，并与 App 当前 `/auth/wxLogin`、`/auth/refreshToken`、`/auth/logout`、`/user/info` 调用对齐；如果改成 `/api/auth/**`，必须同一任务内修改 App 调用端。
- [x] 4.3 实现微信登录请求验证：请求体必须包含非空 `code`，不得接收完整 `UniApp.LoginRes` 对象作为业务输入。
- [x] 4.4 在 Nitro 服务端调用微信 `code2Session`，从 runtimeConfig/env 读取 AppID 与 `WECHAT_MP_SECRET`，不得在模块顶层固化 secret。
- [x] 4.5 对微信 `code2Session` 错误码建立脱敏错误映射，返回可诊断错误但不输出完整请求 URL、secret、session_key。
- [x] 4.6 设计 openid/unionid 到本项目 actor 的映射策略，明确 actorId、role、tenantId、登录来源和默认权限来源。
- [x] 4.7 签发 Nitro 自有 access token 和 refresh token，明确过期时间、刷新策略、吊销策略和日志脱敏。
- [x] 4.8 实现或补齐 refresh token 路由，成功时返回新 access token 并保持 actor/role/tenant 上下文一致。
- [ ] 4.9 实现或补齐 logout 路由，清理或吊销服务端登录态，并允许 App 本地兜底清理 token。
- [x] 4.10 实现或补齐 me/user info 路由，返回用户摘要，不返回 openid/session_key 原文，除非明确经过脱敏或业务字段映射。
- [x] 4.11 实现 scoped auth allowlist，只有登录相关、me、refresh、logout 和明确受保护业务 API 进入认证边界。
- [x] 4.12 确认普通公开 API、legacy `/app/**`、`/callComponent/**` 默认不因缺少 token 返回 401。
- [x] 4.13 将 actor/role/tenant 写入 `event.context.actor`，并将其作为受保护 handler 的唯一鉴权事实源。
- [ ] 4.14 增加请求日志脱敏，确保 access token、refresh token、`WECHAT_MP_SECRET`、session_key、private key 不进入日志。

## 5. App 微信登录调用端迁移

- [x] 5.1 修正 `apps/app/src/api/login.ts` 的 `getWxCode()` 使用方式，确保 store 只提交 `{ code: res.code }`。
- [x] 5.2 修正 `apps/app/src/store/token.ts` 的 `wxLogin()`，不得把 `UniApp.LoginRes` 整对象传给 `_wxLogin`。
- [x] 5.3 对齐 `IAuthLoginRes` 类型和 Nitro 登录响应字段，明确单 token 或双 token 模式与当前 `VITE_AUTH_MODE` 的关系。
- [x] 5.4 统一 token 事实源，确保请求拦截器 Bearer 注入读取 token store 或明确同步后的唯一字段，不再依赖漂移的 `userInfo.token`。
- [x] 5.5 更新 refresh token 调用，确保 access token 过期且 refresh token 有效时可以刷新并继续后续受保护请求。
- [x] 5.6 更新 logout 行为，确保无论 Nitro logout 成功或失败，App 本地都清理 token、过期时间和用户信息。
- [x] 5.7 更新 `apps/app/src/pages/me/me.vue` 的微信小程序登录入口，验证 `MP-WEIXIN` 下点击登录走 token store 的微信登录流程。
- [ ] 5.8 明确 `apps/app/src/router/config.ts` 的页面登录策略与 API scoped auth 是不同层级；不得因为恢复 scoped auth 就强制全站页面登录。
- [ ] 5.9 为微信登录失败、code 为空、用户取消、网络失败、401、refresh 失败设计前端提示和回退路径。

## 6. 受保护业务 API 选择与迁移

- [ ] 6.1 列出本轮必须受保护的业务 API，区分登录必需接口、me/logout/refresh 和真正业务 API。
- [ ] 6.2 对每个受保护 API 说明 actorId、role、tenantId 需要如何影响查询或写入。
- [ ] 6.3 对每个仍公开的业务 API 说明为什么保持公开，避免未来实现者误以为所有 API 都应认证。
- [ ] 6.4 为受保护 API 增加缺 token、无效 token、过期 token、权限不足、tenant 不匹配的错误语义。
- [ ] 6.5 为公开 API 增加未登录访问回归检查，证明 scoped auth 没有扩散成全局鉴权。

## 7. CloudBase 环境关联与运维辅助

- [ ] 7.1 使用 CloudBase MCP/CLI 查询目标环境，记录 env ID、环境名称、地域、绑定小程序、可用状态和查询时间。
- [x] 7.2 将 CloudBase 查询命令写成项目级方式：`npx @cloudbase/cloudbase-mcp@latest`、`pnpm dlx @cloudbase/cli@...` 或项目 devDependency，不写全局安装。
- [x] 7.3 明确 CloudBase 默认只读操作清单，例如查询环境、查询安全域名、查询托管状态。
- [x] 7.4 若必须执行 CloudBase 写操作，先写清目标资源、命令、影响范围、回滚方式和人工确认记录。
- [x] 7.5 禁止创建或部署 CloudBase login 云函数。
- [x] 7.6 禁止用 CloudBase 云函数调用 code2Session 或获取 openid/session_key。
- [x] 7.7 禁止把 CloudBase 数据库作为本项目主数据库。
- [x] 7.8 禁止把 CloudBase 云存储作为本项目主文件存储。
- [x] 7.9 禁止用 CloudBase 模板重建或替换 `apps/app`。

## 8. 小程序构建产物验收

- [x] 8.1 执行 `pnpm -F @01s-11comm/app build:mp:prod`。
- [x] 8.2 检查 `apps/app/dist/build/mp-weixin` 是否存在。
- [x] 8.3 检查产物目录是否包含微信小程序项目配置文件、app 配置、页面产物和静态资源。
- [x] 8.4 检查产物中 request base URL 是否指向 `https://01s-11-server.ruan-cat.com`，不得继续指向旧 Laf 地址。
- [x] 8.5 扫描产物，确认不包含 `WECHAT_MP_SECRET`、session_key、上传私钥、refresh token 样例值。
- [x] 8.6 若构建失败，先定位 uni-app/env/manifest 问题，不得通过修改 H5 `build:h5:prod` loader 规避。
- [x] 8.7 若修改了构建相关脚本，额外执行 `pnpm -F @01s-11comm/app build:h5:prod` 与 `pnpm -F @01s-11comm/app build:vercel` 回归。

## 9. miniprogram-ci 预览与上传

- [x] 9.1 决定 `miniprogram-ci` 接入方式：项目 devDependency、`pnpm dlx miniprogram-ci@2.1.31` 临时验证，或项目脚本封装。
- [x] 9.2 如果新增脚本，优先使用 Node API 读取环境变量，避免 Windows PowerShell 超长命令行。
- [x] 9.3 preview/upload 脚本必须读取 AppID、privateKeyPath、robot、version、desc、projectPath。
- [x] 9.4 projectPath 必须指向 `apps/app/dist/build/mp-weixin`。
- [x] 9.5 privateKeyPath 必须指向 CI 临时文件或本机安全路径，不得指向仓库内提交文件。
- [ ] 9.6 preview 成功后输出二维码文件路径或预览结果，并记录到证据目录。
- [ ] 9.7 upload 成功后记录上传结果、version、desc、robot、commit SHA、分支、操作者和时间。
- [ ] 9.8 上传失败时记录微信错误码、robot、version、projectPath 和脱敏上下文，不输出 secret。
- [x] 9.9 明确 upload 成功只代表开发版上传成功，不自动标记为审核通过或正式发布。

## 10. 微信后台合法域名与平台配置

- [ ] 10.1 在微信公众平台配置 request 合法域名为 `https://01s-11-server.ruan-cat.com`。
- [ ] 10.2 若本轮启用上传能力，配置 uploadFile 合法域名为 `https://01s-11-server.ruan-cat.com`，不得包含 `/upload` 路径。
- [ ] 10.3 若本轮未启用下载能力，downloadFile 保持未配置并在验收记录中说明原因。
- [ ] 10.4 若本轮未启用 WebSocket，socket 合法域名保持未配置并在验收记录中说明原因。
- [ ] 10.5 不得把 `api.weixin.qq.com` 配置为 request 合法域名。
- [ ] 10.6 确认体验版测试时开启域名校验，不能依赖 `urlCheck=false` 作为生产验收。
- [ ] 10.7 保存微信后台服务器域名配置截图或导出记录。
- [ ] 10.8 保存代码上传密钥和 IP 白名单配置截图或脱敏记录。

## 11. 真机体验版验证

- [ ] 11.1 使用 preview 二维码安装体验版，记录二维码、体验版版本、commit SHA 和测试设备。
- [ ] 11.2 在开启域名校验时执行微信登录，确认 App 只提交 `{ code }` 给 Nitro。
- [ ] 11.3 在 Nitro 服务端日志中确认 code2Session 成功但不输出 `WECHAT_MP_SECRET`、session_key 或完整微信请求 URL。
- [ ] 11.4 验证登录成功后 token 存储、用户摘要展示和 me 接口返回。
- [ ] 11.5 验证受保护 API 携带 Bearer token 成功返回。
- [ ] 11.6 验证受保护 API 缺 token 返回 401。
- [ ] 11.7 验证普通公开 API 未登录仍可访问。
- [ ] 11.8 验证 access token 过期后的 refresh 行为。
- [ ] 11.9 验证 refresh token 失效后的重新登录路径。
- [ ] 11.10 验证 logout 后本地 token 和用户信息被清理，后续受保护 API 不再放行。
- [ ] 11.11 验证网络失败、微信 code 过期、code2Session 错误、权限不足时的前端提示。

## 12. 文件上传、下载与存储边界

- [ ] 12.1 盘点 `apps/app` 是否在本轮小程序路径中使用 `uni.uploadFile`、`wx.uploadFile`、`uni.downloadFile`、`wx.downloadFile` 或 WebSocket。
- [ ] 12.2 如果使用上传，确认上传目标是 Nitro 控制面或既定文件网关，不是 CloudBase 云存储主链路。
- [ ] 12.3 如果使用下载，明确 downloadFile 合法域名、文件域名来源、R2/Worker 网关策略和回滚方式。
- [ ] 12.4 如果不使用下载或 socket，不配置对应微信后台域名，不写“已完成”。
- [ ] 12.5 如需临时使用 R2 presigned URL，标记为过渡方案，并记录最终文件网关方案。
- [x] 12.6 扫描文档和代码，确认没有把 CloudBase 云存储描述为主文件存储。

## 13. CI 与本地脚本

- [x] 13.1 为小程序构建设计本地脚本或文档命令，最小入口为 `pnpm -F @01s-11comm/app build:mp:prod`。
- [x] 13.2 为 preview/upload 设计项目级脚本，避免全局安装和 PowerShell 超长命令。
- [x] 13.3 为 CI 设计 secret 注入、private key 临时文件、robot、version、desc、二维码 artifact、上传结果 artifact。
- [x] 13.4 CI job 必须先构建，再 preview 或 upload，不得直接上传旧产物。
- [x] 13.5 CI job 必须在失败时上传脱敏日志和关键上下文。
- [x] 13.6 CI job 不得提交或缓存 private key、AppSecret、session_key、token。
- [x] 13.7 如果 CI runner 无固定 IP，记录微信上传 IP 白名单风险和人工替代流程。

## 14. 回归验证与禁区扫描

- [x] 14.1 执行 `pnpm -F @01s-11comm/app type-check`，如现有项目无法通过，记录失败原因和是否与本任务相关。
- [x] 14.2 执行 `pnpm -F @01s-11comm/app build:mp:prod`。
- [x] 14.3 若触碰 App 构建链，执行 `pnpm -F @01s-11comm/app build:h5:prod`。
- [x] 14.4 若触碰 Vercel/H5 相关脚本，执行 `pnpm -F @01s-11comm/app build:vercel`。
- [x] 14.5 执行 `pnpm -F @01s-11comm/api typecheck`。
- [ ] 14.6 执行 `pnpm -F @01s-11comm/api test`。
  - 2026-07-14 已执行，当前未通过：`tests/modules/repair-service.test.ts > keeps the wave4a repository fallback-only surface narrow` 仍断言 `repository.listStaffRepairs` 应为 `undefined`，但实际为 `[AsyncFunction listStaffRepairs]`。该失败属于既有 repair-service fallback-only 边界，与本任务新增微信登录/Auth/CORS 目标测试无直接交集；本任务不擅自修复。
- [x] 14.7 执行 `pnpm -F @01s-11comm/api build:node`。
- [x] 14.8 执行 `openspec validate deploy-app-wechat-cloud-mini-program --strict`。
- [x] 14.9 扫描 `npm install -g|pnpm add -g|pnpm install .* -g|yarn global add`，确认文档和脚本没有全局安装要求。
- [x] 14.10 扫描 `vercel.json`，确认没有新增根目录或子项目 Vercel 配置文件。
- [x] 14.11 扫描 `WECHAT_MP_SECRET|session_key|private key|BEGIN PRIVATE KEY`，确认没有真实密钥进入前端、日志、报告或构建产物。
- [x] 14.12 扫描 CloudBase 相关文本，确认 CloudBase login 云函数、CloudBase 主 API、CloudBase 主数据库、CloudBase 主存储只作为禁止项或拒绝方案出现。
- [x] 14.13 执行 `git diff --check`，确认新增 OpenSpec、脚本和文档无尾随空格或格式错误。

## 15. 发布、回滚与文档同步

- [x] 15.1 编写或更新小程序部署文档，记录构建、preview、upload、提交审核、发布、回滚的分阶段口径。
- [x] 15.2 文档中写明 `miniprogram-ci upload` 不是正式发布。
- [x] 15.3 文档中写明 A 方案技术决策：微信登录和 scoped auth 都在 Nitro，CloudBase 只做环境和发布辅助。
- [x] 15.4 文档中写明禁止项：CloudBase login 云函数、前端 secret、全局安装、`vercel.json`、H5/Vercel 构建链路改写。
- [ ] 15.5 保存 preview 二维码、upload 结果、微信后台域名配置、体验版测试记录、审核/发布记录。
- [x] 15.6 记录回滚流程：小程序版本回退、robot 槽位切换、关闭 scoped auth allowlist、恢复 App API base URL、禁用 CI upload job。
- [x] 15.7 更新相关 OpenSpec 主规范或变更 delta，确保 `nitro-auth-middleware`、`unified-nitro-api-consolidation` 与本任务口径一致。
- [x] 15.8 若实现中发现新的事故或坑点，在 bug 修复完成后按 `record-bug-fix-memory` 技能写入独立经验文件。
