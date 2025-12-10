# Change: Refactor test-data literal arrays

## 1. 背景

- 来源于 `.taskmaster/tasks/tasks.json` 的 98 条列表页任务，当前仅有少量标记完成。
- 目标是将列表页 `test-data.ts` 的改造需求迁移到 OpenSpec 体系，便于用 `proposal/tasks/spec` 统一跟踪。

## 2. 目标

- 将 taskmaster 列表页改造任务转换为 OpenSpec 变更，提供明确的执行清单。
- 确保所有 `test-data.ts` 满足 `.claude/agents/make-list-page.md` 要求：`tableData` 使用字面量数组（禁止函数生成），字段与 `index.vue` 列表/搜索保持一致，选项数据集中在 `test-data.ts` 内。

## 3. 影响

- 代码：`apps/admin/src/pages/**/test-data.ts`（详见任务清单）。
- 文档：依赖 `.claude/agents/make-list-page.md` 的测试数据约束。
