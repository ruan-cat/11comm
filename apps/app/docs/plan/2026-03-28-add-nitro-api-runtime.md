<!-- 已完成 -->

# 2026-03-28 Nitro 双运行时改造实施计划

## 1. 文档与变更标识

- 计划文档路径固定为 `docs/plan/2026-03-28-add-nitro-api-runtime.md`。
- OpenSpec 变更名固定为 `add-nitro-api-runtime`。
- 本计划最初在项目内 `.worktrees/add-nitro-api-runtime` 隔离 worktree 中启动；截至 `2026-03-29`，相关实现已全部回填到当前 `dev` 主工作区，后续实施统一直接在主工作区继续。

## 2. 目标摘要

- 为当前 uni-app 项目引入 Nitro v3，形成 3 套可并存运行时：
  - `mock`：H5 开发继续走 `vite-plugin-mock-dev-server`。
  - `nitro-vite`：H5 开发走 `nitro()` 全栈模式。
  - `nitro-standalone`：独立 `nitro dev/build/preview` 提供 API，供微信小程序开发和未来独立部署。
- 第一阶段不接 Neon 真库，但必须抽出 `repository` 边界，为后续 `mock -> neon` 切换留口。
- 首批只实施“基建 + 试点”，试点模块固定为 `repair` 和 `work-order`，不做 28 个 mock 模块的全量直改。
- 前端现有接口地址保持不变，继续兼容 `/app/...`、`/callComponent/...` 等旧业务路径，不统一改成 `/api/...`。

## 3. 核心设计决策

- 采用“共享核心 + 双适配器”结构：
  - 共享核心承载试点模块的端点注册表、请求解析、响应格式、仓储接口、内存仓储实现。
  - Vite mock 侧保留 `*.mock.ts` 作为薄适配层，复用共享核心。
  - Nitro 侧通过统一 dispatcher 承载旧业务路径，复用同一套共享核心。
- Nitro 第一阶段不采用“每个 endpoint 一个文件路由”的手工平铺方案；改用 Nitro `handlers` 把 `/app/**`、`/callComponent/**` 挂到统一分发入口，避免首批被样板代码淹没。
- 请求基址统一收口，不再让 Alova、旧 `uni.request`、上传工具各自维护前缀逻辑。
  - `mock` 模式维持当前 H5 代理前缀行为。
  - `nitro-vite` 模式下 H5 同源直打旧业务路径，不再额外补代理前缀。
  - `nitro-standalone` 模式下各端直接访问 `VITE_SERVER_BASEURL` 指向的 Nitro 服务。

## 4. 实施拆分

### 4.1. 第 1 批：运行时基建

- 安装并锁定 Nitro v3 依赖。
- 新建 `nitro.config.ts`、`server/` 目录、基础 health handler、runtimeConfig、基础 CORS 和 dispatcher 入口。
- 为 `vite.config.ts` 增加基于 `VITE_API_RUNTIME` 的插件分流：
  - `mock` 启用 `mockDevServerPlugin`
  - `nitro-vite` 启用 `nitro()`
  - 保留现有 `VITE_PREVIEW=true` 与 build 阶段 `enabled: false` 的 Vite 6 兼容补丁
- 新增脚本：
  - `dev:h5:mock`
  - `dev:h5:nitro`
  - `dev:nitro`
  - `build:nitro`
  - `preview:nitro`
  - `dev:mp-weixin:nitro`
- 新增环境文件：
  - `env/.env.development-nitro`
  - `env/.env.development-nitro-api`
- 固定环境变量：
  - `VITE_API_RUNTIME=mock|nitro-vite|nitro-standalone`
  - `NITRO_DATA_SOURCE=mock|neon`
  - `NITRO_PORT=3101`

### 4.2. 第 2 批：共享核心

- 抽出试点模块共享能力层，至少包含：
  - 端点定义类型
  - 统一 request context 适配
  - 统一 response builder
  - `repository` 接口
  - 内存版 `repository` 实现
- 让现有 mock 公共能力迁入共享层或被共享层复用，避免继续把业务逻辑绑死在 `defineUniAppMock` 运行时。
- 保留现有 `src/api/mock/shared/utils.ts` 中可复用的数据/响应工具，但把 Vite mock 专属行为和共享业务行为分层。

### 4.3. 第 3 批：试点模块迁移

- 先迁 `repair` 模块，再迁 `work-order` 模块。
- 为这两个模块建立共享 endpoint 注册表。
- 保持前端 `src/api/repair.ts`、`src/api/work-order.ts` 的 URL 契约不变。
- 将对应 `*.mock.ts` 改为薄包装，内部调用共享核心。
- 为 Nitro dispatcher 注册同一批端点，实现 mock / nitro 双运行时一致。

### 4.4. 第 4 批：请求入口收口

- 收敛 `src/http/alova.ts`、`src/http/interceptor.ts`、上传/工具函数中的 URL 拼接逻辑，统一由运行时配置决定基址。
- 保证旧 `@/http/http` 的调用链至少能与新的运行时基址策略对齐，不额外扩写登录/鉴权。

### 4.5. 第 5 批：微信小程序开发串行启动

- `dev:mp-weixin:nitro` 通过本地 Node 启动脚本串行启动：
  - 先拉起 Nitro 独立服务
  - 轮询 `http://127.0.0.1:3101/__nitro/health`
  - 成功后再执行 `uni -p mp-weixin --mode development-nitro-api`
- 不引入新的并发脚本依赖，优先使用仓库内脚本控制可维护性。

## 5. 后续批次规划

### 5.1. 第二波模块

- `property-application`
- `inspection`
- `maintenance`
- `renovation`

### 5.2. 第三波模块

- `resource`
- `parking`
- `oa-workflow`
- `meter`
- `fee`

### 5.3. 第四波模块

- 剩余轻量模块与测试/示例端点

## 6. 测试与验收

### 6.1. 单测覆盖

- 运行时基址解析
- endpoint 注册表匹配
- Nitro event 到共享 request context 的转换
- 内存仓储的读写与重置语义
- `repair` / `work-order` 在 mock 与 nitro 下的响应一致性

### 6.2. 烟测命令覆盖

- `dev:h5:mock`
- `dev:h5:nitro`
- `dev:nitro`
- `dev:mp-weixin:nitro`
- `build:nitro`
- `preview:nitro`

### 6.3. 端到端验收

- H5 mock 模式下，试点页面继续走 Vite mock 正常工作。
- H5 nitro 模式下，前端页面不改 API 地址即可命中 Nitro。
- 微信小程序模式下，先起 Nitro 后起编译链，试点页面能访问独立 Nitro。
- 不运行类型检查；以 Vitest、命令启动成功、关键页面联通为验收标准。

## 7. 默认假设

- worktree 隔离阶段已经结束；后续继续推进 `add-nitro-api-runtime` 时，默认直接在当前 `dev` 主工作区完成，不再要求重新创建 `.worktrees/add-nitro-api-runtime`。
- 第一阶段只实现 `repository` 抽象和 mock 内存实现，不写 Drizzle schema、migrations、seed。
- `NITRO_DATA_SOURCE=neon` 仅保留配置和接口占位，不在本阶段接入真实数据库。
- 试点阶段以 Node standalone 为独立 Nitro 默认构建目标，不先做 Cloudflare/Vercel 专项部署。
- 当前前端接口路径契约必须保持稳定，禁止为了 Nitro 首批改造而批量重写前端 API 地址。

## 8. 首轮执行顺序

说明：以下 `1-3` 是本次改造已经完成的启动记录，其中 worktree 步骤已结束；后续继续执行时，应从第 `4` 步开始，并在当前 `dev` 主工作区推进。

1. [已完成] 在项目内创建 `.worktrees/add-nitro-api-runtime` 隔离 worktree。
2. [已完成] 在隔离 worktree 中落盘 `docs/plan/2026-03-28-add-nitro-api-runtime.md`。
3. [已完成] 依据 OpenSpec 新建 `add-nitro-api-runtime` 变更并生成首个 artifact 指令。
4. 先完成运行时基建与脚本矩阵，再进入共享核心抽象。
5. 完成 `repair` 试点并验证后，再迁 `work-order`。
6. 两个试点模块全部通过后，才推进第二波业务模块。

## 9. 当前现状与实施进度记录

### 9.1. 当前落地状态

- 当前改造已从隔离 worktree `.worktrees/add-nitro-api-runtime` 全量回填到当前 `dev` 主工作区，后续继续开发以主工作区为唯一实施位置。
- 原 `add-nitro-api-runtime` Git worktree 记录与分支已清理完成；如果磁盘上仍残留 `.worktrees/add-nitro-api-runtime` 目录，只视为 Windows 锁文件导致的非 Git 遗留目录，不再作为后续实施位置。
- OpenSpec 变更 `add-nitro-api-runtime` 已创建完成，相关 proposal、design、tasks 与 delta specs 已落盘。
- 计划文档本身已作为持续维护的主入口，后续任何阶段性偏差、验证结果和遗留问题都应继续回填到本文件。

### 9.2. 已完成的实现项

- 在 `package.json`、`vite.config.ts`、`nitro.config.ts` 中完成了双运行时脚本矩阵、Nitro 配置和 Vite 动态插件装载逻辑。
- 在 `src/http/runtime-base.ts` 中完成了运行时基址收口，并已接入 `src/http/alova.ts`、`src/http/interceptor.ts`、`src/utils/index.ts`、`src/utils/uploadFile.ts`、`src/hooks/useUpload.ts`、`src/pages/me/me.vue`。
- 在 `server/handlers/legacy-dispatch.ts`、`server/shared/runtime/endpoint-registry.ts`、`server/shared/runtime/nitro-request-context.ts`、`server/shared/runtime/memory-repository.ts`、`server/shared/runtime/mock-definition-adapter.ts`、`server/shared/runtime/pilot-endpoints.ts` 中补齐了共享 dispatcher、Nitro request context 转换、mock/neon 预留仓储边界与试点端点注册。
- 在 `server/shared/runtime/legacy-endpoints.ts` 中补齐了“全量 legacy mock -> Nitro” 聚合层，当前 `src/api/mock/*.mock.ts` 已可整体接入 Nitro dispatcher，不再只局限于 `repair` / `work-order` 两个试点文件。
- 在 `server/shared/runtime/endpoint-registry.ts` 中补齐了 `:param` 动态路径匹配能力，使 `/app/staff/:staffId` 这类旧 mock 路径可以在 Nitro 下被正确命中。
- 针对 `/app/fee.queryFeeDetail`、`/callComponent/core/list`、`/app/resourceStore.listResourceStores`、`/app/purchase/purchaseApply`、`/app/resourceStoreType.listResourceStoreTypes` 这 5 组重复 legacy URL，已在 Nitro 聚合层中补齐兼容策略，避免全量注册后因导入顺序导致响应漂移。
- 在 `server/shared/runtime/common-utils.ts`、`server/shared/runtime/response-builder.ts` 与 `src/api/mock/shared/utils.ts` 中完成了“共享通用工具 / 共享业务响应 / Vite 专属 mock 包装”的重新分层，避免 `server` 继续反向依赖 `src/api/mock/shared/utils.ts`。
- 在 `server/modules/repair/repository.ts`、`server/modules/repair/endpoints.ts`、`server/modules/work-order/repository.ts`、`server/modules/work-order/endpoints.ts` 中完成了两组试点模块的独立仓储与共享 endpoint 定义，并让 `src/api/mock/repair.mock.ts`、`src/api/mock/work-order.mock.ts` 都收敛为薄包装层。
- 在 `server/shared/runtime/runtime-endpoints.ts` 与 `server/handlers/legacy-dispatch.ts` 中把 Nitro dispatcher 调整为“显式共享模块优先 + legacy adapter 兜底”的组合注册方式，避免继续把模块迁移做成全量聚合文件的自我扩张。
- 在 `scripts/dev-h5-nitro.mjs` 和 `scripts/dev-mp-weixin-nitro.mjs` 中完成了串行启动控制，并补上了“3101 已有健康 Nitro 时直接复用”的逻辑。
- 在 `patches/vite-plugin-mock-dev-server@2.1.1.patch` 中加入了 pnpm 级补丁，修复安装 Nitro 后 `vite-plugin-mock-dev-server` 因优先走 `rolldown` 而导致的 H5 mock 模式异常。
- 在 `src/tests/nitro-runtime/` 下补齐了运行时基址、endpoint registry、pilot endpoints、Nitro request context、memory repository 五组测试。

### 9.3. 已完成的验证记录

- 首轮 `pnpm exec vitest run src/tests/nitro-runtime` 已通过，当时为 5 个测试文件、15 个测试全部通过。
- `pnpm exec vitest run src/tests/nitro-runtime/legacy-endpoints.test.ts` 已通过，覆盖了全量 legacy mock 注册、动态路径参数与重复 URL 兼容行为。
- `pnpm exec vitest run src/tests/nitro-runtime` 已重新复测通过，当前为 6 个测试文件、24 个测试全部通过。
- `pnpm exec vitest run src/tests/nitro-runtime/repair-endpoints.test.ts` 已通过，覆盖了 `repair` 模块拆分后的共享 registry 注册、响应结构与状态流转。
- `pnpm exec vitest run src/tests/nitro-runtime/work-order-endpoints.test.ts` 已通过，覆盖了 `work-order` 模块拆分后的共享 registry 注册、响应结构与状态流转。
- `pnpm exec vitest run src/tests/nitro-runtime` 已再次复测通过，当前为 8 个测试文件、30 个测试全部通过。
- `pnpm run dev:h5:mock` 已烟测通过，H5 mock 模式可正常启动，且不再出现 `vite-plugin-mock-dev-server` 的 `rolldown` alias 转换错误。
- `pnpm run dev:nitro` 已烟测通过，`http://127.0.0.1:3101/__nitro/health` 可访问，`/app/workorder/detail` 试点接口可返回正常结果。
- `pnpm run build:nitro` 已通过，Node standalone 产物可正常构建。
- `pnpm run preview:nitro` 已烟测通过。当前实现不是调用 `nitro preview`，而是直接运行 `.output/server/index.mjs`，以规避 Nitro beta 在当前仓库组合下的 preview CLI 崩溃问题。
- `pnpm run dev:h5:nitro` 已烟测通过，但当前结果为“standalone Nitro + H5 联调”而不是真正的 `nitro/vite` 全栈同进程模式。
- 按仓库要求，本阶段没有运行类型检查命令。

### 9.4. 当前已知限制与阻塞

- 当前仓库仍停留在 Vite 6，因此 Nitro v3 的 `nitro/vite` 插件无法以目标形态运行；`dev:h5:nitro` 现阶段是自动回退到 standalone Nitro + H5 联调模式。这是当前技术栈限制，不是脚本故障。
- `dev:mp-weixin:nitro` 已确认能先拉起 Nitro，再进入 uni 编译链；但后续会遇到仓库既有错误 `pages.json->pages/index/index duplication`。该问题已用原始 `pnpm run dev:mp-weixin` 复测，基线同样失败，因此暂不归因于本次 Nitro 改造。
- `NITRO_DATA_SOURCE=neon` 目前仍然只是边界预留与报错占位，尚未进入真实 Neon / Drizzle 接入阶段。

### 9.5. 后续继续推进时的注意事项

- `repair` 与 `work-order` 已完成“共享仓储 + 共享 endpoint + mock 薄包装”的拆分，后续第二波业务模块应直接复用这一模式推进，而不是继续扩大 `legacy-endpoints.ts` 的业务覆盖面。
- `runtime-endpoints.ts` 当前已经形成“显式共享模块优先 + legacy adapter 兜底”的过渡结构；新增模块时，应优先把共享端点接到这一层，再视重复 URL 情况决定是否暂时继续走 legacy 兼容分支。
- 在开始第二波业务模块前，应优先处理或隔离 `mp-weixin` 的 `pages/index/index duplication` 基线问题，否则会持续影响小程序链路验收。
- 如果未来仓库整体升级到 Vite 7 及以上，应第一时间回头验证 `nitro/vite` 真正的全栈模式，并评估是否可以移除当前 `dev:h5:nitro` 的 fallback 逻辑。

### 9.6. `vite-plugin-mock-dev-server` 补丁说明

- 本次改造新增了 [vite-plugin-mock-dev-server@2.1.1.patch](D:/code/github-desktop-store/001-Smart-Community__nwt-q/patches/vite-plugin-mock-dev-server@2.1.1.patch)，并通过 [package.json](D:/code/github-desktop-store/001-Smart-Community__nwt-q/package.json) 里的 `pnpm.patchedDependencies` 强制应用。这个 patch 不是附带优化，而是保证本项目“H5 mock 模式继续可用”的关键兼容层；后续整理 PR 或继续开发时，应始终以主工作区内的这两个文件为准，不要再引用旧 worktree 路径。
- 设计背景是：在 2026-03-28 这轮 Nitro 接入中，仓库新增了 `nitro@3.0.260311-beta`。Nitro 会把 `rolldown` 带进依赖图，而 `vite-plugin-mock-dev-server@2.1.1` 在运行时检测到 `rolldown` 可用后，会优先走 `rolldown` 的打包路径，而不是原本稳定的 `esbuild` 路径。
- 问题触发后，`pnpm run dev:h5:mock` 虽然能把 Vite dev server 拉起来，但 mock 插件会在内部反复报错，典型报错信息是 `Failed to convert builtin plugin 'ViteAlias'` 和 `BindingViteAliasPluginAlias.replacement`。这说明问题不在业务 mock 数据本身，而是在插件切换到 `rolldown` 后，无法正确处理当前仓库 Vite alias 配置中的某些 replacement 形态。
- 这件事的重要性很高，因为它会直接破坏本项目最基本的回归链路：我们引入 Nitro 的目标是增加“真实接口运行时”，而不是牺牲现有的 H5 mock 开发流。如果不先修这个兼容问题，整个“双运行时并存”方案就失去了回退路径，也无法证明 Nitro 改造是增量安全的。
- 当前 patch 的改动刻意保持最小，只做了一件事：把 `vite-plugin-mock-dev-server` 内部对构建器的选择顺序，从“优先 `rolldown`，其次 `esbuild`”，调整成“优先 `esbuild`，其次 `rolldown`”。也就是说，这个 patch 不是去重写插件逻辑，而是把插件带回本项目在 Nitro 接入前已验证稳定的执行路径。
- 之所以采用这种最小 patch，而不是在本仓库继续绕开或篡改 alias 配置，是因为问题根源不在业务代码，而在插件对“同时存在 `rolldown` 与 `esbuild`”场景下的默认选择策略。把规避逻辑写进项目配置，只会掩盖上游兼容性问题，不利于未来发起 PR。
- 这个 patch 对未来上游 PR 的价值在于，它已经帮我们明确了复现条件与最小修复方向：
  - 复现条件：Vite 6 项目、存在当前仓库这种 alias 配置、安装 Nitro 后依赖图中出现 `rolldown`、继续使用 `vite-plugin-mock-dev-server@2.1.1`。
  - 现象：H5 mock 模式启动时出现 `ViteAlias` 转换失败，mock 编译链不稳定或失效。
  - 最小验证修复：让插件优先使用 `esbuild` 路径后，`pnpm run dev:h5:mock` 立即恢复正常。
- 因此，未来向 `vite-plugin-mock-dev-server` 提 PR 时，建议把这个 patch 视为“本地验证过的止血方案”，而不是最终 upstream 设计。更合理的 PR 方向应至少覆盖以下其中之一：
  - 当 `rolldown` 与 `esbuild` 同时存在时，不要无条件优先 `rolldown`。
  - 针对包含函数或非纯字符串 replacement 的 alias 配置，避免进入当前会失败的 `rolldown` 路径。
  - 在 Vite 6 / uni-app 这类已知兼容组合下，显式回退到 `esbuild`，而不是让用户自己用 patch 止血。
- 在上游问题修复并发布后，应优先移除本仓库的本地 patch，重新验证 `pnpm run dev:h5:mock`、`pnpm run dev:h5:nitro` 和 `pnpm run dev:nitro` 三条链路，确认本项目可以回归到“零本地补丁”的依赖状态。

### 9.7. 2026-03-30 追加迁移进展

- 第二波模块已经全部完成共享化拆分：`property-application`、`inspection`、`maintenance`、`renovation` 都已迁移到 `server/modules/**`，对应 `src/api/mock/*.mock.ts` 已收敛为薄包装层。
- 第三波核心模块也已完成共享化拆分：`meter`、`fee`、`parking`、`oa-workflow`、`resource` 已完成共享仓储与共享 endpoint 落盘。
- 同日追加完成轻量业务模块的共享化接线：`activity`、`appointment`、`complaint`、`contact`、`coupon`、`floor`、`item-release`、`notice`、`owner`、`profile`、`purchase`、`room`、`staff`、`test`、`unit`、`video`、`visit` 已全部接入 `runtime-endpoints.ts` 的显式共享模块优先层。
- 当前 `runtime-endpoints.ts` 已形成“显式共享模块优先 + legacy compatibility 兜底”的稳定结构：
  - 可直接进入 Nitro 优先层的模块：`activity`、`appointment`、`complaint`、`contact`、`coupon`、`floor`、`inspection`、`item-release`、`maintenance`、`meter`、`notice`、`oa-workflow`、`owner`、`parking`、`profile`、`property-application`（非冲突子集）、`purchase`（仅非冲突子集）、`renovation`、`repair`、`resource`（非冲突子集）、`room`、`staff`、`test`、`unit`、`video`、`visit`、`work-order`
  - 仍通过 legacy compatibility 合并处理的冲突 URL：`/app/fee.queryFeeDetail`、`/callComponent/core/list`、`/app/resourceStore.listResourceStores`、`/app/purchase/purchaseApply`、`/app/resourceStoreType.listResourceStoreTypes`
  - `purchase` 只把 `purchaseRuntimeEndpointDefinitions` 暴露给 Nitro 优先层，继续把 `/app/resourceStore.listResourceStores` 与 `/app/purchase/purchaseApply` 留在 legacy compatibility 合并层，避免重新引入冲突 URL 的优先级漂移
  - `fee` 模块虽然已经共享化，但其唯一 URL `/app/fee.queryFeeDetail` 继续交由 legacy compatibility 合并层承接，避免破坏 `property-application` 的合并响应语义
- 本轮新增的 Nitro 回归测试包括：
  - `property-application-endpoints.test.ts`
  - `renovation-endpoints.test.ts`
  - `meter-endpoints.test.ts`
  - `fee-endpoints.test.ts`
  - `parking-endpoints.test.ts`
  - `oa-workflow-endpoints.test.ts`
  - `resource-endpoints.test.ts`
- 截至本轮回填，`pnpm exec vitest run src/tests/nitro-runtime` 已复测通过，当前为 `34` 个测试文件、`99` 个测试全部通过。
- 当前 legacy adapter 的职责已进一步收敛为“冲突 URL 兼容合并 + 尚未显式共享化模块兜底”；本轮新接入的轻量模块不再依赖 legacy-first 行为。
