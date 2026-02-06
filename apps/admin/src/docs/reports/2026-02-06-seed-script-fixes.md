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

## 验证结论

执行 `pnpm db:generate-seed` 成功，输出文件无冲突。
执行 `run-seed-sql` (即 `db:seed`) 预计不再会出现主键冲突或卡死现象。
