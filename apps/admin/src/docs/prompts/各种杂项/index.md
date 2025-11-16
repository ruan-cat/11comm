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
