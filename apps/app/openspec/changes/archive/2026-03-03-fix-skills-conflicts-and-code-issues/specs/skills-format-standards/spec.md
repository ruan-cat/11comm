# 技能文件格式标准化

## ADDED Requirements

### Requirement: 技能文件表格必须居中对齐

所有技能文件（.claude/skills/\*.md）中的表格必须按照 CLAUDE.md 第 5.1 节规定使用居中对齐格式。

#### Scenario: 检查 component-migration/SKILL.md 表格对齐

- **WHEN** 打开 component-migration/SKILL.md 文件
- **THEN** 所有表格都应使用居中对齐格式

#### Scenario: 检查 style-migration/SKILL.md 表格对齐

- **WHEN** 打开 style-migration/SKILL.md 文件
- **THEN** 所有表格都应使用居中对齐格式

#### Scenario: 检查 route-migration/SKILL.md 表格对齐

- **WHEN** 打开 route-migration/SKILL.md 文件
- **THEN** 所有表格都应使用居中对齐格式

#### Scenario: 检查 api-migration/SKILL.md 表格对齐

- **WHEN** 打开 api-migration/SKILL.md 文件
- **THEN** 所有表格都应使用居中对齐格式

### Requirement: 技能文件 Vue 代码块必须使用 template 标签包裹

所有技能文件中的 Vue 代码块必须按照 CLAUDE.md 第 5.2 节规定使用 `<template>` 标签包裹。

#### Scenario: 检查 component-migration/SKILL.md Vue 代码块

- **WHEN** 打开 component-migration/SKILL.md 文件
- **THEN** 所有 Vue 代码块都应使用 `<template>` 标签包裹

#### Scenario: 检查 use-wd-form/SKILL.md Vue 代码块

- **WHEN** 打开 use-wd-form/SKILL.md 文件
- **THEN** 所有 Vue 代码块都应使用 `<template>` 标签包裹

#### Scenario: 检查 beautiful-component-design/SKILL.md Vue 代码块

- **WHEN** 打开 beautiful-component-design/SKILL.md 文件
- **THEN** 所有 Vue 代码块都应使用 `<template>` 标签包裹

### Requirement: markdown 多级标题必须主动提供序号

所有技能文件的二级标题、三级标题和四级标题都必须主动添加数字序号。

#### Scenario: 检查技能文件标题序号

- **WHEN** 打开任意技能文件
- **THEN** 所有二级、三级、四级标题都应包含数字序号
