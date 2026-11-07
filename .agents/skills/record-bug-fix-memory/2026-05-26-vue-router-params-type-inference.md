# 2026-05-26 Vue Router 参数类型推断事故

## 1. 问题现象

`src/views/tabs/hooks.ts` 出现 4 个 TS2339 错误，`Property 'id' does not exist on type 'Record<never, never> | { id: string | number; } | ...'`。

## 2. 实际根因

Vue Router 的 `params` 类型定义返回一个复杂联合类型，其中包含 `Record<never, never>`，TypeScript 无法确定 `id` 属性在所有联合成员上都存在。这是 Vue Router 类型定义限制，不是代码逻辑错误。

## 3. 关键误导点

这些错误在 drizzle-orm 修复前就已存在，容易被误归因为 drizzle-orm 多实例问题的连带效应，实际上是完全独立的问题。

## 4. 有效修复

需要对 `route.params` 添加类型断言或类型守卫（如 `as { id: string | number }`），属于低优先级修复。

## 5. 验证方式

`pnpm exec tsc --noEmit` 输出中仅剩下这 4 个与 drizzle-orm 无关的错误时，说明 drizzle 目标错误已经清除。

## 6. 后续约束

在统计类型错误修复结果时，要明确区分"目标错误"和"已有的无关错误"，避免把已有错误算入修复失败范围。
