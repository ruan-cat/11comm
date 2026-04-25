## Context

当前项目的接口开发完全建立在 `vite-plugin-mock-dev-server` 上，H5 开发可用，但微信小程序开发期无法复用同一套 mock。项目已经拥有大量 `src/api/mock/*.mock.ts` 资产，并且前端页面和 API 层广泛依赖 `/app/...`、`/callComponent/...` 等旧业务路径。与此同时，未来还需要把当前 mock 事实源逐步迁移到 Nitro + Neon，因此本次设计必须同时解决两个问题：当前多运行时开发可用，以及后续真实仓储接管时的低返工成本。

约束如下：

- 不允许为了首批改造批量改写前端 API 地址。
- 不运行类型检查命令。
- 首批只处理 `repair` 与 `work-order` 试点模块。
- 当前仓储只实现 mock 内存版本，但设计必须预留 `neon` 数据源切换口。

## Goals / Non-Goals

**Goals:**

- 为项目建立 `mock`、`nitro-vite`、`nitro-standalone` 三套可切换 API 运行时。
- 将试点模块从“Vite mock 运行时专属代码”改造成“共享核心 + 双适配器”结构。
- 提供微信小程序开发期的 Nitro 串行启动命令。
- 统一前端两条请求链的运行时基址解析逻辑。

**Non-Goals:**

- 不在本阶段接入 Neon、Drizzle schema、migration 或 seed。
- 不在本阶段迁移全部 28 个 mock 模块。
- 不在本阶段引入新的登录或鉴权逻辑。
- 不为每个试点 endpoint 手写一个 Nitro 文件路由文件。

## Decisions

### 决策 1：以共享核心替代直接复制 mock 逻辑

采用共享核心层来承载端点注册表、请求解析、响应格式和 `repository` 接口，再由 mock 适配器与 Nitro dispatcher 复用它。

原因：

- 现有 `*.mock.ts` 已绑定 `defineUniAppMock` 和 Vite 双前缀逻辑，直接平移到 Nitro 会把运行时耦合继续放大。
- 共享核心可以在当前阶段先接 mock 内存仓储，后续再直接接 `neon` 仓储。

备选方案：

- 继续以 `*.mock.ts` 作为唯一事实源：短期快，但后续 Nitro 与数据库接入会持续返工。
- 直接重写所有试点逻辑为 Nitro handler：会丢失现有 mock 资产复用价值。

### 决策 2：Nitro 首批使用统一 dispatcher 承载旧业务路径

首批通过 Nitro `handlers` 把 `/app/**`、`/callComponent/**` 挂到统一 dispatcher，而不是为每个 endpoint 单独创建文件。

原因：

- `repair` 与 `work-order` 首批就有 34 个端点量级，单文件平铺会造成大量样板代码。
- dispatcher 更适合与共享端点注册表对接。

备选方案：

- 每个 endpoint 单独建 Nitro 文件：更“标准”，但首批成本高，且复用共享注册表时收益有限。

### 决策 3：通过 `VITE_API_RUNTIME` 驱动 Vite 插件矩阵

`vite.config.ts` 基于 `VITE_API_RUNTIME` 条件加载 `mockDevServerPlugin` 或 `nitro()`，并保留已有 `VITE_PREVIEW` 与 build 阶段 mock 兼容补丁。

原因：

- 当前仓库已经为 `vite-plugin-mock-dev-server` 做过 Vite 6 兼容收口，不能在这次改造里把这部分稳定性回退。
- 通过单一环境变量驱动可以减少脚本与配置分叉。

备选方案：

- 使用多个完全独立的 Vite 配置文件：切换明确，但维护成本更高。

### 决策 4：统一请求基址解析入口

把 Alova、旧 `uni.request` 拦截器和上传工具的运行时基址判断收敛到共享解析逻辑。

原因：

- 当前 URL 拼接逻辑散落在多个位置，Nitro 接入后很容易出现 H5 双前缀与小程序直连逻辑不一致。
- 统一入口后，页面无需感知当前后端运行时。

备选方案：

- 分别局部修补各个请求入口：改动分散，后期排查成本高。

### 决策 5：微信小程序使用串行脚本，不引入新的并发依赖

`dev:mp-weixin:nitro` 通过仓库内 Node 脚本完成“启动 Nitro -> 轮询健康检查 -> 启动 uni 编译”。

原因：

- 当前目标是降低环境不确定性，而不是追求并发脚本的简短写法。
- 本地 Node 脚本更适合后续扩充日志与错误诊断。

备选方案：

- 引入新的并发命令依赖：实现短，但故障时上下文更差。

## Risks / Trade-offs

- [共享核心拆分不彻底] → 首批只选择 `repair` 与 `work-order` 两个试点模块，先跑通端点注册、仓储和双适配闭环，再扩模块。
- [Nitro dispatcher 与旧 URL 契约不一致] → 为旧业务路径匹配和 request context 转换编写专门测试，先保证契约再迁业务逻辑。
- [H5 前缀逻辑与小程序直连逻辑冲突] → 把基址解析抽成独立单测目标，并对 Alova 与旧 `uni.request` 两条链路同时验证。
- [Nitro 独立启动影响小程序开发体验] → 提供健康检查和超时失败信息，避免无反馈卡死。
- [主工作区依赖基线与验证一致性] → 当前已结束 worktree 隔离阶段，后续统一在 `dev` 主工作区执行 `pnpm install` 与验证命令，避免继续分叉两套依赖环境。

## Migration Plan

1. 在当前 `dev` 主工作区固定计划文档与 OpenSpec 工件；原隔离 worktree 只作为已完成的历史启动阶段，不再作为后续实施位置。
2. 先通过失败测试定义运行时基址解析、端点注册表与 Nitro dispatcher 行为。
3. 落 Nitro 基建、脚本矩阵、环境文件与健康检查。
4. 迁移 `repair` 到共享核心，并同时接上 mock 与 Nitro。
5. 验证 `repair` 通过后迁移 `work-order`。
6. 完成双试点验证后，再进入第二波模块。

回滚策略：

- 若 Nitro 接入破坏现有 H5 mock，则保留 `dev:h5:mock` 作为稳定回退入口。
- 若 dispatcher 方案在试点阶段不可维护，则保留共享核心和仓储边界，改为第二阶段拆分为细粒度 Nitro 文件路由。

## Open Questions

- `login.ts` 与其他少量旧 `@/http/http` 调用是否需要在第二阶段独立纳入 Nitro 试点范围，还是仅保持基址兼容即可。
- 独立 Nitro 的生产部署最终是纯 Node standalone，还是后续还要补 Cloudflare/Vercel preset 适配，目前先按 Node standalone 处理。
