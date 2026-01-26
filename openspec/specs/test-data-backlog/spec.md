# test-data-backlog Specification

## Purpose

TBD - created by archiving change sync-taskmaster-test-data-backlog. Update Purpose after archive.

## Requirements

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

### Requirement: test-data uses literal arrays aligned to list pages

List page mock data files (`test-data.ts`) SHALL define `tableData` as literal arrays (no generator functions), with fields matching the associated table/search configurations. Dropdown options SHALL be exported from the same file using `OptionsType`, and datasets SHALL include sufficient rows to exercise pagination（例如 35 条） per `.claude/agents/make-list-page.md`.

#### Scenario: render list page with compliant mock data

- **GIVEN** 列表页使用 make-list-page 模板
- **WHEN** 在 `test-data.ts` 提供列表与搜索所需的 mock 数据
- **THEN** `tableData` 为字面量数组且字段与表格/搜索配置一致；下拉选项使用 `OptionsType` 并从同一文件导出；数据量覆盖典型分页演示。
