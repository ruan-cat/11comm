# 2026-02-03 Neon 数据库迁移故障与恢复事故报告

## 1. 事故概述

在执行 Neon 数据库迁移过程中，`db:migrate` 命令失败，导致数据库表结构未能正确创建。该故障源于初始迁移文件中的定义冲突。我们通过重置迁移文件并重新生成正确的初始迁移，成功解决了问题并恢复了数据库状态。

## 2. 故障现象

运行 `drizzle-kit migrate` 命令时，出现以下错误：

```log
error: foreign key constraint "ct_second_parties_owner_id_hp_owners_id_fk" cannot be implemented
detail: Key columns "owner_id" and "id" are of incompatible types: text and uuid.
```

错误表明在创建 `ct_second_parties` 表的外键约束时，源字段 `owner_id` (text) 与目标字段 `hp_owners.id` (uuid) 类型不匹配。

## 3. 根因分析

1.  **初始迁移文件错误**：初始迁移文件 `0000_careful_thunderball.sql` 包含了错误的列类型定义。虽然 Schema 定义文件 (`apps/admin/server/db/schemas/contract.ts`) 可能已经被修改，但 Drizzle Kit 在生成初始迁移时捕获了当时的状态，其中 `ownerId` 被定义为 `text` 类型。
2.  **约束冲突**：同一个迁移文件（或同一个事务中）试图在 `text` 类型的列上建立指向 `uuid` 类型列的外键约束，这是 PostgreSQL 不允许的。
3.  **迁移应用失败**：由于初始迁移文件本身包含逻辑错误，导致第一次迁移就未能成功应用。因此，后续试图通过新的迁移文件（`0001_...`）来修复类型问题的尝试也无法执行，因为 Drizzle 要求迁移必须按顺序应用。
4.  **数据库状态不一致**：虽然 `db:generate` 成功生成了修复后的 `0001` 迁移文件，但由于 `0000` 迁移从未成功应用，数据库中没有任何业务表，导致系统处于一种“已有迁移文件但无对应数据库表”的不一致状态。

## 4. 解决过程

1.  **Schema 修正**：
    - 确认并修正 `apps/admin/server/db/schemas/contract.ts` 中的 `ownerId` 字段类型为 `uuid`。

    ```typescript
    // 修正前
    ownerId: text("owner_id").references(() => hpOwners.id),
    // 修正后
    ownerId: uuid("owner_id").references(() => hpOwners.id),
    ```

2.  **清理旧迁移**：
    - 由于数据库中没有任何业务表，我们决定放弃错误的迁移历史。
    - 删除了 `apps/admin/drizzle` 目录下的所有文件（`rm -rf apps/admin/drizzle`）。

3.  **重新生成初始迁移**：
    - 运行 `pnpm -F @01s-11comm/admin db:generate`。
    - Drizzle Kit 根据当前的 Schema 定义生成了全新的、正确的初始迁移文件 `0000_smiling_vampiro.sql`。

4.  **应用迁移**：
    - 运行 `pnpm -F @01s-11comm/admin db:migrate`。
    - 迁移成功执行，所有数据库表被正确创建。

5.  **验证结果**：
    - 使用 `mcp__Neon__get_database_tables` 工具查询数据库，确认所有业务表（如 `cm_communities`, `hp_houses` 等）都已存在。

## 5. 预防措施与建议

1.  **Schema 审查**：在运行 `db:generate` 之前，务必仔细审查 Schema 定义，特别是外键关联字段的类型必须与主键类型一致。
2.  **本地/开发环境验证**：在提交迁移文件之前，应在本地或开发环境的数据库上实际运行 `db:migrate` 进行验证，确保迁移文件本身是合法的且能成功应用。
3.  **处理迁移失败**：如果迁移失败且是在开发早期（无生产数据），直接重置迁移历史（删除迁移文件并 drop tables）通常比试图通过新迁移来修复旧迁移的错误更干净、更快捷。
4.  **类型检查**：利用 TypeScript 的类型检查功能，确保 Drizzle Schema 定义中的类型一致性。

## 6. 结论

本次事故是由于 Schema 定义错误导致的迁移文件生成错误，进而阻塞了数据库部署。通过清理无效迁移并基于修正后的 Schema 重新生成初始迁移，我们成功恢复了数据库的正常状态。当前数据库结构与代码定义一致，可以进行后续开发。
