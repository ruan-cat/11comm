# 数据库 Schema 架构深度审计报告

## 1. 审计概述

本次审计采用了“Ultrathink”模式，重点检查了 `apps/admin/server/db/schemas` 目录下的模块依赖关系、外键约束完整性以及潜在的循环依赖问题。审计发现当前的 Schema 设计存在明显的**分层依赖架构**，但也存在因模块边界不清导致的**缺失外键**隐患。

## 2. 模块依赖分层图谱

为了避免循环引用（Circular Dependency），项目目前的模块依赖关系如下（由底层向上层）：

1.  **Level 0 (Base)**: `common.ts` (无依赖)
2.  **Level 1 (Core)**: `setting.ts` (组织架构/权限), `community.ts` (小区基础)
3.  **Level 2 (Asset)**: `house-property.ts` (房产/业主 - 依赖 Community)
4.  **Level 3 (Resource)**: `parking.ts` (车位 - 依赖 HouseProperty, Community), `contract.ts` (合同 - 依赖 HouseProperty)
5.  **Level 4 (Finance/Service)**: `expense.ts` (费用 - 依赖 Parking, Contract, HouseProperty), `patrol.ts` (巡检 - 依赖 Community)

## 3. 发现的关键隐患

### 3.1. 跨层级反向依赖导致的“孤儿外键” (High Impact)

**问题描述**：
`house-property.ts` (Level 2) 中的 `hpInvoices` 表包含 `payment_id` 字段，试图引用支付记录。
然而，支付记录表 `exPayments` 定义在 `expense.ts` (Level 4) 中。
**技术冲突**：
如果在 `house-property.ts` 中引入 `expense.ts`，将立即形成循环依赖（Level 2 <-> Level 4），导致构建失败。
**现状后果**：
`hpInvoices.payment_id` 目前仅定义为普通的 `uuid`，**没有物理外键约束**。数据库无法阻止发票关联到不存在的支付记录。
**建议方案**：
将 `hpInvoices` 表迁移至 `expense.ts` 模块，或者创建一个新的 Level 5 `finance-archive.ts` 模块来同时引用两者。但鉴于迁移表结构涉及较大变动，目前建议在代码逻辑层严格校验。

### 3.2. 车位所有权弱引用 (Fixed)

**问题描述**：
`parking.ts` 中的 `pkCarports` 表此前仅通过 `owner_name` (varchar) 记录车位所有者。
**风险**：
如果单纯出租车位（无车辆绑定），系统无法精确关联到 `hpOwners` 表中的业主 ID，导致无法生成自动化的租赁账单。
**修复动作**：
已在 `pkCarports` 表中增加了 `owner_id` 字段并建立了指向 `hpOwners.id` 的强外键约束。

### 3.3. 人员引用的弱类型问题 (Observation)

**问题描述**：
`patrol.ts` 和 `repairs.ts` 模块中，大量指派人、维修人字段（如 `planned_patroller`, `repair_person`）使用 `varchar` 存储姓名。
**原因推测**：
这可能是为了解耦 `setting` 模块（员工可能被删除，但历史记录需保留名字），或者是为了支持非系统员工（如临时工）。
**建议**：
维持现状，避免破坏性变更。如需强关联系统员工，建议新增 `_id` 后缀的可选字段（如 `repair_person_id`）。

## 4. 结论

数据库 Schema 的整体分层结构清晰，但在“发票-支付”这一反向业务闭环上存在架构制约。本次已通过代码修复解决了最紧迫的“车位计费无法关联业主”的问题。
