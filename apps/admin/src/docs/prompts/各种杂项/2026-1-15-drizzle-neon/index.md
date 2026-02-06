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

### 01 更改 link 的过程，修改脚本

我不认可你在 `apps\admin\scripts\env-pull.ts` 内实现 link 的做法。我希望你通过运行 `vercel link` 命令的方式完成项目链接，并不需要你手动的去新建文件。这不是你的职责。

link 时，请注意使用 token 和 project 项目名称。

## 003 设计专用的前缀变量，重设 admin 项目使用

1. apps\admin\package.json 的 `env:pull` ，即 `apps\admin\scripts\env-pull.ts` 的 `const envFilePath = resolve(adminDir, ".env");` ，改成存储在特定专用的 vercel 命名风格的环境变量文件名称。命名为 `.env.vercel.local` 。我不希望这个 `apps\admin\.env` 子包的文件被覆盖掉。
2. 在 `apps\admin\.gitignore` 内，作为子包的忽略文件，确保你忽略掉特定拉取的环境变量文件。其他的环境变量文件正常保留，在子包内，确保 `.env.vercel.local` 这个从 vercel 内获取的 neon 环境变量文件，会被忽略掉。
3. 确保 `apps\admin\.gitignore` 内补全了合适的说明注释。
4. 注意阅读以下环境变量例子：

```bash
comm_admin_11__DATABASE_URL="xxx"
comm_admin_11__DATABASE_URL_UNPOOLED="xxx"
comm_admin_11__NEON_AUTH_BASE_URL="xxx"
comm_admin_11__NEON_PROJECT_ID="xxx"
```

5. 现在，你从 vercel 获取的环境变量，都会带有 `comm_admin_11_` 前缀。请你在 `apps\admin\.env` admin 项目的项目级别环境变量内，设置一个环境变量，专门存储这个写死的前缀字符串。并且在该`前缀环境变量`增加注释，重点说明该变量在 `https://vercel.com/ruancat-projects/~/integrations/neon/icfg_aFCpQJZiS9sXcBJfKSgHG3ZR/resources/storage/store_1hsWrjTtdSHtwdJQ/projects` url 内设置并维护。
6. 在 admin 项目内，编写一个通用工具函数，从 `apps\admin\.env` 获取环境变量，先获取 `前缀环境变量` 的 `comm_admin_11_` 前缀，再获取来自 `.env.vercel.local` 环境变量的 neon 数据库字段。注意实现字段名的拼接，实现从 `.env.vercel.local` 内获取正确命名的环境变量。
7. 模仿 `tests\vercel-env.test.ts` 的内容，也在 admin 项目内，编写一个测试用例，测试获取环境变量。允许测试的环境变量为 `comm_admin_11__PGDATABASE="neondb"` ，测试是否能读取字符串 `neondb` 即可。
8. 确保你编写的 admin 专用的 `tests\vercel-env.test.ts` 测试用例，能够被 `apps\admin\package.json` 的 vitest 识别到。能够被 test 命令使用并测试到。
9. 在本项目全局查询 `DATABASE_URL` 字符串。admin 项目更改对 DATABASE_URL 环境变量的使用。并且去更改其他关于 neon 环境变量的使用。环境变量的命名规则改了，增加了前缀。请改成使用你编写的环境变量获取函数来完成。
10. 最后，在 `apps\admin\src\docs\env-setup` 目录内，专门新建一个文档，说明清楚 admin 项目时如何获取来自 vercel 环境变量的，有哪些细节。目的是为了让其他人能够快速看懂，快速上手这部分的逻辑。

## 004 初始化 neon 数据库的数据库表字段定义 `init-neon-db-schema`

1. 目前，`apps\admin\server\db\schema.ts` 是空的。因此 admin 项目的 package.json 的 `db:generate` 命令无法使用。因为没有具体的表设置，所以无法生成数据库迁移 sql。
2. 我需要你全面的阅读全部类型项目内出现的文件。了解清楚涉及到的业务类型有哪些。
3. 你需要全面的阅读 `apps\admin\server\api` 内出现的 nitro 接口，了解清楚涉及到那些数据内容。
4. 根据你阅读的内容，在 `apps\admin\server\db` 目录内，设计，并新建数据库表。做好扁平化的文件拆分。避免出现单个过长的 `apps\admin\server\db\schema.ts` 文件。
5. 这是一个上下文繁重的任务，文件非常多，但是迁移改造难度简单的任务。请你适当的使用 MCP 或者是 skills 技能，使用和 gemini 相关的工具或技能，辅助你完成大量上下文的阅读任务。
6. 这是一个多文件任务，请你设计多个并行运行的子代理，批量的，高效率完成代码修改任务。

请你适当的使用 gemini 相关的 MCP 或者是 skills 技能，完成多文件的阅读，与归纳整理

### 01 检查任务并自我复查是否有缺漏缺省的内容

请你仔细检查一下，是否有缺漏的模块没有新建 `apps\admin\server\db\schemas` 数据库表字段设计。

为 openspec 的 `init-neon-db-schema` 任务，重新检查，完成全部类型项目、nitro 接口涉及到的全部模块的表设计。

重新制作完整的，完善的，细致的 `openspec\changes\init-neon-db-schema\tasks.md` 任务清单列表。确保你没有出现模块缺漏。确保全部 nitro 对应接口的模块，都有完整的数据库表设计。

### 02 列举说明清楚 schema 目录内全部的数据库表，便于查询了解

现在 `apps\admin\server\db\schemas` 目录内有很多数据库表。我也能在 neon 内看到这些新建的数据库表了，但是我直接去阅读 neon 时，看到那么多表名，还是搞不清这些表。

1. 新建本地技能 `neon-db-list` ： 请你帮我新建一个本地级别的 skills 技能，这个技能本质上就是一个清单表，全部数据库表名的清单表。在 `.claude\skills\neon-db-list` 内新建这款技能。
   - 新建技能时，请务必满足 skills 的要求。请你使用全局提供的 `skill-creator` 技能，来新建这款本地项目级别的技能 `neon-db-list` 。
2. 更新 `CLAUDE.md` 文件，说明清楚，只要在 `apps\admin\server\db\schemas` 目录内，增加新的数据库表，或者是数据库表改名了，删除数据库表了。都需要主动去更新 `.claude\skills\neon-db-list` 的清单。为 `CLAUDE.md` 文件增加这款行为规范。

### 03 增加类型项目内的字段，是否要同步去增加 schema 目录内数据库表字段？

在类型项目内，最近的提交内，有很多文件的类型拓展了。增加了很多字段。请问对于 `init-neon-db-schema` 任务而言，是否要继续同步增加表字段？

请你阅读 `openspec\specs` 内关于 `init-neon-db-schema` 任务的内容。并为我分析问题。

## 005 排查 `openspec\specs` 存在的潜在冲突与风险内容

请你帮我分析全部的 `openspec\specs` 的规范，看看这些规范是不是有相互冲突的？

我准备实现有意义的接口了。实现真正的 nitro + drizzle 的后端接口。帮我仔细分析以下，历史的 `openspec\specs` 规范内，是不是会有和编写实际后端接口相悖的内容？

如果有，请你编写一份完整详细的报告，并告诉我如何实现旧规范前提下的迁移改造，实现真正的 nitro + drizzle 的后端接口。

### 01

1. 请你把对 openspec\specs\nitro-api\spec.md 的修改，迁移到 `.claude\skills\use-nitro` 内，迁移 openspec\specs\nitro-api\spec.md 的能力。让现在的 `.claude\skills\use-nitro` 学会如何用真实的 neon + drizzle 实现真正的接口请求。而不是使用 mock 假数据。
2. 让 `use-nitro` 项目级别技能，参考 `apps\admin\src\docs\reports\2026-02-03-nitro-drizzle-migration-report.md` 报告，学会具体的 mock 假数据迁移成真数据的实施方案。未来实现 mock 接口代码改写成 neon 真实数据时，其更改操作规范就是由 `use-nitro` 来提供的。
3. 回退 `openspec\specs\nitro-api` 的写法。在你确保已经将相关的核心技能，核心的写法迁移整合到 `use-nitro` 项目级别技能之后，再开始回退`openspec\specs\nitro-api` 目录的规范写法。
4. 文件夹目录改名，改成 `openspec\specs\nitro-api-with-mock`。
5. 对 `openspec\specs\nitro-api-with-mock\spec.md` 这个文件增加说明注释，说明这是基于 nitro + 本地 mock 数据的编码规范。在此处仅仅作为归档记录，不作为有效规范。

### 02

请你恰当的拆分文件，说明清楚在 mock 模式下，和 neon 真实情况下 nitro 接口应该如何编写。

现在你的做法是完全覆盖掉了关于 mock 模式下的知识点。我希望你保留关于 mock + nitro 的编写技能。同时保留关于 mock 和 neon 真实数据库的 nitro 接口编写能力。

并且提供清晰的，mock 接口写法迁移成 neon 数据库接口的写法。

## 006 分析 nitro 假数据并编写 neon 数据库插入脚本 `analyze-mock-data-and-create-db-seed`

我们项目目前没有有意义的 `server/db/seed.ts` 文件，所以"db:seed"命令是无法运行的。

1. 请你阅读 `https://github.com/ruan-cat/learn-nitro-starter-with-vercel/blob/dev/server/db/seed.ts` 代码，了解清楚为了实现有意义的数据库写入，需要怎么编写代码。
2. 请你全面的阅读清楚 `apps\admin\server\api` 内的全部 `mock-data.ts` 文件，思考如何服用这些数据，使得你可以实现有意义的 `server/db/seed.ts` ，最终实现对 neon 数据库的批量写入功能。我期望能够运行 `db:seed` 命令，对数据库表实现一次全量的数据预备。数据库存储一大堆数据。
3. 这是一个简单，但是文件数量巨大的任务。请你务必使用和 gemini 相关的技能或 MCP，帮助你检索文件。帮助你探索文件。
4. 我希望最后的 `server/db/seed.ts` 文件，实现了有意义的模块导入和代码分治。

### 01 更新 `apps\admin\README.md` 文档

openspec 的 `analyze-mock-data-and-create-db-seed` 任务，增加了新的 package.json 命令，请你及时更新 `apps\admin\README.md` 文档，更新对命令的说明文档，避免出现误导和混乱。为 `db:generate-seed` 和 `db:seed` 命令编写文档。

请你阅读 `apps\admin\src\docs\reports\2026-02-03-analyze-mock-data-and-create-db-seed-inspection.md` 报告，将更新的新命令，整理内容，并编写专门的文档。在 `apps\admin\src\docs` 内新建专门的文档，说明清楚如何正确使用 `db:generate-seed` 和 `db:seed` 命令。

### 02 继续执行 `analyze-mock-data-and-create-db-seed` 任务

现在数据库表增加了新的表，需要你为这个数据库表增加新的 seed 种子数据。

### 03 处理 `apps\admin\server\db\seed-sql` 内文件出现的类型报错，并评估 `analyze-mock-data-and-create-db-seed` 任务是否已经完整的执行完成了

请你帮我评估一下，目录 `apps\admin\server\db\seed-sql` 内文件，其导入的模块，是否都是有意义的？我看到有些模块导入进来但是没有使用。这让我非常怀疑 `analyze-mock-data-and-create-db-seed` 任务是否已经完整的执行完成了？还是说这个任务执行的有欠缺？不完整？

如果不完整，有欠缺。请你及时更新 openspec 的 `analyze-mock-data-and-create-db-seed` 任务对应的 `tasks.md` 文件，补充完善。

随后，开始处理 `apps\admin\server\db\seed-sql` 内文件出现的类型报错。我不希望看到这些种子生成脚本内，出现任何类型报错。必须是完全正确的代码。

## 007 评估类型项目改造报告，并生成一份完整的全栈类型改造评估报告

1. 请你完整的阅读 `apps\admin\src\docs\reports\2026-02-05-gemini-zod.md` 报告。
2. 请你评估一下，为了实现全栈化的，统一类型来源的代码改造，这样的破坏性变更。需要对类型项目做怎么样的改造？
3. 需要安装那些和 drizzle 相关的依赖？需要安装 zod tRPC 之类的全栈类型统一库么？
4. 数据库表 schemas ，需要增加那些内容？需要怎么使用上述的包，才能暴露出来自数据库表生成出来的业务类型？
5. 来自 schema 表字段定义文件生成的全栈业务类型，该怎么组织封装到现在的类型项目内？
6. 目前的类型项目要怎么完成改造，才能避免出现严重的破坏？
7. 来自 schema 生成的业务类型，要怎么给 nitro 全栈接口使用？
8. 改造后的类型项目，要怎么确保前端的类型使用不会出现故障？

请你深度的检索，思考，评判，并给我出具一份非常长的，详细的报告。帮助我了解全貌。

---

有效产出文档如下：

- apps\admin\src\docs\reports\2026-02-05-trpc-vs-shared-schema-analysis.md
- apps\admin\src\docs\reports\2026-02-05-full-stack-type-transformation-assessment.md
- apps\admin\src\docs\reports\2026-02-06-full-stack-type-transformation-assessment.md

### 01 检查报告之间的内容潜在冲突校验

请你帮我阅读以下这几款报告文档，并深度思考，这些报告之间是否存在冲突，这些报告介绍的基于类型项目的全栈改造方案，是否有彼此冲突的地方？

- `apps\admin\src\docs\reports\2026-02-05-gemini-zod.md`
- `apps\admin\src\docs\reports\2026-02-05-trpc-vs-shared-schema-analysis.md`
- `apps\admin\src\docs\reports\2026-02-05-full-stack-type-transformation-assessment.md`
- `apps\admin\src\docs\reports\2026-02-06-full-stack-type-transformation-assessment.md`

## 008 <!-- TODO: 长任务 未完成 --> 面向全栈项目，重构类型项目 `full-stack-type-transformation`

对应 openspec 任务 `full-stack-type-transformation` 。

### 001 拓展非常详细清晰的 `full-stack-type-transformation` 任务

针对目录 `openspec\changes\full-stack-type-transformation` 的 openspec 任务。

我认为现在的规范，和具体的实施细节，写的太简单了，不够详细。具体的操作细节存在失真。要求你重新审阅 `full-stack-type-transformation` 的全部文件，补全具体的操作规范和实施细节。

该任务本质上是参考以下文档实现的。目前的 `full-stack-type-transformation` 任务没有完整的，完善的，齐全的以 openspec 实施规范，完整的记录以下报告的实施方案。

- `apps\admin\src\docs\reports\2026-02-05-gemini-zod.md`
- `apps\admin\src\docs\reports\2026-02-05-trpc-vs-shared-schema-analysis.md`
- `apps\admin\src\docs\reports\2026-02-05-full-stack-type-transformation-assessment.md`
- `apps\admin\src\docs\reports\2026-02-06-full-stack-type-transformation-assessment.md`

### 002 <!-- TODO: --> 检查过往规范和文档对于类型项目操作规范的冲突

现在我们开始全面重构类型项目，重构成面向全栈的项目了。我相信现在的规范，肯定和 `openspec\changes\full-stack-type-transformation` 体现的规范有巨大冲突。

请你全面阅读以下文件，找到过往类型项目的操作规范，与现行的类型项目操作规范，有那些显著的冲突项。请你帮我罗列出来。

- `openspec\specs` 全部的历史 spec 文件。重点检查和类型项目相关的规范。
- `.claude\skills` 本地的 skills 规范。
- `CLAUDE.md` AI 记忆文件。

## 009 <!-- TODO: 一次性 长任务 未完成 --> 完成 nitro 接口改写

我需要你完成一次重大的代码写法改造改写任务。

现在
