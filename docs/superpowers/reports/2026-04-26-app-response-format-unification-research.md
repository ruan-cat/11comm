<!-- TODO 未使用 有价值的参考报告 -->

# 2026-04-26 App 接口返回格式统一专项研究报告

## 1. 执行摘要

当前 app 与 admin 的接口返回格式不同，不是 Nitro 框架导致的，也不是 `apps/api` 实现随意不统一，而是历史上 app 与 admin 原本就是两套项目、两套接口契约。

- app legacy 契约：`{ code: 0, msg: "...", data: ... }`，成功码固定为 `0`。
- admin canonical 契约：`JsonVO<PageDTO<T>>`，典型结构为 `{ success, code, message, data }`，成功码为 `200`。
- `apps/api` 当前处于影子迁移/兼容迁移阶段：同一套 service/repository 同时通过 `legacy-adapter.ts` 输出 app 老 DTO，通过 `admin-adapter.ts` 输出 admin 标准 DTO。
- 这样做的主要目的，是先让单一 Nitro API 服务跑起来，同时避免一次性改动 app 前端 100+ 页面、列表分页解析、上传链路和大量旧测试。

如果未来统一 APP 为 admin 的 `JsonVO` 格式，可以做，但必须拆成两个任务看：

1. 只统一外层包装：`code/msg/data` -> `success/code/message/data`，规模小到中等。
2. 同时统一业务 payload 与分页结构：app 旧字段、`PaginationResponse`、z-paging 页面、测试断言全部迁移到 `PageDTO`，这是中到偏大的工程。

结论上，不建议直接把现有 `/app/**` 原地改成 `JsonVO<PageDTO<T>>`。推荐先做客户端兼容归一化层，再新增 app-v2 或 manifest 标记 `responseShape: legacy|jsonvo`，最后按模块逐步迁移分页与业务 payload。

## 2. 现状对照

| 维度         | app legacy                                               | admin canonical                                           |
| ------------ | -------------------------------------------------------- | --------------------------------------------------------- |
| 外层成功格式 | `{ code: 0, msg, data }`                                 | `{ success: true, code: 200, message, data }`             |
| 外层失败格式 | `{ code, msg, data: null }`                              | `JsonVO<T>` 可携带 `success/code/message/error/stack`     |
| 成功码       | `0`                                                      | `200`                                                     |
| 提示字段     | `msg`                                                    | `message`                                                 |
| 分页字段     | 视业务而定，例如 `page/row/hasMore` 或业务自定义 payload | `PageDTO<T> { list,total,pageIndex,pageSize,totalPages }` |
| 入口路径     | `/app/**` legacy dispatcher                              | admin routes / adapter                                    |
| 迁移定位     | 兼容旧 app 前端                                          | 后台长期标准 API                                          |

需要温和纠正一点：用户提到的 admin 分页结构 `JsonVO<PageDTO<T>> { success, code, message, data }` 是外层结构没问题，但 `PageDTO<T>` 不是只有 `list,total,pageIndex,pageSize`，还包含 `totalPages`。

## 3. 根因判断

根因不是 Nitro，也不是 `response-builder.ts` 写了两套函数后造成的技术分叉。真正原因是：

1. app 与 admin 历史上就是两个独立项目，前端请求封装、页面消费方式、后端 DTO、测试断言都已经分别固化。
2. 当前 `apps/api` 的迁移目标不是立刻消灭 app legacy 契约，而是先建立一个单一 Nitro 服务，让 app legacy 与 admin canonical 共用同一套领域服务和数据访问层。
3. 设计文档已经明确要求 app adapter 保留 `/app/**` legacy 路径、GET/POST 兼容、旧字段名和旧响应结构；admin adapter 必须返回 `JsonVO/PageDTO`。
4. app legacy 差异不只是 `msg/message`，还包括业务 payload 命名和分页字段。例如 repair legacy 返回 `{ ownerRepairs,total,page,row }`，admin 则返回 `PageDTO { list,total,pageIndex,pageSize,totalPages }`。

所以现在看到的格式分裂，是迁移期的兼容设计，不是最终理想态。

## 4. 代码证据

### admin 标准

- `apps/type/src/common/index.ts:37` 定义 `JsonVO<T>`，字段包括 `success?`, `code`, `message`, `data`, `timestamp?`, `error?`, `stack?`。
- `apps/type/src/common/index.ts:64` 定义 `PageDTO<T>`，字段为 `list`, `total`, `pageIndex`, `pageSize`, `totalPages`。
- `apps/admin/src/composables/use-list-query/index.ts:7` 导入 `JsonVO/PageDTO/BaseListQueryParams`。
- `apps/admin/src/composables/use-list-query/index.ts:68` 返回类型是 `UseQueryReturnType<JsonVO<PageDTO<TItem>>, Error>`。
- `apps/admin/src/composables/use-list-query/index.ts:119-143` 强类型请求 `JsonVO<PageDTO<TItem>>`，并在 `newData?.code === 200` 后读取 `data.list` 和 `data.total`。
- `apps/api/server/shared/runtime/response-builder.ts:33` 的 `adminSuccess<T>()` 返回 `{ success:true, code:200, message, data }`。
- `apps/api/server/modules/fee/admin-adapter.ts:16`、`:27` 的 fee admin adapter 返回 `JsonVO<PageDTO<...>>`。
- `apps/api/server/modules/repair/admin-adapter.ts:20`、`:136` 的 repair admin adapter 返回并构造 `PageDTO<T>`。

### app legacy 标准

- `apps/api/server/shared/runtime/response-builder.ts:3-16` 定义 `LegacyResponse<T> { code,msg,data }` 和 `legacySuccess`，成功固定 `code: 0`。
- `apps/api/server/shared/runtime/response-builder.ts:19-31` 的 `legacyFailure` 返回 `{ code, msg, data:null }`。
- `apps/api/nitro.config.ts:38` 把 `/app/**` 挂到 `./server/handlers/legacy-dispatch`。
- `apps/api/server/handlers/legacy-dispatch.ts:17` 通过 endpoint registry 分发；`:36` 异常也走 `legacyFailure(...)`。
- `apps/api/server/modules/fee/legacy-adapter.ts:19` 起多处调用 `legacySuccess`。
- `apps/api/server/modules/repair/legacy-adapter.ts:17` 起多处调用 `legacySuccess/legacyFailure`。
- `apps/api/server/modules/fee/legacy-endpoints.ts` 当前有 12 个 app legacy endpoint。
- `apps/api/server/modules/repair/legacy-endpoints.ts` 当前有 5 个 app legacy endpoint。
- `apps/api/server/shared/runtime/runtime-endpoints.ts:4` 注册 fee/repair legacy definitions，并带阶段标记。

### 设计文档证据

- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md:391-392` 明确 app adapter 必须保留 `/app/**` legacy 路径、GET/POST 兼容、旧字段名和旧响应结构；admin adapter 必须返回 `JsonVO/PageDTO`。
- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md:431-455` 明确 `apps/api/server/modules/{domain}` 不是照搬 app/admin，而是一套 service/repository 加两套 adapter。

### app 前端消费证据

- `apps/app/src/typings.d.ts:4-6` 全局 `IResData<T>` 是 `code,msg,data`。
- `apps/app/src/http/http.ts:13-26` 旧 `uni.request` 封装返回 `Promise<IResData<T>>`，成功直接 resolve `res.data`。
- `apps/app/src/http/http.ts:88-94` 错误提示读取 `.msg`。
- `apps/app/src/hooks/useRequest.ts:26,36` 继续按旧整包取 `res.data`。
- `apps/app/src/http/alova.ts:100-119` 已经接近 `JsonVO`，读取 `code/message/data` 并返回 `data`。
- `apps/app/src/types/api.ts:9` APP 自己已有近似 `JsonVO` 的类型；`:26` 的分页仍是 APP 风格 `list/total/page/pageSize/hasMore`。
- 直接硬编码 `code !== 0/msg` 的页面很少，主要是 `apps/app/src/pages-sub/fee/write-owe-callable.vue:103-108` 和 `apps/app/src/pages-sub/fee/pay-qrcode.vue:72-77`。
- 大量页面消费 `event.data` 作为业务数据，例如 `apps/app/src/pages-sub/visit/index.vue:39` 读 `event.data?.list`，`apps/app/src/pages-sub/repair/order-list.vue:85` 读 `ownerRepairs`，`apps/app/src/pages/notice/index.vue:36` 读 `notices`，`apps/app/src/pages/activity/index.vue:60` 读 `activitiess`。
- 上传链路在 `apps/app/src/hooks/useUpload.ts:57`、`apps/app/src/utils/uploadFile.ts:297` 解析 JSON 后取 `.data`。

## 5. 影响范围估算

### 已迁入 `apps/api` 的范围

- 当前已迁入 app legacy：2 个模块、17 个 `/app` 端点。
- fee：12 个 legacy endpoint。
- repair：5 个 legacy endpoint。

这些端点已经具备双 adapter 雏形：legacy adapter 服务 app 老契约，admin adapter 服务后台标准契约。

### 旧 app 服务端总量级

- `apps/app/server/modules` 与只读旧仓库 `D:\code\ruan-cat\01s-11comm-app\server\modules` 都有 27 个 endpoint 文件。
- 约 213 条 `/app` URL。
- 约 3 条 `/callComponent` URL。
- 约 220 处 `successResponse(...)`。

统计口径：这里的 27 个 endpoint 文件指业务模块 endpoint 文件，不含 `test/endpoints.ts`；如果把测试模块也计入，目录/文件数会显示为 28。

这说明如果要把所有 app 服务端 legacy 契约完全迁到 `JsonVO`，不能只看现在 `apps/api` 已迁入的 17 个端点，还要考虑后续 27 个 endpoint 文件和 216 条旧路径。

### app 前端消费面

- `apps/app/src` 中约 117 个文件命中 `event.data/res.data/response.data` 等消费模式。
- 页面层约 108 个文件。
- 页面 `.onSuccess(` 约 220 处。
- 页面层 `event.data` 约 144 处。
- z-paging/列表完成相关约 47 个页面文件。
- `PaginationResponse` 相关约 20 个 API/类型文件。
- 测试断言响应结构约 20 个测试文件、113 处。
- 真正直接判断 `code !== 0` 的页面业务点只有约 2 处；核心 code/success 判断约 6 处。

因此，外层响应判断本身并不算最大问题；真正的工作量在页面对 `data` 内部业务字段和分页字段的依赖。

### 粗略分级

| 统一目标                                         | 预估规模 | 主要改动点                                                                                  |
| ------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| 只统一外层包装                                   | 小到中等 | 请求封装、上传封装、全局类型、少量 `code/msg` 特例、相关测试                                |
| 统一外层包装 + 保持业务 payload 不变             | 中等     | 需要兼容 `message/msg`、`success/code`，但页面大多仍可读原业务数据                          |
| 统一外层包装 + 统一 `PageDTO` + 统一业务 payload | 中到偏大 | 20 个 API/类型文件、47 个列表页面、20 个测试文件，以及后续 27 个 endpoint 文件/216 条旧路径 |

## 6. 未来统一方案

未来可以统一 APP 为 admin 的 `JsonVO` 格式，但建议把统一拆成两层：

### 第一层：外层响应统一

目标是让 APP 请求层同时理解：

- legacy 成功：`{ code: 0, msg, data }`
- admin/jsonvo 成功：`{ success: true, code: 200, message, data }`
- legacy 失败：`{ code, msg, data: null }`
- jsonvo 失败：`{ success: false, code, message, error }`

这层适合在 `apps/app/src/http/alova.ts`、`apps/app/src/http/http.ts`、上传链路中处理，优先把差异收敛到请求基础设施。

### 第二层：业务 payload 与分页统一

目标是把 app 当前各类业务 payload 逐步统一到 admin canonical DTO：

- 分页统一到 `PageDTO<T> { list,total,pageIndex,pageSize,totalPages }`。
- 提示字段统一用 `message`。
- 错误语义统一用 `success/code/message/error`。
- 业务字段从 legacy 自定义形态逐步迁移，例如 repair 从 `{ ownerRepairs,total,page,row }` 迁到 `PageDTO`。

这层不能靠全局请求封装一次性解决，必须按业务模块改页面、类型、adapter 和测试。

## 7. 推荐迁移路线

### 阶段 1：APP 客户端先做兼容归一化层

先改请求基础设施，不直接动所有页面。

建议范围：

- `apps/app/src/http/alova.ts`
- `apps/app/src/http/http.ts`
- `apps/app/src/hooks/useRequest.ts`
- `apps/app/src/hooks/useUpload.ts`
- `apps/app/src/utils/uploadFile.ts`
- `apps/app/src/typings.d.ts`
- `apps/app/src/types/api.ts`

目标：

- 同时兼容 `msg/message`。
- 同时兼容 `code: 0` 与 `code: 200/success: true`。
- 对上层页面尽量继续返回当前最常用的业务数据形态，减少页面一次性改动。
- 补齐请求层和上传层测试，先证明两种外层包装都能被正确消费。

### 阶段 2：`apps/api` 新增 app-v2 标准输出

不建议把现有 `/app/**` 原地改成 `JsonVO`，因为这会破坏旧 app 页面、测试和运行时兼容。

建议二选一：

1. 新增 app-v2 路径或版本化入口，输出 `JsonVO`。
2. 在 endpoint manifest 增加 `responseShape: legacy|jsonvo`，允许同一模块逐步标记响应格式。

然后从已迁入的 fee/repair 开始，把 `legacy-adapter.ts` 旁边逐步补出 `jsonvo-adapter.ts` 或等价标准输出层。

### 阶段 3：按模块迁移分页与 payload

优先从已迁入 `apps/api` 的 fee/repair 开始，因为这两个模块已经有 service/repository 与双 adapter 基础。

每个模块的迁移闭环应包含：

- app API 类型。
- 页面数据读取。
- z-paging/list 完成逻辑。
- adapter 输出 DTO。
- legacy 与 jsonvo 双契约测试。
- admin `JsonVO<PageDTO<T>>` 对齐测试。

完成 fee/repair 后，再扩展到完整 27 个 app server endpoint 文件和剩余 `/app/**`、`/callComponent/**` 路径。

## 8. 风险清单

1. 直接原地改 `/app/**` 返回结构，会破坏旧 app 页面、现有测试和迁移期兼容承诺。
2. 只改 `msg -> message` 会低估工作量，因为分页字段和业务 payload 差异更大。
3. app 页面大量读取 `event.data` 内部字段，外层包装统一后仍可能因 `data.list`、`ownerRepairs`、`notices` 等字段变化而出错。
4. z-paging 页面依赖列表完成语义，分页字段改为 `PageDTO` 时必须逐页验证。
5. 上传链路不是普通请求链路，解析 JSON 后直接取 `.data`，容易在统一过程中遗漏。
6. 旧测试约 20 个文件、113 处断言响应结构，迁移时如果不先调整测试策略，会出现大面积红灯。
7. 如果 app legacy DTO 反向污染 admin schema，会破坏 `JsonVO/PageDTO` 作为后台长期标准的边界。
8. 如果没有版本化或 `responseShape` 标记，灰度迁移和回滚都会困难。

## 9. 后续任务清单

1. 为 APP 请求层设计 `normalizeResponse`，明确输入支持 legacy 与 jsonvo，输出给页面的稳定形态。
2. 补请求层单元测试：覆盖 `code: 0/msg`、`code: 200/message`、`success: true`、失败提示、空 data。
3. 补上传链路兼容测试，避免普通请求已兼容但上传仍按旧 `.data` 解析。
4. 在 `apps/api` endpoint manifest 中评估加入 `responseShape: legacy|jsonvo`，或设计 app-v2 路径。
5. 以 fee 模块为样板，新增 jsonvo 输出测试，同时保留 legacy 输出测试。
6. 以 repair 列表为样板，验证 `{ ownerRepairs,total,page,row }` 到 `PageDTO` 的页面改造成本。
7. 梳理 47 个 z-paging/列表页面，按业务模块分批迁移，不做全仓库一次性替换。
8. 梳理约 20 个 `PaginationResponse` 相关 API/类型文件，制定 `PaginationResponse -> PageDTO` 的过渡类型策略。
9. 梳理约 20 个测试文件、113 处响应结构断言，先改测试基建，再按模块改断言。
10. 在完整迁移前继续保留 `/app/**` legacy 路径，避免破坏现有 app 运行时兼容。

最终结论：未来可以统一，但不要把“外层包装统一”和“业务 payload/PageDTO 统一”混为一个任务，后者才是真正的大工程。
