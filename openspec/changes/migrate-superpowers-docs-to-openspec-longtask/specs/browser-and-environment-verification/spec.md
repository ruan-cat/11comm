## ADDED Requirements

### Requirement: 三端双环境浏览器验收矩阵

Phase7 后续验收必须把 admin H5、app H5、独立 `apps/api` server 三端，分别放入 local-dev 和 production 两类环境中记录。local-dev 必须覆盖 `apps/api` dev、`apps/admin` dev、`apps/app` H5 dev 三个本地服务；production 必须覆盖 `apps/admin/package.json`、`apps/app/package.json`、`apps/api/package.json` 的 `homepage` 字段所指向的三个生产入口。任一端或任一环境的证据都不得替代其它端或其它环境。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 建立本地三 dev 矩阵

- **WHEN** 后续代理执行本地 Phase7 浏览器验收
- **THEN** 必须记录 `apps/api` dev、`apps/admin` dev、`apps/app` H5 dev 的启动命令、端口、关键环境变量、启动结果和互相指向关系；缺少任一 dev 服务时，对应矩阵单元保持 incomplete

#### Scenario: 建立三个生产入口矩阵

- **WHEN** 后续代理执行生产 Phase7 浏览器验收
- **THEN** 必须先重新读取三个 package 的 `homepage` 字段，再记录 admin H5、app H5、API server 的生产 URL、测试时间、请求目标和结果；不得从旧文档、截图、Vercel 页面或记忆中硬编码生产地址

#### Scenario: 试图用单端或单环境替代整体证据

- **WHEN** 只有本地 admin 页面、只有 app H5、只有 API `/__nitro/health`、只有生产首页可打开或只有 HTTP gate 通过
- **THEN** 只能升级对应矩阵单元，不能写成三端验收完成、生产验收完成、`DB_READY` 完成或旧服务可退役

### Requirement: Chrome DevTools MCP 证据采集规则

Chrome DevTools MCP 必须作为 Phase7 页面级浏览器证据的主采集工具。admin H5 与 app H5 的 browserEvidence 必须来自真实页面组件或真实页面上下文发出的 Network 请求；API server 无页面时可用 Chrome DevTools MCP 打开 `/__nitro/health`、`/__nitro/ready` 或目标 endpoint，并记录 Network/response 摘要。直接 shell fetch、Vitest、contract test 或服务日志只能作为 HTTP gate、unit evidence 或辅助证据，不能冒充 Chrome MCP browserEvidence。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 采集页面级 Network

- **WHEN** 使用 Chrome DevTools MCP 验证 admin 或 app 页面
- **THEN** 必须记录页面 URL、业务页面路径、触发动作、Network request URL、method、status、关键响应头、响应摘要、控制台错误摘要、截图或日志路径和是否命中 `apps/api`

#### Scenario: API server 使用浏览器上下文验证

- **WHEN** 验证 `apps/api` 本地或生产 server
- **THEN** 必须至少通过 Chrome DevTools MCP 或等价浏览器上下文访问 `/__nitro/health` 与 `/__nitro/ready`，并记录响应状态、ready code、环境变量状态摘要和是否为 local-dev 或 production

#### Scenario: Chrome MCP 不可用

- **WHEN** Chrome DevTools MCP transport 断开或不可用，只能用 Chrome CDP fallback、shell fetch 或其它方式采集
- **THEN** 必须在 `agent-findings.md` 标记为 fallback evidence；该证据不得写成 Chrome MCP 完成，除非后续重新用 MCP 重采

#### Scenario: 使用 Google Chrome CDP fallback

- **WHEN** 因 Chrome DevTools MCP transport 断开而使用 Google Chrome CDP fallback 采集页面 Network
- **THEN** 必须在 evidence 中标注 `tool=CDP fallback` 或等价说明；如后续要求 MCP 工具级证据，必须重采，不能把 fallback 证据改写成 MCP 完成

### Requirement: Windows 本地 dev 环境 gotcha

Windows 本地 admin dev 验证 MUST 保留 2026-05-18 的环境 gotcha：`apps/admin` dev 可能需要 `cross-env` 设置 `NODE_OPTIONS`，并通过 `VITE_DISABLE_AUTOGENERATION_IMPORT_FILE=true` 禁用会在 Windows `fs.watch` null fileName 场景下崩溃的 `vite-plugin-autogeneration-import-file`。后续启动三端本地 dev 失败时，必须先核对该环境约束和当前 package script，而不是把页面证据缺失误判为 API 迁移失败。

#### Scenario: 本地 admin dev 启动失败

- **WHEN** Phase7 本地 admin H5 验证在 Windows 上因 Vite watcher 或 autogeneration plugin 报错失败
- **THEN** 必须检查 `vite:dev` 是否仍使用 `cross-env` 和 `VITE_DISABLE_AUTOGENERATION_IMPORT_FILE=true`，并把结果记录到 `agent-findings.md`

### Requirement: 本地三 dev 验收要求

本地验收必须明确区分三个 dev 服务：`apps/api` 独立 Nitro dev、`apps/admin` dev 和 `apps/app` H5 dev。admin 本地页面必须证明页面请求经预期 resolver 或 `/api-shadow` 命中本地 `apps/api`；app 本地 H5 必须证明 `/app/**` 或 `/callComponent/**` 请求命中本地 `apps/api`；API 本地 dev 必须证明 health/ready 和目标 endpoint 可达。本地 dev 证据只代表 local evidence，不代表 production evidence。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 本地 admin H5 验收

- **WHEN** 验证本地 `apps/admin` 页面
- **THEN** 必须记录 admin dev URL、业务路由、页面真实 Network 是否经 `/api-shadow` 或当前 resolver 命中本地 `apps/api`、响应是否成功、控制台是否有目标页面 error，以及该证据是否只覆盖 list/read 或包含 CRUD 交互

#### Scenario: 本地 app H5 验收

- **WHEN** 验证本地 `apps/app` H5 页面
- **THEN** 必须记录 app H5 dev URL、shadow/API base 环境变量、业务页面路径、legacy endpoint、旧格式 response contract、是否命中本地 `apps/api`、是否仍依赖 legacy fallback，以及写入口是否保持 guarded

#### Scenario: 本地 API dev 验收

- **WHEN** 验证本地 `apps/api` dev
- **THEN** 必须记录 API dev URL、`/__nitro/health`、`/__nitro/ready`、目标 endpoint、DB readiness code、是否使用 Neon main env、以及本地 fake/in-memory/fallback 是否参与响应

### Requirement: 三个生产环境验收要求

生产验收必须以三个 package 的 `homepage` 为唯一入口来源：admin H5 当前入口来自 `apps/admin/package.json`，app H5 当前入口来自 `apps/app/package.json`，独立 API server 当前入口来自 `apps/api/package.json`。生产 admin/app 页面必须证明真实生产页面发出请求并命中预期生产 API；生产 API server 必须证明 health/ready 和目标 endpoint 的生产响应。生产证据不能被本地 dev、预览环境、测试分支或旧历史截图替代。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 生产 admin H5 验收

- **WHEN** 使用 Chrome DevTools MCP 打开 admin 生产 homepage 并进入业务页面
- **THEN** 必须记录当前读取到的 admin homepage、业务路由、Network 请求目标、响应状态、关键响应头、页面错误、是否命中生产 `apps/api`，以及是否仍存在 shadow/fallback 或旧服务依赖

#### Scenario: 生产 app H5 验收

- **WHEN** 使用 Chrome DevTools MCP 打开 app 生产 homepage 并进入业务页面
- **THEN** 必须记录当前读取到的 app homepage、业务页面、legacy endpoint、Network 请求目标、response contract、页面错误、是否命中生产 `apps/api`，以及是否仍存在 old app fallback

#### Scenario: 生产 API server 验收

- **WHEN** 使用 Chrome DevTools MCP 或浏览器上下文打开 API server 生产 homepage、`/__nitro/health`、`/__nitro/ready` 或目标 endpoint
- **THEN** 必须记录当前读取到的 API homepage、health status、ready code、是否返回 `DB_READY`、脱敏 host/环境摘要和目标 endpoint 响应摘要；`READY_CONFIGURED`、503 或 HTTP 200 空响应不得升级为 `DB_READY`

### Requirement: 浏览器验收证据记录与状态升级

每个 Chrome MCP 验收结果必须写入 `agent-progress.md` 或稳定证据文件，并在 endpoint 状态中标注 environment、surface、tool、artifactPath 和缺口。浏览器证据升级必须遵守证据分层：local-dev browserEvidence、production browserEvidence、HTTP gate、Vitest、DB_READY、真实库样本、写入闭环和 retirementDecision 是不同字段。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 记录一条浏览器证据

- **WHEN** 完成任一 admin/app/API 的 Chrome MCP 验收
- **THEN** 必须记录 environment、surface、URL、homepageSource、command/port/env、tool、timestamp、request/response 摘要、console 摘要、artifactPath、statusUpgrade 和 remainingGaps

#### Scenario: 证据不完整

- **WHEN** 缺少页面真实 Network、缺少生产入口、缺少 API ready、缺少 console 记录、缺少 artifactPath 或使用 fallback 采集
- **THEN** 对应 endpoint 或环境单元必须保持 partial、needs-browser-evidence、needs-production-evidence、needs-mcp-recapture 或 blocked，不得写成完成
