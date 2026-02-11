# 实施任务 (Implementation Tasks)

## 1. Documentation Sanitation (文档清洗)

- [x] 1.1 将 `openspec/specs/type-system/spec.md` 标记为 [DEPRECATED]，并指向 full-stack-type-transformation/design.md
- [x] 1.2 将 `openspec/specs/business-type-migration/spec.md` 标记为 [DEPRECATED]
- [x] 1.3 将 `openspec/specs/db-schema-core/spec.md` 标记为 [DEPRECATED]
- [x] 1.4 将 `apps/admin/src/docs/reports/2026-02-05-full-stack-type-transformation-assessment.md` 标记为 [Superseded]

## 2. Command & Skill Correction (指令与技能修正)

- [x] 2.1 重写 `.claude/commands/migrate-static-data-to-nitro-query.md` 步骤指令，指示生成 Zod Schema + Drizzle Table 而非 Interfaces
- [x] 2.2 更新 `.claude/skills/neon-db-list/SKILL.md` 以扫描 `apps/type/src/business/**/schema.ts`
- [x] 2.3 更新 `.claude/skills/schema-and-seed-guardian/SKILL.md` 以引导变更至 `apps/type`
- [x] 2.4 更新 `CLAUDE.md` 第 4.1 节以豁免类型改造，并更新 `apps/type` 定义为 "Runtime Library"

## 3. Infrastructure Preparation (基础设施准备)

- [x] 3.1 更新 `apps/type/package.json`：添加 `drizzle-orm`, `zod`, `drizzle-zod` 到 dependencies
- [x] 3.2 更新 `apps/type/package.json`：移除 `noEmit`，确保 `type: module`
- [x] 3.3 更新 `apps/type/tsconfig.json`：移除 `noEmit`，确保正确的 module resolution
- [x] 3.4 在 `apps/type` 中运行 `pnpm install` 以生成 lockfile 变更
- [x] 3.5 **[CODE MOD]** 批量更新 `apps/admin/server/db/seed-sql/*.ts` 的导入路径以指向 `@01s-11comm/type`（或新的相对路径），防止构建错误
      **说明**：经检查，当前所有 seed-sql 文件的导入路径已使用正确的相对路径（`from "../schemas/*"`），schemas 仍在 `apps/admin/server/db/schemas/` 目录。在 schemas 物理迁移到 `apps/type` 之前更改为 `@01s-11comm/type` 会导致构建失败。当前路径已防止构建错误，无需修改。schema 迁移将在 `full-stack-type-transformation` 变更中处理。
- [x] 3.6 **[NOTE]** 暂时**不要**更新 `apps/admin/drizzle.config.ts`。这明确推迟到 `full-stack-type-transformation` 变更，以防在文件移动前破坏 `db:generate`。
      **确认**：已确认不更新 drizzle.config.ts。

## 4. Verification (验证)

- [x] 4.1 验证 `neon-db-list` skill 内容反映了新路径
      **验证结果**：已确认 SKILL.md 包含 MIGRATION NOTICE，指向新位置 `apps/type/src/business/**/schema.ts`
- [x] 4.2 验证 `apps/type` 可以被构建/检查（即使没有逻辑代码）
      **验证结果**：`pnpm typecheck` 成功通过，无类型错误
