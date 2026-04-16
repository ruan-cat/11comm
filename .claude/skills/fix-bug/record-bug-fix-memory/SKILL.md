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

### `apps/type` 的软删除与唯一索引冲突事故

- 问题现象：带软删除的表在用户删除记录后无法重新添加相同值，唯一索引报冲突。
- 实际根因：标准唯一索引会将软删除的记录（`deletedAt` 非空）纳入检查范围，违反了"删除后可重新添加"的业务预期。
- 关键误导点：误认为软删除只是逻辑删除，不影响唯一性约束。实际上 PostgreSQL 的唯一索引默认检查所有行，包括已软删除的行。
- 有效修复：为唯一索引添加部分索引条件 `WHERE deleted_at IS NULL`，使唯一性检查仅覆盖未删除的记录。
- 验证方式：在数据库层验证唯一索引定义包含 `WHERE deleted_at IS NULL` 条件；软删除后重新插入相同值不报错。
- 后续约束：所有带软删除的表的唯一索引必须添加 `WHERE deleted_at IS NULL` 条件。缺失外键约束的表需补全 `.references()` 定义。

### `apps/type` 的外键约束类型不匹配导致迁移失败事故

- 问题现象：`drizzle-kit migrate` 命令失败，报错外键约束类型不匹配（text vs uuid）。
- 实际根因：初始迁移文件中 `ownerId` 被定义为 text 类型，但目标字段 `hp_owners.id` 是 uuid 类型，PostgreSQL 不允许跨类型外键。
- 关键误导点：误认为可以通过新迁移文件修复旧迁移的错误。实际上 Drizzle 要求迁移按顺序应用，旧迁移中的类型错误无法被后续迁移"覆盖"。
- 有效修复：删除错误的迁移文件目录，修正 Schema 定义中的字段类型，重新生成初始迁移。
- 验证方式：`pnpm db:migrate` 成功；使用 Neon MCP 工具查询数据库表确认外键约束存在且类型一致。
- 后续约束：Schema 修正前必须审查外键关联字段的类型一致性。开发环境迁移失败时优先重置迁移历史（删除迁移目录重新生成），而非试图用新迁移修复旧迁移。

### `apps/admin` 的 FieldValues 与 FormVO 类型兼容性事故

- 问题现象：88 个使用 `as FieldValues` 的文件中仅 2 个报 TS 错误，现象无法完全解释。
- 实际根因：TypeScript 编译器对交叉类型的兼容性检查存在不一致行为，可能与 vue-tsc 特殊处理有关。大部分 FormVO 类型恰好满足 `FieldValues` 的结构约束，但少数类型因缺少索引签名而不兼容。
- 关键误导点：误认为所有 FormVO 都需要索引签名，实际上大部分不需要。也容易误归因为其他类型修复的连带效应。
- 有效修复：仅为报错的 2 个类型添加索引签名 `[key: string]: any`。
- 验证方式：`pnpm typecheck` 通过，FieldValues 相关错误消除。
- 后续约束：新增 FormVO 类型建议添加索引签名以保持一致性。在统计类型错误修复结果时，要明确区分"目标错误"和"已有的无关错误"，避免把已有错误算入修复失败的范围。

### `apps/admin/server` 的 Nitro 接口测试环境配置事故

- 问题现象：Nitro 接口测试无法在 jsdom 环境中运行，缺少数据库连接能力。
- 实际根因：jsdom 环境缺少 Node.js 原生模块和数据库连接，后端接口测试需要独立的 node 环境。
- 关键误导点：误认为可以在 jsdom 中测试后端接口。前端组件测试和后端接口测试的运行环境需求完全不同。
- 有效修复：配置 `vitest.config.ts` 条件切换（`--node` 参数区分环境），为 node 环境配置 Neon 数据库连接。
- 验证方式：`pnpm test:nitro` 命令成功运行接口测试。
- 后续约束：后端接口测试必须使用 node 环境；前端组件测试继续使用 jsdom。两种测试不要混在同一个 vitest 配置中。

### `apps/admin/server/db/seed` 的 Schema 冗余字段与 Patch 脚本脆弱性事故

- 问题现象：Seed 流程使用 7 个 Patch 脚本修改生成的 SQL，正则表达式处理 SQL 字符串频繁出错。
- 实际根因：Schema 定义包含大量冗余字段（如 `ct_changes` 中的 `contractName`、`contractNumber` 等），Patch 脚本试图在生成后删除它们，导致流程复杂且脆弱。
- 关键误导点：误认为应该保留 Patch 脚本并修复其中的 bug。实际上问题出在 Schema 定义本身——冗余字段不应该存在。
- 有效修复：从 Schema 中移除冗余字段，废弃所有 Patch 脚本，使 Seed 流程直接生成正确的 SQL。
- 验证方式：Seed 流程原子化，直接生成正确的 SQL 无需后处理；`pnpm db:seed` 全量通过。
- 后续约束：Schema 定义必须与实际业务需求一致，避免冗余字段。禁止使用正则表达式修改生成的 SQL——如果需要修改生成的 SQL，说明 Schema 定义有问题。

### `apps/type` 的跨层级模块循环依赖导致外键缺失事故

- 问题现象：`hpInvoices.payment_id` 缺少物理外键约束，数据完整性无法在数据库层保证。
- 实际根因：`house-property.ts`（Level 2）需要引用 `expense.ts`（Level 4）中的支付记录，直接添加外键会导致循环依赖。
- 关键误导点：误认为可以直接添加外键引用，忽略了模块分层架构的约束。
- 有效修复：将 `hpInvoices` 表迁移至 `expense.ts` 模块，或创建新的 Level 5 `finance-archive` 模块来打破循环。
- 验证方式：数据库层验证外键约束存在；模块依赖图无循环。
- 后续约束：模块依赖必须遵循分层架构，低层级模块不得引用高层级模块。跨层级引用需要重新组织模块结构，而非强行添加外键。

### 仓库级 Git：Windows CRLF 行尾与「幽灵 modified」事故

- 问题现象：某文件（例如 `apps/admin/src/views/login/utils/motion.ts`）在 `git status` 中反复显示为已修改，但 `git diff` 看起来「每一行都变了」、语义却完全相同；或出现「diff 为空但仍显示 modified」的循环。其他项目（如 monorepo）也可能出现同类现象。
- 实际根因：索引中的 blob 为 LF（`i/lf`），工作区磁盘文件为 CRLF（`w/crlf`）。项目若长期缺少 `.gitattributes` 统一 `eol`，而全局 `core.autocrlf=false`，则 IDE、杀毒、历史 checkout 等可能把文件写成 CRLF；CRLF 与 LF 的物理字节数不同（每行多 `\r`），stat 缓存难以稳定命中，Git 反复重检，表现为「幽灵」修改。
- **二次复发根因（2026-03-25）**：即使 `.gitattributes` 和 `.editorconfig` 都已正确配置 `eol=lf`，如果 Prettier 的 `endOfLine` 设为 `"auto"`，Prettier 在 Windows 上仍会保留/引入 CRLF。同时若 `.vscode/settings.json` 缺少 `"files.eol": "\n"`，VSCode/Cursor 在 Windows 上默认使用 CRLF 打开文件，再由 `endOfLine: "auto"` 的 Prettier 保留 CRLF 行尾写回磁盘。这形成了一个 `.gitattributes` 无法拦截的 CRLF 回注链：`git checkout (LF) → 编辑器打开 (转 CRLF) → Prettier 保存 (保留 CRLF) → git status (幽灵 modified)`。
- 关键线索：`git ls-files --eol <路径>` 显示 `i/lf w/crlf` 即可确诊；也可用 `node -e` 对比文件字节数与 blob 字节数（CRLF 的文件比 LF 的 blob 多出 `\r` 个数的字节）。不要用「三个 hash 一致」排除 CRLF——`git hash-object` 默认按 `.gitattributes` 做 clean filter 归一化后计算 hash，与磁盘是否 CRLF 无关。
- 关键误导点：（1）`.gitattributes` 已存在且配置正确，容易误以为「行尾配置已完善，不可能是 CRLF 问题」——实际上 `.gitattributes` 只管 Git 的 clean/smudge 层，不管编辑器和格式化工具的行为。（2）`git diff` 输出为空容易让人往权限、encoding、stat 缓存等方向排查——实际上 `git diff` 默认做 text 归一化对比，CRLF vs LF 会被吞掉。（3）误以为 `git checkout -- .` 或反复 `git add` 能根治；若 Prettier/编辑器仍在写 CRLF，下次保存就会复发。
- 有效修复：（1）在仓库根新增 `.gitattributes`，对文本统一 `* text=auto eol=lf`（并声明常见二进制后缀为 `binary`）；（2）**将 `prettier.config.mjs` 的 `endOfLine` 从 `"auto"` 改为 `"lf"`**——这是阻断 CRLF 回注链的关键一环；（3）**在 `.vscode/settings.json` 添加 `"files.eol": "\n"`**——防止编辑器在 Windows 上默认以 CRLF 打开文件；（4）对仍显示 `w/crlf` 的已跟踪文件，用工具将内容写回 LF（例如 Node.js 读 Buffer → 将 `\r\n` 替换为 `\n` → 写回）；（5）执行 `git add --renormalize .` 刷新索引与 stat 缓存；（6）一次性提交所有归一化结果。
- 验证方式：文件字节数与 `git cat-file -p <blob-hash>` 的字节数一致（说明磁盘 LF = blob LF）；`git status` 干净；`git update-index --refresh` 无 `needs update` 输出。
- 后续约束：在 Windows 上遇到「莫名其妙多出的修改」时，按优先级排查：① `git ls-files --eol` 看工作区行尾；② Prettier 的 `endOfLine` 是否为 `"lf"`（`"auto"` 在 Windows 上是定时炸弹）；③ `.vscode/settings.json` 是否有 `"files.eol": "\n"`；④ `.gitattributes` 是否存在 `eol=lf`。四层配置必须协同一致，缺一层就可能复发。不要把此类问题记成「某 AI 误改」——优先从行尾配置栈排查。

### `.github/workflows` 的 pnpm v10 `--` 参数透传导致 CLI 子命令参数解析失败事故

- 问题现象：GitHub Actions 中 `vercel-deploy-tool.yaml` 工作流部署失败，报错 `error: too many arguments for 'deploy'. Expected 0 arguments but got 2.`，实际执行的命令为 `vdt deploy -- --diff-base ef2fee6...`。同时 dotenvx 打印 `[MISSING_ENV_FILE] missing .env file` 警告（该警告为非致命的次要问题）。
- 实际根因：工作流中使用 `pnpm run deploy -- --diff-base ${{ github.event.before }}` 传递参数。在 pnpm v10 中，`--` 分隔符会被**原样透传**到脚本命令中（与 npm 不同，npm 会消费掉 `--`）。而 `deploy` 脚本为 `dotenvx run -f apps/admin/.env.production -f .env -- vdt deploy`，其中已有一个 `--` 用于分隔 dotenvx 选项与子命令。pnpm 追加的 `-- --diff-base ef2fee6` 使最终执行变为 `vdt deploy -- --diff-base ef2fee6`，commander.js 在遇到 `--` 后停止选项解析，将 `--diff-base` 和 `ef2fee6` 当作位置参数处理，而 `deploy` 子命令定义了 0 个位置参数，因此报错。
- 关键误导点：容易误以为 `vdt deploy` 不支持 `--diff-base` 选项，或误以为 `dotenvx` 的 `.env` 缺失警告是主要错误。实际上 `vdt deploy` 完整支持 `--diff-base <ref>`、`--force-all`、`--env-path <path>` 三个选项（commander 定义），问题纯粹出在 pnpm 的 `--` 透传行为上。
- 有效修复：将工作流中 `pnpm run deploy -- --diff-base ${{ github.event.before }}` 改为 `pnpm run deploy --diff-base ${{ github.event.before }}`（移除 `--`）。pnpm v10 中脚本名后面的选项会直接追加到脚本命令末尾，不需要 `--` 分隔符。
- 验证方式：工作流重新触发后，`vdt deploy --diff-base <ref>` 正确解析选项，部署流程正常完成。
- 后续约束：在 pnpm v10+ 的 CI 工作流中，通过 `pnpm run <script>` 向脚本传递额外选项时，**不要使用 `--` 分隔符**——pnpm 会将 `--` 原样透传到脚本命令中，可能导致 commander.js 等 CLI 框架将后续选项误判为位置参数。直接写 `pnpm run <script> --flag value` 即可。当脚本内部已使用 `--` 分隔符（如 `dotenvx run ... -- subcommand`）时，额外的 `--` 会产生双重分隔，破坏子命令的选项解析。

### 2026-04-15 合同上传链路的浏览器直传 R2 联调事故

- 问题现象：`draft-contract` 和 `change` 页面里的分段上传在浏览器中会停在失败态，前端能拿到 `init/status/sign-part` 响应，但文件始终无法真正上传完成。
- 根因：断点续传链路有两个前置条件必须同时成立。第一，Neon 目标库必须已经存在 `ct_upload_sessions` / `ct_upload_parts` 等表，否则 `upload/init` 会直接因为 relation 不存在而失败。第二，Cloudflare R2 bucket 必须允许本地开发源站的 CORS 预检，否则浏览器对 presigned URL 的 `OPTIONS` / `PUT` 会被拦截。
- 关键误导点：页面 toast 和本地状态不足以证明上传链路可用。真正可信的信号是浏览器 Network 面板里的真实请求顺序：`upload/init -> upload/status -> upload/sign-part -> OPTIONS presigned-url -> PUT presigned-url`。
- 有效修复：先执行数据库迁移，确保上传会话表已经存在；再为 R2 bucket 配置允许 `http://localhost:8080` 的跨域规则，至少覆盖 `PUT`、`GET`、`HEAD`，并保证预检请求可通过。
- 验证方式：浏览器里能连续看到 `init/status/sign-part/complete` 成功；R2 presigned URL 的 `OPTIONS` 不再返回 403；文件在页面内可新增、回显、删除，且对象真实落到 bucket 对应业务目录。
- 后续约束：以后遇到“前端看起来像上传坏了”的问题，先用浏览器网络请求拆开控制面和数据面，不要先改页面组件。断点续传是否可用，必须以浏览器真实 `OPTIONS/PUT` 和服务端真实 `complete` 为准。

### 2026-04-15 `r2-env.ts` 与 Vercel / R2 环境变量误判事故

- 问题现象：实现 R2 上传时，容易误以为 Vercel 会像 Marketplace 集成一样自动注入 Cloudflare R2 所需环境变量，导致服务端代码设计成“平台自动提供”。
- 根因：Cloudflare R2 并不是 Vercel 内建托管存储，本项目使用的是 Cloudflare 自己的 S3 兼容凭据。Vercel 这里只是普通宿主平台，`process.env` 里拿到的值全部来自项目自定义环境变量，而不是平台预置变量。
- 关键误导点：看到部署平台是 Vercel，容易把“在 Vercel 上运行”误解成“Vercel 会自动知道 Cloudflare R2 的 bucket、endpoint、access key”。
- 有效修复：把 `R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_PUBLIC_BASE_URL` 明确配置为 Vercel 项目的自定义 env，并让 `r2-env.ts` 只负责读取和校验这些值。
- 验证方式：服务端启动时不再缺少 R2 配置；`sign-part` 和 `complete` 能基于这些 env 正常生成 presigned URL 并完成 multipart 上传。
- 后续约束：以后再提到“Vercel 里如何获取 Cloudflare R2 信息”，默认答案应该是“从项目自定义环境变量读取”，不要再写成仿佛 Vercel 平台会自动提供。

### 2026-04-15 `ct_upload_sessions.r2_upload_id` 长度建模错误事故

- 问题现象：`upload/init` 走到创建 multipart upload 后，数据库写入上传会话失败，表现为字段长度超限或后续链路异常。
- 根因：Cloudflare R2 返回的 multipart `UploadId` 实测长度可以明显超过 255；把 `ct_upload_sessions.r2_upload_id` 建成 `varchar(255)` 是错误建模。
- 关键误导点：一开始容易怀疑是脏数据或某次异常返回，但真实联调时拿到的 `UploadId` 长度达到 300+，说明问题在 schema 上限本身。
- 有效修复：把 `r2_upload_id` 从 `varchar(255)` 改为 `text`，并生成对应迁移。
- 验证方式：`upload/init` 成功创建上传会话并落库，后续 `status/sign-part/complete` 能基于同一 `uploadId` 继续执行。
- 后续约束：面对第三方云厂商返回的 opaque token、upload id、cursor 之类字段时，优先用 `text` 建模，不要先拍脑袋给一个 255 长度上限。

### 2026-04-15 Windows 终端乱码与源码真实乱码混淆事故

- 问题现象：PowerShell 或工具输出中的中文会显示成乱码，随后如果把终端里显示坏掉的文本重新写回源码，就会把原本正常的中文注释、JSDoc、i18n 文案真正污染成乱码。
- 根因：终端显示层编码和文件实际 UTF-8 内容不是一回事；真正危险的不是“终端看起来乱码”，而是 agent 误把显示层乱码当成文件真实内容，再复制写回代码。
- 关键误导点：看到 `Get-Content` 输出乱码，很容易误以为文件本身已坏，进而做出过度修复，删改掉原有中文注释、JSDoc 或 i18n。
- 有效修复：修改前先以文件内容为准，不以终端显示为准；改完后显式扫描真实源码里是否出现替换字符 `�`、不应存在的 `\\uXXXX` 转义，必要时用测试和 diff 交叉确认。
- 验证方式：目标文件中不存在真实的 `�` 替换字符；locale 文件没有新引入的 `\\uXXXX`；页面和测试里展示的中文正常；原有中文注释和 JSDoc 没被误删。
- 后续约束：以后修中文相关问题时，先区分“终端显示乱码”与“文件内容乱码”。禁止把终端乱码直接拷回源码；禁止在 locale 文件里无必要地写 `\\uXXXX`；禁止借着“修乱码”顺手删掉已有中文注释或 JSDoc。

### 2026-04-15 合同附件元数据回填遗漏事故

- 问题现象：`change` 业务新增或修改附件后，详情接口返回的附件记录里 `contractNumber` 和 `contractName` 为空，页面显示成不完整的文件说明。
- 根因：服务端在把附件表记录物化成 `AttachmentDetailItem` 时，把合同元数据写死成空字符串，没有从所属合同记录透传。
- 关键误导点：上传、保存、删除本身都能成功，容易让人误以为后端数据完整；实际上问题发生在 detail materialization，而不是上传链路。
- 有效修复：在 `change-service.ts` 中构造附件详情时，把所属合同的 `contractNumber` 和 `contractName` 作为上下文统一传入 DB 链路和内存回退链路。
- 验证方式：Nitro 测试显式断言附件详情返回正确的合同编号与合同名称；页面详情回显不再出现空值。
- 后续约束：以后新增附件类返回结构时，要把“列表记录”和“详情 VO”分开检查，尤其注意物化层是否遗漏业务上下文字段。

## 写入经验时必须保留的额外信息

如果这次 bug 与仓库已有事故模式相似，写记忆时不要遗漏下面这些额外信息：

- 这次问题是否打破了某个"用户已确认稳定"的基线
- 是否存在"不要乱改"的配置，例如 `pnpm.overrides`
- 首个可信信号来自哪里，是终端日志、浏览器 console、网络请求，还是构建输出
- 这次修复属于哪一类：依赖实例统一、废弃 API 清理、导入路径修正、类型断言补齐、Schema 设计缺陷修正、迁移文件重置、测试环境配置修正、Seed 流程简化、模块分层重组、Git 行尾归一化与 `.gitattributes`、格式化工具行尾配置矛盾、CI 工作流参数透传错误
- 这次是否存在误导性很强的假象，例如"看起来像版本冲突，实际是实例重复"
- 最终验证是否基于 fresh 进程、fresh 日志和 fresh 页面，而不是历史缓存

## 验证证据写法

未来写事故记录时，优先记录可重复验证的证据，而不是模糊措辞。

- 好的写法：`node_modules/.pnpm 下只有 1 个 drizzle-orm 实例目录`
- 好的写法：`pnpm exec tsc --noEmit 输出中 drizzle-orm 相关错误为 0`
- 好的写法：`4 个修复文件均无类型错误输出`
- 好的写法：`pnpm install 后 drizzle-orm 版本为 0.42.0，peer dependency 无冲突`
- 好的写法：`git ls-files --eol` 中目标文件不再出现 `w/crlf`，`git status` 无未提交变更
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
