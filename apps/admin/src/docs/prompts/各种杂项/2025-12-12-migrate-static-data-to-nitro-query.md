<!-- TODO: 一次性提示词 长期任务 未完成 -->

# 2025-12-12 将本地假数据改造，迁移成 nitro 接口

## 初始化 `apps\type` 的专用类型库

我需要你在 `apps\type` 目录内，初始化一个专门存放业务类型的 node 包。

1. 新建 src 目录。
2. 新建 src/index.ts 文件作为本包对外导出类型的入口文件。
3. 未来其他的工具将会在 `apps\type` 内新建各自的业务类型文件。
4. 这个包是私有包，避免发包。
5. 这个包的 main 入口将直接导出 index.ts 文件。
6. 其他包将直接从这里导入所需要的业务类型。

### 01 更新 `migrate-static-data-to-nitro-query` 的 openspec 规范

✅ 已完成：在 `openspec/changes/migrate-static-data-to-nitro-query/specs/type-system/spec.md` 中补充了初始化 `apps\type` 的专用类型库的行为规范。

详细规范请查看：

- `openspec/changes/migrate-static-data-to-nitro-query/specs/type-system/spec.md` - "Requirement: apps/type 包初始化"
- `openspec/changes/migrate-static-data-to-nitro-query/specs/type-system/spec.md` - "Requirement: 类型库基础类型文件"

### 固定提供的接口业务类型

`apps\type` 必须要单独提供两个独立的文件，存放接口请求的接口格式类型。分别是 `JsonVO` 和 `PageDTO` 。请你务必直接照抄以下的代码。

```ts
/**
 * 前后端数据对接数据对象
 * @description
 * 后端 JsonVO 泛型类的前端翻译
 *
 * `01s` 项目统一的数据返回格式
 */
export interface JsonVO<T> {
	/** 状态码 */
	code: number;

	/** 提示消息 */

	message: string;

	/** 数据对象 */
	data: T;
}
```

```ts
/**
 * 数据分页的返回对象
 * @description
 *
 * `01s` 项目统一的数据返回格式
 */
export interface PageDTO<T> {
	/**
	 * 当前页码
	 */
	pageIndex: number;

	/**
	 * 每页显示最大数据条数
	 */

	pageSize: number;

	/**
	 * 总条数
	 */
	total: number;

	/**
	 * 总页数
	 */
	pages: number;

	/**
	 * 当前页数据列表
	 */
	rows: T[];
}
```

## 将本地静态写死的数据转换成真实的 nitro 接口，并在各个页面内使用基于 `@tanstack/vue-query` 的接口请求库

这是一个长期的，巨大的代码写法迁移任务。我们将告别前端本地写死的静态数据，不再使用中文名的字段名和变量名，全部换成英文变量名。

本项目 `apps\admin\package.json` 已经变成了一个基于 nitro 的全栈项目。本次迁移任务就是立足于 vite + nitro 的技术前提而开始的。

我需要你帮我设计一个巨大的，严谨的，完善的，事无巨细的，精确的大型迁移任务计划文档。生成完`迁移实施文档`后，我会将这份 `迁移实施文档` 用 openspec 的方式，转换成一个可以长期使用的，连续调用的长任务清单，以及对应的代码编写规范。

### 主要工作规范 spec

对于每一个静态写死的列表页 vue 组件及其附属代码而言，你的主要迁移步骤是这样的：

1. 明确要重点拆分处理的假数据文件： 阅读每一个 `apps\admin\src\pages` 范围内的 `test-data.ts` 假数据文件。
2. 明确清楚要重点改写接口请求方式写法的 vue 组件： 阅读每一个 `假数据文件` 对应附属的 `index.vue` 列表页文件。
3. 迁移业务类型： 将 `假数据文件` 出现的业务类型，按照代码编写规范，改写并迁移到 `apps\type` 类型专用库内。迁移时需要满足按照对应 index.vue 业务文件目录的方式来迁移业务类型。
4. 编写 nitro 接口： 将列表页的 loadTableData 函数，迁移改写成真实的分页请求接口。
5. 使用 nitro 接口。

### 需要你协助设计的东西

1. 怎么编写 nitro 接口？
2. 怎么编写可以高度复用的列表页接口请求模板？
3. 在当前 vite 项目内，使用 `@tanstack/vue-query` 的最佳实践？

### 将业务类型都迁移到专用的 `apps\type` 类型专用库

### `apps\admin` 管理后台项目将导入生产环境的 `apps\type` 类型专用本地库

1. 以生产环境依赖按照这个类型库。
2. 以 pnpm 工作区协议的方式，安装 pnpm 的 monorepo 包。注意务必满足 pnpm 的工作区协议。

### nitro 编写接口的规范 spec

1. 全部的接口，**必须设计成 post 接口**。**不允许**出现其他请求形式的接口。
2. 接口目录名称规范，与对应的列表页文件的目录规范相同。
3. 每一个接口的数据返回格式为 `apps\type` 类型专用库的 `JsonVO` 类型。
4. 每一个分页请求接口的数据返回格式为 `apps\type` 类型专用库的 `PageDTO` 类型。请注意，务必实现两个泛型类型的嵌套使用。正确的类型约束应该是 `JsonVO<PageDTO<具体的业务类型>>` 的形式。
5. 每一个列表请求接口都应该实现对请求参数的筛选。
6. 不需要考虑链接数据库： 目前阶段的数据全部都使用死数据，不需要使用来自数据库的数据。
7. 每个分页请求的接口的返回值，直接使用固定的，写死的，来自于 `假数据文件` 的 `tableData` 数组。

### nitro 编写接口的代码规范 spec

1. 必须主动使用 `import { defineHandler, readBody } from "nitro/h3";` 写法。在 nitro v3 版本内，要主动的导入工具。没有自动导入功能了。
2. 返回值必须用完整的类型约束。不要直接返回一个对象。

### 代码编写范围规范 spec

你要处理的代码范围非常的大。

1. 整个 `apps\admin\src\pages` 内的全部代码。
2. 全部满足以下文件目录规范的代码：

```txt
│  index.vue     # 列表页
│  test-data.ts  # 假数据文件
└─components
        form.ts  # 表单类型文件
        form.vue # 表单
```

### `@tanstack/vue-query` 请求函数使用规范 spec

### 代码与变量名规范 spec

1. 不允许出现任何形式的中文变量名。
2. 用简单的 jsdoc 注释格式，为变量和类型增加补全说明注释。相当于把中文命名的变量名，迁移到 jsdoc 注释内。

### 确定 openspec 精细化任务工作范围的方案

按照上述的要求，你需要全量的阅读整个项目的代码。这对你来说是不可接受的，你没有足够大的上下文窗口阅读代码，我也没有那么多 token 供你这样使用。请你使用以下的方式来协助确定 openspec 的 tasks.md 任务工作范围，以及需要处理的代码目录：

1. 阅读 `openspec\changes\archive\2025-12-10-sync-taskmaster-test-data-backlog\tasks.md` 文件的目录清单。
2. 参考这一份任务清单，协助编写一个完整的 openspec 格式的 tasks.md 任务工作范围。

### openspec 的规格生成规范 spec

1. 在使用 openspec 的工具将上述要求全部变成满足 openspec 规范文件时，务必要确保不要丢失掉任何具体的 spec 行为规范。我不希望出现转换格式后的规范文件反而缺少了必要的规范。

## 杂项跟进提示词

### 01 确保文件满足规范

1. 运行规范检查命令：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

2. 根据检查命令的信息，修复 `migrate-static-data-to-nitro-query` 系列文件不规范的问题。
3. 修复错误时，请不要删改删减掉现有的规范。不要乱加或乱改规范性的指导内容。
4. 继续运行上述命令，直到没有出现任何规范性报错。
5. 生成一份事故报告，告诉我为什么会出现规范对不上的错误？以及以后该如何避免这一类的错误？

### 02 更新补全 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务列表

在你持续的执行 `migrate-static-data-to-nitro-query` 任务时，你没有及时的更新补全任务列表清单

1. 请你模仿 tasks.md `阶段 2: dev-team 模块迁移 (40 任务，1 周)` 的任务写法，按照 `apps\admin\src\docs\reports\2025-12-12-static-data-migration-to-nitro-query-plan.md` 和 `apps\admin\src\docs\reports\2025-12-12-static-data-migration-to-nitro-query-plan-by-claude-plan-mode.md` 的要求，新建补全完整完善的，细粒度清晰的任务表。
2. 更新任务表。你已经完成了一部分的 nitro 接口生成，请你更新你刚刚生成的任务表。

### 03 增加完成 nitro 接口生成后需要及时删除掉旧 `test-data.ts` 的行为规范

1. 阅读 `apps\admin\src\docs\reports\2025-12-12-static-data-migration-to-nitro-query-plan.md` 和 `apps\admin\src\docs\reports\2025-12-12-static-data-migration-to-nitro-query-plan-by-claude-plan-mode.md` 文档，了解清楚 nitro 假数据迁移的任务需求。
2. 阅读 `openspec\changes\migrate-static-data-to-nitro-query\specs` 的 openspec 任务规范，明确清楚任务规范的 markdown 格式。
3. 在合适的位置，增加完成 nitro 接口生成后需要及时删除掉旧 `test-data.ts` 的行为规范。我希望在完成 nitro 接口迁移后，可以及时的删除掉旧的 `test-data.ts` 文件。
4. 在 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务清单内，增加适当的删除掉旧 `test-data.ts` 假数据文件的子任务。
5. 更新 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务清单的任务总数等信息。
6. 运行以下规范检查命令，确保规范文件满足格式需求。

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

### 04 增加 nitro 编写接口的代码规范和代码写法检查任务

1. 请你阅读 `apps\admin\src\docs\reports\2025-12-12-static-data-migration-to-nitro-query-plan.md` 的 `6.2 Nitro 接口模板` ，了解具体 nitro 的代码写法。
2. 阅读 `apps\admin\src\docs\prompts\各种杂项\2025-12-12-migrate-static-data-to-nitro-query.md` 除开 `杂项跟进提示词` 的部分。了解清楚迁移时需要的具体细节。
3. 按照 openspec 的要求，修改更新 `openspec\changes\migrate-static-data-to-nitro-query\specs` 目录内的规范文件。
4. 在 `migrate-static-data-to-nitro-query` 任务内，有很多接口已经生成了，但是这些接口的代码写法不满足规范要求，请你在 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务清单内，增加 nitro 代码写法检查的任务。
5. 更新 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务清单的任务总数等信息。
6. 运行以下规范检查命令，确保规范文件满足格式需求。

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

### 05 增加新的严格任务执行规范，并重构任务列表

1. 我现在正在高强度的使用 openspec 生成的任务，但是 openspec 任务执行过程中，本身也存在了很多不规范。
2. 完成任务时，应该按照严格的顺序来完成，不要跳过任务。
3. 完成 `migrate-static-data-to-nitro-query` 任务时，应该按照以下的严格步骤来修改每一个列表页：
   - 新建 `apps\type\src\*` 对应目录的业务类型，和下拉选择用的数组。
   - 新建 `apps\admin\server\*` 对应业务目录的 `mock-data.ts` 固定的假数据。其类型约束满足来自 `@01s-11comm/type` 类型库提供的业务类型。
   - 新建 `apps\admin\server\*` 对应业务目录的 `list.post.ts` nitro 接口。
   - 新建 `apps\admin\src\api\*` 对应目录的封装 `useListQuery` 的 hooks 钩子函数。
   - 改写改造对应业务目录的 index.vue 列表页。使其使用封装好的对应业务 hooks 函数、使用来自 `@01s-11comm/type` 类型库提供的业务类型和下拉选用的数组。
   - 删除掉对应业务目录的 `test-data.ts` 假数据文件。
   - 对应的 form.ts 和 form.vue 文件，应该及时更改类型和变量的导入路径，从使用来自 `@01s-11comm/type` 类型库提供的业务类型和下拉选用的数组。
4. 按照 openspec 的要求，修改更新 `openspec\changes\migrate-static-data-to-nitro-query` 目录内的规范文件，务必确保以后执行`migrate-static-data-to-nitro-query` 任务时，能够满足上述的严格修改步骤。
5. 请你阅读 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务文件，按照上述的严格要求，重构整个`任务列表文件`。
6. 重新更新`任务列表文件`的任务总数，和已完成的任务数量。

### 06 以当前暂存区文件为索引，按照任务要求，修改对应 vue 组件和类型文件

1. 以当前暂存区文件为索引，指定一系列的任务，并按照要求更改。
2. 请你严格按照 `openspec\changes\migrate-static-data-to-nitro-query` 目录内的全部文件，来更改代码。
3. 有很多类型文件，为了完成类型修复，而被错误的改写成中文。这是不对的，不符合 `migrate-static-data-to-nitro-query` 任务的要求的。在你修复类型报错的时候，请你在将中文命名的字段换成英文字段的前提下，对应的，及时的去修改 vue 组件内使用的中文命名。
4. 以更新英文字段的 `类型项目` 为索引，对应的去修改 vue 组件内使用的中文命名。
5. 先完成 `类型项目` 内代码的字段名换成英文，再开始去修改 vue 组件的中文字段命名。
6. 不断地运行 `后台项目` 提供的类型报错检查命令，直到整个项目都不出现任何类型报错。

### 07 手动整理公共通用使用的业务类型，并设计新的公共下拉选择数组的新规范

对于类型项目，请你在 `./apps/type/src/business` 目录下面，搜索以下代码片段：

```txt
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
```

1. 请你将这些公共的，跨项目的，通用的下拉选择数组，统一整理整合到 `apps\type\src\common\business-options.ts` 文件内。
2. 你迁移删改了类型项目内内容重复的代码，需要你同步的去 admin 后台项目内，将对应文件的使用做同步性的更改。更改时，不应该使用兼容性的 as 写法，直接更换新的，通用的变量名。
3. 在 `openspec\changes\migrate-static-data-to-nitro-query` 目录内，阅读现有的迁移规范。并且新增满足 openspec 的公共业务下拉选择数组迁移规范。
   > 统一的将这一种满足 `OptionsType` 类型的下拉选择数组，都迁移到 `apps\type\src\common\business-options.ts` 文件内，统一使用这里的下拉选择数组。

### 08 更新 `common-business-options` 规范，禁止类型项目使用含有中文的变量名

1. 阅读该 openspec 规范文件 `openspec\changes\migrate-static-data-to-nitro-query\specs\common-business-options\spec.md`
2. 这个规范文件，本身很不符合其他的规范文件约束。按照其他的 openspec 规范，是不应该在 type 类型项目和 admin 管理后台项目内，使用任何中文变量名的。
3. 请你更新 `openspec\changes\migrate-static-data-to-nitro-query\specs\common-business-options\spec.md` 内的代码实例。避免使用错误的变量名写法。
4. 请你也同步更新类型项目内，使用中文的变量名。
5. 更新使用中文变量名的其他 admin 项目代码。确保变量和类型应用写法相统一。
6. 不要考虑向后兼容的写法，这个改写过程本身就是破坏性变更。
7. 不要主动增加含有中文变量名的写法，不需要兼容。而是 admin 项目代码的变量名，以 type 类型项目的变量名为准。
8. 先更改 type 类型项目的代码，先保证其符合不包含中文变量名的规范；然后再去修改 admin 后台项目的代码。

### 09 清空重设任务清单

1. 我现在正在高强度的使用 openspec 生成的任务，但是 openspec 任务执行过程中，本身也存在了很多不规范。
2. 完成任务时，应该按照严格的顺序来完成，不要跳过任务。
3. 完成 `migrate-static-data-to-nitro-query` 任务时，应该按照以下的严格步骤来修改每一个列表页：
   - 新建 `apps\type\src\*` 对应目录的业务类型，和下拉选择用的数组。
   - 新建 `apps\admin\server\*` 对应业务目录的 `mock-data.ts` 固定的假数据。其类型约束满足来自 `@01s-11comm/type` 类型库提供的业务类型。
   - 新建 `apps\admin\server\*` 对应业务目录的 `list.post.ts` nitro 接口。
   - 新建 `apps\admin\src\api\*` 对应目录的封装 `useListQuery` 的 hooks 钩子函数。
   - 改写改造对应业务目录的 index.vue 列表页。使其使用封装好的对应业务 hooks 函数、使用来自 `@01s-11comm/type` 类型库提供的业务类型和下拉选用的数组。
   - 删除掉对应业务目录的 `test-data.ts` 假数据文件。
   - 对应的 form.ts 和 form.vue 文件，应该及时更改类型和变量的导入路径，从使用来自 `@01s-11comm/type` 类型库提供的业务类型和下拉选用的数组。
   - 对应的 `form.ts` 文件，不仅仅需要将业务类型抽取出来，换成纯英文的方式，然后再引入刚刚写入到 `@01s-11comm/type` 类型库的业务类型。
   - 对应的 `form.vue` 文件，需要从类型库内获取到下拉列表数据，并正确使用下拉列表数据；使用类型库提供的纯英文业务类型。
4. 每一个文件都必须要检查，并遵守 `migrate-static-data-to-nitro-query` 任务的规范文件。在具体执行任务时，你会遇到有很多代码已经不同程度的完成了任务，但是完成的不准确，有很多缺漏。请你务必对每一个经手的文件，做仔细思考，对比代码写法是否符合 `migrate-static-data-to-nitro-query` 任务的规范写法，并做出修改。
5. 按照 openspec 的要求，修改更新 `openspec\changes\migrate-static-data-to-nitro-query` 目录内的规范文件，务必确保以后执行`migrate-static-data-to-nitro-query` 任务时，能够满足上述的严格修改步骤。
6. 请你根据 `apps\admin\src\router\rank\rank-route-keys.ts` 提供的 `RANK_ROUTE_KEYS` 数组，根据数组提供的 `三级路由` ，来清空，并重做整个`openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务文件。`任务列表文件` 的每一个基于 `三级路由` 确定的工作目录，都要按照上面说的任务清单项，列举出非常详细的任务清单步骤。

<!-- TODO: 手动的将 apps\admin\src\composables\use-list-query\index.ts 的逻辑做整合 实现手写的 完整的数据请求功能 -->
