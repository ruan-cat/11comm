## Why

项目从 Vue2（gitee-example）迁移到 Vue3（uni-app + TypeScript + Vite5）已进行一段时间，但随着迁移任务量大、模块分散，当前各模块的实际迁移完成度、代码质量和 Skills 合规性缺乏系统性评估，需要一次全面的「迁移进度核查」来明确下一步工作重心。

## What Changes

- 对照 `docs/prompts/route-migration-map.yml` 中全部 140 个页面，逐模块核查是否已存在对应的 Vue3 迁移文件
- 对已存在的迁移文件，逐页面检查是否满足项目级别 Skills 技能规范（code-migration、component-migration、style-migration、api-migration、use-wd-form、z-paging-integration、api-error-handling、beautiful-component-design）
- 汇总输出一份详细的迁移进度报告，写入 `docs/reports/2026-03-03-migration-progress-report.md`

## Capabilities

### New Capabilities

- `migration-existence-check`：核查迁移映射表中每个目标文件是否实际存在于 Vue3 项目中，给出「已迁移 / 未迁移 / 部分」状态
- `migration-quality-check`：对已存在的迁移文件进行 Skills 合规性深度检查，验证 Vue3 Composition API、wot-design-uni 组件、UnoCSS 样式、Alova API 等规范的遵守情况
- `migration-report-generation`：基于以上两项检查结果，生成结构化的 Markdown 进度报告

### Modified Capabilities

（无，本次仅新增检查类能力，不修改现有规格）

## Impact

- 读取范围：`docs/prompts/route-migration-map.yml`（140 个映射条目）、`src/pages/**/*.vue`、`src/pages-sub/**/*.vue`
- 输出文件：`docs/reports/2026-03-03-migration-progress-report.md`
- 不修改任何业务代码，纯检查 + 报告任务
- 涉及的 Skills 文件：所有 `.claude/skills/` 下的迁移类技能文档
