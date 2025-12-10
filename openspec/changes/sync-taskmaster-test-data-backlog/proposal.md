# Change: Sync taskmaster test-data backlog

## 1. 背景

- `.taskmaster/tasks/tasks.json` v1.1（2025-12-08）收敛了 98 条围绕 `test-data.ts` 的重构任务，要求 `tableData` 为字面量数组、字段与列表/搜索配置对齐、下拉选项集中在 `test-data.ts` 并使用 `OptionsType` 约束。
- 现有 OpenSpec 仅有单一变更 `refactor-test-data-literal-array`，但需要一个独立、可校验的变更来映射 taskmaster 清单，便于后续迭代和状态同步。
- 需要在 OpenSpec 侧补全提案、任务清单与规范增量，确保列表页假数据改造按照 `.claude/agents/make-list-page.md` 的约束执行。

## 2. 目标

- 将 `.taskmaster/tasks/tasks.json` v1.1 的 98 条任务完整迁移到 OpenSpec 变更中，保持 ID、路径、状态与分组一致。
- 提供规范增量，要求 backlog 与 taskmaster 保持一致，并在执行时满足 `test-data.ts` 的字面量数组与选项集中存放的约束。
- 形成可验证的任务清单，后续可直接用于实施与追踪。

## 3. 影响

- 文档：新增 `openspec/changes/sync-taskmaster-test-data-backlog` 下的提案、任务与规范增量。
- 代码范围：不直接改动代码，但列举的 `apps/admin/src/pages/**/test-data.ts` 将在后续实施阶段受影响。
- 流程：OpenSpec backlog 与 taskmaster 清单保持一一对应，避免信息分叉。

## 4. 验收标准

- `tasks.md` 罗列 98 条任务，状态与 `.taskmaster/tasks/tasks.json` v1.1 保持一致，分组按域归类。
- `specs/test-data-backlog/spec.md` 增加 backlog 对齐与 `test-data.ts` 生成约束的需求与场景。
- `openspec validate sync-taskmaster-test-data-backlog --strict` 通过且无格式/解析错误。

