<!-- TODO: 长任务 持续完成改造 -->

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
5. 第一阶段以“不拆解 app 业务结构”为主，不立即重写 app 内部结构；“原样保留”不包含 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 等多工具垃圾副本。
6. `apps/type` 继续作为数据库 Schema、Zod Schema、TypeScript 类型的唯一事实来源。
7. Nitro 接口不新增任何鉴权逻辑，不引入 JWT、Token 校验、Neon Auth。

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
- `.claude/skills/**`
- `.agents/skills/**`
- `.agent/skills/**`
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

迁入 app 时还要同步盘点 app 项目内的 skills 技能。原则是先原样保留，再判断价值，不在第一阶段粗暴删除或改写：

1. 识别 app 项目内 `.claude/skills/**`、`.agents/skills/**`、`.agent/skills/**` 的技能清单。
2. 标记与 app 业务、uni-app、Nitro legacy、mock 数据、接口适配、排错经验相关的有价值技能。
3. 对与当前 monorepo 技能冲突的内容，只记录冲突，不立即合并。
4. 后续单独设计 skills 合并任务，把有价值经验迁入本项目统一技能体系。

### 阶段 1.1：Markdown 文档迁移策略

`01s-11comm-app` 不是只有源码需要迁入，仓库内还存在大量 Markdown 上下文，包括根级 AI 记忆文档、VitePress 文档、OpenSpec 工件、历史报告、组件 README、mock 说明、skills 参考文档和多工具命令/技能副本。Markdown 迁移不能简单等同于“复制后随手去重”，必须先保留证据，再做分层治理。

本轮抽样盘点的基线是：排除 `.git`、`node_modules`、`dist`、`build`、`.output`、`.nuxt`、`.vite`、coverage、`.turbo` 等目录后，`D:\code\ruan-cat\01s-11comm-app` 约有 314 个项目相关 Markdown。正式迁入前应以迁入当日快照重新生成一次基线，并额外排除 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`，不能直接沿用这个数量作为最终事实。

#### 快照迁入时的默认保留规则

第一阶段采用“项目自有 Markdown 默认保留”的规则：

- `README.md`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 等根级说明和 AI 记忆文档原样进入 `apps/app`，视为 app 子项目作用域内的历史上下文。
- `docs/**`、`openspec/**`、`src/**/README.md`、`src/**/index.md`、`.claude/**`、`.agent/**`、`.agents/**`、`.github/**` 下的项目自有 Markdown 默认保留路径不变。
- `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 下的 Markdown 默认排除，不进入 `apps/app`。
- `src/uni_modules/**`、`gitee-example/**` 等第三方或参考实现中的 Markdown 先随 app 快照保留，但迁移清单中必须标记为“第三方/参考资料”，不能升级为 monorepo 规范事实来源。
- `node_modules/**`、`dist/**`、`.output/**`、coverage、临时缓存等依赖或构建产物不属于迁入对象，即使其中包含 Markdown 也不迁入。
- 第一阶段不把 app 文档直接搬到根级 `docs/**`，也不把 app skills 直接覆盖根级 `.claude/skills/**` 或 `.agents/skills/**`。

#### 文档价值分类

迁入后按价值分层建立清单，后续治理必须基于清单而不是凭文件名删除：

| 类别                  | 文档形态                                                                                         | 处理策略                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| P0 迁移关键上下文     | Nitro 双运行时、legacy API、mock endpoint、Vite 兼容、迁移计划、当前 README 补充说明             | 保留并优先纳入迁移索引，迁移 `apps/api` 时持续同步 |
| P1 app 业务与历史经验 | 业务页面迁移报告、OpenSpec 归档、组件 README、排错复盘、uni-app 兼容经验                         | 保留在 `apps/app`，必要时摘录到后续专题报告        |
| P2 模板/第三方参考    | unibest/VitePress 基础文档、uni_modules 文档、gitee-example 参考说明                             | 保留但降权，清单中标记来源，不作为主项目规范       |
| P3 重复或过时候选     | 多 AI 工具重复的 OpenSpec skills、完全相同的 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`、旧 prompt 草稿 | 第一阶段不删除，只记录重复关系和建议归档方向       |

#### 重复文档处理规则

重复文档分为“精确重复”和“语义重叠”两类处理：

1. 对精确重复文件，使用文件哈希或内容比对生成重复组。已观察到的典型重复包括多工具目录下的 OpenSpec skills，以及根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 同步副本。
2. 对工具入口型重复文档，只保留当前项目需要的 `.claude/skills/**`、`.agent/skills/**`、`.agents/skills/**`；`.cursor/skills/**`、`.gemini/skills/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 默认排除。
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

| 来源内容                                                                                                | 第一阶段位置                  | 后续处理                                        |
| ------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------- |
| app 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`                                                          | 原样进入 `apps/app/`          | 作为 app 子项目历史上下文，不自动提升为根级规则 |
| app `.claude/skills/**`、`.agent/skills/**`、`.agents/skills/**`                                        | 原样进入 `apps/app/` 对应目录 | 进入 skills 价值清单和冲突矩阵，后续逐项合并    |
| app `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`                                     | 默认不迁入                    | 如确有独特经验，只人工摘录到清单，不复制原目录  |
| app 业务、uni-app、ColorUI 到 wot-design-uni、z-paging、动态标题、Nitro legacy/mock、Vite mock 兼容经验 | 保留在 `apps/app` 原文位置    | 标记为可迁移经验，优先进入后续专题整理          |
| 与主项目同名或同职责的 skills                                                                           | 保留 app 原文，不覆盖主项目   | 生成冲突矩阵，明确 canonical 指向和差异         |
| 包含敏感信息或个人环境的记忆                                                                            | 阻断原样公开迁入或先脱敏      | 保留变量名、错误形态、复现步骤，移除真实值      |

根级记忆提升规则：

- 提升到根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 的内容必须是当前 monorepo 级别的长期规则；如果只是 app 子项目规则，应写入 `apps/app/CLAUDE.md` 等 app 作用域文件。
- 根级 AI 记忆文件如果在本项目中保持同步副本关系，后续修改必须一次性同步到 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`，不能只改其中一个入口。
- app 记忆中与根级规则冲突的内容，默认以根级规则为 canonical；只有在人工复核确认根级规则已经过时后，才允许另开任务修改根级规则。
- 摘录进入根级记忆时必须保留来源引用，例如来源路径、原始主题和迁移日期，避免未来无法判断规则来源。
- 不把“使用某个 AI 客户端/某个子代理工具/某个一次性命令”的历史要求提升为当前项目的通用要求。

skills 合并规则：

- app skills 先作为 app 子项目技能保留，不在第一阶段直接进入根级 `.claude/skills/**` 或 `.agents/skills/**`。
- 同名 skill 必须先比较职责、触发条件、禁止项、示例和相关脚本；同名不等于可覆盖，不同名也可能职责冲突。
- 可复用经验优先以“摘录补充 canonical skill”的方式进入主项目技能，而不是复制一份平行 skill。
- 如果 app skill 只服务 uni-app、移动端 mock、legacy API 或 app 内组件迁移，应保留在 `apps/app` 作用域，不升级为全仓库技能。
- 如果 app skill 中记录的是事故复盘、排错经验或迁移教训，应优先沉淀到专题报告或对应 canonical skill 的“历史事故/约束”章节。

必须生成的合并证据：

```text
apps/app/docs/migration/ai-memory-merge-inventory.md
```

清单至少包含：来源路径、目标候选位置、主题、价值等级、是否仍然有效、适用范围、是否冲突、敏感信息状态、处理决策、canonical 指向、摘录摘要、复核人和复核日期。

AI 记忆合并决策分为五类：

- `keep-app-scope`：只保留在 `apps/app`，不进入根级规则。
- `promote-root-memory`：摘录进入根级 AI 记忆，适用于整个 monorepo。
- `merge-canonical-skill`：提炼进入主项目已有 canonical skill。
- `archive-reference`：只作为历史证据或迁移参考，不进入执行规则。
- `reject-or-redact`：因过时、冲突、敏感或误导风险而拒绝合并，或先脱敏再保留。

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
apps/app/docs/migration/markdown-inventory.md
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

`D:\code\ruan-cat\01s-11comm-app` 已补充一批费用、欠费、支付、充电桩、报表和开门记录相关 mock endpoint。迁入时不能只把这些 endpoint 当作 app 兼容层处理，必须在 `apps/api` 内同时设计 app legacy adapter 和 admin canonical adapter。

已确认的 app 侧来源包括：

- `D:\code\ruan-cat\01s-11comm-app\src\api\fee.ts`
- `D:\code\ruan-cat\01s-11comm-app\server\modules\fee\endpoints.ts`
- `D:\code\ruan-cat\01s-11comm-app\src\tests\nitro-runtime\fee-endpoints.test.ts`
- `D:\code\ruan-cat\01s-11comm-app\docs\superpowers\plans\2026-04-25-h5-mock-endpoint-coverage.md`

双端支撑原则：

- `apps/api` 内只保留一套领域服务和数据访问层，例如 fee、payment、owe-fee-callable、charge-machine、fee-report、machine-record；app 和 admin 通过不同 adapter 消费同一服务。
- app adapter 必须保留 `/app/**` legacy 路径、GET/POST 兼容方式、旧字段名和旧响应结构，直到 app 前端完成调用迁移。
- admin adapter 必须按 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径组织规范接口，返回 `@01s-11comm/type` 定义的 `JsonVO`、`PageDTO` 和统一 DTO。
- mock/memory repository 只能作为过渡数据源；最终应替换为 `apps/type/src/business/**/schema.ts` 中的 Drizzle schema 和 Neon 数据库。
- 对当前 admin 没有明确三级业务路径的能力，不允许硬塞到不相关模块；必须记录为后台功能缺口，后续通过 admin 功能扩展规格补齐业务路径、菜单、页面和 CRUD。

本批 endpoint 的迁移矩阵如下：

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
| `/app/iot/listChargeMachineBmoImpl`                      | 充电桩列表   | admin 当前缺少明确三级业务路径                                                                                                                                    | `apps/api` 先保留 app legacy 能力；admin 页面和业务路径需另行补齐                       |
| `/app/iot/listChargeMachineOrderBmoImpl`                 | 充电桩订单   | admin 当前缺少明确三级业务路径                                                                                                                                    | 先作为 charge-machine 领域服务保留，后续补后台订单管理                                  |
| `/app/iot/listChargeMachinePortBmoImpl`                  | 充电桩端口   | admin 当前缺少明确三级业务路径                                                                                                                                    | 先保留 app 兼容，后续补设备/端口后台管理                                                |
| `/app/machine/listMachineRecords`                        | 开门记录     | admin 当前缺少明确三级业务路径                                                                                                                                    | 不硬塞到费用模块；记录为门禁/设备日志后台缺口                                           |

实现形态要求：

1. 在 `apps/api` 内建立 fee 迁移波次，先迁移 app legacy registry 的路由注册和测试，再抽取领域服务。
2. 为每个 legacy endpoint 建立 `legacyPath -> canonicalService -> legacyDto` 的 adapter；admin endpoint 则使用 `canonicalPath -> canonicalService -> adminDto`。
3. app 侧兼容测试必须覆盖上表所有旧路径和方法；admin 侧测试必须覆盖对应 canonical 业务坐标的列表、详情、创建、统计或动作接口。
4. 不允许 admin 和 app 各自维护两套 fee mock 数据；同一业务必须共享 seed、repository 或数据库查询。
5. 当某个 app endpoint 找不到 admin 业务坐标时，不能阻断 app 迁入，但必须写入 admin 功能缺口清单，并在后续规格中补齐后台页面、菜单、权限和 CRUD。

### 阶段 2：建立 `apps/api` 影子服务

新增最小 Nitro 服务，先不迁移大业务：

- 健康检查
- CORS
- runtimeConfig
- 环境变量读取
- 数据库连接
- 统一响应基础类型
- 基础测试

所有 H3 API 必须从 `nitro/h3` 导入。

### 阶段 3：接入 app/admin 到统一 API

通过环境变量或代理配置，让两端可以指向 `apps/api`：

- admin 使用统一 API base URL，不再依赖生产同源 `/api`。
- app 短期保留 `/app/**`、`/callComponent/**` 旧路径契约。
- 不在这一阶段大改页面和业务组件。

### 阶段 4：迁移 app legacy API

把 `apps/app/server/**` 中的 legacy dispatcher、runtime endpoints、memory repository、模块接口逐步迁入 `apps/api`。

迁移顺序：

1. 保持旧路径行为一致。
2. 固定兼容测试。
3. 优先迁移 fee/payment/report 这一批已补齐 mock 和测试的 endpoint，形成第一条 app/admin 双端支撑样板。
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

### 阶段 6：收口旧服务

确认 admin/app 都稳定消费 `apps/api` 后，再逐步退役：

- `apps/admin/server`
- `apps/app/server`

删除旧服务必须放在最后，且要有回滚路径。

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
15. 不从 `"h3"` 直接导入 H3 函数。
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
38. 不在没有 `ai-memory-merge-inventory.md`、冲突矩阵和复核结论前合并或删除 app AI 记忆内容。
39. 不用 app 同名 skill 覆盖主项目 canonical skill；同名 skill 必须先做职责和冲突比对。
40. 不把只适用于 uni-app、移动端 mock、legacy API 或 app 局部组件迁移的经验升级为全仓库规则。
41. 不把 `/app/fee*`、`/app/payment*`、`/app/reportFeeMonthStatistics*` 等 app legacy 路径直接作为 admin 的长期规范 API。
42. 不让 admin 和 app 分别维护两套费用、支付、欠费、报表 mock 数据源。
43. 不把充电桩、开门记录等当前缺少 admin 三级业务路径的能力硬塞进费用模块；必须记录为后台功能缺口。
44. 不在没有 legacy 兼容测试和 admin canonical 测试的情况下迁移本批 fee/payment/report endpoint。

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
- 使用双端 API 契约矩阵：每批 app legacy endpoint 必须明确 app 旧路径、admin canonical 业务坐标、共享领域服务、数据源状态和缺口归属，避免 admin/app 分叉实现。

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
- 已生成 `apps/app/docs/migration/markdown-inventory.md` 或等价清单，记录路径、类别、价值等级、重复关系、敏感信息状态和后续处理建议。
- 已确认 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 没有进入 `apps/app`；如其中存在价值内容，只能在清单中记录人工摘录建议。
- 已生成源项目待迁入文件的大小和 SHA256 基线，并对未有意改写的迁入文件完成源目标 SHA256 对账。
- 已完成文本文件 UTF-8 严格解码检查，未发现新增 `U+FFFD`、明显 `锟` 乱码或未经确认的异常 `\uXXXX` 转义。
- 已完成行尾检查；如果存在从 CRLF 到 LF 的有意规范化，必须和 byte-for-byte 快照验收分开记录。
- 已确认 PowerShell 或终端输出中的显示乱码没有被当成源码内容写回任何 Markdown、Vue、TypeScript 或配置文件。
- 已识别 `.claude/**`、`.agent/**`、`.agents/**` 内的重复 skills、根级 AI 记忆文档等重复组，并明确第一阶段只记录、不删除、不强行合并。
- 已生成 `apps/app/docs/migration/ai-memory-merge-inventory.md` 或等价清单，记录每个 AI 记忆来源的目标候选位置、价值等级、适用范围、冲突状态、处理决策和 canonical 指向。
- 已确认 app 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 只作为 `apps/app` 作用域历史上下文保留，未直接覆盖或拼接进主项目根级 AI 记忆。
- 已完成 app skills 与主项目 canonical skills 的冲突矩阵；同名或同职责 skill 已标记为保留、摘录、合并、归档或拒绝。
- 已确认进入根级 AI 记忆的任何摘录都保留来源路径和迁移日期，并且只包含当前 monorepo 长期有效的规则。
- 已确认旧工具约束、外部客户端专属规则、临时 prompt、个人环境信息没有被提升为当前项目长期规则。
- 已完成 Markdown 敏感信息扫描，真实凭据已脱敏或阻断迁入，演示账号和示例连接串已标注为示例/历史参考。
- 与 Nitro legacy、动态 mock、endpoint coverage 相关的 app 文档已被标记为 `apps/api` 迁移期间需要持续同步的文档。
- 已将 app 新增的 fee/payment/owe-fee/charge-machine/report/machine-record endpoint 纳入迁移矩阵，并标记每个 endpoint 的 admin canonical 业务坐标或后台功能缺口。
- 已确认 `src/api/fee.ts`、`server/modules/fee/endpoints.ts`、`src/tests/nitro-runtime/fee-endpoints.test.ts` 这组 app 侧契约会作为 `apps/api` 迁移验收输入，而不是被迁移时丢弃。

`apps/api` 阶段完成时必须满足：

- API 可独立启动和构建。
- 健康检查可访问。
- 不依赖 admin Vite 或 app uni 编译。
- H3 API 均从 `nitro/h3` 导入。
- 不存在鉴权中间件或鉴权插件。
- 数据库连接通过请求事件和 runtimeConfig 安全读取。
- 本批 fee/payment/report app legacy 路径在 `apps/api` 中有兼容测试，至少覆盖 `/app/fee.listFee`、`/app/feeApi/listOweFees`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.listOweFeeCallable`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/feeConfig.listFeeConfigs`、三条 `/app/iot/**`、三条 `/app/reportFeeMonthStatistics*`、`/app/dataReport.queryFeeDataReport`、`/app/machine/listMachineRecords`。
- admin canonical endpoint 与 app legacy endpoint 共享同一领域服务或 repository，不存在两套互相漂移的费用、支付、欠费、报表数据源。
- 对充电桩和开门记录这类当前缺少 admin 三级业务路径的能力，已生成后台功能缺口记录，不阻断 app 兼容迁入，但不得伪装为已完成 admin 支撑。
