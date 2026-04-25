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

### 1.1. 当前仓库定位

当前仓库并不是保持在 `unibest` 模板原始状态，而是在其基础上演进出来的智慧社区物业管理系统。

这意味着下面 README 中原本的模板信息仍然保留，便于理解上游能力；与此同时，本仓库还额外引入了面向真实接口联调的 `Nitro v3` 双运行时方案，因此你在使用本仓库时，应优先参考本节补充说明和后续新增命令说明。

### 1.2. Nitro 双运行时改造背景

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

|       运行时       |                              典型命令                               |                                 用途说明                                  |
| :----------------: | :-----------------------------------------------------------------: | :-----------------------------------------------------------------------: |
|       `mock`       |                     `pnpm dev` / `pnpm dev:h5`                      |                       H5 默认开发，继续走 Vite mock                       |
|    `nitro-vite`    |                 逻辑上对应 `development-nitro` 模式                 |      设计目标是 H5 全栈同进程联调；当前受 `Vite 6` 限制尚未真正落地       |
| `nitro-standalone` | `pnpm dev:nitro` / `pnpm dev:h5:nitro` / `pnpm dev:mp-weixin:nitro` | 当前稳定的独立 Nitro API 运行时，供 H5 fallback、小程序联调和未来独立部署 |

### 1.4. 当前仓库新增的 Nitro 相关命令

|          场景           |            命令            |                               说明                                |
| :---------------------: | :------------------------: | :---------------------------------------------------------------: |
|    H5 mock 默认开发     |       `pnpm dev:h5`        |                   当前等价于 `pnpm dev:h5:mock`                   |
|    H5 mock 明确入口     |     `pnpm dev:h5:mock`     |                  只启动 H5 + Vite mock 开发链路                   |
|    H5 Nitro 联调入口    |    `pnpm dev:h5:nitro`     | 当前在 `Vite 6` 下会自动回退为 “standalone Nitro + H5” 双进程联调 |
|   独立 Nitro API 开发   |      `pnpm dev:nitro`      |              只启动 Nitro API 服务，默认端口 `3101`               |
| 微信小程序 + Nitro 联调 | `pnpm dev:mp-weixin:nitro` |         先确保 Nitro health ready，再启动微信小程序编译链         |
|  默认 Nitro Node 构建   |     `pnpm build:nitro`     |           默认别名，当前等价于 `pnpm build:nitro:node`            |
|  显式 Nitro Node 构建   |  `pnpm build:nitro:node`   |                 构建独立部署用的 Nitro Node 服务                  |
|  Vercel Nitro 产物构建  | `pnpm build:nitro:vercel`  |            构建用于 `Vercel` 平台部署的 Nitro 生产产物            |
|   独立 Nitro 本地预览   |    `pnpm preview:nitro`    |     直接运行 `.output/server/index.mjs`，不走 `nitro preview`     |

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

这个地址既用于 `dev:h5:nitro`、`dev:mp-weixin:nitro` 的 readiness 探测，也用于 `dev:nitro`、`preview:nitro` 的烟测验证。

### 1.6. 当前已知限制

- 当前仓库仍停留在 `Vite 6`，因此 `pnpm dev:h5:nitro` 现阶段并不是真正的 `nitro/vite` 同进程全栈模式，而是自动回退为 “standalone Nitro + H5” 双进程联调。
- `NITRO_DATA_SOURCE=neon` 目前仍然只是预留边界，尚未真正接通 `Neon + Drizzle`。
- `pnpm preview:nitro` 当前直接运行 `.output/server/index.mjs`，这是为了规避当前 Nitro beta 组合下 `nitro preview` 的稳定性问题。
- 为了保证引入 Nitro 后 H5 mock 链路仍然可用，仓库额外保留了 `patches/vite-plugin-mock-dev-server@2.1.1.patch` 这个兼容补丁。

### 1.7. Vercel 双项目生产部署约定

|        Vercel 项目        |       生产构建命令        |                           生产域名                           | Production Branch |
| :-----------------------: | :-----------------------: | :----------------------------------------------------------: | :---------------: |
|      `11comm-app-h5`      |   `pnpm build:h5:prod`    |          `resolve11CommH5BaseUrl()` / `11commAppH5`          |       `dev`       |
| `11comm-app-nitro-server` | `pnpm build:nitro:vercel` | `resolve11CommNitroServerBaseUrl()` / `11commAppNitroServer` |       `dev`       |

- H5 生产环境固定直连 `@ruan-cat/domains` 中 `11commAppNitroServer` 别名解析出的 Nitro 生产域名，不再依赖本地 proxy。
- GitHub Actions 里的 `pnpm run ci` 只做构建健壮性自检，不承担任何 Vercel 部署职责。

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
- 执行 `pnpm dev:h5:nitro` 运行 `H5 + Nitro` 联调
- 执行 `pnpm dev:mp-weixin:nitro` 运行 `微信小程序 + Nitro` 联调

### 4.2. unibest 模板原始快速开始

- 执行 `pnpm create unibest` 创建项目
- 执行 `pnpm i` 安装依赖
- 执行 `pnpm dev` 运行 `H5`
- 执行 `pnpm dev:mp` 运行 `微信小程序`

## 5. 运行（支持热更新）

- web 平台： `pnpm dev:h5`，然后打开 [http://localhost:3000/](http://localhost:3000/)。
- web 平台（Nitro 联调）：`pnpm dev:h5:nitro`，当前会先确保 `http://127.0.0.1:3101/__nitro/health` 可用，再进入 H5 联调链路；在 `Vite 6` 下它会自动回退为 “独立 Nitro + H5” 双进程联调。
- 独立 Nitro API 服务：`pnpm dev:nitro`，只启动接口服务，默认监听 `3101` 端口，适合单独烟测和未来独立部署验证。
- weixin 平台：`pnpm dev:mp` 然后打开微信开发者工具，导入本地文件夹，选择本项目的 `dist/dev/mp-weixin` 文件。
- weixin 平台（Nitro 联调）：`pnpm dev:mp-weixin:nitro`，脚本会先检查或拉起 Nitro，再进入微信小程序编译链。
- APP 平台：`pnpm dev:app`，然后打开 `HBuilderX`，导入刚刚生成的 `dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios 基座。(如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个 unibest 项目导入到 hbx，通过 hbx 的菜单来运行到对应的平台。)

## 6. 发布

- web 平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到 web 服务器，如 nginx 运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin 平台：`pnpm build:mp`，打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP 平台：`pnpm build:app`，然后打开 `HBuilderX`，导入刚刚生成的 `dist/build/app` 文件夹，选择发行 - APP 云打包。(如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个 unibest 项目导入到 hbx，通过 hbx 的菜单来发行到对应的平台。)
- 独立 Nitro Node 服务构建：`pnpm build:nitro` 或 `pnpm build:nitro:node`，构建完成后产物位于 `.output/` 目录。
- Vercel Nitro 服务构建：`pnpm build:nitro:vercel`，构建完成后使用 Nitro `vercel` preset 生成 Vercel 所需产物。
- 独立 Nitro 服务预览：`pnpm preview:nitro`，当前通过直接运行 `.output/server/index.mjs` 进行本地预览；它面向 Node 产物，不对应 Vercel 产物预览。

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

## 12. 期望达到的学习目标

1. 借此来学习 vue2 和 vue3 的 uniapp 代码编写差异。便于我日后上手公司项目。熟悉一大套 API。
2. 尝试给出一个 claude code 代码迁移代理，迁移代码写法为 vue3。
3. 接触一下 UI 生成类的 AI 工具，帮我生成合适的 UI 方案，并设计合适的 css 颜色变量。
4. 在保留现有 mock 开发效率的前提下，把本项目逐步推进到可独立部署的 Nitro 接口体系，并为后续接入 Neon 数据库留好边界。

## 13. 工作任务划分

### 13.1. 阮喵喵

做下面这 4 个静态页面。

![2025-09-13-00-33-54](https://s2.loli.net/2025/09/13/gtkP7dIYfnyqZ6m.png)

- 公告
- 维修录单
- 通讯录
- 投诉录单
