# 2026-05-26 drizzle-orm 多实例类型冲突事故

## 1. 问题现象

`apps/admin/server/api/` 下的 Drizzle ORM 接口文件出现大量 TS2769、TS2345、TS2322 类型错误，`PgColumn` 与 `Column` 类型不兼容，`eq()`、`like()`、`and()`、`or()` 等查询构建器函数全部报错，影响 `dev-team` 业务模块的缓存管理和配置管理功能共 50 个错误。

## 2. 实际根因

pnpm 在 `node_modules/.pnpm/` 中为同一个 `drizzle-orm@0.42.0` 创建了两个不同哈希的实例目录（`_@neondat_50a138b5b5ea0bc385a7b3c98238e7b4` 和 `_@neondat_53077c7815aa7bb7fb8022080630b9ce`），导致 Schema 定义（来自 `apps/type`）和 API 代码（来自 `apps/admin/server`）各自引用了不同实例的类路径。TypeScript 对 class 使用名义类型检查，两个结构相同但来自不同模块实例的 `PgColumn` / `Column` 被判定为不兼容类型。

## 3. 关键误导点

版本号完全一致（都是 `0.42.0`），容易让人误以为"版本统一了就不会有问题"。实际上 pnpm 的 peer dependency 解析会因为传递依赖链中 `@neondatabase/*` 包的不同版本组合而产生两个独立实例。

关键线索是错误信息 `Property 'config' is protected but type 'Column<T, TRuntimeConfig, TTypeConfig>' is not a class derived from 'Column<T, TRuntimeConfig, TTypeConfig>'`，它说明两个 `Column` 类型名称相同但并非同一个类实例。

## 4. 有效修复

在根目录 `pnpm-workspace.yaml` 的 `overrides` 字段中添加 `drizzle-orm: 0.42.0`，强制统一为一个版本，然后执行 `pnpm store prune`、删除 `node_modules` 和 `pnpm-lock.yaml`、再 `pnpm install` 完整重装。

注意：`overrides` 应配置在 `pnpm-workspace.yaml` 中，不要写到 `package.json` 的 `pnpm.overrides` 字段里。

## 5. 验证方式

`node_modules/.pnpm` 下只有 1 个 `drizzle-orm` 实例目录；`pnpm exec tsc --noEmit` 输出中 drizzle-orm 相关类型错误为 0 个。

## 6. 后续约束

再次遇到同类 "PgColumn 与 Column 不兼容" 错误时，第一反应检查 `node_modules/.pnpm` 下是否存在多个 drizzle-orm 实例，而不是去改代码或升降版本。monorepo 中共享 class 类型的依赖（如 drizzle-orm）必须始终通过 pnpm overrides 保证单一实例。
