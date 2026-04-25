# check-trigger.md 技能触发机制

## ADDED Requirements

### Requirement: 技能名称简写必须统一

check-trigger.md 中的技能名称必须使用完整名称，不能使用简写。

#### Scenario: 检查技能名称简写

- **WHEN** 查看 check-trigger.md 文件
- **THEN** 所有技能名称应为完整形式：
  - beautiful-component-design（而非 beautiful）
  - component-migration（而非 component）
  - style-migration（而非 style）

### Requirement: 分页功能必须包含 api-error-handling

check-trigger.md 中分页功能的技能组合必须包含 api-error-handling。

#### Scenario: 检查分页功能技能组合

- **WHEN** 查看 check-trigger.md 中"需要分页功能"的技能组合
- **THEN** 应包含 z-paging-integration + api-migration + api-error-handling

### Requirement: component-migration 必须包含 api-migration 协同说明

check-trigger.md 中 component-migration 的协同技能说明必须包含 api-migration。

#### Scenario: 检查 component-migration 协同技能

- **WHEN** 查看 check-trigger.md 中 component-migration 相关说明
- **THEN** 应包含 api-migration 作为协同技能之一
