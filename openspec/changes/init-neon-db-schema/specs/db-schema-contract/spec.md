## ADDED Requirements

### Requirement: First Party Table

系统 SHALL 提供 `ct_first_parties` 表存储合同甲方信息。

#### Scenario: Store party basic info

- **WHEN** 录入合同甲方
- **THEN** 系统存储甲方名称、联系人、联系电话、地址

#### Scenario: Store party legal info

- **WHEN** 记录甲方法律信息
- **THEN** 系统存储统一社会信用代码、成立日期、法定代表人、经营范围

#### Scenario: Manage party status

- **WHEN** 管理甲方状态
- **THEN** 系统支持启用/禁用状态切换

### Requirement: Second Party Table

系统 SHALL 提供 `ct_second_parties` 表存储合同乙方信息。

#### Scenario: Store party info

- **WHEN** 录入合同乙方
- **THEN** 系统存储乙方名称、类型、联系人、联系电话、地址

#### Scenario: Associate with owner

- **WHEN** 乙方为业主
- **THEN** 系统通过 `owner_id` 外键可选关联到 `hp_owners` 表

### Requirement: Contract Templates Table

系统 SHALL 提供 `ct_templates` 表存储合同模板。

#### Scenario: Store template content

- **WHEN** 创建合同模板
- **THEN** 系统存储模板名称、模板类型、模板内容、版本号

#### Scenario: Manage template status

- **WHEN** 管理模板状态
- **THEN** 系统支持草稿/已发布/已停用状态

### Requirement: Contract Clauses Table

系统 SHALL 提供 `ct_clauses` 表存储合同条款。

#### Scenario: Store clause content

- **WHEN** 定义合同条款
- **THEN** 系统存储条款名称、条款内容、条款类型、排序号

#### Scenario: Associate with template

- **WHEN** 条款属于特定模板
- **THEN** 系统通过 `template_id` 外键关联到 `ct_templates` 表

### Requirement: Contracts Table

系统 SHALL 提供 `ct_contracts` 表存储合同信息。

#### Scenario: Store contract basic info

- **WHEN** 创建合同
- **THEN** 系统存储合同名称、合同编号、合同类型、合同金额

#### Scenario: Store contract parties

- **WHEN** 记录合同双方
- **THEN** 系统通过外键关联甲方和乙方信息

#### Scenario: Store contract period

- **WHEN** 设置合同期限
- **THEN** 系统存储开始时间、结束时间、签订日期

#### Scenario: Track contract status

- **WHEN** 管理合同状态
- **THEN** 系统支持草稿/待审核/已生效/已到期/已终止状态

#### Scenario: Support soft delete

- **WHEN** 删除合同
- **THEN** 系统使用软删除机制，保留历史数据

### Requirement: Contract Attachments Table

系统 SHALL 提供 `ct_attachments` 表存储合同附件。

#### Scenario: Store attachment info

- **WHEN** 上传合同附件
- **THEN** 系统存储附件名称、附件类型、文件路径、文件大小

#### Scenario: Associate with contract

- **WHEN** 附件属于特定合同
- **THEN** 系统通过 `contract_id` 外键关联到 `ct_contracts` 表，级联删除

### Requirement: Contract Changes Table

系统 SHALL 提供 `ct_changes` 表存储合同变更记录。

#### Scenario: Store change record

- **WHEN** 合同发生变更
- **THEN** 系统存储变更类型、变更原因、变更内容、变更日期

#### Scenario: Track change approval

- **WHEN** 变更需要审批
- **THEN** 系统存储审批状态、审批人、审批时间

### Requirement: Contract Reviews Table

系统 SHALL 提供 `ct_reviews` 表存储合同审核记录。

#### Scenario: Store review record

- **WHEN** 合同提交审核
- **THEN** 系统存储审核人、审核意见、审核结果、审核时间

#### Scenario: Associate with contract

- **WHEN** 审核关联特定合同
- **THEN** 系统通过 `contract_id` 外键关联到 `ct_contracts` 表

### Requirement: Contract Archives Table

系统 SHALL 提供 `ct_archives` 表存储合同归档记录。

#### Scenario: Store archive info

- **WHEN** 合同归档
- **THEN** 系统存储归档编号、归档日期、归档位置、归档人

### Requirement: Contract Prints Table

系统 SHALL 提供 `ct_prints` 表存储合同打印记录。

#### Scenario: Store print record

- **WHEN** 打印合同
- **THEN** 系统存储打印人、打印时间、打印份数

### Requirement: Contract Types Table

系统 SHALL 提供 `ct_types` 表存储合同类型配置。

#### Scenario: Store contract type

- **WHEN** 配置合同类型
- **THEN** 系统存储类型名称、类型编码、类型描述

### Requirement: Contract Module Indexes

系统 SHALL 为合同管理模块表创建必要的索引。

#### Scenario: Contract query optimization

- **WHEN** 按合同编号查询
- **THEN** `ct_contracts` 表的 `contract_number` 字段有唯一索引

#### Scenario: Status filter optimization

- **WHEN** 按合同状态筛选
- **THEN** `ct_contracts` 表的 `status` 字段有索引
