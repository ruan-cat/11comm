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

## 15 修复 cz 无法运行并交互的错误

我在运行 cz 命令时，会出现错误，请帮我修复该错误：

```log
PS D:\code\github-desktop-store\01s-11comm> cz
cz-cli@4.3.1, cz-git@1.12.0

Unexpected token '*', "[*.{js,jsx,"... is not valid JSON

```

请你帮我检查一下，是不是配置了 overrides 才导致的依赖版本对不上的故障，导致了我的 `@ruan-cat/commitlint-config` 使用失败？

```yaml
overrides:
  vite: 7.1.12
  tinyglobby: 0.2.15
  fdir: 6.5.0
```

## 16 根据 `.taskmaster\tasks\tasks.json` ，初始化 openspec 规格的任务

1. 请你全量阅读 `.taskmaster\tasks\tasks.json` 文件格式。
2. 阅读 `.claude\agents\make-list-page.md` 关于【用 `假数据文件` `test-data.ts` 来存储业务类型与假数据】章节，了解清楚数据格式的处理要求。
3. 请你将这个文件，转换成可以被 openspec 识别的一揽子任务。

## 017 为新增的 `@01s-11comm/type` 包，更新 AI 指导文件

1. 现在整个项目增加了新的包，`@01s-11comm/type` 包。
2. 请你阅读整个项目全部的 `package.json` 文件，分析文件依赖。
3. 对于全部名称为的 `CLAUDE.md` 、`project.md` 和 `AGENTS.md` 文件，做出适当的拓展更新。说明清楚增加了新的库，以及如何做整个项目的 `typecheck` 类型检查。

## 018 修复 nitro 接口的故障

当我在使用 nitro 的 `/api/dev-team/config-manage/center/list` 接口时，出现服务端 500 错误，请你结合 nitro 的配置和相关细节，帮我分析一下，为什么运行接口会出现严重的类型检查错误的故障？

接口 500 返回的日志如下：

```log
{
    "error": true,
    "url": "http://localhost:8080/api/dev-team/config-manage/center/list",
    "status": 500,
    "message": "[vite] The requested module 'vue-router/auto-routes' does not provide an export named 'routes'",
    "stack": [
        "[vite] The requested module 'vue-router/auto-routes' does not provide an export named 'routes'",
        "at analyzeImportedModDifference (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:456:36)",
        "at ModuleRunner.processImport (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1005:54)",
        "at ModuleRunner.cachedRequest (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1028:33)"
    ]
}
```

1. 我不理解为什么服务端的接口，会识别这些客户端的导入模块呢？
2. 请结合 `apps\admin\src\docs\reports\2025-12-13-gemini-error.md` 文档，为我分析清楚故障原因，并解决这个故障。
3. 请注意，在 nitro v3 中，是没有独立的 vite 配置选项的。

---

表面上是接口的筛选逻辑导致的 bug，实际上是整个 nitro 接入的时候，就没有完整的完成过 vite SSR 项目改造。单纯的使用 nitro 插件，是不注意让项目变成 SSR 全栈项目的。

### 01

```log
{
    "error": true,
    "url": "http://localhost:8080/api/dev-team/config-manage/center/list",
    "status": 500,
    "message": "location is not defined",
    "stack": [
        "location is not defined",
        "at D:/code/github-desktop-store/01s-11comm/apps/admin/src/utils/sso.ts:15:29)",
        "at D:/code/github-desktop-store/01s-11comm/apps/admin/src/utils/sso.ts:56:1)",
        "at ESModulesEvaluator.runInlinedModule (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:905:3)",
        "at ModuleRunner.directRequest (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1112:59)",
        "at ModuleRunner.cachedRequest (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1030:73)",
        "at D:/code/github-desktop-store/01s-11comm/apps/admin/src/router/index.ts:1:8)",
        "at ESModulesEvaluator.runInlinedModule (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:905:3)",
        "at ModuleRunner.directRequest (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1112:59)",
        "at ModuleRunner.cachedRequest (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/vite@7.1.12_@types+node@24._b816c0354aec0f55b159422c9a542a15/node_modules/vite/dist/node/module-runner.js:1030:73)",
        "at D:/code/github-desktop-store/01s-11comm/apps/admin/src/store/utils.ts:3:1)"
    ]
}
```

## 019 <!-- TODO: --> 阅读每一个页面，检查代码写法是否正常，是否有需要微调的部分

认真的，人工的阅读每一个页面，看清楚这些页面的基础功能是否正常。

耗时的人工检查任务。不能用 AI 来完成。

## 020 改造 agent 文件为 skills 技能文件

将 `.claude\agents` 的全部子代理改造成 claude code 的 skills 文件。

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## 021 编写面向 nitro v3 接口写法的完整 claude code 技能规范

请你帮我生成一个使用 nitro v3 编写 nitro 接口的 skills 技能规范。这个技能将帮助我让一个全新的项目赋予 nitro 全栈接口能力。可能是 vite、可能是单纯的 nitro 后端项目，规范代码写法，配置写法等等。不仅能够实现 nitro v3 格式的初始化写法，还能够实现接口写法的规范约束。

### 生成该技能时需要阅读的上下文

你需要阅读以下内容，来确保生成技能时，不会出现明显的错误：

1. nitro： 这是使用全栈构建的库。用该库就能实现将 vite 项目变成全栈项目。以下是使用 nitro v3 开发服务端接口的的注意事项：
   - https://github.com/unjs/nitro
   - https://v3.nitro.build/
2. claude code skills： 生成 skills 时需要满足的格式规范和最佳实践。
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
3. 全部 openspec\specs 目录内涉及到 nitro 接口编写的规范
4. apps\admin\server 目录下的 nitro 接口
5. apps\admin\nitro.config.ts 配置文件
6. apps\admin\build\plugins\index.ts vite+nitro 插件配置

### 技能要包含的内容

这个技能至少要包含以下内容：

1. nitro v3 框架需要使用的 node 依赖包。
2. nitro 接口编写的文件夹组织规范。
3. nitro v3 框架使用的 nitro.config.ts 配置。
4. 如果被初始化的目标项目是 vite 项目，需要涉及到 nitro 的 vite 插件使用。
5. 部署 nitro 接口时差异化的部署平台环境变量配置。
6. 编写 nitro v3 接口时需要使用的标准函数。

### 使用该技能的场景

1. 对一个非 vite 的 node 项目，初始化 nitro 示例代码以及 nitro 配置。新建纯后端的 nitro 接口项目。
2. 对一个 vite 项目，初始化 nitro 接口和配置，以及 vite 插件。赋予 vite 项目全栈能力。

## 022 删除 stylelint

检查整个项目关于 `lint:stylelint` 字符串的内容，全部删掉。不提供这个东西。本项目不使用任何形式的 stylelint 。

## 023 为全部的 index.vue 列表页文件，补全 `:loading="isFetching"` 的组件 props 使用

请你全面的检查后台项目内，全部 index.vue 文件的列表页。注意检查 `PureTable` 组件对 loading 这个 props 的使用。现在的情况是，有绝大多数的文件，都缺少缺失了这个配置。没有及时的使用来自组合式 api 提供的 `isFetching` 响应式变量。

这不符合 `.claude\skills\frontend-development\references\api-data-fetching.md` 文档的规范。大多数的 index.vue 组件，应该充分的满足 `frontend-development` 技能的要求。

请你设计一个 openspec 任务，完成这个批量的代码补全任务，为 `PureTable` 组件补全 `:loading="isFetching"` 的使用。

这是一个简单的任务。但是涉及的组件非常多，你绝对不能遗漏文件。

你在设计 tasks.md 任务列表时，务必根据 `apps\admin\src\router\rank\rank-route-keys.ts` 业务路由文件的设计，去设计一个全面的，齐全的，细致的 tasks.md 任务列表文件。必须非常细致，细化到每一个业务路由对应的文件。

## 024 更新关于 seed 的命令使用说明，和相关的文档

我读不懂 `"db:reseed": "npx tsx scripts/run-seed-sql.ts --clean",` 这一行命令的作用。请你阅读相关的 git 提交记录，告诉我这个命令的作用。

1. 请你更新 `apps\admin\README.md` 文档，说明清楚需要补全的命令。
2. 更新 `apps\admin\src\docs\guides\seed-commands.md` 文档，说明清楚这几个关于 seed 的命令。
3. 请你充分的阅读现在的 `.claude\skills` 技能，找到和 schema 新增、维护、修改相关的技能文档。然后去及时更新 `apps\admin\src\docs\guides\seed-commands.md` 文档。
   - 更新 `guides\seed-commands.md` 文档内关于 schema 的存储路径。
   - 说明清楚在更新 schema 数据库表后，应该按照顺序，运行那些命令，才能够及时的更新 neon 云数据库。

在你更新 `guides\seed-commands.md` 文档时，请你确保文档内已经有的知识点，不被你删除掉，遗漏掉，确保不要出现文档核心内容的遗忘。除非遇到冲突的，过时的内容，否则其他核心的指导能力的文本，都不要删除修改。

## 025 拓展 cloudflare worker 的部署命令，确保能够获取到来自 vercel 的环境变量

编写一个 turbo 命令，确保我在运行 `vite:build:prod:cloudflare` 这个命令时，可以在 cloudflare worker 内按照以下流程执行：

1. env:pull 拉取环境变量。
2. `NITRO_PRESET=cloudflare_module NODE_OPTIONS=--max-old-space-size=8192 vite build --mode production --configLoader runner` 针对 cloudflare worker 环境完成部署。

需要你适当的重写 `vite:build:prod:cloudflare` 命令，在 admin 后台项目内编写合适的 turbo 命令，确保完成链式任务调度。

确保运行的命令，在 cloudflare worker 内，能够得到全局的 vercel 和 turbo 这两个全局包，确保运行顺利安全。

## 026 以常见全栈项目的视角来检查，审视本项目存在的风险项

已完成，已生成 `apps\admin\src\docs\reports\2026-02-20-fullstack-project-risk-analysis.md` 报告，等待阅读和思考。

---

请你阅读本项目。包括类型项目和后台项目。你需要带着以下的这几个问题，去思考本项目。

1. 思考现在的类型项目和后台项目的架构是否符合全栈项目的最佳规范？
2. 思考现在的测试用例，是否有重叠？怎么降低维护难度？
3. 思考全部 package.json 提供的 cli 命令、以及 turbo 封装的串行命令，是否满足最佳全栈开发的惯例？
4. 思考现在的 nitro 全栈接口，其架构和维护方式，是否符合惯例？

允许你做出破坏性的架构设计。多做深刻而全面的思考。大胆质疑。

必须使用 agent team 完成多个子代理的思考和设计，避免占用主代理的上下文窗口。

## 027 在 AI 记忆文档 `CLAUDE.md` 内增加明确的运行命令流程说明 ✅

后台项目运行项目时的命令运行顺序，需要被记录。

运行后台项目的测试命令 `test:nitro` 时，应该先运行 `dev` 命令，即整个项目，确保先提供本地的，可运行的 nitro 接口，然后才能运行 `test:nitro` 命令。让以后的 AI 模型都记得这个规定，以后需要经常运行 `test:nitro` 命令来测试本地的 nitro 接口在连接 neon 数据库的前提下，是否能正常工作。

## 028 修复 cloudflare worker 内的 nitro 数据库连接故障

在 `apps\admin\server\db\index.ts` 内，我期望实现 nitro 接口在 context 上下文内，获取到来自 cloudflare worker 提供改的环境变量文件，但是实际执行的时候，出现未获取环境变量的错误。请你检查 `apps\admin\server\db\index.ts` 和相关的 nitro 接口。解决故障

## 029 优化精简 `CLAUDE.md` 文档

CLAUDE.md 文档太冗长了，占用了很多上下文窗口。请你思考并设计一个合适的方案，实现大幅度精简 CLAUDE.md 文档。

## 030 本项目的 `import { createError }` 应该来自于 `nitro/h3` 模块

```ts
// 正确
import { createError } from "nitro/h3";
// 错误
import { createError } from "h3";
```

1. 请你全局检查设计到错误导入路径的 nitro 接口写法和 markdown 文档。并修改成正确的写法。
2. 请你修改 `.claude\skills\nitro-api-development` 技能，确保这个技能提供足够的说明，避免继续使用容易出错的导入路径。
3. 修改 CLAUDE.md 文档，增加这个易错项。请注意编写精简的写法，避免过于滥用 CLAUDE.md ，避免对后续 AI 对话造成上下文窗口负担。

## 031 <!-- TODO: --> 更新 `fix-type-error` 和 `nitro-api-development` 技能

针对 apps\admin\src\docs\reports\2026-03-02-typescript-type-error-fix-retrospective.md 出现的改进建议，去改进 `.claude\skills\fix-type-error` 这款技能，避免以后还出现类型错误

同样的，去修改 .claude\skills\nitro-api-development 技能，避免以后编写 nitro 接口出现明显的错误。

首先使用 MCP 提供的记忆工具，读取本项目的错误记忆，然后再开始继续任务。
