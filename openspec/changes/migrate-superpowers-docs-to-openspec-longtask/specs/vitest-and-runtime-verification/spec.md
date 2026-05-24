## ADDED Requirements

### Requirement: Vitest 触发时机

Phase7 后续实施凡是修改 `apps/api` handler、adapter、service、repository、runtime manifest、legacy dispatch、guard、admin resolver、app legacy caller 或 response contract，都必须补对应 Vitest 或解释不可写原因。只改 OpenSpec 文档时不强制写 Vitest，但必须运行 OpenSpec strict 校验；改运行时代码时不得只依赖手工 HTTP 或页面截图。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 修改 API 行为

- **WHEN** 新增或改写 admin/app endpoint、legacy adapter、repository、guard、fallback 或 manifest
- **THEN** 必须先定义期望契约，再补 `*.test.ts` 验证成功、空数据、错误、guard 或 fallback 行为；若暂时无法写测试，必须在 `agent-findings.md` 记录阻断原因和替代验证

#### Scenario: 只做文档或证据迁移

- **WHEN** 本轮只修改 `openspec/changes/**`、迁移索引或历史引用，不修改运行时代码
- **THEN** 不新增 Vitest，但必须运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`，并用 `agent-progress.md` 记录校验结果

### Requirement: Vitest 文件与写法规范

本仓库的 Vitest 用例必须使用 `describe` 与 `test` 组织，测试文件命名为 `*.test.ts`，放在对应 monorepo 子包的 `tests/` 或 `src/tests/` 目录，必要时可贴近被测模块使用既有本地测试目录。测试代码必须从 `vitest` 导入 `describe`、`test` 和断言工具，不得用临时脚本替代可重复运行的测试。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 编写新测试文件

- **WHEN** 为 `apps/api`、`apps/admin` 或 `apps/app` 新增迁移测试
- **THEN** 文件必须命名为 `*.test.ts`，优先放入对应包的 `tests/` 或 `src/tests/`，并使用 `import { describe, expect, test } from "vitest";`

#### Scenario: 选择测试归属包

- **WHEN** 被测对象属于 `apps/api` 的 handler、adapter、service、repository 或 manifest
- **THEN** 测试归属 `@01s-11comm/api`；admin resolver 或 admin hook 归属 `@01s-11comm/admin`；app H5 caller 或 app legacy client wrapper 归属 `@01s-11comm/app`

### Requirement: App legacy Vitest 覆盖矩阵

App legacy 迁移测试必须覆盖 legacy response envelope、兼容 DTO、GET/POST 或 body/query 参数兼容、fallback/allowlist 状态、guard 默认阻断和 DB-backed 字段语义。只读 endpoint 至少覆盖成功、空数据和错误路径；写入口在真实写入前必须先覆盖默认 guarded response。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 测试 app 只读 endpoint

- **WHEN** app legacy 只读 endpoint 标记为 DB-backed 或 candidate-after-evidence
- **THEN** Vitest 必须验证 legacy path、method、payload 兼容、response envelope、关键字段映射、空数据行为和 fallback 未冒充 DB 结果

#### Scenario: 测试 app 写入口

- **WHEN** 测试 `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/ownerRepair.saveOwnerRepair` 或 `/callComponent/ownerRepair.appraiseRepair`
- **THEN** 默认测试必须断言未开启 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 时返回 `409 PHASE7_MUTATION_GUARDED` 或等价受保护响应，不得在 Vitest 中执行真实业务破坏性写入

### Requirement: Nitro 接口格式自检机制

统一 Nitro API 的格式自检 MUST 由 Vitest/infra test 证明，而不是依赖人工阅读。任何 app legacy endpoint 新增或改写后，必须有可重复运行的测试同时校验 module files、`legacy-endpoints.ts` handler 形状、runtime manifest、App shadow allowlist 与 response contract 的对齐关系；该自检失败时，对应 endpoint 不得标记完成、DB-ready、production-ready 或 retirement-ready。 本 requirement MUST 作为后续执行、格式自检和退役评审的强制约束。

#### Scenario: 校验模块分层与 handler 形状

- **WHEN** app legacy 模块进入统一 `apps/api`
- **THEN** infra test 必须证明模块具备 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 等必要文件，且 `legacy-endpoints.ts` 的 handler 通过 `get<Module>Runtime(event).legacyAdapter` 分发；测试必须拒绝在 endpoint 文件内创建另一套 adapter、service、repository、mock store 或 DB 访问写法

#### Scenario: 校验 manifest、allowlist 与 contract 对齐

- **WHEN** endpoint 被加入 runtime manifest 或 App shadow allowlist
- **THEN** Vitest/infra test 必须断言 legacy path、method、owner module、cutoverStatus、dataSourceStatus、guard/fallback 状态和 response envelope 与 module endpoint 定义一致；allowlist 中不存在统一 handler、manifest 缺 response contract、contract 未覆盖旧 envelope、test 未覆盖该 endpoint 均属于失败

#### Scenario: 阻断偏差写法

- **WHEN** 出现绕过 `legacyAdapter` 的手写 dispatcher、`legacy-endpoints.ts` 内联业务逻辑、只改 runtime manifest、不补 allowlist/contract/test、只改 allowlist 指向旧 fallback、或用 HTTP 截图替代 infra test 的情况
- **THEN** 这些都属于接口格式偏掉；必须保持 partial/blocked 并补齐自检测试，不能用手工验证或单层证据替代格式门禁

### Requirement: DB 与外部服务测试边界

Vitest 不得默认连接 Neon main 或执行真实生产写入。数据库相关单元测试应优先使用 mock/fake adapter 验证 query intent、字段映射、guard 和错误路径；Neon main `DB_READY`、真实库样本、写入读回回滚属于受控运行时证据，必须通过 gated 环境变量和人工记录执行。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 测试 DB-backed repository

- **WHEN** repository 使用 Drizzle/Neon 数据源
- **THEN** Vitest 应验证表、where 条件、字段映射、分页、空数据和异常处理，不得要求本地测试环境拥有真实 Neon secret

#### Scenario: 需要真实 Neon main 证据

- **WHEN** endpoint 需要升级 `dbReadinessEvidence`、真实库样本或写入闭环
- **THEN** 必须走 `RUN_PHASE7_DB_READINESS_CHECK=1`、`PHASE7_E2E_*`、read-back、rollback、residual check 和 guard restored 证据流程；Vitest 通过不能替代该运行时证据

### Requirement: 验证命令与记录

每个实施切片必须记录实际运行的测试命令、包名、结果和失败摘要。目标包存在对应脚本时优先运行包级命令；没有脚本时可用 `pnpm -F <package> exec vitest run <path>` 精准运行相关 `*.test.ts`。所有验证结果必须写入 `agent-progress.md`，失败或跳过原因必须写入 `agent-findings.md`。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: API 切片完成

- **WHEN** 一个 `apps/api` admin/app endpoint 切片声称完成
- **THEN** 必须记录相关 Vitest、typecheck、runtime manifest/contract test、HTTP gate 或不可执行原因，且不能用单一测试命令替代浏览器、DB_READY 或退役门禁证据

#### Scenario: 测试失败

- **WHEN** Vitest、typecheck、HTTP gate 或 OpenSpec 校验失败
- **THEN** 对应任务不得勾选完成，必须记录失败命令、关键错误、影响范围和下一步修复方向

### Requirement: CI 与 workflow 门禁

统一 Nitro API 迁移相关 CI/workflow MUST 保留旧总设计门禁：依赖安装使用 `pnpm install --frozen-lockfile`；monorepo 全量门禁使用 `pnpm run ci` 或项目当前等价脚本；App 专项 CI 继续覆盖 H5 production build、type-check、Vitest 和 Nitro/Vercel build；不得重新引入全局工具安装、`run_install`、`pnpm ls -g`、直接 `turbo --version`、直接全局 `turbo` 或依赖全局环境的步骤；必要 action major versions 不得随意降级，中文 workflow/job/step 名称应保留。

#### Scenario: 修改 CI workflow

- **WHEN** 后续代理修改 GitHub Actions、Vercel/Cloudflare 部署 workflow 或 monorepo CI 脚本
- **THEN** 必须复核 lockfile 门禁、workspace-local Turbo、App 专项 CI、无全局安装和 action major version，且记录验证结果

#### Scenario: 外部部署 check 失败

- **WHEN** Cloudflare、Vercel 或 GitHub check 失败
- **THEN** 必须先读取 check 状态、run 详情和可用日志；可本地复现的问题归入代码/配置修复，权限、项目绑定、环境变量或平台无日志问题记录为平台侧风险
