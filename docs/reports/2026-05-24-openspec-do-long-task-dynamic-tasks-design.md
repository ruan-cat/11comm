# 2026-05-24 OpenSpec 与 do-long-task 动态任务补全增强设计

## 背景

本报告用于指导后续增强 `D:\code\ruan-cat\monorepo\ai-plugins` 源仓库中的两款技能：`dev-skills/skills/openspec` 与 `common-tools/skills/do-long-task`。本次只写实施文档，不直接修改 `C:\Users\pc\.agents\skills`、`.codex/skills` 或插件 cache 内的全局技能副本。

暂停复盘暴露出的核心问题不是“缺少更多审计”，而是长任务执行时 `tasks.md` 逐渐被探索、归类、验证、报告任务占满，真实 Nitro endpoint 迁移推进被挤到后面。增强目标是让两个技能在执行中能够动态补全遗漏任务，同时保持 `tasks.md` 是唯一可执行任务源。

## 已调研的源技能

- `ai-plugins/dev-skills/skills/openspec/SKILL.md`：当前强调 OPSX 工件链和任务勾选，但缺少执行中发现缺口后如何补写 `tasks.md` 的机制。
- `ai-plugins/dev-skills/skills/openspec/references/tasks-writing-guide.md`：已有“任务必须文件级、可验证、避免模糊项、超过 5 项先做 Pilot Batch”的规则，应在这里补充动态补全任务规则。
- `ai-plugins/dev-skills/skills/openspec/references/delta-specs-format.md`：已有 specs 变更格式，动态任务若改变行为要求，必须同步 specs，而不是只改任务列表。
- `ai-plugins/dev-skills/skills/openspec/references/configuration.md`：包含全局安装类示例；在本项目文档和后续增强中不应推荐 `npm install -g` 或 `pnpm add -g`。
- `ai-plugins/common-tools/skills/do-long-task/SKILL.md`：当前已经把 `tasks.md`、`agent-progress.md`、`agent-findings.md` 分成任务源、进度、发现三类，但没有明确声明协作技能 `openspec`。
- `ai-plugins/common-tools/skills/do-long-task/AGENT_LONGTASK.md`：已有 Fresh Context 和完成判定纪律，应补充“发现遗漏任务先回写 `tasks.md`，再继续执行”的闭环。
- `ai-plugins/common-tools/skills/do-long-task/evals/evals.json`：已有长任务恢复、验证和任务源相关场景，后续应增加动态补全、去重、禁止第二任务源的 eval。
- `ai-plugins/common-tools/skills/release-ai-plugins/SKILL.md`：确认源仓库才是发布入口，已安装的全局技能和 cache 只是分发产物。

## 设计原则

1. `openspec/changes/<change>/tasks.md` 是唯一可执行任务源。
2. `agent-progress.md` 只记录 checkpoint、验证命令、证据路径和恢复状态。
3. `agent-findings.md` 只记录风险、冲突、失败路径、no-go 和长期发现。
4. 动态补全只允许补齐当前 `proposal.md`、`design.md`、`specs/**` 已覆盖范围内的实现、验证、证据或依赖任务。
5. 如果新增任务改变行为要求，先更新 `specs/**/spec.md`；如果改变技术路线，先更新 `design.md`；如果改变目标边界，应暂停并评估是否需要新的 OpenSpec change。
6. 不允许把 fallback evidence、`READY_CONFIGURED`、Vitest 通过、HTTP 200、blocked guard 误写成 `DB_READY`、exact migrated、shadow-off 或 retirement candidate。
7. 不允许通过全局安装污染用户环境；使用仓库脚本、`pnpm exec` 或 `npx`。

## OpenSpec 增强方案

在 `dev-skills/skills/openspec/SKILL.md` 增加“执行中动态补全”原则：

- `/opsx:apply`、`/opsx:verify` 或人工复核发现任务遗漏时，先回写当前 change 的 `tasks.md`，再继续实现或验收。
- 补全任务必须保持 OpenSpec checkbox 格式：`- [ ] [操作类型] 路径 - 具体动作与验收标准`。
- 发现缺口但未写回 `tasks.md` 时，不得把相关工作声明为完成。
- 任务补全后必须运行 `openspec validate <change-name> --strict`。

在 `references/tasks-writing-guide.md` 新增一节“执行中动态补全任务”：

- 触发条件：实现依赖缺失、验证失败暴露遗漏、子代理复核发现未覆盖文件、spec-to-task 追踪断裂、批次验收缺少 HTTP/browser/DB/write evidence、用户在同一 change 范围内追加已确认要求。
- 追加位置：优先追加到对应业务章节；如果是跨切片规则，可追加到“动态补全任务”小节，但不得形成第二任务源。
- 去重规则：按文件路径、endpoint、操作类型、验收目标和证据来源去重；已有任务覆盖时只补强原条目，避免重复 backlog。
- 粒度规则：真实 Nitro 迁移任务优先写到 endpoint/file-level，例如 handler、adapter、repository、runtime manifest、caller、contract test、HTTP gate、browser evidence、DB evidence、write guard。
- 禁止规则：不得新增“继续探索”“完善相关内容”“后续处理”这类无文件、无验收的模糊任务。

在 `references/delta-specs-format.md` 补充同步规则：

- 动态任务若新增或改变用户可观察行为，必须同步 specs。
- 动态任务若只补执行遗漏，不改变行为或技术路线，可只改 `tasks.md`。
- specs/design 同步后同样必须 strict validate。

## do-long-task 增强方案

在 `common-tools/skills/do-long-task/SKILL.md` 增加协作声明：

- 需要协作的全局技能：`openspec`。
- 当检测到当前任务位于 `openspec/changes/<change>` 下时，`do-long-task` 必须以 OpenSpec 工件链为准。
- 长任务执行中发现遗漏任务时，先更新 `tasks.md`，再继续执行，不能只写在聊天 checklist、`agent-progress.md` 或子代理报告里。

在 `AGENT_LONGTASK.md` 补充“动态任务补全纪律”：

- 每次启动、上下文压缩后恢复、开始新 task 前、完成 checkpoint 后、连续失败 2 次后、准备勾选前，都要重新读取 `tasks.md`、`agent-progress.md` 和 `agent-findings.md`。
- 发现缺口时，先判断是否属于当前 OpenSpec change；属于则补写 `tasks.md`，不属于则记录 no-go 或建议新 change。
- `agent-progress.md` 记录为什么补任务、补到哪里、运行了哪些验证。
- `agent-findings.md` 记录风险、阻断、失败路径和不得误判的证据边界。
- 只有实现完成、验收满足、验证通过或替代验证明确记录、OpenSpec strict 通过、无 CRITICAL 残留时，才能勾选 `[x]`。

## 子代理协作规则

子代理可以提出动态补全候选，但不能擅自创建第二任务源。推荐让子代理按以下格式返回：

```markdown
### 建议补全任务

- 来源：验证失败 / 设计遗漏 / specs 未覆盖 / 实现依赖缺失
- 建议任务：`- [ ] [修改] path - 具体动作与验收标准`
- 是否需要同步 design/specs：是 / 否
- 验证方式：命令、HTTP、browser、DB 或人工复核
```

主代理负责去重、合并、排序、写入 `tasks.md`、运行 validate，并决定是否可以勾选完成。

## eval 与发布清单

后续增强完成后，应补充或更新 eval：

- OpenSpec 执行中发现遗漏 endpoint handler，并追加到 `tasks.md`。
- 重复上报同一文件同一意图时只合并一次。
- 任务改变行为要求时同步 specs。
- 技术方案变化时同步 design。
- validate 失败时阻止继续实现和勾选。
- `do-long-task` 恢复上下文后仍以 `tasks.md` 为唯一任务源。
- 子代理只能提出候选，主代理负责最终合并。

发布前按 `release-ai-plugins` 规则检查：

- 更新对应 skill 的 `metadata.version`，只 bump 实际改动的 skill。
- 更新 `dev-skills/CHANGELOG.md` 与 `common-tools/CHANGELOG.md`。
- 更新相关 README、插件 manifest、marketplace 元数据。
- 确认文档没有指向全局 cache 路径作为修改源。
- 不新增全局安装命令。

## 验收标准

- `openspec` 明确拥有动态补全 `tasks.md` 的执行规则。
- `do-long-task` 明确声明协作技能 `openspec`，并在长任务恢复与验证中服从 OpenSpec 唯一任务源。
- 动态补全机制不会扩张 scope，不会制造第二任务系统。
- 真实迁移进度口径能区分 `exact migrated`、`fallback-only`、`blocked write`、`DB_READY`、browser evidence、retirement candidate。
- 后续 AI 只需按照本报告修改 `ai-plugins` 源仓库，即可增强两款技能。
