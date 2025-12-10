## ADDED Requirements

### Requirement: taskmaster test-data backlog mirrored in OpenSpec

项目 SHALL 在 OpenSpec 侧维护与 `.taskmaster/tasks/tasks.json` v1.1 对齐的 `test-data.ts` 重构 backlog，包含任务 ID、文件路径、状态与分组信息，并在执行时遵循 `.claude/agents/make-list-page.md` 对假数据的约束。

#### Scenario: mirror v1.1 backlog

- **GIVEN** `.taskmaster/tasks/tasks.json` 版本 1.1（2025-12-08）包含 98 条任务，其中 td-001~td-015 状态为 done，其余为 todo
- **WHEN** 生成变更 `sync-taskmaster-test-data-backlog`
- **THEN** `openspec/changes/sync-taskmaster-test-data-backlog/tasks.md` 按域分组列出相同的任务 ID、状态与路径，且总数、完成数与 taskmaster 数据一致。

#### Scenario: enforce make-list-page constraints during execution

- **GIVEN** `.claude/agents/make-list-page.md` 要求 `test-data.ts` 的 `tableData` 使用字面量数组、字段与列表/搜索一致，并将下拉选项集中在同一文件并使用 `OptionsType`
- **WHEN** backlog 中的任一任务被实施
- **THEN** 产出的 `test-data.ts` SHALL 满足上述约束，并在发现不符合时回填为新的工作项。

