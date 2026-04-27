<!-- 状态：Phase1 快照迁入已完成；Phase2 已完成 `apps/api` 最小 Nitro 影子服务与 fee/payment/report 首批纵切样板；Phase3/Phase4 已推进到独立 Nitro API 与首批业务迁移验证；Phase5 已完成 expenseManage 首波：houseCharge list/detail 只读联调、expenseItemSetting list/detail/create/update/delete-policy、admin hook/page 影子联调、Chrome MCP 与真实 Neon 验证；当前可开启 Phase6 切流准备，但不得把 houseCharge create/update/delete 视为已完成能力。Memorix canonical history retention gate 已拆分释放为 released-for-phase2-progress / pass-with-permanent-source-retention；旧源目录 D:\code\ruan-cat\01s-11comm-app 永久禁止删除、移动、归档、重命名或清空。 -->

# 2026-04-25 11comm App 迁入 Monorepo 与唯一 Nitro API 设计

## 背景

当前存在两个长期分离的项目：

- `D:\code\ruan-cat\01s-11comm`：admin 后台 monorepo，包含 `apps/admin` 与 `apps/type`。
- `D:\code\ruan-cat\01s-11comm-app`：移动端 app 项目，包含独立前端、独立 Nitro legacy/mock 服务。

目标是把 `01s-11comm-app` 的业务源码、运行配置和必要历史上下文迁入 `01s-11comm`，作为 monorepo 内的子应用，并建立唯一、独立部署的 Nitro API 服务，同时支撑 admin 后台和 app 前端。

## 已确认决策

1. 唯一 Nitro API 服务放在 `apps/api`。
2. `01s-11comm-app` 迁入为 `apps/app`。
3. 迁入 app 时不保留原仓库 Git 历史，不使用 `git subtree`。
4. app 迁入采用过滤快照复制：直接复制业务源码和必要上下文到 `apps/app`，但排除无用工具副本和构建产物，后续在 monorepo 内治理。
5. 第一阶段以“不拆解 app 业务结构”为主，不立即重写 app 内部结构；“原样保留”不包含 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 等多工具垃圾副本。本次受控清理进一步收敛 app-local OpenSpec/OPSX 冗余副本：只删除 `apps/app/.claude/commands/opsx/**` 与 `apps/app/.claude/skills/openspec-*`，不删除 app 专属非 OpenSpec skills；根 OpenSpec commands/skills 为 canonical。
6. `apps/type` 继续作为数据库 Schema、Zod Schema、TypeScript 类型的唯一事实来源。
7. Nitro 接口不新增任何鉴权逻辑，不引入 JWT、Token 校验、Neon Auth。
8. Phase2 的范围是“最小可运行 `apps/api` 影子服务 + fee/payment/report 首批纵切样板”；它不是只搭建无业务接口的纯基础设施空壳，也不是 repair/resource/parking 等多个模块并行迁移规划。
9. 纯基础设施壳层加固、CI、部署、完整运行时配置和接入策略归入阶段 3；repair/resource/parking 等多模块扩张归入阶段 4。

## 当前阶段状态与 Phase3 启动准则

Phase1 快照迁入已经完成，Phase2 也已经完成并通过最新 dev HEAD 验收。当前 `apps/api` 已具备独立 Nitro 影子服务边界，包含独立 package、独立启动/测试/类型检查/构建入口、健康检查和 root route；首批业务纵切只覆盖 fee/payment/report，不把其他业务域伪装为已完成能力。

Phase2 已完成边界如下：

- `apps/api` 作为独立 Nitro 服务存在，且不依赖 admin Vite 或 app uni 编译运行。
- app legacy 侧以白名单方式覆盖 fee/payment/report 首批兼容路由，保留 `/app/**` 旧契约、旧字段和旧响应形态。
- admin canonical 侧已完成两个样板接口：`POST /api/property-manage/expense-manage/house-charge/list` 与 `POST /api/property-manage/report-manage/payment-details-form/list`。
- app legacy adapter 与 admin canonical adapter 共享同一 fee runtime/service/repository，避免维护两套互相漂移的数据源。
- 真实 Neon 数据库连接和完整 runtimeConfig 未作为 Phase2 blocker；Phase2 已验证无数据库 URL fallback、测试、类型检查和构建，真实运行环境接入进入 Phase3。

当前允许启动 Phase3。Phase3 聚焦部署与运行时治理，不扩大为更多业务域迁移：

- API 部署 preset 与部署平台配置。
- 完整 runtimeConfig、环境变量治理、CORS 策略、日志、监控与错误追踪。
- admin/app API base URL 接入策略。
- 回退策略、局部切流验证和旧服务对照验证。
- 将 Phase2 的最小 runtime helper 固化为可扩展基础设施规范。

Phase3 必须继续使用以下质量门禁：

- `pnpm install --frozen-lockfile` 作为依赖安装门禁。
- `pnpm run ci` 作为 monorepo 全量门禁，并通过 workspace-local Turbo 覆盖 admin/api/app/type。
- `App 专项 CI` 继续作为 app 侧补充门禁，覆盖 H5 production build、type-check、Vitest 和 Nitro Vercel build。
- workflow 不得重新引入 `run_install`、`--global`、`pnpm ls -g`、直接 `turbo --version`、直接 `run: turbo` 或其他依赖全局工具的步骤。
- 必要 action major versions 不降级；语义化中文 workflow、job、step 名称继续保留。

Phase4 或后续阶段再处理 repair/resource/parking、charge-machine/open-door、machine-record、更多 admin 三级业务路径 CRUD 和其他 app legacy endpoint 扩展。上述内容不得被包装为 Phase3 的前置阻断项；Phase3 只需要为这些后续波次提供可部署、可配置、可观测、可回退的 API 基础设施。

外部部署 checks 的处理准则如下：

- GitHub Actions 是主门禁；本地可复现的构建、类型、测试和 lockfile 问题必须在本地修复后再推送验证。
- Cloudflare 与 Vercel check-runs 若失败，应先用 `gh`、GitHub API 或 GitHub MCP 读取 check 状态、run 详情和可用日志。
- 能本地复现的部署构建错误归入代码或配置修复；外部平台无日志、权限缺失、项目绑定缺失、环境变量缺失或平台侧配置问题，应明确标记为平台侧风险，不得伪装成本地代码已验证失败。

## 后续报告编写规范

本迁移设计的后续迁移、CI、复核、多代理协作任务默认不再为每个子代理、每个阶段、每个检查点拆分多个报告文件。用户已经明确不喜欢大量碎片化报告文件，后续文档沉淀应以单一汇总报告为默认行为。

如确实需要编写报告，应只创建或持续维护一个汇总报告文件，建议总长度约 3500 行左右。该长度应足以覆盖背景、探索过程、实现记录、验证证据、复核结论、遗留风险和后续事项，不应因为子任务数量较多而自动拆成多个报告。

汇总报告应按章节收纳探索、编辑、复核、验证证据和后续事项。子代理反馈应由主代理合并入同一个汇总报告，或直接汇总到最终回复；不允许制造多个碎片化报告文件来分别承载子代理、阶段或检查点反馈。

只有在以下情况之一成立时，才允许拆分报告：

1. 用户当次明确要求拆分报告。
2. 外部工具或平台强制要求多个文件。
3. 单文件已经大到明显影响阅读、检索、编辑器打开或工具处理。

拆分前必须说明理由，并尽量保持最少文件数。若已有多个临时报告，应优先把有效内容合并进一个汇总报告；合并后是否删除临时文件，必须按用户确认执行，不得静默删除用户可能需要的历史报告。

该规范优先约束本迁移设计的后续阶段。它与旧 `CLAUDE.md`、`AGENTS.md` 中“子代理以报告文件反馈”的旧习惯发生冲突时，以单一汇总报告规范为准，除非用户当次明确要求多文件。

## 目标架构

```text
01s-11comm/
  apps/
    admin/   # pure-admin 后台前端
    app/     # 由 01s-11comm-app 快照复制迁入的移动端子应用
    api/     # 唯一 Nitro API 服务，独立启动、构建、部署
    type/    # Schema / Zod / Drizzle / TS 类型唯一事实来源
```

最终状态：

- admin 和 app 都通过配置指向 `apps/api`。
- `apps/admin/server` 与 `apps/app/server` 只作为迁移来源或临时兼容层，不作为长期生产 API。
- Phase1 快照迁入验收只确认 `apps/app/server` 被保留为 legacy 来源；已经顺手改成 `nitro/h3` 的少量 import 不需要回滚，后续发现或尚未处理的直接 `"h3"` 导入、handler 风格和 legacy mock 写法，统一标记为 Phase1 之后的历史债务任务，在下一阶段/后续 `apps/api` 迁移时集中改造，不作为 Phase1 完成 blocker。
- app legacy 路径 `/app/**`、`/callComponent/**` 先保留兼容，再逐步映射到规范 API。
- 新增和补齐 CRUD 时，以 admin 的 `rank-route-keys.ts` 三级业务路径作为 canonical 业务坐标。

## 迁移策略

采用“过滤快照迁入 + 影子 API + 渐进拆耦”。

### 阶段 1：快照迁入 app

把 `D:\code\ruan-cat\01s-11comm-app` 复制到：

```text
apps/app/
```

保留 app 的既有业务结构，包括：

- `src/**`
- `server/**`
- `env/**`
- `.claude/skills/**` 中的 app 专属非 OpenSpec skills
- `.agents/skills/**` 如源项目存在则记录，当前 app 迁入结果为缺失
- `.agent/skills/**` 已删除，不再作为 app-local 技能来源
- `package.json`
- `vite.config.ts`
- `nitro.config.ts`
- `pages.config.ts`
- `manifest.config.ts`
- 现有脚本、配置、mock 体系和有价值的技能经验

只做 monorepo 必要适配，例如包名、workspace 识别、脚本入口、依赖安装策略。

以下目录不迁入，避免把无关 AI 客户端副本和垃圾配置带入 monorepo：

- `.cursor/**`
- `.gemini/**`
- `.qoder/**`
- `.trae/**`
- `.kiro/**`

如果这些被排除目录内存在极少量确有价值的迁移经验，只能在后续专项任务中人工摘录到迁移清单或统一技能体系，禁止整目录复制。

迁入 app 时还要同步盘点 app 项目内的 skills 技能。原则是保留 app 专属非 OpenSpec skills，再判断价值，不在第一阶段粗暴删除或改写业务迁移经验；旧的“只记录不删除”口径已被本次受控清理收敛，app-local OpenSpec/OPSX 副本按根 canonical 删除：

1. 识别 app 项目内 `.claude/skills/**` 的 app 专属非 OpenSpec 技能清单，并记录 `.agents/skills/**` 缺失、`.agent` 已删除状态。
2. 标记与 app 业务、uni-app、Nitro legacy、mock 数据、接口适配、排错经验相关的有价值技能。
3. 对与当前 monorepo 技能冲突的内容，只记录冲突，不立即合并；对 `apps/app/.claude/commands/opsx/**` 与 `apps/app/.claude/skills/openspec-*` 这类根 OpenSpec 已覆盖的重复副本，记录为 `dropped-after-root-canonical`。
4. 后续单独设计 skills 合并任务，把有价值经验迁入本项目统一技能体系。

### 阶段 1.1：Markdown 文档迁移策略

`01s-11comm-app` 不是只有源码需要迁入，仓库内还存在大量 Markdown 上下文，包括根级 AI 记忆文档、VitePress 文档、OpenSpec 工件、历史报告、组件 README、mock 说明、skills 参考文档和多工具命令/技能副本。Markdown 迁移不能简单等同于“复制后随手去重”，必须先保留证据，再做分层治理。

本轮抽样盘点的基线是：排除 `.git`、`node_modules`、`dist`、`build`、`.output`、`.nuxt`、`.vite`、coverage、`.turbo` 等目录后，`D:\code\ruan-cat\01s-11comm-app` 约有 314 个项目相关 Markdown。正式迁入前应以迁入当日快照重新生成一次基线，并额外排除 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`，不能直接沿用这个数量作为最终事实。

#### 快照迁入时的默认保留规则

第一阶段采用“项目自有 Markdown 默认保留”的规则：

- `README.md`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 等根级说明和 AI 记忆文档原样进入 `apps/app`，视为 app 子项目作用域内的历史上下文。
- `docs/**`、`openspec/**`、`src/**/README.md`、`src/**/index.md`、`.claude/**` 中的 app 专属非 OpenSpec Markdown、`.github/**` 下的项目自有 Markdown 默认保留路径不变；`apps/app/.agent` 已删除，`apps/app/.claude/commands/opsx/**` 与 `apps/app/.claude/skills/openspec-*` 已按根 canonical 受控删除。
- `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 下的 Markdown 默认排除，不进入 `apps/app`。
- `src/uni_modules/**`、`gitee-example/**` 等第三方或参考实现中的 Markdown 先随 app 快照保留，但迁移清单中必须标记为“第三方/参考资料”，不能升级为 monorepo 规范事实来源。
- `node_modules/**`、`dist/**`、`.output/**`、coverage、临时缓存等依赖或构建产物不属于迁入对象，即使其中包含 Markdown 也不迁入。
- 第一阶段不把 app 文档直接搬到根级 `docs/**`，也不把 app skills 直接覆盖根级 `.claude/skills/**` 或 `.agents/skills/**`。

#### 文档价值分类

迁入后按价值分层建立清单，后续治理必须基于清单而不是凭文件名删除：

| 类别                  | 文档形态                                                                                         | 处理策略                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| P0 迁移关键上下文     | Nitro 双运行时、legacy API、mock endpoint、Vite 兼容、迁移计划、当前 README 补充说明             | 保留并优先纳入迁移索引，迁移 `apps/api` 时持续同步                                              |
| P1 app 业务与历史经验 | 业务页面迁移报告、OpenSpec 归档、组件 README、排错复盘、uni-app 兼容经验                         | 保留在 `apps/app`，必要时摘录到单一汇总报告的对应章节                                           |
| P2 模板/第三方参考    | unibest/VitePress 基础文档、uni_modules 文档、gitee-example 参考说明                             | 保留但降权，清单中标记来源，不作为主项目规范                                                    |
| P3 重复或过时候选     | 多 AI 工具重复的 OpenSpec skills、完全相同的 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`、旧 prompt 草稿 | OpenSpec/OPSX app-local 副本已按根 canonical 受控删除；其他重复项继续记录重复关系和建议归档方向 |

#### 重复文档处理规则

重复文档分为“精确重复”和“语义重叠”两类处理：

1. 对精确重复文件，使用文件哈希或内容比对生成重复组。已观察到的典型重复包括多工具目录下的 OpenSpec skills，以及根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 同步副本。
2. 对工具入口型重复文档，只保留当前项目需要的 app 专属非 OpenSpec `.claude/skills/**`；`.agent/skills/**` 已删除，`.agents/skills/**` 当前缺失；`.cursor/skills/**`、`.gemini/skills/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 默认排除。
3. 对语义重叠但内容不同的文档，例如 app 的 Nitro/mock 经验与主项目 Nitro/API 规范，只记录“主项目 canonical 文档”和“app 历史来源文档”的关系，不直接合并。
4. 后续去重只能采用“建立 canonical + 保留引用/归档”的方式，不能在没有清单和复核结论时直接删除。
5. 如果 app 文档与主项目根级 `docs/**`、`.claude/skills/**`、`.agents/skills/**` 冲突，以主项目现有规范为默认 canonical，app 文档作为迁移来源或历史证据保留。

#### skills 与 AI 记忆文档处理

AI 记忆文档的迁移目标不是“把所有规则揉成一个大文件”，而是保留 app 历史上下文，并把少量可复用、可验证、仍然适用于当前 monorepo 的经验摘录到合适位置。

合并总原则：

- `apps/app` 是 app 历史记忆的默认归属地；根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 仍然是当前 monorepo 的最高优先级记忆入口。
- 第一阶段只做快照保留、分类、冲突记录和摘录建议，不直接覆盖根级 AI 记忆文档，也不直接覆盖根级 skills。
- AI 记忆的合并采用“保留原文 -> 建立清单 -> 分类评估 -> 摘录/引用 -> 复核”的流程；没有清单和复核结论时，禁止凭直觉合并。
- app 历史记忆中的临时 prompt、一次性执行策略、旧工具约束、已废弃目录结构、外部客户端专属规则，只能作为历史证据保留，不能提升为 monorepo 长期规范。
- 只有当一条经验同时满足“仍然真实、可复现、适用于 admin/app/api/type 至少两个长期模块、与根级规范不冲突”时，才允许提议进入根级 AI 记忆。

迁入位置规则：

| 来源内容                                                                                                | 第一阶段位置                      | 后续处理                                                                              |
| ------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| app 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`                                                          | 原样进入 `apps/app/`              | 作为 app 子项目历史上下文，不自动提升为根级规则                                       |
| app `.claude/skills/**` 中的 app 专属非 OpenSpec skills                                                 | 保留在 `apps/app/.claude/skills/` | 进入 skills 价值清单和冲突矩阵，后续逐项合并                                          |
| app `.claude/commands/opsx/**`、`.claude/skills/openspec-*`、`.agent/**`                                | 删除或保持不存在                  | 根 OpenSpec commands/skills 为 canonical，迁移清单记录 `dropped-after-root-canonical` |
| app `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`                                     | 默认不迁入                        | 如确有独特经验，只人工摘录到清单，不复制原目录                                        |
| app 业务、uni-app、ColorUI 到 wot-design-uni、z-paging、动态标题、Nitro legacy/mock、Vite mock 兼容经验 | 保留在 `apps/app` 原文位置        | 标记为可迁移经验，优先进入单一汇总报告的后续整理章节                                  |
| 与主项目同名或同职责的 skills                                                                           | 保留 app 原文，不覆盖主项目       | 生成冲突矩阵，明确 canonical 指向和差异                                               |
| 包含敏感信息或个人环境的记忆                                                                            | 阻断原样公开迁入或先脱敏          | 保留变量名、错误形态、复现步骤，移除真实值                                            |

根级记忆提升规则：

- 提升到根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 的内容必须是当前 monorepo 级别的长期规则；如果只是 app 子项目规则，应写入 `apps/app/CLAUDE.md` 等 app 作用域文件。
- 根级 AI 记忆文件如果在本项目中保持同步副本关系，后续修改必须一次性同步到 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`，不能只改其中一个入口。
- app 记忆中与根级规则冲突的内容，默认以根级规则为 canonical；只有在人工复核确认根级规则已经过时后，才允许另开任务修改根级规则。
- 摘录进入根级记忆时必须保留来源引用，例如来源路径、原始主题和迁移日期，避免未来无法判断规则来源。
- 不把“使用某个 AI 客户端/某个子代理工具/某个一次性命令”的历史要求提升为当前项目的通用要求。

skills 合并规则：

- app 专属非 OpenSpec skills 先作为 app 子项目技能保留，不在第一阶段直接进入根级 `.claude/skills/**` 或 `.agents/skills/**`；app-local OpenSpec/OPSX 副本已按根 canonical 删除。
- 同名 skill 必须先比较职责、触发条件、禁止项、示例和相关脚本；同名不等于可覆盖，不同名也可能职责冲突。
- 可复用经验优先以“摘录补充 canonical skill”的方式进入主项目技能，而不是复制一份平行 skill。
- 如果 app skill 只服务 uni-app、移动端 mock、legacy API 或 app 内组件迁移，应保留在 `apps/app` 作用域，不升级为全仓库技能。
- 如果 app skill 中记录的是事故复盘、排错经验或迁移教训，应优先沉淀到单一汇总报告的对应章节或对应 canonical skill 的“历史事故/约束”章节。

必须生成的合并证据：

```text
docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md
```

为避免迁移过程文档膨胀和过期，第一阶段不再长期保留 `apps/app/docs/migration/*.md`。该目录下曾生成的过程性清单只作为临时审计材料，其有效结论必须压缩进 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`、本设计文档和 Phase1 plan；后续阅读以 superpowers 文档为入口。

清单至少包含：来源路径、目标候选位置、主题、价值等级、是否仍然有效、适用范围、是否冲突、敏感信息状态、处理决策、canonical 指向、摘录摘要、复核人和复核日期。

AI 记忆合并决策分为五类：

- `keep-app-scope`：只保留在 `apps/app`，不进入根级规则。
- `promote-root-memory`：摘录进入根级 AI 记忆，适用于整个 monorepo。
- `merge-canonical-skill`：提炼进入主项目已有 canonical skill。
- `archive-reference`：只作为历史证据或迁移参考，不进入执行规则。
- `reject-or-redact`：因过时、冲突、敏感或误导风险而拒绝合并，或先脱敏再保留。

#### Memorix 记忆保全与项目身份迁移

`01s-11comm-app` 被迁入后，原目录仍必须永久保留，不能作为迁移收口、清理、退休、归档或释放 gate 的动作目标。由于 Memorix 记忆、项目身份和路径证据仍可能依赖旧路径，必须把 Memorix 当作独立的迁移对象处理，并把“源项目身份、alias、观测记录、会话摘要、可提升经验”全部纳入第一阶段证据。

旧源目录保留红线：

- `D:\code\ruan-cat\01s-11comm-app` 是完整独立 git 项目，必须永久保留。
- 无论任何阶段、任何 gate 状态、任何 alias/export/import/retirement review 结论如何，都禁止删除、移动、归档、重命名或清空该目录。
- 自动化代理、子代理、脚本、人工验收流程、迁移收口流程、清理流程、退休复核流程和释放 gate 流程都不得把该目录作为删除、移动、归档、重命名或清空对象。
- 未来只允许对该目录做只读引用、保留路径证据、在文档中记录其存在，或使用只读命令采集迁移证据；禁止退役。

当前调研结论：

- 本次 Codex 会话没有暴露 `mcp__memorix__*` 工具；这只能说明当前会话无法直接调用 Memorix MCP，不能推断项目没有历史记忆。
- 本机存在 `memorix` CLI，可作为 MCP 不可用时的只读调研和迁移辅助入口。
- `memorix status` 在 `D:\code\ruan-cat\01s-11comm-app` 下识别到项目名 `11comm-app`、项目 ID `ruan-cat/11comm-app`、数据目录 `C:\Users\pc\.memorix\data`。
- `memorix doctor` 在同一目录下显示 canonical ID 为 `nwt-q/001-Smart-Community`，并把 `ruan-cat/11comm-app` 识别为 alias；`.project-aliases.json` 也记录了 `d:/code/ruan-cat/01s-11comm-app` 这个 rootPath。
- 因此迁移时必须同时处理 `nwt-q/001-Smart-Community`、`ruan-cat/11comm-app`、`D:\code\ruan-cat\01s-11comm-app` 这三类身份线索，不能只按新目录 `apps/app` 重新建一个空记忆身份。

Memorix 保全目标：

| 对象                  | 第一阶段动作                                                                | 后续动作                                                                                            |
| --------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 项目身份 alias        | 记录旧 canonical ID、alias、旧 rootPath、新 rootPath、git remote 和迁移日期 | 将 `apps/app` 或当前 monorepo 关联为 app 历史记忆的可检索入口；旧路径作为永久保留证据，不得删除     |
| active observations   | 导出或清点 app 相关 active 记忆，记录 ID、title、type、topicKey、projectId  | 判断保留在 app 作用域、提升到根级 monorepo 记忆、归档或标记已解决                                   |
| archived observations | 同样清点但默认不提升为执行规则                                              | 只在事故复盘、历史迁移背景或避免重复踩坑时引用                                                      |
| sessions              | 保留最近会话摘要和关键决策链                                                | 合并到 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价证据文件           |
| graph/entities        | 记录与 app 业务、legacy API、z-paging、wot-design-uni、Nitro mock 相关实体  | 与 AI 记忆清单交叉引用，避免只迁移 Markdown 而丢失关系型记忆                                        |
| app 专属经验          | 保留在 `apps/app` 作用域                                                    | 例如 uni-app、ColorUI 迁移、z-paging、旧路径 mock 等经验，不默认污染主项目 admin/API canonical 规则 |
| monorepo 通用经验     | 标记为可提升候选                                                            | 只有通过复核后才能进入根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 或 canonical skill                 |

必须生成的 Memorix 迁移证据：

```text
docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md
```

`2026-04-25-phase1-consolidated-report.md` 至少记录：memory id、title、type、status、projectId、topicKey、tags、related concepts、是否 active、是否含敏感信息、迁移决策、目标位置和复核结论。

`2026-04-25-phase1-consolidated-report.md` 至少记录：

- 旧 rootPath：`D:\code\ruan-cat\01s-11comm-app`
- 新 rootPath：`D:\code\ruan-cat\01s-11comm\apps\app`
- 已观测项目身份：`ruan-cat/11comm-app`
- 已观测 canonical/alias 身份：`nwt-q/001-Smart-Community`
- 当前目标 monorepo 身份：`ruan-cat/11comm`
- 是否需要把 app 历史身份作为 alias 绑定到新 monorepo 或 app 子项目入口

推荐迁移流程：

1. 在源项目目录运行 `memorix status`、`memorix doctor`、`memorix recent` 和若干业务关键词搜索，例如 `z-paging`、`Nitro legacy`、`mock endpoint`、`fee`，记录命令输出摘要。
2. 从 `C:\Users\pc\.memorix\data` 中只读清点与 app 项目身份相关的 observations、archived observations、sessions 和 alias，不直接编辑 Memorix 数据文件。
3. 用 `2026-04-25-phase1-consolidated-report.md` 做中间层，不把所有 Memorix 内容直接写入根级 AI 记忆。
4. 对每条记忆按 `keep-app-scope`、`promote-root-memory`、`merge-canonical-skill`、`archive-reference`、`reject-or-redact` 分类。
5. 对需要保留但不应进入根级规则的记忆，在 `apps/app` 作用域建立引用；对需要长期作用于 monorepo 的记忆，再同步到根级 AI 记忆或对应 skill。
6. 如果当前会话暴露 `mcp__memorix__*` 工具，优先用 MCP 做 session start、search、detail、store、resolve；如果没有暴露，则使用 `memorix` CLI 做只读清点，并在文档中明确“本会话无 MCP，使用 CLI 证据替代”。
7. 迁入完成后，在新仓库根目录和 `apps/app` 目录分别运行 Memorix 查询，确认 app 历史记忆能被检索到；无论检索结果如何，都不能删除、移动、归档、重命名或清空旧项目目录。

阻断条件：

- 任何流程试图删除、移动、归档、重命名、清空或废弃 `D:\code\ruan-cat\01s-11comm-app`。
- 只迁移 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`，却没有清点 Memorix observations 和 sessions。
- 把 `memorix status` 中某个 projectId 的 0 条 observations 误判为“没有记忆”，而没有交叉检查 `memorix doctor`、`.project-aliases.json`、observations、sessions 和关键词搜索。
- 直接编辑 `C:\Users\pc\.memorix\data\*.json` 或 SQLite 数据库来“合并”记忆；Memorix 数据文件只能作为只读证据，写入应走 MCP 或 CLI。
- 没有脱敏就把包含个人路径、账号、token、API key、数据库连接串的记忆写进可共享文档。
- 没有验证新路径能检索 app 历史记忆，就删除旧 alias 或旧 rootPath 线索；旧源目录本身即使验证通过也永久不得删除。

#### 敏感信息检查

Markdown 迁入前后都要做敏感信息扫描，至少覆盖以下模式：`token`、`secret`、`password`、`passwd`、`DATABASE_URL`、`NEON`、`VERCEL`、`APP_SECRET`、`api_key`、`Bearer`、`私钥`、`密钥`、`口令`、`密码`。

处理原则：

- 示例值可以保留，但必须能明确看出是示例，例如 `user:pass`、`ep-xxx`、`your-api-key-here`。
- README 中的演示账号密码、参考系统账号等必须标记为“公开演示凭据/历史参考”，不能混同为生产密钥。
- 如果发现真实数据库连接串、真实 API key、生产 token 或个人账号凭据，必须先脱敏再迁入可共享文档。
- 脱敏不能破坏排错价值，必要时保留变量名、服务类型、错误形态和复现步骤，移除真实值。

#### 字符集与文本完整性保护

迁入 `D:\code\ruan-cat\01s-11comm-app` 时，不能依赖“看起来没乱码”的人工判断，也不能把 Windows 终端中的显示乱码当成源码真实乱码。迁移必须以字节级对账和 UTF-8 校验为准。

复制规则：

- 使用保留原始字节的文件复制方式完成第一轮快照迁入；禁止用 `Get-Content | Set-Content`、`Out-File`、编辑器另存为、脚本解码后重写等文本管道做批量复制。
- 第一轮迁入只做 byte-for-byte 复制和过滤，不在复制过程中统一格式化、不批量转换编码、不批量改写行尾。
- 二进制资源按字节复制；文本文件在复制完成后再单独做校验，不允许通过“重新保存”来修复未知问题。
- 终端输出如果出现中文乱码，只能视为终端编码问题线索，不能把乱码文本复制回 Markdown、Vue、TypeScript 或配置文件。

迁入前基线：

- 在源项目生成排除 `.git`、`node_modules`、`dist`、`build`、`.output`、`.nuxt`、`.vite`、`coverage`、`.turbo`、`.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 后的文件清单。
- 对每个待迁入文件记录相对路径、文件大小和 SHA256；文本文件额外记录是否存在 BOM、当前行尾形态和是否可严格按 UTF-8 解码。
- 清单必须进入迁移证据材料，后续 `apps/app` 的目标文件用同一套相对路径和 SHA256 做对账。

迁入后校验：

- 对所有 byte-for-byte 迁入文件做源目标 SHA256 比对；未经过后续有意改写的文件必须完全一致。
- 对 `.md`、`.ts`、`.tsx`、`.js`、`.vue`、`.json`、`.yaml`、`.yml`、`.css`、`.scss`、`.html`、`.env.example` 等文本文件做 UTF-8 严格解码检查。
- 扫描新增的 Unicode replacement character（`U+FFFD`）、典型乱码标记 `锟`，以及异常新增的 `\uXXXX` 转义；合法的 `\uXXXX` 必须人工确认来源。
- 使用 `git diff --check` 检查空白错误；文件纳入 Git 管理后，再用 `git ls-files --eol` 检查是否存在非预期 CRLF。
- 抽样打开中文密集文件，例如 `README.md`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md`、历史报告和 mock 说明，确认编辑器视角下文本正常。

停止条件：

- 只要源目标 SHA256 在未改写文件上不一致，必须停止后续迁移，回到源项目重新按字节复制。
- 只要 UTF-8 解码失败、出现新增 `U+FFFD` 或明显 `锟` 乱码，必须停止并定位具体文件，不能继续迁移或提交。
- 如果后续确实需要统一 LF 行尾或格式化，必须在完成 byte-for-byte 基线验收之后作为单独步骤处理，并记录哪些文件发生了有意改写。

#### 迁移后索引与清单

第一阶段完成后必须产出 Markdown 清单，建议位置为：

```text
docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md
```

清单至少包含：

- 原始相对路径、迁入后路径、文档类别、价值等级、是否第三方/模板来源。
- 是否与主项目文档或 skills 冲突。
- 是否为重复组成员，重复组 canonical 建议指向哪里。
- 是否包含敏感信息命中项，以及处理状态。
- 是否与 `apps/api` 迁移、legacy path、动态 mock、业务页面迁移直接相关。

根级设计文档或主项目 `docs/**` 只需要追加索引链接或摘要，不应复制 app 文档全文，避免主项目文档体系被 app 历史资料冲散。

#### 动态 mock 增量文档同步

app 项目内存在 `src/api/mock/README.md`、`docs/superpowers/specs/*mock*`、`docs/superpowers/plans/*mock*`、Nitro 运行时说明和历史排错报告。后续迁移动态 mock 或补齐 endpoint 时，文档同步规则如下：

- 每次从 `apps/app/server/modules/**`、`apps/app/src/api/mock/**` 迁移或新增 endpoint 到 `apps/api`，必须同步更新 app 侧 mock 说明或迁移清单，记录旧路径、规范路径、数据源和兼容状态。
- `apps/api` 成为唯一 API 后，应在 `apps/api` 侧形成新的 canonical API/endpoint 文档；`apps/app` 侧文档保留 legacy 背景和兼容说明。
- 不允许只修改动态 registry、memory repository 或 mock 包装层而不更新对应文档状态。
- 对仍处于 mock/memory 数据源的接口，文档必须明确标记“非生产数据源”，避免被误当作真实数据库实现。

#### 收费/缴费 mock 增量接口的双端支撑策略

`D:\code\ruan-cat\01s-11comm-app` 已补充一批费用、欠费、支付、充电桩、报表和开门记录相关 mock endpoint。总设计需要保留这些 endpoint 的迁移线索，但 Phase2 只选择 fee/payment/report 作为首批纵切样板；充电桩、开门记录以及 repair/resource/parking 等多模块扩张只记录为后续波次或后台功能缺口。迁入时不能只把首批 endpoint 当作 app 兼容层处理，必须在 `apps/api` 内同时设计 app legacy adapter 和 admin canonical adapter。

已确认的 app 侧来源包括：

- `D:\code\ruan-cat\01s-11comm-app\src\api\fee.ts`
- `D:\code\ruan-cat\01s-11comm-app\server\modules\fee\endpoints.ts`
- `D:\code\ruan-cat\01s-11comm-app\src\tests\nitro-runtime\fee-endpoints.test.ts`
- `D:\code\ruan-cat\01s-11comm-app\docs\superpowers\plans\2026-04-25-h5-mock-endpoint-coverage.md`

双端支撑原则：

- `apps/api` 内只保留一套领域服务和数据访问层，Phase2 先围绕 fee、payment、owe-fee-callable、fee-report 建立样板；app 和 admin 通过不同 adapter 消费同一服务。
- app adapter 必须保留 `/app/**` legacy 路径、GET/POST 兼容方式、旧字段名和旧响应结构，直到 app 前端完成调用迁移。
- admin adapter 必须按 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径组织规范接口，返回 `@01s-11comm/type` 定义的 `JsonVO`、`PageDTO` 和统一 DTO。
- mock/memory repository 只能作为过渡数据源；最终应替换为 `apps/type/src/business/**/schema.ts` 中的 Drizzle schema 和 Neon 数据库。
- 对当前 admin 没有明确三级业务路径的能力，不允许硬塞到不相关模块；必须记录为后台功能缺口，后续通过 admin 功能扩展规格补齐业务路径、菜单、页面和 CRUD。

Phase2 首批 fee/payment/report endpoint 的迁移矩阵如下：

| app legacy endpoint                                      | 业务含义     | admin canonical 业务坐标                                                                                                                                          | 迁移处理                                                                                |
| -------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `/app/fee.listFee`                                       | 费用列表     | `propertyManage.expenseManage.houseCharge`、`propertyManage.expenseManage.expenseSummaryTable`                                                                    | app 保留旧响应；admin 提供分页费用列表和汇总筛选                                        |
| `/app/feeApi/listOweFees`                                | 欠费列表     | `propertyManage.expenseManage.overduePaymentInformation`、`propertyManage.reportManage.arrearsDetailsList`、`propertyManage.reportManage.outstandingFeesAnalysis` | 同源查询欠费数据，app 字段保留，admin 字段规范化                                        |
| `/app/fee.saveRoomCreateFee`                             | 房屋创建费用 | `propertyManage.expenseManage.houseCharge`、`propertyManage.expenseManage.contracteCharge`、`propertyManage.expenseManage.vehicleCharge`                          | 写接口必须走 schema 校验和事务边界，不能只复用 mock 返回                                |
| `/app/feeConfig.listFeeConfigs`                          | 费用配置列表 | `propertyManage.expenseManage.expenseItemSetting`                                                                                                                 | admin 作为费用项配置 CRUD，app 作为创建费用选择器                                       |
| `/app/payment.nativeQrcodePayment`                       | 二维码支付   | `propertyManage.expenseManage.paymentReview`、`propertyManage.reportManage.paymentDetailsForm`                                                                    | app 发起支付保持 legacy 契约；admin 管理支付审核和支付明细，不把支付动作伪装成后台 CRUD |
| `/app/oweFeeCallable.listOweFeeCallable`                 | 欠费催缴列表 | `propertyManage.expenseManage.reminderForOverduePayments`、`propertyManage.reportManage.feeReminder`                                                              | app 查询历史，admin 负责催缴记录管理和统计                                              |
| `/app/oweFeeCallable.writeOweFeeCallable`                | 写入欠费催缴 | `propertyManage.expenseManage.reminderForOverduePayments`、`propertyManage.reportManage.feeReminder`                                                              | 写接口必须可审计，后续需要落库催缴记录                                                  |
| `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | 费用月度汇总 | `propertyManage.reportManage.expenseSummaryTable`、`propertyManage.reportManage.dataStatistics`                                                                   | admin 报表为 canonical，app 保留 summary legacy DTO                                     |
| `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | 缴费明细     | `propertyManage.reportManage.paymentDetailsForm`、`propertyManage.reportManage.ownerPaymentDetails`                                                               | 同一支付明细服务输出两套 DTO                                                            |
| `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | 房间费用明细 | `propertyManage.reportManage.statementExpenses`、`propertyManage.reportManage.arrearsDetailsList`                                                                 | 按房间、费用项、周期聚合，admin 支持筛选导出                                            |
| `/app/dataReport.queryFeeDataReport`                     | 费用数据报表 | `propertyManage.reportManage.dataStatistics`                                                                                                                      | admin 作为数据统计看板，app 保留轻量指标                                                |

后续扩展或后台功能缺口候选如下，不进入 Phase2 首批纵切样板：

| app legacy endpoint                      | 业务含义   | admin canonical 业务坐标       | 后续处理                                                     |
| ---------------------------------------- | ---------- | ------------------------------ | ------------------------------------------------------------ |
| `/app/iot/listChargeMachineBmoImpl`      | 充电桩列表 | admin 当前缺少明确三级业务路径 | 后续波次保留 app legacy 能力；admin 页面和业务路径需另行补齐 |
| `/app/iot/listChargeMachineOrderBmoImpl` | 充电桩订单 | admin 当前缺少明确三级业务路径 | 后续波次作为 charge-machine 领域服务保留，并补后台订单管理   |
| `/app/iot/listChargeMachinePortBmoImpl`  | 充电桩端口 | admin 当前缺少明确三级业务路径 | 后续波次保留 app 兼容，并补设备/端口后台管理                 |
| `/app/machine/listMachineRecords`        | 开门记录   | admin 当前缺少明确三级业务路径 | 不硬塞到费用模块；记录为门禁/设备日志后台缺口                |

实现形态要求：

1. 在 `apps/api` 内建立 fee/payment/report 首批纵切样板，先迁移 app legacy registry 的路由注册和测试，再抽取领域服务。
2. 为每个 legacy endpoint 建立 `legacyPath -> canonicalService -> legacyDto` 的 adapter；admin endpoint 则使用 `canonicalPath -> canonicalService -> adminDto`。
3. app 侧兼容测试必须覆盖 Phase2 首批表内旧路径和方法；admin 侧测试必须覆盖对应 canonical 业务坐标的列表、详情、创建、统计或动作接口。
4. 不允许 admin 和 app 各自维护两套 fee mock 数据；同一业务必须共享 seed、repository 或数据库查询。
5. 当某个 app endpoint 找不到 admin 业务坐标时，不能阻断 app 迁入，但必须写入 admin 功能缺口清单，并在后续规格中补齐后台页面、菜单、权限和 CRUD；这类 endpoint 不纳入 Phase2 首批验收。

### `apps/api` 接口文件组织设计

`apps/api/server/modules/{domain}` 不是直接照搬 `apps/app/server/modules`，也不是直接照搬 `apps/admin/server`。它是唯一 Nitro API 服务中的领域模块，用一套领域服务同时支撑 app legacy 接口和 admin canonical 接口。

以 `apps/api/server/modules/fee` 为样板时，三类来源的职责如下：

| 来源                                               | 进入 `apps/api` 后的角色           | 说明                                                                                                                                                                                                                                                                          |
| -------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/app/server/modules/{domain}`                 | legacy endpoint 与旧 DTO 契约来源  | 提供 `/app/**`、`/callComponent/**` 旧路径、旧字段、GET/POST 兼容方式和旧响应形态。当前 `apps/api/nitro.config.ts` 只承接 `/app/**` handler；`/callComponent/**` 仍以 `apps/app` legacy runtime 为默认回退来源，只有补齐 `apps/api` compat handler 与测试后才能切入统一 API。 |
| `apps/admin/server/api/**` 与 `rank-route-keys.ts` | admin canonical 路由和返回结构参考 | 提供后台业务路径、文件路由风格、`JsonVO<PageDTO<T>>` 响应结构和三级业务坐标。迁入后由 `server/routes/api/**` 与 `admin-adapter.ts` 承接。                                                                                                                                     |
| `apps/api/server/modules/{domain}`                 | 新 API 的领域模块                  | 只保留一套 repository/service/runtime，再通过不同 adapter 输出 app legacy DTO 与 admin canonical DTO。                                                                                                                                                                        |

领域模块推荐文件结构如下：

```text
apps/api/server/modules/{domain}/
  types.ts             # 当前迁移波次需要的 DTO、query、result 类型
  repository.ts        # 数据访问层；可按阶段使用 fallback/in-memory 或 DB repository
  service.ts           # 领域业务能力层；app 和 admin 都只能通过它复用业务逻辑
  legacy-adapter.ts    # 把 service 结果转换为 app 旧字段和旧响应语义
  admin-adapter.ts     # 把 service 结果转换为 admin JsonVO/PageDTO 和 canonical DTO
  legacy-endpoints.ts  # 登记允许迁入 runtime 的 legacy 旧路径；当前 apps/api 只默认承接 /app/**，/callComponent/** 需要独立 compat handler gate
  runtime.ts           # 组装 repository、service、legacyAdapter、adminAdapter
  index.ts             # 统一导出当前 domain 模块
```

其中 `server/modules/**` 只是领域模块目录，不是 Nitro 文件路由目录。真正会被 Nitro 文件路由系统直接暴露的文件在 `server/routes/**`；app legacy 路径则通过 `nitro.config.ts` 的 `/app/**` handler 进入统一 dispatcher。

app legacy 请求链路：

```text
/app/fee.listFee
  -> nitro.config.ts handlers: /app/**
  -> server/handlers/legacy-dispatch.ts
  -> server/shared/runtime/runtime-endpoints.ts
  -> server/modules/fee/legacy-endpoints.ts
  -> server/modules/fee/legacy-adapter.ts
  -> server/modules/fee/service.ts
  -> server/modules/fee/repository.ts
```

admin canonical 请求链路：

```text
/api/property-manage/expense-manage/house-charge/list
  -> server/routes/api/property-manage/expense-manage/house-charge/list.post.ts
  -> server/modules/fee/runtime.ts
  -> server/modules/fee/admin-adapter.ts
  -> server/modules/fee/service.ts
  -> server/modules/fee/repository.ts
```

`runtime.ts` 是每个领域模块的装配入口。它决定当前请求使用 fallback repository 还是 DB repository，并把同一个 service 注入到 legacy/admin 两套 adapter 中。fee 样板已经允许在存在数据库配置时使用 DB repository；repair Wave 4A 则刻意保持 fallback-only，DB adapter 和 `useDb(event)` 分支必须另开任务评审后再加入。

这个组织方式的关键约束是：

1. app 旧路径只在 `legacy-endpoints.ts` 白名单登记，禁止把所有 legacy endpoint 一次性暴露出去。
2. app 旧字段只允许停留在 `legacy-adapter.ts`，不能反向污染 admin canonical DTO 或 `apps/type` schema。
3. admin 路由只放在 `server/routes/api/**`，并按 `rank-route-keys.ts` 的业务路径组织。
4. 业务逻辑只能沉到 `service.ts` 和 `repository.ts`，避免 legacy adapter 与 admin adapter 各写一套查询或 mock 数据。
5. 每个迁移波次必须同时有 legacy tests、admin tests、service/repository tests 和 runtime manifest tests，不能只验证其中一端。

#### 第一阶段自测与 Vitest 验收设计

第一阶段的目标不是“已经完成统一后端”，而是证明 `01s-11comm-app` 被安全迁入、可被 workspace 识别、app 原有契约没有被破坏，并且后续 `apps/api` 抽取有稳定测试输入。第一阶段不能只靠人工打开页面确认，必须建立可重复执行的测试和清单门禁。

测试策略遵循两个来源，并明确区分 Phase1 快照验收和后续统一 Nitro 服务改造：

- 主项目规范：Vitest 用 `import { test, describe } from "vitest";`，测试文件使用 `*.test.ts`，Nitro/API 测试运行在 Node 环境；数据库 schema 以 `apps/type/src/business/**/schema.ts` 为唯一事实来源；新增或目标态 Nitro 代码，尤其未来 `apps/api`，H3 API 只能从 `"nitro/h3"` 导入，不新增任何鉴权，并统一使用 `@01s-11comm/type` 与 `apps/type` schema。
- app 项目沉淀：保留现有 `src/tests/nitro-runtime/**` 契约测试模式，继续以 shared endpoint registry、repository、dispatcher 验证 `/app/**` legacy 路径；API 迁移保持旧业务路径，不把前端接口批量改为 `/api/**`；列表、表单、错误提示等页面接入继续遵守 app skills 的 `api-migration`、`api-error-handling`、`z-paging-integration`、`use-wd-form` 等约束。

Phase1 不以统一 `apps/app/server` 的历史 H3 import、handler 风格或 mock dispatcher 写法作为验收 blocker；已经完成的小范围 `nitro/h3` 改写可以保留，后续发现或尚未处理的 H3 写法统一作为下一阶段历史债务任务，只在 `apps/api` 抽取和最终独立单一 Nitro 接口服务整合时集中清理。Phase1 可以记录债务清单和测试输入，但不应把“legacy 写法未统一”解释为快照迁入失败。

第一阶段需要设计以下测试层；其中涉及 `apps/api` 的内容在 Phase1 只要求形成后续验收输入、测试设计或清单，不要求在 Memorix gate 释放前创建正式 `apps/api` 实现：

| 层级                                 | 建议测试位置或工件                                                                                                                            | 验证内容                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 快照完整性测试                       | `apps/app/src/tests/migration/app-snapshot.test.ts` 或根级等价迁移测试                                                                        | 源目标文件大小、SHA256、排除目录、嵌套 `.git`、UTF-8 严格解码、`U+FFFD` 和真实 `锟` 乱码检查                       |
| workspace 识别测试                   | 根级脚本和迁移报告记录                                                                                                                        | `pnpm` workspace 能识别 `apps/app`，且不会破坏 `apps/admin`、`apps/type` 的既有过滤器和构建入口                    |
| app legacy endpoint 契约测试         | 迁入后的 `apps/app/src/tests/nitro-runtime/*.test.ts`                                                                                         | app 当前的 endpoint registry、runtime dispatcher、mock adapter 仍能通过，尤其是 fee/payment/report 这批路径        |
| `apps/api` 双端 adapter 后续验收设计 | `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`、后续 `apps/api/tests/legacy/*.test.ts`、`apps/api/tests/admin/*.test.ts` | 先记录 app legacy adapter 与 admin canonical adapter 应调用同一 service/repository；gate 释放后再在 DTO 层分流测试 |
| schema 与类型导出测试                | `apps/type/src/tests/*.test.ts` 或等价类型检查                                                                                                | 共享 schema 按 Trinity Pattern 暴露 Drizzle table、Zod schema、TS type；导出链使用 `export *`                      |
| AI 记忆与 spec 合规清单              | `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价清单                                                                | 两个项目的 AI 记忆、skills、OpenSpec/spec 规则逐条记录来源、适用范围、冲突状态、canonical 决策和验证方式           |
| 文档与 mock 同步测试                 | `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`、mock 迁移清单和 endpoint coverage                                        | mock endpoint 变更必须同步文档状态，标记 legacy 路径、规范路径、数据源状态和 admin 功能缺口                        |

Vitest 设计要求：

1. 先写会失败的迁移保护测试，再迁入或适配代码，最后让测试转绿；不能先复制完再补“看起来会过”的测试。
2. Nitro、endpoint registry、repository、adapter 测试必须使用 Node 环境，不使用 jsdom 执行服务端代码。
3. 页面组件或 uni-app DOM 行为才允许进入 jsdom 或组件测试；不要把 Nitro 运行时测试和页面渲染测试混在一个环境里。
4. 测试必须围绕真实 registry、dispatcher、service/repository 组织，只在明确的 adapter 边界使用 fake repository，避免把 mock 断言成 mock。
5. app legacy 响应结构按 app 当前测试保留；admin canonical 响应结构按主项目 `JsonVO`、`PageDTO` 和业务 schema 重新断言。
6. 每个新增测试文件必须使用 `describe` 和 `test`，文件名以 `*.test.ts` 结尾，目录优先放在对应子包 `src/tests/`、`tests/` 下。

fee/payment/report 第一批 endpoint 的最小 Vitest 覆盖：

- app legacy：迁入并保留 `src/tests/nitro-runtime/fee-endpoints.test.ts` 的覆盖，Phase2 首批至少验证 `/app/fee.listFee`、`/app/feeApi/listOweFees`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.listOweFeeCallable`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/feeConfig.listFeeConfigs`、三条 `/app/reportFeeMonthStatistics*`、`/app/dataReport.queryFeeDataReport`；`/app/iot/**` 和 `/app/machine/listMachineRecords` 只作为后续缺口或扩展波次输入，不阻断 Phase2。
- API legacy adapter：在 `apps/api` 中重复验证旧路径、HTTP method、分页字段、写接口成功/失败结构，确保 app 不需要同步大改。
- admin canonical adapter：围绕费用、欠费、支付、报表等 admin 业务坐标验证列表、详情、创建、统计或动作接口；充电桩和开门记录先进入后台功能缺口测试清单，不伪装为已完成 admin 支撑。
- 数据源一致性：同一业务测试应能证明 app legacy 和 admin canonical 来自同一 seed、repository、service 或数据库查询，禁止各自维护两套 mock。

第一阶段严重问题阻断条件：

- 源目标 SHA256 对账失败，且不是事先记录的有意改写。
- `apps/app` 中出现 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`、嵌套 `.git` 或其他明确排除目录。
- UTF-8 严格解码失败，或出现新增 `U+FFFD`、真实 `锟` 乱码、未经确认的异常 `\uXXXX` 转义。
- 根 workspace 无法识别 `apps/app`，或迁入导致 `apps/admin`、`apps/type` 的既有检查出现非预期失败。
- app 现有 `src/tests/nitro-runtime/**` 中与迁入范围相关的 endpoint registry、dispatcher、mock adapter 测试失败。
- 如 Phase1 仅形成设计和清单，该项不适用；一旦新增 `apps/api` 代码，若存在直接从 `"h3"` 导入、鉴权中间件/插件、私有 schema 事实来源或 app/admin 双数据源分叉，则阻断对应目标态代码验收。
- 把 legacy `apps/app/server` 既有直接 `"h3"` 导入或 handler 风格当作 Phase1 完成 blocker，或在 Phase1 里强行改写它们而破坏 app 侧快照契约。
- 未生成 Markdown 清单、AI 记忆合并清单、双项目 spec 合规矩阵和 mock endpoint 迁移清单，却声称第一阶段完成。

双项目 AI 技术沉淀的执行方式：

1. 根级 `01s-11comm` 的 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 是 monorepo canonical 入口；app 项目的同名文件迁入后只作为 `apps/app` 作用域历史上下文。
2. app skills 不直接覆盖根级 skills；同名或同职责 skill 先进入冲突矩阵，逐条决定 `keep-app-scope`、`promote-root-skill`、`extract-reference`、`reject-obsolete` 或 `archive-duplicate`。
3. 每次实施 app 页面、组件、接口迁移时，必须先按 app 的 `check-trigger.md` 识别相关技能，再叠加主项目的 Nitro、schema、测试、行尾、报告规范。
4. 每次实施 `apps/api`、`apps/type`、admin CRUD 时，以主项目 schema/Nitro/admin 规范为准；app legacy 规则只约束旧路径兼容和 DTO 适配，不反向污染 admin 长期 API。
5. 冲突不能默默合并：必须记录来源文件、冲突描述、采用决策、验证方式和复核人/复核时间。

### 阶段 2：`apps/api` 影子服务与 fee/payment/report 首批纵切样板

Memorix canonical history retention gate 已按用途拆分：主线程已从旧源目录 `D:\code\ruan-cat\01s-11comm-app` 启动 Memorix MCP session，返回 `Project: 11comm-app (nwt-q/001-Smart-Community)`，并能读取旧源 key memories；project-scoped search 命中 `obs:48`、`obs:53`、`obs:1839`，timeline 可展开。root / `apps/app` 视角也能检索迁移保全链 `obs:2676`、`obs:2677`、`obs:2681`、`obs:2744`。因此该 gate 对 Phase2 继续推进、准备和后续 `apps/api` 迁移不再阻断，标记为 `released-for-phase2-progress` / `pass-with-permanent-source-retention`。但 gate 释放、alias/export/import 完成、retirement review 通过或后续验收完成，都不赋予任何流程处置旧源目录的权限：`D:\code\ruan-cat\01s-11comm-app` 是完整独立 git 项目，必须永久保留，禁止删除、移动、归档、重命名或清空；CLI `status` 在旧源 alias 下显示何种 observations 数量也不得改变该红线。后续新增或迁入 `apps/api` 的 Nitro 代码必须遵守根目录 Nitro 代码规范：H3 API 从 `"nitro/h3"` 导入，不新增鉴权，不引入 JWT、Token 校验或 Neon Auth，统一使用 `@01s-11comm/type` 与 `apps/type/src/business/**/schema.ts` 单一事实来源，并最终整合为独立单一 Nitro 接口服务。

第二阶段不是“先搭一个没有业务行为的 `apps/api` 空壳”，而是用最小可运行的影子服务承载 fee/payment/report 首批纵切样板，证明 app legacy endpoint、admin canonical adapter、共享 service/repository 和测试门禁可以在同一个 `apps/api` 内闭环。

第二阶段只做最小必要能力：

- 建立 `apps/api` 的最小 Nitro 入口、健康检查、基础错误响应和本批样板所需的测试入口。
- 迁入 fee/payment/report 首批 app legacy 路径，并保留旧路径、HTTP method、旧字段名和旧响应结构。
- 为 fee/payment/report 建立 admin canonical adapter，按 `rank-route-keys.ts` 对应业务坐标输出规范 DTO。
- 抽取首批共享 service/repository 或等价领域层，避免 app 和 admin 各自维护两套费用、支付、欠费、报表数据源。
- 所有新增或目标态 H3 API 必须从 `nitro/h3` 导入；从 `apps/app/server` 迁出的 legacy endpoint 在落入 `apps/api` 时同步完成 import 和 handler 风格统一。
- 继续禁止鉴权中间件、鉴权插件、JWT、Token 校验和 Neon Auth。

#### 阶段 2 非目标/禁做

- 不迁移 repair/resource/parking，也不把这些模块纳入 Phase2 并行规划。
- 不做多模块并行迁移矩阵，不把充电桩、开门记录或其他后台功能缺口硬塞进 fee/payment/report 样板。
- 不删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或旧源目录 `D:\code\ruan-cat\01s-11comm-app`。
- 不做 app/admin 全量切流；两端可以通过测试或局部配置验证样板，但生产接入和批量切换留到后续阶段。
- 不把 CI、部署、完整 runtimeConfig、环境变量治理、CORS 策略、日志监控和接入策略加固作为 Phase2 完成条件。
- 不新增任何接口鉴权。

### 阶段 3：`apps/api` 基础设施加固与接入准备

阶段 3 承接 Phase2 刻意不做的纯基础设施壳层和加固工作，为后续迁移波次和双端接入做准备：

- 补齐 `apps/api` 独立启动、构建、测试、CI 和部署流程。
- 补齐 `apps/api` 统一请求校验层；如需要直接使用 `zod`，从本阶段随 validation runtime 一起引入，Phase2 不保留未使用的直接 `zod` 依赖。
- GitHub Actions CI 必须先 checkout，再 setup pnpm，再使用 `actions/setup-node@v6` 配置 Node 22.14.0 和 pnpm cache，随后运行 `pnpm install --frozen-lockfile`；依赖安装不得发生在 Node 22.14.0 配置之前。
- CI 必须使用 workspace-local `pnpm exec turbo` 和根脚本 `pnpm run ci` 做全量 Turbo build；禁止全局安装或调用全局 `turbo`/`tsx`。
- workflow、job、step 名称必须使用语义化中文；`actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6` 等必要 action major versions 不得为绕过问题而降级。
- 加固 runtimeConfig、环境变量读取、CORS、日志、错误响应、健康检查和数据库连接方式。
- 固化 API base URL、代理配置、回退策略和 app/admin 接入策略。
- 建立 endpoint registry、统一响应基础类型、测试分层和部署验收清单。
- 保持旧服务并行存在，不在本阶段执行 app/admin 全量切流。

### 阶段 4：扩展 app legacy API 迁移波次

在 Phase2 样板和 Phase3 基础设施准备完成后，再把 `apps/app/server/**` 中的 legacy dispatcher、runtime endpoints、memory repository 和模块接口按波次迁入 `apps/api`。

扩展顺序：

1. 以 Phase2 的 fee/payment/report 样板为模板，保持旧路径行为一致。
2. 每个波次先固定兼容测试，再迁移 endpoint、adapter、service/repository 和数据源。
3. repair/resource/parking 等多模块扩张在本阶段规划和实施，按业务路径拆分，不在 Phase2 并行推进。
4. 增加 adapter，把 app legacy 字段映射到统一 schema/DTO。
5. 再替换 mock/memory 数据源为真实数据库。

### 阶段 5：迁移 admin API 并补齐 CRUD

阶段 5 的目标不是一次性把后台全部接口重写完成，而是把 `apps/admin/server/api/**`
中已经具备后台菜单坐标、类型定义和数据表事实来源的接口，按可验证波次迁移到 `apps/api`，
并在每个波次内把该业务路径应该具备的后台 CRUD 或业务 action 补齐。

#### 5.1 当前基线

进入阶段 5 时，迁移基线为：

- `apps/api` 已具备独立 Nitro 服务、运行时环境解析、CORS、health/ready、endpoint manifest、
  app legacy dispatcher、Vitest 覆盖和 `verify:phase3` / `verify:phase4` 验证脚本。
- `apps/api/server/modules` 当前只有 `fee` 与 `repair` 两个业务模块。
- `apps/api/server/routes/api` 当前只有 5 条后台 canonical route：
  - `property-manage/expense-manage/house-charge/list`
  - `property-manage/report-manage/payment-details-form/list`
  - `property-manage/repairs-manage/issues/list`
  - `property-manage/repairs-manage/repairs-setting/list`
  - `property-manage/repairs-manage/repairs-todo/list`
- `fee` 模块已经具备 DB adapter + fallback runtime；`repair` 模块在 Phase4A 仍是 fallback-only runtime，
  不能直接当成 DB-backed CRUD 样板。
- `apps/admin/server/api/**` 中优先业务域多为 `list.post.ts` 形式的历史后台接口，只有少量模块已经具备
  `detail/create/update/delete`。因此阶段 5 必须先做接口盘点和 CRUD 等级判定，不能机械地把所有目录都补成五个文件。

#### 5.2 阶段边界

阶段 5 允许做：

- 以 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径为唯一后台业务坐标，迁移对应的 admin canonical API。
- 以 `apps/type/src/business/**/schema.ts` 中已经存在的 Drizzle Table、Zod Schema 和 TypeScript Type
  作为数据库事实来源，编写 `apps/api` 的 repository、service、admin adapter 和 route handler。
- 对单个业务路径补齐 `list/detail/create/update/delete`，以及该路径在后台页面中真实需要的业务 action。
- 保留 `apps/admin/server/api/**` 作为旧实现参考和回滚证据，不在阶段 5 删除旧实现。
- 在 `apps/api` 中继续保留 app legacy adapter 与 admin adapter 的响应格式边界：app legacy 仍输出
  `{ code: 0, msg, data }`，admin canonical 仍输出 `JsonVO<PageDTO<T>>` 或 `JsonVO<T>`。

阶段 5 禁止做：

- 不做 Phase6 的 app/admin 全量切流，不批量改 `apps/admin/src` 页面请求 base URL。
- 不做 Phase7 的旧服务退役；不得删除、移动、归档、重命名、清空 `apps/admin/server`、`apps/app/server`
  或 `D:\code\ruan-cat\01s-11comm-app`。
- 不把 app legacy `/app/**`、`/callComponent/**` 响应格式原地改成 admin `JsonVO`。
- 不新增 JWT、Token 校验、Neon Auth、Bearer/Authorization 校验或任何 Nitro 鉴权逻辑。
- 不从 `"h3"` 直接导入 H3 helper；所有新增或目标态 Nitro 代码必须从 `"nitro/h3"` 导入。
- 不在 `apps/api` 内定义 `pgTable`、`createInsertSchema`、`createSelectSchema`；schema 事实来源只在
  `apps/type/src/business/**/schema.ts`。
- 不用脚本批量生成或批量改写接口文件；每个波次必须人工核对 legacy 行为、schema、DTO 和测试。

#### 5.3 业务坐标与优先级

阶段 5 只处理 `rank-route-keys.ts` 中已经存在的三级业务路径。发现后台旧接口没有对应三级业务路径时，
不得直接迁入运行时，应记录为 `route-review-required`。

优先业务域仍为：

| 优先级 | 业务域                               | 原因                                                                      | 阶段 5 处理方式                                                                                                 |
| ------ | ------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| P0     | `propertyManage.expenseManage`       | 已有 `fee` 模块、`houseCharge` list route、费用 schema 和 DB adapter 样板 | 首批从 `houseCharge` 字段矩阵和读接口开始；若写入语义属于费用配置，则由 `expenseItemSetting` 承担首个 CRUD 样板 |
| P0     | `propertyManage.reportManage`        | Phase2/Phase4 已触达支付明细和费用报表                                    | 先补 admin read-only 报表，不强行补写操作                                                                       |
| P1     | `propertyManage.repairsManage`       | Phase4A 已有 repair 最小兼容迁移                                          | 先保持 fallback-only 边界；DB-backed CRUD 需单独评审 schema 与工单状态流                                        |
| P1     | `propertyManage.housePropertyManage` | 费用、停车、报修等模块依赖房屋/业主数据                                   | 按 house/owner 信息先补 read/detail，再补写操作                                                                 |
| P1     | `propertyManage.parkingManage`       | 有明确三级业务路径和 schema，但涉及车辆/车位联动                          | 按 ownerVehicle/carportInfo/parkingLot 分波次迁移                                                               |
| P2     | `propertyManage.patrolManage`        | 路径清晰，但涉及计划、任务、点位和状态流                                  | 先补基础资料 CRUD，再处理任务 action                                                                            |
| P2     | `operationTeam.*`                    | 多为运营基础配置和报表配置                                                | 按 system/data/merchant/reportConfiguration 分组迁移                                                            |
| P3     | `devTeam.menuManage`                 | 有后台菜单坐标，但未必都对应 DB-backed schema                             | 先确认数据来源；只迁移有明确事实来源的 list/detail/write                                                        |

每个实施波次最多覆盖 2-3 个三级业务路径。优先顺序不是永久排序，若某个路径缺少 schema、缺少旧接口证据、
或字段映射不清晰，应立即降级到评审队列，转向同一业务域内证据更完整的路径。

#### 5.4 CRUD 完整度等级

阶段 5 不能只用“补齐 CRUD”描述工作量。每个三级业务路径必须先判定完整度等级：

| 等级 | 名称             | 必需能力                                                                 | 适用场景                           |
| ---- | ---------------- | ------------------------------------------------------------------------ | ---------------------------------- |
| L0   | Inventory only   | 只完成旧接口、页面调用、schema、DTO、数据源盘点                          | 路径证据不足或 schema 缺失         |
| L1   | List parity      | `list` 与旧后台列表行为一致，返回 `JsonVO<PageDTO<T>>`                   | 大多数历史 list-only mock 的第一步 |
| L2   | Read parity      | `list` + `detail`，详情字段来自同一 repository/service                   | 页面已有详情、编辑回显或详情弹窗   |
| L3   | CRUD parity      | `list/detail/create/update/delete`，写入使用 `apps/type` Zod schema 校验 | 表结构、字段映射、删除策略都明确   |
| L4   | Business actions | 在 CRUD 外补齐审核、启用/停用、派单、核销、导出等 action                 | 页面确实有业务按钮或状态流         |

删除能力必须单独判定：

- 表含 `deletedAt` 或等价软删除字段时，优先实现软删除。
- 表不含软删除字段时，只有在业务确认允许物理删除并有测试覆盖时，才实现 hard delete。
- 若删除语义不清晰，不得假删除或只返回成功；应把 `delete` 标为 blocked，并拆出 schema/业务规则评审任务。

#### 5.5 目标代码形态

每个迁移波次在 `apps/api` 内使用同一套分层形态：

```text
apps/api/server/modules/{module}/
  types.ts
  repository.ts
  service.ts
  admin-adapter.ts
  legacy-adapter.ts        # 只有同时服务 app legacy 时才新增或修改
  runtime.ts
  index.ts

apps/api/server/routes/api/{business-path}/{tertiary-route}/
  list.post.ts
  detail.post.ts
  create.post.ts
  update.post.ts
  delete.post.ts
  {action}.post.ts
```

实现规则：

- `route handler` 只负责读取请求、规范化入参、调用 adapter、捕获异常并返回 `adminFailure`。
- `admin-adapter.ts` 只负责后台 DTO 与响应包装，返回 `JsonVO<T>` 或 `JsonVO<PageDTO<T>>`。
- `service.ts` 放业务流程和状态规则，不直接处理 H3 event。
- `repository.ts` 放 DB 查询与 fallback 实现；DB 表和 Zod schema 必须从 `@01s-11comm/type` 导入。
- `runtime.ts` 负责根据 `hasDatabaseUrl(event)` / `useDb(event)` 选择 DB runtime 或 fallback runtime。若该模块仍处于
  fallback-only 状态，必须在计划和测试中明确标注，不能伪装成生产 DB-backed CRUD。
- `apps/type` 的导出必须继续使用 `export * from "./xxx"`，不得使用 `export type *` 或逐项导出。

#### 5.6 单路径实施清单

迁移任意一个三级业务路径前，必须完成以下清单：

1. 坐标确认：在 `rank-route-keys.ts` 中确认三级业务路径存在，并记录 camelCase 坐标与 kebab-case API 路径。
2. 旧实现证据：读取 `apps/admin/server/api/{business-path}/{route}/**`，确认旧 endpoint、入参、出参、错误格式和是否只有 mock。
3. 前端调用证据：读取 `apps/admin/src` 中对应 API hooks、页面、表格列、表单弹窗和按钮，确认真实使用的字段与 action。
4. 类型事实来源：读取 `apps/type/src/business/{domain}/{module}/schema.ts` 和同目录 DTO 文件，确认 Trinity schema、业务类型和导出链。
5. 数据源判定：确认该路径能否 DB-backed；若只能 fallback，必须写入计划并限制为兼容切片。
6. 红灯测试：先写或调整 Vitest，覆盖 adapter、service/repository、route handler 和失败分支。
7. 分层实现：按 repository -> service -> admin adapter -> route handler 顺序落地。
8. 兼容验证：旧 list 行为、分页字段、筛选字段、排序字段和错误结构不得被无意改变。
9. 门禁扫描：运行类型检查、测试、构建、禁用模式扫描和受保护目录存在性检查。
10. 进度记录：更新对应阶段计划或汇总报告，记录已迁移等级、未迁移 action、阻塞原因和验证命令。

#### 5.7 阶段 5 推荐首波

阶段 5 的首个可执行波次建议选择：

```text
propertyManage.expenseManage.houseCharge
```

理由：

- `rank-route-keys.ts` 已存在 `propertyManage.expenseManage.houseCharge`。
- `apps/api` 已有 `property-manage/expense-manage/house-charge/list.post.ts`。
- `apps/api/server/modules/fee` 已具备 DB-backed runtime 样板。
- `apps/type/src/business/property-manage/expense-manage/schema.ts` 已存在 `exHouseCharges`、
  `insertExHouseChargeSchema`、`selectExHouseChargeSchema`、`updateExHouseChargeSchema`。
- 该路径适合作为阶段 5 的 CRUD 标准样板，用来沉淀 `list/detail/create/update/delete` 的测试和路由格式。

首波不要同时扩展整个 `expenseManage`。完成 `houseCharge` 后，再根据同样门禁扩展到：

1. `expenseItemSetting`、`meterReadingType` 等配置型路径。
2. `discountType`、`discountSetting`、`discountApply` 等折扣路径。
3. `vehicleCharge`、`contracteCharge` 等收费实体路径。
4. `paymentReview`、`refundReview`、`cancelFee`、`reminderForOverduePayments` 等状态流路径。

首波实施前必须额外完成 `houseCharge` 与 `expenseItemSetting` 的字段归属矩阵。当前前端表单与
`HouseChargeFormVO` 中存在收费项目配置字段，不能简单假设这些字段全部写入 `exHouseCharges`。若字段矩阵证明
新增/编辑语义实际属于 `exExpenseItems`，则 `houseCharge` 本波只补 `list/detail`，由
`expenseItemSetting` 承担首个 L3 CRUD 样板；不得把配置字段错误写入房屋收费账单表。

#### 5.8 admin 前端 hook 与独立 Nitro 联调边界

阶段 5 的接口迁移分成两个可验收子阶段，避免把“后端接口已迁入 `apps/api`”误读为“admin 页面已经切到
独立 Nitro 服务”：

- **Phase5A：后端 API 迁移与实库验证**。本阶段只要求 `apps/api` 中对应 admin canonical route
  已实现、单元测试通过、能够在本地 Nitro 服务中连接真实 Neon，并完成 create/update/detail/list 等接口级验证。
  Phase5A 不要求立刻修改 `apps/admin/src` 页面 hook，也不允许批量改 admin 全局请求 base URL。
- **Phase5B：admin hook 补齐与页面级影子联调**。当某个三级业务路径达到 L2/L3/L4 后，必须在进入 Phase6
  全量接入前，为该路径补齐 `apps/admin/src` 中真实页面需要的 API hook、表单 mutation、详情回显和按钮 action。
  Phase5B 是该业务路径进入“可交付候选”的前置门禁，不得推迟到 Phase7 旧服务退役时才补。

Phase5B 的实施要求如下：

1. 先读取 `apps/admin/src` 中对应页面、现有 hook、表格列、表单弹窗和按钮，不凭空新增未被页面消费的接口包装。
2. 在 admin hook 中补齐必要方法：`list`、`detail`、`create`、`update`、`delete` 或实际业务 action。
   例如 `expenseItemSetting` 已在 `apps/api` 具备 `detail/create/update/delete` 后，admin 侧必须补齐同名 hook
   和表单 mutation；`houseCharge` 若本波只达到 `list/detail`，admin 侧只接入只读 hook。页面可以保留新增、编辑、
   删除入口作为 `pending/blocked` 开发坐标，但当前不得接入 `create/update/delete` hook，不得发送写请求，
   不得伪造成功；点击这些入口只能提示待实现或策略未确认。
3. hook 的 DTO 以 `@01s-11comm/type` 已有类型和 `apps/api` admin adapter 返回结构为准；若页面字段超出当前 schema，
   必须回到字段归属矩阵判定，不得在 hook 中用临时字段吞掉问题。
4. 本地联调必须同时启动两个服务：`apps/api` 独立 Nitro 服务连接真实 Neon，`apps/admin` 通过影子 API base URL
   或 Vite proxy 指向该 Nitro 服务。不得把页面仍然命中 `apps/admin/server/api/**` 的结果当作新接口联调通过。
5. 浏览器验收必须使用 Chrome MCP 或等价浏览器自动化打开 admin 页面，执行列表查询、详情回显、创建、更新、
   删除策略或业务 action，并检查 Network 请求确实命中 `apps/api` 的 canonical 路径。对于 `houseCharge`
   这类本波只读路径，验收只覆盖列表、详情和 pending/blocked 入口提示，并确认新增、编辑、删除点击不会产生写请求。
6. 写入类页面验收必须追加 Neon 校验：通过 Neon MCP 查询或同等直连查询确认写入落库；如使用临时测试数据，
   必须用唯一业务标识清理该测试数据，并记录清理结果。
7. Phase5B 不做 admin 全局切流。每次只对 2-3 个三级业务路径启用影子联调，待路径级门禁通过后，才允许进入
   Phase6 的 app/admin 渐进式接入计划。

当前 `expenseManage` 首波的前端接入判定为：

| 路径                                              | Phase5A 后端目标                                                   | Phase5B admin hook 目标                                                                                                                                              | 可交付判定                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `propertyManage.expenseManage.houseCharge`        | `list/detail`，不实现不明确的账单写入                              | 补齐列表与详情 hook；新增、编辑、删除入口可保留为 `pending/blocked` 坐标，但不接 `create/update/delete` hook、不发送写请求、不伪造成功；点击只提示待实现或策略未确认 | 已通过浏览器列表/详情、pending/blocked 入口无写请求和 Neon 只读查询记录；写操作另拆后续任务 |
| `propertyManage.expenseManage.expenseItemSetting` | `list/detail/create/update`；`delete` 明确返回 blocked/unsupported | 补齐 list/detail/create/update/delete hook 与表单 mutation；delete 按策略展示失败原因                                                                                | 浏览器完成创建、编辑、详情回显；Neon 查到更新值并清理测试数据                               |

只有当 Phase5A 后端验证、Phase5B admin hook 联调、Neon 写入校验、禁用模式扫描和受保护目录检查全部通过后，
该三级业务路径才可以标记为“可交付候选”。若当前字段集不能覆盖页面表单，例如需要持久化 `unit`、
`prepaymentPeriod`、`prepaidPeriodDays`，或业务要求真正删除 `expenseItemSetting`，则必须先触发独立的
schema-change-sync 任务：更新 `apps/type` schema、数据库迁移、seed、后端 DTO、前端 hook 和技能文档清单。
在 schema 变更完成前，Phase5A/Phase5B 只能保持输入兼容或策略性 blocked，不能把未落库字段伪装为已支持。

#### 5.9 验证门禁

每个阶段 5 波次至少运行以下验证：

```powershell
pnpm -F @01s-11comm/api test
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build:node
pnpm -F @01s-11comm/type typecheck
git diff --check
```

涉及完整阶段收口时，追加：

```powershell
pnpm run ci
```

每个波次还必须运行禁用模式扫描：

```powershell
rg -n 'from [''"]h3[''"]' apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
git status --short -- apps/admin/server apps/app/server
```

预期结果：

- 三个 `rg` 禁用扫描无匹配。
- 三个受保护目录 `Test-Path` 均为 `True`。
- `apps/admin/server` 与 `apps/app/server` 没有删除、移动、重命名或清理状态。

#### 5.10 Plan 编写要求

执行阶段 5 代码迁移前，必须为具体波次编写计划文件：

```text
docs/superpowers/plans/YYYY-MM-DD-11comm-app-monorepo-api-migration-phase5.md
```

计划必须包含：

- 本波次只覆盖哪些三级业务路径，且每个路径都能在 `rank-route-keys.ts` 中找到。
- File Responsibility Map，明确哪些文件只读、哪些文件允许修改、哪些文件禁止修改。
- CRUD 完整度目标，例如 `houseCharge = L3 CRUD parity`。
- 红灯测试列表与期望失败原因。
- repository/service/admin adapter/route handler 的实现顺序。
- schema 变更触发条件；若触发 schema 变更，必须拆成独立 schema 同步任务，不能混在普通接口迁移中偷改。
- 验证命令、禁用模式扫描、受保护目录检查和 pass/fail gate。
- 未完成 action、blocked delete、route-review-required 的记录方式。

### 阶段 6：接入 app/admin 到统一 API

阶段 6 的目标不是继续扩大 `apps/api` 的业务实现面，而是把已经通过 Phase2 至 Phase5 验收的能力，以可配置、可观测、可回退的方式接入 `apps/admin` 和 `apps/app`。本阶段继续遵循影子迁移原则：先新增统一 endpoint、代理和兼容层，再通过测试与联调验证，随后按批切换消费端，保留回退开关，最后只记录清理候选，不删除旧服务。

#### 6.1 目标边界

阶段 6 只处理消费端接入策略和首批切流，不处理旧服务退役：

- 允许新增或收敛 admin/app 指向 `apps/api` 的 base URL、dev proxy、生产环境变量和运行时选择逻辑。
- 允许为 app legacy `/app/**` 增加 proxy、adapter、compat allowlist 或 endpoint manifest，使旧页面无需一次性改写即可消费 `apps/api`；`/callComponent/**` 短期保留旧契约，但当前不能默认视为已由 `apps/api` 承接。
- 允许把 Phase2 至 Phase5 已验收的 fee/payment/report、repair 只读切片、expenseManage 首波接口纳入首批切流候选。
- 不删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`、旧源目录 `D:\code\ruan-cat\01s-11comm-app`。
- 不把 `houseCharge create/update/delete` 写成已完成能力；Phase5 已完成的是 `houseCharge list/detail` 只读联调和 `expenseItemSetting` 相关能力。
- 不新增 Nitro 鉴权，不引入 `@neondatabase/auth`，不增加 JWT、Token、Bearer、Authorization 校验中间件或插件。

#### 6.2 入口与配置策略

统一 API 入口必须成为显式配置，而不是隐含在生产同源 `/api` 假设中：

- admin 侧以 `VITE_11COMM_API_BASE_URL` 表示独立 `apps/api` 地址，以 `VITE_11COMM_API_USE_PROXY=true` 和 `VITE_11COMM_API_PROXY_PREFIX` 表示本地或灰度代理入口；关闭统一 API 时回退到既有 `VITE_BASE_URL`、`VITE_PROXY_PREFIX` 和旧同源路径。
- admin 侧保留 `VITE_11COMM_API_SHADOW_ENABLE` 作为模块级影子开关；Phase6 可把该开关从 Phase5 单模块联调用途提升为首批切流 gate，但不能让全站默认无条件走 `apps/api`。
- app 侧继续使用 `VITE_API_RUNTIME`、`VITE_SERVER_BASEURL`、`VITE_APP_PROXY_ENABLE`、`VITE_APP_PROXY_PREFIX`，并以 `VITE_11COMM_API_BASE_URL` 和兼容 endpoint allowlist 控制哪些 legacy path 命中 `apps/api`。
- 生产部署必须明确记录 admin H5、app H5、`apps/api` 三者域名关系；跨域访问需要走部署平台允许的 CORS 或同平台 rewrite，但不能通过新增鉴权逻辑掩盖跨域问题。
- 每个切流批次必须声明“目标 base URL、代理前缀、开启变量、关闭变量、预期命中的服务、回退后命中的服务”六项信息。

#### 6.3 admin 接入策略

admin 接入以 HTTP client 和 API hook 层为边界，不做页面级大规模改写：

- 优先在 `apps/admin/src/utils/http/api-base-url.ts`、`apps/admin/vite.config.ts` 和已迁移业务 hook 内收敛 `apps/api` base URL 解析，不在每个页面组件里拼接环境变量。
- 已经完成影子联调的 hook 可以从“模块私有 `resolvePhase5ApiUrl`”逐步收敛为统一 helper；收敛前必须保留原行为，收敛后必须有单元测试覆盖 proxy、direct base URL、legacy fallback 三种路径。
- 首批 admin 切流只覆盖已经在 `apps/api/tests/admin/**` 和页面联调中通过的接口；未通过 L2/L3/L4 验收的三级业务路径仍走旧路径。
- admin 请求可以继续携带现有客户端 header，但 `apps/api` 不得新增服务端鉴权校验；本阶段验收关注路由命中、响应格式、数据一致性和回退能力。

#### 6.4 app 旧路径兼容策略

app 接入的核心是保留旧契约，而不是让页面一次性改成 canonical API：

- `/app/**` 与 `/callComponent/**` 在 Phase6 内继续作为 app 对外契约存在；页面、组合式函数和现有 `src/api/**` 不需要批量改路径。
- `apps/api` 负责通过 legacy adapter 或 compat route 输出 app 旧响应形态；admin canonical route 继续输出 admin 规范响应，两者共享同一个 domain service/repository。
- 当前 `apps/api/nitro.config.ts` 只有 `/app/**` handler；`apps/app/nitro.config.ts` 才同时具备 `/app/**` 与 `/callComponent/**`。因此 `/callComponent/**` 在 Phase6 首批默认状态是 `not-cut / compat-handler-required`：要么继续回退到 `apps/app` legacy runtime，要么先作为 Phase6 前置或独立任务补齐 `apps/api` compat handler、dispatcher 登记和契约测试。
- app 侧 `resolveHttpBaseUrlForPath` 或等价 compat helper 只能让 allowlist 内已验收 endpoint 指向 `apps/api`；allowlist 之外仍按当前 runtime 回退到 mock、legacy Nitro 或生产别名。
- 首批 app 切流必须覆盖 legacy DTO、旧字段、旧响应码和旧路径的契约测试；不能只验证 admin canonical endpoint 成功。

#### 6.5 分批切流顺序

阶段 6 推荐按风险从低到高推进：

1. **配置空跑批次**：只打开 dev proxy 或 direct base URL，验证 `apps/api` 当前真实健康与清单端点 `/__nitro/health`、`/__nitro/ready`、`/__nitro/endpoints`，不切页面流量。
2. **admin 只读批次**：切换 `houseCharge list/detail`、payment/report 只读接口，验证列表、详情、分页和真实 Neon 只读数据。
3. **admin 配置型写批次**：切换 `expenseItemSetting list/detail/create/update/delete-policy`，写操作必须带测试数据创建、查询、清理或 delete-policy 证据。
4. **app legacy 费用批次**：切换 Phase2 fee/payment/report legacy allowlist，验证 `/app/**` 旧响应形态和旧页面消费；`/callComponent/core/list` 与其他 `/callComponent/**` 保持 `not-cut / compat-handler-required`，不进入首批切流。
5. **repair 只读兼容批次**：只切 Phase4 已声明的 repair 最小兼容切片，不顺手扩展 parking/resource/charge-machine/open-door。

每批只能包含已经具备 `apps/api` 路由、adapter、service/repository、测试和验收记录的 endpoint；发现缺口时，该 endpoint 留在旧路径，不扩大批次范围。

#### 6.6 回退策略

阶段 6 的回退必须是开关级、批次级、 endpoint 级可执行回退：

- admin 全局回退：关闭 `VITE_11COMM_API_SHADOW_ENABLE` 或 `VITE_11COMM_API_USE_PROXY`，移除/置空 `VITE_11COMM_API_BASE_URL`，回到既有 `VITE_BASE_URL`、`VITE_PROXY_PREFIX` 或相对 `/api`。
- admin 模块回退：从模块 allowlist 移除对应三级业务路径，保留 hook 旧 URL 行为，不改页面组件。
- app 全局回退：关闭 app 的统一 API shadow 开关或把 `VITE_API_RUNTIME` 回到原 runtime，使 legacy path 继续走既有 mock、legacy Nitro 或生产域名。
- app endpoint 回退：从 compat allowlist 移除单个 `/app/**` endpoint，使该 endpoint 回到旧 runtime；`/callComponent/**` 在未补齐 `apps/api` compat handler 前本来就必须保持旧 runtime。
- 回退后必须补跑同一批次的冒烟命令，证明旧路径仍可用；不能只修改环境变量后口头宣布回退完成。

#### 6.7 验收证据

每批切流的验收记录至少包含：

- 配置证据：本批启用的 env、proxy 前缀、目标 base URL、服务端地址和回退开关。
- 路由证据：请求实际命中的 `apps/api` endpoint、legacy fallback endpoint 或旧服务 endpoint。
- 测试证据：对应 `apps/api` Vitest、admin hook 测试、app legacy 契约测试、必要的浏览器或 H5 联调记录。
- 数据证据：真实 Neon 只读查询或写入闭环证据；没有数据库 URL 的环境必须明确记录为未执行该项，不得伪造。
- 回退证据：关闭开关后同一 endpoint 回到旧路径的命令输出或页面联调截图说明。
- 受保护目录证据：`apps/admin/server`、`apps/app/server` 和 `D:\code\ruan-cat\01s-11comm-app` 仍存在且未被本阶段清理。

#### 6.8 风险与禁止事项

- 不把 `apps/api` 的可访问性等同于 app/admin 已完成全量切流。
- 不把 app legacy 测试通过解释为 admin canonical 已通过，也不把 admin canonical 测试通过解释为 app legacy 已通过。
- 不在阶段 6 修改数据库 schema；若切流暴露 schema 缺口，记录为 schema-change 任务并暂停相关 endpoint 切流。
- 不在 `apps/api` 内创建私有 Drizzle table、Zod schema 或类型事实来源。
- 不用批量脚本重写页面请求路径；必须通过 shared helper、proxy、adapter、allowlist 和小批次 hook 收敛推进。
- 不把旧服务退役、旧目录删除、历史源目录处置写入 Phase6 完成条件。

#### 6.9 完成判定

阶段 6 完成时必须满足：

- admin 和 app 都具备明确的统一 API base URL 配置、代理路径和回退路径。
- 首批已验收 endpoint 已经按批切到 `apps/api`，并有测试证据、数据证据、回退证据和验收记录。
- 未切流 endpoint 保持旧路径可用，且在切流矩阵中标明原因、阻塞项和下一批条件。
- `/app/**` 与 `/callComponent/**` 旧路径契约仍然存在；首批 `/app/**` legacy adapter 可由 `apps/api` 提供兼容输出，`/callComponent/**` 必须在切流矩阵中标明 `not-cut / compat-handler-required` 或提供已补齐 compat handler 与测试的证据。
- `apps/admin/server`、`apps/app/server` 和旧源目录仍被保留；Phase7 才能讨论 monorepo 内旧服务收口。

#### 6.10 Phase6/Phase7 阶段门边界

Phase6 的完成结论是：当前改造范围已经能够支撑“公共、独立 `apps/api` Nitro 服务同时服务 admin H5 与 app H5”的目标形态，但这只代表统一 API 中台、双端接入、兼容 adapter、回退路径和首批切流机制具备可交付基础，不代表 admin/app 已经完成全量 endpoint 切流。

Phase6 验收必须以三个 dev 服务同时运行作为本地端到端验证前提。最低本地验证拓扑如下：

- `apps/api`：运行 `pnpm -F @01s-11comm/api dev`，默认 `http://127.0.0.1:3102`，提供公共 Nitro API、legacy compat handler、dispatcher 与生产 DB adapter 验证入口。
- `apps/admin`：运行 `pnpm -F @01s-11comm/admin dev`，默认 `http://127.0.0.1:8080`；验证统一 API 时必须显式设置 `VITE_11COMM_API_SHADOW_ENABLE=true`、`VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102`，并按 proxy 模式设置 `VITE_11COMM_API_USE_PROXY=true`、`VITE_11COMM_API_PROXY_PREFIX=/api-shadow`。
- `apps/app`：运行 `pnpm -F @01s-11comm/app dev:h5`，默认 `http://127.0.0.1:3000`；验证统一 API 时必须显式设置 `VITE_11COMM_API_SHADOW_ENABLE=true`、`VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102`。如使用 `dev:h5:nitro`，它会额外拉起 app 自身 legacy Nitro，不等同于公共 `apps/api`。

admin/app 的浏览器验证不能只停留在接口测试或单元测试。每个进入首批切流的业务路径都必须保留页面级证据：页面可打开、关键列表/详情/提交动作可完成、Network 面板能证明请求命中预期服务、失败时能回退到 legacy 路径或明确阻断。admin canonical 验证与 app legacy/app H5 验证必须分别记录，不能互相代替。

最低浏览器验收矩阵：

| 端       | 浏览器入口                                                   | 必须证明                                                                                                     | 失败时处理                                 |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| API      | `http://127.0.0.1:3102/__nitro/health`、`/__nitro/endpoints` | 独立 Nitro 服务可访问，endpoint manifest 包含本批路由                                                        | 停止切流，先修复公共 API 服务              |
| admin H5 | `http://127.0.0.1:8080`                                      | 页面可打开；`/api-shadow/**` 或 direct base URL 请求命中 `apps/api`；已切流 admin endpoint 返回 `JsonVO`     | 回退到旧 `/api/**`，记录未切流原因         |
| app H5   | `http://127.0.0.1:3000`                                      | 页面可打开；allowlist 内 `/app/**` 请求可从 app origin 命中 `apps/api`；allowlist 外 endpoint 仍回旧 runtime | 从 allowlist 移除该 endpoint 或关闭 shadow |

Phase6 首批切流只能理解为“已验收 endpoint 的小批次切流”。禁止把首批 `/app/**`、admin hook 或 fee/expense 样板切流误读为全量切流；未进入切流矩阵、未通过浏览器验证、未具备回退路径的 endpoint 一律保持旧路径。

以下边界必须在 Phase6 结束和 Phase7 开始之间保持可见：

- `/callComponent/**` 默认仍是 `not-cut / compat-handler-required`，除非已经补齐 `apps/api` compat handler、dispatcher 登记、契约测试和浏览器证据。
- `house-charge` 的 `create/update/delete` 不属于当前已完成能力；若写入语义继续由 `expenseItemSetting` 承担，必须在切流矩阵中明确标注。
- app 侧只允许按 allowlist 渐进迁移 repair 等业务路径；未列入 allowlist 的 app endpoint 不得经由批量改写或默认代理切到 `apps/api`。
- 生产 DB readiness 必须单独确认，包括 Neon 连接、目标表结构、生产数据语义、失败回滚和只读/写入权限边界；本地 mock 或 memory repository 通过不能替代生产 DB readiness。
- 旧源目录 `D:\code\ruan-cat\01s-11comm-app` 永久保留，不进入 Phase6 完成项、Phase7 收口项、磁盘清理项或自动化归档项。

Phase7 只能在以上边界均被记录后进入“收口评审/规划”状态。删除旧服务必须是最后动作，且每一步都要有回滚路径；在 admin/app 尚未全量稳定消费 `apps/api` 前，Phase7 不得执行 `apps/admin/server`、`apps/app/server` 的删除、清空、移动或归档。

#### 6.11 2026-04-27 唯一阶段记录：Phase6 补证与 Phase7 准入判断

本节是 2026-04-27 阶段 6 补证、阶段 7 readiness gate、endpoint 盘点和删除候选清单的唯一沉淀位置。不得再为同一批信息在 `docs/superpowers/reports` 下生成并行报告；后续如需更新阶段门结论，应直接维护本设计文档对应章节。

当前结论：

- `apps/api` 已经具备公共、独立 Nitro API 服务的基础形态，并能在本地三端 dev 中同时被 admin H5 与 app H5 访问。
- 该结论只覆盖 Phase6 首批已验收 endpoint，不代表 admin/app 已完成全量切流。
- Phase7 当前只能进入规划、盘点、补证和删除候选清单阶段，不能进入旧服务删除执行态。
- `apps/admin/server`、`apps/app/server` 和旧源目录 `D:\code\ruan-cat\01s-11comm-app` 继续受保护；不得删除、移动、归档、重命名或清空。

当前 `apps/api` 已承载能力：

| 分组                          | 当前已承载 endpoint                                                                     | 状态                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Nitro infra                   | `GET /`、`GET /__nitro/health`、`GET /__nitro/ready`、`GET /__nitro/endpoints`          | health/endpoints 可用于本地探针；`ready` 在本地无 DB URL 时返回 `503 DATABASE_CONFIG_MISSING` |
| admin expense-item-setting    | `create`、`delete`、`detail`、`list`、`update`                                          | Phase6 首批已切流到 `apps/api`，仍需按页面批次补齐更多 Chrome MCP 和回退证据                  |
| admin house-charge            | `list`、`detail`                                                                        | Phase6 首批只读能力已切流；`create/update/delete` 不是已完成能力                              |
| admin repairs/report          | `repairs-todo/list`、`repairs-setting/list`、`issues/list`、`payment-details-form/list` | `apps/api` 已有 route 文件；进入删除候选前仍需页面级调用方证据                                |
| app fee/payment/report legacy | 12 个 Phase2 `/app/**` allowlist endpoint                                               | app H5 本地可从页面上下文访问 `apps/api`，但只代表首批 `/app/**`                              |
| app repair legacy             | 5 个 `/app/**` repair endpoint                                                          | `apps/api` manifest 已登记；当前未纳入 app allowlist，不得按已切流处理                        |
| `/callComponent/**`           | 无                                                                                      | `apps/api` 尚无 compat handler，继续保持 `not-cut / compat-handler-required`                  |

Phase6 本地三端 dev 补证记录：

```log
apps/api:   http://127.0.0.1:3102
admin H5:   http://127.0.0.1:8080
app H5:     http://127.0.0.1:3000

admin Chrome MCP Network:
GET  http://127.0.0.1:8080/api-shadow/__nitro/health -> 200
GET  http://127.0.0.1:8080/api-shadow/__nitro/ready -> 503, code DATABASE_CONFIG_MISSING
GET  http://127.0.0.1:8080/api-shadow/__nitro/endpoints -> 200
POST http://127.0.0.1:8080/api-shadow/api/property-manage/expense-manage/house-charge/list -> 200
POST http://127.0.0.1:8080/api-shadow/api/property-manage/expense-manage/expense-item-setting/list -> 200

app Chrome MCP Network:
GET http://127.0.0.1:3102/__nitro/health -> 200
GET http://127.0.0.1:3102/__nitro/ready -> 503, code DATABASE_CONFIG_MISSING
GET http://127.0.0.1:3102/__nitro/endpoints -> 200, manifest count 17
GET http://127.0.0.1:3102/app/fee.listFee?page=1&row=1&communityId=COMM_001 -> 200
GET http://127.0.0.1:3102/app/oweFeeCallable.listOweFeeCallable?page=1&row=1&communityId=COMM_001 -> 200

cleanup:
ports 3102/8080/3000 released
```

readiness 结论：

- 本地 `GET /__nitro/ready` 返回 `503 DATABASE_CONFIG_MISSING` 是预期的缺 DB URL readiness 响应，只能证明请求命中了 `apps/api`，不能证明生产或灰度 DB readiness。
- Phase7 执行态前必须在目标环境补齐 DB readiness 证据，包括 Neon 连接、目标表结构、读写权限、失败回滚和数据语义。

反向依赖扫描结论：

| 范围                           |                                       当前扫描结果 | Phase7 判断                               |
| ------------------------------ | -------------------------------------------------: | ----------------------------------------- |
| `apps/api/server/routes/api`   |                             11 个 admin route 文件 | 只覆盖少量首批 admin endpoint             |
| `apps/api` app legacy manifest |                           17 个 `/app/**` endpoint | 不含 `/callComponent/**`                  |
| `apps/admin/server/api`        |                                  155 个旧 API 文件 | 不具备整体删除证据                        |
| `apps/admin/src/api`           |                        119 个唯一 `/api/**` 字符串 | 大量前端调用仍未迁入 `apps/api`           |
| `apps/app/server`              |                              69 个 TypeScript 文件 | 仍承担 legacy runtime、契约来源和回退职责 |
| `apps/app/server` legacy URL   | 209 个唯一 `/app/**`、2 个唯一 `/callComponent/**` | 远未达到整体收口条件                      |

删除候选分级：

| 等级                       | 范围                                                                                             | 判定                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `forbidden`                | `apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`                        | 受保护路径，Phase7 gate 通过前禁止删除、移动、归档、重命名、清空           |
| `forbidden`                | `apps/admin/server/api` 整体                                                                     | 仍有 155 个旧 API 文件和大量 `/api/**` 调用方                              |
| `forbidden`                | `apps/app/server` 整体                                                                           | 仍有大量 `/app/**` 和 `/callComponent/**` legacy endpoint                  |
| `forbidden`                | `/callComponent/**`                                                                              | `apps/api` 未挂载，app legacy 仍挂载，必须保留                             |
| `forbidden`                | `house-charge/create`、`house-charge/update`、`house-charge/delete`                              | Phase6 明确未切流，写入字段归属、delete policy、DB 证据未补齐              |
| `forbidden`                | 未迁入 `apps/api` 的 admin `/api/**` 与 app `/app/**`                                            | 仍有前端调用或 legacy runtime 责任，不得删除                               |
| `candidate-after-evidence` | 已在 `apps/api` 承载的 Phase2 fee/payment/report app legacy endpoint                             | 需补齐 app 页面级 Chrome MCP、回退演练、调用方确认和 DB readiness 后再评审 |
| `candidate-after-evidence` | 已在 `apps/api` 承载的 `expense-item-setting` CRUD 与 `house-charge` list/detail 的旧 admin 实现 | 需补齐 admin 页面级 Chrome MCP、回退演练和调用方确认后再评审               |
| `candidate-after-evidence` | 已在 `apps/api` 承载的 repair admin list endpoint 与 repair app 5 个 endpoint                    | 当前只具备 API 侧或局部证据；需补 app allowlist、页面调用、回退和 DB 证据  |
| `not-candidate`            | `apps/api/server/**`                                                                             | 目标服务实现，不是旧服务删除对象                                           |
| `not-candidate`            | `apps/app/src/http/runtime-base.ts`、`apps/app/nitro.config.ts`                                  | 当前承担 shadow allowlist、回退决策和 legacy 挂载证据，不是删除候选        |

Phase7 下一步最小执行顺序：

1. 保持当前改动未提交状态，由人工审查 Phase6 代码、测试、配置和本设计文档更新。
2. 生成可复核的全量 endpoint 对照表，覆盖 `apps/api` manifest、`apps/admin/server/api`、`apps/admin/src/api`、`apps/app/server` 和 `apps/app/src` 调用方。
3. 对每个 endpoint 标注是否已由 `apps/api` 承载、是否有前端调用、是否有单测、是否有 Chrome MCP 证据、是否有回退证据、是否需要 DB readiness。
4. 单独处理 `/callComponent/**`：先补 `apps/api` compat handler 设计、contract test、app runtime allowlist 或回退策略，不进入删除候选。
5. 对 `candidate-after-evidence` 项补齐页面级正向证据、shadow=false 或 allowlist 移除后的回退证据、DB ready 或 mock/seed 边界说明。
6. 复判 Phase7 readiness gate。只有 gate 明确从 `no-go-for-execution` 变为可执行后，才能创建旧服务收口执行计划。

### 阶段 7：收口旧服务

确认 admin/app 都稳定消费 `apps/api`，且 Phase7 收口评审通过后，再逐步退役：

- `apps/admin/server`
- `apps/app/server`

Phase7 的第一步不是删除目录，而是收口评审、依赖扫描和退役计划。进入 Phase7 执行态前必须满足：

- 已存在全量 endpoint 状态矩阵，至少包含 `cut-to-apps-api`、`legacy-fallback`、`blocked`、`not-applicable`、`removed-by-design` 五类状态。
- admin H5、app H5、`apps/api` 三端在本地三 dev 服务和目标灰度/生产环境均有浏览器证据；Network 记录能证明已切流 endpoint 命中 `apps/api`。
- 生产或灰度 DB readiness 已确认，不能只依赖本地 memory repository、mock runtime 或单元测试。
- 每个 `legacy-fallback` 与 `blocked` endpoint 都明确说明为什么仍需要旧 server，或为什么不影响旧 server 收口。
- 已完成反向依赖扫描，覆盖 `apps/admin/src`、`apps/app/src`、Vite/Nitro 配置、proxy 配置、测试、CI、部署脚本和文档，确认没有运行时入口仍依赖将要退役的旧 server。
- 已演练回退：关闭统一 API 开关、移出 allowlist、恢复旧 route/proxy 或恢复目录都必须有明确步骤。

#### 7.1 三端本地真实 dev 验证流程

阶段 7 是大规模收口阶段，不能只依赖 Vitest、接口单测或静态扫描。每一批 Phase7 改造都必须先跑一次本地三端 dev 基线，改造后再复跑同一套基线，确认公共、独立的 `apps/api` Nitro 服务能够同时支撑 admin H5 与 app H5。三端验证的目标不是证明某个单独接口可用，而是证明真实浏览器页面、Vite 代理、运行时 base URL、API dispatcher、legacy adapter、admin canonical adapter 和回退路径在同一个本地拓扑里同时成立。

本地验证前提：

- `3102`、`8080`、`3000` 三个端口必须为空；如果因为本机占用改用其他端口，报告中必须记录实际端口、进程号和对应环境变量。
- 不得复用未知来源的历史 dev 进程；启动前必须确认三端进程来源，启动后记录 `apps/api`、`apps/admin`、`apps/app` 三个 dev 的日志窗口或日志文件。
- `apps/admin/server`、`apps/app/server` 和旧源目录 `D:\code\ruan-cat\01s-11comm-app` 在验证期间必须仍然存在；阶段 7 的验证只能证明“可以收口”，不能把验证动作本身变成删除动作。
- app 端不得用 `pnpm -F @01s-11comm/app dev:h5:nitro` 代替公共 API 验证；该命令会拉起 app 自身 legacy Nitro，只能作为 legacy 对照，不能证明 `apps/api` 同时支撑双端。

推荐启动命令如下。PowerShell 每个终端只启动一个 dev，便于保留日志和结束进程：

```powershell
# Terminal 1: 公共 Nitro API
pnpm -F @01s-11comm/api dev

# Terminal 2: admin H5，经 Vite proxy 命中 apps/api
$env:TURBO_ENV_MODE = "loose"
$env:VITE_11COMM_API_SHADOW_ENABLE = "true"
$env:VITE_11COMM_API_BASE_URL = "http://127.0.0.1:3102"
$env:VITE_11COMM_API_USE_PROXY = "true"
$env:VITE_11COMM_API_PROXY_PREFIX = "/api-shadow"
pnpm -F @01s-11comm/admin dev

# Terminal 3: app H5，直接以统一 API base URL 命中 apps/api
$env:VITE_11COMM_API_SHADOW_ENABLE = "true"
$env:VITE_11COMM_API_BASE_URL = "http://127.0.0.1:3102"
pnpm -F @01s-11comm/app dev:h5
```

启动后先做 readiness 探针：

```powershell
Invoke-WebRequest http://127.0.0.1:3102/__nitro/health
Invoke-WebRequest http://127.0.0.1:3102/__nitro/endpoints
Invoke-WebRequest http://127.0.0.1:8080/api-shadow/__nitro/health
Invoke-WebRequest http://127.0.0.1:3000/
```

Chrome MCP 验证必须覆盖两个前端入口：

| 验证对象 | Chrome MCP 操作                                                                                               | 必须保留的证据                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共 API | 打开或 fetch `http://127.0.0.1:3102/__nitro/health` 与 `http://127.0.0.1:3102/__nitro/endpoints`              | health 返回 `@01s-11comm/api` 或等价服务标识；manifest 包含本批候选 endpoint；如 ready/DB 探针失败，必须标注是本地配置缺失还是生产阻断          |
| admin H5 | 打开 `http://127.0.0.1:8080`，进入本批业务页面；通过页面交互或 MCP evaluate 请求 `/api-shadow/**`             | 页面可渲染；Network 中已切流 endpoint 命中 `/api-shadow/**` 并返回 admin `JsonVO`；本批列表、详情、写入或业务 action 的结果与旧 server 对照一致 |
| app H5   | 打开 `http://127.0.0.1:3000`，进入本批 app 页面；验证 allowlist 内 `/app/**` 请求命中 `http://127.0.0.1:3102` | 页面可渲染；allowlist 内 legacy endpoint 返回 `{ code: 0, msg, data }` 旧格式；allowlist 外 endpoint 不得被默认代理误切到 `apps/api`            |
| 回退路径 | 关闭 shadow 开关、移出 allowlist 或恢复旧 proxy 后重试同一页面/接口                                           | 能回到旧路径；无法回退的 endpoint 不允许进入旧服务收口候选                                                                                      |

阶段 7 每批候选 endpoint 必须形成验证矩阵，至少包含以下字段：

| 字段                 | 说明                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `businessPath`       | admin 三级业务路径或 app 页面/模块坐标                                                     |
| `adminCanonicalPath` | admin 规范 API 路径；没有 admin 端能力时填 `not-applicable`                                |
| `appLegacyPath`      | app 旧路径；没有 app 端能力时填 `not-applicable`                                           |
| `targetService`      | `apps/api`、`apps/admin/server`、`apps/app/server` 或 `blocked`                            |
| `responseContract`   | admin `JsonVO`、app `{ code, msg, data }`、文件流、导出、统计等契约                        |
| `dataSource`         | DB repository、fallback repository、memory/mock、第三方或未知                              |
| `fallbackPlan`       | 关闭 shadow、移出 allowlist、恢复 proxy、恢复旧 route 或其他回退步骤                       |
| `vitestEvidence`     | 对应 `apps/api/tests/**`、`apps/admin/src/**/tests/**` 或 `apps/app/src/tests/**` 测试文件 |
| `browserEvidence`    | Chrome MCP 截图、Network 请求、console 摘要、页面 URL 和操作结果                           |
| `retirementDecision` | `can-disable-entry`、`keep-for-fallback`、`blocked`、`delete-candidate`                    |

通过标准：

- 三个 dev 服务同时运行，`apps/api` health 与 endpoint manifest 可访问。
- admin H5 和 app H5 都能在真实浏览器中打开目标页面，且本批已切流请求能从 Network 证明命中 `apps/api`。
- admin canonical 与 app legacy 响应契约分别正确，不能用某一端成功替代另一端。
- 本批 endpoint 的回退路径已经实测，不只是文档描述。
- 旧 server 目录仍存在，且没有新增业务入口继续写入旧 server。
- 浏览器 console、Network、服务端日志中的错误都已分类：已知无关问题可记录为 residual，不得吞掉 API 路由、CORS、base URL、DB readiness 或 adapter 契约错误。

阻断标准：

- `apps/api` 无法独立启动，或只能通过 `apps/admin/server`、`apps/app/server` 间接提供能力。
- admin/app 页面只在旧 server、mock runtime 或 app 自身 legacy Nitro 下可用，却被标记为 `cut-to-apps-api`。
- `/callComponent/**`、未列入 allowlist 的 `/app/**`、未完成的 `house-charge create/update/delete` 被包装成已完成双端能力。
- 生产或灰度 DB readiness 未确认，而本批收口会删除或禁用旧 server 中唯一的数据来源。
- Chrome MCP 只能证明接口 fetch 成功，不能证明真实页面和 Network 命中路径。
- 任一候选 endpoint 无法回退，或回退步骤会触碰旧源目录 `D:\code\ruan-cat\01s-11comm-app`。

验证完成后必须清理本地进程并记录端口释放：

```powershell
Get-NetTCPConnection -LocalPort 3102,8080,3000 -State Listen
# 确认目标进程后再执行：
Stop-Process -Id <pid> -Force
```

Phase7 验收报告必须记录启动命令、环境变量、实际端口、Chrome MCP 入口 URL、关键 Network 请求、console 摘要、Vitest 命令与结果、回退演练结果、残留风险和本批旧 server 收口决策。没有这份三端本地真实 dev 证据，任何旧 server 禁用、目录清理或删除候选结论都不得通过评审。

Phase7 允许做：

- 编写旧服务收口评审、endpoint 状态矩阵、反向依赖扫描报告和删除候选清单。
- 冻结 `apps/admin/server`、`apps/app/server` 新增业务入口，要求新增能力只进入 `apps/api`。
- 移除已经无运行时引用、无 fallback 责任、且有测试覆盖的旧 proxy/route 注册。
- 将旧 server 中仍有价值的契约、mock、排错经验迁入设计文档、验收记录或 canonical skill，但不能把旧服务继续扩张成新事实来源。

Phase7 禁止做：

- 禁止把 Phase6 未完成的切流、schema 变更、业务迁移或生产接入补丁混入“旧服务收口”。
- 禁止把 `/callComponent/**`、`house-charge create/update/delete` 或未纳入 app allowlist 的 repair endpoint 包装成已完成能力。
- 禁止删除仍承担 fallback、契约来源、mock 对照或回滚职责的旧 server 目录。
- 禁止用单端测试替代双端浏览器验证；admin canonical、app legacy、公共 API、生产 DB readiness 必须分别给证据。
- 禁止触碰旧源目录 `D:\code\ruan-cat\01s-11comm-app`。

删除旧服务必须放在最后，且要有回滚路径。真正删除 `apps/admin/server` 或 `apps/app/server` 必须作为单独评审、单独变更、单独回滚方案处理；默认 Phase7 只允许先禁用入口、移除注册、保留目录，直到删除门槛全部满足。

阶段 7 的“收口旧服务”只允许讨论 monorepo 内的 `apps/admin/server` 与 `apps/app/server`，不得扩展到旧源目录 `D:\code\ruan-cat\01s-11comm-app`。旧源目录不是待退役服务，不是清理目标，不是归档目标，也不是释放磁盘空间目标；任何自动化代理、子代理、脚本或人工验收流程都不得把它列入删除、移动、归档、重命名或清空计划。

## 第一阶段禁做清单

以下事项必须记录并严格避免：

1. 不使用 `git subtree` 迁入 app。
2. 不保留 `01s-11comm-app` 的历史提交。
3. 不在第一阶段重写 app 项目结构。
4. 不删除 `apps/app/server`。
5. 不删除 `apps/admin/server`。
6. 不立即合并两个现有 Nitro server。
7. 不把 app 当前 Nitro 直接定义为唯一后端。
8. 不把 admin 当前 Nitro 直接定义为唯一后端。
9. 不批量改写 app 的接口调用。
10. 不批量改写 admin 的页面和组件。
11. 不一次性补齐 100 个 admin 业务路径的 CRUD。
12. 不批量重命名数据库字段。
13. 不在 `apps/api` 内私自定义新的数据库表事实来源。
14. 不新增 JWT、Token 校验、Neon Auth 或任何接口鉴权。
15. 不在新增或目标态 Nitro 代码中从 `"h3"` 直接导入 H3 函数；Phase1 保留的 legacy `apps/app/server` 历史写法不追溯为本阶段 blocker，后续迁入 `apps/api` 时统一改造。
16. 不全局安装工具包。
17. 不让多个编辑子代理同时修改根级 `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`turbo.json`、部署配置。
18. 不把 app mock/memory repository 当作最终生产数据源。
19. 不把 app legacy 字段直接污染 admin schema。
20. 不删除 legacy 路由 `/app/**`、`/callComponent/**`，先保留兼容。
21. 不粗暴删除从 app 项目迁入的 skills 技能。
22. 不在第一阶段把 app skills 和本项目 skills 强行合并。
23. 不把过时技能直接覆盖本项目已有 `.claude/skills/**` 或 `.agents/skills/**`。
24. 不把 app 的 `docs/**`、`openspec/**`、根级 AI 记忆文档直接覆盖主项目根级文档。
25. 不在没有 Markdown 清单、重复组记录和敏感信息扫描结果前删除 app 文档。
26. 不把 `src/uni_modules/**`、`gitee-example/**`、模板文档或第三方文档升级为主项目规范事实来源。
27. 不把 app 历史 prompt 中的临时指令直接提升为当前 monorepo 的长期执行规则。
28. 不在发现真实 token、数据库连接串、API key、生产密码后继续原样迁入可共享文档。
29. 不只迁移动态 mock 代码而遗漏 endpoint 文档、legacy 路径说明和数据源状态说明。
30. 不由迁移执行代理自行 `git commit`；提交必须由用户明确授权后再单独处理。
31. 不迁入 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 等无关 AI 客户端目录。
32. 不使用 `Get-Content | Set-Content`、`Out-File`、脚本重新编码、编辑器批量另存为等文本管道做快照复制。
33. 不把 PowerShell、终端、日志查看器中的显示乱码当成源码真实乱码并写回源码。
34. 不在源目标 SHA256 不一致、UTF-8 解码失败、出现新增 `U+FFFD` 或明显 `锟` 乱码时继续迁移。
35. 不在 byte-for-byte 基线验收完成前批量格式化、批量转换行尾或批量重写 Markdown。
36. 不把 app 的 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 直接合并进根级 AI 记忆文档。
37. 不把 app 历史记忆中的临时 prompt、旧工具约束、一次性执行策略提升为 monorepo 长期规则。
38. 不在没有 `2026-04-25-phase1-consolidated-report.md`、冲突矩阵和复核结论前合并或删除 app AI 记忆内容。
39. 不用 app 同名 skill 覆盖主项目 canonical skill；同名 skill 必须先做职责和冲突比对。
40. 不把只适用于 uni-app、移动端 mock、legacy API 或 app 局部组件迁移的经验升级为全仓库规则。
41. 不把 `/app/fee*`、`/app/payment*`、`/app/reportFeeMonthStatistics*` 等 app legacy 路径直接作为 admin 的长期规范 API。
42. 不让 admin 和 app 分别维护两套费用、支付、欠费、报表 mock 数据源。
43. 不把充电桩、开门记录等当前缺少 admin 三级业务路径的能力硬塞进费用模块；必须记录为后台功能缺口。
44. 不在没有 legacy 兼容测试和 admin canonical 测试的情况下迁移本批 fee/payment/report endpoint。
45. 不在没有红灯测试和转绿证据的情况下声称完成第一阶段迁移。
46. 不把 Nitro、endpoint registry、repository、adapter 测试放进 jsdom 环境。
47. 不跳过 app 项目的 `check-trigger.md` 和相关 skills 触发检查来迁移 app 页面、接口或组件。
48. 不用 app legacy DTO 反向定义 admin 长期 DTO；admin canonical DTO 必须从主项目业务 schema 和后台业务坐标出发。
49. 不在没有 `2026-04-25-phase1-consolidated-report.md` 或等价清单前合并两个项目的 AI 记忆、skills 或 spec 规则。
50. 不把只验证 app legacy 路径通过的测试结果解释为 admin 后台支撑已经完成。
51. 不用单一端的 mock 测试替代 app legacy、API adapter、admin canonical、schema/type 四层验收。
52. 不在任何情况下删除、移动、归档、重命名、清空或废弃 `D:\code\ruan-cat\01s-11comm-app`；Memorix 记忆清单、项目 alias 映射和会话摘要保全只能作为只读迁移证据，不能作为处置旧源目录的前置条件。
53. 不把当前会话没有暴露 Memorix MCP 工具误判为“app 项目没有 Memorix 历史”。
54. 不直接编辑 `C:\Users\pc\.memorix\data\*.json`、`memorix.db` 或其他 Memorix 内部数据文件来合并记忆。
55. 不在没有确认 `nwt-q/001-Smart-Community`、`ruan-cat/11comm-app`、旧 rootPath 和新 `apps/app` 路径关系前重建 app 记忆身份。
56. 不把 app 的 Memorix 记忆全文无筛选写入根级 AI 记忆；必须先分类、脱敏、复核和标注来源。
57. 不删除、移动、归档、重命名、清空或废弃旧源目录 `D:\code\ruan-cat\01s-11comm-app`；该目录必须永久保留，不受阶段、gate、alias/export/import、retirement review 或用户后续迁移验收结论影响。
58. 不允许自动化代理、子代理、脚本、人工验收流程、迁移收口流程、清理流程、退休复核流程或释放 gate 流程把旧源目录 `D:\code\ruan-cat\01s-11comm-app` 作为删除、移动、归档、重命名或清空对象。

## 风险控制

- 使用影子迁移：`apps/api` 先并行存在，旧服务先不删。
- 使用兼容路由：保留 app legacy 路径，新增规范路径。
- 使用显式 adapter：app 旧字段和 DB schema 字段之间必须有映射层。
- 使用环境变量切流：admin/app 的 API base URL 必须能回退。
- 使用分模块验收：每次只迁移少量业务路径。
- 使用 `apps/type` 作为唯一事实来源：所有 schema 变更按 Trinity Pattern 和导出链同步。
- 使用文档分层迁移：app 自有 Markdown 经过排除清单过滤后保留在 `apps/app`，再通过清单、重复组和敏感扫描逐步治理，不直接冲击主项目文档体系。
- 使用字符集验收门禁：先完成源项目文件大小、SHA256、UTF-8 解码、替换字符和行尾基线检查，再复制到 `apps/app`，迁入后做源目标对账，未通过时停止迁移。
- 使用 AI 记忆分级合并：app 记忆默认保留在 `apps/app`，只有通过价值评估、冲突矩阵和复核的内容才允许摘录到根级记忆或 canonical skill。
- 使用 Memorix 记忆保全：只读清点 `nwt-q/001-Smart-Community` / `ruan-cat/11comm-app` 相关 observations、sessions、alias 和关键词检索结果，并生成迁移证据；旧源目录 `D:\code\ruan-cat\01s-11comm-app` 必须永久保留，不得作为任何保全完成后的删除、退休、归档或清理对象。
- 使用双端 API 契约矩阵：每批 app legacy endpoint 必须明确 app 旧路径、admin canonical 业务坐标、共享领域服务、数据源状态和缺口归属，避免 admin/app 分叉实现。
- 使用测试门禁：第一阶段必须保留 app 现有 Vitest 契约测试，并新增迁移完整性、workspace、双项目 spec 合规、`apps/api` adapter 后续验收输入、schema/type 等分层测试设计或清单；任何阻断条件未解除时不得推进到收口旧服务。

## 验收标准

第一阶段完成时必须满足：

- `apps/app` 存在，并保留原 app 主体结构。
- `apps/app` 不包含嵌套 `.git`。
- 根 workspace 能识别 `apps/app`。
- 迁入不破坏现有 `apps/admin` 与 `apps/type`。
- 用户既有暂存修改不被混入迁移提交。
- app 项目内有价值的 skills 技能已被保留或记录到迁移清单。
- app skills 与本项目 skills 的冲突点已记录，但未在第一阶段强行合并。
- app 项目自有 Markdown 已随快照保留到 `apps/app`，且未覆盖主项目根级 `docs/**`、`.claude/skills/**`、`.agents/skills/**`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md`。
- 已生成 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价清单，记录路径、类别、价值等级、重复关系、敏感信息状态和后续处理建议。
- 已确认 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 没有进入 `apps/app`；如其中存在价值内容，只能在清单中记录人工摘录建议。
- 已生成源项目待迁入文件的大小和 SHA256 基线，并对未有意改写的迁入文件完成源目标 SHA256 对账。
- 已完成文本文件 UTF-8 严格解码检查，未发现新增 `U+FFFD`、明显 `锟` 乱码或未经确认的异常 `\uXXXX` 转义。
- 已完成行尾检查；如果存在从 CRLF 到 LF 的有意规范化，必须和 byte-for-byte 快照验收分开记录。
- 已确认 PowerShell 或终端输出中的显示乱码没有被当成源码内容写回任何 Markdown、Vue、TypeScript 或配置文件。
- 已识别 `.claude/**`、`.agent/**`、`.agents/**` 内的重复 skills、根级 AI 记忆文档等重复组；app-local OpenSpec/OPSX 副本已按根 canonical 受控删除，其他重复项继续记录、不强行合并。
- 已生成 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价清单，记录每个 AI 记忆来源的目标候选位置、价值等级、适用范围、冲突状态、处理决策和 canonical 指向。
- 已生成 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价清单，保全 app 项目 Memorix observations、sessions、alias 和旧路径身份线索。
- 已确认 app 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 只作为 `apps/app` 作用域历史上下文保留，未直接覆盖或拼接进主项目根级 AI 记忆。
- 已完成 app skills 与主项目 canonical skills 的冲突矩阵；同名或同职责 skill 已标记为保留、摘录、合并、归档或拒绝。
- 已确认进入根级 AI 记忆的任何摘录都保留来源路径和迁移日期，并且只包含当前 monorepo 长期有效的规则。
- 已确认 `memorix status`、`memorix doctor`、`.project-aliases.json` 和关键词检索结果没有互相矛盾；如存在 projectId / canonical alias 差异，已在 alias map 中记录并给出处理决策。
- 已确认旧工具约束、外部客户端专属规则、临时 prompt、个人环境信息没有被提升为当前项目长期规则。
- 已完成 Markdown 敏感信息扫描，真实凭据已脱敏或阻断迁入，演示账号和示例连接串已标注为示例/历史参考。
- 与 Nitro legacy、动态 mock、endpoint coverage 相关的 app 文档已被标记为 `apps/api` 迁移期间需要持续同步的文档。
- 已将 app 新增的 fee/payment/owe-fee/report endpoint 纳入 Phase2 首批迁移矩阵；charge-machine、machine-record 等当前缺少后台业务坐标的 endpoint 已标记为后续扩展波次或后台功能缺口。
- 已确认 `src/api/fee.ts`、`server/modules/fee/endpoints.ts`、`src/tests/nitro-runtime/fee-endpoints.test.ts` 这组 app 侧契约会作为 `apps/api` 迁移验收输入，而不是被迁移时丢弃。
- 已设计并记录第一阶段 Vitest 自测分层，包含快照完整性、workspace 识别、app legacy endpoint、`apps/api` 双端 adapter 后续验收输入、schema/type、AI 记忆/spec 合规、mock 文档同步。
- 已对账 app `src/types`：旧源 `D:\code\ruan-cat\01s-11comm-app\src\types` 与目标 `apps/app/src/types` 均跟踪 27 个 `.ts` 类型源文件，缺失 0、额外 0，CRLF 归一化后文本差异 0；`auto-import.d.ts`、`components.d.ts`、`uni-pages.d.ts`、`async-component.d.ts`、`async-import.d.ts` 属于旧源与目标均 ignored 的插件生成声明文件，Phase1 不应手写全局声明补丁替代生成链路。
- 已确认 Nitro/API 相关测试使用 Node 环境，页面组件测试才使用 jsdom 或组件测试环境。
- 已确认 legacy `apps/app/server` 已经改成 `nitro/h3` 的少量 import 不需要回滚；后续发现或尚未处理的直接 `"h3"` 导入、handler 风格和 mock dispatcher 写法属于下一阶段历史债务任务，不阻断 Phase1 快照迁入验收。
- 已生成 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md` 或等价清单，记录主项目与 app 项目的 AI 记忆、skills、spec 规则的来源、适用范围、冲突状态、canonical 决策和验证方式。
- 已记录第一阶段红灯测试、转绿测试和最终 fresh verification 命令；没有验证证据时不得宣称迁移完成。

第二阶段验收完成时必须满足：

- API 可独立启动和构建。
- 健康检查可访问。
- 不依赖 admin Vite 或 app uni 编译。
- `apps/api` 不是空壳：除健康检查和基础入口外，必须存在 fee/payment/report 首批纵切样板。
- H3 API 均从 `nitro/h3` 导入。
- 不存在鉴权中间件或鉴权插件。
- 新增或迁入的接口统一使用 `@01s-11comm/type` 与 `apps/type/src/business/**/schema.ts` 单一事实来源，不在 `apps/api` 内建立私有 schema 体系。
- 本批 fee/payment/report app legacy 路径在 `apps/api` 中有兼容测试，至少覆盖 `/app/fee.listFee`、`/app/feeApi/listOweFees`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.listOweFeeCallable`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/feeConfig.listFeeConfigs`、三条 `/app/reportFeeMonthStatistics*`、`/app/dataReport.queryFeeDataReport`。
- admin canonical endpoint 与 app legacy endpoint 共享同一领域服务或 repository，不存在两套互相漂移的费用、支付、欠费、报表数据源。
- 已有 `apps/api/tests/legacy/**` 与 `apps/api/tests/admin/**` 或等价测试分别覆盖 app legacy DTO 和 admin canonical DTO，且同一业务共享 service/repository 的断言存在。
- schema 相关改动已在 `apps/type` 完成 Trinity Pattern、导出链和类型检查；如涉及数据库迁移，已同步迁移文件和 Neon 表清单。
- 未迁移 repair/resource/parking，且未把这些模块纳入 Phase2 多模块并行规划。
- 未删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或旧源目录 `D:\code\ruan-cat\01s-11comm-app`。
- 未做 app/admin 全量切流；如有局部验证，必须保留回退路径。
- 充电桩、开门记录、repair/resource/parking 这类后续扩展能力不属于第二阶段验收；如实施过程中发现相关线索，只能作为后续阶段输入记录，不得伪装为第二阶段已完成支撑。
- CI、部署、完整 runtimeConfig、环境变量治理、CORS 策略、日志监控和接入策略加固属于第三阶段验收，不作为第二阶段完成条件。
- repair/resource/parking 等多模块扩张属于第四阶段验收，不作为第二阶段完成条件。

Phase2 -> Phase3 的 GitHub workflow 交接验收必须满足：

- `pnpm install --frozen-lockfile` 在本地和 GitHub Actions 中均通过；lockfile 不得引用不存在的 package snapshot。
- 全量 CI 使用 `pnpm run ci`，并由 workspace-local Turbo 覆盖全部子包 build。
- `App 专项 CI` 必须继续通过 H5 production build、type-check、Vitest 和 Nitro Vercel build。
- workflow 不包含 `run_install`、`--global`、`pnpm ls -g`、直接 `turbo --version` 或其他依赖全局工具的步骤。
- workflow、job、step 名称为语义化中文。
- 不通过降级 `actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6` 等必要 action major versions 规避 CI 问题。
