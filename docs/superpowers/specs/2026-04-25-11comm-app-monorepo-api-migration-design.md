<!-- TODO: 长任务 持续完成改造 -->

# 2026-04-25 11comm App 迁入 Monorepo 与唯一 Nitro API 设计

## 背景

当前存在两个长期分离的项目：

- `D:\code\ruan-cat\01s-11comm`：admin 后台 monorepo，包含 `apps/admin` 与 `apps/type`。
- `D:\code\ruan-cat\01s-11comm-app`：移动端 app 项目，包含独立前端、独立 Nitro legacy/mock 服务。

目标是把 `01s-11comm-app` 的业务源码、运行配置和必要历史上下文迁入 `01s-11comm`，作为 monorepo 内的子应用，并建立唯一、独立部署的 Nitro API 服务，同时支撑 admin 后台和 app 前端。

## 已确认决策

1. 唯一 Nitro API 服务放在 `apps/api`。
2. `01s-11comm-app` 迁入为 `apps/app`。
3. 迁入 app 时不保留原仓库 Git 历史，不使用 `git subtree`。
4. app 迁入采用过滤快照复制：直接复制业务源码和必要上下文到 `apps/app`，但排除无用工具副本和构建产物，后续在 monorepo 内治理。
5. 第一阶段以“不拆解 app 业务结构”为主，不立即重写 app 内部结构；“原样保留”不包含 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 等多工具垃圾副本。
6. `apps/type` 继续作为数据库 Schema、Zod Schema、TypeScript 类型的唯一事实来源。
7. Nitro 接口不新增任何鉴权逻辑，不引入 JWT、Token 校验、Neon Auth。

## 目标架构

```text
01s-11comm/
  apps/
    admin/   # pure-admin 后台前端
    app/     # 由 01s-11comm-app 快照复制迁入的移动端子应用
    api/     # 唯一 Nitro API 服务，独立启动、构建、部署
    type/    # Schema / Zod / Drizzle / TS 类型唯一事实来源
```

最终状态：

- admin 和 app 都通过配置指向 `apps/api`。
- `apps/admin/server` 与 `apps/app/server` 只作为迁移来源或临时兼容层，不作为长期生产 API。
- app legacy 路径 `/app/**`、`/callComponent/**` 先保留兼容，再逐步映射到规范 API。
- 新增和补齐 CRUD 时，以 admin 的 `rank-route-keys.ts` 三级业务路径作为 canonical 业务坐标。

## 迁移策略

采用“过滤快照迁入 + 影子 API + 渐进拆耦”。

### 阶段 1：快照迁入 app

把 `D:\code\ruan-cat\01s-11comm-app` 复制到：

```text
apps/app/
```

保留 app 的既有业务结构，包括：

- `src/**`
- `server/**`
- `env/**`
- `.claude/skills/**`
- `.agents/skills/**`
- `.agent/skills/**`
- `package.json`
- `vite.config.ts`
- `nitro.config.ts`
- `pages.config.ts`
- `manifest.config.ts`
- 现有脚本、配置、mock 体系和有价值的技能经验

只做 monorepo 必要适配，例如包名、workspace 识别、脚本入口、依赖安装策略。

以下目录不迁入，避免把无关 AI 客户端副本和垃圾配置带入 monorepo：

- `.cursor/**`
- `.gemini/**`
- `.qoder/**`
- `.trae/**`
- `.kiro/**`

如果这些被排除目录内存在极少量确有价值的迁移经验，只能在后续专项任务中人工摘录到迁移清单或统一技能体系，禁止整目录复制。

迁入 app 时还要同步盘点 app 项目内的 skills 技能。原则是先原样保留，再判断价值，不在第一阶段粗暴删除或改写：

1. 识别 app 项目内 `.claude/skills/**`、`.agents/skills/**`、`.agent/skills/**` 的技能清单。
2. 标记与 app 业务、uni-app、Nitro legacy、mock 数据、接口适配、排错经验相关的有价值技能。
3. 对与当前 monorepo 技能冲突的内容，只记录冲突，不立即合并。
4. 后续单独设计 skills 合并任务，把有价值经验迁入本项目统一技能体系。

### 阶段 1.1：Markdown 文档迁移策略

`01s-11comm-app` 不是只有源码需要迁入，仓库内还存在大量 Markdown 上下文，包括根级 AI 记忆文档、VitePress 文档、OpenSpec 工件、历史报告、组件 README、mock 说明、skills 参考文档和多工具命令/技能副本。Markdown 迁移不能简单等同于“复制后随手去重”，必须先保留证据，再做分层治理。

本轮抽样盘点的基线是：排除 `.git`、`node_modules`、`dist`、`build`、`.output`、`.nuxt`、`.vite`、coverage、`.turbo` 等目录后，`D:\code\ruan-cat\01s-11comm-app` 约有 314 个项目相关 Markdown。正式迁入前应以迁入当日快照重新生成一次基线，并额外排除 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`，不能直接沿用这个数量作为最终事实。

#### 快照迁入时的默认保留规则

第一阶段采用“项目自有 Markdown 默认保留”的规则：

- `README.md`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 等根级说明和 AI 记忆文档原样进入 `apps/app`，视为 app 子项目作用域内的历史上下文。
- `docs/**`、`openspec/**`、`src/**/README.md`、`src/**/index.md`、`.claude/**`、`.agent/**`、`.agents/**`、`.github/**` 下的项目自有 Markdown 默认保留路径不变。
- `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 下的 Markdown 默认排除，不进入 `apps/app`。
- `src/uni_modules/**`、`gitee-example/**` 等第三方或参考实现中的 Markdown 先随 app 快照保留，但迁移清单中必须标记为“第三方/参考资料”，不能升级为 monorepo 规范事实来源。
- `node_modules/**`、`dist/**`、`.output/**`、coverage、临时缓存等依赖或构建产物不属于迁入对象，即使其中包含 Markdown 也不迁入。
- 第一阶段不把 app 文档直接搬到根级 `docs/**`，也不把 app skills 直接覆盖根级 `.claude/skills/**` 或 `.agents/skills/**`。

#### 文档价值分类

迁入后按价值分层建立清单，后续治理必须基于清单而不是凭文件名删除：

| 类别                  | 文档形态                                                                                         | 处理策略                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| P0 迁移关键上下文     | Nitro 双运行时、legacy API、mock endpoint、Vite 兼容、迁移计划、当前 README 补充说明             | 保留并优先纳入迁移索引，迁移 `apps/api` 时持续同步 |
| P1 app 业务与历史经验 | 业务页面迁移报告、OpenSpec 归档、组件 README、排错复盘、uni-app 兼容经验                         | 保留在 `apps/app`，必要时摘录到后续专题报告        |
| P2 模板/第三方参考    | unibest/VitePress 基础文档、uni_modules 文档、gitee-example 参考说明                             | 保留但降权，清单中标记来源，不作为主项目规范       |
| P3 重复或过时候选     | 多 AI 工具重复的 OpenSpec skills、完全相同的 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`、旧 prompt 草稿 | 第一阶段不删除，只记录重复关系和建议归档方向       |

#### 重复文档处理规则

重复文档分为“精确重复”和“语义重叠”两类处理：

1. 对精确重复文件，使用文件哈希或内容比对生成重复组。已观察到的典型重复包括多工具目录下的 OpenSpec skills，以及根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 同步副本。
2. 对工具入口型重复文档，只保留当前项目需要的 `.claude/skills/**`、`.agent/skills/**`、`.agents/skills/**`；`.cursor/skills/**`、`.gemini/skills/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 默认排除。
3. 对语义重叠但内容不同的文档，例如 app 的 Nitro/mock 经验与主项目 Nitro/API 规范，只记录“主项目 canonical 文档”和“app 历史来源文档”的关系，不直接合并。
4. 后续去重只能采用“建立 canonical + 保留引用/归档”的方式，不能在没有清单和复核结论时直接删除。
5. 如果 app 文档与主项目根级 `docs/**`、`.claude/skills/**`、`.agents/skills/**` 冲突，以主项目现有规范为默认 canonical，app 文档作为迁移来源或历史证据保留。

#### skills 与 AI 记忆文档处理

- app 的 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 迁入后只描述 `apps/app` 子项目历史和约束，不自动提升为根级规则。
- app 的 `.claude/skills/**`、`.agent/skills/**`、`.agents/skills/**` 先原样保留，后续通过 skills 合并任务逐项评估。
- app 的 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 默认不迁入；如确有独特经验，后续只做人工摘录，不复制原目录。
- 与 app 业务、uni-app、ColorUI 到 wot-design-uni、z-paging、动态标题、Nitro legacy/mock、Vite mock 兼容相关的技能优先标记为可迁移经验。
- 与主项目已有技能同名或同职责的内容，必须先形成冲突矩阵，禁止直接覆盖主项目 skills。
- AI 记忆文档中如果包含已过时的执行方式、子代理约束或外部工具规则，只能标记为 app 历史上下文，不能直接要求整个 monorepo 遵循。

#### 敏感信息检查

Markdown 迁入前后都要做敏感信息扫描，至少覆盖以下模式：`token`、`secret`、`password`、`passwd`、`DATABASE_URL`、`NEON`、`VERCEL`、`APP_SECRET`、`api_key`、`Bearer`、`私钥`、`密钥`、`口令`、`密码`。

处理原则：

- 示例占位符可以保留，但必须能明确看出是示例，例如 `user:pass`、`ep-xxx`、`your-api-key-here`。
- README 中的演示账号密码、参考系统账号等必须标记为“公开演示凭据/历史参考”，不能混同为生产密钥。
- 如果发现真实数据库连接串、真实 API key、生产 token 或个人账号凭据，必须先脱敏再迁入可共享文档。
- 脱敏不能破坏排错价值，必要时保留变量名、服务类型、错误形态和复现步骤，移除真实值。

#### 迁移后索引与清单

第一阶段完成后必须产出 Markdown 清单，建议位置为：

```text
apps/app/docs/migration/markdown-inventory.md
```

清单至少包含：

- 原始相对路径、迁入后路径、文档类别、价值等级、是否第三方/模板来源。
- 是否与主项目文档或 skills 冲突。
- 是否为重复组成员，重复组 canonical 建议指向哪里。
- 是否包含敏感信息命中项，以及处理状态。
- 是否与 `apps/api` 迁移、legacy path、动态 mock、业务页面迁移直接相关。

根级设计文档或主项目 `docs/**` 只需要追加索引链接或摘要，不应复制 app 文档全文，避免主项目文档体系被 app 历史资料冲散。

#### 动态 mock 增量文档同步

app 项目内存在 `src/api/mock/README.md`、`docs/superpowers/specs/*mock*`、`docs/superpowers/plans/*mock*`、Nitro 运行时说明和历史排错报告。后续迁移动态 mock 或补齐 endpoint 时，文档同步规则如下：

- 每次从 `apps/app/server/modules/**`、`apps/app/src/api/mock/**` 迁移或新增 endpoint 到 `apps/api`，必须同步更新 app 侧 mock 说明或迁移清单，记录旧路径、规范路径、数据源和兼容状态。
- `apps/api` 成为唯一 API 后，应在 `apps/api` 侧形成新的 canonical API/endpoint 文档；`apps/app` 侧文档保留 legacy 背景和兼容说明。
- 不允许只修改动态 registry、memory repository 或 mock 包装层而不更新对应文档状态。
- 对仍处于 mock/memory 数据源的接口，文档必须明确标记“非生产数据源”，避免被误当作真实数据库实现。

### 阶段 2：建立 `apps/api` 影子服务

新增最小 Nitro 服务，先不迁移大业务：

- 健康检查
- CORS
- runtimeConfig
- 环境变量读取
- 数据库连接
- 统一响应基础类型
- 基础测试

所有 H3 API 必须从 `nitro/h3` 导入。

### 阶段 3：接入 app/admin 到统一 API

通过环境变量或代理配置，让两端可以指向 `apps/api`：

- admin 使用统一 API base URL，不再依赖生产同源 `/api`。
- app 短期保留 `/app/**`、`/callComponent/**` 旧路径契约。
- 不在这一阶段大改页面和业务组件。

### 阶段 4：迁移 app legacy API

把 `apps/app/server/**` 中的 legacy dispatcher、runtime endpoints、memory repository、模块接口逐步迁入 `apps/api`。

迁移顺序：

1. 保持旧路径行为一致。
2. 固定兼容测试。
3. 增加 adapter，把 app legacy 字段映射到统一 schema/DTO。
4. 再替换 mock/memory 数据源为真实数据库。

### 阶段 5：迁移 admin API 并补齐 CRUD

按 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径迁移。

优先处理：

- `property-manage/expense-manage`
- `property-manage/house-property-manage`
- `property-manage/parking-manage`
- `property-manage/patrol-manage`
- `property-manage/repairs-manage`
- `operation-team`
- `dev-team/menu-manage`

每个业务路径逐步补齐：

- `list`
- `detail`
- `create`
- `update`
- `delete`
- 必要的业务 action

### 阶段 6：收口旧服务

确认 admin/app 都稳定消费 `apps/api` 后，再逐步退役：

- `apps/admin/server`
- `apps/app/server`

删除旧服务必须放在最后，且要有回滚路径。

## 第一阶段禁做清单

以下事项必须记录并严格避免：

1. 不使用 `git subtree` 迁入 app。
2. 不保留 `01s-11comm-app` 的历史提交。
3. 不在第一阶段重写 app 项目结构。
4. 不删除 `apps/app/server`。
5. 不删除 `apps/admin/server`。
6. 不立即合并两个现有 Nitro server。
7. 不把 app 当前 Nitro 直接定义为唯一后端。
8. 不把 admin 当前 Nitro 直接定义为唯一后端。
9. 不批量改写 app 的接口调用。
10. 不批量改写 admin 的页面和组件。
11. 不一次性补齐 100 个 admin 业务路径的 CRUD。
12. 不批量重命名数据库字段。
13. 不在 `apps/api` 内私自定义新的数据库表事实来源。
14. 不新增 JWT、Token 校验、Neon Auth 或任何接口鉴权。
15. 不从 `"h3"` 直接导入 H3 函数。
16. 不全局安装工具包。
17. 不让多个编辑子代理同时修改根级 `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`turbo.json`、部署配置。
18. 不把 app mock/memory repository 当作最终生产数据源。
19. 不把 app legacy 字段直接污染 admin schema。
20. 不删除 legacy 路由 `/app/**`、`/callComponent/**`，先保留兼容。
21. 不粗暴删除从 app 项目迁入的 skills 技能。
22. 不在第一阶段把 app skills 和本项目 skills 强行合并。
23. 不把过时技能直接覆盖本项目已有 `.claude/skills/**` 或 `.agents/skills/**`。
24. 不把 app 的 `docs/**`、`openspec/**`、根级 AI 记忆文档直接覆盖主项目根级文档。
25. 不在没有 Markdown 清单、重复组记录和敏感信息扫描结果前删除 app 文档。
26. 不把 `src/uni_modules/**`、`gitee-example/**`、模板文档或第三方文档升级为主项目规范事实来源。
27. 不把 app 历史 prompt 中的临时指令直接提升为当前 monorepo 的长期执行规则。
28. 不在发现真实 token、数据库连接串、API key、生产密码后继续原样迁入可共享文档。
29. 不只迁移动态 mock 代码而遗漏 endpoint 文档、legacy 路径说明和数据源状态说明。
30. 不由迁移执行代理自行 `git commit`；提交必须由用户明确授权后再单独处理。
31. 不迁入 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 等无关 AI 客户端目录。

## 风险控制

- 使用影子迁移：`apps/api` 先并行存在，旧服务先不删。
- 使用兼容路由：保留 app legacy 路径，新增规范路径。
- 使用显式 adapter：app 旧字段和 DB schema 字段之间必须有映射层。
- 使用环境变量切流：admin/app 的 API base URL 必须能回退。
- 使用分模块验收：每次只迁移少量业务路径。
- 使用 `apps/type` 作为唯一事实来源：所有 schema 变更按 Trinity Pattern 和导出链同步。
- 使用文档分层迁移：app 自有 Markdown 经过排除清单过滤后保留在 `apps/app`，再通过清单、重复组和敏感扫描逐步治理，不直接冲击主项目文档体系。

## 验收标准

第一阶段完成时必须满足：

- `apps/app` 存在，并保留原 app 主体结构。
- `apps/app` 不包含嵌套 `.git`。
- 根 workspace 能识别 `apps/app`。
- 迁入不破坏现有 `apps/admin` 与 `apps/type`。
- 用户既有暂存修改不被混入迁移提交。
- app 项目内有价值的 skills 技能已被保留或记录到迁移清单。
- app skills 与本项目 skills 的冲突点已记录，但未在第一阶段强行合并。
- app 项目自有 Markdown 已随快照保留到 `apps/app`，且未覆盖主项目根级 `docs/**`、`.claude/skills/**`、`.agents/skills/**`、`CLAUDE.md`、`AGENTS.md`、`GEMINI.md`。
- 已生成 `apps/app/docs/migration/markdown-inventory.md` 或等价清单，记录路径、类别、价值等级、重复关系、敏感信息状态和后续处理建议。
- 已确认 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 没有进入 `apps/app`；如其中存在价值内容，只能在清单中记录人工摘录建议。
- 已识别 `.claude/**`、`.agent/**`、`.agents/**` 内的重复 skills、根级 AI 记忆文档等重复组，并明确第一阶段只记录、不删除、不强行合并。
- 已完成 Markdown 敏感信息扫描，真实凭据已脱敏或阻断迁入，演示账号和示例连接串已标注为示例/历史参考。
- 与 Nitro legacy、动态 mock、endpoint coverage 相关的 app 文档已被标记为 `apps/api` 迁移期间需要持续同步的文档。

`apps/api` 阶段完成时必须满足：

- API 可独立启动和构建。
- 健康检查可访问。
- 不依赖 admin Vite 或 app uni 编译。
- H3 API 均从 `nitro/h3` 导入。
- 不存在鉴权中间件或鉴权插件。
- 数据库连接通过请求事件和 runtimeConfig 安全读取。
