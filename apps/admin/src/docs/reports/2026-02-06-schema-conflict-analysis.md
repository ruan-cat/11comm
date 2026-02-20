<!-- 未来可以删除 -->

# 数据库 Schema 冲突与隐患排查报告

## 1. 概述

通过对 `apps/type/src/business` 目录下的所有 Schema 定义文件进行深度扫描，发现存在以下几类数据库设计隐患。这些隐患可能导致数据完整性问题、运行时的唯一键冲突报错，以及关联数据的不一致。

## 2. 关键风险项

### 2.1. 软删除与唯一索引冲突 (High Risk)

**问题描述**：
部分表同时启用了“软删除 (`deletedAt`)”和“唯一索引 (`uniqueIndex`)”。
在数据库层面，软删除的记录仍然存在（只是 `deletedAt` 非空）。所有的标准唯一索引会将这些“已删除”的记录也纳入检查范围。
**后果**：
如果用户删除了某条记录（如车牌号 `京A88888`），系统将其标记为软删除。当用户试图再次添加该车牌号时，数据库会报 `Unique Constraint Violation` 错误，导致业务无法进行。

**受影响的表**：
| 表名 | 字段 | 修正建议 |
| :--- | :--- | :--- |
| `ct_contracts` | `contract_number` | 唯一索引应增加 `WHERE deleted_at IS NULL` 条件 |
| `pk_owner_vehicles` | `license_plate` | 唯一索引应增加 `WHERE deleted_at IS NULL` 条件 |
| `rp_repair_orders` | `work_order_number` | 唯一索引应增加 `WHERE deleted_at IS NULL` 条件 |

### 2.2. 缺失外键约束 (Medium Risk)

**问题描述**：
`expense.ts` (费用模块) 中的部分表定义了关联 ID，但在 Schema 中只有字段定义，没有使用 `.references()` 建立物理外键约束。
**后果**：
数据库允许插入不存在的关联 ID（如指向不存在的车辆或合同），导致产生“孤儿数据”。虽然应用层可能做校验，但数据库层失去了最后一道防线。

**受影响的表**：
| 表名 | 字段 | 缺失关联 |
| :--- | :--- | :--- |
| `ex_vehicle_charges` | `vehicle_id` | 应关联 `pk_owner_vehicles.id` |
| `ex_contract_charges` | `contract_id` | 应关联 `ct_contracts.id` |

_注：`ex_payments` 表的 `charge_id` 属于多态关联（指向不同类型的费用表），无法建立单一物理外键，这是设计上的权衡，属于正常情况。_

### 2.3. 弱类型关联 (Low Risk / Maintenance Issue)

**问题描述**：
部分涉及人员的字段使用了 `varchar` 存储姓名，而不是关联 `sm_staff` 或用户表的 ID。
**受影响字段**：

- `pt_patrol_tasks`: `planned_patroller`, `current_patrol_person`
- `rp_repair_orders`: `repair_person`, `assigner`
  **风险**：
  如果人员改名，历史数据虽然保留了当时的名字（某种程度上是特性），但无法精确查询“某用户的所有历史任务”，且存在重名难以区分的问题。
  **建议**：
  在后续重构中，建议改为关联 `User ID` 或 `Staff ID`，并在前端展示时关联查询姓名。

## 3. 修复计划

我将立即执行以下修复操作，解决 **2.1** 和 **2.2** 两个高优先级问题：

1.  **修复唯一索引**：修改相关 Schema，为唯一索引添加部分索引条件 (`isNull(table.deletedAt)`)。
2.  **补全外键**：在费用模块中引入缺失的 Schema 依赖，并补全外键约束。

_无需用户干预，我将直接应用代码更改。_
