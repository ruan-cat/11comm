## Why

当前项目的本地 mock 体系依赖 `vite-plugin-mock-dev-server`，只能在 H5 `serve` 场景下生效，导致微信小程序开发期无法复用现有模拟接口。现在需要引入 Nitro v3，提供既能支撑 H5 全栈开发、又能支撑小程序独立 API 开发的统一运行时底座，并为未来接入 Neon 数据库提前抽出稳定边界。

## What Changes

- 引入 Nitro v3，新增 `mock`、`nitro-vite`、`nitro-standalone` 三套可并存 API 运行时。
- 为 H5 开发增加基于 `VITE_API_RUNTIME` 的插件分流，按模式动态启用 `mockDevServerPlugin` 或 `nitro()`。
- 新建独立 Nitro 服务目录、运行时配置、健康检查接口和旧业务路径 dispatcher。
- 抽出试点模块共享核心，统一端点注册、请求解析、响应格式和 `repository` 抽象。
- 将 `repair` 与 `work-order` 模块改造成 mock / nitro 双适配试点，前端 API 路径保持不变。
- 收敛 `src/http/alova.ts`、`src/http/interceptor.ts` 与上传工具的基址解析逻辑，让不同运行时通过统一配置切换。
- 新增微信小程序开发串行启动脚本，先拉起独立 Nitro，再启动 `uni -p mp-weixin`。

## Capabilities

### New Capabilities

- `nitro-api-runtime`: 为项目提供可并存的 Nitro 全栈与独立 API 运行时、健康检查、脚本矩阵和环境切换能力。
- `shared-api-adapter`: 为试点模块提供共享端点注册表、统一 request/response 适配和可切换的 mock repository 边界。
- `mp-dev-nitro-bootstrap`: 为微信小程序开发提供先启动 Nitro 再启动 uni 编译链的串行引导能力。

### Modified Capabilities

- `batch-page-migration`: 前端页面迁移后的接口调用需要在不改业务 URL 的前提下兼容新的运行时基址解析策略。

## Impact

- 影响代码与配置：
  - `package.json`
  - `vite.config.ts`
  - `env/*`
  - `src/http/*`
  - `src/api/mock/shared/*`
  - `src/api/mock/repair.mock.ts`
  - `src/api/mock/work-order.mock.ts`
  - `server/**`
  - `scripts/**`
- 影响开发方式：
  - H5 开发将区分 mock 与 nitro 两种入口。
  - 微信小程序开发将依赖独立 Nitro 服务。
- 影响后续扩展：
  - 当前仅提供 mock 内存仓储实现，但能力边界会明确为后续 Neon/Drizzle 接管预留接口。
