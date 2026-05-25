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

## 031 更新 `fix-type-error` 和 `nitro-api-development` 技能

针对 apps\admin\src\docs\reports\2026-03-02-typescript-type-error-fix-retrospective.md 出现的改进建议，去改进 `.claude\skills\fix-type-error` 这款技能，避免以后还出现类型错误

同样的，去修改 .claude\skills\nitro-api-development 技能，避免以后编写 nitro 接口出现明显的错误。

首先使用 MCP 提供的记忆工具，读取本项目的错误记忆，然后再开始继续任务。

## 032 填充项目数据库

对应任务 `fill-database-tables` 。

---

现在本项目大部分的数据库表，都是空的。我需要你确保现在 `apps\admin\scripts\generate-seed-sql.ts` 的逻辑，能够对全部的数据库表都填充 mock 数据。

1. 使用 neon MCP，查询数据库表，搞清楚有哪些数据库表没有任何一条数据。
2. 搞清楚本项目的 mock 数据库存储规则。
3. 修改 `apps\admin\scripts\generate-seed-sql.ts` ，确保以后执行改脚本时，能够实现全部数据库表读取本项目的 mock 数据，确保 neon 数据库的全部数据库都能够有数据。

这个任务很艰巨，需要查询很多内容，容易出现缺漏。我不要求你现在就完成这个任务，我要求你新建一个 openspec 任务。用 openspec 来罗列出全部的任务列表，处理目标的列表，然后我亲自执行 openspec 任务。

你的任务时全面的探索并调研，罗列出全部需要填充的数据库表和需要使用到的 mock 数据文件。以 openspec 的格式来整理出任务清单。

### 01 优化改造 `fill-database-tables` 这款 openspec 长任务

1. 在 `fill-database-tables` 内，在 `openspec\changes\fill-database-tables\design.md` 和 `openspec\changes\fill-database-tables\proposal.md` 内补充以下的执行任务细则，我希望执行这款 `fill-database-tables` 任务时，能够使用 agent team 来完成并行的大规模开发，避免出现串行运行的卡顿情况。

以下是你要告诉给改 openspec 长任务的细则：

### 工作模式

你的工作模式如下：

1. 检查任务清单，按照顺序清单完成修改。
2. 一次只处理一个路径对应的文件。
3. 新建一个 agent team 子代理团队，新建 3 个子代理成员。
4. 完成任务后，删除掉一个具体的 `代码编写子代理` 成员。
5. 标记一个路径对应的文件完成修改。
6. 阅读下一个任务清单项目，在现有的 agent team 团队内，在团队内新建一个新的 `代码编写子代理` 成员，继续完成任务。

### 需要新建的子代理以及子代理之间的关系

1. `技能指导子代理`： 这个子代理负责全面的学习全部的 skills 文档，确保其清楚全部的代码编写规范。
2. `代码编写子代理`： 这个子代理根据具体的任务清单，并且根据 `技能指导子代理` 的指导，完成迁移修改，或者是新建文件。
3. `审核子代理`： 负责根据 `技能指导子代理` 和 `代码编写子代理` 的结果，完成

### 02 细粒化改造 `fill-database-tables\tasks.md` 任务清单

1. 我对 d:\code\github-desktop-store\01s-11comm\openspec\changes\fill-database-tables\tasks.md 的任务细粒度不满意。未来我会使用别的模型来完成任务。届时完成任务时，一定会缺斤少两。我要求你对 `fill-database-tables\tasks.md` 做非常细粒化的改造

## 032 更新风险项报告文档

我只承认这几个问题，其他的问题都不考虑

1. 108 个 API 测试无断言
2. Schema 迁移过渡态
3. 102 个文件使用 as any

请你及时的更新 apps\admin\src\docs\reports\2026-02-20-fullstack-project-risk-analysis.md 和 apps\admin\src\docs\reports\2026-02-27-project-risk-assessment.md 这两个文档，标记其他的风险项均不属于有意义的风险项，不予考虑。

## 033 全面更新本项目的 i18n 配置

详情在 `apps\admin\src\docs\prompts\各种杂项\2026-3-12-i18n\index.md` 内。

## 034 <!-- 已完成 --> 大批量处理 Drizzle/Nitro 类型错误

仓库里仍然有服务端 Drizzle/Nitro 类型错误，属于这次修复范围。需要你完成修复。

## 035 <!-- 已完成 --> 修复表格列无法筛选的问题

请注意 `apps\admin\src\components\RePureTableBar\src\bar.tsx` 的逻辑，注意到全部使用 `getKeyList` 的逻辑。这里的逻辑是从传入的数组内，筛选出全部含有 label 字段的配置。但是我们项目情况改动很大了。我们项目的表格列配置，现在为了实现全面的，有效的 i18n，都不配置 label 字段来显示表格的表头了。都是用 headerRenderer 字段的函数，来实现动态变化的表头了。

RePureTableBar 组件的筛选逻辑，很明显跟不上节奏了。需要你修复。我需要你封装一个函数，确保能够同时筛选到表格列数组配置包含 label 和 headerRenderer 字段的内容。

封装合适的函数，确保调用优雅清晰。且提供详细清晰的注释，说明清楚为什么要这样改动。

## 036 <!-- done: 2026-03-24 --> 全面替换 structuredClone

全面替换，废弃，不使用 structuredClone，因为弹窗打开时会因为 Vue props proxy 报错。换成 cloneDeep 。

## 037 <!-- 已完成。是的，是 relizy 导致了 window 系统的路径识别故障 --> 去检查 relizy 仓库，是不是真的出现路径是被导致的错误

- 相关调研数据： docs\issues\relizy

## 038 <!-- 放弃任务，不考虑继续优化了 --> 优化 relizy 脚本代码

1. 用全局 init-relizy 技能来优化本仓库的脚本。
2. 及时更新 README 文档，说明清楚不再使用具体的脚本文件来完成发版了。

## 039 <!-- 已完成 --> 迭代 `bump.config.ts` 的智能 push: false, 配置

我知道了，是 bump.config.ts 的 push: false, 配置不够智能。

这个 push: false, 是为了在 "release:root": "bumpp --yes --release patch", 命令 ，在 release:root 这个命令内关闭，

当 release:root 作为一个串行的子命令时，是不需要 push git tag 的。但是

但是当我单独使用 "release:bumpp": "bumpp", 实现单独的 bumpp 包使用时，这个配置就卡断了后续必须的 git push。所以远程的 git tag 才缺失；

请你实现一个智能化的 bump.config.ts push: false, 配置，

1. 如果串行模式，有后续尾缀，那么就不要 push。为 false，git tag 由其他的的工具完成 push。
2. 如果是单独使用 bumpp 命令来完成发版，就需要直接 push git tag。

## 040 <!-- 已完成 --> 部署 `apps\api` 项目到 vercel 平台

模仿 vercel 的 11comm-app-nitro-server 项目的做法，新建一个 11comm-nitro-server 的项目，部署 apps\api 这个 nitro 接口服务。

你的可参考案例如下：
11comm-app-nitro-server 本质上是 D:\code\ruan-cat\01s-11comm-app 的 nitro 接口服务。你的任务是使用 vercel MVP 或者是 vercel cli，新建一个 vercel 项目，部署 nitro 接口服务。

这是在 monorepo 项目内部署 nitro 接口，会涉及到一些误区，重点阅读 https://juejin.cn/post/7610816257119354915 文档，避免你出现部署的误区。

在配置 vercel 时，你可以参考 notes-my-pull-requests 这个 vercel 项目，这个也是属于在 monorepo 内部署 nuxt/nitro 项目的，重点模仿其使用的命令。避免出现 monorepo+nitro 在 vercel 部署时出现的故障。

## 041 <!-- 该阶段内容被拆分，移交给其他任务来完成，任务存储和进度格式被改造调整 --> 推进阶段 7 的大批量改造任务

开始执行 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`，我的核心目的是继续完成阶段 7 的剩余迁移任务。旧 Superpowers 任务载体已迁入 `docs/superpowers/phase7-openspec-migration-index.md`，后续不得再把旧矩阵、旧批次计划或旧总设计当作执行源。

严格按照 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/` 下的 OpenSpec 任务体系来完成任务。

认真落实 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/phase7-evidence-model/spec.md` 的证据模型和 `tasks.md` 的任务清单。确保迁移改造不要有任何形式的缺漏。

---

### 及时更新进度

每完成一小部分，就及时更新任务进度。及时在 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`、`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md` 和 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md` 更新任务进度、验证证据和风险发现，避免出现意外的中断，导致进度丢失错配；

及时用 memorix 更新跨 AI，跨 agent 式的通用全局记忆。每完成一小部分，就及时更新任务进度。确保下一个独立的 AI 会话，能够根据你写的 markdown 信息，和全局的 memorix 记忆，继续完成下一步的工作。确保其他 AI 在全新的上下文内，清楚如何接力接手工作。

### 自主验证流程

用谷歌浏览器 MCP，本地运行 app、admin、和 api 三个 monorepo 子项目子包的 dev 命令，本地运行 3 端的 dev，用谷歌浏览器 MCP，打开 dev 服务页面。逐个访问需要验证的页面，确保前端页面能够及时使用正确的 nitro 接口信息，并完成闭环式的接口调用。确保项目成果可交付。

### 使用 agent team 蜂群架构的多个子代理成员来完成任务

1. 你必须主动的使用 agent team 能力，我不希望你直接使用主代理来完成任务。避免占用主代理的上下文窗口，导致失忆。
2. 先检查当前是否有现成的 agent team 团队。如果有，请确保你已经及时的关闭旧的 agent team 团队。
3. 新建一个干净的，独立的 agent team 子代理团队。子代理团队成员至少要包括以下几个成员：
   - 探索子代理成员。专门用于探索项目代码，
   - 编辑子代理成员。专门用于编辑代码。如果需要修改的代码数量很多，请你新建多个并行运行的编辑子代理来完成任务。
   - 检查复核子代理成员。专门用于检查完成效果，检查是否按照文档或者是用户的要求完成任务。如果没有完成、完成缺漏、完成质量差。就通知主代理，去新建新的`编辑子代理成员`来继续完成修改，直到完成。
4. 如果你仍旧在处理同一个任务，请你在现成的 agent team 子代理团队内继续新建、新增 agent team 成员。
5. 及时关闭掉已经完成任务的 agent team 子代理成员。优雅的关闭掉子代理成员。

## 042 <!-- 已完成 --> 重构任务执行与存储模式，便于实现长任务连续执行

按照全局技能 do-long-task 的要求，我准备大规模重构以下三个旧任务载体。

- 旧 Phase7 endpoint 状态矩阵。
- 旧 Phase7 batch 执行计划。
- 旧 monorepo API 迁移总设计。

我不想继续长期维护这三个文件了，我想转换任务进度的文件存储体系，从基于 superpower 的这几个文件，改造成基于 `do-long-task` 技能的要求。

1. 首先，我需要你结合 openspec，先改造成完整的 openspec 任务体系文件。
2. 严格按照 openspec 的任务体系文件来组织规划。
3. 确保新的 openspec 任务，还能够继续更近清楚阶段 7 的东西。
4. 确保后续执行 openspec 任务时，还能够认真执行 memorix。
5. 最后全面删除这三个文件，这三个文件太大，太臃肿了。

我没想到这一系列任务非常复杂，因此任务记录，拆分，长期维护的体系，也应该及时换成 openspec 体系，这个更加适合长期任务。

这是一个容易产生遗漏遗忘，缺省的错误。很容易出现记忆丢失。你应该认真阅读这三个文件，结合 memorix，查看这几个任务体系文件承载的历史。

我们的本质是改造任务执行与记录的载体，从基于 superpower 的三个 markdown 文件，改造成基于 openspec 的一系列文件。

## 043 <!-- TODO: 正在持续的完成 app项目基本上完成大部分的迁移了 --> 完成 app 和 admin 项目的独立 nitro 接口服务的迁移与搭建

```markdown
/goal 执行 OpenSpec change：`openspec\changes\migrate-superpowers-docs-to-openspec-longtask`。

目标：
持续完成 `tasks.md` 中所有未完成任务，直到：

1. 所有 checkbox 都变成 `[x]`。
2. `/opsx:verify <change-name>` 没有 CRITICAL。
3. 项目的测试、lint、typecheck 全部通过。
4. `agent-progress.md` 有最终总结。
5. `agent-findings.md` 记录重要发现、失败尝试和遗留风险。
6. 关键验收场景都有测试或明确验证记录。

执行规则：

- 先读取 `proposal.md`、`design.md`、`specs/`、`tasks.md`。
- 以 `tasks.md` 为唯一主任务源。
- 不要创建另一套任务列表。
- 每次只处理一个小 task 或一个明确 checkpoint。
- 每完成一个 task，更新 `tasks.md`。
- 每完成一个 checkpoint，更新 `agent-progress.md`。
- 重要发现写入 `agent-findings.md`。
- 遇到实现问题时使用 Superpowers 的 `systematic-debugging`。
- 实现每个小阶段时使用 Superpowers 的 `test-driven-development`、`subagent-driven-development`、`requesting-code-review`。
- 不要每一步询问是否继续。
- 只有遇到权限问题、需求冲突、破坏性操作风险、产品决策问题、连续 3 次同类失败，或需要产品决策时才暂停。

停止条件：

- 全部完成。
- 无法继续且输出 BLOCKED 报告。
- 运行达到 8 小时。
- 上下文不足且无法通过文件恢复。

---

其他执行时的注意事项：

1. **及时关闭已经使用完成的谷歌浏览器**： 在长达数个小时的长任务内，你会启用谷歌浏览器 MCP 来完成自测。请及时关闭掉已经完成测试的谷歌浏览器，避免打开过多的谷歌浏览器，以免造成电脑压力。
2. **如何触发生产环境部署**： 我们项目目前的是 monorepo 项目，分别有 admin、app、api 三个核心子包。这三个子包子项目会分别对应 3 个 vercel 项目。你不需要去连接具体的 vercel 项目，你只需要知道在本项目的 dev 分支 push 提交后，这 3 个核心项目就会在各自的 vercel 项目内完成部署，最后实现生产环境更新。
3. **连续长任务暂不允许执行具体的 git commit**： 我暂时不允许你在 dev 完成有意义的 git commit，并 push 远程。这意味着生产环境的更新和验证你都暂时做不了，请你把相关的生产环境验证的子任务，放到最后再做。这属于你的`卡点`，等你完成了其他全部 openspec 的子任务，只剩下其他卡点和这个生产环境验证的卡点时，再停下整个 goal 长任务，然后按照 `do-long-task` 技能的长任务纪律，停下来请求我的`干预`和`支持`。

---

你的核心任务是完成 app 和 admin 两个项目的 nitro 接口统一迁移，并且确保独立的 api 项目成为 app 和 admin 两个前端项目的独立后端。不要忘记这一些列任务的核心目的。
```

### 01 怀疑连续的 16 个小时的工作目标不对，工作失衡，任务细粒度本身就指向不明确

我想先暂停一下你的 goal 工作，你的工作已经持续 16 小时了，我没看到你的任何代码修改。

有效的更改仅仅只有一些 markdown 文档，和 vitest 测试用例。

1. 怀疑 task.md 任务目标本身失衡： 我很怀疑你的 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 是不是本身设计的有问题啊？没有充分体现出我要实现 admin、app 迁移内置 nitro 接口到独立 api 项目的任务呢？是任务目标都不对么？失衡了么？
2. 怀疑没有 task.md 任务细粒度划分机制： 我很怀疑你吗没有完整的 task.md 任务逐步新增的机制。我看到你在 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask` 目录内增加了好多 markdown 文档，我很怀疑，按照 openspec 的一些列 skills 引导，这些任务细粒度的迁移内容，不应该存储到 task.md 内成为细粒度的`子任务项`么？
3. 你这边一直都是在调研迁移的完整度么？还是说你到现在都没办法确定清楚 admin 和 app 全部接口的迁移程度和可用程度么？你这 16 小时都在确定和验证么？

请你认真看看 do-long-task、和 openspec 系列的 skills，结合你的修改内容，给我一个合适的答复。我对你接近 16 个小时的产出成果很不满。

暂停现在的 goal 任务，在 `docs\reports` 目录内，给我生成一个报告，给我一个答复。

---

### 02

1. 因此，根据报告 `docs\reports\2026-05-21-openspec-longtask-pause-review.md` 的说明，我们的`openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 任务文件，存在明显的任务权重失衡的问题。探索，排查，验证，补充证据的子任务太多了，这导致无法完成真实有效的 nitro 接口迁移推进。请你适当的缩减，合并，调整关于这些探索验证的子任务权重。尽快将真实的 nitro 迁移改造任务，调整其优先级。

2. 根据报告要求，我要求你同时扫描全局的 `do-long-task` 和 `openspec` 这两款全局技能，对 `do-long-task` 增加需要协作的全局技能 `openspec` 。对 `openspec` 和 `do-long-task` 两款技能增加动态增加补全 task.md 任务进度的机制。
   - 注意，我不允许你直接修改全局文件，而是看 `D:\code\ruan-cat\monorepo\ai-plugins` 目录提供的技能，阅读技能，理解技能，然后在本项目的 docs\reports 内给出一个增强 `openspec` 和 `do-long-task` 两款技能的实施文档。我会按照其他的 AI 按照文档，增强 `openspec` 和 `do-long-task` 这两款技能。最后确保这两个技能未来拥有动态 task.md 任务增加能力。

3. 按照 `docs\reports\2026-05-21-openspec-longtask-pause-review.md` 的建议要求，适当改写 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 的文件层级，用你给出的这个 `纠偏建议` 来改进，优化 `openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md` 文档。

### 03 2026-5-25 AI 阶段性中断报告 <!-- 已发送指令并推进进度 -->

BLOCKED：已按长任务停止条件收尾。当前 tasks.md 还剩 22 个未完成 checkbox，主要被生产 DB_READY、真实库样本、写入授权/R2 前置、全量页面 Network、以及 task815 全局 fallback/shadow-off drill 阻断。

本轮新增阻断复核证据：`.tmp/phase7-dev-browser/2026-05-25-remaining-blockers-ready-fallback-crud-review.md`，并已挂接到：

- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md`

生产 https://01s-11-server.ruan-cat.com/__nitro/ready 当前仍是 `READY_CONFIGURED`、`probeEnabled=false`、`connected=null`，所以不能把任何生产真实库或退役证据升级为完成。

已完成校验：

- openspec validate migrate-superpowers-docs-to-openspec-longtask --strict 通
  过
- git diff --check 通过
- git diff --cached --check 通过
- 触达文档中文行门禁通过
- 已写入 Memorix：#4675
- 本轮新开的 4 个只读子代理都已关闭

需要用户介入的最小前置：

1. 允许通过 commit/push 或其他方式触发生产重新部署，并为 API 生产环境启用 main 分支连接串与 `RUN_PHASE7_DB_READINESS_CHECK=1`。
2. 明确是否授权受控生产写入窗口，用于 CUD 的 write/read-back/rollback/residual check。
3. 提供或确认 R2 env、AWS SDK/R2 client、upload session repository 与前端断点续传闭环方案。
4. task815 还需要新增专门的 fallback/shadow-off drill，证明 fallback 不可用时 exact handler 仍由 apps/api 承接。
