# 文档清洗规范 (Document Sanitation Specification)

## ADDED Requirements (新增需求)

### Requirement: Mark Legacy Specs as Deprecated (标记旧 Spec 为废弃)

系统必须将与 "Full Stack Type Transformation" 冲突的旧规范标记为废弃，以防止 Agent 困惑。

#### Scenario: Deprecate Static Type System Spec (废弃静态类型系统规范)

- **WHEN** 读取 `openspec/specs/type-system/spec.md` 时
- **THEN** 必须存在严格的头部警告，指向新的设计文档
- **AND** 文件绝不能被删除（为了历史保留）

#### Scenario: Deprecate Migration Spec (废弃迁移规范)

- **WHEN** 读取 `openspec/specs/business-type-migration/spec.md` 时
- **THEN** 头部警告必须指出 "Moving Interfaces" (移动接口) 仅在将它们转换为 Zod Schemas 时才有效

### Requirement: Clean Internal Reports (清理内部报告)

系统必须将包含冲突架构建议的内部报告标记为已过时。

#### Scenario: Mark Conflicting Assessment (标记冲突评估)

- **WHEN** 读取 `apps/admin/src/docs/reports/2026-02-05-full-stack-type-transformation-assessment.md` 时
- **THEN** 头部警告必须声明它已被 `2026-02-06` 版本和 `openspec` 设计所取代
