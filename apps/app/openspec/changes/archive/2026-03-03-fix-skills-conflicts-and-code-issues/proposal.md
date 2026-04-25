## Why

项目技能文件与实际代码实现存在严重冲突和不一致问题，导致开发者可能遗漏关键技能、遵循错误规范。主要问题包括：技能组合矩阵不一致（CLAUDE.md 规定 6 个技能协同，但 component-migration 只推荐 3 个）、多个技能文件格式不符合项目规范（表格未居中对齐、Vue 代码块未使用 `<template>` 包裹）、代码实现与技能规范偏差（违规使用 wd-radio-group、useRequest 写法不规范、TypedRouter 未正确使用）。这些问题严重影响开发效率和代码质量，亟需系统性修复。

## What Changes

### 技能文件修复

1. **统一技能组合矩阵**
   - 修改 `component-migration/SKILL.md` 第 18-26 行，与 `CLAUDE.md` 第 4.3 节保持一致
   - 确保表单迁移包含 6 个技能：code-migration + component-migration + style-migration + use-wd-form + api-migration + beautiful-component-design

2. **修复表格格式不符合规范**
   - 修改 `component-migration/SKILL.md` 表格为居中对齐
   - 修改 `style-migration/SKILL.md` 表格为居中对齐
   - 修改 `route-migration/SKILL.md` 表格为居中对齐
   - 修改 `api-migration/SKILL.md` 表格为居中对齐

3. **修复 Vue 代码块格式不规范**
   - 修改 `component-migration/SKILL.md` 所有 Vue 代码块添加 `<template>` 标签包裹
   - 修改 `use-wd-form/SKILL.md` 第 53-80 行、第 178-192 行等处 Vue 代码块
   - 修改 `beautiful-component-design/SKILL.md` 第 54-65 行等处 Vue 代码块

4. **修正 wd-cell #value 插槽说明**
   - 修改 `beautiful-component-design/SKILL.md` 第 143-171 行
   - 明确说明 wd-cell 有 #value 插槽，但禁止嵌套 wd-picker

5. **修复 check-trigger.md 技能触发机制**
   - 统一技能名称简写（beautiful → beautiful-component-design）
   - 分页功能添加 api-error-handling
   - component-migration 添加 api-migration 协同说明

### 代码实现修复

6. **修复 wd-radio-group 违规使用**
   - 修改 `src/pages-sub/work/do-copy-work.vue` 第 154、177 行
   - 将 wd-radio-group 替换为 wd-picker

7. **修复 useRequest 组合式解构写法**
   - 修改 `src/pages-sub/property/apply-room.vue` 第 35-62、65-124 行
   - 改为链式回调写法：`.onSuccess()` + `.onError()`

8. **修复 TypedRouter 未正确使用**
   - 批量替换 `src/pages-sub/complaint/` 目录下的文件
   - 将 uni.navigateTo/redirectTo/reLaunch/switchTab 替换为 TypedRouter

9. **修复 FormSectionTitle 违规使用**
   - 修改 `src/pages/test-use/repair-list-item.vue` 第 50、64 行
   - 修改 `src/examples/property-application-example.vue` 第 344、366、393、403、413、423 行
   - 将 `<view class="section-title">` 和 `<text class="section-title">` 替换为 FormSectionTitle 组件

## Capabilities

### New Capabilities

- `skills-format-standards`: 技能文件格式标准化 - 统一表格对齐方式和 Vue 代码块格式
- `skills-matrix-unification`: 技能组合矩阵统一 - 修复技能触发矩阵不一致问题
- `code-implementation-correction`: 代码实现纠错 - 修复违规使用的组件和 API 调用方式

### Modified Capabilities

- `check-trigger-mechanism`: check-trigger.md 技能触发机制 - 修复技能名称简写和遗漏问题

## Impact

### 受影响文件

**技能文件（需修复）：**

- `.claude/skills/component-migration/SKILL.md`
- `.claude/skills/style-migration/SKILL.md`
- `.claude/skills/route-migration/SKILL.md`
- `.claude/skills/api-migration/SKILL.md`
- `.claude/skills/use-wd-form/SKILL.md`
- `.claude/skills/beautiful-component-design/SKILL.md`
- `.claude/skills/check-trigger.md`

**代码文件（需修复）：**

- `src/pages-sub/work/do-copy-work.vue`
- `src/pages-sub/property/apply-room.vue`
- `src/pages-sub/complaint/order.vue`
- `src/pages-sub/complaint/detail.vue`
- `src/pages-sub/complaint/finish.vue`
- `src/pages-sub/complaint/list.vue`
- `src/pages-sub/property/apply-room-detail.vue`
- `src/pages/test-use/repair-list-item.vue`
- `src/examples/property-application-example.vue`

### 风险评估

- **低风险**：技能文件修改仅影响文档格式，不影响运行时行为
- **中风险**：代码实现修复需确保功能正确性，建议修复后进行简单测试
