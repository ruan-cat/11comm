# 技能组合矩阵统一

## ADDED Requirements

### Requirement: 技能组合矩阵必须统一

component-migration/SKILL.md 中的技能组合矩阵必须与 CLAUDE.md 第 4.3 节保持一致。

#### Scenario: 检查 component-migration 技能组合

- **WHEN** 查看 component-migration/SKILL.md 中的技能组合说明
- **THEN** 应包含完整的 6 个技能：code-migration + component-migration + style-migration + use-wd-form + api-migration + beautiful-component-design

### Requirement: check-trigger.md 技能名称必须统一

check-trigger.md 中的技能名称必须使用完整名称，不能使用简写。

#### Scenario: 检查 check-trigger.md 技能名称

- **WHEN** 打开 check-trigger.md 文件
- **THEN** 技能名称应为完整形式（如 beautiful-component-design，而非 beautiful）

### Requirement: check-trigger.md 分页功能必须包含 api-error-handling

check-trigger.md 中分页功能的技能组合必须包含 api-error-handling。

#### Scenario: 检查分页功能技能组合

- **WHEN** 查看 check-trigger.md 中分页功能的技能组合
- **THEN** 应包含 z-paging-integration + api-migration + api-error-handling

### Requirement: component-migration 必须包含 api-migration 协同说明

component-migration/SKILL.md 必须包含与 api-migration 协同使用的说明。

#### Scenario: 检查 component-migration 协同技能说明

- **WHEN** 查看 component-migration/SKILL.md
- **THEN** 应包含 api-migration 协同使用说明
