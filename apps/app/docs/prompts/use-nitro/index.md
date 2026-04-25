<!--
  以完成改造接入，现在是 mock + nitro 的双架构，nitro本质上是mock接口数据
  继续执行 openspec add-nitro-api-runtime 任务
  继续迭代 docs\plan\2026-03-28-add-nitro-api-runtime.md 计划文件；

  2026-03-29 更新：add-nitro-api-runtime 已从历史 worktree 全量回填到当前 dev 主工作区，后续继续推进时不要再回到 .worktrees/add-nitro-api-runtime。
-->

# 使用 nitro 接口作为真实的接口

## 核心需求与痛点

在本地开发微信小程序时，是无法使用 mock 接口的数据的。直接报错。因为不是 H5，所以 vite 没办法提供开发环境的 mock 接口。

我的解决方案是提供 nitro 接口。未来我会考虑实现 nitro 接口对接 neon 数据库，但是数据可能对不上，很乱，我暂时不考虑对接真实的 neon 数据库。但是你要注意，我迟早会对接 neon 数据库的。

你需要设计一个兼容性的接口方案，在当前情况下，确保你编写的接口 mock 函数，不仅仅可以在 nitro 环境内使用，而且还可以在 vite-plugin-mock-dev-server 场景下继续使用。

### 实现范畴细节： 设计两个针对 h5 环境的启动命令

1. 一个 h5 环境启动时，仍旧使用 vite-plugin-mock-dev-server 来完成本地模拟接口。
2. 另一个 h5 环境启动时，用的是 nitro v3 提供的全栈模式本地真实接口。

你要设计合适的区别命令，利用 vite 的 mode 模式，实现区分使用这两个插件。按理说，我希望 vite-plugin-mock-dev-server 和 nitro 这两款 vite 插件，未来要实现根据启动命令参数的不同，完成动态加载。

### 实现范畴细节： nitro 设计专门的，独立的 nitro 启动命令和 build 构建命令

nitro v3 版本下，nitro 不仅仅可以作为一个 vite 插件附属使用，而且还是可以继续以独立的 nitro 命令，独立本地启动一个非全栈的，纯独立的 nitro 接口服务。因为未来我要实现独立部署一个 nitro 接口。

必须要考虑，并独立部署一个完善的 nitro 接口服务，因为在生产环境情况下，我们项目就依赖于 nitro 的独立生产环境服务了。

### 实现范畴细节： 微型小程序的 dev 开发入口需要先启动本地的纯 nitro 接口服务

你必须要先启动纯 nitro 本地接口服务，我们才能在微信小程序内，完成开发。做好命令启动的串行配置。

## 深度探究的难点重点

你需要很深刻的去搞清楚，本项目的 `vite-plugin-mock-dev-server` 是怎么使用的，并且去看清楚本项目对应相关的 skills 是怎么写的。避免出现误导，理解不深刻的情况。

其次，你需要深刻理解 nitro v3 接口是怎么组织起来的。

最后，找到一个方式，确保原本 `vite-plugin-mock-dev-server` 的代码可以无痛的直接变成正式的 nitro 接口。

## 设计一个完善完整的迁移改造计划

这是一个非常庞大的改造计划，我要求你先使用 `brainstorming` 技能实现探索，思考，和我沟通并明确细节。生成 plan 计划之后，再把这个 plan 计划消化掉，在全局技能 `openspec` 的指导下，根据全局技能 `nitro-api-development` 的 nitro 实施规划，最后使用 `openspec-new-change` 技能，新建一个一揽子的，全面的可落地的改造计划。

## 技术约束： 技术栈

nitro v3

注意我们使用的是 nitro v3 版本，不是其他的版本。

## 上下文： nitro 接口参考项目

你有具体的，可以参考的项目来模仿学习 nitro 接口，nitro 插件接入的全面知识。认真阅读 `D:\code\github-desktop-store\01s-11comm\apps\admin` 目录的 nitro 接口实现。这是很重要的参考资料，将指导你如何新建 nitro 接口，如何组织目录和 nitro 配置，如何在 vite 内接入。这是你在 H5 混合全栈配置的重要参考。

务必投入大量的时间和 token 预算，全面调研，学习这个项目的 nitro 接入做法。

## 关于 git worktree 的阶段性说明

这条要求已经在首轮实施时执行完成：相关改造最初确实在独立 worktree 中隔离落地。

截至 `2026-03-29`，全部实现已经回填到当前 `dev` 主工作区，后续继续执行 `add-nitro-api-runtime` 时，应直接在主工作区推进，不要再把 `.worktrees/add-nitro-api-runtime` 当作持续开发位置。

---

## 001 <!-- 2026-3-29 已完成 --> 补全更新 README 文档

补全更新 README 文档，说明清楚项目启动时使用的运行命令，以及 nitro 接口的使用情况，说明这个巨大的变更设计。

## 002 <!-- 2026-3-29 已完成 --> 解决在 `dev:h5:nitro` 的情况下，开发环境接口出现跨域的情况

我们现在使用了 nitro 接口来实现页面的接口请求，但是出现了跨域错误：

![2026-03-28-23-46-01](https://gh-img-store.ruan-cat.com/img/2026-03-28-23-46-01.png)

比如请求接口 `http://127.0.0.1:3101/app/dict.queryRepairStates` 出现跨域问题。

我需要你处理这个本地端口不一致而导致的前端开发跨域问题。

相关的 log 如下：

> 说明：下面日志里的 `.worktrees/add-nitro-api-runtime` 路径来自历史 worktree 联调现场，只用于保留当时的报错上下文；当前继续开发时，应把它理解为主工作区生成的 `.nitro/dev/index.mjs`，不要再据此回到旧 worktree。

```log
 ERROR  [request error] [OPTIONS] http://127.0.0.1:3101/app/ownerRepair.listOwnerRepairs?page=1&row=15&statusCd=&storeId=STORE_001&userId=USER_001&communityId=COMM_001&repairName=&reqSource=mobile


ℹ HTTPError: Endpoint not found: OPTIONS /app/ownerRepair.listOwnerRepairs

 ⁃ at dispatchEndpoint (D:/code/github-desktop-store/001-Smart-Community__nwt-q/.worktrees/add-nitro-api-runtime/node_modules/.nitro/dev/index.mjs:175:17)

   170 ┃  }
   171 ┃  /** 分发共享 endpoint 请求 */
   172 ┃  async function dispatchEndpoint(registry, input) {
   173 ┃        const definition = findEndpointDefinition(registry, input.method, input.path);
   174 ┃        if (!definition) {
 ❯ 175 ┃                const error = new Error(Endpoint not found: ${input.method} ${input.path});
   176 ┃                error.statusCode = 404;
   177 ┃                throw error;
   178 ┃        }
   179 ┃        const query = input.query || {};
   180 ┃        const body = input.body || {};

 ⁃ (D:/code/github-desktop-store/001-Smart-Community__nwt-q/.worktrees/add-nitro-api-runtime/node_modules/.nitro/dev/index.mjs:2780:15)
 ⁃ at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

[CAUSE]
Error {
  stack: 'Endpoint not found: OPTIONS /app/ownerRepair.listOwnerRepairs\n' +
  'at dispatchEndpoint (D:/code/github-desktop-store/001-Smart-Community__nwt-q/.worktrees/add-nitro-api-runtime/node_modules/.nitro/dev/index.mjs:175:17)\n'
+
  'at D:/code/github-desktop-store/001-Smart-Community__nwt-q/.worktrees/add-nitro-api-runtime/node_modules/.nitro/dev/index.mjs:2780:15)\n' +
  '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)',
  message: 'Endpoint not found: OPTIONS /app/ownerRepair.listOwnerRepairs',
  statusCode: 404,
}
```

### 任务处理要求

1. 不需要你运行本地。本地 nitro + h5 场景已经由我亲自启动，不需要你启动，除非失败。你就 `D:\code\github-desktop-store\001-Smart-Community__nwt-q\package.json` 的 `dev:h5:nitro` 命令来启动。
2. 主动使用谷歌浏览器 MCP 来本地联调。

## 003 <!-- 已完成 --> 全面推进 openspec add-nitro-api-runtime 任务

经过试点验证，可以得知项目目前完成了真实有效的 nitro 接口接入，在报修模块上，这些接口都是真实有效的。效果很好。我需要你继续拓展推进下去，全面完成 nitro 接口的开发。确保全部的 mock 接口，都能够有对应的真实 nitro 接口。

1. 阅读 `docs\plan\2026-03-28-add-nitro-api-runtime.md` 计划。
2. 阅读 `openspec\changes\add-nitro-api-runtime` 目录下面的全部内容。
3. 参考现在已经成功实现改造的接口，继续推广下去，全面实现改造。

---

### 对 openspec 使用效果的自主反思： 在高级模型的效果面前，反而成为心智负担累赘

实际情况是，这个 `add-nitro-api-runtime` 任务在 codex 内效果很不好，还不如直接执行，落地 `docs\plan\2026-03-28-add-nitro-api-runtime.md` 计划。superpower + codex 模型本身足够好了。这大幅度消极了 openspec 重上下文工作流的优势，以后需要重新评估 openspec 的实用性了。openspec 多次表现出工件不齐全导致误导的情况了。

不是提效工具，反而是累赘了。

---

## 004 <!-- 2026-03-30 已完成 --> 全面改造落后的 skills 文档，记录清楚如何编写 nitro 接口和本地 mock 接口

我们重构了全部的 mock 接口，改写成 nitro 接口，并且从 server 目录内分发了基于 endpoints 和 repository 架构的代码入口和存储的模拟数据。

但是我们的 api-error-handling 和 api-migration 这两款 skill，明显跟不上了，内容明显脱节。需要迭代更新。说明清楚在新的场景内，如何编写 API 接口。

另外，还需要你全局的查看，那些 mock 接口写法存在过时的误导。也一同地完成更改。

2026-03-30 更新结果：

1. `api-migration` 与 `api-error-handling` 已改写为当前仓库真实架构：`src/api/*.ts` + `server/modules/*/{repository,endpoints}.ts` + `src/api/mock/*.mock.ts` 薄包装层。
2. `api-migration/references/*` 已同步更新，不再继续教授“把数据库对象和业务逻辑直接写进 `*.mock.ts`”的旧模式。
3. `src/api/mock/README.md`、`README.md` 及相关引用文档已补充当前双运行时约定。

## 005 <!-- 已完成 --> 增加接口根地址的输出接口

nitro 接口的生产环境，现在 `https://01s-11-app-server.ruan-cat.com/` 直接访问是没有任何结果的。我希望实现一个 get 请求，默认访问根地址时，可以实现将本项目全部的 mock 接口地址，全部的 url 地址信息，全部列举出来。相当于一个文档列表一样。
