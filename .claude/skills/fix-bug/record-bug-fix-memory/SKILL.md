---
name: record-bug-fix-memory
description: 当用户要求在 bug 已经定位并修复后，记录排错经验、事故结论、AI 记忆更新、复盘摘要或本地 MCP 记忆时使用。这个技能只负责沉淀"发生了什么、为什么会发生、如何修好、以后要记住什么"，不要把它用于实际修复 bug。
---

# 记录 Bug 修复记忆

## 概述

使用这个技能，把已经完成的排错结果沉淀成可复用的长期记忆。

目标是保存根因、有效修复路径、错误假设和验证证据，让后续 agent 不再重复同样的弯路。

核心原则：记录决策链，不记录流水账。

## 何时使用

在以下场景使用这个技能：

- 用户要求更新 AI 记忆文档、记录经验教训、补充事故记录、编写复盘摘要。
- bug 已经完成复现，且有效修复路径已经明确。
- 这条经验是仓库特有知识，应该对未来 agent 可见。
- 需要把结论同步到本地 MCP 记忆，例如 Memorix。

以下情况不要使用这个技能：

- bug 还在调查中，根因没有确认。
- 用户要求的是修复实现，而不是经验沉淀。
- 你手里只有猜测、片段证据或临时绕过方案。

## 前置输入

开始写记忆前，必须能回答下面六个问题：

1. 对用户来说，表面现象是什么？
2. 实际根因是什么？
3. 哪个错误假设或误导信号浪费了时间？
4. 最终是哪一个具体改动修好了问题？
5. 用什么验证证明修复成立？
6. 这条记忆应该写到哪里？

如果有任何一个问题答不上来，先完成排错，不要提前写记忆。

## 写到哪里

- 仓库级、可复用的规则：写到根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`
- 跨会话的本地记忆：写到 Memorix，类型用 `gotcha`、`decision` 或 `problem-solution`
- 包级 prompts、plans、reports：只有用户明确要求时才写进去

默认规则：只要这条经验会影响整个仓库里的未来 agent，就优先写入三个根级 AI 记忆文档，不要埋进包级备注里。

## 记录什么

每条记忆至少要覆盖这六件事：

1. 问题现象：从用户视角看，哪里坏了
2. 根因：真正出错的地方
3. 关键线索：哪条信号把问题从假象拉回真实根因
4. 有效修复：真正解决问题的改动
5. 验证方式：证明修复成功的证据
6. 后续约束：未来 agent 必须先检查什么、避免什么

## 记忆模板

使用简洁、面向未来复用的结构：

- `问题现象：...`
- `根因：...`
- `关键误导点：...`
- `有效修复：...`
- `验证方式：...`
- `后续约束：...`

这些句子应该帮助未来 agent 快速做对事，而不是复述完整排错过程。

## 仓库级经验库

当用户要求"补充 AI 记忆"时，不要只写当次 bug 的表面结论。先检查这次问题是否落在仓库已有事故模式里，再把对应经验合并写入记忆。

### `apps/admin/server` 的 drizzle-orm 多实例类型冲突事故

- 问题现象：`apps/admin/server/api/` 下的 Drizzle ORM 接口文件出现大量 TS2769、TS2345、TS2322 类型错误，`PgColumn` 与 `Column` 类型不兼容，`eq()`、`like()`、`and()`、`or()` 等查询构建器函数全部报错，影响 `dev-team` 业务模块的缓存管理和配置管理功能共 50 个错误。
- 实际根因：pnpm 在 `node_modules/.pnpm/` 中为同一个 `drizzle-orm@0.42.0` 创建了**两个不同哈希的实例目录**（`_@neondat_50a138b5b5ea0bc385a7b3c98238e7b4` 和 `_@neondat_53077c7815aa7bb7fb8022080630b9ce`），导致 Schema 定义（来自 `apps/type`）和 API 代码（来自 `apps/admin/server`）各自引用了不同实例的类路径。TypeScript 对 class 使用名义类型检查，两个结构相同但来自不同模块实例的 `PgColumn`/`Column` 被判定为不兼容类型。
- 关键线索：错误信息 `Property 'config' is protected but type 'Column<T, TRuntimeConfig, TTypeConfig>' is not a class derived from 'Column<T, TRuntimeConfig, TTypeConfig>'` 明确指出两个 `Column` 类型名称相同但不是同一个类的实例；`node_modules/.pnpm` 目录下可以用 `find` 或 `ls | grep drizzle-orm` 确认存在多个实例目录。
- 关键误导点：版本号完全一致（都是 `0.42.0`），容易让人误以为"版本统一了就不会有问题"。实际上 pnpm 的 peer dependency 解析会因为传递依赖链中 `@neondatabase/*` 包的不同版本组合而产生两个独立的实例。不要误判为"需要降级/升级 drizzle-orm 版本"或"代码写法有问题"。
- 有效修复：在根目录 `pnpm-workspace.yaml` 的 `overrides` 字段中添加 `drizzle-orm: 0.42.0` 强制统一为一个版本，然后执行 `pnpm store prune` → 删除 `node_modules` 和 `pnpm-lock.yaml` → `pnpm install` 完整重装。注意：`overrides` 应配置在 `pnpm-workspace.yaml` 中，不要写到 `package.json` 的 `pnpm.overrides` 字段里。
- 验证方式：`node_modules/.pnpm` 下只有 1 个 `drizzle-orm` 实例目录；`pnpm exec tsc --noEmit` 输出中 drizzle-orm 相关类型错误为 0 个。
- 后续约束：再次遇到同类 "PgColumn 与 Column 不兼容" 错误时，第一反应检查 `node_modules/.pnpm` 下是否存在多个 drizzle-orm 实例，而不是去改代码或升降版本。monorepo 中共享 class 类型的依赖（如 drizzle-orm）必须始终通过 `pnpm.overrides` 保证单一实例。

### `apps/admin/server` 的 H3/Nitro 类型错误与废弃 API 事故

- 问题现象：`server/middleware/1.logger.ts` 出现 `Property 'respondWith' does not exist on type 'H3Event<EventHandlerRequest>'` 类型错误；`tests/nitro/auth/` 下的测试文件出现 `Cannot find module '../setup-neon'` 模块解析错误。
- 实际根因：`event.respondWith()` 是 H3 v1 的 API，H3 v2 中已被移除。原代码保留了 Cloudflare Workers 的 `respondWith` 分支，但本项目仅运行在 Node.js 环境，该废弃 API 分支不应存在。测试文件中的导入路径 `../setup-neon` 解析错误，实际文件位于 `tests/setup-neon.ts`，需要 `../../setup-neon`。
- 关键误导点：`respondWith` 错误看起来像环境兼容性问题，容易让人去找 Cloudflare Workers 相关的 polyfill 或配置，实际上应直接移除该废弃 API 的整个代码分支。
- 有效修复：移除 `server/middleware/1.logger.ts` 中的 Cloudflare Workers 分支代码，只保留 `event.node.res.once("finish", ...)` 的 Node.js 日志方式；将测试文件中 `../setup-neon` 导入路径修正为 `../../setup-neon`。
- 验证方式：`pnpm exec tsc --noEmit` 后 4 个修复文件均无类型错误输出。
- 后续约束：本项目仅运行 Node.js 环境，写中间件时不要保留 Cloudflare Workers、Deno 等其他运行时的兼容代码分支。H3 函数必须从 `"nitro/h3"` 导入，不要从 `"h3"` 直接导入。测试文件移动目录后，必须同步检查所有 `import` 路径的层级是否正确。

### `apps/admin` 的 Vue Router 参数类型推断事故

- 问题现象：`src/views/tabs/hooks.ts` 出现 4 个 TS2339 错误，`Property 'id' does not exist on type 'Record<never, never> | { id: string | number; } | ...'`。
- 实际根因：Vue Router 的 `params` 类型定义返回一个复杂联合类型，其中包含 `Record<never, never>`，TypeScript 无法确定 `id` 属性在所有联合成员上都存在。这是 Vue Router 类型定义的已知限制，不是代码逻辑错误。
- 关键误导点：这些错误在 drizzle-orm 修复前就已存在，容易被误归因为 drizzle-orm 多实例问题的连带效应，实际上是完全独立的问题。
- 有效修复：需要对 `route.params` 添加类型断言或类型守卫（如 `as { id: string | number }`），属于低优先级修复。
- 验证方式：`pnpm exec tsc --noEmit` 输出中仅剩下这 4 个与 drizzle-orm 无关的错误。
- 后续约束：在统计类型错误修复结果时，要明确区分"目标错误"和"已有的无关错误"，避免把已有错误算入修复失败的范围。

### `apps/admin/server/db/seed` 的 Drizzle v0.42 insert 类型排除事故

- 问题现象：种子系统重构后，11 个 seed 模块共 106+ 处 `db.insert(table).values([...])` 全部报 TS2769 "No overload matches this call"，`id` 和其他有默认值/nullable 的列被 TypeScript 认为是"多余属性"而拒绝编译。
- 实际根因：Drizzle ORM v0.42 的 `primaryId()` helper 内部使用 `uuid('id').defaultRandom().primaryKey()`，该组合导致 `InferInsertModel` 类型推导将 `id` 完全排除在 insert 类型之外（Drizzle 对任何有 `default`/`$defaultFn`/`defaultRandom` 的列都做同样处理）。同时 TypeScript 对 "fresh object literal"（直接写在函数参数位置的对象字面量）执行严格的 excess property check，不允许传入类型定义之外的属性。两者叠加，所有包含 `id` 或 nullable 列的 `.values()` 调用全部失败。
- 关键误导点：三个错误假设各浪费了一轮完整调试循环：(1) 修改 `primaryId()` 从 `defaultRandom()` 改为 `default(sql\`gen_random_uuid()\`).$defaultFn(() => crypto.randomUUID())`，期望让`id`变为可选——无效，Drizzle 内部对**任何**有默认值的列都执行相同的类型排除逻辑，与具体 default 实现方式无关；(2) 创建`rows()`函数用`InferInsertModel<T> & { id?: string }`做数据类型——无效，`InferInsertModel`只包含`notNull`且无`default`的列，所有 nullable/有默认值的列（不止`id`）同样被标记为多余属性；(3) 使用简单泛型 identity 函数`rows<T>(data: T): T`但不加`const`类型参数——导致枚举字面量值（如`"percentage"`）被宽化为`string`，与 pgEnum 的联合字面量类型不匹配。
- 有效修复：在 `helpers.ts` 中添加泛型 identity 函数 `rows<const T extends Record<string, unknown>[]>(data: T): T`，将所有 `.values([...])` 改为 `.values(rows([...]))`。关键设计：`const` 类型参数保留字面量类型不被宽化；函数调用边界打破 TypeScript 的 "fresh object literal" 标记，使 `.values()` 走结构兼容性检查而非严格属性检查；零运行时开销，不使用 `as any`。
- 验证方式：`npx tsc --noEmit` 输出中 seed 相关错误为 0（仅剩 `hooks.ts` 的 4 个预存错误，与 seed 无关）；`pnpm db:reset` 全量重置 11/11 模块通过；`pnpm db:seed` 增量重灌 11/11 模块通过。
- 后续约束：在 Drizzle ORM 项目中为种子数据编写 `.values()` 调用时，如果列定义使用了 `defaultRandom()`、`.default()`、`.$defaultFn()` 或 `.notNull()` 缺失，必须预期这些列不会出现在 `InferInsertModel` 中。遇到此类问题时，第一反应应该是用泛型 identity 函数打破 fresh literal check，而不是尝试修改 schema 定义或使用 `as any`。修改 `primaryId()` 的 default 实现方式不能解决这个问题——这是 Drizzle 类型系统的设计决策，不是 bug。

## 写入经验时必须保留的额外信息

如果这次 bug 与仓库已有事故模式相似，写记忆时不要遗漏下面这些额外信息：

- 这次问题是否打破了某个"用户已确认稳定"的基线
- 是否存在"不要乱改"的配置，例如 `pnpm.overrides`
- 首个可信信号来自哪里，是终端日志、浏览器 console、网络请求，还是构建输出
- 这次修复属于哪一类：依赖实例统一、废弃 API 清理、导入路径修正、类型断言补齐
- 这次是否存在误导性很强的假象，例如"看起来像版本冲突，实际是实例重复"
- 最终验证是否基于 fresh 进程、fresh 日志和 fresh 页面，而不是历史缓存

## 验证证据写法

未来写事故记录时，优先记录可重复验证的证据，而不是模糊措辞。

- 好的写法：`node_modules/.pnpm 下只有 1 个 drizzle-orm 实例目录`
- 好的写法：`pnpm exec tsc --noEmit 输出中 drizzle-orm 相关错误为 0`
- 好的写法：`4 个修复文件均无类型错误输出`
- 好的写法：`pnpm install 后 drizzle-orm 版本为 0.42.0，peer dependency 无冲突`
- 不好的写法：`应该没问题了`
- 不好的写法：`看起来像是好了`

## 不要写成什么

把根级 AI 记忆经验吸收到技能里，不等于把技能写成修复手册。下面这些内容不应该成为这个技能的主体：

- 大段命令执行流水
- 与当前仓库无关的泛化 debug 理论
- 逐条罗列所有试错过程
- 把某一次临时绕过方案包装成永久规则
- 用"必须执行这些命令"代替"应该记录哪些结论"

## 记录流程

1. 先确认 bug 已经理解清楚并且修复完成。
2. 把结果压缩成 4 到 6 条高信号事实。
3. 选对记忆落点。
4. 如果是仓库级经验，就更新根级 AI 记忆文档。
5. 用同样的结论更新 Memorix，并选对记忆类型。
6. 回读一遍文本，删掉瞬时噪音、猜测和低价值命令历史。
7. 如果用户还要求提交 commit，把提交动作交给单独的 git 工作流处理。

## 好记忆的特征

- 解释清楚"为什么会坏"，而不是只写跑了什么命令
- 明确指出第一条可信线索，说明它如何打破错误假设
- 用可复用的方式描述最终修复
- 写出未来 agent 可以重复执行的验证动作
- 让下一次排错明显更短

## 常见错误

- 根因还没确认，就开始写猜测性结论
- 写成很长的 debug 日记，而不是可复用结论
- 仓库级经验写到了错误的位置
- 没把导致绕路的错误假设写出来
- 把修复说明和记忆沉淀混在一起
- 忘了同步本地 MCP 记忆

## 边界

这个技能只负责记忆沉淀和总结。

它不能替代调试、实现、测试和修复工作流。如果 bug 还没修好，先使用合适的调试或实现技能，等结果稳定后再回到这个技能做经验沉淀。
