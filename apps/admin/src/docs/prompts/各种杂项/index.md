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
