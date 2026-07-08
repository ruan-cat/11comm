# 06 及时删改 APP 项目仍旧使用的旧 nitro 接口命令 — 复核报告

复核日期：2026-07-08  
复核范围：`apps/app` 内旧 Nitro 接口命令与相关引用清理  
复核结论：通过，未发现遗留问题。

## 1. 复核项与结果

| 序号 | 复核项 | 结果 | 说明 |
|------|--------|------|------|
| 1 | `.github/workflows/app-ci.yml` 不再包含 `build:nitro:vercel` 或 `nitro-runtime` | 通过 | 全文搜索未命中；当前步骤已改为“验证 App API runtime 基址策略”，路径为 `src/tests/runtime-base/runtime-base-url.test.ts` |
| 2 | `apps/app/package.json` 的 scripts 中无 `build:nitro*`、`dev:nitro*`、`preview:nitro*`，devDependencies 中无 `nitro` | 通过 | 全文搜索 `nitro` 未命中；脚本列表仅剩 uni-app 相关命令 |
| 3 | `apps/app/server/` 目录已不存在 | 通过 | `ls` 返回 `NOT_FOUND` |
| 4 | `apps/app/scripts/dev-h5-nitro.mjs` 和 `dev-mp-weixin-nitro.mjs` 已不存在 | 通过 | `ls` 返回 `NOT_FOUND` |
| 5 | `apps/app/env/` 中无 `.env.*-nitro*` 文件；`.env` 中无 `NITRO_` 字符串 | 通过 | `find` 未命中；`.env` 内容中无 `NITRO_` |
| 6 | `apps/app/vite.config.ts` 中无 `nitro(` 或 `nitro/vite` | 通过 | 全文搜索 `nitro` 未命中 |
| 7 | `apps/app/src/tests/runtime-base/runtime-base-url.test.ts` 存在且 `apps/app/src/tests/nitro-runtime/` 已不存在 | 通过 | 新文件存在，旧目录已移除 |
| 8 | `README.md`/`AGENTS.md`/`CLAUDE.md`/`GEMINI.md` 中已退役 Nitro 命令均已标注为退役 | 通过 | 各文件在章节开头明确说明“已退役，统一后端由 `apps/api` 承接”，表格中相关命令均标注“已退役，统一后端入口迁移至 `apps/api`” |
| 9 | `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` | 通过 | 输出 `Change 'migrate-superpowers-docs-to-openspec-longtask' is valid` |
| 10 | `git diff --check` | 通过 | 无输出，无行尾问题 |

## 2. 扫描说明

- 对 `apps/app` 全目录（排除 `node_modules`、`dist`）再次扫描 `build:nitro`、`dev:nitro`、`preview:nitro` 等字符串，剩余命中仅位于：
  - `apps/app/.claude/skills/` 下的参考文档
  - `apps/app/docs/plan/` 下的历史实施计划文档
  - `apps/app/openspec/changes/archive/` 下的已归档 openspec 变更
  - `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` 中已明确标注为退役的说明段落

  以上均为历史文档或技能参考材料，不属于本次清理要求中需要删除或修改的“当前可用命令描述”。

## 3. 遗留问题

- 无。本次清理范围内各项检查均已通过。
- 注：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md` 中 Task 1174 本身仍标记为 `[ ]` 未完成状态，但其下列出的具体清理项（删除脚本、目录、环境文件、更新 CI、更新文档等）均已实际完成，且 openspec 校验通过。
