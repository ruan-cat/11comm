# 2026-05-26 Schema 冗余字段与 Patch 脚本脆弱性事故

## 1. 问题现象

Seed 流程使用 7 个 Patch 脚本修改生成的 SQL，正则表达式处理 SQL 字符串频繁出错。

## 2. 实际根因

Schema 定义包含大量冗余字段（如 `ct_changes` 中的 `contractName`、`contractNumber` 等），Patch 脚本试图在生成后删除它们，导致流程复杂且脆弱。

## 3. 关键误导点

误认为应该保留 Patch 脚本并修复其中的 bug。实际上问题出在 Schema 定义本身，冗余字段不应该存在。

## 4. 有效修复

从 Schema 中移除冗余字段，废弃所有 Patch 脚本，使 Seed 流程直接生成正确的 SQL。

## 5. 验证方式

Seed 流程原子化，直接生成正确的 SQL 无需后处理；`pnpm db:seed` 全量通过。

## 6. 后续约束

Schema 定义必须与实际业务需求一致，避免冗余字段。禁止使用正则表达式修改生成的 SQL。如果需要修改生成的 SQL，说明 Schema 定义有问题。
