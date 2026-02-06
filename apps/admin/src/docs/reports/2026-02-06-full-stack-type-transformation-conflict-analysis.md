# 2026-02-06-full-stack-type-transformation-conflict-analysis

## 1. 概述 (Executive Summary)

本报告基于 "UltraThink" 模式，对 `openspec/changes/full-stack-type-transformation`（以下简称**新全栈规范**）与项目现存的文档、代码、指令系统进行了地毯式的冲突排查。

**核心结论**：
当前项目处于严重的**人格分裂**状态。

- **旧世界**：基于 "静态类型库" (`noEmit: true`) 和 "手动维护 Interface" 的理念。
- **新世界**：基于 "同构运行时库" (Zod/Drizzle) 和 "自动化类型推导" (Single Source of Truth) 的理念。

这两套理念在**架构定位**、**文件路径**、**生成指令**、**依赖管理**等所有维度上都存在致命冲突。若不进行彻底的"清洗"（Sanitation），Agent 将在旧指令的驱动下不断破坏新架构。

---

## 2. 核心定位与哲学冲突 (Fundamental Philosophy Conflicts)

| 维度                 | 旧规范 (Current Reality)                                         | 新全栈规范 (Target State)                                                                 | 冲突等级         |
| :------------------- | :--------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :--------------- |
| **`apps/type` 定位** | **纯静态类型库**<br>仅供 TS 编译时检查，运行时会被擦除。         | **同构运行时库 (Isomorphic Runtime)**<br>提供运行时的 Zod Schemas 和 Drizzle Table 定义。 | **FATAL (致命)** |
| **类型来源**         | **手动编写**<br>程序员手动声明 `interface User {...}`。          | **自动推导**<br>`type User = z.infer<typeof UserSchema>`。                                | **FATAL (致命)** |
| **Schema 归属**      | **后端私有**<br>Drizzle Schema 存放在 `apps/admin`，前端不可见。 | **全栈共享**<br>Drizzle Schema 存放在 `apps/type`，前后端均可引用。                       | **CRITICAL**     |
| **构建产物**         | **无 (`noEmit`)**<br>不需要生成 JS 文件。                        | **有 (ESM/CJS)**<br>必须生成 JS 代码供运行时执行。                                        | **CRITICAL**     |

---

## 3. 架构位置硬编码冲突 (Hardcoded Location Conflicts)

文档和工具中存在大量硬编码的路径，指向旧的目录结构。

### 3.1 Schema 存储位置

- **旧路径**: `apps/admin/server/db/schemas/**/*.ts`
- **新路径**: `apps/type/src/business/**/schema.ts` (遵循 Business Path First)

**冲突文件清单**:

1.  **`.claude/skills/neon-db-list/SKILL.md`**: 全文列出了旧路径下的表来源。Agent 依赖此文件查找表定义。
2.  **`.claude/skills/schema-and-seed-guardian/SKILL.md`**: 明确指示 "修改 schema 时请编辑 `apps/admin/server/db/schemas`"。
3.  **`apps/admin/drizzle.config.ts`**: `schema: "./server/db/schema.ts"`，导致 Drizzle Kit 无法扫描新位置。
4.  **`apps/admin/server/db/index.ts`**: 导出源指向本地文件，而非 `@01s-11comm/type`。
5.  **`openspec/specs/db-schema-core/spec.md`**: 规定 Common Schema 必须在 Admin 项目中。
6.  **`apps/admin/src/docs/guides/seed-commands.md`**: 引用了 `apps/admin/server/db/seed-sql/` 作为模块定义位置。
7.  **`apps/admin/src/docs/prompts/.../index.md`**: 指导在 `apps/admin/server/db/schema.ts` 中创建表。

### 3.2 种子生成脚本引用

- **现状**: 所有 Seed 模块 (`apps/admin/server/db/seed-sql/*.ts`) 都包含 `import { ... } from "../schemas/..."`。
- **后果**: 一旦移动 Schema 文件，通过 `pnpm db:generate-seed` 将立即报错，导致开发环境无法初始化。
- **文件**: `apps/admin/scripts/generate-seed-sql.ts` 虽然代码本身没有直接 import schema，但它依赖的 `apps/admin/server/db/seed-sql/index.ts` 及其子模块大量引用了旧 Schema。

---

## 4. 自动化指令冲突 (Operational Command Conflicts)

**这是最危险的部分**，因为它们直接控制 Agent 的行为。

### 4.1 `.claude/commands/migrate-static-data-to-nitro-query.md` (高危)

- **冲突内容**: Step 1 指令明确要求 **"创建类型定义文件... export interface {Page}ListItem {...}"**。
- **危害**: 它教导 Agent **手动编写静态类型**，直接违反了 "从 Zod Schema 推导类型" 的全栈原则。如果执行此命令，项目将退回到旧模式。

### 4.2 `.claude/skills/type-project-organization/SKILL.md`

- **冲突内容**: 仅关注 `.ts` 文件的导出规范，未提及 Zod 或 Runtime 依赖。
- **危害**: Agent 会认为在 `apps/type` 中放入 `.ts` 以外的逻辑（如 `z.object`）是错误的，甚至可能尝试"清理"这些运行时代码。

### 4.3 `openspec/specs/business-type-migration/spec.md`

- **冲突内容**: 指导将 `form.ts` 中的 Interface **搬运**到 `apps/type`。
- **危害**: 这种"搬运"只是物理移动，没有逻辑升级（Interface -> Schema）。它是制造"垃圾代码"的指南。

---

## 5. 项目配置冲突 (Project Config Conflicts)

### 5.1 `apps/type/tsconfig.json`

- **现状**: `"noEmit": true`
- **冲突**: 阻止生成 JavaScript 代码。
- **后果**: 运行时（Node.js/Backend）无法执行 Schema 代码，导致 "Module not found" 或只能读取到类型定义。

### 5.2 `apps/type/package.json`

- **现状**:
  - `dependencies`: 仅有 `@ruan-cat/utils`
  - `devDependencies`: `typescript`
- **冲突**: 缺失核心运行时依赖。
- **需求**: 必须添加 `drizzle-orm`, `zod`, `drizzle-zod` 到 `dependencies`。

### 5.3 `apps/admin/package.json`

- **现状**: `db:generate`, `db:push` 等脚本在 admin 包内运行。
- **冲突**: 数据库定义主权转移到 `apps/type` 后，这些脚本应该在 Root 运行或者在 Type 包内运行，或者调整配置以支持跨包引用。

---

## 6. 文档与认知冲突 (Documentation & Memory Conflicts)

### 6.1 `CLAUDE.md`

- **Section 4.1 "对现有类型的处理规范"**: 强调 "不允许反反复复增删... 不允许修改字段名"。
- **冲突**: 全栈改造是**破坏性重构**，必须删除旧的手动类型，替换为自动推导类型。旧规则会束缚 Agent 的手脚。

### 6.2 内部评估报告冲突 (Internal Conflict)

- **`2026-02-05-full-stack-type-transformation-assessment.md`**: 建议目录为 `apps/type/src/schemas/`。
- **`2026-02-06-full-stack-type-transformation-assessment.md`**: 建议目录为 `apps/type/src/business/` (Business Path)。
- **危害**: 两份报告在 24 小时内给出矛盾建议，Agent 无所适从。必须明确废弃前者。

---

## 7. 全面修正计划 (Comprehensive Remediation Plan)

为了解决上述冲突，必须执行以下操作：

### 7.1 DELETE / ARCHIVE (立即废弃)

以下文件应被标记为 `[DEPRECATED]` 或直接归档：

1.  `openspec/specs/type-system/spec.md` (旧的纯静态规范)
2.  `openspec/specs/business-type-migration/spec.md` (搬运式迁移规范)
3.  `openspec/specs/db-schema-core/spec.md` (旧 Schema 位置规范)
4.  `apps/admin/src/docs/reports/2026-02-05-full-stack-type-transformation-assessment.md` (被新方案取代)

### 7.2 REWRITE (立即重写)

以下核心文件必须更新以匹配新架构：

1.  **`.claude/commands/migrate-static-data-to-nitro-query.md`**: 修改 Step 1，改为 "编写 Schema 并导出类型"。
2.  **`CLAUDE.md`**:
    - 更新 `apps/type` 的定义。
    - 增加 Section: "Schema First Development" (Schema 优先开发)。
    - 豁免 Section 4.1 在重构期间的限制。
3.  **`apps/admin/drizzle.config.ts`**: 指向 `apps/type`。
4.  **`apps/type/package.json`**: 移除 `noEmit`, 添加 `dependencies`。
5.  **`.claude/skills/neon-db-list/SKILL.md`**: 更新所有 Schema 来源路径。

### 7.3 CODE MOD (批量修复)

需要运行专门的 Agent 任务来修复：

1.  **Seed Scripts**: 批量替换 `apps/admin/server/db/seed-sql/*.ts` 中的 import 路径。
2.  **API Handlers**: 将 `apps/admin/server/api` 中的 mock 引用逐步替换为真实 DB 调用。

### 7.4 SINGLE SOURCE OF TRUTH (确立唯一真理)

在所有 Prompt 和 Context 中确立：
**`openspec/changes/full-stack-type-transformation/design.md`** 是关于类型和数据库架构的**唯一权威文档**。任何与其冲突的现有文档（无论日期新旧）均无效。
