## ADDED Requirements

### Requirement: Neon Postgres 技能中文翻译

系统 SHALL 提供 `neon-postgres` 技能的完整中文翻译版本，存放于 `.agents/skills/neon-postgres-zh/` 目录，包含与原始英文版完全相同的目录结构和文件数量。

#### Scenario: 目录结构一致性

- **GIVEN** 原始英文技能目录 `.agents/skills/neon-postgres/` 包含 29 个 Markdown 文件
- **WHEN** 中文翻译完成后
- **THEN** `.agents/skills/neon-postgres-zh/` 目录 SHALL 包含相同数量（29 个）的 Markdown 文件
- **AND** 目录层级结构 SHALL 与原始目录完全一致

#### Scenario: SKILL.md 格式保留

- **GIVEN** 原始 `SKILL.md` 包含 YAML frontmatter（`name` 和 `description` 字段）
- **WHEN** 翻译 `SKILL.md` 文件时
- **THEN** 翻译后的文件 SHALL 保留 YAML frontmatter 结构
- **AND** `name` 字段值 SHALL 修改为 `neon-postgres-zh`
- **AND** `description` 字段 SHALL 翻译为简体中文

#### Scenario: 代码块不翻译

- **GIVEN** 原始文件包含代码块（bash、typescript、sql 等）
- **WHEN** 翻译文件内容时
- **THEN** 代码块内的所有内容 SHALL 保持原样不翻译
- **AND** 代码块的语言标识 SHALL 保持不变

#### Scenario: 表格格式保留

- **GIVEN** 原始文件包含 Markdown 表格
- **WHEN** 翻译表格内容时
- **THEN** 表格结构 SHALL 保持不变
- **AND** 表格的居中对齐格式 SHALL 保留
- **AND** 仅翻译表格中的文字说明列

#### Scenario: URL 和路径不翻译

- **GIVEN** 原始文件包含 URL 链接和文件路径
- **WHEN** 翻译文件内容时
- **THEN** 所有 URL 链接 SHALL 保持原样不翻译
- **AND** 所有文件路径引用 SHALL 保持原样不翻译
- **AND** 包名（如 `@neondatabase/auth`）SHALL 保持原样不翻译
