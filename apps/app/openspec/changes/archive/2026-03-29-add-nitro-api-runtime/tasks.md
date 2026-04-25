## 1. 试点批次（Pilot Batch）

- [x] 1.1 [新增] `src/tests/nitro-runtime/runtime-base-url.test.ts` - 为 `mock`、`nitro-vite`、`nitro-standalone` 三套运行时的基址解析编写回归测试
- [x] 1.2 [新增] `src/http/runtime-base.ts` - 实现统一运行时基址解析函数，供 Alova、旧 `uni.request` 与上传逻辑复用
- [x] 1.3 [新增] `server/routes/__nitro/health.get.ts` - 创建独立 Nitro 健康检查接口，作为串行启动与基础联通验证入口

## 2. 运行时基建

- [x] 2.1 [修改] `package.json` - 增加 Nitro 依赖与 `dev:h5:mock`、`dev:h5:nitro`、`dev:nitro`、`build:nitro`、`preview:nitro`、`dev:mp-weixin:nitro` 脚本
- [x] 2.2 [新增] `nitro.config.ts` - 配置 `serverDir`、`runtimeConfig`、`devServer`、旧业务路径 handlers 与别名
- [x] 2.3 [修改] `vite.config.ts` - 按 `VITE_API_RUNTIME` 动态启用 `mockDevServerPlugin` 或 `nitro()`，同时保留现有 Vite 6 兼容补丁
- [x] 2.4 [新增] `env/.env.development-nitro` - 声明 H5 Nitro 全栈模式所需的运行时变量
- [x] 2.5 [新增] `env/.env.development-nitro-api` - 声明微信小程序独立 Nitro 模式所需的运行时变量
- [x] 2.6 [新增] `server/handlers/legacy-dispatch.ts` - 创建 `/app/**` 与 `/callComponent/**` 的统一 Nitro dispatcher 入口
- [x] 2.7 [新增] `scripts/dev-mp-weixin-nitro.mjs` - 实现先启动 Nitro、轮询健康检查、再启动 `uni -p mp-weixin` 的串行脚本

## 3. 共享核心

- [x] 3.1 [新增] `server/shared/runtime/nitro-request-context.ts` - 定义共享 request context 与 Nitro 输入归一化逻辑
- [x] 3.2 [新增] `server/shared/runtime/response-builder.ts` - 实现统一响应构造函数，保持前端现有业务码与数据结构兼容
- [x] 3.3 [新增] `server/shared/runtime/endpoint-registry.ts` - 定义端点注册表、动态路径匹配与分发接口
- [x] 3.4 [新增] `server/shared/runtime/memory-repository.ts` - 定义试点模块通用的 repository 边界、数据源枚举与 mock 内存实现
- [x] 3.5 [新增] `server/shared/runtime/mock-definition-adapter.ts` - 实现 Vite mock 对共享端点注册表的适配层
- [x] 3.6 [新增] `server/shared/runtime/legacy-endpoints.ts` - 实现 Nitro dispatcher 对 legacy mock 端点的全量适配与冲突路由兼容层
- [x] 3.7 [修改] `src/api/mock/shared/utils.ts` - 保留 `defineUniAppMock` 等 Vite 专属能力，并改为复用共享业务响应与通用工具

## 4. repair 试点模块

- [x] 4.1 [新增] `server/modules/repair/repository.ts` - 定义 `repair` 模块的独立 repository 接口与 mock 内存实现
- [x] 4.2 [新增] `server/modules/repair/endpoints.ts` - 将 `repair` 模块从 legacy mock 适配层中拆出，注册到共享端点注册表
- [x] 4.3 [新增] `src/tests/nitro-runtime/repair-endpoints.test.ts` - 为 `repair` 模块拆分后的端点路径匹配、响应结构与仓储行为编写专项测试
- [x] 4.4 [修改] `src/api/mock/repair.mock.ts` - 将现有 Vite mock 改为薄包装层，内部调用共享 `repair` 端点逻辑

## 5. work-order 试点模块

- [x] 5.1 [新增] `server/modules/work-order/repository.ts` - 定义 `work-order` 模块的独立 repository 接口与 mock 内存实现
- [x] 5.2 [新增] `server/modules/work-order/endpoints.ts` - 将 `work-order` 模块从 legacy mock 适配层中拆出，注册到共享端点注册表
- [x] 5.3 [新增] `src/tests/nitro-runtime/work-order-endpoints.test.ts` - 为 `work-order` 模块拆分后的端点路径匹配、响应结构与仓储行为编写专项测试
- [x] 5.4 [修改] `src/api/mock/work-order.mock.ts` - 将现有 Vite mock 改为薄包装层，内部调用共享 `work-order` 端点逻辑

## 6. 请求入口收口与验证

- [x] 6.1 [修改] `src/http/alova.ts` - 接入统一运行时基址解析逻辑，兼容三套 API 运行时
- [x] 6.2 [修改] `src/http/interceptor.ts` - 让旧 `uni.request` 请求链复用统一运行时基址解析逻辑
- [x] 6.3 [修改] `src/utils/uploadFile.ts` - 让上传相关地址解析与统一运行时基址逻辑保持一致
- [x] 6.4 [修改] `docs/plan/2026-03-28-add-nitro-api-runtime.md` - 回填首批实现进展与偏差说明
- [x] 6.5 [修改] `src/config/project-domains.ts`、`src/http/runtime-base.ts`、`src/http/alova.ts`、`nitro.config.ts`、`env/.env.production*`、`README.md`、`docs/prompts/*`、`docs/plan/2026-03-29-vercel-dual-project-deployment.md` - 将 11comm H5 与 Nitro 生产域名改为通过 `@ruan-cat/domains` 的 `11commAppH5` / `11commAppNitroServer` 别名统一解析，并移除生产 env 文件中的直写域名

## 7. 全量 legacy mock 接入

- [x] 7.1 [新增] `src/tests/nitro-runtime/legacy-endpoints.test.ts` - 为全量 legacy mock 接入、动态路径匹配与重复路径兼容行为编写回归测试
- [x] 7.2 [新增] `server/shared/runtime/legacy-endpoints.ts` - 汇总全部 `src/api/mock/*.mock.ts` 并为重复 URL 提供兼容型 Nitro endpoint 定义
- [x] 7.3 [修改] `server/shared/runtime/endpoint-registry.ts`、`server/shared/runtime/mock-definition-adapter.ts`、`server/handlers/legacy-dispatch.ts` - 支持动态路径参数并让 Nitro dispatcher 切换到全量 legacy registry

## 8. 共享模块运行时集成补录

- [x] 8.1 [修改] `server/shared/runtime/runtime-endpoints.ts` - 把 `activity`、`appointment`、`complaint`、`contact`、`coupon`、`floor`、`item-release`、`notice`、`owner`、`profile`、`room`、`staff`、`test`、`unit`、`video`、`visit` 等已共享化模块接入 Nitro 优先注册层，并为 `purchase` 只接入 `purchaseRuntimeEndpointDefinitions`
- [x] 8.2 [修改] `docs/plan/2026-03-28-add-nitro-api-runtime.md` - 回填本轮轻量模块接线结果与 `purchase` / `fee` 冲突边界说明，明确 legacy compatibility 已收敛为冲突 URL 兼容层
- [x] 8.3 [修改] `openspec/changes/add-nitro-api-runtime/tasks.md` - 记录本轮 central integration 收尾，保持任务清单与实际 runtime 装配状态一致
