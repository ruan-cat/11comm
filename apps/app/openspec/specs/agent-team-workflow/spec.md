# agent-team-workflow Specification

## Purpose

TBD - created by archiving change complete-vue2-to-vue3-migration. Update Purpose after archive.

## Requirements

### Requirement: 系统必须为每个文件迁移创建独立的子代理团队

系统 SHALL 为每个文件的迁移创建独立的 Agent Team，包含技能指导子代理、代码迁移子代理、审核子代理三个成员。

#### Scenario: 创建子代理团队

- **WHEN** 系统开始迁移一个文件
- **THEN** 系统 SHALL 使用 TeamCreate 工具创建新的 Agent Team
- **THEN** 团队名称 SHALL 包含文件路径信息（如 "migration-resource-request-vue"）
- **THEN** 系统 SHALL 创建 3 个子代理成员

#### Scenario: 分配子代理角色

- **WHEN** 系统创建子代理团队
- **THEN** 系统 SHALL 创建"技能指导子代理"（agent_type: "general-purpose"）
- **THEN** 系统 SHALL 创建"代码迁移子代理"（agent_type: "general-purpose"）
- **THEN** 系统 SHALL 创建"审核子代理"（agent_type: "general-purpose"）

### Requirement: 技能指导子代理必须学习所有 Skills 文档

技能指导子代理 SHALL 完整阅读所有相关的 Skills 文档，确保理解全部的代码编写规范。

#### Scenario: 阅读核心迁移技能

- **WHEN** 技能指导子代理启动
- **THEN** 子代理 SHALL 阅读 code-migration 技能文档
- **THEN** 子代理 SHALL 阅读 component-migration 技能文档
- **THEN** 子代理 SHALL 阅读 style-migration 技能文档
- **THEN** 子代理 SHALL 阅读 api-migration 技能文档
- **THEN** 子代理 SHALL 阅读 route-migration 技能文档

#### Scenario: 阅读合规性技能

- **WHEN** 技能指导子代理阅读核心技能后
- **THEN** 子代理 SHALL 阅读 use-wd-form 技能文档
- **THEN** 子代理 SHALL 阅读 z-paging-integration 技能文档
- **THEN** 子代理 SHALL 阅读 api-error-handling 技能文档
- **THEN** 子代理 SHALL 阅读 beautiful-component-design 技能文档
- **THEN** 子代理 SHALL 阅读 use-uniapp-dynamic-page-title 技能文档

#### Scenario: 生成技能指导文档

- **WHEN** 技能指导子代理完成所有技能文档的阅读
- **THEN** 子代理 SHALL 生成针对当前文件的技能指导文档
- **THEN** 指导文档 SHALL 包含该文件需要应用的所有技能
- **THEN** 指导文档 SHALL 包含每个技能的关键要点和注意事项

### Requirement: 代码迁移子代理必须按照技能指导完成迁移

代码迁移子代理 SHALL 根据技能指导子代理的指导和具体的任务清单，完成文件的迁移或新建。

#### Scenario: 接收任务和指导

- **WHEN** 代码迁移子代理启动
- **THEN** 子代理 SHALL 接收具体的任务清单
- **THEN** 子代理 SHALL 接收技能指导子代理的指导文档
- **THEN** 子代理 SHALL 确认理解所有要求

#### Scenario: 执行代码迁移

- **WHEN** 代码迁移子代理开始工作
- **THEN** 子代理 SHALL 按照技能指导逐步执行迁移
- **THEN** 子代理 SHALL 严格遵循每个技能的规范
- **THEN** 子代理 SHALL 记录迁移过程中的关键决策

#### Scenario: 处理迁移中的问题

- **WHEN** 代码迁移子代理遇到不确定的情况
- **THEN** 子代理 SHALL 使用 SendMessage 工具向技能指导子代理询问
- **THEN** 子代理 SHALL 等待技能指导子代理的回复
- **THEN** 子代理 SHALL 根据回复继续迁移工作

### Requirement: 审核子代理必须验证迁移结果的合规性

审核子代理 SHALL 根据技能指导子代理的指导和代码迁移子代理的结果，验证迁移是否符合所有 Skills 规范。

#### Scenario: 接收审核任务

- **WHEN** 代码迁移子代理完成迁移
- **THEN** 审核子代理 SHALL 接收迁移结果
- **THEN** 审核子代理 SHALL 接收技能指导文档
- **THEN** 审核子代理 SHALL 接收原始任务清单

#### Scenario: 执行合规性检查

- **WHEN** 审核子代理开始审核
- **THEN** 子代理 SHALL 逐项检查技能指导文档中的要求
- **THEN** 子代理 SHALL 使用 Grep 工具搜索关键代码模式
- **THEN** 子代理 SHALL 使用 Read 工具阅读关键代码段
- **THEN** 子代理 SHALL 记录所有发现的问题

#### Scenario: 审核通过

- **WHEN** 审核子代理完成检查且未发现问题
- **THEN** 子代理 SHALL 使用 SendMessage 工具通知团队审核通过
- **THEN** 子代理 SHALL 生成审核报告
- **THEN** 审核报告 SHALL 包含所有检查项和结果

#### Scenario: 审核不通过

- **WHEN** 审核子代理发现问题
- **THEN** 子代理 SHALL 使用 SendMessage 工具通知代码迁移子代理
- **THEN** 消息 SHALL 包含所有发现的问题和修复建议
- **THEN** 子代理 SHALL 等待代码迁移子代理修复后重新审核

### Requirement: 子代理之间必须通过消息进行协作

子代理 SHALL 使用 SendMessage 工具进行通信，确保协作流程清晰可追溯。

#### Scenario: 技能指导子代理发送指导

- **WHEN** 技能指导子代理完成技能文档阅读
- **THEN** 子代理 SHALL 使用 SendMessage 工具发送指导文档给代码迁移子代理
- **THEN** 消息类型 SHALL 为 "message"
- **THEN** 消息 SHALL 包含完整的技能指导内容

#### Scenario: 代码迁移子代理请求帮助

- **WHEN** 代码迁移子代理遇到问题
- **THEN** 子代理 SHALL 使用 SendMessage 工具向技能指导子代理发送问题
- **THEN** 消息 SHALL 包含具体的问题描述和上下文
- **THEN** 子代理 SHALL 等待技能指导子代理的回复

#### Scenario: 审核子代理反馈问题

- **WHEN** 审核子代理发现问题
- **THEN** 子代理 SHALL 使用 SendMessage 工具向代码迁移子代理发送反馈
- **THEN** 消息 SHALL 包含所有问题的详细描述
- **THEN** 消息 SHALL 包含修复建议和参考的技能文档

### Requirement: 系统必须在完成后清理子代理团队

系统 SHALL 在文件迁移完成并通过审核后，删除该文件对应的子代理团队。

#### Scenario: 删除代码迁移子代理

- **WHEN** 文件迁移完成并通过审核
- **THEN** 系统 SHALL 使用 SendMessage 工具发送 shutdown_request 给代码迁移子代理
- **THEN** 系统 SHALL 等待代码迁移子代理确认关闭
- **THEN** 系统 SHALL 从团队中移除该子代理

#### Scenario: 保留技能指导和审核子代理

- **WHEN** 代码迁移子代理被删除
- **THEN** 系统 SHALL 保留技能指导子代理
- **THEN** 系统 SHALL 保留审核子代理
- **THEN** 两个子代理 SHALL 继续为下一个文件的迁移服务

#### Scenario: 删除整个团队

- **WHEN** 一个模块的所有文件迁移完成
- **THEN** 系统 SHALL 使用 TeamDelete 工具删除整个团队
- **THEN** 系统 SHALL 确认所有子代理都已关闭
- **THEN** 系统 SHALL 清理团队相关的所有资源

### Requirement: 系统必须支持并行处理多个文件

系统 SHALL 支持同时创建多个子代理团队，并行处理多个文件的迁移。

#### Scenario: 创建多个并行团队

- **WHEN** 系统需要并行迁移 3 个文件
- **THEN** 系统 SHALL 创建 3 个独立的 Agent Team
- **THEN** 每个团队 SHALL 有独立的技能指导、代码迁移、审核子代理
- **THEN** 团队之间 SHALL 互不干扰

#### Scenario: 限制并行团队数量

- **WHEN** 系统创建并行团队
- **THEN** 系统 SHALL 限制同时存在的团队数量不超过 3 个
- **THEN** 系统 SHALL 在一个团队完成后再创建新团队
- **THEN** 系统 SHALL 确保资源使用在合理范围内

### Requirement: 系统必须记录子代理团队的工作日志

系统 SHALL 记录每个子代理团队的工作日志，包括所有消息、决策和审核结果。

#### Scenario: 记录消息通信

- **WHEN** 子代理之间发送消息
- **THEN** 系统 SHALL 记录消息的发送者、接收者、时间戳
- **THEN** 系统 SHALL 记录消息的完整内容
- **THEN** 系统 SHALL 记录消息的类型（message、shutdown_request 等）

#### Scenario: 记录关键决策

- **WHEN** 子代理做出关键决策
- **THEN** 系统 SHALL 记录决策的内容
- **THEN** 系统 SHALL 记录决策的理由
- **THEN** 系统 SHALL 记录决策参考的技能文档

#### Scenario: 生成工作日志报告

- **WHEN** 文件迁移完成
- **THEN** 系统 SHALL 生成该文件的工作日志报告
- **THEN** 报告 SHALL 包含所有子代理的工作记录
- **THEN** 报告 SHALL 包含所有消息通信记录
- **THEN** 报告 SHALL 包含审核结果和问题修复记录
