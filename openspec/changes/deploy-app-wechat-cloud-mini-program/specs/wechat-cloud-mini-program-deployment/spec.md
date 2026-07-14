## ADDED Requirements

### Requirement: App 微信小程序生产构建

系统 SHALL 使用 `apps/app` 现有 uni-app 微信小程序构建链路生成生产小程序产物。构建入口 SHALL 为 `pnpm -F @01s-11comm/app build:mp:prod`，验收产物 SHALL 位于 `apps/app/dist/build/mp-weixin`。本能力不得修改 `build:h5:prod`、Windows ESM loader、`build:vercel`、`.vercel/output` 搬运链路或新增任何 `vercel.json`。

#### Scenario: 生产构建成功

- **WHEN** 执行 `pnpm -F @01s-11comm/app build:mp:prod`
- **THEN** 系统 SHALL 在 `apps/app/dist/build/mp-weixin` 生成可被微信开发者工具或 `miniprogram-ci` 识别的小程序项目产物

#### Scenario: 保护 H5 Vercel 构建链路

- **WHEN** 微信小程序部署任务需要修改 `apps/app/package.json`、Vite/uni 构建入口或部署脚本
- **THEN** 修改 SHALL 不改变 `build:h5:prod` 的 Windows loader、不改变 `build:vercel` 的 `.vercel/output` 搬运策略，且不得新增根目录或子项目 `vercel.json`

### Requirement: 微信 AppID 与公开环境变量

系统 SHALL 将微信小程序 AppID 作为前端公开配置管理，并继续由 `manifest.config.ts` 的 `mp-weixin.appid` 消费。系统 MUST NOT 将 `WECHAT_MP_SECRET`、微信 `session_key`、小程序代码上传私钥或任何服务端密钥写入 `apps/app/env/**`、`VITE_*` 变量、前端 bundle 或前端日志。

#### Scenario: manifest 读取微信 AppID

- **WHEN** 使用 production mode 构建 `mp-weixin`
- **THEN** `manifest.config.ts` SHALL 从 `apps/app/env` 中读取公开的微信 AppID，并写入微信小程序 manifest

#### Scenario: 服务端密钥不进入前端

- **WHEN** 构建后扫描 `apps/app` 源码、env 文件和 `dist/build/mp-weixin` 产物
- **THEN** 不得出现 `WECHAT_MP_SECRET` 的真实值、微信 `session_key` 的真实值或小程序代码上传私钥内容

### Requirement: 项目级预览与上传工具链

系统 SHALL 使用项目级 `miniprogram-ci`、`pnpm dlx` 或项目级 CloudBase MCP/CLI 配置执行微信小程序预览与上传。系统 MUST NOT 要求或推荐 `npm install -g`、`pnpm add -g`、`pnpm install -g` 或其他全局安装方式。预览与上传脚本 SHALL 使用 `apps/app/dist/build/mp-weixin` 作为 projectPath。

#### Scenario: 生成预览二维码

- **WHEN** 执行项目级 preview 脚本或等价 `miniprogram-ci preview`
- **THEN** 系统 SHALL 基于 `apps/app/dist/build/mp-weixin` 生成可用于真机体验的小程序预览二维码或预览结果文件

#### Scenario: 上传开发版

- **WHEN** 执行项目级 upload 脚本或等价 `miniprogram-ci upload`
- **THEN** 系统 SHALL 将构建产物上传为微信公众平台开发版，并记录 AppID、version、desc、robot、commit SHA 和上传结果

#### Scenario: 禁止全局安装

- **WHEN** 编写部署文档、脚本或 CI 配置
- **THEN** 文档和脚本 SHALL 使用 `pnpm dlx`、`npx`、项目 devDependency 或项目级 MCP 配置，不得出现全局安装命令

### Requirement: 微信上传密钥与 CI 安全

系统 SHALL 将微信代码上传私钥、`WECHAT_MP_SECRET`、CI token 和 CloudBase/TencentCloud 凭据作为 secret 管理。上传私钥 SHALL 来自 CI secret 写出的临时文件或本机安全路径，不得提交到仓库。上传 robot SHALL 固定分配，version SHALL 来自 package version、git tag 或 CI build number，desc SHALL 包含可审计信息且不得包含 secret。

#### Scenario: CI 上传使用临时私钥文件

- **WHEN** CI 执行小程序 preview 或 upload
- **THEN** CI SHALL 从 secret 写出临时 private key 文件，任务结束后清理该文件，并避免在日志中输出私钥内容

#### Scenario: robot 槽位固定

- **WHEN** 配置 preview 或 upload 脚本
- **THEN** 脚本 SHALL 明确 robot 编号用途，避免 CI、人工上传和不同环境覆盖同一个开发版槽位

### Requirement: 微信后台合法域名配置

系统 SHALL 在微信公众平台配置小程序服务器域名。request 合法域名 SHALL 使用 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。uploadFile、downloadFile 和 socket 域名 SHALL 按实际启用能力最小化配置，不得用 `urlCheck=false` 替代生产域名验收。

#### Scenario: request 合法域名

- **WHEN** 小程序体验版或生产版请求 Nitro 登录、refresh、me、logout 或业务 API
- **THEN** 微信后台 request 合法域名 SHALL 包含 `https://01s-11-server.ruan-cat.com`，且真机在开启域名校验时请求成功

#### Scenario: uploadFile 域名按需配置

- **WHEN** 本轮实现或启用 `uni.uploadFile` / `wx.uploadFile` 上传到 Nitro
- **THEN** 微信后台 uploadFile 合法域名 SHALL 配置 API 域名本身，不得把 `/upload` 路径写作域名

#### Scenario: 不预配未使用域名

- **WHEN** 本轮未实现 downloadFile 或 WebSocket 能力
- **THEN** 微信后台 downloadFile 和 socket 域名 SHALL 保持未配置或记录为未启用，不得伪造完整配置状态

### Requirement: CloudBase 环境关联与边界

系统 SHALL 允许 CloudBase 作为微信小程序云开发环境关联、发布辅助、AI/MCP/运维工具层。CloudBase MUST NOT 承载 login 云函数，MUST NOT 获取 openid 或微信 `session_key`，MUST NOT 作为主业务 API、主数据库或主文件存储。默认 CloudBase MCP/CLI 操作 SHALL 为只读查询；任何写操作必须有明确任务、目标环境、影响范围和回滚方式。

#### Scenario: 查询 CloudBase 环境

- **WHEN** 执行 CloudBase MCP 或 CLI 查询环境、域名、托管状态
- **THEN** 查询 SHALL 只用于确认环境关联和发布辅助状态，不改变登录主链路或业务数据源

#### Scenario: 禁止 CloudBase 登录主链路

- **WHEN** 实现微信小程序登录
- **THEN** 登录 SHALL 调用 `apps/api` Nitro 接口，不得通过 CloudBase 云函数获取 openid、session_key 或签发本项目 token

### Requirement: 发布门禁与状态口径

系统 SHALL 将 preview、upload、提交审核、审核通过、灰度发布和全量发布作为不同状态记录。`miniprogram-ci upload` 成功 SHALL 只表示开发版上传成功，不得被描述为正式线上发布完成。

#### Scenario: 上传成功后的状态

- **WHEN** `miniprogram-ci upload` 返回成功
- **THEN** 任务状态 SHALL 记录为开发版上传完成，并继续要求提交审核、审核通过和发布门禁证据

#### Scenario: 人工发布门禁

- **WHEN** 本轮没有实现微信服务端审核/发布自动化
- **THEN** tasks 和发布文档 SHALL 把提交审核、审核反馈、灰度或全量发布写成人工门禁，并要求记录截图、时间、操作者和版本号

### Requirement: 真机体验版验收

系统 SHALL 在真机体验版上验证微信登录、Nitro API 请求、token refresh、logout、me、受保护业务 API、公开 API 和错误路径。验收 SHALL 在开启微信域名校验的条件下进行，并记录二维码、版本号、commit SHA、测试账号和关键请求结果。

#### Scenario: 微信登录验收

- **WHEN** 测试者在体验版点击微信登录入口
- **THEN** 小程序 SHALL 调用 `uni.login` 获取 code，提交给 Nitro 登录接口，并在成功后获得 Nitro 自有 token 和用户摘要

#### Scenario: 受保护 API 验收

- **WHEN** 已登录小程序调用 scoped auth allowlist 内的受保护 API
- **THEN** 请求 SHALL 携带 `Authorization: Bearer access-token` 形式的请求头，Nitro SHALL 解析 actor/role/tenant context 并返回业务响应

#### Scenario: 公开 API 验收

- **WHEN** 未登录小程序调用普通公开 API
- **THEN** Nitro SHALL 默认放行公开路由，不得因为缺少 token 返回 401

### Requirement: 文件域名与存储边界

系统 SHALL 保持 R2/Worker 文件域名方向作为文件服务主边界。若小程序需要文件上传或下载，最终方案 SHALL 使用 Nitro 控制面结合文件网关或明确的上传/download 域名；CloudBase 云存储不得成为本轮主文件存储。

#### Scenario: 小程序上传文件

- **WHEN** 小程序需要上传文件
- **THEN** 系统 SHALL 通过 Nitro 上传控制面或既定文件网关处理授权和域名配置，不得把 CloudBase 云存储设为主存储

#### Scenario: 小程序下载文件

- **WHEN** 小程序需要使用 `wx.downloadFile`
- **THEN** 系统 SHALL 明确 downloadFile 合法域名、文件 URL 来源和回滚策略；未实现下载能力时不得预配或声称完成
