<!-- 已完成 -->

# 2026-03-29 Vercel 双项目部署与 Nitro Vercel 构建计划

## 1. 文档定位与约束

- 计划文档路径固定为 `docs/plan/2026-03-29-vercel-dual-project-deployment.md`。
- 本计划对应 [`docs/prompts/migrate-plan/01.md`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/docs/prompts/migrate-plan/01.md) 中“将项目部署到 vercel 平台内”的任务。
- 本计划只处理 3 类事项：
  - 仓库内为 Vercel 双项目部署补齐构建命令、环境变量、文档与 CI 自检配置。
  - 在 Vercel 内创建并配置 2 个独立项目。
  - 把两个项目的生产分支统一固定为 `dev`。
- 本计划明确排除 1 类误解：
  - GitHub Actions 的 `ci` 构建只用于“健壮性自检”，与 Vercel 的实际部署流程没有任何直接关系；不能把 GitHub workflow 当成 Vercel 部署通道。

## 2. 目标摘要

- 为当前仓库提供 2 个彼此独立的 Vercel 生产项目：
  - H5 生产站点：`11comm-app-h5`
  - Nitro API 生产服务：`11comm-app-nitro-server`
- H5 生产构建继续使用 `pnpm build:h5:prod`，但其生产环境请求基址必须指向 `@ruan-cat/domains` 中 `11commAppNitroServer` 别名解析出的 Nitro 生产域名。
- Nitro 独立构建继续保留默认 Node 产物命令，同时新增基于 `NITRO_PRESET=vercel` 的 Vercel 专用构建命令。
- GitHub Actions 的 `pnpm run ci` 需要在原有 H5 生产构建自检基础上，新增 `build:nitro:vercel` 的构建自检。
- README 需要补全新命令与 Vercel 双项目部署方式，方便团队成员理解后续维护方式。

## 3. 核心设计决策

### 3.1. 部署模型

- 采用“2 个独立 Vercel Project”模型，不做单项目多服务混布：
  - H5 项目只负责静态产物部署。
  - Nitro 项目只负责服务端 API 部署。
- 这样可以让域名、构建命令、输出目录、观测日志和回滚粒度完全独立，最符合当前仓库“前端站点”和“独立 API 服务”分离的演进方向。

### 3.2. GitHub Actions 与 Vercel 的关系

- GitHub workflow 与 Vercel 部署严格解耦：
  - GitHub workflow 只负责“仓库代码自检构建”。
  - Vercel 生产部署只依赖各自项目对 GitHub 仓库 `dev` 分支的监听。
- 因此，本次修改 [`turbo.json`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/turbo.json) 与 [`ci.yml`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/.github/workflows/ci.yml) 的目的，不是“让 GitHub workflow 替 Vercel 部署”，而是“让 CI 尽早暴露 Nitro Vercel 产物是否可构建”。

### 3.3. Nitro 构建命令策略

- 保留现有 `build:nitro`，不破坏当前默认 Node 产物语义。
- 新增显式命令：
  - `build:nitro:node`
  - `build:nitro:vercel`
- `build:nitro:vercel` 采用参考项目 `01s-11comm/apps/admin` 的做法，通过 `NITRO_PRESET=vercel` 注入平台预设，而不是在 [`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts) 中写死 `preset`。
- Nitro 配置文件继续保持“平台无关”，由命令行环境变量决定最终产物类型。

### 3.4. 生产环境变量策略

- 生产域名信息直接提交进仓库，而不是只存放在 Vercel Dashboard：
  - [`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production)
  - Nitro 对应生产环境文件：`env/.env.production-nitro-api`
- 原因有 3 点：
  - 域名本身不是敏感信息。
  - 本地 `pnpm build:h5:prod` 与 Vercel Git 构建需要拿到一致的生产配置。
- 生产环境不再在 env 文件内写死域名，而是由运行时通过 `@ruan-cat/domains` 的 `11commAppNitroServer` 别名统一解析。
- H5 生产环境需要显式写入：
  - `VITE_API_RUNTIME=nitro-standalone`
  - `VITE_APP_PROXY_ENABLE=false`
- Nitro 生产环境文件需要显式写入：
  - `VITE_API_RUNTIME=nitro-standalone`
  - `NITRO_DATA_SOURCE=mock`

## 4. Vercel 项目映射

|      维度       |        H5 生产项目        |                    Nitro 生产项目                     |
| :-------------: | :-----------------------: | :---------------------------------------------------: |
|    项目名称     |      `11comm-app-h5`      |               `11comm-app-nitro-server`               |
|    Git 仓库     |   `ruan-cat/11comm-app`   |                 `ruan-cat/11comm-app`                 |
| Production 分支 |           `dev`           |                         `dev`                         |
|    构建命令     |   `pnpm build:h5:prod`    |               `pnpm build:nitro:vercel`               |
|    输出目录     |      `dist/build/h5`      | 使用 Nitro `vercel` preset 自动生成的 Vercel 构建输出 |
|    生产域名     | `resolve11CommH5BaseUrl()` / `11commAppH5` | `resolve11CommNitroServerBaseUrl()` / `11commAppNitroServer` |
|    部署职责     |  只部署前端 H5 静态站点   |               只部署独立 Nitro API 服务               |

## 5. 仓库内实施拆分

### 5.1. `package.json` 脚本矩阵

- 调整 [`package.json`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/package.json)：
  - 保留 `build:nitro`
  - 新增 `build:nitro:node`
  - 新增 `build:nitro:vercel`
- 命令语义约束如下：
  - `build:nitro`：继续兼容当前默认 Node 产物构建。
  - `build:nitro:node`：显式表达“构建 Node standalone Nitro 产物”。
  - `build:nitro:vercel`：显式表达“构建 Vercel 平台 Nitro 产物”，内部注入 `NITRO_PRESET=vercel`。
- 为避免环境文件歧义，Nitro 相关生产命令统一读取 `NITRO_APP_MODE=production-nitro-api`。

### 5.2. Nitro 配置与环境加载

- 调整 [`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts)：
  - 保持 `preset` 不写死。
  - 继续通过 `loadEnv(NITRO_APP_MODE, envDir, '')` 加载 Nitro 对应环境文件。
  - 不为了 Vercel 再复制一套 Nitro 配置文件。
- 新增 `env/.env.production-nitro-api`，使 Nitro 生产构建不再错误复用当前偏 H5 的 `env/.env.production`。

### 5.3. H5 生产环境变量

- 调整 [`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production)：
  - 将生产请求与上传地址都切到 Nitro 生产域名。
  - 将 `VITE_API_RUNTIME` 改为 `nitro-standalone`。
  - 关闭 proxy。
- 这一步的目标是确保 H5 在生产环境下永远不会再回到本地 mock 或代理前缀语义。

### 5.4. 环境变量同步修改清单

- 本仓库新增或调整环境变量时，禁止只改 `env/*.env` 文件后就结束；必须同步检查“声明层、读取层、测试层、文档层”。
- 本任务涉及的环境变量分为 2 类：
  - `import.meta.env` 可读取的前端变量：例如 `VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_API_RUNTIME`、`VITE_APP_PROXY_ENABLE`。
  - 仅用于 Node / Nitro / 脚本命令的进程变量：例如 `NITRO_APP_MODE`、`NITRO_PRESET`。

#### 5.4.1. 前端可见变量的必改文件

- 当新增、删除或修改 `VITE_*` / `NITRO_*`（且会经由 `import.meta.env` 使用）变量时，至少同步检查以下文件：
  - [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env)
    - 默认环境基线；如果新变量需要所有模式都有默认值，应先在这里补齐。
  - [`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production)
    - H5 生产模式专用值。
  - [`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api)
    - Nitro 独立生产模式专用值。
  - [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)
    - 这里是 `ImportMetaEnv` 的主类型声明；凡是通过 `import.meta.env.Xxx` 读取的变量，都必须在这里声明。
  - [`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts)
    - 这里有单独的 `RuntimeBaseEnv` 接口；只要变量参与运行时基址计算，就必须同步补类型与逻辑。
- 本任务里，`VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_API_RUNTIME`、`VITE_APP_PROXY_ENABLE` 都属于这类，已经存在声明，但修改时仍要同步核对其语义是否变化。

#### 5.4.2. Node / Nitro 进程变量的必改文件

- 当新增或调整只在命令行、Nitro 配置、脚本里消费的变量时，不要误以为它们都该进 [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)。
- 例如：
  - `NITRO_APP_MODE`
  - `NITRO_PRESET`
- 这类变量的同步点应为：
  - [`package.json`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/package.json)
    - 命令注入点。
  - [`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts)
    - 运行时 `loadEnv` / `process.env` 消费点。
  - [`scripts/dev-h5-nitro.mjs`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/scripts/dev-h5-nitro.mjs)
    - H5 Nitro 本地编排消费点。
  - [`scripts/dev-mp-weixin-nitro.mjs`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/scripts/dev-mp-weixin-nitro.mjs)
    - 小程序 Nitro 本地编排消费点。
- 结论：
  - `NITRO_APP_MODE` 和 `NITRO_PRESET` 默认不需要补进 `ImportMetaEnv`。
  - 只有当后续真的在前端代码里通过 `import.meta.env` 读取它们时，才应再补到 [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)。

#### 5.4.3. 读取入口的必查文件

- 环境变量一旦调整，必须同步人工检查下列读取入口，避免“类型补了，但实际仍走旧语义”：
  - [`vite.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/vite.config.ts)
    - H5 / uni 构建时通过 `loadEnv(mode, envDir)` 读取前端变量。
  - [`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts)
    - Nitro 独立运行时通过 `loadEnv(NITRO_APP_MODE, envDir, '')` 读取变量。
  - [`manifest.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/manifest.config.ts)
    - 如果新变量影响 H5 public base、标题或 manifest 行为，需同步检查。
  - [`src/http/alova.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/alova.ts)
    - `API_DOMAINS.DEFAULT` 和 `baseURL` 会直接受运行时基址变量影响。
  - [`src/http/interceptor.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/interceptor.ts)
    - `prependRuntimeBaseUrl` 会把相对路径补成最终请求地址。
  - [`src/hooks/useUpload.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/hooks/useUpload.ts)
    - 上传地址依赖 `resolveUploadBaseUrl(import.meta.env)`。
  - [`src/utils/index.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/utils/index.ts)
    - 这里仍有一组微信小程序环境的兜底地址常量；如果未来生产域名策略变化，应同步核对是否需要改成新域名或保持不动。

#### 5.4.4. 测试与验证的必改文件

- 只要环境变量语义变化影响“请求基址 / 上传基址 / 运行时分流”，至少同步检查：
  - [`src/tests/nitro-runtime/runtime-base-url.test.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/tests/nitro-runtime/runtime-base-url.test.ts)
    - 这里直接断言 `mock`、`nitro-vite`、`nitro-standalone` 三种模式的 URL 计算行为。
- 若新增了新的生产模式名或新的基址拼接规则，应补对应测试用例，而不是只靠人工口头确认。

#### 5.4.5. 文档同步清单

- 环境变量与命令一旦变化，至少同步更新：
  - [`README.md`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/README.md)
    - 面向团队成员的主入口说明。
  - 当前计划文档 [`docs/plan/2026-03-29-vercel-dual-project-deployment.md`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/docs/plan/2026-03-29-vercel-dual-project-deployment.md)
    - 面向本轮任务实施的约束说明。
- 如本轮实施结果与旧计划文档 [`docs/plan/2026-03-28-add-nitro-api-runtime.md`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/docs/plan/2026-03-28-add-nitro-api-runtime.md) 有明显偏差，应补一段“生产部署新增命令与环境文件”的交叉引用说明，避免后续有人误以为 `build:nitro` 已经天然等价于 Vercel 产物。

#### 5.4.6. 本次任务的变量落地矩阵

- 本轮实施应优先复用当前仓库已经存在的变量名，避免为了“显式区分 H5 域名 / Nitro 域名”而额外发明一组新的 `VITE_*` 变量。
- 原因很直接：
  - 当前运行时链路已经围绕 `VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_API_RUNTIME`、`VITE_APP_PROXY_ENABLE` 建好。
  - 这次真正新增的不是“前端变量名体系”，而是 “Nitro 独立生产环境文件 `env/.env.production-nitro-api`” 与 “Nitro Vercel 构建命令 `build:nitro:vercel`”。
  - 只要不新发明变量名，就能减少 `ImportMetaEnv`、`RuntimeBaseEnv`、测试断言和文档四处一起改的风险。
- 因此，本次任务建议按下表执行：

|         变量名          |                      变量类别                       |                                                                                                                                                需要落盘的环境文件                                                                                                                                                |                                                                                          需要补类型声明的文件                                                                                           |                                                                                                                                                                                                                                              需要同步检查的读取文件                                                                                                                                                                                                                                              |                  本次任务结论                   |
| :---------------------: | :-------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------: |
|  `VITE_SERVER_BASEURL`  |       前端运行时变量，`import.meta.env` 可见        | [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env) 、[`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production) 、[`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api) | [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) | [`vite.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/vite.config.ts) 、[`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts) 、[`src/http/alova.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/alova.ts) 、[`src/http/interceptor.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/interceptor.ts) 、[`src/utils/index.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/utils/index.ts) |       复用现有变量名，只改值，不新增命名        |
|  `VITE_UPLOAD_BASEURL`  |       前端运行时变量，`import.meta.env` 可见        | [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env) 、[`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production) 、[`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api) | [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) |                                                                                         [`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) 、[`src/hooks/useUpload.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/hooks/useUpload.ts) 、[`src/utils/index.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/utils/index.ts)                                                                                         |       复用现有变量名，只改值，不新增命名        |
|   `VITE_API_RUNTIME`    |       前端运行时变量，`import.meta.env` 可见        | [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env) 、[`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production) 、[`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api) | [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) |                   [`vite.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/vite.config.ts) 、[`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) 、[`src/tests/nitro-runtime/runtime-base-url.test.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/tests/nitro-runtime/runtime-base-url.test.ts)                    |       复用现有变量名，只改值，不新增命名        |
| `VITE_APP_PROXY_ENABLE` |       前端运行时变量，`import.meta.env` 可见        |                                                              [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env) 、[`env/.env.production`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production)                                                               | [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) |                                                                   [`vite.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/vite.config.ts) 、[`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) 、[`src/tests/nitro-runtime/runtime-base-url.test.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/tests/nitro-runtime/runtime-base-url.test.ts)                                                                   | H5 生产改为 `false`，Nitro 生产文件可不重复声明 |
|   `NITRO_DATA_SOURCE`   | Nitro 运行时变量，但当前也声明在 `ImportMetaEnv` 中 |                                                    [`env/.env`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env) 、[`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api)                                                     |                                                         [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)                                                          |                                                                                                                                                                                                           [`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts)                                                                                                                                                                                                           |               本次继续保持 `mock`               |
|    `NITRO_APP_MODE`     |              仅命令行 / Nitro 进程变量              |                                                                                                                                    不进 `env/*.env` 文件，直接由脚本命令注入                                                                                                                                     |                                                       不补 [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)                                                       |                                      [`package.json`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/package.json) 、[`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts) 、[`scripts/dev-h5-nitro.mjs`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/scripts/dev-h5-nitro.mjs) 、[`scripts/dev-mp-weixin-nitro.mjs`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/scripts/dev-mp-weixin-nitro.mjs)                                       |   本次生产命令统一改为 `production-nitro-api`   |
|     `NITRO_PRESET`      |              仅命令行 / Nitro 进程变量              |                                                                                                                                    不进 `env/*.env` 文件，直接由脚本命令注入                                                                                                                                     |                                                       不补 [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts)                                                       |                                                                                                                                                              [`package.json`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/package.json) 、[`nitro.config.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/nitro.config.ts)                                                                                                                                                               |      仅 `build:nitro:vercel` 注入 `vercel`      |

- 结合当前仓库现状，可以再明确 2 个实施结论：
  - [`src/env.d.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/env.d.ts) 已经声明了 `VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_API_RUNTIME`、`VITE_APP_PROXY_ENABLE`、`NITRO_DATA_SOURCE`，所以本轮大概率不需要新增前端变量类型，只需要核对现有联合类型和注释是否仍成立。
  - 当前仓库还不存在 [`env/.env.production-nitro-api`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/env/.env.production-nitro-api)，这是本轮环境配置里唯一必须新增的环境文件。

- 只有在出现下列情况时，才真的需要新增类型声明：
  - 新发明了一个前端会通过 `import.meta.env` 读取的变量名，例如 `VITE_NITRO_PROD_DOMAIN`。
  - 新变量参与了 [`src/http/runtime-base.ts`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/src/http/runtime-base.ts) 的 URL 解析逻辑。
  - 新变量需要被测试代码显式构造和断言。

### 5.5. Turbo 与 GitHub Actions

- 在 monorepo 迁入后，调整 `apps/app/turbo.json` 为继承根配置的 package-level Turbo 配置：
  - 使用 `"extends": ["//"]`，避免 `apps/app` 形成第二个 Turbo root。
  - 为 `build:nitro:vercel` 声明缓存与输出。
  - 让 `build:nitro:vercel` 依赖 `build:h5:prod`，使 CI 串行执行 H5 生产构建后再执行 Nitro Vercel 构建。
  - 继续保持 `docs:build` 独立，不重新并回默认 CI。
- 调整 [`ci.yml`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/.github/workflows/ci.yml)：
  - 只更新注释与任务描述，使其准确反映“CI 现在校验 H5 + Nitro Vercel 构建”。
  - 不引入任何 Vercel deploy 命令。

### 5.6. README 补充

- 调整 [`README.md`](D:/code/github-desktop-store/001-Smart-Community__nwt-q/README.md)：
  - 在命令清单中新增 `build:nitro:node` 与 `build:nitro:vercel`。
  - 在发布说明中明确：
    - `build:nitro` / `build:nitro:node` 用于默认 Node standalone 产物。
    - `build:nitro:vercel` 用于 Vercel 平台产物。
  - 增加 Vercel 双项目部署说明，并标记两个项目只追踪 `dev` 分支。

## 6. Vercel 平台实施清单

### 6.1. H5 项目

- 在 team `ruancat-projects` 下创建项目 `11comm-app-h5`。
- 绑定 GitHub 仓库 `ruan-cat/11comm-app`。
- 把 Production Branch 改为 `dev`，不接受 `main`。
- 构建设置：
  - Install Command：`pnpm install`
  - Build Command：`pnpm build:h5:prod`
  - Output Directory：`dist/build/h5`
- 绑定 `@ruan-cat/domains` 中 `11commAppH5` 别名对应的生产域名。

### 6.2. Nitro 项目

- 在 team `ruancat-projects` 下创建项目 `11comm-app-nitro-server`。
- 绑定 GitHub 仓库 `ruan-cat/11comm-app`。
- 把 Production Branch 改为 `dev`，不接受 `main`。
- 构建设置：
  - Install Command：`pnpm install`
  - Build Command：`pnpm build:nitro:vercel`
  - Output Directory：保持 Vercel / Nitro 默认自动识别，不额外手填静态目录
- 绑定 `@ruan-cat/domains` 中 `11commAppNitroServer` 别名对应的生产域名。

### 6.3. 平台行为依据

- 根据 Nitro 官方 `Vercel` 部署文档，`Preset: vercel` 支持 zero-config Git 部署。
- 根据 Vercel 官方文档，静态站点可以通过 `outputDirectory` / 项目设置显式指定输出目录。
- 因此：
  - H5 项目显式配置 `dist/build/h5`。
  - Nitro 项目依赖 Nitro `vercel` preset 生成的 Vercel 构建输出，不强行把它当静态目录项目处理。

## 7. 验证与验收

### 7.1. 本地验证

- `pnpm build:h5:prod`
- `pnpm build:nitro`
- `pnpm build:nitro:node`
- `pnpm build:nitro:vercel`

### 7.2. CI 验证

- `pnpm run ci` 需要同时覆盖：
  - H5 生产构建
  - Nitro Vercel 构建
- CI 成功仅表示“仓库构建健壮性通过”，不表示“Vercel 生产部署已完成”。

### 7.3. 平台验收

- `11comm-app-h5` 可以在 Vercel 内看到成功的 `dev` 生产部署记录。
- `11comm-app-nitro-server` 可以在 Vercel 内看到成功的 `dev` 生产部署记录。
- 两个项目的 Production Branch 都显示为 `dev`。
- 两个域名都已在 Vercel 项目内完成绑定。
- 不额外做 Cloudflare/CDN 通畅性校验，交由人工后置处理。

## 8. 默认假设

- 当前 Vercel team 固定为 `ruancat-projects`。
- 当前仓库远端生产部署只接受 `dev` 分支，不受理 `main` 分支。
- 当前仓库不需要把 GitHub Actions 改造成部署流水线。
- 当前 Nitro API 仍然基于 `mock` 数据源，不在本次任务中接入 Neon / Drizzle 真库。

## 9. 首轮执行顺序

1. 先完成 `package.json`、`nitro.config.ts`、环境文件的仓库内改造。
2. 再完成 `turbo.json`、`ci.yml` 的 CI 自检补充。
3. 再完成 `README.md` 文档补充。
4. 本地执行 `build:h5:prod`、`build:nitro:vercel` 等关键构建验证。
5. 最后在 Vercel 内创建 2 个独立项目、绑定仓库与 `dev` 分支，并配置自定义域名。
