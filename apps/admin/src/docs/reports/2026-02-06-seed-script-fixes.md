# 2026-02-06 Seed 生成脚本修复与风险排查报告

## 任务背景

用户在使用 `db:seed` 命令时遇到脚本卡死或直接失败的问题。同时需要排查 Seed 生成脚本中是否存在隐晦的数据库关系冲突。

## 问题分析

### 1. 脚本执行失败的原因 (Duplicate Files)

经过排查，`apps/admin/drizzle/seed` 目录下存在大量**重叠且过时**的 SQL 文件。

- 存在 `00-community.sql` (旧) 和 `01-community.sql` (新)。
- 存在 `01-setting.sql` (旧) 和 `02-setting.sql` (新)。
- 存在 `02-house-property.sql` (旧) 和 `03-house-property.sql` (新)。

由于 `run-seed-sql.ts` 会读取目录下所有 `.sql` 文件并按字母顺序执行，导致脚本先执行了旧文件（插入了数据），随后执行新文件时，尝试插入相同的 UUID 主键，引发 **Unique Constraint Violation**，导致脚本直接失败。

**根本原因**：模块 ID 发生过变更（重编号），但 `generate-seed-sql.ts` 在生成新文件前未清理旧文件。

### 2. 隐式数据库关系冲突 (Partial Generation Bug)

在检查脚本逻辑时，发现 `generate-seed-sql.ts` 存在一个严重逻辑缺陷：

当使用 `--module=xxx` 参数进行局部生成时（例如 `pnpm db:generate-seed --module=expense`）：

1. 脚本只会运行该模块的生成器。
2. `IdMapRegistry` 是空的。
3. `expense` 模块依赖 `house-property` 生成的 ID（通过 `idMap.get("hp_houses", ...)`）。
4. 由于 `house-property` 未运行，`idMap.get` 返回 `null`。
5. 生成逻辑会跳过关联记录，或者生成无效数据（如果逻辑未处理 `null`）。

这会导致生成的局部 SQL 文件缺失必要的关联数据，或者在运行时因外键约束失败（如果生成的记录引用了不存在的父级 ID，虽然在本例中代码做了防御性跳过）。

## 修复方案

### 1. 修复 `generate-seed-sql.ts`

已重构 `apps/admin/scripts/generate-seed-sql.ts`，实现了以下改进：

1.  **全量清理**：在执行全量生成（默认模式）时，强制 **Wipe (删除)** `apps/admin/drizzle/seed` 目录，确保无残留文件。
2.  **全量模拟**：在执行局部生成（`--module`）时，**依然运行所有模块的生成器**（按依赖顺序），但不输出文件，仅用于填充 `IdMapRegistry`。这确保了生成的局部模块能正确获取到依赖模块的 ID。
3.  **精确输出**：仅将目标模块的 SQL 写入磁盘。

### 2. 数据冲突排查

运行生成脚本后，日志显示部分警告：

```log
Owner [张三] not found for vehicle [京A12345], using default.
```

这表明 Mock 数据中的关联字段（如车主的姓名）与 Owner 模块生成的姓名不完全匹配。生成脚本已包含防御逻辑（使用默认值或跳过），因此不会导致数据库层面的崩溃，但提示了数据一致性层面的微小瑕疵。

### 3. 清理结果

已手动清理了所有过时的 `.sql` 文件，并重新执行了一次全量生成。当前 seed 目录结构清晰，无重复文件。

执行 `pnpm db:generate-seed` 成功，输出文件无冲突。
执行 `run-seed-sql` (即 `db:seed`) 预计不再会出现主键冲突或卡死现象。

## 后续修复 (2026-02-06 晚)

在进一步的验证中，发现了新的阻塞性问题并已修复：

### 1. 性能优化 (严重卡死问题)

- **现象**：`toFullSql` 函数在处理包含大量参数的 SQL 语句（如包含 2000 个参数的 insert）时，导致 CPU 占用 100% 并卡死数分钟。
- **原因**：原实现使用 `split` 和 `reduce` 进行逐个占位符替换，复杂度为 O(N\*M)。
- **修复**：重构为基于正则表达式的单次替换，复杂度降低至 O(M)，生成速度瞬间完成。

### 2. 数据库约束冲突修复

在清理数据库后重新播种 (`db:seed --clean`) 时，暴露出以下 Crash 问题：

- **`sm_data_permissions` (Not Null Violation)**:
  - **原因**：Mock 数据 `DataPermission` 缺乏 `roleId` 字段，且原脚本查找失败导致插入 `null`，违反 `role_id` 非空约束。
  - **修复**：增加逻辑，尝试通过 ID 查找角色，失败时回退到默认角色（系统管理员），并跳过无法映射的脏数据。

- **`hp_owner_members` 等表 (Not Null Violation)**:
  - **原因**：Mock 数据的关联基于**姓名** (e.g., "张三")，但 `IdMapRegistry` 基于由 Mock ID 生成的 UUID。`idMap.get("hp_owners", "张三")` 返回 null，导致 `owner_id` 为空。
  - **修复**：在 `house-property.ts` 中引入局部 `Name -> UUID` 映射表。在生成 Owner 时同时记录 Name 映射，并在生成 House、Member、Invoice 等子表时优先使用 Name 映射进行 ID 解析。

- **`rpt_expense_summaries` (Invalid Date Format)**:
  - **原因**：Mock 数据使用了 `YYYY-MM` (e.g., "2024-01") 和 `YYYY年QX` 格式，PostgreSQL `date` 类型无法解析。
  - **修复**：在生成逻辑中增加日期解析器，将非标准格式规范化为 `YYYY-MM-DD` (e.g., "2024-01-01")。

### 3. 当前状态

所有 Seed 生成逻辑均已修正，`pnpm db:seed --clean` 命令能够在清空数据库后完整、无报错地重新填充 mock 数据。
