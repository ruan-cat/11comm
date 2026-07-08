<!-- 非常有价值的报告 不予删除 -->

# 2026-07-08 APP 项目旧 Nitro 接口退役残留扫描报告

> 当前状态：
>
> - `apps/admin` 与 `apps/app` 的内置 Nitro 接口已评估可退役，统一后端由独立 `apps/api` 项目承接。
> - 此前 GitHub Actions 报错 `pnpm -F @01s-11comm/app run build:nitro:vercel` 不存在，`.github/workflows/app-ci.yml` 已删除该步骤（commit `c7112831`）。
> - 本次扫描覆盖 `apps/app/` 与 `.github/workflows/`，区分「必须清理的代码/配置」与「仅作为历史记录保留的文档」两类。

---

## 核心结论

1. `apps/app/package.json` 中仍残留 3 条带 `nitro` 名称的脚本，以及 `nitro` 的 `devDependency`。
2. `apps/app/scripts/` 中仍保留 2 个以 `nitro` 命名的编排脚本，它们已改为启动 `apps/api`，但文件名和脚本名继续传播旧概念。
3. `apps/app/server/` 目录整体仍是内置 Nitro 实现，包括 handlers、routes、modules、shared runtime 等，退役后应当整体删除。
4. `apps/app/turbo.json` 已无 `build:nitro*` 任务定义，但 `apps/app/env/` 中仍有 Nitro 专用环境文件。
5. `.github/workflows/` 中已无调用 `app` 的 `build:nitro*` 构建步骤，但 `app-ci.yml` 仍运行 `src/tests/nitro-runtime/runtime-base-url.test.ts`，测试路径和步骤名称带有 Nitro 历史痕迹。
6. 大量历史文档（`docs/plan/`、`openspec/changes/archive/`、`.claude/skills/` 的 bug-fix memory）应保留为历史记录，无需修改。
7. 活跃文档 `README.md` 与 AI 记忆文件 `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` 仍把 `dev:nitro`、`build:nitro:node`、`preview:nitro` 描述为可用命令，需要更新或标注为已退役。

---

## 一、必须删除或修改的代码/配置

### 1. `apps/app/package.json`（脚本与依赖）

- `scripts.dev:h5:nitro`（第 29 行）：`node ./scripts/dev-h5-nitro.mjs`
- `scripts.dev:nitro`（第 30 行）：`node ./scripts/dev-h5-nitro.mjs`
- `scripts.dev:mp-weixin:nitro`（第 31 行）：`node ./scripts/dev-mp-weixin-nitro.mjs`
- `devDependencies.nitro`（第 185 行）：`"3.0.260311-beta"` — 内置 Nitro 退役后应当移除。

**说明**：`build:nitro`、`build:nitro:node`、`build:nitro:vercel`、`preview:nitro` 已在此前清理中移除，当前仅剩 3 条 `dev:*:nitro` 脚本。

### 2. `apps/app/scripts/`

- `D:/code/ruan-cat/01s-11comm/apps/app/scripts/dev-h5-nitro.mjs`
- `D:/code/ruan-cat/01s-11comm/apps/app/scripts/dev-mp-weixin-nitro.mjs`

**说明**：两个脚本内部已改为编排独立 `apps/api` + 前端，顶部注释也写明「app 内置 Nitro 已退役；该脚本只编排独立 apps/api 与 H5/小程序前端」。建议：
- 重命名为 `dev-h5-with-api.mjs` / `dev-mp-weixin-with-api.mjs`（或删除，改用 `turbo`/`concurrently` 等标准方案），
- 同步更新 `package.json` 脚本名，避免继续传播 `nitro` 概念。

### 3. `apps/app/server/`（内置 Nitro 实现整体）

目录与关键文件：

- `D:/code/ruan-cat/01s-11comm/apps/app/server/handlers/legacy-dispatch.ts`
- `D:/code/ruan-cat/01s-11comm/apps/app/server/routes/index.get.ts`
- `D:/code/ruan-cat/01s-11comm/apps/app/server/routes/__nitro/health.get.ts`
- `D:/code/ruan-cat/01s-11comm/apps/app/server/shared/runtime/`
  - `endpoint-catalog.ts`
  - `endpoint-registry.ts`
  - `memory-repository.ts`
  - `mock-definition-adapter.ts`
  - `nitro-request-context.ts`
  - `pilot-endpoints.ts`
  - `runtime-endpoints.ts`
- `D:/code/ruan-cat/01s-11comm/apps/app/server/modules/*/endpoints.ts`

**说明**：这是此前为 APP 内置 Nitro 接口建立的完整运行时。统一后端已迁移到 `apps/api`，`server/` 目录失去维护价值，建议整体删除。

### 4. `apps/app/env/` 中 Nitro 专用环境文件

- `D:/code/ruan-cat/01s-11comm/apps/app/env/.env.development-nitro`
- `D:/code/ruan-cat/01s-11comm/apps/app/env/.env.development-nitro-api`
- `D:/code/ruan-cat/01s-11comm/apps/app/env/.env.production-nitro-api`

以及 `D:/code/ruan-cat/01s-11comm/apps/app/env/.env` 中的：

- `NITRO_DATA_SOURCE = 'mock'`（第 16 行）
- `NITRO_PORT = 3101`（第 17 行）

**说明**：`NITRO_DATA_SOURCE`、`NITRO_PORT` 随着内置 Nitro 退役而失去作用，建议移除；`VITE_API_RUNTIME` 相关环境变量需要结合前端是否仍保留多运行时切换能力决定。

### 5. `apps/app/vite.config.ts` 中的 Nitro 条件加载

`vite.config.ts` 中按 `VITE_API_RUNTIME` 动态装载 `mockDevServerPlugin` 或 `nitro()` 的逻辑。若多运行时模型随 Nitro 退役而收缩为「mock / 直连统一 API」两种，则 Nitro 分支应当删除。

### 6. `apps/app/src/tests/nitro-runtime/`

- `D:/code/ruan-cat/01s-11comm/apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`

**说明**：该文件实际测试的是 `runtime-base` 模块的基址解析逻辑，并非 Nitro 专属。但目录名和测试用例（如 `nitro-standalone`、`nitro-vite`）仍带有 Nitro 历史。建议：
- 将目录重命名为 `runtime-base/` 或 `api-runtime/`，
- 移除 Nitro 专用运行时用例，保留 mock / 统一 API 相关用例。

### 7. `.github/workflows/app-ci.yml` 的步骤名称

第 51-52 行：

```yaml
- name: 验证 App API runtime 策略
  run: pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

**说明**：步骤名中的「Nitro runtime 策略」已不再准确，且测试路径含 `nitro-runtime`。在测试路径重命名后，这里需要同步更新。

### 8. 活跃文档与 AI 记忆文件中的命令描述

需要更新为「已退役」或「已迁移到 `apps/api`」：

- `D:/code/ruan-cat/01s-11comm/apps/app/README.md` 第 1.2、1.4、1.5 节及命令清单表。
- `D:/code/ruan-cat/01s-11comm/apps/app/AGENTS.md` 第 926 行：`dev:nitro`、`build:nitro:node`、`preview:nitro` 描述。
- `D:/code/ruan-cat/01s-11comm/apps/app/CLAUDE.md` 第 926 行：同 AGENTS.md。
- `D:/code/ruan-cat/01s-11comm/apps/app/GEMINI.md` 第 926 行：同 AGENTS.md。

**建议做法**：在这些文件对应位置添加「历史命令」或「已退役」标注，并指向 `apps/api` 作为新的统一后端入口。

---

## 二、仅作为历史记录保留，建议不修改的文档

以下文件属于过去实施计划、技能记忆或归档文档，保留 Nitro 改造历史有利于后续追溯。不应作为「退役不干净」处理。

### 1. 实施计划文档

- `D:/code/ruan-cat/01s-11comm/apps/app/docs/plan/2026-03-28-add-nitro-api-runtime.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/plan/2026-03-29-vercel-dual-project-deployment.md`

### 2. 提示词与迁移文档

- `D:/code/ruan-cat/01s-11comm/apps/app/docs/prompts/init-turbo/index.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/prompts/migrate-plan/01.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/prompts/migrate-plan/home/index.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/prompts/use-nitro/index.md`

### 3. OpenSpec 归档

- `D:/code/ruan-cat/01s-11comm/apps/app/openspec/changes/archive/2026-03-29-add-nitro-api-runtime/`

### 4. AI 技能历史记忆

- `D:/code/ruan-cat/01s-11comm/apps/app/.claude/skills/api-migration/`
- `D:/code/ruan-cat/01s-11comm/apps/app/.claude/skills/backend-nitro-drizzle/`
- `D:/code/ruan-cat/01s-11comm/apps/app/.claude/skills/fix-bug/record-bug-fix-memory/2026-03-30-h5-dev-mock-nitro-runtime-verification-gotchas.md`

---

## 三、已确认不存在/已清理项

| 检查项 | 状态 |
| --- | --- |
| `apps/app/package.json` 中的 `build:nitro`、`build:nitro:node`、`build:nitro:vercel`、`preview:nitro` | 已不存在 |
| `apps/app/turbo.json` 中的 `build:nitro*` 任务 | 已不存在 |
| `apps/app/nitro.config.ts` | 文件不存在 |
| `.github/workflows/` 中调用 `app` 的 `build:nitro*` 步骤 | 已不存在 |
| `.github/workflows/` 中 `nitro` 关键字 | 已不存在 |

---

## 四、建议的清理顺序

1. **先改入口脚本**：重命名 `scripts/dev-h5-nitro.mjs` 和 `scripts/dev-mp-weixin-nitro.mjs`，并同步替换 `package.json` 中的 `dev:h5:nitro`、`dev:nitro`、`dev:mp-weixin:nitro` 脚本名。
2. **移除依赖**：在 `package.json` 中删除 `devDependencies.nitro`。
3. **删除内置 Nitro 运行时**：整体删除 `apps/app/server/` 目录。
4. **清理环境变量**：删除 `env/` 中 Nitro 专用文件和 `.env` 中的 `NITRO_*` 变量。
5. **简化前端运行时**：根据新的「mock / 统一 API」模型，清理 `vite.config.ts` 中的 Nitro 分支和 `env/` 中的 `VITE_API_RUNTIME` 相关文件。
6. **迁移测试**：将 `src/tests/nitro-runtime/` 重命名并移除 Nitro 用例，同步更新 `.github/workflows/app-ci.yml` 中的步骤名和路径。
7. **更新活跃文档**：修改 `README.md`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 中关于 Nitro 命令的描述，标注为已退役并指向 `apps/api`。

---

## 五、扫描范围

- `D:/code/ruan-cat/01s-11comm/apps/app/package.json`
- `D:/code/ruan-cat/01s-11comm/apps/app/turbo.json`
- `D:/code/ruan-cat/01s-11comm/.github/workflows/app-ci.yml`
- `D:/code/ruan-cat/01s-11comm/apps/app/scripts/`
- `D:/code/ruan-cat/01s-11comm/apps/app/server/`
- `D:/code/ruan-cat/01s-11comm/apps/app/env/`
- `D:/code/ruan-cat/01s-11comm/apps/app/src/tests/nitro-runtime/`
- `D:/code/ruan-cat/01s-11comm/apps/app/README.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/AGENTS.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/CLAUDE.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/GEMINI.md`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/plan/`
- `D:/code/ruan-cat/01s-11comm/apps/app/docs/prompts/`
- `D:/code/ruan-cat/01s-11comm/apps/app/openspec/changes/archive/`
- `D:/code/ruan-cat/01s-11comm/apps/app/.claude/skills/`
