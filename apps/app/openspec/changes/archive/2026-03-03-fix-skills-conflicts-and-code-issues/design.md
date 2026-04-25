## Context

本项目是一站式智慧社区物业管理系统，采用 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 技术栈开发。项目维护了一套完整的技能文件（skills）来指导开发者进行代码迁移和组件使用。

根据技能冲突分析报告，项目存在以下主要问题：

1. **技能组合矩阵不一致**：CLAUDE.md 规定表单迁移需要 6 个技能协同，但 component-migration 只推荐 3 个技能
2. **技能文件格式不符合规范**：多个技能文件的表格未居中对齐、Vue 代码块未使用 `<template>` 标签包裹
3. **代码实现与规范偏差**：部分代码违规使用 wd-radio-group、useRequest 写法不规范、TypedRouter 未正确使用

## Goals / Non-Goals

### Goals

1. 统一技能文件之间的技能组合矩阵描述
2. 修复所有技能文件的格式问题（表格对齐、Vue 代码块格式）
3. 修复代码实现中的违规问题（wd-radio-group、useRequest、TypedRouter、FormSectionTitle）
4. 修正技能文档中的错误说明（wd-cell #value 插槽）

### Non-Goals

1. 不修改技能文件的核心业务逻辑和指导内容
2. 不添加新的技能或能力
3. 不重构现有代码的业务逻辑

## Decisions

### Decision 1: 技能组合矩阵统一方案

**选择**: 以 CLAUDE.md 第 4.3 节为标准，统一所有技能文件的技能组合说明

**理由**:

- CLAUDE.md 是项目的全局指导文件，具有最高优先级
- component-migration 的推荐组合不完整，可能导致开发者遗漏关键技能

### Decision 2: 技能文件格式修复方案

**选择**: 逐文件检查并修复，使用自动化工具辅助验证

**理由**:

- 手动修复可以确保格式完全符合项目规范
- 需要精确处理每个文件的格式问题

### Decision 3: 代码实现修复优先级

**选择**: 按照报告中的优先级顺序修复

**理由**:

- P1 级别问题影响开发效率，需要优先修复
- 代码修复需要确保功能正确性，优先级排序可以确保重点问题先解决

## Risks / Trade-offs

### Risk 1: 技能文件修改可能影响现有开发流程

**影响**: 技能文件的修改可能与现有开发习惯冲突

**缓解措施**:

- 修改前先在团队内沟通确认
- 保留修改历史，便于回滚

### Risk 2: 代码修复可能引入新的 bug

**影响**: 修改现有代码可能破坏现有功能

**缓解措施**:

- 每个文件修改后进行简单的功能验证
- 遵循最小修改原则，不改变业务逻辑

### Risk 3: 部分文件修复后可能遗漏验证

**影响**: 人工检查可能存在遗漏

**缓解措施**:

- 使用检查代理进行系统性复核
- 提供检查清单，逐项验证

## Migration Plan

### Phase 1: 技能文件修复

1. 修复 component-migration/SKILL.md（技能组合、表格格式、Vue 代码块）
2. 修复 style-migration/SKILL.md（表格格式）
3. 修复 route-migration/SKILL.md（表格格式）
4. 修复 api-migration/SKILL.md（表格格式）
5. 修复 use-wd-form/SKILL.md（Vue 代码块格式）
6. 修复 beautiful-component-design/SKILL.md（Vue 代码块格式、wd-cell 说明）
7. 修复 check-trigger.md（技能名称简写、分页功能）

### Phase 2: 代码实现修复

1. 修复 wd-radio-group 违规使用（1 个文件）
2. 修复 useRequest 写法（1 个文件）
3. 修复 TypedRouter 使用（5 个文件）
4. 修复 FormSectionTitle 使用（2 个文件）

### Phase 3: 验证与归档

1. 检查代理进行系统性复核
2. OpenSpec 归档

## Open Questions

1. 是否需要为技能文件修改添加版本管理？
2. 代码修复完成后是否需要运行完整的集成测试？
