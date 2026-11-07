# 2026-05-26 Drizzle v0.42 insert 类型排除事故

## 1. 问题现象

种子系统重构后，11 个 seed 模块共 106+ 处 `db.insert(table).values([...])` 全部报 TS2769 "No overload matches this call"，`id` 和其他有默认值或 nullable 的列被 TypeScript 认为是多余属性而拒绝编译。

## 2. 实际根因

Drizzle ORM v0.42 的 `primaryId()` helper 内部使用 `uuid('id').defaultRandom().primaryKey()`，该组合导致 `InferInsertModel` 类型推导将 `id` 完全排除在 insert 类型之外。Drizzle 对任何有 `default` / `$defaultFn` / `defaultRandom` 的列都做同样处理。TypeScript 又对直接写在函数参数位置的 fresh object literal 执行严格 excess property check，不允许传入类型定义之外的属性。

## 3. 关键误导点

三个错误假设各浪费了一轮调试：

1. 修改 `primaryId()` 的 default 实现，期望让 `id` 变为可选，但 Drizzle 对任何默认值列都执行同样类型排除。
2. 创建 `rows()` 函数用 `InferInsertModel<T> & { id?: string }` 做数据类型，但所有 nullable / 有默认值的列同样会被标记为多余属性。
3. 使用简单泛型 identity 函数但不加 `const` 类型参数，导致枚举字面量值被宽化为 `string`。

## 4. 有效修复

在 `helpers.ts` 中添加泛型 identity 函数 `rows<const T extends Record<string, unknown>[]>(data: T): T`，将所有 `.values([...])` 改为 `.values(rows([...]))`。`const` 类型参数保留字面量类型；函数调用边界打破 TypeScript 的 fresh object literal 标记；运行时零开销，不使用 `as any`。

## 5. 验证方式

`npx tsc --noEmit` 输出中 seed 相关错误为 0（仅剩 `hooks.ts` 的 4 个预存错误，与 seed 无关）；`pnpm db:reset` 全量重置 11/11 模块通过；`pnpm db:seed` 增量重灌 11/11 模块通过。

## 6. 后续约束

Drizzle ORM 项目中为种子数据编写 `.values()` 调用时，如果列定义使用了 `defaultRandom()`、`.default()`、`.$defaultFn()` 或缺少 `.notNull()`，必须预期这些列不会出现在 `InferInsertModel` 中。遇到此类问题时，第一反应用泛型 identity 函数打破 fresh literal check，而不是修改 schema 或使用 `as any`。修改 `primaryId()` 的 default 实现方式不能解决这个问题。
