## ADDED Requirements

### Requirement: Agent Team 批次执行模型

Phase7 后续执行必须继承旧批量计划中的 Agent Team 模型：主代理负责读取 OpenSpec 全量要求、拆分任务、收集子代理报告、整合 `tasks.md` 与验收结论；探索子代理、编辑子代理和复核子代理分别承担只读调查、受控改动和独立复核。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 启动一个新批次

- **WHEN** 后续代理准备推进一个 Phase7 批次或切片
- **THEN** 必须先明确主代理、探索子代理、编辑子代理和复核子代理的职责边界，并把子代理输出汇总到 `agent-progress.md` 或 `agent-findings.md`

#### Scenario: 子代理输出未被整合

- **WHEN** 子代理只在对话中返回发现但没有进入 OpenSpec 进度、发现或任务状态
- **THEN** 该批次不得标记完成，直到主代理把有效事实整合到 canonical OpenSpec 工件

### Requirement: Agent Team 角色产出

Agent Team 的角色产出 MUST 具体可审计：探索子代理输出 endpoint/source/caller/data-source/evidence 缺口矩阵草案；编辑子代理输出代码或文档改动、测试文件、验证命令和证据路径；复核子代理输出独立复核结论、缺口、禁止误判检查和是否允许勾选任务。主代理负责把这些产出合并进 OpenSpec canonical，不允许把子代理报告本身作为长期任务源。

#### Scenario: 探索子代理完成

- **WHEN** 探索子代理结束一个切片
- **THEN** 其结果必须包含源文件、调用端、目标 apps/api、数据源、证据缺口和阻断原因，而不仅是“已查看”

#### Scenario: 复核子代理完成

- **WHEN** 复核子代理结束一个切片
- **THEN** 必须明确任务是否可勾选、哪些证据仍缺、是否误用了历史证据、是否触碰受保护路径

### Requirement: 批次 0-8 调度语义保留

旧计划中的 batch 0-8 不是可丢弃的历史标题；OpenSpec 必须保留它们对应的推进语义，并把它们映射到当前长期 backlog。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 继续 P0/P1 app legacy 工作

- **WHEN** 后续代理推进 `/callComponent/**`、floor、repair、fee/report 或 guarded writes
- **THEN** 必须能从 `tasks.md`、`design.md` 和 `agent-findings.md` 看出它们分别承接旧 Batch 1、Batch 2、Batch 3、Batch 4 和 Batch 5，而不是新造任务

#### Scenario: 继续 admin P1/P2/P3 工作

- **WHEN** 后续代理推进 admin list、CRUD、upload/R2、页面证据或 contract-manage 下一切片
- **THEN** 必须能看出它们承接旧 Batch 6、Batch 7 和后续 admin 退役证据 backlog

#### Scenario: 复原 Batch0 到 Batch8

- **WHEN** 后续代理需要把旧计划批次映射到 OpenSpec backlog
- **THEN** 必须按以下语义解释：Batch0 是 endpoint 矩阵与 P0 gate；Batch1 是 `/callComponent/**` 生产 fallback 清理；Batch2 是 floor legacy endpoint DB 化；Batch3 是 repair DB 接入；Batch4 是 fee DB 查询与报表只读；Batch5 是 fee guarded writes；Batch6 是 admin P1 业务域；Batch7 是 admin P2/P3 业务域；Batch8 是其它 app legacy 业务域

### Requirement: Batch7a 历史证据口径

旧计划中的 Batch7a MUST 保留为历史 admin 小片证据记录口径：它关注逐文件、逐命令、逐证据 artifact 的 local/runtime/contract evidence 汇总，而不是生产 DB_READY、真实库样本、shadow-off/fallback 完成或旧服务退役候选。后续引用 Batch7a 时必须指出它是 historical local/runtime/contract evidence，并重新采集当前缺失证据。

#### Scenario: 引用 Batch7a 逐文件记录

- **WHEN** 后续代理引用 Batch7a 中的 admin 文件、runtime manifest、contract test、HTTP gate 或 `.tmp/phase7-agent-reports/**` 证据
- **THEN** 必须记录 sourcePath、oldPath、appsApiTarget、命令、artifact path、适用 endpoint 和当前仍缺的 caller、production、DB/write、fallback/shadow-off 或 retirement evidence

#### Scenario: Batch7a 被误用为退役证据

- **WHEN** Batch7a 历史记录被写成 production `DB_READY`、真实库完成、shadow-off/fallback 完成或 delete-candidate
- **THEN** 必须降级为 historical local/runtime/contract evidence，并在 `agent-findings.md` 记录禁止误判

### Requirement: Batch0 fresh scan gate

Batch0 MUST 作为所有后续实施批次的前置 fresh scan gate。每个新批次开始前必须重新扫描 admin old API、admin caller、`apps/api` route/manifest、app legacy endpoints、app caller 和相关 evidence artifact；数量或路径变化时，先更新 OpenSpec canonical，再实施代码或状态升级。

#### Scenario: 新批次开始

- **WHEN** 主代理准备分派一个 admin 或 app legacy 实施批次
- **THEN** 必须先运行或记录同类 fresh scan，确认 sourcePath、oldPath、appsApiTarget、caller 和 evidence 缺口没有过期

#### Scenario: 扫描数量变化

- **WHEN** fresh scan 与 `agent-progress.md` 或旧历史口径不一致
- **THEN** 必须把历史数字标记为 dated snapshot，并在 `agent-findings.md` 写明新旧差异

### Requirement: 每批固定流程

每个 Phase7 批次必须执行固定流程：读取 OpenSpec 与 Memorix、核对当前 working tree、确认 endpoint 源与调用端、补实现或阻断原因、补 Vitest/contract/HTTP gate、采集 Chrome MCP 或明确 fallback、复核 DB readiness 与写入闭环边界、更新 `tasks.md`、`agent-progress.md`、`agent-findings.md` 和 Memorix。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 实现类批次完成

- **WHEN** 批次包含 `apps/api`、`apps/admin` 或 `apps/app` 运行时代码修改
- **THEN** 必须记录对应 Vitest、typecheck、HTTP gate 或页面证据；无法补测试时必须在 `agent-findings.md` 写明原因和剩余风险

#### Scenario: 只读调查批次完成

- **WHEN** 批次只做探索、审计或文档迁移
- **THEN** 必须至少记录来源文件、git 历史或 Memorix 查询线索、发现摘要、未承接项和 OpenSpec 落点，不得只给口头结论

### Requirement: Batch done definition

一个 Phase7 批次完成前 MUST 同时满足：矩阵/任务状态前后更新；代码或阻断原因落地；相关 Vitest、typecheck、contract/manifest、HTTP gate 或不可运行原因记录；有页面入口时补 Chrome MCP/页面 Network，无页面入口时补 HTTP/contract 并说明原因；shadow-off/fallback、DB_READY、真实库样本和写入口闭环按适用性记录；单一汇总或 OpenSpec progress 更新；独立复核完成；Memorix 写入完成。任一条件不满足时，只能记录 partial 或 blocked。

#### Scenario: 准备勾选批次任务

- **WHEN** 主代理准备把一个批次或 endpoint 任务从 `[ ]` 改成 `[x]`
- **THEN** 必须逐项核对 batch done definition，并把验证命令和证据路径写入 `agent-progress.md`

#### Scenario: 证据不适用

- **WHEN** 某类证据如页面 Network、写入回滚或 DB_READY 不适用于 endpoint
- **THEN** 必须写明不适用原因，不能空缺字段

### Requirement: 批次复核硬规则

复核 MUST 检查旧计划中的禁止误判项：不得越界修改无关文档；不得删除、移动、归档、重命名或清空旧服务目录；`READY_CONFIGURED` 不得冒充 `DB_READY`；app 已迁入数量不得冒充全部 DB 完成；fee readonly 和 guarded writes 必须分离；hook-level、本地 browser、production、DB/write 和 retirement evidence 必须分层；子代理反馈必须合并回 OpenSpec canonical。

#### Scenario: 发现越权状态升级

- **WHEN** 复核发现 local HTTP 200、hook test、legacy fallback 或历史证据被写成生产 DB_READY 或退役候选
- **THEN** 必须撤回该状态，记录到 `agent-findings.md`，并保持任务未完成或 blocked

### Requirement: 写入失败批次停止规则

任何写入批次在 guard、controlled write、read-back、rollback/cleanup、residual check 或 guard-after 任一步失败时 MUST 停止同批次后续写入，先清理残留并恢复 guard，再记录 blocked/unknown。不得在失败状态下继续执行其它写入口。

#### Scenario: guard 未恢复

- **WHEN** 写入演练后无法证明 guard 恢复
- **THEN** 本批次后续写入口全部暂停，并在 `agent-findings.md` 记录失败 endpoint、残留、清理结果和下一步

### Requirement: 业务路径颗粒度拆分

基于 admin 业务路径或 app legacy 模块拆分批次时，单个编辑子代理应只负责 2-3 个具体三级业务路径、一个小模块或一组紧密相关 endpoint；不得把无关业务域合并给同一个编辑子代理。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 拆分 admin list 端点

- **WHEN** 后续代理推进 `property-manage/contract-manage` 或其它 admin 领域
- **THEN** 必须按普通 list、upload/R2、CUD/detail、edge endpoint 分组，且普通 list 子代理不得夹带 upload 或写入口

#### Scenario: 拆分 app legacy 端点

- **WHEN** 后续代理推进 app legacy backlog
- **THEN** 必须按 `/callComponent/**`、floor、repair、fee/report、guarded write 或剩余 app module 小组拆分，不能一次性全量重写 app legacy

### Requirement: 复核子代理和独立验收

每个有实现或状态升级的批次都必须由独立复核子代理或主代理执行复核，复核内容包括需求覆盖、证据层级、no-go 约束、引用状态、测试结果和是否误把历史证据升级为当前完成。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 复核发现缺漏

- **WHEN** 复核发现 spec、tasks、证据字段、测试或 no-go 约束缺漏
- **THEN** 批次必须保持未完成，并由主代理安排补改或新编辑子代理继续处理

#### Scenario: 复核通过

- **WHEN** 复核确认批次符合 OpenSpec、测试和证据要求
- **THEN** 主代理才能更新 checkbox、进度记录和 Memorix；复核结论不得替代实际测试或浏览器证据

### Requirement: 单一汇总与任务源纪律

Phase7 批次报告必须进入 OpenSpec canonical 载体，默认使用 `agent-progress.md` 记录 do-long-task checkpoint、`agent-findings.md` 记录发现和来源风险、`tasks.md` 记录唯一可执行任务状态。长任务接力 MUST 依赖 `tasks.md` 唯一任务源 + `agent-progress.md` do-long-task checkpoint + `agent-findings.md` 风险记录，不能把聊天记录、临时报告或旧 Superpowers 文档恢复成并行任务源。除用户明确要求外，不得在其它位置建立新的长期任务清单或持续维护的来源覆盖矩阵。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 子代理生成临时报告

- **WHEN** 子代理为了协作在 `.tmp` 或临时目录生成报告
- **THEN** 主代理必须把仍有效的结论压缩迁入 OpenSpec canonical 工件；临时报告不得成为后续执行入口

#### Scenario: 出现第二任务树

- **WHEN** 某个文档开始维护与 `tasks.md` 平行的 checkbox 执行清单
- **THEN** 必须停止使用该清单作为任务源，并把有效任务合并回 `tasks.md`
