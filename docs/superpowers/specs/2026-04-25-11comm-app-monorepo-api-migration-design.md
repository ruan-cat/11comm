<!-- 状态：Phase1 快照迁入已完成；Phase2 已完成 `apps/api` 最小 Nitro 影子服务与 fee/payment/report 首批纵切样板；GitHub Actions、Cloudflare、Vercel checks 已在最新 dev HEAD 通过；当前可开启 Phase3；Memorix canonical history retention gate 已拆分释放为 released-for-phase2-progress / pass-with-permanent-source-retention；旧源目录 D:\code\ruan-cat\01s-11comm-app 永久禁止删除、移动、归档、重命名或清空。 -->

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

如确实需要编写报告，应只创建或持续维护一个汇总报告文件，建议总长度约 3500 行左右。该长度应足以覆盖背景、探索过程、实现记录、验证证据、复核结论、遗留风险和后续 TODO，不应因为子任务数量较多而自动拆成多个报告。

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

- 示例占位符可以保留，但必须能明确看出是示例，例如 `user:pass`、`ep-xxx`、`your-api-key-here`。
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

| 来源                                               | 进入 `apps/api` 后的角色           | 说明                                                                                                                                            |
| -------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/app/server/modules/{domain}`                 | legacy endpoint 与旧 DTO 契约来源  | 提供 `/app/**`、`/callComponent/**` 旧路径、旧字段、GET/POST 兼容方式和旧响应形态。迁入后由 `legacy-endpoints.ts` 与 `legacy-adapter.ts` 承接。 |
| `apps/admin/server/api/**` 与 `rank-route-keys.ts` | admin canonical 路由和返回结构参考 | 提供后台业务路径、文件路由风格、`JsonVO<PageDTO<T>>` 响应结构和三级业务坐标。迁入后由 `server/routes/api/**` 与 `admin-adapter.ts` 承接。       |
| `apps/api/server/modules/{domain}`                 | 新 API 的领域模块                  | 只保留一套 repository/service/runtime，再通过不同 adapter 输出 app legacy DTO 与 admin canonical DTO。                                          |

领域模块推荐文件结构如下：

```text
apps/api/server/modules/{domain}/
  types.ts             # 当前迁移波次需要的 DTO、query、result 类型
  repository.ts        # 数据访问层；可按阶段使用 fallback/in-memory 或 DB repository
  service.ts           # 领域业务能力层；app 和 admin 都只能通过它复用业务逻辑
  legacy-adapter.ts    # 把 service 结果转换为 app 旧字段和旧响应语义
  admin-adapter.ts     # 把 service 结果转换为 admin JsonVO/PageDTO 和 canonical DTO
  legacy-endpoints.ts  # 只登记允许迁入 runtime 的 /app/** 或 /callComponent/** 旧路径
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

按 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径迁移。

优先处理：

- `property-manage/expense-manage`
- `property-manage/house-property-manage`
- `property-manage/parking-manage`
- `property-manage/patrol-manage`
- `property-manage/repairs-manage`
- `operation-team`
- `dev-team/menu-manage`

每个业务路径逐步补齐：

- `list`
- `detail`
- `create`
- `update`
- `delete`
- 必要的业务 action

### 阶段 6：接入 app/admin 到统一 API

通过环境变量或代理配置，让两端逐步指向 `apps/api`：

- admin 使用统一 API base URL，不再依赖生产同源 `/api`。
- app 短期保留 `/app/**`、`/callComponent/**` 旧路径契约。
- 不一次性大改页面和业务组件，按已验收模块逐步切换。
- 每批切流都必须保留回退路径和测试证据。

### 阶段 7：收口旧服务

确认 admin/app 都稳定消费 `apps/api` 后，再逐步退役：

- `apps/admin/server`
- `apps/app/server`

删除旧服务必须放在最后，且要有回滚路径。

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
