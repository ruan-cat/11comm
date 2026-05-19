## ADDED Requirements

### Requirement: Agent Team 批次执行模型

Phase7 后续执行必须继承旧批量计划中的 Agent Team 模型：主代理负责读取 OpenSpec 全量要求、拆分任务、收集子代理报告、整合 `tasks.md` 与验收结论；探索子代理、编辑子代理和复核子代理分别承担只读调查、受控改动和独立复核。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 启动一个新批次

- **WHEN** 后续代理准备推进一个 Phase7 批次或切片
- **THEN** 必须先明确主代理、探索子代理、编辑子代理和复核子代理的职责边界，并把子代理输出汇总到 `agent-progress.md` 或 `agent-findings.md`

#### Scenario: 子代理输出未被整合

- **WHEN** 子代理只在对话中返回发现但没有进入 OpenSpec 进度、发现或任务状态
- **THEN** 该批次不得标记完成，直到主代理把有效事实整合到 canonical OpenSpec 工件

### Requirement: 批次 0-8 调度语义保留

旧计划中的 batch 0-8 不是可丢弃的历史标题；OpenSpec 必须保留它们对应的推进语义，并把它们映射到当前长期 backlog。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 继续 P0/P1 app legacy 工作

- **WHEN** 后续代理推进 `/callComponent/**`、floor、repair、fee/report 或 guarded writes
- **THEN** 必须能从 `tasks.md`、`design.md` 和 `agent-findings.md` 看出它们分别承接旧 Batch 1、Batch 2、Batch 3、Batch 4 和 Batch 5，而不是新造任务

#### Scenario: 继续 admin P1/P2/P3 工作

- **WHEN** 后续代理推进 admin list、CRUD、upload/R2、页面证据或 contract-manage 下一切片
- **THEN** 必须能看出它们承接旧 Batch 6、Batch 7 和后续 admin 退役证据 backlog

### Requirement: 每批固定流程

每个 Phase7 批次必须执行固定流程：读取 OpenSpec 与 Memorix、核对当前 working tree、确认 endpoint 源与调用端、补实现或阻断原因、补 Vitest/contract/HTTP gate、采集 Chrome MCP 或明确 fallback、复核 DB readiness 与写入闭环边界、更新 `tasks.md`、`agent-progress.md`、`agent-findings.md` 和 Memorix。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 实现类批次完成

- **WHEN** 批次包含 `apps/api`、`apps/admin` 或 `apps/app` 运行时代码修改
- **THEN** 必须记录对应 Vitest、typecheck、HTTP gate 或页面证据；无法补测试时必须在 `agent-findings.md` 写明原因和剩余风险

#### Scenario: 只读调查批次完成

- **WHEN** 批次只做探索、审计或文档迁移
- **THEN** 必须至少记录来源文件、git 历史或 Memorix 查询线索、发现摘要、未承接项和 OpenSpec 落点，不得只给口头结论

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

Phase7 批次报告必须进入 OpenSpec canonical 载体，默认使用 `agent-progress.md` 记录 checkpoint、`agent-findings.md` 记录发现和来源风险、`tasks.md` 记录唯一可执行任务状态。除用户明确要求外，不得在其它位置建立新的长期任务清单或持续维护的来源覆盖矩阵。 本 requirement MUST 作为后续执行、批次验收和退役评审的强制约束。

#### Scenario: 子代理生成临时报告

- **WHEN** 子代理为了协作在 `.tmp` 或临时目录生成报告
- **THEN** 主代理必须把仍有效的结论压缩迁入 OpenSpec canonical 工件；临时报告不得成为后续执行入口

#### Scenario: 出现第二任务树

- **WHEN** 某个文档开始维护与 `tasks.md` 平行的 checkbox 执行清单
- **THEN** 必须停止使用该清单作为任务源，并把有效任务合并回 `tasks.md`
