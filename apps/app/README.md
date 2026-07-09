<p align="center">
  <a href="https://github.com/unibest-tech/unibest">
    <img width="160" src="./src/static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/unibest-tech/unibest" target="_blank">unibest - 最好的 uniapp 开发框架</a>
</h1>

<div align="center">
旧仓库 codercup 进不去了，star 也拿不回来，这里也展示一下那个地址的 star.

[![GitHub Repo stars](https://img.shields.io/github/stars/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)
[![GitHub forks](https://img.shields.io/github/forks/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)

</div>

<div align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![GitHub forks](https://img.shields.io/github/forks/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![star](https://gitee.com/feige996/unibest/badge/star.svg?theme=dark)](https://gitee.com/feige996/unibest/stargazers)
[![fork](https://gitee.com/feige996/unibest/badge/fork.svg?theme=dark)](https://gitee.com/feige996/unibest/members)
![node version](https://img.shields.io/badge/node-%3E%3D22-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D10-green)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/feige996/unibest)
![GitHub License](https://img.shields.io/github/license/feige996/unibest)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ruan-cat/11comm-app)

</div>

`unibest` —— 最好的 `uniapp` 开发模板，由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` + `wot-ui` + `z-paging` 构成，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式运行 `web`、`小程序` 和 `App`（编辑器推荐 `VSCode`，可选 `webstorm`）。

`unibest` 内置了 `约定式路由`、`layout布局`、`请求封装`、`请求拦截`、`登录拦截`、`UnoCSS`、`i18n多语言` 等基础功能，提供了 `代码提示`、`自动格式化`、`统一配置`、`代码片段` 等辅助功能，让你编写 `uniapp` 拥有 `best` 体验 （ `unibest 的由来`）。

![](https://raw.githubusercontent.com/andreasbm/readme/master/screenshots/lines/rainbow.png)

<p align="center">
  <a href="https://unibest.tech/" target="_blank">📖 文档地址(new)</a>
  <span style="margin:0 10px;">|</span>
  <a href="https://feige996.github.io/hello-unibest/" target="_blank">📱 DEMO 地址</a>
</p>

---

注意旧的地址 [codercup](https://github.com/codercup/unibest) 我进不去了，使用新的 [feige996](https://github.com/feige996/unibest)。PR 和 issue 也请使用新地址，否则无法合并。

## 1. 当前仓库补充说明

### 1.0. 部署链接

| 环境            | 地址                                                               | 说明                   |
| :-------------- | :----------------------------------------------------------------- | :--------------------- |
| **Vercel 项目** | [11comm-app-h5](https://vercel.com/ruancat-projects/11comm-app-h5) | App H5 Vercel 部署管理 |
| **生产地址**    | [01s-11-app.ruan-cat.com](https://01s-11-app.ruan-cat.com)         | App H5 生产域名        |
| **API 服务**    | [01s-11-server.ruan-cat.com](https://01s-11-server.ruan-cat.com)   | 独立 Nitro API 服务    |

### 1.1. vercel 云项目的部署配置

- Framework Preset： other
- Build Command： `pnpm run build:vercel:app`
- Output Directory： .`vercel/output`
- Install Command： `ls -A && pnpm install`

### 1.1. 当前仓库定位

当前仓库并不是保持在 `unibest` 模板原始状态，而是在其基础上演进出来的智慧社区物业管理系统。

> **⚠️ 重要变更通知（Phase7）**
>
> `apps/app` **已不再是 Nitro 服务端项目**。从 Phase7 起：
>
> - App 前端构建产物为**纯 SPA**，部署到 Vercel 静态托管。
> - 所有业务 API 已迁移至独立的 `apps/api` Nitro 服务（`https://01s-11-server.ruan-cat.com`）。
> - `apps/app/server/**` 目录已物理删除（commit `c7112831`）。
>
> 以下 Nitro 相关内容保留为历史上下文，所有新接口开发应在 `apps/api` 中进行。
>
> 详见：[OpenSpec 变更 `migrate-superpowers-docs-to-openspec-longtask`](../../openspec/changes/migrate-superpowers-docs-to-openspec-longtask/)

### 1.2. Nitro 双运行时改造背景

注：`apps/app` 内置的 Nitro 双运行时方案已退役，统一后端由 `apps/api` 承接。以下背景保留为历史上下文。

这轮改造的核心目标不是“删除旧 mock，直接重写成正式后端”，而是先保证三件事同时成立：

- H5 默认开发继续保留 `vite-plugin-mock-dev-server`，不牺牲现有开发效率。
- H5 和微信小程序都能切换到 `Nitro` 真实接口运行时做联调。
- 前端现有接口路径契约保持稳定，继续兼容 `/app/**`、`/callComponent/**` 等旧业务路径。

当前仓库的 Nitro 改造采用的是“共享核心 + 双适配器”设计：

- `vite.config.ts` 中按 `VITE_API_RUNTIME` 动态装载 `mockDevServerPlugin` 或 `nitro()`。
- `nitro.config.ts` 中负责独立 Nitro 服务的配置、端口、CORS 和旧业务路径挂载。
- `server/handlers/legacy-dispatch.ts` 统一承接 `/app/**` 与 `/callComponent/**`，避免首轮就为每个旧接口平铺一堆文件路由。
- `server/shared/runtime/*` 提供共享 endpoint registry、legacy mock adapter、memory repository 和 Nitro request context 转换层。
- `repair`、`work-order` 是最早完成验证的试点模块；当前实际共享化范围请以 `server/modules/*` 目录为准，现已不止这两个模块。

### 1.3. 当前三套接口运行时

|       运行时       |                                   典型命令                                    |                            用途说明                            |
| :----------------: | :---------------------------------------------------------------------------: | :------------------------------------------------------------: |
|       `mock`       |                          `pnpm dev` / `pnpm dev:h5`                           |                 H5 默认开发，继续走 Vite mock                  |
|    `nitro-vite`    |                      逻辑上对应 `development-nitro` 模式                      | 设计目标是 H5 全栈同进程联调；当前受 `Vite 6` 限制尚未真正落地 |
| `nitro-standalone` | `pnpm dev:nitro` / `pnpm dev:h5:nitro` / `pnpm dev:mp-weixin:nitro`（已退役） |         统一后端入口已迁移至 `apps/api`（历史上下文）          |

### 1.4. 当前仓库新增的 Nitro 相关命令

|          场景           |            命令            |                               说明                                |               当前状态                |
| :---------------------: | :------------------------: | :---------------------------------------------------------------: | :-----------------------------------: |
|    H5 mock 默认开发     |       `pnpm dev:h5`        |                   当前等价于 `pnpm dev:h5:mock`                   |                 可用                  |
|    H5 mock 明确入口     |     `pnpm dev:h5:mock`     |                  只启动 H5 + Vite mock 开发链路                   |                 可用                  |
|    H5 Nitro 联调入口    |    `pnpm dev:h5:nitro`     | 当前在 `Vite 6` 下会自动回退为 “standalone Nitro + H5” 双进程联调 | 已退役，统一后端入口迁移至 `apps/api` |
|   独立 Nitro API 开发   |      `pnpm dev:nitro`      |              只启动 Nitro API 服务，默认端口 `3101`               | 已退役，统一后端入口迁移至 `apps/api` |
| 微信小程序 + Nitro 联调 | `pnpm dev:mp-weixin:nitro` |         先确保 Nitro health ready，再启动微信小程序编译链         | 已退役，统一后端入口迁移至 `apps/api` |
|  默认 Nitro Node 构建   |     `pnpm build:nitro`     |           默认别名，当前等价于 `pnpm build:nitro:node`            | 已退役，统一后端入口迁移至 `apps/api` |
|  显式 Nitro Node 构建   |  `pnpm build:nitro:node`   |                 构建独立部署用的 Nitro Node 服务                  | 已退役，统一后端入口迁移至 `apps/api` |
|  Vercel Nitro 产物构建  | `pnpm build:nitro:vercel`  |            构建用于 `Vercel` 平台部署的 Nitro 生产产物            | 已退役，统一后端入口迁移至 `apps/api` |
|   独立 Nitro 本地预览   |    `pnpm preview:nitro`    |     直接运行 `.output/server/index.mjs`，不走 `nitro preview`     | 已退役，统一后端入口迁移至 `apps/api` |

### 1.5. Nitro 接口的当前使用情况

当前仓库接入 Nitro 后，前端业务接口并没有统一迁移成 `/api/**` 风格，而是继续沿用旧业务路径：

```text
/app/**
/callComponent/**
/__nitro/health
```

当前请求基址策略已经由 `src/http/runtime-base.ts` 统一收口：

- `mock` 模式优先走 Vite proxy 前缀。
- `nitro-vite` 模式下前端同源直打业务路径。
- `nitro-standalone` 模式下前端直接访问 `VITE_SERVER_BASEURL`，默认是 `http://127.0.0.1:3101`。

独立 Nitro 服务的健康检查地址固定为：

```text
http://127.0.0.1:3101/__nitro/health
```

这个地址既用于 `dev:h5:nitro`、`dev:mp-weixin:nitro` 的 readiness 探测，也用于 `dev:nitro`、`preview:nitro` 的烟测验证（这些命令均已退役，统一后端入口已迁移至 `apps/api`）。

### 1.6. 当前已知限制

- 当前仓库仍停留在 `Vite 6`，因此 `pnpm dev:h5:nitro` 现阶段并不是真正的 `nitro/vite` 同进程全栈模式，而是自动回退为 “standalone Nitro + H5” 双进程联调（该命令已退役）。
- `NITRO_DATA_SOURCE=neon` 目前仍然只是预留边界，尚未真正接通 `Neon + Drizzle`。
- `pnpm preview:nitro` 当前直接运行 `.output/server/index.mjs`，这是为了规避当前 Nitro beta 组合下 `nitro preview` 的稳定性问题（该命令已退役）。
- 为了保证引入 Nitro 后 H5 mock 链路仍然可用，仓库额外保留了 `patches/vite-plugin-mock-dev-server@2.1.1.patch` 这个兼容补丁。

### 1.7. Vercel 双项目生产部署约定

|        Vercel 项目        |            生产构建命令             |                           生产域名                           | Production Branch |
| :-----------------------: | :---------------------------------: | :----------------------------------------------------------: | :---------------: |
|      `11comm-app-h5`      |        `pnpm build:h5:prod`         |          `resolve11CommH5BaseUrl()` / `11commAppH5`          |       `dev`       |
| `11comm-app-nitro-server` | `pnpm build:nitro:vercel`（已退役） | `resolve11CommNitroServerBaseUrl()` / `11commAppNitroServer` |       `dev`       |

- H5 生产环境固定直连 `@ruan-cat/domains` 中 `11commAppNitroServer` 别名解析出的 Nitro 生产域名，不再依赖本地 proxy。
- GitHub Actions 里的 `pnpm run ci` 只做构建健壮性自检，不承担任何 Vercel 部署职责。

## 1B. Phase7 部署架构

> **Phase7 架构**：App H5 为纯前端 SPA，部署到 Vercel 静态托管。所有 API 请求直接发往 `https://01s-11-server.ruan-cat.com`。

```plain
apps/app (SPA)                              apps/api (Nitro Serverless)
┌─────────────────────────┐               ┌──────────────────────────────┐
│ https://01s-11-app     │ ─── API ───▶  │ https://01s-11-server       │
│ .ruan-cat.com           │               │ .ruan-cat.com               │
│ (Vercel Static)        │               │ (Vercel Serverless Functions)│
└─────────────────────────┘               └──────────────────────────────┘
```

### 生产环境变量（关键配置）

| 变量名                          | 值                                   | 说明                           |
| :------------------------------ | :----------------------------------- | :----------------------------- |
| `VITE_SERVER_BASEURL`           | `https://01s-11-server.ruan-cat.com` | 独立 Nitro API 服务地址        |
| `VITE_API_RUNTIME`              | `nitro-standalone`                   | 运行时模式                     |
| `VITE_APP_PROXY_ENABLE`         | `false`                              | 不走 Vite 开发代理             |
| `VITE_11COMM_API_BASE_URL`      | `https://01s-11-server.ruan-cat.com` | Phase6+ API 兼容地址           |
| `VITE_11COMM_API_SHADOW_ENABLE` | `true`                               | 启用 shadow 流量镜像（调试用） |

> **不兼容旧架构**：`apps/app/server/**` 内置 Nitro 服务已物理删除，`.env.production` 中不再配置 `VITE_SERVER_BASEURL` 指向自身 server。

### 构建命令

```bash
# H5 生产构建
pnpm build:h5:prod
```

### `build:h5:prod` 的 Windows 路径兼容决策

`build:h5:prod` 有意不直接使用 `uni build --mode production`。在 Windows + 较新 Node ESM loader 下，uni-app/Vite 构建链会动态导入 `D:\...` 这类 Windows 绝对路径，Node 会把盘符识别成不支持的 URL scheme，并报类似错误：

```log
Only URLs with a scheme in: file, data, and node are supported by the default ESM loader.
On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
```

因此该命令通过 `node --import ./scripts/register-window-path-loader.js` 启动 `node_modules/@dcloudio/vite-plugin-uni/bin/uni.js build --mode production`。注册脚本只在 Windows 下用 `node:module.register()` 注册 `window-path-loader.js`，把 Windows 绝对路径转换成 `file://` URL；在 Linux/Vercel CI 中不注册 loader，保持 Node 默认 ESM 解析，避免影响线上构建链路。

不要把 `build:h5:prod` 简单改回裸 `uni build --mode production`，也不建议改成 `--experimental-loader`。前者会重新触发 Windows 构建失败，后者会产生 Node experimental warning，且历史上曾和 Vercel 输出目录问题混淆。

如果后续修改这条构建链路，至少同时验证：

```bash
pnpm -F @01s-11comm/app build:h5:prod
pnpm -F @01s-11comm/app build:vercel
```

> **Phase7 不再使用**：`build:nitro`、`build:nitro:node`、`build:nitro:vercel` 均已退役，统一后端入口已迁移至 `apps/api`。

## 2. 平台兼容性

| H5  | IOS | 安卓 | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
| :-: | :-: | :--: | :--------: | :--------: | :--------: | :----------: | :--------: | :--------: |
|  √  |  √  |  √   |     √      |     √      |     √      |      √       |     √      |     √      |

注意每种 `UI框架` 支持的平台有所不同，详情请看各 `UI框架` 的官网，也可以看 `unibest` 文档。

## 3. 环境

- node>=22
- pnpm>=10
- Vue Official>=2.1.10
- TypeScript>=5.0

**依赖升级约束（重要）**

- 截止 `2026-03-24`，即使执行 `pnpm dlx @dcloudio/uvm@latest --manager pnpm`，uni-app 主插件链也只会升级到较新的 `@dcloudio/* 5.04` 版本线，不会把 `vite` 一并提升到 `6/7/8`。
- 当前主链的关键约束是：`@dcloudio/vite-plugin-uni` 仍然声明 `peerDependencies.vite = "5.2.8"`，并且依赖 `@vitejs/plugin-vue 5.2.4`；`@uni-helper/vite-plugin-uni-pages` 也仍然只支持 `vite ^5`。
- 这意味着主仓库内不允许直接把 `vite` 升到 `6/7/8` 再假定 H5 可构建。这样做会让 `vitest@4`、`vite` 和 uni-app 主插件链之间出现硬性不兼容。
- 如果必须验证 `vite@8`，请在项目内的 `.worktrees/` 隔离目录里做实验分支，并分别验证 `pnpm build:h5` 与本地 preview；不要在主开发工作区直接覆盖主插件链。

## 4. 快速开始

### 4.1. 当前仓库直接启动

- 执行 `pnpm install` 安装依赖
- 执行 `pnpm dev` 运行 `H5 mock`
- 执行 `pnpm dev:h5:nitro` 运行 `H5 + Nitro` 联调（该命令已退役，统一后端入口已迁移至 `apps/api`）
- 执行 `pnpm dev:mp-weixin:nitro` 运行 `微信小程序 + Nitro` 联调（该命令已退役，统一后端入口已迁移至 `apps/api`）

### 4.2. unibest 模板原始快速开始

- 执行 `pnpm create unibest` 创建项目
- 执行 `pnpm i` 安装依赖
- 执行 `pnpm dev` 运行 `H5`
- 执行 `pnpm dev:mp` 运行 `微信小程序`

## 5. 运行（支持热更新）

- web 平台： `pnpm dev:h5`，然后打开 [http://localhost:3000/](http://localhost:3000/)。
- web 平台（Nitro 联调）：`pnpm dev:h5:nitro`（已退役），当前会先确保 `http://127.0.0.1:3101/__nitro/health` 可用，再进入 H5 联调链路；在 `Vite 6` 下它会自动回退为 “独立 Nitro + H5” 双进程联调。
- 独立 Nitro API 服务：`pnpm dev:nitro`（已退役，统一后端入口已迁移至 `apps/api`），只启动接口服务，默认监听 `3101` 端口，适合单独烟测和未来独立部署验证。
- weixin 平台：`pnpm dev:mp` 然后打开微信开发者工具，导入本地文件夹，选择本项目的 `dist/dev/mp-weixin` 文件。
- weixin 平台（Nitro 联调）：`pnpm dev:mp-weixin:nitro`（已退役），脚本会先检查或拉起 Nitro，再进入微信小程序编译链。
- APP 平台：`pnpm dev:app`，然后打开 `HBuilderX`，导入刚刚生成的 `dist/dev/app` 文件夹，选择运行到模拟器（开发时优先使用），或者运行的安卓/ios 基座。（如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个 unibest 项目导入到 hbx，通过 hbx 的菜单来运行到对应的平台。)

## 6. 发布

- web 平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到 web 服务器，如 nginx 运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin 平台：`pnpm build:mp`，打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP 平台：`pnpm build:app`，然后打开 `HBuilderX`，导入刚刚生成的 `dist/build/app` 文件夹，选择发行 - APP 云打包。（如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个 unibest 项目导入到 hbx，通过 hbx 的菜单来发行到对应的平台。)
- 独立 Nitro Node 服务构建：`pnpm build:nitro` 或 `pnpm build:nitro:node`（均已退役，统一后端入口已迁移至 `apps/api`），构建完成后产物位于 `.output/` 目录。
- Vercel Nitro 服务构建：`pnpm build:nitro:vercel`（已退役，统一后端入口已迁移至 `apps/api`），构建完成后使用 Nitro `vercel` preset 生成 Vercel 所需产物。
- 独立 Nitro 服务预览：`pnpm preview:nitro`（已退役，统一后端入口已迁移至 `apps/api`），当前通过直接运行 `.output/server/index.mjs` 进行本地预览；它面向 Node 产物，不对应 Vercel 产物预览。

## 7. License

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 菲鸽

## 8. 捐赠

<p align='center'>
<img alt="special sponsor appwrite" src="https://oss.laf.run/ukw0y1-site/pay/wepay.png" height="330" style="display:inline-block; height:330px;">
<img alt="special sponsor appwrite" src="https://oss.laf.run/ukw0y1-site/pay/alipay.jpg" height="330" style="display:inline-block; height:330px; margin-left:10px;">
</p>

## 9. 我们在做什么？

我们做的是物业系统的 app。对于物业的员工来说，他们使用这款 app 响应处理业主的反馈与投诉。比如：

当前仓库正在做的一项重要基础设施改造，是把原本只适用于 H5 的 mock 接口体系，升级为“H5 mock + Nitro 真实接口联调 + 小程序可访问本地接口服务”并存的方案。

## 10. 参考资料

- gitee 仓库： https://gitee.com/java110/PropertyApp
- 可访问 demo 地址： http://property.homecommunity.cn
- 参考系统的文档： http://www.homecommunity.cn/pages/demo/demo_cn.html
- Nitro 改造提示文档： `docs/prompts/use-nitro/index.md`
- Nitro 改造实施计划： `docs/plan/2026-03-28-add-nitro-api-runtime.md`
- Vercel 双项目部署计划： `docs/plan/2026-03-29-vercel-dual-project-deployment.md`

### 10.1. 参考 app 的账号与密码

- 物业员工账号： wuxw
- 物业员工密码： admin

## 11. 上手学习 `unibest` 的资料

- wot-design-uni 组件库： https://wot-ui.cn/guide/quick-use.html
- unibest 框架文档：https://unibest.tech/base/2-start
- Nitro v3 文档：https://v3.nitro.build/
