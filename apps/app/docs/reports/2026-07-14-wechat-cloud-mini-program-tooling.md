# 2026-07-14 微信云小程序本地工具准备说明

## 目标

本说明记录 `apps/app` 部署到微信云小程序前，本地已经准备好的 CLI、MCP、skill 和项目脚本。后续执行时，代理应以这里的工具入口为准，不要求你额外学习 `miniprogram-ci`、CloudBase CLI 或 CloudBase MCP 的细节。

本报告最初用于记录部署工具层准备；后续已继续落地本地 Nitro 微信登录与 Bearer scoped auth 对接。关键技术决策保持不变：

- 微信登录、`code2Session`、access token、refresh token、logout、me、Bearer scoped auth、actor/role/tenant 和受保护 API 都归 `apps/api` Nitro。
- CloudBase 只做小程序云开发环境关联、预览/上传/发布辅助、AI/MCP/运维工具层。
- CloudBase 不做 login 云函数，不获取 openid/session_key，不作为主 API、主数据库或主文件存储。
- `miniprogram-ci upload` 只代表微信公众平台开发版上传成功，不代表提交审核、审核通过或正式发布。

当前仍未执行真实微信后台配置、真实 CloudBase 环境查询、真实 `mp:preview`/`mp:upload` 和真机体验版验收；这些必须等微信公众平台权限、代码上传私钥、合法域名和 CloudBase/TencentCloud 凭据准备好后再闭环。

## 已准备的本地依赖

依赖已经安装在 `apps/app` 的 devDependencies 中，不需要全局安装：

- `miniprogram-ci@2.1.31`
- `@cloudbase/cli@3.6.1`
- `@cloudbase/cloudbase-mcp@2.23.9`

禁止使用以下全局安装方式：

```powershell
npm install -g <package>
pnpm add -g <package>
pnpm install -g <package>
yarn global add <package>
```

## 已准备的项目脚本

后续小程序部署相关命令从 `apps/app/package.json` 进入：

```powershell
pnpm -F @01s-11comm/app build:mp:prod
pnpm -F @01s-11comm/app mp:doctor
pnpm -F @01s-11comm/app mp:preview
pnpm -F @01s-11comm/app mp:upload
pnpm -F @01s-11comm/app cloudbase:help
pnpm -F @01s-11comm/app cloudbase:mcp:help
```

脚本文件：

- `apps/app/scripts/wechat-mini-program-ci.mjs`

脚本职责：

- `mp:doctor`：检查 `apps/app` 小程序部署的本地前置条件。它不要求上传私钥存在，也不会读取微信 AppSecret。
- `mp:preview`：使用 `miniprogram-ci` Node API 基于 `apps/app/dist/build/mp-weixin` 生成预览二维码。
- `mp:upload`：使用 `miniprogram-ci` Node API 上传微信公众平台开发版。

`preview` 和 `upload` 会强制检查上传私钥路径必须是文件，并拒绝仓库内路径，避免把微信代码上传私钥提交到 Git。

## MCP 配置

`.mcp.json` 已新增 `cloudbase` MCP server，使用项目本地依赖启动：

```json
{
	"command": "pnpm",
	"args": ["--dir", "apps/app", "exec", "cloudbase-mcp"]
}
```

CloudBase MCP 使用以下环境变量占位。真实值必须由本机 MCP 客户端、终端环境或安全 secret 注入，不写入仓库：

- `CLOUDBASE_ENV_ID`
- `TENCENTCLOUD_SECRETID`
- `TENCENTCLOUD_SECRETKEY`
- `TENCENTCLOUD_SESSIONTOKEN`

CloudBase MCP 默认只用于查询环境、查询托管/域名/状态和辅助发布诊断。任何写操作都必须先确认目标环境、目标资源、影响范围和回滚方式。

## 项目级 Skill

已新增两个等价的项目级 skill，后续代理处理微信云小程序部署时应优先读取：

- `.agents/skills/wechat-cloud-mini-program-deployment/SKILL.md`
- `.claude/skills/wechat-cloud-mini-program-deployment/SKILL.md`

skill 记录了触发时机、必读文件、推荐命令、环境变量、红线和验收清单，尤其强调 CloudBase 与 Nitro 的职责边界。

## 官方 CloudBase Skill

本项目已安装官方 `tencentcloudbase/cloudbase-skills` 的 `cloudbase` skill，并同步到当前项目的多个 agent skill 目录：

- `.agents/skills/cloudbase/SKILL.md`
- `.claude/skills/cloudbase/SKILL.md`

安装命令使用项目级 `skills` CLI，没有使用全局安装：

```powershell
skills add tencentcloudbase/cloudbase-skills --skill cloudbase -a codex -a claude-code -a cursor -a antigravity -y --copy
```

按当前项目约定，`.qoder` 和 `.trae` 不安装 CloudBase skill；这两个工具当前不作为本项目 CloudBase 执行入口。本轮已核对 `.qoder/skills/cloudbase` 和 `.trae/skills/cloudbase` 均不存在，若后续同步工具误生成，必须立即删除。

管理口径：

- 官方 `cloudbase` skill 是 CloudBase MCP、CLI、控制台、云开发能力的上游操作手册。
- 项目级 `wechat-cloud-mini-program-deployment` skill 是边界入口，优先级高于官方 `cloudbase` skill。
- 官方 skill 覆盖 CloudBase Auth、NoSQL、云函数、云托管、云存储等宽能力，但本项目不得因此改变 A 方案。
- CloudBase 仍只做环境查询、MCP/CLI、预览上传和运维辅助；微信登录、`code2Session`、token、refresh、logout、me、Bearer scoped auth 和受保护 API 仍归 `apps/api` Nitro。

## 环境变量约定

小程序 CI 脚本读取以下环境变量：

- `WECHAT_MP_APPID`：可选，用于覆盖 `apps/app/env/.env` 中的 `VITE_WX_APPID`。
- `WECHAT_MP_PRIVATE_KEY_PATH`：预览/上传必填，必须指向仓库外的本机安全私钥文件或 CI 临时文件。
- `WECHAT_MP_CI_ROBOT`：可选，默认 `1`。
- `WECHAT_MP_UPLOAD_VERSION`：可选，默认读取 `apps/app/package.json` 的 `version`。
- `WECHAT_MP_UPLOAD_DESC`：可选，默认使用通用描述。
- `WECHAT_MP_PROJECT_PATH`：可选，默认 `apps/app/dist/build/mp-weixin`。
- `WECHAT_MP_QRCODE_OUTPUT`：可选，默认 `apps/app/.tmp/wechat-mini-program/preview-qrcode.jpg`。

以下变量不得进入 `apps/app/env/**`、`VITE_*`、前端 bundle、Markdown 日志或截图：

- `WECHAT_MP_SECRET`
- 微信 `session_key`
- 微信代码上传私钥内容
- TencentCloud SecretKey
- access token / refresh token 的真实值

## robot 与 CI 约定

建议先采用以下 robot 槽位，后续如微信公众平台权限不同，再在执行记录中调整：

- robot 1：本机或 CI preview，主要用于生成体验二维码。
- robot 2：CI upload，主要用于上传开发版。
- robot 3：人工应急上传，避免自动化失败时覆盖兜底版本。

CI 执行时应先运行 `build:mp:prod`，再运行 `mp:preview` 或 `mp:upload`。上传私钥由 CI secret 写入临时文件，并通过 `WECHAT_MP_PRIVATE_KEY_PATH` 传入；二维码建议保存为 artifact；上传结果需要记录 version、desc、robot、commit SHA、分支、操作者和时间。CI 日志不得缓存或输出 private key、AppSecret、session_key、access token、refresh token。

## 后续执行顺序

1. 运行本地诊断：

   ```powershell
   pnpm -F @01s-11comm/app mp:doctor
   ```

2. 构建微信小程序生产产物：

   ```powershell
   pnpm -F @01s-11comm/app build:mp:prod
   ```

3. 再次运行本地诊断，确认 `apps/app/dist/build/mp-weixin` 存在：

   ```powershell
   pnpm -F @01s-11comm/app mp:doctor
   ```

4. 注入上传私钥路径后生成预览二维码：

   ```powershell
   pnpm -F @01s-11comm/app mp:preview
   ```

5. 真机体验版验证通过后，上传微信公众平台开发版：

   ```powershell
   pnpm -F @01s-11comm/app mp:upload
   ```

6. 上传后仍需人工或后续自动化完成：提交审核、审核反馈、灰度发布、全量发布和回滚证据记录。

## 微信后台仍需准备的内容

这些内容无法安全地硬编码到仓库，需要在微信公众平台或腾讯云侧准备：

- 微信小程序 AppID 与 `VITE_WX_APPID` 一致性确认。
- 小程序代码上传密钥，私钥只放本机安全路径或 CI secret 临时文件。
- 小程序代码上传 IP 白名单。
- 体验版/开发版管理权限。
- request 合法域名：`https://01s-11-server.ruan-cat.com`。
- uploadFile/downloadFile/socket 合法域名按实际功能最小化配置；没有启用的能力不要伪造完成状态。
- CloudBase env ID 与 TencentCloud 临时凭据，仅用于查询和发布辅助。

## 禁止项

- 不新增或恢复任何 `vercel.json`。
- 不修改 `apps/app` 的 `build:h5:prod` Windows loader。
- 不破坏 `apps/app` 的 `build:vercel` 和 `.vercel/output` 搬运链路。
- 不把 `api.weixin.qq.com` 配置成小程序 request 合法域名。
- 不用 CloudBase 模板重建或替换 `apps/app`。
- 不把 CloudBase 云函数、云数据库或云存储描述成主链路。

## 回滚流程

后续如果预览、上传或体验版验证出现问题，按以下顺序回滚：

1. 小程序版本回退：在微信公众平台版本管理中切回上一稳定开发版、体验版或线上版本，并记录版本号、robot、操作者和时间。
2. robot 槽位切换：CI 上传与人工上传使用不同 robot，避免新的失败开发版覆盖人工兜底版本。
3. scoped auth 回滚：如果后续 Nitro 微信登录或受保护 API 出现阻断，先关闭或收窄 scoped auth allowlist，不做全局鉴权回退。
4. App API base URL 回滚：如小程序体验版请求生产 Nitro 失败，可临时恢复到上一稳定 API base URL，但不得回退到前端 secret 或 CloudBase login 云函数方案。
5. CI upload job 回滚：禁用自动 upload，只保留 `build:mp:prod` 和 `mp:doctor`，改成人工预览/上传兜底。

## 验收命令

本地工具准备完成后，至少执行以下验证：

```powershell
pnpm install
pnpm -F @01s-11comm/app mp:doctor
pnpm -F @01s-11comm/app cloudbase:help
pnpm -F @01s-11comm/app cloudbase:mcp:help
openspec validate deploy-app-wechat-cloud-mini-program --strict
git diff --check
```

同时扫描：

- 是否出现全局安装要求。
- 是否新增 `vercel.json`。
- 是否提交真实密钥、私钥、`session_key` 或 token。
- CloudBase 是否只作为禁止项、拒绝方案或发布辅助出现。

## 2026-07-14 继续执行：本地构建验收

本阶段继续执行本地构建验收、构建链修复和产物扫描，不执行微信后台配置、真实 preview/upload 或真机体验版验证。

```log
命令：pnpm -F @01s-11comm/app type-check
退出状态：0
关键输出：vue-tsc --noEmit
结论：通过；OpenSpec 14.1 可勾选。

命令：pnpm -F @01s-11comm/app build:mp:prod
退出状态：1
关键输出：
UNI_PLATFORM -> mp-weixin
VITE_SERVER_BASEURL -> https://01s-11-server.ruan-cat.com
VITE_11COMM_API_BASE_URL -> https://01s-11-server.ruan-cat.com
错误：Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
结论：第一次失败；根因是 build:mp:prod 未复用 Windows path loader。

修复：将 build:mp:prod 改为：
node --import ./scripts/register-window-path-loader.js node_modules/@dcloudio/vite-plugin-uni/bin/uni.js build -p mp-weixin --mode production

命令：pnpm -F @01s-11comm/app build:mp:prod
退出状态：1
关键输出：
错误："looseToNumber" is not exported by "../../node_modules/.pnpm/@vue+shared@3.0.5/node_modules/@vue/shared/dist/shared.esm-bundler.js"
结论：第二次失败；根因是 miniprogram-ci@2.1.31 引入 @vue/shared@3.0.5，hoist 后污染 uni 小程序构建上下文。

修复：在 apps/app devDependencies 显式加入 @vue/shared@3.4.21，让 app 构建上下文解析到 @dcloudio/uni-mp-vue 所需版本。

命令：pnpm -F @01s-11comm/app exec node -e "const pkg=require('@vue/shared/package.json'); console.log(require.resolve('@vue/shared/package.json')); console.log(pkg.version); console.log('looseToNumber' in require('@vue/shared'))"
退出状态：0
关键输出：
D:\code\ruan-cat\01s-11comm\node_modules\.pnpm\@vue+shared@3.4.21\node_modules\@vue\shared\package.json
3.4.21
true
结论：app 构建上下文已解析到包含 looseToNumber 的 @vue/shared@3.4.21。

命令：pnpm -F @01s-11comm/app build:mp:prod
退出状态：0
关键输出：
UNI_PLATFORM -> mp-weixin
VITE_SERVER_BASEURL -> https://01s-11-server.ruan-cat.com
VITE_11COMM_API_BASE_URL -> https://01s-11-server.ruan-cat.com
DONE Build complete.
运行方式：打开 微信开发者工具, 导入 dist\build\mp-weixin 运行。
结论：通过；OpenSpec 8.1、14.2 可勾选。

命令：Test-Path apps/app/dist/build/mp-weixin；检查 app.js、app.json、app.wxss、project.config.json
退出状态：0
关键输出：
apps/app/dist/build/mp-weixin 存在
包含 app.js、app.json、app.wxss、project.config.json
结论：小程序产物结构通过；OpenSpec 8.2、8.3 可勾选。

命令：rg -n "01s-11-server\.ruan-cat\.com|laf|VITE_SERVER_BASEURL|VITE_11COMM_API_BASE_URL" apps/app/dist/build/mp-weixin
退出状态：0
关键输出：只命中 https://01s-11-server.ruan-cat.com、VITE_SERVER_BASEURL、VITE_11COMM_API_BASE_URL，未命中 laf。
结论：小程序产物 request base URL 已指向统一 Nitro API，旧 Laf 地址未进入产物；OpenSpec 8.4 可勾选。

命令：rg -n "WECHAT_MP_SECRET|session_key|BEGIN PRIVATE KEY|PRIVATE KEY|TENCENTCLOUD_SECRET|CLOUDBASE_SECRET|access_token|refresh_token" apps/app/dist/build/mp-weixin
退出状态：1
关键输出：无匹配。
结论：小程序产物敏感关键字扫描通过；OpenSpec 8.5 可勾选。

命令：pnpm -F @01s-11comm/app mp:doctor
退出状态：0
关键输出：
projectPath: apps/app/dist/build/mp-weixin (exists)
miniprogram-ci: 2.1.31
@cloudbase/cli: 3.6.1
@cloudbase/cloudbase-mcp: 2.23.9
结论：本地小程序 CI 工具和构建产物路径诊断通过。

命令：pnpm -F @01s-11comm/app build:h5:prod
退出状态：0
关键输出：UNI_PLATFORM -> h5；DONE Build complete.
结论：H5 生产构建回归通过；OpenSpec 8.7、14.3 可勾选。

命令：pnpm -F @01s-11comm/app build:vercel
退出状态：0
关键输出：
Tasks: 2 successful, 2 total
已将 apps/app/dist/build/h5 搬运到 .vercel/output
结论：Vercel 输出搬运链路回归通过；OpenSpec 8.7、14.4 可勾选。

命令：pnpm install --frozen-lockfile
退出状态：0
关键输出：Lockfile is up to date, resolution step is skipped
结论：package.json 与 pnpm-lock.yaml 一致。

命令：openspec validate deploy-app-wechat-cloud-mini-program --strict
退出状态：0
关键输出：Change 'deploy-app-wechat-cloud-mini-program' is valid
结论：OpenSpec change 严格校验通过。

命令：git diff --check
退出状态：0
关键输出：无输出
结论：当前 diff 无尾随空格或空白错误。

命令：rg --files -g 'vercel.json'
退出状态：1
关键输出：无输出
结论：仓库未新增或恢复 vercel.json。

命令：rg -n -- '-----BEGIN [A-Z ]*PRIVATE KEY-----|WECHAT_MP_SECRET\s*[:=]\s*[A-Za-z0-9_-]{8,}|TENCENTCLOUD_SECRETKEY\s*[:=]\s*[A-Za-z0-9_-]{8,}|session_key\s*[:=]\s*[A-Za-z0-9_-]{8,}|access_token\s*[:=]\s*[A-Za-z0-9_-]{8,}|refresh_token\s*[:=]\s*[A-Za-z0-9_-]{8,}' apps/app/src apps/app/env apps/app/scripts apps/app/docs/reports .mcp.json .claude/skills/fix-bug/record-bug-fix-memory
退出状态：1
关键输出：无输出
结论：未发现真实私钥正文或典型 secret/token 赋值。

命令：powershell -ExecutionPolicy Bypass -File C:\Users\pc\.agents\skills\cleanup-agent-team-node-processes\scripts\agent-team-node-cleanup.ps1 -OutputPath .tmp\agent-team-node-cleanup-2026-07-14.dry-run.json
退出状态：0
关键输出：
NodeProcessCount: 66
CandidateCount: 0
AuditOnlyCount: 66
结论：agent team Node 进程审计为 dry-run，仅生成台账，没有清理进程。
```

为消除产物中的旧 Laf 残留，本轮同步修改了三个源码点：

- `apps/app/src/pages/login/login.vue`：模拟登录头像从 `https://oss.laf.run/...` 改成本地 `/static/images/default-avatar.png`。
- `apps/app/src/pages-sub/demo/components/request.vue`：示例 URL 从 `http://laf.run/...` 改为 `https://01s-11-server.ruan-cat.com`。
- `apps/app/src/utils/index.ts`：微信 develop/trial/release fallback base URL 和 upload URL 均切到统一 Nitro API 域名。

本轮新增的事故经验已写入：

- `.claude/skills/fix-bug/record-bug-fix-memory/2026-07-14-app-mp-weixin-build-loader-vue-shared-hoist.md`

## 2026-07-14 继续执行：Nitro 微信登录与 App 对接

本阶段已按 A 方案实现本地可验证的 Nitro 微信登录主链路。实现范围是本地代码、类型和单元测试；没有调用真实微信 `code2Session` 服务，也没有做体验版真机验证。

```log
命令：pnpm -F @01s-11comm/api typecheck
退出状态：0
关键输出：tsc --noEmit
结论：通过；新增 Nitro auth 模块类型正确。

命令：pnpm -F @01s-11comm/api exec vitest run tests/auth tests/infra/cors.test.ts --reporter=verbose
退出状态：0
关键输出：2 个测试文件通过，9/9 tests passed
结论：微信登录输入校验、token 签发/验证、显式 scoped auth、CORS Authorization header 回归通过。

命令：pnpm -F @01s-11comm/app type-check
退出状态：0
关键输出：vue-tsc --noEmit
结论：通过；App 端 `{ code }` 登录请求、token store、Bearer 注入和用户信息类型可编译。

命令：git diff --check -- apps/api apps/app
退出状态：0
关键输出：无输出
结论：API 与 App 改动无空白格式错误。

命令：pnpm -F @01s-11comm/api test
退出状态：1
关键输出：75 个测试文件通过、1 个测试文件失败、1 个测试文件跳过；988/1014 tests passed，25 skipped；失败项为 tests/modules/repair-service.test.ts > repair service wave4a > keeps the wave4a repository fallback-only surface narrow，断言 repository.listStaffRepairs 应为 undefined，但实际为 [AsyncFunction listStaffRepairs]。
结论：全量 API test 当前未通过；失败点是既有 repair-service fallback-only 边界，与本阶段新增微信登录/Auth/CORS 目标测试无直接交集。本任务不擅自修改该无关断言。

命令：pnpm -F @01s-11comm/api exec vitest run tests/auth/auth-service.test.ts --reporter=verbose
退出状态：1
关键输出：新增 code2Session 错误码脱敏测试失败，期望“微信登录凭证无效或已过期”，实际为“微信登录校验失败”。
结论：RED 阶段成立；测试能证明 40029 错误码还没有被脱敏映射。

修复：在 `apps/api/server/modules/auth/wechat-client.ts` 中对微信 `code2Session` 响应的 `errcode` 建立固定中文文案映射：-1、40029、40163、45011 和未知错误码；不拼接微信原始 `errmsg`，避免 secret/session_key 或请求上下文进入响应。

命令：pnpm -F @01s-11comm/api exec vitest run tests/auth/auth-service.test.ts --reporter=verbose
退出状态：0
关键输出：1 个测试文件通过，4/4 tests passed。
结论：`code2Session` 错误码脱敏映射通过；OpenSpec 4.5 可勾选。
```

本阶段新增或调整的关键代码：

- `apps/api/server/modules/auth/*`：新增微信登录服务、微信 `code2Session` 客户端、无状态 HMAC token 服务、runtime/env 读取、AuthError 和 JsonVO 响应包装。
- `apps/api/server/modules/auth/wechat-client.ts`：新增微信 `code2Session` 错误码脱敏映射，不返回微信原始 `errmsg`、完整请求 URL、secret 或 session_key。
- `apps/api/server/routes/auth/wxLogin.post.ts`：接收 `{ code }`，由 Nitro 服务端调用微信 `code2Session` 并签发 access token/refresh token。
- `apps/api/server/routes/auth/refreshToken.post.ts`：校验 refresh token 并保持 actor/role/tenant 上下文签发新 token。
- `apps/api/server/routes/auth/logout.get.ts`：当前不维护服务端吊销表，返回 `serverRevocation: false`，要求 App 本地清理登录态。
- `apps/api/server/routes/user/info.get.ts`：显式调用 `requireScopedAuth()`，将 actor 写入 `event.context.actor`，返回 App 可消费的用户摘要字段，不返回 openid/session_key 原文。
- `apps/app/src/store/token.ts`：微信小程序登录只提交 `{ code: loginRes.code }`，退出时无条件清理 token、过期时间和用户信息，refresh 使用 token store。
- `apps/app/src/http/interceptor.ts`：Bearer token 来源统一改为 token store，不再读取漂移的 `userStore.userInfo.token`。
- `apps/app/src/http/http.ts`：401 refresh 分支兼容 Pinia setup store 的 tokenInfo，并兼容 Nitro `message` 错误字段。
- `apps/app/env/.env.production`：生产环境显式设置 `VITE_AUTH_MODE = 'double'`，与 Nitro 双 token 响应对齐。

仍未完成项包括：微信后台 AppID/权限/代码上传密钥/IP 白名单确认、CloudBase 目标环境真实查询、真实 preview/upload、微信后台合法域名截图或导出记录、真机体验版验证、真实微信 `code2Session` 联调、受保护业务 API 选择与迁移、服务端 token 吊销表或黑名单策略。
