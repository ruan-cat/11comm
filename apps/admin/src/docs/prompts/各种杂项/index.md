# 杂项提示词

各种零散的提示词都在这里编写。

## 001 处理生产环境爆出的 `DOMNodeInsertedIntoDocument` 故障

请深度思考。

1. 请你使用谷歌浏览器 MCP 访问以下地址，并打开控制台查看报错：

- https://01s-11comm.ruan-cat.com/
- https://01s-11.ruancat6312.top/

2. 这些报错大致都指向这样的信息，如下：

```text
const { message: Mzt } = require("/home/runner/work/11comm/11comm/apps/admin/src/utils/message.ts");
```

为什么打包结果会出现 `require` 呢？是怎么回事？请为我解决 `apps\admin\package.json` 包运行 build 命令后，部署到生产环境出现 require 的错误，按理说打包后不应该出现这样的 require 模块的。

## 002 处理 build 产生的 require 故障

请深度思考。

针对 `apps\admin\package.json` 文件。

1. 运行 `build:prod` 命令，做生产环境构建。
2. 运行 `preview` 命令，预览本地效果。
3. 用谷歌浏览器 MCP，查看预览的界面。
4. 控制台出现报错，称找不到 `require` 模块。
5. 请处理该故障，并告诉我为什么打包后会出现残留的 `require` 模块 ？

## 003 探索并思考故障

请深度思考。
我在使用 vue-pure-admin 作为二次开发的模板时，在 build 构建打包成应用的时候，出现了 require 函数不存在的故障。该故障目前没有在本项目内出现。
引起故障的插件是 vite-plugin-fake-server，具体配置是 enableProd: true 配置。
你可以检查这几个关键词，来检查打包产物是否出现了直接使用 node 的 require 函数。
`vite-plugin-fake-server`
`__VITE__PLUGIN__FAKE__SERVER__`
`window.__VITE__PLUGIN__FAKE__SERVER__.xhook`
请帮我深度研究相关依赖，从 vite-plugin-fake-server 方向入手，研究一下在什么情况下，vite 构建时会直接保留并使用 require 函数。

## 004 探索并思考故障

请深度思考。
我在使用 vue-pure-admin 作为二次开发的模板时，在 build 构建打包成应用的时候，出现了 require 函数不存在的故障。该故障已经在本项目内出现。
引起故障的插件是 vite-plugin-fake-server，具体配置是 `enableProd: true` 配置。我目前是一定要配置 `enableProd: true`，不太可能关闭该配置。
你可以检查这几个关键词，来检查打包产物是否出现了直接使用 node 的 require 函数。
`vite-plugin-fake-server`
`__VITE__PLUGIN__FAKE__SERVER__`
`window.__VITE__PLUGIN__FAKE__SERVER__.xhook`
`const {message: Mzt} = require("D:/code/github-desktop-store/01s-11comm/apps/admin/src/utils/message.ts")`
请帮我深度研究相关依赖，从 vite-plugin-fake-server 方向入手，研究一下在什么情况下，vite 构建时会直接保留并使用 require 函数？
请帮我深度研究一下，为什么构建的时候，会突兀地突然 require 这个 apps/admin/src/utils/message.ts 模块呢？
最后将你深度研究的报告输出到项目根目录内，便于我阅读。

## 005 优化整理 md 文档的格式

请你阅读以下文档：

- .claude\agents 文件夹下面的全部 markdown 文档
- apps\admin\src\docs 文件夹下面的全部 markdown 文档
- CLAUDE.md

请你按照 `CLAUDE.md` 的格式要求，批量修改上述文档的格式。

## 06 初始化任务大师，设定一揽子长效运行的列表页迁移任务

我打算用 `taskmaster-ai` 这款 MCP，针对 `apps\admin\src\pages` 内全部列表页，即全部满足 `.claude\commands\make-std-list-page-and-formlike-dialog.md` 文档的页面，做列表页的改造。我需要你帮我使用这款 `taskmaster-ai` MCP，初始化改造任务，制作任务清单。并告诉我以后如何基于 `taskmaster-ai` MCP 来完成一些列列表页改造任务。

列表页改造的具体要求明细，全都在 `.claude\commands\make-std-list-page-and-formlike-dialog.md` 文档内。

刚才我使用其他工具设置了一系列配置，但是我不确定是否完成配置了。请你阅读被修改的文件，检查 `taskmaster-ai` 是否完成了配置？

检查 `taskmaster-ai` 是否是直接使用来自 claude code 的模型？

## 07 为 taskmaster-ai 初始化全部的任务

针对 `apps\admin\src\pages` 内全部列表页，即全部满足 `.claude\commands\make-std-list-page-and-formlike-dialog.md` 文档的页面，做列表页的改造。我需要你帮我使用这款 `taskmaster-ai` MCP，初始化改造任务，制作任务清单。并告诉我以后如何基于 `taskmaster-ai` MCP 来完成一些列列表页改造任务。

最核心的是，我需要你帮我初始化一份完整的 `.taskmaster\tasks\tasks.json` 配置文件，覆盖掉全部满足要求的列表页页面。

### 列表页特征

在你初始化 `.taskmaster\tasks\tasks.json` 任务文件时，请你先搞清楚什么是需要被处理的列表页：

1. 凡是在 `-detail-page` 目录内的 index.vue 文件都不是列表页。
2. 路由深度到 3 级的页面才是列表页。请阅读 `apps\admin\src\router\rank\rank-route-keys.ts` 文件，根据 3 级路由的页面，来制定任务。

## 08 解决 taskmaster-ai 无法使用的问题

1. 请问 .taskmaster\tasks\tasks.json 文件是否满足 `taskmaster-ai` 的格式要求？如果错了，请你告诉我怎么更改格式。
2. 请问 `apps\admin\src\docs\reports\2025-11-12-TASKMASTER-AI-QUICKSTART.md` 报告在 claude code 场景下，是否是正确的？这份报告是否有错误？
3. 我在项目根目录直接运行全局的 `task-master-ai` 包，尝试输出任务列表，但是报错了。请问是不是本项目的 task 任务格式有问题？还是其他的什么故障？

## 09 在 claude code 内没找到存在的 `taskmaster-ai` MCP

我在本项目内的 `.mcp.json` 配置了 `taskmaster-ai` 这款 MCP，但是我在 claude code 内列举 MCP 时，没看到该 MCP 被注册使用了。请问在 `.mcp.json` 内定义的 MCP，到底怎么去确认其是否正常安装工作呢？为什么 claude code 的 `/mcp` 命令没看到这个本地项目包的安装信息呢？

## 10 生成 pure-admin 文档 icon 方案迁移子代理

我需要你帮我生成一个子代理文件，写入到 `.claude\agents` 内，实现对一个 vite+vue3 项目，实现 pure-admin 的 icon 方案。

我需要你做两件事情：

1. 调研 `pure-admin` 后台模板框架是如何实现在线 `iconify` 图标集的识别与渲染的。并出示一份研究报告。
2. 根据研究报告，编写一个面向 claude code 的子代理，实现对任意一个 vite+vue3 项目对接实现在线 `iconify` 图标集的识别与渲染的功能。

按照以下步骤开始实现任务，

1. 请阅读 `https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.%E6%8C%87%E5%8D%97/02.%E8%BF%9B%E9%98%B6/01.%E5%9B%BE%E6%A0%87.md` 文档。
2. 请你适当的阅读本项目的 `apps\admin` 目录，该目录的 vite 项目是基于 `pure-admin` 后台模板框架制作的。

## 11 代码写法更换

1. 在 `apps\admin` 目录内，在全部的 `form.vue` 组件内，搜索字符串 `const plusFormRules = {` ，找到 plusFormRules 变量。
2. 阅读 `.claude\agents\make-form-for-dialog.md` 文件。针对你查找出来的代码，这些 plusFormRules 变量写法不满足 `make-form-for-dialog` 子代理的要求，请修改。
3. 你只修改 plusFormRules 变量的写法，其他的部分不作处理。
4. 独立运行 `make-form-for-dialog` 子代理完成修改。

## 12 修复类型故障

运行 `apps\admin\package.json` 的 `typecheck` 命令，并修复类型错误。

## 13 处理 `nitro/vite` 插件导致的故障

1. 运行 `apps\admin\package.json` 的 `build` 命令，会出现一些列故障。
2. 我是用了 `import { nitro } from "nitro/vite";` 插件，在 `apps\admin\build\plugins\index.ts` 插件配置内使用。
3. nitro 的文档： https://v3.nitro.build/docs/quick-start#add-to-a-vite-project
4. nitro 的 github 仓库： https://github.com/nitrojs/nitro
5. 请你处理这一些列打包故障，确保项目可以通过 `nitro/vite` 插件直接变成 nuxt 格式的全栈项目。
6. 由于该 vite 插件相当新潮，请你主动的阅读项目文档和源码。

## 14 配置 nitro 部署到 cloudflare worker 内

1. 阅读文档 https://v3.nitro.build/deploy/providers/cloudflare#cloudflare-workers 。
2. 按照文档要求，配置项目部署目标为 cloudflare worker 。

## 015 处理故障

在 github workflow 内，运行 `apps\admin\package.json` 的 build 命令，出现以下报错。

这很奇怪，在 cloudflare worker 的流水线都没有出现这些故障，为什么 github workflow 就出现这些错误呢？

阅读以下错误日志，并修复错误。

```log
✗ Build failed in 35.34s
error during build:
../../node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs (1:9): "createRequire" is not exported by "__vite-browser-external", imported by "../../node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs".
file: /home/runner/work/11comm/11comm/node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs:1:9

1: import { createRequire } from "module";
            ^
2: import { basename, dirname, normalize, relative, resolve, sep } from "path";
3: import * as nativeFs from "fs";

    at getRollupError (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at error (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
    at Module.error (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:16956:16)
    at Module.traceVariable (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:17412:29)
    at ModuleScope.findVariable (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:15076:39)
    at Identifier.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:5423:40)
    at CallExpression.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:2813:23)
    at CallExpression.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:12123:15)
    at VariableDeclarator.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:2813:23)
    at VariableDeclaration.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:2809:28)
    at Program.bind (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:2809:28)
    at Module.bindReferences (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:16935:18)
    at Graph.sortModules (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:22746:20)
    at Graph.build (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:22644:14)
    at async file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:23335:13
    at async catchUnfinishedHookActions (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:22805:16)
    at async rollupInternal (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/rollup@4.53.3/node_modules/rollup/dist/es/shared/node-entry.js:23330:5)
    at async buildEnvironment (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/vite@7.2.7_@types+node@24.10.1_jiti@2.6.1_less@4.4.2_lightningcss@1.30.2_sass@1.94.2_tsx@4.21.0_yaml@2.8.2/node_modules/vite/dist/node/chunks/config.js:33540:12)
    at async Object.build (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/vite@7.2.7_@types+node@24.10.1_jiti@2.6.1_less@4.4.2_lightningcss@1.30.2_sass@1.94.2_tsx@4.21.0_yaml@2.8.2/node_modules/vite/dist/node/chunks/config.js:33899:19)
    at async buildEnvironments (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/nitro@3.0.1-alpha.1_@vercel+blob@1.0.2_chokidar@4.0.3_lru-cache@11.2.4_rollup@4.53.3_vi_afd42200af83b2ac141dcec1c8d3b54c/node_modules/nitro/dist/_build/vite.plugin.mjs:156:3)
    at async Object.buildApp (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/vite@7.2.7_@types+node@24.10.1_jiti@2.6.1_less@4.4.2_lightningcss@1.30.2_sass@1.94.2_tsx@4.21.0_yaml@2.8.2/node_modules/vite/dist/node/chunks/config.js:33893:5)
    at async CAC.<anonymous> (file:///home/runner/work/11comm/11comm/node_modules/.pnpm/vite@7.2.7_@types+node@24.10.1_jiti@2.6.1_less@4.4.2_lightningcss@1.30.2_sass@1.94.2_tsx@4.21.0_yaml@2.8.2/node_modules/vite/dist/node/cli.js:629:3)
 ELIFECYCLE  Command failed with exit code 1.
Error:  command finished with error: command (/home/runner/work/11comm/11comm/apps/admin) /home/runner/setup-pnpm/node_modules/.bin/pnpm run vite:build:prod exited (1)
Error: @01s-11comm/admin#vite:build:prod: command (/home/runner/work/11comm/11comm/apps/admin) /home/runner/setup-pnpm/node_modules/.bin/pnpm run vite:build:prod exited (1)

 Tasks:    0 successful, 1 total
Cached:    0 cached, 1 total
  Time:    1m13.364s
Failed:    @01s-11comm/admin#vite:build:prod
```

### 01 回答问题

当前错误：fdir/dist/index.mjs 里 import { createRequire } from "module"，Vite/rollup 将 module 替成 \_\_vite-browser-external（不导出 createRequire）导致构建失败。错误只在 GitHub Workflow 跑 pnpm run build（即 turbo → @01s-11comm/admin#vite:build:prod）时出现。
工程现状：apps/admin Vite 配置启用了 nitro() 插件，nitro.config.ts 设为 preset: "cloudflare_module" 且 nodeCompat: true。仓库内没有 pnpm-lock.yaml，rg 没找到任何对 fdir 的源码引用，说明它来自某个未锁定的三方依赖。
CI 流程：.github/workflows/ci.yaml 在 Ubuntu 上用 Node 22.14.0、全量递归安装，再跑 pnpm run ci → pnpm run build → turbo。Cloudflare worker 流水线的具体安装/构建命令暂未知。
为避免瞎改，我需要确认几件事：

1. 允许你在本地装依赖并运行 pnpm why fdir、pnpm -F @01s-11comm/admin vite:build:prod 复现/定位。
2. Cloudflare worker 流水线用的确切命令是 `vite:build:prod` 。
3. 不新增 pnpm-lock.yaml 来锁定依赖版本。
4. nitro 全栈构建必须在每次 CI 的 web 前端构建里运行。
5. 不强制要求保留 nodeCompat: true / cloudflare_module 这一 preset？（关系到是否可以通过 external/stub 方式规避 fdir 依赖）

确认后我会按需执行：定位 fdir 的引入链 → 给出最小改动（如锁版本、external/stub、或按环境开关 nitro）→ 调整配置并跑 pnpm -F @01s-11comm/admin typecheck。

另外，我需要你制作可以在命令行内传递 nitro preset 的命令。制作两个命令，一个是传递 `cloudflare_module` 的，另一个是传递默认预设的。

具体可以参考文档 https://v3.nitro.build/ 。

### 02 升级依赖

请问我是否可以通过升级 vite tinyglobby fdir 等依赖，升级到最新版，以便解决该故障？我不太喜欢这种依赖包 overrides 的处理方案。

### 03 工作收尾

很好。

1. 请你暂存 git 工作区，生成一个中文说明的 git commit，说明清楚你的改动。
2. 将分支合并到 dev 分支内。
3. 删除掉你刚才新创建的本地验证分支 `chore/vite-upgrade-validation` 。
4. 将你的修改方式，和验证方式，总结成可以复用的经验。编写成报告供我复盘总结。
