# 新建独立的 api 接口

```markdown
/goal 执行 OpenSpec change：`openspec\changes\migrate-superpowers-docs-to-openspec-longtask`。

目标：
持续完成 `tasks.md` 中所有未完成任务，直到：

1. 所有 checkbox 都变成 `[x]`。
2. `/opsx:verify <change-name>` 没有 CRITICAL。
3. 项目的测试、lint、typecheck 全部通过。
4. `agent-progress.md` 有最终总结。
5. `agent-findings.md` 记录重要发现、失败尝试和遗留风险。
6. 关键验收场景都有测试或明确验证记录。

执行规则：

- 先读取 `proposal.md`、`design.md`、`specs/`、`tasks.md`。
- 以 `tasks.md` 为唯一主任务源。
- 不要创建另一套任务列表。
- 每次只处理一个小 task 或一个明确 checkpoint。
- 每完成一个 task，更新 `tasks.md`。
- 每完成一个 checkpoint，更新 `agent-progress.md`。
- 重要发现写入 `agent-findings.md`。
- 遇到实现问题时使用 Superpowers 的 `systematic-debugging`。
- 实现每个小阶段时使用 Superpowers 的 `test-driven-development`、`subagent-driven-development`、`requesting-code-review`。
- 不要每一步询问是否继续。
- 只有遇到权限问题、需求冲突、破坏性操作风险、产品决策问题、连续 3 次同类失败，或需要产品决策时才暂停。

停止条件：

- 全部完成。
- 无法继续且输出 BLOCKED 报告。
- 运行达到 8 小时。
- 上下文不足且无法通过文件恢复。

---

其他执行时的注意事项：

1. **及时关闭已经使用完成的谷歌浏览器**： 在长达数个小时的长任务内，你会启用谷歌浏览器 MCP 来完成自测。请及时关闭掉已经完成测试的谷歌浏览器，避免打开过多的谷歌浏览器，以免造成电脑压力。
2. **如何触发生产环境部署**： 我们项目目前的是 monorepo 项目，分别有 admin、app、api 三个核心子包。这三个子包子项目会分别对应 3 个 vercel 项目。你不需要去连接具体的 vercel 项目，你只需要知道在本项目的 dev 分支 push 提交后，这 3 个核心项目就会在各自的 vercel 项目内完成部署，最后实现生产环境更新。
3. **连续长任务暂不允许执行具体的 git commit**： 我暂时不允许你在 dev 完成有意义的 git commit，并 push 远程。这意味着生产环境的更新和验证你都暂时做不了，请你把相关的生产环境验证的子任务，放到最后再做。这属于你的`卡点`，等你完成了其他全部 openspec 的子任务，只剩下其他卡点和这个生产环境验证的卡点时，再停下整个 goal 长任务，然后按照 `do-long-task` 技能的长任务纪律，停下来请求我的`干预`和`支持`。

---

你的核心任务是完成 app 和 admin 两个项目的 nitro 接口统一迁移，并且确保独立的 api 项目成为 app 和 admin 两个前端项目的独立后端。不要忘记这一些列任务的核心目的。
```

## 040 <!-- 已完成 --> 部署 `apps\api` 项目到 vercel 平台

模仿 vercel 的 11comm-app-nitro-server 项目的做法，新建一个 11comm-nitro-server 的项目，部署 apps\api 这个 nitro 接口服务。

你的可参考案例如下：
11comm-app-nitro-server 本质上是 D:\code\ruan-cat\01s-11comm-app 的 nitro 接口服务。你的任务是使用 vercel MVP 或者是 vercel cli，新建一个 vercel 项目，部署 nitro 接口服务。

这是在 monorepo 项目内部署 nitro 接口，会涉及到一些误区，重点阅读 https://juejin.cn/post/7610816257119354915 文档，避免你出现部署的误区。

在配置 vercel 时，你可以参考 notes-my-pull-requests 这个 vercel 项目，这个也是属于在 monorepo 内部署 nuxt/nitro 项目的，重点模仿其使用的命令。避免出现 monorepo+nitro 在 vercel 部署时出现的故障。

## 041 <!-- 该阶段内容被拆分，移交给其他任务来完成，任务存储和进度格式被改造调整 --> 推进阶段 7 的大批量改造任务

开始执行 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`，我的核心目的是继续完成阶段 7 的剩余迁移任务。旧 Superpowers 任务载体已迁入 `docs/superpowers/phase7-openspec-migration-index.md`，后续不得再把旧矩阵、旧批次计划或旧总设计当作执行源。

严格按照 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/` 下的 OpenSpec 任务体系来完成任务。

认真落实 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/phase7-evidence-model/spec.md` 的证据模型和 `tasks.md` 的任务清单。确保迁移改造不要有任何形式的缺漏。

---

### 及时更新进度

每完成一小部分，就及时更新任务进度。及时在 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`、`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md` 和 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md` 更新任务进度、验证证据和风险发现，避免出现意外的中断，导致进度丢失错配；

及时用 memorix 更新跨 AI，跨 agent 式的通用全局记忆。每完成一小部分，就及时更新任务进度。确保下一个独立的 AI 会话，能够根据你写的 markdown 信息，和全局的 memorix 记忆，继续完成下一步的工作。确保其他 AI 在全新的上下文内，清楚如何接力接手工作。

### 自主验证流程

用谷歌浏览器 MCP，本地运行 app、admin、和 api 三个 monorepo 子项目子包的 dev 命令，本地运行 3 端的 dev，用谷歌浏览器 MCP，打开 dev 服务页面。逐个访问需要验证的页面，确保前端页面能够及时使用正确的 nitro 接口信息，并完成闭环式的接口调用。确保项目成果可交付。

### 使用 agent team 蜂群架构的多个子代理成员来完成任务

1. 你必须主动的使用 agent team 能力，我不希望你直接使用主代理来完成任务。避免占用主代理的上下文窗口，导致失忆。
2. 先检查当前是否有现成的 agent team 团队。如果有，请确保你已经及时的关闭旧的 agent team 团队。
3. 新建一个干净的，独立的 agent team 子代理团队。子代理团队成员至少要包括以下几个成员：
   - 探索子代理成员。专门用于探索项目代码，
   - 编辑子代理成员。专门用于编辑代码。如果需要修改的代码数量很多，请你新建多个并行运行的编辑子代理来完成任务。
   - 检查复核子代理成员。专门用于检查完成效果，检查是否按照文档或者是用户的要求完成任务。如果没有完成、完成缺漏、完成质量差。就通知主代理，去新建新的`编辑子代理成员`来继续完成修改，直到完成。
4. 如果你仍旧在处理同一个任务，请你在现成的 agent team 子代理团队内继续新建、新增 agent team 成员。
5. 及时关闭掉已经完成任务的 agent team 子代理成员。优雅的关闭掉子代理成员。

## 042 <!-- 已完成 --> 重构任务执行与存储模式，便于实现长任务连续执行

按照全局技能 do-long-task 的要求，我准备大规模重构以下三个旧任务载体。

- 旧 Phase7 endpoint 状态矩阵。
- 旧 Phase7 batch 执行计划。
- 旧 monorepo API 迁移总设计。

我不想继续长期维护这三个文件了，我想转换任务进度的文件存储体系，从基于 superpower 的这几个文件，改造成基于 `do-long-task` 技能的要求。

1. 首先，我需要你结合 openspec，先改造成完整的 openspec 任务体系文件。
2. 严格按照 openspec 的任务体系文件来组织规划。
3. 确保新的 openspec 任务，还能够继续更近清楚阶段 7 的东西。
4. 确保后续执行 openspec 任务时，还能够认真执行 memorix。
5. 最后全面删除这三个文件，这三个文件太大，太臃肿了。

我没想到这一系列任务非常复杂，因此任务记录，拆分，长期维护的体系，也应该及时换成 openspec 体系，这个更加适合长期任务。

这是一个容易产生遗漏遗忘，缺省的错误。很容易出现记忆丢失。你应该认真阅读这三个文件，结合 memorix，查看这几个任务体系文件承载的历史。

我们的本质是改造任务执行与记录的载体，从基于 superpower 的三个 markdown 文件，改造成基于 openspec 的一系列文件。

## 043 <!-- 正在持续的完成 app项目基本上完成大部分的迁移了 --> 完成 app 和 admin 项目的独立 nitro 接口服务的迁移与搭建

### 01 怀疑连续的 16 个小时的工作目标不对，工作失衡，任务细粒度本身就指向不明确

我想先暂停一下你的 goal 工作，你的工作已经持续 16 小时了，我没看到你的任何代码修改。

有效的更改仅仅只有一些 markdown 文档，和 vitest 测试用例。

1. 怀疑 task.md 任务目标本身失衡： 我很怀疑你的 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 是不是本身设计的有问题啊？没有充分体现出我要实现 admin、app 迁移内置 nitro 接口到独立 api 项目的任务呢？是任务目标都不对么？失衡了么？
2. 怀疑没有 task.md 任务细粒度划分机制： 我很怀疑你吗没有完整的 task.md 任务逐步新增的机制。我看到你在 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 目录内增加了好多 markdown 文档，我很怀疑，按照 openspec 的一些列 skills 引导，这些任务细粒度的迁移内容，不应该存储到 task.md 内成为细粒度的`子任务项`么？
3. 你这边一直都是在调研迁移的完整度么？还是说你到现在都没办法确定清楚 admin 和 app 全部接口的迁移程度和可用程度么？你这 16 小时都在确定和验证么？

请你认真看看 do-long-task、和 openspec 系列的 skills，结合你的修改内容，给我一个合适的答复。我对你接近 16 个小时的产出成果很不满。

暂停现在的 goal 任务，在 `docs\reports` 目录内，给我生成一个报告，给我一个答复。

---

### 02

1. 因此，根据报告 `docs\reports\2026-05-21-openspec-longtask-pause-review.md` 的说明，我们的`openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 任务文件，存在明显的任务权重失衡的问题。探索，排查，验证，补充证据的子任务太多了，这导致无法完成真实有效的 nitro 接口迁移推进。请你适当的缩减，合并，调整关于这些探索验证的子任务权重。尽快将真实的 nitro 迁移改造任务，调整其优先级。

2. 根据报告要求，我要求你同时扫描全局的 `do-long-task` 和 `openspec` 这两款全局技能，对 `do-long-task` 增加需要协作的全局技能 `openspec` 。对 `openspec` 和 `do-long-task` 两款技能增加动态增加补全 task.md 任务进度的机制。
   - 注意，我不允许你直接修改全局文件，而是看 `D:\code\ruan-cat\monorepo\ai-plugins` 目录提供的技能，阅读技能，理解技能，然后在本项目的 docs\reports 内给出一个增强 `openspec` 和 `do-long-task` 两款技能的实施文档。我会按照其他的 AI 按照文档，增强 `openspec` 和 `do-long-task` 这两款技能。最后确保这两个技能未来拥有动态 task.md 任务增加能力。

3. 按照 `docs\reports\2026-05-21-openspec-longtask-pause-review.md` 的建议要求，适当改写 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 的文件层级，用你给出的这个 `纠偏建议` 来改进，优化 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 文档。

### 03 2026-5-25 AI 阶段性中断报告 <!-- 已发送指令并推进进度 -->

BLOCKED：已按长任务停止条件收尾。当前 tasks.md 还剩 22 个未完成 checkbox，主要被生产 DB_READY、真实库样本、写入授权/R2 前置、全量页面 Network、以及 task815 全局 fallback/shadow-off drill 阻断。

本轮新增阻断复核证据：`.tmp/phase7-dev-browser/2026-05-25-remaining-blockers-ready-fallback-crud-review.md`，并已挂接到：

- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md`

生产 https://01s-11-server.ruan-cat.com/__nitro/ready 当前仍是 `READY_CONFIGURED`、`probeEnabled=false`、`connected=null`，所以不能把任何生产真实库或退役证据升级为完成。

已完成校验：

- openspec validate migrate-superpowers-docs-to-openspec-longtask --strict 通
  过
- git diff --check 通过
- git diff --cached --check 通过
- 触达文档中文行门禁通过
- 已写入 Memorix：#4675
- 本轮新开的 4 个只读子代理都已关闭

需要用户介入的最小前置：

1. 允许通过 commit/push 或其他方式触发生产重新部署，并为 API 生产环境启用 main 分支连接串与 `RUN_PHASE7_DB_READINESS_CHECK=1`。
2. 明确是否授权受控生产写入窗口，用于 CUD 的 write/read-back/rollback/residual check。
3. 提供或确认 R2 env、AWS SDK/R2 client、upload session repository 与前端断点续传闭环方案。
4. task815 还需要新增专门的 fallback/shadow-off drill，证明 fallback 不可用时 exact handler 仍由 apps/api 承接。

### 04 2026-5-27 AI 的阶段性中断报告 <!-- 已完成 -->

当前阻断原因：

- task101：生产 change/list baseline 仍返回 missing FROM-clause entry for table "ct_contracts"，不能开启生产 CUD 写入窗口。
- task102：生产 completed cleanup/residual 仍失败；本地页面 R2 浏览器直传被 CORS 预检阻断。
- 真实 CRUD 页面级证据、每个 admin detail/create/update/delete 分项验收都依赖 task101/task102 的写入、读回、回滚、残留和页面交互闭环，当前不能用 partial evidence 替代关闭。

---

1. 为什么 `ct_contracts` 有问题？你没办法增加，修改，更新生产环境的 neon 数据库字段么？我们 admin 项目提供了 neon 数据库的 drizzle 更新能力，请你用这个能力去更新 neon 数据库，自己处理好字段和数据库表的问题。这个问题不应该跟我说需要我人工干预。
   - 另外，你需要在 openspec\changes\migrate-superpowers-docs-to-openspec-longtask 的 spec 内，增加说明清楚如何用 drizzle 来更新 neon 数据库表，并更新对应 schema 架构的规范。这个东西早就准备好了，你看看本项目的项目级别 skills，和 openspec 的历史 spec 规范。
2. 本地页面 R2 浏览器直传被 CORS 预检阻断。那就换一种方式来完成 R2 文件分片请求的测试。之前 admin 项目不是已经把这部分的接口给做好了吗？你直接迁移整合不行么？admin 项目已经完成过复杂的，基于 cloudflare R2 的文件分片上传的接口开发，和生产环境接口的部署了。你认真学习代码，做好迁移和自测就行。那为什么之前弄这个文件分片上传开发的时候，没有说遇到跨域的问题呢？

### 05 <!-- 已完成评估，准备继续拓展长任务清单，继续推进 --> 最终全面评估是否可以删除 旧 apps/admin/server 和 apps/app/server 两个 nitro 接口是否可以删除掉

`openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 说代表的长任务，现在已经基本上是全部执行完毕了。但是我不清楚你的执行情况，是否有遗漏和缺漏。

我需要你全面探索，全面审核 migrate-superpowers-docs-to-openspec-longtask 任务是否执行完毕了。然后我再继续考虑旧 apps/admin/server 和 apps/app/server 两个 nitro 接口服务的 retirement gate 是否达成。

这是一个探索与验证任务，请你设计好如何完整探索与验证的方案。并且去落实执行下去，并最后给我一个是否能开始删除 app 和 admin 两个项目 nitro 接口的进度。

---

初步调研结论：

admin 仍有 legacy db/seed、nitro config、drizzle compatibility、R2/upload 源依赖；app 仍有 legacy-dispatch、Nitro build、mock/test 对 `server/modules/**` 的直接依赖，以及 fallback-only 路径阻断。

---

我需要你设计一个能够被 codex goal 完整执行的长任务。并扫清，解决掉上述的问题，最后达到可以安全删除 app 和 admin 内置的 nitro 接口，确保独立的 api 项目能够同时支撑两个前端项目。

我觉得本质上是 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 这个长任务没做好。你应该继续让这个长任务，拓展，补全 task 任务清单，然后继续推进剩余的任务。最终达到可以安全删除 app 和 admin 项目内部的 nitro 接口的目的。

### 06 <!-- 已完成 ZCode正在做 --> 及时删改 APP 项目仍旧使用的旧 nitro 接口命令

工作流出现以下错误：

```log
Run pnpm -F @01s-11comm/app run build:nitro:vercel
[ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT] None of the selected packages has a "build:nitro:vercel" script
Error: Process completed with exit code 1.
```

我们现在已经评估 admin 和 APP 的 nitro 接口都可以退役了，这是退役的部分删除不干净的情况。请你处理这个问题。按理说你应该在 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 内继续增加该内容，然后继续跟进 nitro 接口退役的事情。

---

这个是一次及其疯狂的删除，我希望你去看看 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 目录内的全部文档，搞清楚我们是否真实的完成了独立 nitro 接口的制作任务？所以我们可以进入到收尾阶段么？ `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 的任务清单还有那些没做完？

---

admin 项目能不能不使用 vite-plugin-vercel 插件？因为 .vercel/output 中仍有 functions/api/proxy.func/ ，就是因为 这个 vite-plugin-vercel 插件生成的。

我们的目的是需要生成 .vercel/output 目录。我们能不能用其他合适的手段来生成这个目录？或者是通过这个 vite-plugin-vercel 插件的合适配置，避免生成干扰性质的 functions/api/proxy.func/ ？
我觉得我们可以直接忽略掉 functions/api/proxy.func/ 对 vercel 项目的影响。毕竟 admin 项目部署到 vercel 项目了，未来在生产环境内，也还是需要对 api 子包的内容做 vercel 生产环境层面的反向代理，所以在 .vercel/output 中仍有 functions/api/proxy.func/ 有这个边缘云函数来承担 vercel 层面的反向代理，是合理的。
你调研一下这几个方向，我倾向于保留这个配置，保留 vercel 生产环境的反向代理函数。

---

及时更新各个子包对应的 README.md 文档，在 api、App、admin 三个子项目内，记录必要的 vercel 云项目的 url ，便于我快速查阅：

- App 项目： https://vercel.com/ruancat-projects/11comm-app-h5
- api nitro 接口项目： https://vercel.com/ruancat-projects/11comm-nitro-server
- admin 管理后台项目： https://vercel.com/ruancat-projects/11comm-admin

---

你能确保 `window-path-loader.js` 这款特殊的 uniapp 构建脚本，在 vercel 和 github workflow 的 linux 环境内，在生产环境内，都能够正常的完成 build 吗？请你设计合适的测试流程，完成校验。

1. 主动使用 git-commit 技能，对你的修改做 git-commit。
2. 然后 git push，推送到 dev origin 远程。
3. 使用 rebase2main 技能，完成 main origin 的同步。
4. 使用 vercel MCP 或 vercel cli，监听 App 项目，即 `https://vercel.com/ruancat-projects/11comm-app-h5` 项目的部署情况，确保部署成功；
5. 使用 github MCP 或者是 gh cli，检查 github workflow 工作流是否出现报错，确保不要出现任何报错。
6. 按照足够数量的子代理，完成这些任务，避免过渡占用主代理的上下文窗口。

---

`apps\app\package.json` 的 `build:h5:prod` 构建命令失败了，请你帮我修复这个故障。
阅读 `apps\app\scripts\window-path-loader.js` 和 [https://github.com/unibest-tech/unibest/issues/219](https://github.com/unibest-tech/unibest/issues/219) ，看看能不能帮我修复，解决在 window 系统内完成 build:h5:prod 构建 。

---

在 `lint-staged.config.js` 内，我们 App 子项目的处理逻辑是 `"lint:fix": "pnpm run lint:oxlint && pnpm run lint:eslint"`。这个命令太离谱了，按理说 lint-staged 运行的命令应该是简单的，linter 处理的文件不应该是整个 App 项目的全部文件，而是被提交的少部分文件。所以这个 `lint-staged.config.js` 的 `commands.push("pnpm -F @01s-11comm/app lint:fix");` 命令存在明显的性能问题，这个处理逻辑就不对，请你修复掉！

---

记录惨痛的经验教训！

1. 用你的 vercel MCP，阅读 `https://vercel.com/ruancat-projects/11comm-app-h5/deployments` ，阅读清楚 `11comm-app-h5` 项目为什么有那么多部署失败了。
   > ![2026-07-09-16-41-45](https://gh-img-store.ruan-cat.com/01s-docs/11comm/2026-07-09-16-41-45.png)
2. 认真看清楚，搞清楚 git commit `2707fcfd2acf0ff0948195b342470861ef395366` 的提交。认真理解清楚为什么我手动删除了多余的根目录 vercel.json 文件后，我们 monorepo 项目的 App 子包项目，就能够正常工作了。就是因为你误导了，你误会了！我们项目是 monorepo 项目，monorepo 项目子包部署的时候，怎么可以去编写根目录下面的 vercel.json 配置文件呢？这个思路完全不对！
3. 你去认真看看 vercel 的官方文档，搞清楚为什么根目录错误的 vercel.json 配置文件，能够干扰子项目的部署。你的探究方案非常离谱！犯下大错了。
4. 认真按照 `record-bug-fix-memory` 技能的要求，编写经验教训。
5. 在各个子项目的 README.md 文档内，说明清楚为什么 vercel 配置要写到云端内，而不是写到项目根目录和子目录内的具体 vercel.json 文件。
6. 最后编写一个事故报告，全面的检索好历史的 vercel 11comm-app-h5 云项目的部署失败情况，和错误的配置文件情况，全面的说明清楚经验教训。

---

更新文档
apps\admin\README.md 文档写的不对。关于`项目部署（Phase7）`这个章节的内容，很多东西讲的不对。
严格看看 `🐞 fix(turbo,config,package.json,admin)!: 修复admin项目在vercel部署失败的故障，避免强依赖具体的vercel.json文件。` 这个 git commit 提交的做法，认真的根据这个具体的提交写法和修复内容，去重写，改写`apps\admin\README.md`文档的部署部分，把东西写对！

## 07 <!-- 已完成，基本认定完成了全部的任务 ZCode 正在做 --> 做好生产环境的代码评测

在 openspec 任务 `migrate-superpowers-docs-to-openspec-longtask` 内，我们的阶段七现在终于快到完成阶段了。

我亲自帮你完成了 vercel 层面的验证和排障，现在 vercel 的三个云项目，app、api、admin 都能够正常使用了，部署流都正常了，接下来的验证和推进任务内，你不应该再折腾任何形式的 vercel 部署了。项目已经能够正常部署了。

你的核心任务现在转变为在生产环境内验证 admin 和 api 项目是否能够调用生产环境的 api 项目。自主验证 api nitro 接口是否能够正常的完成接口请求，在 app 和 admin 项目内是否能正常完成业务请求和接口调用。

#### 检查必要的 agent 工具是否成熟可用

你需要高强度调用使用的 MCP 是：

- neon MCP 检查 neon 数据库是否真的出现了数据新增、编辑、与删除。在数据库层面完成接口验证。
- 谷歌浏览器 MCP 用谷歌浏览器 MCP 来完成 2 个 admin 和 app 项目的前端功能验证。

#### 先调研历史经验、错误、和报告

我们这个任务执行的时间太长了，产生了很多进度文件，历史进度报告，和错误经验。你应该先安排合适的子代理，先去检查清楚历史文档，提炼出你真正要做的东西，然后再设计任务进度表，最后再开始推进任务。

你的检查项：

- `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 目录全部的文档。
- `.claude\skills\fix-bug\record-bug-fix-memory` 目录内全部的经验教训。
- `openspec\specs` 任务执行规范。

#### 根据 api 接口路由映射，设计任务清单，并 task.md 任务进度文档

你应该先把全部 nitro 接口的 url 地址列举出来，然后设定一个联调测试的明确计划清单。先在 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 内列举出全部需要在浏览器内正式测试的接口，再开始按照计划逐步去浏览器完成清晰的验证。避免你出现严重的偷懒情况。按照 openspec 的技能指导规范来完成任务清单的编写。

#### 本任务高度相关的 skills

- do-long-task 你正在做长任务，你应该要按照长任务的纪律来完成任务。
- openspec 我们的任务 markdown 文档规格和任务进度，都需要遵循这个技能的操作规范。
- pua 用 pua 技能来指导你的每一个行动，避免你出现懒惰思考。
- git-commit 严格用该技能完成 git commit 提交行为。你的每一个 git commit 都应该要遵循该技能的严格要求。
- subagent-driven-development 我们的任务非常艰巨，不要什么工作都交给主代理完成，你应该大批量的新建子代理，用 agent team 的形式来完成你的任务。
- neon-postgres 本仓库内的项目级别技能，用这个技能指导你完成 neon 数据库的操作。
- `.claude\skills` 目录内其他的 openspec 技能。我们要遵循 openspec 规范来完成任务。
- .claude\skills\neon-db-query neon 数据库查询技能
- 其他 superpower 系列的技能。

#### 触发生产环境更新

当你意识到接口有缺漏，或者是逻辑覆盖不全，总之是你需要更新生产环境的时候，就按照以下步骤来做

1. 主动使用 git-commit 技能，对你的修改做 git-commit。
2. 然后 git push，推送到 dev origin 远程。
3. 稍等 3 分钟左右，vercel 就能将全部 admin、app、api 三个子包的生产环境完成部署。
4. 然后继续你的接口与功能验证。

#### admin 项目账号密码

你直接点击登录按钮即可。我们项目的接口目前没有做鉴权，直接登录即可使用。不要再这个上面卡顿并请求我的介入。

#### 谷歌浏览器 MCP 使用规范

1. 独立使用唯一一个浏览器实例，不要多开浏览器实例。
2. 不要多开太多的浏览器 tab 页面。目前就两个项目，按理说应该开启 admin 和 app 两个页面即可。

#### 闭环式检查接口清单

作为一个成熟的接口，你至少要完成以下清单检查：

1. 接口在 admin 或者是 app 内完成调用。
2. 接口对应的 neon 数据库能够完成数据库表的真实操作。
3. 你必须用谷歌浏览器 MCP，访问的每一个 admin 和 app 项目的具体前端路由页面，点击业务按钮，填写表单，触发接口请求。必须亲自模拟人类在浏览器的真实操作，来完成生产环境级别的功能测试！
4. 然后用 neon MCP，去检查 neon 数据库的写表，确保你的操作真实的实现了 neon 数据库的写表行为。

#### 有可能出现的问题

在 admin 和 app 内：

1. 接口出现跨域问题，无法请求。
2. 接口出现缺漏，有部分模块没有补全必要的接口，功能本身不闭环。

---

我觉得你的生产环境验证很不全面！你根本就没有在 api 项目内，列举全部要测试的接口，你只是测试了很少数的接口，大部分接口你都没有完成测试，也没有在谷歌浏览器 MCP 内完成真实的测试
你的做法太偷懒了！你的测试非常不全面！
你应该先扫描清楚现在 api 项目内，有多少需要在 admin 和 app 项目内，用浏览器真实完成测试的内容。然后设计清晰明确的任务清单，在 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 内把全部要测试的内容都列举清楚，路由页面，以及 api 接口路由的映射，neon 数据库的验证，都要体现在 task.md 任务清单内，这个任务清单必须非常详细清晰！
逐路由，逐 api 的列举清楚全部的 api！不要偷懒！

---

你必须用谷歌浏览器 MCP，访问的每一个 admin 和 app 项目的具体前端路由页面，点击业务按钮，填写表单，触发接口请求。必须亲自模拟人类在浏览器的真实操作，来完成生产环境级别的功能测试！
然后用 neon MCP，去检查 neon 数据库的写表，确保你的操作真实的实现了 neon 数据库的写表行为。

## 08 <!-- 已完成； ZCode 正在做 --> openspec 长任务的一系列文档组织与记忆问题

为什么你会出现这种乱新建文档的错误呢？为什么你当初在执行 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 长任务时，完全没有一点任何标准，就胡乱的去新建文档呢？导致现在还要单独给你整理文档？是不是你当初执行 `do-long-task` 技能时就没有给你约束清楚怎么在具体的 openspec 工作目录内新建阶段性过程文档？你完全没有一点规范么？
在 `docs\reports` 目录给我新建一个经验教训！确保你以后执行 `do-long-task` 技能时，不要再出现这样的胡乱新建文档的情况了！
安排一个独立的子代理，完成经验教训的编写。

---

<!-- 已完成； 已经在ZCode内记录了全新的 goal ，下一次执行时直接点击继续按钮即可；已点击，正在做； -->

你在执行这一些列长任务时，出现了太多问题了！

1. 你没有深刻的按照 openspec 的一系列规范来验证文档工件。
   - 我们有很多 openspec 的技能指导你完成任务的，你为什么不去看 .claude\skills .codex\skills .agents\skills 目录内全部关于 openspec 的执行规范呢？这导致你每次执行的时候，都不严格按照 openspec 的规范来严格落地。总是出现缺斤少两，偷懒的任务。一个大量的，艰巨的重构与排查任务，你就出现了不严格拓展增长 task.md 任务清单，并且你也不认真落地执行，导致你每次都缺斤少两。是不是 `do-long-task` 技能没指导清楚你的执行方式啊？
2. 你的一系列长任务都不去认真阅读，并动态地迭代 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\design.md` 和 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\proposal.md` 文档，导致我每次执行长任务时，你总是记不得这些必要的内容。
3. 你的一系列长任务执行的时候，没有认真的看 openspec 历史沉淀的 spec 规范。
   - openspec\changes\migrate-superpowers-docs-to-openspec-longtask\specs 目录内有好多现成的，严格的标准。你在执行的时候，都不认真去看，导致你总是去错过必要的执行规范。你根本就不看严格的 spec 规范！
4. 长任务有失偏颇时，你不知道要迭代更新那些文档：
   - 你竟然不知道要及时的更新 openspec 任务目录下的 `design.md` `proposal.md` `tasks.md` 、openspec 任务的 spec 规格文件来更新迭代标准，以及及时的拓展长任务的 `tasks.md` 任务进度表。
5. 用 `do-long-task` 全局技能生成的 goal 提示词，是不是太简单了，才导致你执行的时候经常出现失忆啊？你根本就不看很多 openspec 的文件啊？

你的执行结果太差了，是不是 `do-long-task` 全局技能不成熟不完善啊？才导致你执行的时候总是出错、犯错、失忆、偷懒、欺骗啊？

我要求你用 memorix 全面的检查 `migrate-superpowers-docs-to-openspec-longtask` 这个一系列长任务的执行历史记忆，把必要的决策，经验教训都统一整合。深度的编写一个很长很详细的报告文档，系统性给出全面的深度的自我反省翻盘报告，和经验教训文档。
在 `docs\reports` 目录内编写报告。

<!-- 具体报告： apps\admin\src\docs\reports\2026-07-11-openspec-do-longtask-self-reflection-report.md -->

## 09 <!-- TODO: -->
