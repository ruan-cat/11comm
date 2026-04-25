<!-- 本文档太长了，后续不继续编写维护了，后续在 docs\prompts\migrate-plan\01.md 内维护 -->

# 整体迁移计划、杂项提示词文档

## 001 更新，弱化接口请求的方式

请深度思考。

请你更改接口迁移计划文档。 `docs\prompts\migrate-plan\api-migration.md` 。

1. 不需要做任何鉴权功能。我不需要你增加 token 检查和鉴权的功能。全部的接口默认直接请求就能获取到数据。
2. 在你迁移接口时，请你生成合适的 typescript 类型。
3. 请你编写模拟用的假接口。接口名称和 url 路径，保持和 `旧项目` 一样的路径，但是使用的是假接口。返回写死的假数据即可。

请你按照该要求，更新接口迁移计划文档。

## 002 新建本地的 claude code agent 文件

请深度思考。

我需要你将这些迁移计划，改造成能够被 claude code 识别使用的本地 agent 文件。

1. 阅读 `docs\prompts\migrate-plan` 的迁移计划文件。
2. 将 `api-migration.md` `code-migration.md` 和 `style-migration.md` 新建为 claude code 的子代理。
3. 删除掉这三个文件，以后的迁移计划一律以 claude code 子代理的形式展示出来。
4. 恰当的更新 docs\prompts\migrate-plan\README.md 文件。

## 003 补全代理文件的 description 描述项

请深度思考。

请阅读 .claude\agents 目录下的 3 个子代理。并为最顶部的 description 部分编写简要的中文描述。

## 004 新建路由子代理

请你为我制作路由迁移功能的子代理。

1. 请先阅读 docs\prompts\make-migrate-plan.md 文档。但是你不阅读 `其他内容` 栏目下的内容。
2. 阅读 docs\prompts\migrate-plan\README.md 文档。
3. 粗略地阅读 `.claude\agents` 文件夹下面的子代理，了解子代理的格式写法。你稍后将模仿这些子代理的写法。
4. 搞清楚 `本项目` 和 `旧项目` 的路由差异，指定合适的路由迁移计划，并在 `.claude\agents` 下面制作子代理。

## 005 更新 api-migration 接口请求迁移专家 子代理

请深度思考。

我需要你更新 `api-migration` 子代理，重点更新 `2. 模拟接口实现策略` 这一部分的提示词写法。这部分的提示词写法使用了不存在的 `registerMockHandler` 函数。这不正确。

1. 请阅读 `.claude\agents\api-migration.md` 文件。**针对性**的阅读 `2. 模拟接口实现策略` 这一部分的提示词写法。不需要你全面的阅读。
2. 请阅读 `vite-plugin-mock-dev-server` 这个库。阅读 ： https://github.com/pengzhanbo/vite-plugin-mock-dev-server 这个仓库。
3. 请阅读 https://vite-plugin-mock-dev-server.netlify.app/llms.txt 文档。**请充分的**阅读关于 `vite-plugin-mock-dev-server` API 使用的文档。
4. 定义的 mock 接口，其文件格式为 `*.mock.ts` ，不是定义在 `api/mock` 这样的文件夹内。请在子代理内重点说明这个要求。
5. 按照 `vite-plugin-mock-dev-server` 的文档要求，重写基于 `vite-plugin-mock-dev-server` 的 `2. 模拟接口实现策略` 。

## 006 安装 `vite-plugin-mock-dev-server`

请深度思考。

1. 按照文档 https://vite-plugin-mock-dev-server.netlify.app/zh/guide/install 的要求，在本项目内安装该包，并在 vite 配置内配置该插件。
2. 阅读 `api-migration` 子代理的要求，安装并配置 `vite-plugin-mock-dev-server` 插件。

## 007 重构 `vite-plugin-mock-dev-server` 的目录结构

请深度思考。

目前的 mock 规则不符合我的期望，我希望你帮我更改掉目录结构。

最核心的更改： mock 文件目录从 `mock` 迁移到 `src\api\mock` 内。

1. 请你同步更改掉 `.claude\agents\api-migration.md` 文档关于此目录结构的写法。mock 文件位置改了，但是 mock 文件的格式仍旧是 `*.mock.ts` 。
2. 请阅读 https://vite-plugin-mock-dev-server.netlify.app/zh/guide/plugin-config 文档。
3. 请你同步更新 `vite.config.ts` 关于文件目录的部分，同步更改成期望的 `src\api\mock` 文件夹内。
4. 请你移动现有的 `mock` 文件，到 `src\api\mock` 内。
5. 请你及时同步更改 `src\api\mock\README.md` 文档的说明。

## 008 应用最新的 `api-migration` 子代理

请深度思考。

对 `src\api\mock` 文件夹的 mock 接口代码，应用 `api-migration` 子代理做出修改。

## 009 在 `eslint.config.mjs` 内忽略 `style/multiline-ternary` 规则

请深度思考。

在 `eslint.config.mjs` 内，为 `*.mock.ts` 格式的文件，增加规则忽略，忽略掉 `style/multiline-ternary` 规则，设置为 `off` 。

## 010 拆分业务类型

请深度思考。

请阅读 `src\types\api.ts` 和 `src\types\activity.ts` 。做好业务类型拆分。

我不希望看到全部的类型都集中在唯一一个 `src\types\api.ts` 文件内。

请你适度的做好业务类型拆分。将业务类型和公共通用的类型拆分好。

1. 将 mock 相关的类型拆分迁移到 `src\api\mock\shared` 目录内，这些类型将作为 mock 的通用工具类型。定义一个 `src\api\mock\shared\types.ts` 文件来管理这些类型。
2. 将通用类型继续保留在 `src\types\api.ts` 内。
3. 模仿 `src\types\activity.ts` 的写法，将业务类型做合理的拆分。

## 011 给 `api-migration` 子代理增加新的 mock 数据存储规则

请深度思考。

`api-migration` 子代理需要细化针对 mock 数据的存储规则。增加以下这几条规则。

- 每一个 `*.mock.ts` 单文件包含：数据库对象 + 接口定义
- 数据生成函数从 `src\api\mock\shared\mockData.ts` 导入
- 主动的使用来自 `src\types` 文件夹内拆分划分出来的业务类型。确保 mock 生成的假数据均满足业务类型。

请修改 `.claude\agents\api-migration.md` 文件。使得生成 mock 接口数据时，满足改规则。

## 012 mock 的 url 不提供明显的 `/api` 前缀

针对新建 mock 函数， `api-migration` 子代理需要增加新建 mock 函数时，其 url 地址前缀需要变更的规则。例子如下：

- 错误的 url： `/api/app/activities.updateStatus` 。
- 正确的 url： `/app/activities.updateStatus` 。

1. 在 `.claude\agents\api-migration.md` 文件内，增加该规则。确保以后使用该代理时，生成的 mock 文件的 url，不会多出额外的`/api`前缀。
2. 请你更新 `.claude\agents\api-migration.md` 文件，确保本文件内设计到的 mock 示例的 url，不包含额外的`/api`前缀。

## 013 应用 `api-migration` 子代理

请你使用 `api-migration` 子代理，对 `src\api\mock` 目录下的 `*.mock.ts` 规则的文件，使用该代理，应用该代理的规则。

1. 确保 mock 文件的 url 没有出现额外的`/api`前缀。
2. 确保 mock 文件导入了业务类型，并使用业务类型。

## 014 自定义 mock 转换器

`api-migration` 子代理定义的 mock 写法，有变化。按照以下要求更改：

1. 在 `src\api\mock\shared\utils.ts` 目录内，使用 vite-plugin-mock-dev-server 包的 `createDefineMock` 函数，定义一个 `defineUniAppMock` 函数，并对外导出。其语法请阅读： https://vite-plugin-mock-dev-server.netlify.app/zh/guide/create-define-mock 文档。
2. defineUniAppMock 函数的职责，目前仅负责实现 mock.url 的更改。增加来自环境变量的前缀即可。
3. 使用 import.meta.env.VITE_APP_PROXY_PREFIX 写法来获取环境变量的前缀。使用模板字符串来实现 url 的重新拼接。
4. 请更新 `.claude\agents\api-migration.md` 文件，我们定义 mock 接口文件时，不再直接使用 vite-plugin-mock-dev-server 提供的 `defineMock` 函数，而是使用 `src\api\mock\shared\utils.ts` 导出的 `defineUniAppMock` 函数。请更改 `api-migration` 子代理，更新该规则。
5. 更新 `api-migration` 子代理涉及到的代码示例。更新示例换成 `defineUniAppMock` 函数。

## 015 应用 `api-migration` 子代理，更新 `defineMock` 函数为 `defineUniAppMock` 函数

请你使用 `api-migration` 子代理，对 `src\api\mock` 目录下的 `*.mock.ts` 规则的文件，使用该代理，应用该代理的规则。

1. 更新 `defineMock` 函数为 `defineUniAppMock` 函数。

## 015 设计 `component-migration` 组件迁移子代理

请深度思考。

我需要你帮我设计出一个全新的子代理，名为 `component-migration` ，帮助我实现 `本项目` 和 `旧项目` 之间的组件的迁移，编写一个通用的子代理。

最终实现 ColorUI + uni-app 内置组件迁移成 wot-design-uni 组件库。

1. 简单的，粗略的阅读 `.claude\agents\style-migration.md` 文件，明确子代理的写法格式。
2. 全面的阅读 `gitee-example/components/**/*.vue` 和 `gitee-example/pages/**/*.vue` 的 vue 组件，只针对性的阅读 vue 组件的使用情况。搞清楚 `旧项目` 使用了那些旧组件。
3. 全面的阅读 https://wot-ui.cn/ 所提供的组件库列表。搞清楚有哪些组件可以使用，那些组合式 api 可以使用，可以用于替换旧组件。
4. 在 `component-migration` 子代理内，请绘制一个 markdown 格式的 table 表格，罗列出预期被迁移改造的`旧组件`，和改造替换后的`新组件`。制作一个总览性质的表格，便于我整体性的阅读。
5. `component-migration` 子代理是具体实现组件迁移的子代理，不应该包含任何迁移进度的报告。
6. 预期新建一个 `.claude\agents\component-migration.md` 文件。和其他子代理保持相同的文件目录。
7. 在 `docs\prompts\migrate-plan\README.md` 内同步补充说明 `component-migration` 代理的相关信息。

## 016 美化 `component-migration` 文档格式

阅读 `.claude\agents\component-migration.md` 文件。

将该 markdown 文档涉及到的 table 表格，改成每一列居中对齐的效果。使用 markdown 的表格语法实现表格列居中对齐。

仅需要阅读并修改表格即可。

## 017 更新 `component-migration` 子代理

1. 请阅读 https://wot-ui.cn/component/img.html 文档。
2. 针对 `component-migration` 子代理，在迁移原生 `<image>` 组件时，换成 `wd-img` 智能图片组件。请在 `component-migration` 子代理内，增加该项作为迁移要求。请不要使用不存在的 `<wd-image>` 组件，而是 `<wd-img>` 组件。
3. 更新 `.claude\agents\component-migration.md` 文件。

## 018 更新 `api-migration` 子代理

请深度思考。

1. 请阅读 `.claude\agents\api-migration.md` 文档。
2. 数据生成导入的规则，改了。我**不希望**所有数据生成函数必须从 `src/api/mock/shared/mockData.ts` 导入，这很容易导致该文件冗余，膨胀。
3. 请你更新子代理的核心规则，要求在生成 `*.mock.ts` mock 接口数据时，数据直接写在具体的 `*.mock.ts` 模拟接口内。既然每个 `*.mock.ts` 文件必须包含**数据库对象**，那么我希望具体的模拟业务数据可以存储在你设计的**数据库对象**内。请思考并理解该要求，更新 `api-migration` 子代理文档。

## 019 为 `component-migration` 子代理增加关于 `<wd-status-tip>` 组件的使用情况

首先，我需要你**全面的**、**有策略的**阅读满足一下 glob 匹配的文件。

你仅仅阅读关于空占位符，默认留空的代码实现。

- `gitee-example\components\**\*.vue`
- `gitee-example\pages\**\*.vue`

请深度思考。

1. 思考在 `gitee-example` 这个旧项目内，是如何实现空占位符的？如果接口请求没有数据时，在 vue 页面内是如何展示的？
2. 思考如何使用 `<wd-status-tip>` 组件的 api 实现替换。我的核心需求是实现项目写法迁移。

然后请你按照以下步骤和要求修改代理文件：

1. 请阅读 https://wot-ui.cn/component/status-tip.html 文档。
2. 针对 `component-migration` 子代理，在实现空状态的时候，请使用 `<wd-status-tip>` 组件。
3. 请不要使用不存在的 `<wd-empty>` 组件，而是 `<wd-status-tip>` 组件。
4. 更新 `.claude\agents\component-migration.md` 文件。重点说明该子代理要在何种情况下使用 `<wd-status-tip>` 组件，并完成组件迁移。

## 020 迁移补全 `style-migration` 子代理

1. 请完整阅读以下文件：

- `docs\style-migration\guide.md`
- `docs\style-migration\addressList-migration.md`

2. 完整阅读 `.claude\agents\style-migration.md` 文件。
3. 我需要你实现样式迁移，请你认真**思考**如何从 ColorUI 迁移到 UnoCSS + wot-design-uni 样式系统。
4. 将 `docs\style-migration\guide.md` 和 `docs\style-migration\addressList-migration.md` 的内容迁移整合到 `style-migration` 子代理内。并让 `style-migration` 子代理知道如何实现具体的样式类迁移规则。明确清楚完整的样式映射规则。
5. 对 `style-migration` 子代理文件做 markdown 表格的格式化，其 table 表格改成**居中对齐**格式。
6. 最后删除掉 `docs\style-migration` 目录内全部的 markdown 文件，我希望集合整合全部关于样式迁移的内容到 `.claude\agents\style-migration.md` 文件内，即 `style-migration` 子代理内。

## 021 uno.config.ts 应用 `style-migration` 子代理

对 `uno.config.ts` 应用 `style-migration` 子代理，确保该配置文件遵循 `style-migration` 子代理的指导原则。

请深度思考。思考如何发挥 `uno.config.ts` 的优势，实现更加完整的样式迁移配置？

## 022 补全完整的路由映射表

1. 请全面的阅读 `gitee-example\pages` 内的全部 `*.vue` 文件。阅读全部的页面文件。
2. 有策略的阅读，你只需要阅读文件的名称，文件路径即可。不需要阅读文件内容本身。避免消耗过多的 token。
3. 根据文件的路径名称，结合现有的 `route-migration` 路由迁移子代理文件，补全针对 `gitee-example\pages` 旧项目的页面路由迁移清单表。
4. 请认真**思考**其路由地址映射关系。确保未来每次使用 `route-migration` 子代理时，迁移来自 `gitee-example\pages\**\*.vue` 的页面时，都能够从 `route-migration` 子代理内找到对应的路径，并知道如何新建对应的新路径。并在 `src\pages` 内新建新页面。

## 023 更新 `route-migration` 子代理

请深度思考。

1. 阅读 `Vue2 到 Vue3 uni-app 路由迁移映射表` 和 `route-migration` 文件。
2. 更新 `route-migration` 子代理，告诉子代理，以后实现路由迁移时，请严格遵照 `Vue2 到 Vue3 uni-app 路由迁移映射表` 。我希望以后使用 `route-migration` 子代理时，子代理能够主动的阅读并使用 `Vue2 到 Vue3 uni-app 路由迁移映射表` 的路由地址，实现正确的路由迁移。
3. 更新 `route-migration` 子代理的文档，将 `主要业务模块路由映射` 这一部分换成主动阅读 `Vue2 到 Vue3 uni-app 路由迁移映射表` 文件。
4. 请你认真思考，请你以 `Vue2 到 Vue3 uni-app 路由迁移映射表` 为中心，重新优化 `route-migration` 子代理，以便于更好的实现路由迁移任务。请思考不要删掉原来有的路由迁移逻辑。
5. 请你以 `Vue2 到 Vue3 uni-app 路由迁移映射表` 为待办记录的方向做思考，每当完成一个路由地址迁移时，该文件就应该作为进度表，适当的、及时的更新进度表。
6. `route-migration` 子代理应该作为实施方，作为指导原则，不应该包含任何进度表。

## 024 增加严格的无需登录原则

在实现 `旧项目` 迁移到 `本项目` 的代码迁移时，请确保子代理遵循 `CLAUDE.md` 提及的**无需登录和路由鉴权**的原则。

1. 修改 `route-migration` 子代理。确保路由子代理不做任何鉴权，任何路由都可以轻松跳转。只考虑路由跳转的类型，和参数获取。
2. 修改 `api-migration` 子代理。确保 api 子代理不处理任何登录逻辑，token 获取与使用逻辑，任何业务接口都是 mock 模拟接口。

## 025 应用 `route-migration` 子代理更新目录结构，检查路由函数

1. 阅读 activity 和 addressList 页面。即 `src\pages\activity\*.vue` 和 `src\pages\addressList\*.vue` 的组件。
2. 主动运行并使用 `route-migration` 子代理，并认真思考，检查他们是否满足 `route-migration` 子代理的目录结构要求？如果不满足，请移动调整文件的目录结构。
3. 运行 `route-migration` 子代理，检查 `src\router` 目录下的 ts 文件，并认真思考这些 ts 文件，是否能满足子代理的路由跳转功能？是否满足强类型推断要求？

## 026 删减，移除多余的 routes.enhanced.ts 文件

请深度思考。

我不喜欢看到你新建了多余的 `routes.enhanced.ts` 文件，请你阅读该文件，并将内部的类型、和满足类型安全的跳转函数，拆分到其他文件内。

我希望你先阅读以下的文件，然后将 `routes.enhanced.ts` 的内容拆分到以下部分内：

- `src\router` 目录下的 ts 文件。
- `src\types\routes.ts` 类型安全的 路由系统类型定义 文件。

最终，我预期希望看到 `routes.enhanced.ts` 文件的内容被迁移到其他文件内。且该文件被删除。

## 027 删减迁移 navigation.ts 文件

和 `routes.enhanced.ts` 的处理方式一样，请迁移删减掉 `src\utils\navigation.ts` 文件。

我希望你先阅读以下的文件，然后将 `navigation.ts` 的内容拆分到以下部分内：

- `src\router` 目录下的 ts 文件。
- `src\types\routes.ts` 类型安全的 路由系统类型定义 文件。

最终，我预期希望看到 `navigation.ts` 文件的内容被迁移到其他文件内。且该文件被删除。

## 028 迁移 `ActivityNavigation` 为 `TypedRouter`

请深度思考。请阅读以下文件：

- ROUTE-MIGRATION-REPORT.md
- src\router\helpers.ts

在 `本项目` 内，将 ActivityNavigation 全部替换成 TypedRouter 提供的路由跳转工具。然后删掉 ActivityNavigation 。实现对 ActivityNavigation 的全量替换。

## 029 处理 `src\pages\activity\activities.vue` 文件的路由迁移地址问题

文件 `src\pages\activity\activities.vue` 不满足 `route-migration` 子代理的设计要求。

文件 `src\pages\activity\activities.vue` 原本是从 `gitee-example/pages/activityes/activityes.vue` 文件迁移过来的，预期应该是 `src/pages/activity/index.vue` 文件。

1. 请你思考，并修改 `route-migration` 子代理。`route-migration` 子代理现在是基于 `Vue2 到 Vue3 uni-app 路由迁移映射表` 来执行路由迁移任务的，那么未来在执行 `组件迁移子代理` 时，应该首先检查清楚当前被处理的 `src\pages\**\*.vue` 页面文件，是否严格遵守 `Vue2 到 Vue3 uni-app 路由迁移映射表` 的迁移设计。请你确保 `组件迁移子代理` 未来工作时，不会出现这样的错误。
2. 请你首先修改子代理，然后运行子代理，并用子代理修复这个路由更新映射不正确的问题。
3. 请你确保文件移动后，其他引用的文件路径都正确，避免出现找不到的错误。

## 030 修改 `api-migration` api 迁移子代理，正确约束 mock 返回字段

请深度思考。

请修改 `api-migration` 子代理，在`基础格式要求`一栏，增加要求。要求以后生成 mock 接口时，其返回值格式必须用统一的 `successResponse` 和 `errorResponse` 函数来约束。

## 031 修改 `api-migration` api 迁移子代理，正确使用统一的 mock 日志输出工具函数

请深度思考。

请修改 `api-migration` 子代理，增加要求，要求 mock 日志输出的时候，统一使用 `src\api\mock\shared\utils.ts` 的 `mockLog` 函数。

## 032 修改 javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。

1. 请你修改 `src/api/**/*.ts` glob 匹配下的全部 ts 代码文件，将代码注释，**恰当的**改成期望的 jsdoc 注释格式。
2. 请你修改 `src/router/**/*.ts` glob 匹配下的全部 ts 代码文件，将代码注释，**恰当的**改成期望的 jsdoc 注释格式。
3. 请你修改 `src/types/**/*.ts` glob 匹配下的全部 ts 代码文件，将代码注释，**恰当的**改成期望的 jsdoc 注释格式。
4. 请你修改 `src/pages/**/*.ts` glob 匹配下的全部 vue 代码文件，将代码注释，**恰当的**改成期望的 jsdoc 注释格式。

## 031 应用 `api-migration` 子代理，确保落实严格的无鉴权原则

请深度思考。

请使用 `api-migration` 子代理，读取 `src\api` 目录下的文件，或者是其他相关的代码文件，确保项目满足严格的无鉴权原则。

1. 确保 mock 接口文件，其返回的 mock 接口，都充分的使用了 `src\api\mock\shared\utils.ts` 提供的工具。比如 `successResponse` 和 `errorResponse` 函数。请规范接口返回的数据格式。
2. 确保 mock 接口文件，都使用了 `mockLog` 函数来规范日志输出结果。

## 032 修改子代理使用 icon 的核心准则

请深度思考。请你认真阅读以下`icon迁移的方针思想`，以及实现方式。

各类迁移子代理实现 icon 标签的迁移时，是从 `cuIcon` ColorUI 图标，迁移到基于 `<wd-icon>` 组件的 `custom-class` 自定义样式实现的。

- icon 实现方式：新的 icon 图标用的基于类名生成的 icon。
- 类名格式要求：其编写格式满足 unocss 的 icon 图标类格式要求。icon 的类型都来自于 `Iconify`。
- iconify 图标集分类： 本项目用的是 `@iconify-json/carbon` 库，是 `carbon` 图标集。
- icon 类名格式要求：按照 unocss 使用 iconify 图标集的要求，本项目内的 `carbon` 图标集类名为 `i-carbon-*` 图标类。
- 具体示例： 比如 icon 的旧类型为 `cuIcon-notification` ，按照上述要求，新的 icon 实现方式为：

```html
<wd-icon name="" custom-class="i-carbon-notification" />
```

在使用`<wd-icon>`组件实现 icon 迁移时，请注意满足以下要求：

1. 使用 `<wd-icon>` 组件。
2. `<wd-icon>` 组件的要求是 name 属性必填。这里你固定填写为空字符串即可。
3. `i-carbon-*` 图标类在 custom-class 内就可以生效了。请你用 custom-class 来解决 `i-carbon-*` 图标类不生效的故障。
4. 按钮大小调整等样式修改需求，请主动使用 `custom-class` 加上 unocss 原子式样式的方式实现。

以上就是`icon迁移的方针思想`了。现在请你深度思考，并完成以下任务：

1. 针对性的阅读 `component-migration` 子代理的 `图标映射` 和 `style-migration` 子代理的 `图标系统映射` 部分。这两个部分都在讲 icon 图标映射表。
2. 以后全部的 icon 迁移任务，都交给 `component-migration` 子代理完成，而不是 `style-migration` 子代理。所以请你将 `style-migration` 子代理的 icon 映射图标表格，都迁移剪切到 `component-migration` 子代理的 `图标映射` 部分。
3. 将我上面表述的`icon迁移的方针思想`，整理并写入到 `component-migration` 子代理内，我希望 `component-migration` 子代理未来能够严格遵守该方针，实现 icon 迁移。

## 033 子代理明确 `useRequest` 组合式 api 的使用方式

请深度思考。

我需要你帮我明确清楚，以后子代理实现接口迁移，和使用接口时，要如何使用组合式 api 来使用接口请求的各种状态。

这里我规定：

- 接口请求定义：用 `import { http } from '@/http/alova'` 提供的 `http` 工具来定义接口。
- 请求状态管理的组合式 api： 用 `import { useRequest } from 'alova/client'` 提供的 `useRequest` 来使用接口请求过程中常用的状态。

1. 阅读 `code-migration` 和 `api-migration` 子代理。
2. 自主整理清楚关于接口定义、接口写法、组合式 api 使用的信息，全部整理迁移到 `api-migration` 子代理内。我希望 `api-migration` 子代理未来专门负责好 api 写法的迁移、mock 数据的定义、接口定义、以及用组合式 api 来使用接口。
3. 仔细思考，制定一个 `useRequest` 组合式 api 的使用规范，并将这个规范写到 api-migration 子代理内。
4. 避免出现 `code-migration` 和 `api-migration` 子代理都重复定义说明的情况，只允许 `api-migration` 子代理说明清楚如何使用 api 相关的使用规范。`code-migration` 子代理不允许出现重复的，交叉说明的情况。

## 034 `component-migration` 子代理更新 `<wd-img>` 对 width 和 height 的使用方式

请深度思考。

1. 请阅读 `component-migration` 子代理文件，现在我不允许配置 `<wd-img>` 组件的 width 和 height 属性。因为这两个属性会写死组件的宽高，不利于响应式界面的显示。
2. 请改成用 unocss 样式实现宽高设置。

## 035 细化 `route-migration` 子代理对类型化路由的跳转方案

请深度思考。

1. 阅读 `route-migration` 子代理。
2. 阅读 `src\router` 目录内全部的文件。
3. 现在 `route-migration` 子代理和`src\router` 目录内全部的文件，是对不上的。现在我希望你以 `src\router` 目录的现存文件为引导，告诉 `route-migration` 子代理，要在什么时候正确使用这些类型化的路由跳转工具。细化子代理的指导文件，细化清楚如何使用这些类型化的配置。
4. 细化清楚何时新增类型化的跳转函数。

## 036 细化 `component-migration` 子代理对 `<wd-status-tip>` 组件的使用

我希望 `component-migration` 子代理在实现类似于暂无数据的空占位符需求时，能够使用 `wot-design-uni` 组件库的 `<wd-status-tip>` 组件。

在迁移 `旧项目` 并实现类似的空占位符需求时，请使用 `<wd-status-tip>` 组件实现。

1. 请阅读 https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/status-tip.md 文档。了解清楚 `<wd-status-tip>` 组件的用法。
2. 为 `component-migration` 子代理增加关于 `<wd-status-tip>` 组件的使用细则。
3. 精简地增加 `<wd-status-tip>` 组件的使用方式，我不希望 `component-migration` 子代理太长了。

如果你对此有疑问，请深度思考该需求，询问我你不清楚的细节。我和你补充细化细则后，再开始修改 `component-migration` 子代理文件。

## 01 回答 AI 的问题

1. 图片资源管理策略：允许 `<wd-status-tip>` 继续使用默认外链。
2. 内容细化程度：
   - A 但是简单说明 7 种类型即可。不需要你详细说明。
   - C 补充 image-size 的常见用法示例。
   - D 简单说明 image 插槽的自定义场景就好。
3. 内容整合位置：
   - A
   - B
   - D
4. 精简程度控制：按照你的建议来做。

## 037 优化 `style-migration` 子代理的迁移行为细节

我需要你帮我优化迭代 `style-migration` 子代理的迁移实施细节。要求 `style-migration` 子代理在未来遵守这些要求。

1. 自定义样式类处理策略： 分解成 UnoCSS 原子类，不新建任何业务性质样式类。避免增加心智负担。
2. 遇到复合样式直接在模板内分解成 css 原子类。
3. 补全关于 `cu-*` 样式映射表。
4. 面对 `cu-*` 样式类的处理策略： 直接在模板中展开成原子类，不可以创建任何 unocss shortcuts 。

与此同时，我需要你读取，吸收，接纳现有的样式迁移报告，请你在这报告中，将以下内容，迁移，补充，整合到现有的 `style-migration` 子代理内。

针对报告： `docs\migration-property-apply-pages.md`

迁移整合的项目：

- `布局容器类迁移`
- `颜色类迁移`
- 间距类迁移
- 形状与效果类迁移
- 网格类迁移

编写子代理时，我还有以下要求：

1. 长度不要过长。

## 1 回答问题

1. shortcuts 的处理边界：
   - 需要完全删除 cu-card、cu-bar、cu-btn、cu-list、cu-item 这些`cu-*` shortcuts。
   - 非 `cu-*` 的 shortcuts（如 address-search、letter-header、staff-item），不做保留，删除掉。
   - 所有 shortcuts 全部删除，只保留纯映射表。

2. "长度不要过长"的具体标准： 把这些作用不大的，和迁移任务关联不大的，标准指导意义弱的内容，删除掉。
   - 迁移计划和检查清单
   - 迁移实施计划。我不想看到子代理有迁移实施计划。
   - 检查清单和验证步骤
   - 代码示例：请你对代码示例做适当的删减缩减。

3. 映射表的整合策略：
   - 合并去重。
   - 冲突映射以 `style-migration` 子代理原本的为主。

4. 复合样式类的映射粒度： 只处理满足 `cu-*` 规则的样式。其他复合的细节不看。舍弃掉。

5. 自定义业务样式类的识别标准： 我也讲不清楚具体的`业务性质样式类`是什么，我给不出你具体的标准。但是有一点很清楚，遇到这种类，你也别去区分`框架类` 还是 `业务类` ，你都应该变成 unocss 原子样式。既然你没有明确的原子样式映射表，那就直接忽略掉。

6. uno.config.ts 配置的保留程度： 其他配置你都不用删减，你就删除掉全部的 shortcuts 定义。我要求你精简的是子代理的文件长度，至于 `uno.config.ts` 配置，不在讨论范围内。

7. 图标迁移内容的取舍： 保留一句简要说明 + 跳转链接。我不允许你完全移除图标相关内容。该部分关于 icon 迁移的内容，也是 `style-migration` 子代理重要的组成部分。

8. 对于子代理文件。精简代码示例，用紧凑的表格格式代替冗长对比。

9. 善后处置： 因为我要求你删除掉全部的 shortcuts ，但是仍旧有部分页面保留，使用了这些 shortcuts 。请你阅读下面这些`本项目`的业务热点组件，同步按照你刚刚修改的 `style-migration` 子代理的要求，做出替换修改。
   - `活动操作按钮组件` ： `src\components\activity\activity-actions.vue`
   - `活动信息组件` ： `src\components\activity\activity-info.vue`
   - `活动详情页` ： `src\pages\activity\detail.vue`
   - `活动列表页` ： `src\pages\activity\index.vue`

## 038 优化补全 `component-migration` 子代理关于 icon 图标的迁移清单

请深度思考。

我需要你读取，吸收，接纳现有的样式迁移报告，请你在这报告中，将以下内容，迁移，补充，整合到现有的 `component-migration` 子代理内。

针对报告： `docs\migration-property-apply-pages.md`

迁移整合的项目：

- `图标映射表`
- `图标映射策略`

## 1 回答 AI 问题

1. 图标映射表的合并策略： 合并去重策略；都新增补充到子代理内。
2. 表格格式的统一：
   - 采用格式： `现有子代理表格(4列)`
   - 不需要 `使用频率` 这个表格列。
   - 不需要 `选择依据` 这个表格列。
3. 图标映射策略的整合方式： 不需要增加任何关于 `选择依据` 的内容。忽略。
4. 冲突映射的处理： 都保留。`cuIcon-delete` 和 `cuIcon-deletefill` 都映射成新的 `i-carbon-trash-can` ，分别列出两条映射。
5. 内容组织结构： C: 保持现有结构,只更新映射表,不新增章节
6. 迁移示例的补充：
   - **需要补充**到子代理的"Icon 迁移的核心方针"章节。

## 039 优化 `api-migration` 子代理对 mock 的处理方式

请阅读 `api-migration` 子代理，并按照以下要求，优化子代理的行为。使得子代理在生成 mock 接口时，满足以下要求。

1. 新增的接口要求： mock 接口必须满足 `src\types\api.ts` 的接口响应格式。
2. 修改 mock 接口时，如果此时正在使用谷歌浏览器 MCP 运行项目，请你及时重启本地开发环境。重启本地开发环境才能让 mock 接口更新到最新版。

## 01 回答 AI 的问题

1. ResultEnum.Success 的值是什么？你不用管 `ResultEnum.Success` 的具体值，你只需要遵守要求，使用该 `ResultEnum.Success` 枚举值即可。错的是现在的 `api-migration` 子代理文档。不一致修改的是 `api-migration` 子代理。
2. 错误码规范： 一律用 `ResultEnum` 提供的错误码。不需要定义一个标准的错误码枚举。直接复用 `ResultEnum` 枚举的值。文档的实例，恰当的补充到 `ResultEnum` 枚举内。注意去补充`ResultEnum` 枚举，而不是覆盖删减 `ResultEnum` 枚举的值。另外把 `api-migration` 子代理文档对这些返回值例子删除，让子代理一律以 `ResultEnum` 枚举为准。
3. timestamp 字段的必需性 ：以 `src\types\api.ts` 类型定义的为准。timestamp 应该是必需字段。修正 `api-migration` 子代理。
4. 如何检测是否在使用浏览器 MCP？检查是否有运行中的 pnpm dev 进程即可。你自己想办法重启谷歌浏览器 MCP，重启正在运行的本地 H5 项目。
5. 你期望的重启方式是什么？选项 A：自动重启。
6. 重启的触发条件，什么情况下需要重启？
   - 新增任何 `*.mock.ts` 文件时
   - 修改任何现有 `*.mock.ts` 文件时
   - 修改 mock 数据内容时也需要重启
7. 重启后的状态保持：浏览器 MCP 已经打开页面，重启后需要刷新页面。
8. 如何确保开发者遵循响应格式规范？选项 A。在 `api-migration.md` 中强调必须使用 `successResponse/errorResponse`
9. 现有 mock 文件的处理：用更新后的子代理，重新检查并修正现有的 mock 文件。

## 040 不允许 `api-migration` 子代理在任何 `*.mock.ts` 文件内直接以路径别名的方式使用 ResultEnum 枚举

很抱歉，我不得不给你做出破坏性变更。

1. `api-migration` 子代理做出重大调整，不再允许直接使用 `ResultEnum` 这个枚举。
2. 请为 `api-migration` 子代理增加一条**重要**的原则： **禁止**任何 `*.mock.ts` 文件内直接以**路径别名**的方式使用 `ResultEnum` 枚举。
3. 更改为，仅允许使用 `ResultEnumMap` 提供的字面量字符串，仅使用该对象，且只允许用 './shared/utils' **相对路径**工具内提供的工具。必须使用相对路径导入 `ResultEnumMap` 工具。
4. 请扫描全部 `api-migration` 子代理的代码例子，确保遵循该原则。

## 041 `api-migration` 子代理对 `迁移实施计划` 部分做调整

`api-migration` 子代理对 `迁移实施计划` 部分做调整，我不希望看到子代理讲述什么迁移计划，我只想看到实施标准。

## 01 回答问题

1. 章节标题： 不用改标题，我希望你直接提取出具体的实施标准，和验证步骤。反正我不想看到什么计划。
2. 删除关于计划阶段的设计： 我不想看到什么计划和阶段。这不是`api-migration` 子代理应该关注的内容。
3. 删除任务清单： 我不想看到`api-migration` 子代理做出什么任务部署，任务清单。`api-migration` 子代理只负责罗列具体的迁移实施标准和细则。不应该体现任何任务部署。
4. 配置示例保留： 保留，并作为"配置标准"的一部分。
5. 质量检查清单： 目前的"质量检查清单" 保留。可以直接提升为主要内容。
6. "实施标准"格式： 按类别组织。

## 042 为我推荐一款脑图节点渲染库

如下图所示：

![2025-10-19-23-45-54](https://s2.loli.net/2025/10/19/uRSPthFwQCzfel6.png)

![2025-10-19-23-50-06](https://s2.loli.net/2025/10/19/QYRVCaGDNBvrK3g.png)

- https://yak.antfu.me/?clicks=2&mode=all

![2025-10-19-23-47-52](https://s2.loli.net/2025/10/19/rNkTHaQBsXI5CgJ.png)

请为我推荐一款前端 node 库，用 vue 实现的节点关系脑图库，实现类似于上面的效果。请优先从 github 和 npm 内推荐。推荐 5~8 款这样的库。

## 用 gemini 推荐的几款工具

- https://gemini.google.com/share/7cc397b5591c
- https://github.com/bcakmakoglu/vue-flow

<!-- vite-plugin-vue-devtools graph -->

## 043 整体地阅读 `旧项目` 的页面，根据路由引导关系，生成页面之间的跳转关系脑图

我需要你帮我理清楚旧项目的路由跳转关系图。

1. 完整读取 `gitee-example\pages.json` 文件，这包含了旧项目全部可以跳转的路由。
2. 请你读取旧项目全部的页面，读取 `gitee-example/pages/**/*.vue` 的全部 vue 组件。确定全部要读取的 vue 组件。
3. 请你有**策略的**，**部分的**阅读路由跳转部分的逻辑。重点阅读以下函数：
   - uni.navigateTo
   - uni.redirectTo
   - uni.reLaunch
   - uni.switchTab
   - uni.navigateBack
   - uni.preloadPage
4. 根据上面的 uniapp 路由跳转函数，去帮我理清楚旧项目的路由跳转关系，并绘制出一份 mermaid 报表。

## 回答 AI 问题

1. 脑图的详细程度和范围：
   - 选项 B
   - 选项 C
2. 脑图的组织方式： 选项 B
3. 否需要包含跳转参数： 需要在脑图中标注这些参数。
4. 特殊跳转的处理：
   - 返回上一页，这种跳转如何表示？不做显示，脑图不展示该内容。
   - 切换到 tabBar 页面。不做显示，脑图不展示该内容。
   - 条件跳转（如登录检查后跳转）。不做显示，脑图不展示该内容。
5. 输出形式： 选项 B。且不需要文本版本的跳转关系清单。不需要。

## 044 细化 `api-migration` 子代理对生成 api.ts 接口文件的标准和要求

我没有在 `api-migration` 文档内看到关于生成 `src\api\*.ts` 接口的例子，也不清楚在 `api-migration` 子代理内，要如何使用以下这些基础业务类型：

- `ApiResponse`
- `PaginationParams`
- `PaginationResponse`

请你深度的调研 `gitee-example` 即旧项目内接口的使用方式，阅读 `https://unibest.tech/base/8-request` 文档，深度思考一下，`api-migration` 接口迁移子代理子代理，应该如何使用这些基础业务类型？在 mock 的时候，如何充分的复用这些基础业务类型？

## 01 整合文档

1. 请你将 `docs\reports\2025-11-20-api-migration-interface-standards.md` 整合到 `api-migration` 接口迁移子代理文件内。
2. 在整合内容时，请你认真思考。有机整合，做恰当的补充。如果需要有覆盖的场景，请你以最新的 `2025-11-20-api-migration-interface-standards` 来为准。
3. 删除掉 `docs\reports\2025-11-20-api-migration-interface-standards.md` 文件，以后只能用唯一的 `api-migration` 接口迁移子代理来完成 api 迁移任务。

## 045 调研清楚项目应该如何使用接口错误提示能力？

在本项目内，接口请求出现错误的时候，应该怎么使用 api 请求回调函数？使用那个组件来实现统一的接口请求错误提示？

请你全面的，整体性的调研清楚，在使用 `wot-design-uni` 组件和 `unibest` 模板的前提下，如何实现优雅美观的错误提示？

用 `gitmcp` 的 `wot-design-uni` 和 `unibest-docs` 工具，来查询最佳实践。

---

## 046 迭代更好接口错误提示能力实施方案

1. 请你阅读 `docs\reports\2025-11-28-api-error-handling-research.md` 报告，我们将重点迭代本报告。
2. 阅读 `.claude\agents\api-migration.md` 子代理文件。了解清楚本项目是如何使用 Alova 提供的 `useRequest` 工具，并在 onSuccess onError onComplete 这三个钩子内完成接口数据回调的。
3. 请你认真思考，在使用 Alova 的 `useRequest` 工具并使用三个回调函数的情况下，该如何与`接口错误提示能力`所提供的工具结合起来，实现在 `useRequest` 回调内实现统一的错误提示处理。
4. 请你迭代更新`接口错误提示能力`报告，使得里面的实例代码，能够完美的符合 `api-migration` 子代理所述的接口请求写法。

阅读文档： `docs\reports\2025-11-28-api-error-handling-research.md` ，考虑让接口请求内部整合好接口报错提示方案。

## 047 反哺补全 `api-migration` 子代理文档

刚才我们迭代了 `docs\reports\2025-11-28-api-error-handling-research.md` `接口错误提示能力` 报告，我希望你把这个 `接口错误提示能力` 变成一份 claude code skill 。

1. 将 `接口错误提示能力` 报告变成一个本地的 claude code skills。
2. 适当的迭代更新 `api-migration` 子代理文档，让 `api-migration` 子代理以后在处理接口错误提示能力时，可以使用正确的 `接口错误提示能力`，并主动借助 claude code skill 的能力，确保编写的接口能够正确做出满足标准的错误提示。
3. 适当更新 `api-migration` 子代理文档，避免 `api-migration` 子代理文档文件长度过长。

## 01 彻底消化内化 `接口错误提示能力` 报告

我希望你将 `docs\reports\2025-11-28-api-error-handling-research.md` `接口错误提示能力` 报告彻底的，完整的变成一款 claude code skills 。

完整的内化，吸收成 `.claude\skills\api-error-handling.md` 文件。

将具体做法和案例保留。

只保留具体的做法，和实施标准，按照方法论，和实际技能的标准来吸收 `docs\reports\2025-11-28-api-error-handling-research.md` 的内容。

最后我们会永久删除掉 `docs\reports\2025-11-28-api-error-handling-research.md` 文档，只留下能够高强度复用的 `.claude\skills\api-error-handling.md` 技能文件。

## 048 调研 `<z-paging>` 组件的使用

我们现在知道，在本项目中，使用接口请求时，需要遵循 `api-migration` 子代理的要求。

但是本项目使用的 uniapp 分页组件 `<z-paging>` ，有着特定的接口分页函数写法。

请你适当的使用 `gitmcp__uni-z-paging__SmileZXLee` 这款 mcp，阅读相关的代码，并思考一下我们项目在使用接口请求时，如何适当地改写，在基于并满足`api-migration` 子代理要求的前提下，怎么去适配，并使用 `<z-paging>` 所要求的代码写法格式？

在你使用 `gitmcp__uni-z-paging__SmileZXLee` 这款 mcp 时，很容易出现上下文超限的情况，请你酌情使用，或者是变通地访问 `SmileZXLee/uni-z-paging` github 仓库，阅读相关的 demo 案例代码。

## 049 将调研报告变成 claude code skills 技能文件，让 `api-migration` 和 `component-migration` 子代理明确清楚合适的使用时机

1. 将 `docs\reports\2025-12-05-z-paging-api-migration-research.md` 变成一份可以高强度复用的 claude code skills，成为一份可以执行落地的技能实践文件。
2. 在 `api-migration` 子代理文件内，增加适当的说明，并确保以后在使用 `api-migration` 子代理时，遇到 `<z-paging>` 组件和接口使用时，能正确的使用本技能来正确使用。
3. 在 `component-migration` 子代理内，针对 `<z-paging>` 组件的使用，也要做引用说明。说明清楚如何恰当使用 `<z-paging>` 组件。

## 050 迭代 `z-paging-integration` 文档

1. 阅读 `z-paging-integration` 文档。
2. 阅读 `docs\reports\2025-12-05-z-paging-infinite-loop-bug-report.md` 事故报告。
3. 告诉我这两份报告的差异点。我准备以 `z-paging-integration` 为核心，用 `2025-12-05-z-paging-infinite-loop-bug-report` 事故报告作为增量迭代的文件，更新，迭代，细化 `z-paging-integration` 技能文件在以后使用 `z-paging` 组件时的注意事项。
4. 请你根据事故报告的说明，更新迭代 `z-paging-integration` 文档的内容。

## 051 新建专用的常量文件，重构 mock 数据内使用的常量

以 REPAIR_STATUSES 的重构为例子。

1. 在 src\api\mock\repair.mock.ts 内，将 REPAIR_STATUSES 这个形如数据字典的变量，专门提取出来到 `src\constants\repair.ts` 文件内。
2. 在 src\api\mock\repair.mock.ts 内使用来自 `src\constants\repair.ts` 数据字典常量的下拉列表数组。
3. 在 src\pages-sub\repair\order-list.vue 内使用来自 `src\constants\repair.ts` 数据字典常量的下拉列表数组。

我需要你分两个步骤来完成重构任务。

步骤 1： 代码写法重构

1. 阅读 src\api\mock 文件夹内全部的 `*.mock.ts` 文件，将这些文件内涉及到的数据字典式的常量，全部按照业务文件名，整理，提取，迁移到 `src\constants` 常量目录内。
2. 确保 src\api\mock 文件夹内全部的 `*.mock.ts` 文件未来将从 `src\constants` 常量目录内，读取数据字典式的下拉列表数据。
3. 数据字典式的数据，必须使用 `import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'` 所提供的 `ColumnItem` 类型来约束数据字典的格式取值。
4. 对于全部的 `*.mock.ts` 而言，使用 `ColumnItem` 类型约束的数据字典数组，很可能出现约束失败，类型检查失效的情况。请你手动检查。
   - 必须主动使用 value 字段。
   - 必须主动使用 label 字段。
   - value 字段的类型约束为 `string | number | boolean` ，这很宽泛，很容易导致类型不匹配。请你在 `*.mock.ts` 内

步骤 2： 更新各类子代理和规范文件

1. 在步骤 1 内，展现了很多不同于 `api-migration` 子代理文件的做法。这些做法属于新的迁移规范，对于全部的 `*.mock.ts` 而言，出现了新的规范，请及时更新其规范。
2. 请你将数据字典常量的代码写法，以及注意事项，都写到 `code-migration` 子代理文件内，为`code-migration` 子代理增加新的代码编写规范。为旧项目代码做数据字典常量迁移时，提供明确的迁移规范标准。
3. 步骤 1 说明了明确的类型报错解决方案与注意事项，请你更新 `code-migration` 子代理文件，说明清楚类型约束写法和注意事项。

## 01 回答 AI 问题

1. 作用范围确认：立即对 src/api/mock 下全部 `*.mock.ts` 一次性处理。文件较多，建议分批（例如维修模块→活动模块→其他）。
2. 常量文件命名/分组：按业务模块拆分（如 src/constants/repair.ts、activity.ts、complaint.ts……）。若遇到跨模块共用的字典（例如通用状态/优先级），请放入 `src/constants/common.ts` 。
3. 导出形式：统一使用具名导出（如 export const REPAIR_STATUSES: ColumnItem[] = [...]），并保持全大写蛇形命名。
4. 现有 src/constants/repair.ts 已存在，允许在其中合并新增字典。若已有同名常量，需要改名。
5. ColumnItem 的 value 类型：**本身就是**接受混合类型（string/number/boolean 同数组内混用）。但是，我要求单一类型。以保证前端使用一致性。实际编写的时候一律使用单一的 string 字符串类型。
6. 代码引用方式：mock 文件内统一用相对路径引用常量。当前 mock 对 alias 支持有限，一律使用相对路径。
7. 规范文档更新：更新 .claude/agents/code-migration.md 时，需要补充示例代码片段（包含 ColumnItem 声明、mock 文件引用、类型检查注意事项）。

## 052 用 dayjs 重构 mock 接口对时间日期的处理

1. 阅读 src\api\mock 文件夹内全部的 `*.mock.ts` 文件，将涉及到日期格式化的写法，全部用 dayjs 来重构代码。
2. 重构完成后，请对 `api-migration` 子代理增加新的 mock 文件编写规范，要求其在格式化日期时，必须使用 dayjs 来完成格式化。

## 052 为 vue 组件代码的文件注释，增加普遍的`旧代码`文件地址

以文件 `src\pages-sub\repair\order-list.vue` 为例子。

1. 根据 `docs\prompts\route-migration-map.yml` 的说明，新代码 `src\pages-sub\repair\order-list.vue` 对应的旧代码为 `gitee-example/pages/repairOrder/repairOrder.vue` 。
2. 在 `src\pages-sub\repair\order-list.vue` 的文件注释内，增加一行 `旧代码：` 。

请你以上述文件为例子，根据 `docs\prompts\route-migration-map.yml` 的说明，对以下全部的 vue 组件增加旧代码映射地址，便于阅读。

- `src\pages\**\*.vue`
- `src\pages-sub\**\*.vue`

## 01 回答 AI 问题

1. 处理范围一次性覆盖所有 src/pages 与 src/pages-sub。并且按模块/批次推进。文件数量多，请分批并回报进度。
2. 若某旧路径在映射表缺失或不明确，请标记为 旧代码：未找到（待补充） 并列出清单给我确认。
3. 顶部已有业务注释但无访问地址或格式不统一时，允许你在同一轮顺便补全/矫正（确保访问地址、建议参数等）。
4. 访问地址统一使用 H5 默认端口 `http://localhost:3000/#/{route}` 。若个别页面有自定义示例参数，按现有注释延续。
5. 旧代码行的格式固定为 `旧代码：gitee-example/...` 。放在业务注释块内靠后一行即可。

## 053 制作独立的，美观的，专用的加载等待组件

1. 请你阅读 `src\pages-sub\selector\select-floor.vue` 等 `选择器系列页面` 。注意里面的代码写法。
2. 重点阅读 `<template #loading>` 这一块的逻辑。
3. 我需要你将 `<template #loading>` 这一块的代码写法，单独抽取出来，制作成一个美观的，独立的子组件，实现代码复用。避免出现代码冗余的情况。
4. 制作的新组件存放在 `src\components\common` 目录内。
5. 为新组件编写**简单**的使用文档。
   - 重点说明使用的具体案例都在 `src\pages\test-use` 目录内的代码案例内体现。
6. 在 `src\pages\test-use` 目录内，新建测试用途的页面，用来访问不同派生出来的加载组件显示效果。
   - 足够丰富详实。充当最完整的，最详实的说明文档职责。说明清楚该组件的全部使用细节。和传参说明。
   - 补充详细的文本。
7. 更新 `选择器系列页面`，使其使用全新的加载等待组件。
8. 更新 `src\pages-sub\repair\order-list.vue` `维修工单池` 页面，在相同的 `z-paging` 组件的 `<template #loading>` 插槽内，使用你刚刚制作的加载等待组件。
9. 在 `.claude\skills\z-paging-integration.md` 内，重点补全关于 `z-paging` 组件对 `<template #loading>` 加载等待插槽的使用细则，使用案例，和注意事项。务必制定以下的规范：

- 以后使用 `z-paging` 组件时，必须使用 `<template #loading>` 加载等待插槽。
- 在 `z-paging` 组件的 `#loading` 插槽内，必须使用你创建的这款新加载等待组件。**不允许**使用别的加载等待组件。

---

调研 uniapp 生态内，更加美观的，精彩的加载等待动效库。

经过调研检查，没有合适的库。不如自己改写算了。

## 01 重构代码，并处理故障

1. 调整 `src\components\common` 目录的文件存储格式。
   - index.vue 作为核心组件
   - types.ts 作为对外导出的类型
   - index.md 作为文档名称
   - `z-paging-loading` 是文件夹名称
   - 及时更新 `src\components\common\z-paging-loading\index.md` 文档，说明清楚文件存储结构
2. 处理 `z-paging-loading` 组件的类型故障，注意阅读 `wd-loading` 组件的文档。
   - https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/loading.md
3. 确保以下文件，能够手动 import 导入 `z-paging-loading` 组件。
   - `选择器系列页面`
   - `src\pages-sub\repair\order-list.vue`
   - `src\pages\test-use\z-paging-loading.vue`

## 054 为本项目单独抽象一个完整的 `<wd-form>` 表单编写范例，抽象公共的 skills 文件

1. 全面阅读 `src\pages-sub\repair\add-order.vue` 的代码写法，重点学习清楚里面是怎么组织一个常见的 uniapp 表单的。
2. 这个表单很美观，代码组织很好，我希望你编写补全 `.claude\skills\use-wd-form.md` 这款技能文件，希望本项目在实现类似于表单的 vue 组件时，都能够主动使用这款 `use-wd-form` 技能文件，按照该技能文件的约束，编写完整的，符合规格的，统一风格和写法的表单性质组件。
3. 我希望 `use-wd-form` 使用 `<wd-form>` 表单编写表单页这款技能文件，能够从 add-order 表单页内，学习到以下方面的代码组织方式：
   - 用 `wd-form` 组件来制作整个表单。
   - 组件必须要使用： `<wd-form ref="formRef" :model="model" :rules="formRules"> ...具体代码  </wd-form>` 的形式来定义。
   - `wd-form` 组件必须提供 `ref="formRef"` 组件引用、`:model="model"` 双向绑定代码、`:rules="formRules"` 表单校验规则。
   - 代码块组织必须使用 `wd-cell-group` 和 `wd-cell` 组件。不管这个表单复杂度如何，都要使用 `wd-cell-group` 和 `wd-cell` 组件来包裹具体的表单项。用这两个布局组件来组织清楚具体的代码写法。
   - wd-cell-group 组件必须使用 border 属性，增强美观度。
4. `use-wd-form` 技能文件必须提供以下的组件文档链接，便于 AI 模型在使用该技能文件时，能够主动的获取组件写法文档：
   - `wd-form` 组件文档： https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/form.md
   - `wd-cell-group` 和 `wd-cell` 组件文档： https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/cell.md

## 055 优化迭代 `beautiful-component-design` 技能

1. 阅读 `.claude\skills\beautiful-component-design` 目录下面的全部文件。
2. 阅读 `.claude\agents` 文件夹下面的全部子代理文件，明确清楚各个子代理的要求。
3. 按照各个子代理的要求，去改写，纠正 `beautiful-component-design` 技能中不合适的内容。在保留 `beautiful-component-design` 技能的核心内容的前提下，确保技能文档的写法满足各个子代理的写法要求。

## 056 更新各个文档对于 `wd-cell` 组件的使用细则

1. 务必阅读文档 `https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/cell.md` ，掌握清楚 `wd-cell` 组件的使用方式。
2. 请注意以下故障，使用了错误的，不存在的 `wd-cell` 组件 的 `#value` 插槽，而导致的一系列故障。
3. 了解清楚以下故障后，请你及时更新以下这几个文档，避免再次出现错误使用 `wd-cell` 组件的错误。
   - .claude\agents\component-migration.md 的 `示例 3.1: wd-picker 选择器组件迁移（重要⚠️）` 部分。更新错误日志，重点说明是因为使用了错误的 `#value` 插槽插槽才导致的表单组件无法使用的故障。
   - .claude\skills\use-wd-form\SKILL.md 的 `3.2. 选择器（wd-picker）` 部分。重点说明是因为使用了错误的 `#value` 插槽插槽才导致的表单组件无法使用的故障。
   - `.claude\skills\beautiful-component-design` 目录下的文档，在使用 `wd-cell` 组件美化优化

## 案例 1

1. 错误使用不存在的 `<template #value>` 插槽。

```vue
<template>
	<wd-cell-group border>
		<wd-cell :title-width="LABEL_WIDTH" center>
			<template #title>
				<text>商品类型</text>
			</template>
			<template #value>
				<wd-picker
					v-model="selectedParentTypeIndex"
					:columns="parentTypeOptions"
					label-key="name"
					value-key="rstId"
					@confirm="handleParentTypeChange"
				>
					<text class="text-blue-500">
						{{ parentTypeOptions[selectedParentTypeIndex]?.name || "请选择" }}
					</text>
				</wd-picker>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

2. 页面效果很差很丑的嵌套写法。

```vue
<template>
	<wd-cell-group border>
		<wd-cell :title-width="LABEL_WIDTH" is-link center>
			<wd-picker
				v-model="selectedParentTypeRstId"
				label="商品类型"
				:label-width="LABEL_WIDTH"
				:columns="parentTypeOptions"
				label-key="name"
				value-key="rstId"
				@confirm="handleParentTypeChange"
			/>
		</wd-cell>
	</wd-cell-group>
</template>
```

3. 正确做法如下：
   - 直接不使用 `wd-cell` 组件，在`wd-cell`组件内写嵌套写法，会导致很不美观的情况。
   - 在 `wd-cell-group` 组件内使用各种表单组件时，就直接使用组件即可。不需要额外多包装一个东西。

```vue
<template>
	<wd-cell-group border>
		<wd-picker
			v-model="selectedParentTypeRstId"
			label="商品类型"
			:label-width="LABEL_WIDTH"
			:columns="parentTypeOptions"
			label-key="name"
			value-key="rstId"
			@confirm="handleParentTypeChange"
		/>
	</wd-cell-group>
</template>
```

## 案例 2

1. 错误写法

```vue
<template>
	<wd-cell-group border>
		<wd-cell :title-width="LABEL_WIDTH" center>
			<template #title>
				<text>二级分类</text>
			</template>
			<template #value>
				<wd-picker
					v-model="selectedSonTypeIndex"
					:columns="sonTypeOptions"
					label-key="name"
					value-key="rstId"
					@confirm="handleSonTypeChange"
				>
					<text class="text-blue-500">
						{{ sonTypeOptions[selectedSonTypeIndex]?.name || "请选择" }}
					</text>
				</wd-picker>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

2. 正确写法

```vue
<template>
	<wd-cell-group border>
		<wd-picker
			v-model="selectedSonTypeIndex"
			:columns="sonTypeOptions"
			label="二级分类"
			:label-width="LABEL_WIDTH"
			label-key="name"
			value-key="rstId"
			@confirm="handleSonTypeChange"
		/>
	</wd-cell-group>
</template>
```

## 057 优化 `form-section-title` 组件

1. 阅读以下 url 图片地址：

![2025-12-28-18-53-42](https://s2.loli.net/2025/12/28/zGvY8USDJIfbpuW.png)

2. 如图，`form-section-title` 组件的主标题和副标题之间，存在问题。主标题在较窄的显示屏下，被换行了。请你适当的更改 `src\components\common\form-section-title` 组件，确保主标题不要被换行。
3. 只更改 `form-section-title` 组件。

## 058 uniapp 是否有动态更改页面标题的方案？

1. 阅读以下 url 图片地址：

![2025-12-28-21-15-45](https://s2.loli.net/2025/12/28/SumUQ5AxefJtbpq.png)

2. 请你帮我调研一下，在本项目内，是否已经有成熟的方案，实现 uniapp 的标题动态变化？
3. 请你调研一下，在 https://github.com/uni-helper 系列工具链内，是否有优雅成熟的 uniapp 标题动态变化的方案？
4. 请你帮我调用一下，在 uniapp 本体内，是否有原生的方案实现标题动态变化？
5. 请你出示一份 markdown 格式的调研报告，供我阅读学习。

---

报告地址，docs\reports\2025-12-28-uniapp-dynamic-page-title-research.md

经过调研，使用原生的 `uni.setNavigationBarTitle` 和 `onReady` 来完成进入页面更改标题的功能。

## 059 迁移重构子代理文件为 claude code skill 技能文件

1. **阅读 skill 技能写法**： 请你先阅读 claude code skill 的格式文档，和最佳实践。我需要你迁移的格式是项目级别的 skills 技能文件。
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
2. **阅读全部被迁移的子代理文件**： 阅读全部的 `.claude\agents` 迁移子代理文件。这些文件就是被迁移的对象。
3. **保留重要的知识资产**： 这些迁移规则非常详实，详细。他们都经历过多次迭代，是重要的知识资产。所以你在迁移成 skill 时，不能轻易地删减那么多关键知识。
4. **说明清楚技能被触发的前提和条件**： 未来不再是用户主动调用子代理了，而是大模型`渐进式揭露`地的使用技能。所以你要认真学习，认真理解好子代理的触发前提，编写好完整的技能触发前提。确保以后完成迁移任务时，能够主动的，精确的使用这几款迁移技能。
5. **技能名称和子代理名称保持相同**： 比如这款 `api-migration` 子代理，应该新建成 `api-migration` 技能。保留命名风格。
6. **及时更新用语说明**： 及时更新 `CLAUDE.md` 对子代理的说明，改换成技能说明。以后没有子代理，而是技能文件。

## 060 代码写法，避免行内写冗长的 v-if 语句

我要求你改写具体代码的写法，然后迭代更新相关技能文件的写法。

1. 不合适写法： 不应该直接在 vue 组件上面写那么冗长的 v-if 判断语句，看起来很繁杂冗长。

```vue
<template>
	<!-- 启动按钮：已派单 -->
	<wd-button v-if="item.statusCd === '10002'" size="small" type="success" @click="handleStartRepair(item)">
		启动
	</wd-button>

	<!-- 转单按钮：已派单/处理中 -->
	<wd-button
		v-if="item.statusCd === '10002' || item.statusCd === '10003'"
		size="small"
		type="warning"
		@click="handleTransfer(item)"
	>
		转单
	</wd-button>

	<!-- 暂停按钮：已派单/处理中 -->
	<wd-button
		v-if="item.statusCd === '10002' || item.statusCd === '10003'"
		size="small"
		type="warning"
		@click="handleStopRepair(item)"
	>
		暂停
	</wd-button>

	<!-- 退单按钮 -->
	<wd-button v-if="item.preStaffId !== '-1'" size="small" type="error" @click="handleReturn(item)"> 退单 </wd-button>

	<!-- 办结按钮：已派单/处理中 -->
	<wd-button
		v-if="item.statusCd === '10002' || item.statusCd === '10003'"
		size="small"
		type="success"
		@click="handleFinish(item)"
	>
		办结
	</wd-button>

	<!-- 回访按钮：已完成且需回访 -->
	<wd-button
		v-if="item.statusCd === '10004' && item.returnVisitFlag === '003' && checkAuth('502021040151320003')"
		size="small"
		type="success"
		@click="handleAppraise(item)"
	>
		回访
	</wd-button>
</template>
```

2. 合适写法： 就像 `src\pages-sub\repair\handle.vue` 一样，应该将组件的显示状态，单独用 `computed` 来封装，便于阅读和维护。

```ts
/** 是否显示维修师傅选择（派单/转单/退单时） */
const showStaffSelector = computed(() => model.action !== "FINISH");
/** 是否显示商品选择按钮 */
const showResourceSelector = computed(() => model.feeFlag === "1001" || model.feeFlag === "1003");
/** 是否显示商品列表 */
const showResourceList = computed(
	() => (model.feeFlag === "1001" || model.feeFlag === "1003") && model.resourceList.length > 0,
);
/** 是否显示支付方式 */
const showPayType = computed(() => model.feeFlag === "1001");
/** 是否显示图片上传（仅办结时） */
const showImages = computed(() => model.action === "FINISH");
/** 是否显示总计金额 */
const showTotalAmount = computed(() => model.feeFlag === "1001");
```

3. 更新 `.claude\skills\code-migration` 技能。确保以后在涉及到组件显隐的状态代码写法时，能够使用正确的代码写法。

## 061 恢复关于强类型路由跳转的知识，补全 `route-migration` 技能

1. `.claude\skills\route-migration\SKILL.md` ，即 `route-migration` 技能，在上次实现子代理迁移时，丢失了很多知识点。关于如何定义强类型的路由跳转工具的的知识点，全部都丢失了。
2. 我需要你现在全面阅读 `src\router` 内全部的文件，搞清楚在实现旧项目迁移到新项目时，路由跳转工具应该如何定义。
3. 我需要你仔细阅读 `src\pages-sub\repair` 报修模块内，各个页面是如何使用这个强类型路由跳转工具的。
4. 在阅读搞懂上述的强类型路由跳转机制后。请你恢复 `route-migration` 技能对迁移旧路由的知识点。

## 062 补全恢复 `component-migration` 技能对 `<wd-empty>` 组件替换成 `<wd-status-tip>` 组件的知识

1. `component-migration` 技能在上次迁移的时候，丢失了避免使用错误组件 `<wd-empty>` 的知识。导致部分页面使用了错误的组件。
2. 你应该告诉 `component-migration` 技能，不应该使用这个不存在的组件。
3. `<wd-status-tip>` 组件文档：
   - https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/status-tip.md

## 063 按照技能执行缺漏的报告，集中地，全面的优化技能文件

按照以下报告文档所述，请全面的更新迭代本项目的多款技能文档。按照报告的改进方案来改造。

- docs\reports\2025-12-31-skill-trigger-failure-analysis.md
- docs\reports\2025-12-31-skill-file-execution-failure-analysis.md

## 064 增加动态设置页面标题的技能 `use-uniapp-dynamic-page-title`

1. 阅读 `src\pages-sub\repair\handle.vue` ，和 `docs\reports\2025-12-28-uniapp-dynamic-page-title-research.md` 报告，学会如何在 uniapp 项目内使用动态标题。
2. 将这个实践经验，转化成可以高度复用的 claude code 技能。命名为 `use-uniapp-dynamic-page-title` 。
3. 编写技能时，务必遵照 claude code 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
4. 及时更新 `.claude\skills\check-trigger.md` 触发器说明文件，说明在需要完成动态页面标题设置时，使用该技能文件。
5. 及时更新 `CLAUDE.md` 文件，说明增加了新的技能。

## 065 新建一个专门说明清楚本项目新建组件的规范性技能文件，`add-new-component`

1. 请你阅读 `src\components\common` 目录下全部的文件和内容，认真调研学习其代码组织方式。
2. 认阅读组件的实例演示页面目录 `src\pages\test-use` 的代码，看懂其代码组织形式。
3. 认真阅读其他全部的 claude code 技能文件组织方式和写法。`.claude\skills` 的全部 markdown 文件。
4. 认真阅读 claude code 的技能：
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
5. 你的任务时，根据 `src\components\common` 组件的组织方式，为我整理归纳一个通用技能，叫做 `add-new-component`，以后我使用 `add-new-component` 技能时，就能约束好增加新的组件规范。我需要你建立新的规范。
6. 新建完 `add-new-component` 后，请及时更新：
   - `.claude\skills\check-trigger.md` ，说明清楚在新建全新的公共组件时，才会触发 `add-new-component` 技能，并执行 `add-new-component` 的规范。
   - `CLAUDE.md` ，说明增加了新的技能。

## 066 更新 `route-migration` 技能，说明不允许使用错误的，不存在的 name 字段

1. 观察以下代码：

```ts
definePage({
	name: "test-z-paging-loading",
	style: {
		navigationBarTitleText: "z-paging-loading 组件测试",
	},
});
```

2. 这个写法就是错误的，可是 `route-migration` 技能没有说清楚 name 字段是非法字段。`route-migration` 技能应该增加这个错误写法说明。并且要极力避免以后出现类似的错误。
3. definepage 使用说明文档：务必要认真阅读该文档，避免 `route-migration` 技能走偏。
   - https://github.com/uni-helper/website/blob/main/content/vite-plugin-uni-pages/2.definepage.md
4. 务必确保在编写 claude code 技能文件时，遵循以下文档的要求：
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## 067 确保 `add-new-component` 技能满足 `route-migration` 的要求

1. 全面阅读 `add-new-component` 技能的文档，确保其实例代码必定满足其 `route-migration` 技能的要求。
2. `src\pages\test-use` 目录内的页面明显不满足 `route-migration` 技能的要求，请修改。

## 068 全面迭代更新 `z-paging-integration` 技能

### 对 pagingRef 的类型约束写法

技能文件的指导写法需要更新，避免出现错误的引导。针对 `z-paging` 组件使用其组件实例的引用时，写法改写成：

1. 旧写法：

没有引用来自全局的 `ZPagingRef` 类型。

```ts
const pagingRef = ref();
```

2. 新的写法：

- https://z-paging.zxlee.cn/start/typescript-support.html
- 应该按照 `typescript-support` 的要求，使用全局的 `ZPagingRef` 类型，来约束组件引用对象的类型。

```ts
const pagingRef = ref<ZPagingRef>();
```

请帮助我更新 `.claude\skills\z-paging-integration\SKILL.md` 技能文件的写法，避免出现错误的引导。

### 增加完成请求时的错误案例

请你在 `.claude\skills\z-paging-integration\SKILL.md` 的 `常见错误模式` 内，增加补全以下写法

错误的请求完成写法： 不应该增加多余的 `response?.total || 0` 部分，该类型写法约束是错误的。

```ts
pagingRef.value?.complete(response?.ownerRepairs || [], response?.total || 0);
```

正确的写法： 不需要多余的 `response?.total || 0` 部分，complete 函数会自己判断是否成功。

```ts
pagingRef.value?.complete(response?.ownerRepairs || []);
```

## 069 严格应用`z-paging-integration` 技能，改写并修复代码写法

`z-paging-integration` 技能有更新，需要更新以下几个列表页的代码写法：

- src\pages-sub\repair\order-list.vue
- src\pages-sub\repair\dispatch.vue
- src\pages-sub\repair\finish.vue
- src\pages-sub\selector 目录内全部的列表页
- src\pages\test-use\z-paging-loading.vue

## 070 改写技能文档的回调写法，从组合式写法改写成链式回调写法

我希望在使用 `alova/client` 模块的 useRequest 函数时，使用紧凑的链式写法。而不是解构出来的 onSuccess 和 onError 函数。

解构出来的 `onError` 和 `onSuccess` 函数，很容易导致代码臃肿，又需要对解构出来的变量做重命名，很容易让整个代码都不得不变的非常冗长。这很不好，很糟糕。

1. 好的紧凑型写法例子： `src\pages-sub\repair\order-list.vue` 的 `加载维修状态字典` 和 `查询维修工单列表请求（z-paging 集成）` 例子。
2. 坏的，冗长的解构并重命名的例子： `src\pages-sub\repair\dispatch.vue` 的 `暂停维修` 和 `启动维修` 例子。

这是一个很严格的，大规模的改写任务。你目前的任务是改写文档，不是直接改写代码。先完成改写技能指导文档的代码写法任务，后续我会安排具体的代码写法改写任务。

1. 首先对 `.claude\skills\api-migration` 技能，增加一个专门讲清楚如何使用 useRequest 函数的部分。
2. 修改其他全部在 `.claude\skills` 目录内的技能文件，修改写法为链式回调写法，而不是组合式解构写法。

## 071 对全部代码应用 `.claude\skills\api-migration\SKILL.md` 的链式回调写法要求

有大量的代码写法没有满足 `.claude\skills\api-migration\SKILL.md` 的链式回调写法要求，需要你帮忙改写。

这些代码包括：

- src\pages 目录下全部的 vue 文件。
- src\pages-sub 目录下全部的 vue 文件。

## 072 调整 `z-paging-integration` 和 `component-migration` 关于常用 props 和必配项 props 的写法

1. 这些必填的 props 配置，已经改写成全局配置了，在 `src\main.ts` 内完成配置。
2. 请更新 `z-paging-integration` 和 `component-migration` 技能文件，避免这些技能文件声明常用 props 和必填 props 必须要填写的情况。
3. 重点说明这些常用配置现在都迁移到 `src\main.ts` 全局 `z-paging` 组件配置内了。
4. 在 `z-paging-integration` 技能内增加专门的章节，说明现在这些常用 props 配置都在 `src\main.ts` 内以全局配置的形式完成。

### 01 全面的修改代码，避免出现手写冗余重复全局 `z-paging` 组件配置

1. `z-paging-integration` 和 `component-migration` 技能文件，已经将常用的 props 改换成全局 props 了，不需要在每个组件内声明清楚了。所以现在全部 `z-paging` 组件的 props 属性，有很大一部分都是全局配置好的，冗余的，需要你删除。
2. 全局识别的文件夹目录范围：
   - src\pages-sub 目录
   - src\pages 目录

## 073 优化组件 `repair-list-search-bar` 的视觉效果

1. 请阅读以下 url 图片：

![2026-01-06-02-55-03](https://s2.loli.net/2026/01/06/63eRqMQBOmK2Gv5.png)

![2026-01-06-02-55-19](https://s2.loli.net/2026/01/06/DhX3ep1mK5lzFnE.png)

![2026-01-06-02-55-27](https://s2.loli.net/2026/01/06/TkWoPYrHBZeFbdc.png)

2. 我需要你优化，美化 `src\components\common\repair-list-search-bar\index.vue` `repair-list-search-bar` `维修列表搜索栏组件` 组件的视觉效果。
3. 请你主动使用 gemini MCP，发挥 gemini MCP 出色精彩的前端设计能力。让 gemini 你给设计一个美观的，大方的界面，最后由你来实施落实。
4. 你只负责实现页面美观程度优化，不涉及到代码层面的写法优化。
5. 更多列表页完整截图页面如下：

![2026-01-06-02-58-15](https://s2.loli.net/2026/01/06/QucxVJon1LYwU9A.png)

![2026-01-06-02-58-22](https://s2.loli.net/2026/01/06/JGAZEkgIwtOnLXu.png)

### 01 优化组件 `repair-list-search-bar` 的视觉效果

1. 我需要你优化，美化 `src\components\common\repair-list-search-bar\index.vue` `repair-list-search-bar` `维修列表搜索栏组件` 组件的视觉效果。
2. 请你主动使用 gemini MCP，发挥 gemini MCP 出色精彩的前端设计能力。让 gemini 你给设计一个美观的，大方的界面，最后由你来实施落实。
3. 你只负责实现页面美观程度优化，不涉及到代码层面的写法优化。
4. 更多列表页完整截图页面如下：

![2026-01-06-03-41-44](https://s2.loli.net/2026/01/06/mwu3MyDRT42NvpI.png)

![2026-01-06-03-41-55](https://s2.loli.net/2026/01/06/sCW3zJFMy9BRNXh.png)

![2026-01-06-03-42-03](https://s2.loli.net/2026/01/06/aio1xyMZYt2W6qf.png)

## 074 优化调整提交后格式化的配置

我在 git 提交过后，会使用 `lint-staged` 的 lint-staged.config.js 配置触发修改后提交。但是我已经使用了 oxlint，可是在修改 markdown 文件时，还是执行了 `!(gitee-example)/**/*!(.md)` 这一部分的逻辑，运行了后续的 eslint，导致每次提交 git 的时候都很慢。

我期望在 `lint-staged.config.js` 内，实现对 md 文件使用 prettier 完成格式化，并且在 `eslint.config.mjs` 内，不对 markdown 做任何处理。

请帮我检查相关的配置文件，并帮助我优化配置。

请你编写适当的测试代码，测试提交 markdown 文档后能否触发 prettier 格式化？能否避开缓慢的 eslint 运行配置？

## 075 处理微信小程序构建时出现的故障

文件 `dist\dev\mp-weixin\app.wxss` 在微信小程序内，出现以下错误。请帮我看看是不是 unocss 或者是项目内那些样式写法导致错误了？

```log
[ WXSS 文件编译错误]
./app.wxss(76:3231): unexpected token `*`(env: Windows,mp,1.06.2504060; lib: 3.13.0)
```

### 01 更新文档

请你更新对应的 `.claude\skills\code-migration` 和 `.claude\skills\style-migration` 技能文档，说明清楚再微信小程序内，不允许使用通配符语法。并确保以后不要再出现这样的样式写法错误。

## 076 处理小程序找不到图片的错误

在微信开发者工具内，运行项目时，进入到首页 `pages/index/index` 内时，控制台报错，称找不到静态资源。

```log
[渲染层网络层错误] Failed to load local image resource /static/image/index/i_complaint.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index/i_inspection.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index/i_repair.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index/i_machine.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index_apply_audit.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index_itemout_audit.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index_allocation.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index_complaint.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
[渲染层网络层错误] Failed to load local image resource /static/image/index_repair.png
 the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
```

## 077 处理微信小程序编译期间出现了警告日志

在运行微信小程序的编译命令时，出现以下警告日志，请帮我看看是不是 unocss 哪里写错了？

```log
[unocss]​ ​failed to load icon "carbon-inbox"​
​[unocss]​ ​failed to load icon "carbon-footprints"​
​[unocss]​ ​failed to load icon "carbon-inspect"​
​[unocss]​ ​failed to load icon "carbon-number"​
​[unocss]​ ​failed to load icon "carbon-lock
```

## 078 首页/工作台的提供的全部页面入口

1. 阅读 `docs\vue2-route-navigation-map.md` 文档。
2. 阅读`旧项目`的首页和工作台相关的代码。
3. 告诉我首页和工作台，应该补全那些入口文件？那些路由是需要能够从首页进入的？

## 079 检查 `api-migration` 技能是否清楚如何使用旧代码的 url 常量文件

1. 全面阅读 `.claude\skills\api-migration` 技能的全部文件。
2. 请问 api 迁移技能是否说明清楚要如何使用并迁移来自旧代码的 `gitee-example\constant\url.js` url 地址常量文件？迁移技能是否清楚被迁移的 api 接口地址从哪里获取？

## 080 阅读报告，并完成全体技能的改动

1. 阅读 `docs\reports\2026-02-15-skills-conflict-analysis-report.md` 。
2. 这个文件说明了，我们项目目前出现了很多技能冲突的问题，请你严格按照该报告的说明要求，新建一个 openspec 长任务，完成该内容。
3. 请你新建一个 agent team 蜂群架构的子代理团队，完成这个 openspec 任务的新建。
