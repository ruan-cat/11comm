# 2026-02-06-full-stack-type-transformation-conflict-analysis

## 1. 概述 (Executive Summary)

本报告基于深度检索，全面分析了 `openspec/changes/full-stack-type-transformation`（以下简称**新全栈规范**）与现行系统（包括文档、Agent 指令、构建脚本）之间的冲突。

**核心结论**：
冲突不仅存在于静态文档中，更严重地存在于**现行的自动化执行指令**（Commands & Specs）中。当前的 `apps/type` 被设计为纯静态类型库，而所有相关的迁移指令（如 `migrate-static-data-to-nitro-query`）都在强化这一过时模式。若不加干预，按照旧指令执行将导致完全背离"三位一体 Schema"的目标。

此外，**Schema 数据的存储位置**记录存在严重滞后，大量文档仍指向旧的 `apps/admin/server/db/schemas`，这对新架构是致命的误导。

---

## 2. 致命级架构冲突 (Fatality Class Conflicts)

### 2.1. `apps/type` 的本质定义冲突

| 维度           | 旧规范 (Current Reality) | 新全栈规范 (Target State)                 | 冲突影响                                                                                    |
| :------------- | :----------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------ |
| **运行时状态** | `noEmit: true` (纯静态)  | **Isomorphic Runtime** (同构运行时)       | **致命**。`schema.ts` 包含 `pgTable` 和 `z.object`，必须被编译/执行。当前配置下代码会失效。 |
| **依赖关系**   | 仅 `typescript` (devDep) | 需 `drizzle-orm`, `zod` (dependencies)    | **致命**。缺少运行时依赖，Schema 代码无法运行。                                             |
| **构建目标**   | 仅供 IDE/TSC 类型检查    | 需供 Drizzle Kit 解析 + 前端 Runtime 校验 | 需彻底重写 `tsconfig.json` 和 `package.json`。                                              |

### 2.2. 数据主权 (Data Sovereignty) 冲突

| 维度            | `apps/admin` (Current)                 | `apps/type` (Target)  | 冲突影响                                            |
| :-------------- | :------------------------------------- | :-------------------- | :-------------------------------------------------- |
| **Script 归属** | `db:generate`, `db:migrate` 均在 admin | 应转移至 type 或 root | 必须重构 `package.json` scripts。                   |
| **Deps 归属**   | 持有 `drizzle-kit`, `neon-serverless`  | 应持有核心 DB 依赖    | `apps/admin` 需卸载 DB 依赖，转而依赖 `apps/type`。 |

---

## 3. Schema 位置硬编码冲突 (Hardcoded Schema Source Conflicts)

**风险等级：Critical**
新规范要求 Schema 下沉至 `apps/type/src/business/**/schema.ts` (按业务分布)，但由于历史原因，大量核心文档和工具仍**硬编码**指向 `apps/admin/server/db/schemas`（旧集中式目录）。

### 3.1. `.claude/skills/neon-db-list/SKILL.md` (严重误导)

- **现状**: 该文档作为"表中枢"，详细列出了所有表及其来源，全部指向 `apps\admin\server\db\schemas\*.ts`。
- **冲突**: 全栈改造后，这些路径将全部失效。
- **风险**: 如果 Agent 依赖此列表来查找表定义，它将**找不到任何新表**，或者错误地在旧位置创建表，导致新旧 Schema 分裂。

### 3.2. `.claude/skills/schema-and-seed-guardian/SKILL.md` (操作误导)

- **现状**: "在修改或新增 schema 定义时 (`apps/admin/server/db/schemas/*.ts`)..."
- **冲突**: 该技能明确指定了错误的修改位置。
- **风险**: Agent 在执行 "Add new column" 任务时，会习惯性地去修改旧文件，而不是新业务目录下的 Schema。

### 3.3. `openspec/specs/db-schema-core/spec.md` (架构误导)

- **现状**: "系统 SHALL 在 `apps/admin/server/db/schemas/common.ts` 提供公共..."
- **风险**: 强化了旧目录的合法性，阻碍了 Schema 的业务化拆分。

### 3.4. `apps/admin/drizzle.config.ts` (运行时错误)

- **现状**: `schema: "./server/db/schema.ts"`
- **冲突**: Drizzle Kit 将继续读取旧目录下的 schema 导出文件。
- **修正**: 需指向 `apps/type` 的编译产物或源码入口（视 Drizzle Kit 对 Workspace 支持而定）。

### 3.5. `tools & guides` 硬编码列表

以下文档也包含硬编码的旧路径：

- `apps/admin/src/docs/guides/seed-commands.md`: Section 1.2 Explicitly lists `apps/admin/server/db/seed-sql/` as module definition path.
- `apps/admin/src/docs/prompts/各种杂项/2026-1-15-drizzle-neon/index.md`: 指导在 `apps\admin\server\db\schema.ts` 中创建表。
- `apps/admin/src/docs/reports/2026-02-06-schema-refactoring-rationale.md`: 上下文和示例代码依然基于旧的目录结构。
- `apps/admin/src/docs/reports/2026-02-05-init-neon-db-schema-exploration-report.md`: 明确指导在 `apps\admin\server\db\schemas` 下创建文件。

### 3.6. 过时的迁移报告

- `apps/admin/src/docs/reports/2026-02-03-nitro-drizzle-migration-report.md`: 该报告作为"新标准"，虽然引入了 Drizzle，但并未预见 `apps/type` 的运行时化改造，依然隐式假设 Schema 在 `apps/admin` 下。
- `apps/admin/src/docs/reports/2026-02-05-full-stack-type-transformation-assessment.md`: 提出的 `src/schemas` 目录结构与最终的 `src/business` 规范冲突，需废弃。
- `apps/admin/src/docs/reports/2026-02-06-full-stack-type-transformation-assessment.md`: Section 2 / Q2: 指出“不做 `src/db/schemas`，要做 `src/business`”。这与上一份报告（2026-02-05 版）直接冲突。对于 Agent 来说，这是**两个矛盾的实施指令**。

---

## 4. 现行指令与中间态规范冲突 (Operational Conflicts)

### 4.1. `.claude/commands/migrate-static-data-to-nitro-query.md` (高危)

此命令文件是当前主要的迁移 SOP。

- **严重冲突**: Step 1 明确指示 **"手动编写 Interface"** (`export interface {Page}ListItem {...}`)。
- **后果**: 如果 Agent 执行此命令，会生成大量的静态 Interface，而不是我们需要的 `zod` Schema 和 `pgTable` 定义。这与"三位一体"完全背道而驰。

### 4.2. `openspec/specs/business-type-migration/spec.md` (高危)

- **严重冲突**: 指导将 `form.ts` 中的 `interface XXXFormVO` 搬运到 `apps/type`。
- **后果**: 这种"搬运"只是物理位置移动，没有进行"逻辑升维"（从 Type 升级为 Schema）。它会污染 `apps/type`，使其充斥着过时的静态接口，阻碍 Schema 的推导。

### 4.3. `scripts/generate-seed-sql.ts` & Seed Modules (编译/运行错误)

- **现状**: Seed 脚本大量引用 `import { ... } from "../schemas/community";` (指向旧目录)。
- **冲突**: Schema 迁移后，所有这些 import 都会报错，导致 `db:generate-seed` 彻底瘫痪。
- **修正**: 必须重写所有 Seed 脚本的 import 路径，使其指向 `@01s-11comm/type`（或相对路径下的新位置，如果在同一 workspace 下）。

---

## 5. 综合修正计划 (Remediation Plan)

鉴于冲突范围之广，建议在执行全栈类型改造前，先执行一次**"规范清洗" (Spec Sanitation)**：

1.  **Blocker 清除**:
    - 在 `migrate-static-data-to-nitro-query.md`, `neon-db-list/SKILL.md`, `schema-and-seed-guardian/SKILL.md` 顶部添加 **[DEPRECATED: Use full-stack-type-transformation]**。

2.  **Schema 位置纠正**:
    - **必须**创建一个新的 Skill 或更新 `neon-db-list`，反映新的 `apps/type/src/business/**/schema.ts` 结构。
    - 更新 `package.json` 中的 `db:generate` 脚本，使其 config 指向新的 schema export (apps/type/src/index.ts)。

3.  **Infrastructure 升级**:
    - 修改 `apps/type/package.json`: 移除 `private: true`, 移除 `noEmit`。添加 `drizzle-orm`, `zod` 依赖。

4.  **Codemod 预警**:
    - Seed 脚本的重构工作量巨大（涉及所有 `generate*Sql` 函数的 import 修正），需规划专门的 Agent 进行批量修复。
5.  **Docs Marking**:
    - 为旧报告如 `2026-02-05-full-stack-type-transformation-assessment.md` 添加头部注记：_"Superseded by 2026-02-06-full-stack-type-transformation-assessment.md & openspec design."_
    - 为 `2026-02-06-full-stack-type-transformation-assessment.md` 添加注记：_"This is the current philosophical guide, but technical details are in openspec/changes/full-stack-type-transformation/design.md."_

日志如下：

```log
已完成全栈类型改造冲突的深度分析（终极版）。
- 发现 2026-02-05 和 2026-02-06 两份评估报告关于目录结构的直接冲突。
- 确认大量旧报告（2026-02-03）隐式依赖旧 Schema 路径。
- 最终确认：必须以 openspec/changes/full-stack-type-transformation/design.md 为唯一真理，并废弃其他矛盾文档。
- 生成最终报告: apps/admin/src/docs/reports/2026-02-06-full-stack-type-transformation-conflict-analysis.md
```
