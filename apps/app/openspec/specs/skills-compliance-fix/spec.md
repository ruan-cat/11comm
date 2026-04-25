# skills-compliance-fix Specification

## Purpose

TBD - created by archiving change complete-vue2-to-vue3-migration. Update Purpose after archive.

## Requirements

### Requirement: 系统必须修复所有 api-error-handling 合规性问题

系统 SHALL 修复已迁移页面中缺少 onError 回调的问题，确保所有 API 调用都有错误处理。

#### Scenario: 为 inspection 模块添加 onError 回调

- **WHEN** 系统检查 inspection 模块的 8 个文件
- **THEN** 系统 SHALL 为每个 useRequest 调用添加 onError 回调
- **THEN** onError 回调 SHALL 使用 uni.showToast 显示错误信息
- **THEN** 错误信息 SHALL 包含具体的错误描述

#### Scenario: 验证 onError 回调的正确性

- **WHEN** 系统添加 onError 回调后
- **THEN** 系统 SHALL 使用 Grep 工具搜索 "onError" 关键词
- **THEN** 系统 SHALL 验证每个 useRequest 都有对应的 onError
- **THEN** 系统 SHALL 验证 onError 回调的实现符合 api-error-handling 技能规范

### Requirement: 系统必须修复所有 z-paging 合规性问题

系统 SHALL 将手动分页的列表页改为使用 z-paging 组件，确保分页功能符合项目规范。

#### Scenario: 修复 complaint 模块的分页问题

- **WHEN** 系统检查 complaint/list.vue 和 complaint/finish.vue
- **THEN** 系统 SHALL 移除手动分页逻辑
- **THEN** 系统 SHALL 添加 z-paging 组件
- **THEN** 系统 SHALL 使用 useRequest 的回调钩子模式集成 z-paging
- **THEN** 系统 SHALL 添加 onError 回调处理错误

#### Scenario: 修复 property 模块的分页问题

- **WHEN** 系统检查 property/apply-room.vue 和 property/apply-room-record.vue
- **THEN** 系统 SHALL 移除手动分页逻辑
- **THEN** 系统 SHALL 添加 z-paging 组件
- **THEN** 系统 SHALL 使用 useRequest 的回调钩子模式集成 z-paging
- **THEN** 系统 SHALL 添加 onError 回调处理错误

#### Scenario: 修复 activity 模块的分页问题

- **WHEN** 系统检查 activity/index.vue
- **THEN** 系统 SHALL 移除手动分页逻辑
- **THEN** 系统 SHALL 添加 z-paging 组件
- **THEN** 系统 SHALL 使用 useRequest 的回调钩子模式集成 z-paging
- **THEN** 系统 SHALL 添加 onError 回调处理错误

### Requirement: 系统必须修复所有 use-wd-form 合规性问题

系统 SHALL 将未使用 wd-form 组件的表单页改为使用 wd-form，确保表单功能符合项目规范。

#### Scenario: 修复 repair 模块的表单问题

- **WHEN** 系统检查 repair/appraise-reply.vue
- **THEN** 系统 SHALL 添加 `<wd-form>` 组件包裹表单
- **THEN** 系统 SHALL 添加表单验证规则
- **THEN** 系统 SHALL 使用 wd-form 的 ref 进行表单提交前验证
- **THEN** 系统 SHALL 添加 FormSectionTitle 组件（如果需要分区）

#### Scenario: 修复 complaint 模块的表单问题

- **WHEN** 系统检查 complaint 模块的 4 个表单文件
- **THEN** 系统 SHALL 为每个文件添加 `<wd-form>` 组件
- **THEN** 系统 SHALL 添加表单验证规则
- **THEN** 系统 SHALL 使用 wd-form 的 ref 进行表单提交前验证
- **THEN** 系统 SHALL 添加 FormSectionTitle 组件（如果需要分区）

#### Scenario: 验证 wd-form 的正确使用

- **WHEN** 系统修复表单问题后
- **THEN** 系统 SHALL 使用 Grep 工具搜索 "<wd-form" 关键词
- **THEN** 系统 SHALL 验证每个表单页都使用了 wd-form 组件
- **THEN** 系统 SHALL 验证 wd-form 的使用符合 use-wd-form 技能规范

### Requirement: 系统必须使用多重搜索策略避免遗漏

系统 SHALL 使用至少 2 种以上的搜索方法进行交叉验证，确保不遗漏任何合规性问题。

#### Scenario: 使用正则表达式搜索

- **WHEN** 系统搜索特定代码模式
- **THEN** 系统 SHALL 使用 Grep 工具的正则表达式功能
- **THEN** 系统 SHALL 记录搜索结果
- **THEN** 系统 SHALL 与其他搜索方法的结果进行交叉验证

#### Scenario: 使用宽泛关键词搜索

- **WHEN** 正则表达式搜索可能遗漏结果
- **THEN** 系统 SHALL 使用宽泛的关键词进行搜索
- **THEN** 系统 SHALL 手动筛选搜索结果
- **THEN** 系统 SHALL 与正则表达式搜索结果进行对比

#### Scenario: 列出所有相关文件逐个检查

- **WHEN** 搜索方法可能不可靠
- **THEN** 系统 SHALL 使用 Glob 工具列出所有相关文件
- **THEN** 系统 SHALL 逐个文件阅读关键部分
- **THEN** 系统 SHALL 确保不遗漏任何文件

### Requirement: 系统必须生成合规性修复报告

系统 SHALL 在修复完成后生成详细的合规性修复报告，记录所有修复内容。

#### Scenario: 记录修复的文件和问题

- **WHEN** 系统完成合规性修复
- **THEN** 系统 SHALL 生成报告列出所有修复的文件
- **THEN** 报告 SHALL 包含每个文件修复的具体问题
- **THEN** 报告 SHALL 包含修复前后的对比

#### Scenario: 验证修复的完整性

- **WHEN** 系统生成修复报告
- **THEN** 报告 SHALL 包含修复前的问题统计（20 个问题）
- **THEN** 报告 SHALL 包含修复后的合规性检查结果
- **THEN** 报告 SHALL 确认合规性通过率达到 100%

### Requirement: 系统必须在修复后进行全面验证

系统 SHALL 在修复完成后对所有文件进行全面的合规性验证，确保没有遗漏。

#### Scenario: 验证 api-error-handling 修复

- **WHEN** 系统完成 api-error-handling 修复
- **THEN** 系统 SHALL 搜索所有 useRequest 调用
- **THEN** 系统 SHALL 验证每个调用都有 onError 回调
- **THEN** 系统 SHALL 验证 onError 回调的实现正确

#### Scenario: 验证 z-paging 修复

- **WHEN** 系统完成 z-paging 修复
- **THEN** 系统 SHALL 搜索所有列表页面
- **THEN** 系统 SHALL 验证每个列表页都使用了 z-paging 组件
- **THEN** 系统 SHALL 验证 z-paging 与 useRequest 的集成正确

#### Scenario: 验证 use-wd-form 修复

- **WHEN** 系统完成 use-wd-form 修复
- **THEN** 系统 SHALL 搜索所有表单页面
- **THEN** 系统 SHALL 验证每个表单页都使用了 wd-form 组件
- **THEN** 系统 SHALL 验证 wd-form 的使用符合规范
