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

- [ ] 3.1 更新 `apps/type/package.json`：添加 `drizzle-orm`, `zod`, `drizzle-zod` 到 dependencies
- [ ] 3.2 更新 `apps/type/package.json`：移除 `noEmit`，确保 `type: module`
- [ ] 3.3 更新 `apps/type/tsconfig.json`：移除 `noEmit`，确保正确的 module resolution
- [ ] 3.4 在 `apps/type` 中运行 `pnpm install` 以生成 lockfile 变更
- [ ] 3.5 **[CODE MOD]** 批量更新 `apps/admin/server/db/seed-sql/*.ts` 的导入路径以指向 `@01s-11comm/type`（或新的相对路径），防止构建错误
- [ ] 3.6 **[NOTE]** 暂时**不要**更新 `apps/admin/drizzle.config.ts`。这明确推迟到 `full-stack-type-transformation` 变更，以防在文件移动前破坏 `db:generate`。

## 4. Verification (验证)

- [ ] 4.1 验证 `neon-db-list` skill 内容反映了新路径
- [ ] 4.2 验证 `apps/type` 可以被构建/检查（即使没有逻辑代码）
