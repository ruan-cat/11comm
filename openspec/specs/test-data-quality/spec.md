# test-data-quality Specification

## Purpose
TBD - created by archiving change refactor-test-data-literal-array. Update Purpose after archive.
## Requirements
### Requirement: test-data uses literal arrays aligned to list pages

List page mock data files (`test-data.ts`) SHALL define `tableData` as literal arrays (no generator functions), with fields matching the associated table/search configurations. Dropdown options SHALL be exported from the same file using `OptionsType`, and datasets SHALL include sufficient rows to exercise pagination (e.g., 35 rows) per `.claude/agents/make-list-page.md`.

#### Scenario: render list page with compliant mock data

- **GIVEN** a list 页使用 make-list-page 模板
- **WHEN** 在 `test-data.ts` 提供列表与搜索所需的 mock 数据
- **THEN** `tableData` 为字面量数组且字段与表格/搜索配置一致；下拉选项使用 `OptionsType` 并从同一文件导出；数据量覆盖典型分页演示。

