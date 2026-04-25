# claude-code-skills Specification

## Purpose

TBD - created by archiving change refactor-skills-directory-structure. Update Purpose after archive.

## Requirements

### Requirement: Skills 目录结构规范

每个 Claude Code Skill 必须（SHALL）遵循 agentskills.io 标准目录结构：

```plain
skill-name/
├── SKILL.md          # Required: 技能主文件（指令 + 元数据）
├── scripts/          # Optional: 可执行脚本
├── references/       # Optional: 参考文档
└── assets/           # Optional: 模板、资源文件
```

#### Scenario: 新建技能时遵循标准结构

- **WHEN** 创建新的 Claude Code Skill
- **THEN** 必须创建 `SKILL.md` 作为技能入口文件
- **AND** 如有参考文档，必须放入 `references/` 目录
- **AND** 如有代码示例，必须放入 `assets/` 或 `examples/` 目录

#### Scenario: 检查现有技能结构合规性

- **WHEN** 审查现有技能目录结构
- **THEN** 所有非 SKILL.md 的 markdown 文档必须位于 `references/` 目录
- **AND** 不允许散落的参考文档存在于技能根目录

### Requirement: SKILL.md 文件引用规范

SKILL.md 中引用参考文档时，必须（SHALL）使用相对于技能根目录的路径。

#### Scenario: 引用 references 目录中的文档

- **WHEN** SKILL.md 需要引用参考文档
- **THEN** 使用 `./references/xxx.md` 格式的相对路径
- **AND** 不使用绝对路径或 `../` 跨目录引用

### Requirement: 空技能目录清理

不包含 SKILL.md 文件的技能目录必须（SHALL）被删除或补全。

#### Scenario: 发现空技能目录

- **WHEN** 技能目录不包含 SKILL.md 文件
- **THEN** 要么删除该空目录
- **OR** 创建有效的 SKILL.md 文件
