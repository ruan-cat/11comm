<!-- 一次性报告 旨在于说明处理sql的脆弱性 以后应该多检查技术债务
未来可以酌情删除
-->

# 2026-02-06 Schema Refactoring and Seed Pipeline Optimization Report

## 1. 背景与问题分析

在修复 Seed 数据生成流程时，我们发现项目中存在一套复杂的"补丁机制"（Patch Scripts）。这套机制的工作流程如下：

1. **Drizzle Generator**: 根据 `db/schemas/*.ts` 定义生成原始 SQL 文件。
2. **Patch Scripts**: 运行 `patch-01`, `patch-05` 等脚本，使用正则表达式暴力修改生成的 SQL 文件。
   - **操作内容**: 主要是**删除** INSERT 语句中多余的字段值，或者**修改**特定的字段值。
3. **Run Seed**: 执行修改后的 SQL。

### 核心矛盾

这套流程的存在揭示了一个核心矛盾：**Drizzle Schema 定义 (`.ts`) 与实际业务需求（或数据库现状）严重不符。**

具体表现为：

- **Schema 冗余**: `ct_changes`（合同变更表）中定义了 `contractName`, `contractNumber`, `partyA`, `partyB` 等大量字段。
- **Patch 行为**: `patch-05-contract.ts` 脚本的作用正是把 SQL 语句中对应的这些字段值给**剔除**掉。
- **结论**: 这说明这些字段在数据库层面可能根本不需要（作为冗余字段），或者我们在插入时根本不希望插入它们（希望通过联表查询获取）。

## 2. 决策：为何修改 Schema 而非保留 Patch

我们面临两个选择：

### 选项 A：保留 Patch 脚本（仅修复脚本 bug）

- **做法**: 继续维护 schema 和 patch 脚本的割裂状态，仅修复 regex 匹配失败的问题。
- **缺点**:
  - **极度脆弱**: 正则表达式处理 SQL 字符串非常危险。一旦数据中包含逗号、括号（如 JSON 或文章内容），正则替换就会错位，导致数据损坏（这也是本次故障的根源）。
  - **维护成本高**: 每次修改 Schema，都必须同步修改 Patch 脚本中的正则逻辑，双倍工作量。
  - **误导性**: 新加入的开发者看到 Schema 定义了这些字段，会在代码中使用，结果发现数据库里没这些值，或者 Seed 数据里被 patch 删掉了，产生困惑。

### 选项 B：修正 Schema 定义（Root Cause Fix）

- **做法**: 直接修改 `db/schemas/*.ts`，移除那些"本来就要被 Patch 脚本删掉"的字段。
- **优点**:
  - **单一未真理 (Single Source of Truth)**: 代码中的 Schema 定义即为最终数据库结构，所见即所得。
  - **消除脆弱性**: 不再需要易错的正则替换，Drizzle 生成的 SQL 直接就是正确的、可执行的。
  - **符合范式**: 被移除的字段（如 `ct_changes` 中的 `contract_name`）多为反规范化的冗余字段。合同变更表已有 `contract_id`，通过 JOIN `ct_contracts` 即可获取合同名称，无需在变更表中重复存储，减少了数据一致性维护的负担。

## 3. 具体变更内容

基于上述分析，我执行了以下清理工作：

### 3.1. 合同模块 (`schemas/contract.ts`)

**移除字段**: `contractName`, `contractNumber`, `contractType`, `partyA`, `partyB`, `changer`, `applyTime`, `description`, `status` (在 `ctChanges` 表中)。

- **原因**: 这些字段大多是 `ctContracts` 表的冗余数据。`ctChanges` 通过 `contractId` 关联，完全可以在运行时查询获取。Patch 脚本一直在试图删除它们，说明它们本就不该被 Seed 插入。

### 3.2. 费用模块 (`schemas/expense.ts`)

**移除字段**:

- `exExpenseItems`: `expenseIdentifier`, `prepaymentPeriod`, `unit`。
- `exMeterReadingTypes`: `description`。
- **原因**: 这些字段在 Seed Mock 数据中不存在，且 Patch 脚本将其视为空或默认值处理。移除后简化了模型。

### 3.3. 设置模块 (`schemas/setting.ts`)

**移除字段**: 大量在 `smDataPermissions`, `smShifts`, `smSystemConfigs` 中定义的但未使用的冗余字段。

- **原因**: 使得 Schema 更轻量，聚焦于核心业务字段。

### 3.4. 房产模块 (`schemas/house-property.ts`)

**修正字段**: 移除了 `creator`, `accessKey` 等在生成逻辑中被忽略的字段。

## 4. 收益总结

通过这次重构，我们达成以下成果：

1.  **废弃了 7 个脆弱的 Patch 脚本**:
    - `patch-01-setting.ts`
    - `patch-02-house-property.ts`
    - `patch-03-house-property.ts`
    - `patch-05-contract.ts`
    - `patch-06-parking.ts`
    - `patch-07-expense.ts`
    - `strip-02-house-property.ts`
2.  **Seed 流程原子化**: 现在只需运行 `generate-seed-sql.ts` -> `run-seed-sql.ts`，中间无任何黑盒修改，流程清晰透明。
3.  **开发体验提升**: Schema 定义更加准确，误导性字段被移除。

此决策旨在偿还技术债务，建立一个长期可维护的代码库，而非仅仅修补眼前的报错。
