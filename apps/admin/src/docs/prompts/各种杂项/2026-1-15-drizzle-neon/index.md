<!-- TODO: 一次性任务 未完成 -->

# 接入 drizzle 和 neon 数据库，改造项目的 nitro 接口，实现真实的后端

目前，本项目的 nitro 接口使用的是本地数据，不是来自数据库的数据。

我需要你帮我链接 neon，创建数据库。并接入 drizzle，实现对数据库的字段变更维护操作。

并帮我增加合适的 neon MCP。

## 001 从其他项目模仿 neon 的初始化配置

从 `D:\code\github-desktop-store\learn-nitro-starter-with-vercel__ruan-cat\package.json` 项目内，模仿学习，并初始化，配置本项目的 neon drizzle 配置。

1. 安装对应的依赖。
2. 配置对应的配置文件。
3. 在 admin 后台项目的 package.json 内补全关于 drizzle ORM 的命令。
4. 在 `apps\admin\README.md` 内补全对 apps\admin\package.json 命令的说明。

## 002 改造 vercel 环境变量的存储与获取方式；拓展增设 admin 项目对 env:pull 命令的使用；编写教程文档

1. 现在在 admin 项目内运行该环境变量拉取命令时，会要求先 link 现存的 vercel 项目。我希望你帮我完成改造。
2. 对 `vercel-deploy-tool.config.ts` 文件，将写死的三个 vercel 变量，存储在项目根目录的环境变量内。这三个变量可以上传到 git，在项目根目录内新建合适命名的 env 环境变量文件，并存储这三个 vercel 字符串变量。确保该文件不会被 git 忽略掉。可以正常提交。
3. 确保 vercel-deploy-tool.config.ts 文件能够使用合适的 `@dotenvx/dotenvx` 暴露出来的工具，正常的读取环境变量。写法参考 `apps\admin\drizzle.config.ts` 文件。
4. 在项目根目录，在合适的位置，新建文件夹，新建一个 vitest 测试用例，该测试用例主要用于测试能否正常获取上述三个 vercel 环境变量字符串。
5. 确保你新建的 vitest 测试用例，满足 CLAUDE.md 的要求，并且能够被根目录的 package.json 的 test 命令运行。
6. 在你完成上述的环境变量存储改造后，再开始下一个阶段的任务。
7. 这是下一个阶段的任务，请你改造并编写合适的 admin 项目的 env:pull 命令，在使用 pull 拉取环境变量时，先完成 vercel link 命令。、
   - link 命令所需的 vercel token，来自于全局环境变量。如果在 github workflow 流水线环境内，会全局提供。在本项目内，在根目录内的 `.env` 文件内存储。
   - link 所需的项目名称，已经被你改造并存储在对应的环境变量内，请使用。
   - 请你恰当的使用 `@dotenvx/dotenvx` 所提供的能力，改写命令，确保运行命令时能够获取多个不同环境变量文件的值。
8. 再完成 link 链接 vercel 项目后，再开始获取 vercel 环境变量，最终拿到 neon 数据库的敏感信息。
9. 最后，在 `apps\admin\src\docs` 目录内，新建合适文件夹，新建合适命名的 markdown 文档，说明清楚这一整套环境变量数据获取的流程，确保其他人能够快速上手理解这一套环境变量获取流程。
   - 你编写的文档是满足 vitepress 文档格式的 markdown 文档。正确的使用 index.md 命名的页面文件。

## 002 设计专用的前缀变量，重设 admin 项目使用
