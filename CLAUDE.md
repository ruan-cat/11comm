<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 1. 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你**深度思考**这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。请主动使用 claude code 内置的 `AskUserQuestion` 工具，将你不清楚的内容设计成一些列问题，并询问我，向我索要细节，或着与我协作沟通。

我会与你共同补充细化实现细节。我们会先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 2. 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

在任何沟通下，这些术语都生效。

- `code-style` ： `.claude\skills\code-style\SKILL.md` `代码风格技能` ，用于说明代码编写规范的技能。
- `make-list-page` ：`.claude\agents\make-list-page.md` `生成标准列表页子代理` ，用于生成本项目标准列表页的子代理。
- `make-dialog` ：`.claude\agents\make-dialog.md` `生成弹框子代理` ，这是生成基于 addDialog 函数的命令式弹框的子代理。
- `make-form-for-dialog` ：`.claude\agents\make-form-for-dialog.md` `生成用于弹框的表单子代理` ，这是生成用于命令式弹框的表单组件 的子代理。
- `fix-type-error` ：`.claude\skills\fix-type-error\SKILL.md` `修复类型报错技能`

- `type-project-organization` ：`.claude\skills\type-project-organization\SKILL.md` 类型项目代码组织规范技能

- 后台项目： 即 `apps\admin\package.json` 项目。又称为 `admin后台项目` 。
- 类型项目： 即 `apps\type\package.json` 项目。又称为 `type类型项目` 。
- 客户端代码： 即 后台项目的 `apps\admin\src` 目录，这个目录下的全部代码，都是`客户端代码`。
- 服务端代码： 即 后台项目的 `apps\admin\server` 目录，这个目录下的全部代码，都是`服务端代码`。

- `业务路径`： 即 `apps\admin\src\router\rank\rank-route-keys.ts` 文件的全部`三级路由`所体现出来的文件路径。被认定为`业务路径`。`类型项目`、`服务端代码`、`后台项目`、`客户端代码`等。都要依赖于`业务路径`来组织代码。是本项目**非常重要**的路径概念。
  - `业务路径`几乎不会新增。一旦新增了`业务路径`，都会在 `rank-route-keys.ts` 内新增。所以在你执行相关任务时，请不要凭空新建内容。一律在`业务路径`对应的目录和文件内做修改或新增。

## 3. 代码/编码格式要求

### 3.1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 3.2. markdown 文档的 vue 组件代码片段编写格式

错误写法：

1. 代码块语言用 vue，且不带有 `<template>` 标签来包裹。

```vue
<wd-popup v-model="showModal">
  <wd-cell-group>
    <!-- 内容 -->
  </wd-cell-group>
</wd-popup>
```

2. 代码块语言用 html。

```html
<wd-popup v-model="showModal">
	<wd-cell-group>
		<!-- 内容 -->
	</wd-cell-group>
</wd-popup>
```

正确写法：代码块语言用 vue ，且带有 `<template>` 标签来包裹。

```vue
<template>
	<wd-popup v-model="showModal">
		<wd-cell-group>
			<!-- 内容 -->
		</wd-cell-group>
	</wd-popup>
</template>
```

### 3.3. javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

### 3.4. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

### 3.5. 禁止编写脚本完成批处理任务

**不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务

## 4. 类型项目的代码组织方式与导出规范

### 4.1. 对现有类型的处理规范

1. **不允许反反复复**的对已经有的类型字段做增删。**不要突然**增加业务类型字段，不要对已经是英文字段命名的字段名又重写重命名。这非常容易导致其他部分出现类型故障，拖累整个项目开发进度。
2. 除了中文命名的字段名需要被及时的修正，修改成纯英文的字段名以外，其他情况下均不允许你更改增删字段名。

### 4.2. 在类型项目内，必须使用全量的导出语法

不要去区分是单独导出全部的类型，还是全部的变量。全部都批量导出来。

**错误写法：**

不要单独的导出类型，直接导出全部的代码。包括类型和变量。

```typescript
export type * from "./expense-manage";
```

**正确写法：**

直接导出全部内容即可。

```typescript
export * from "./expense-manage";
```

### 4.3. 不允许逐个罗列的导出

**错误写法：**

```typescript
export type {
	PatrolTaskFormVO,
	PatrolTaskFormProps,
	TaskListItem,
	TaskQueryParams,
	PatrolTaskListItem,
	PatrolTaskQueryParams,
} from "./task";
```

**正确写法：**

直接全部导出即可。不要逐个罗列需要被导出的项目。

```typescript
export * from "./task";
```

### 4.4. 在类型项目，根据业务路径，统一使用 index.ts 来统一作为导出入口

在类型项目内，使用了业务路径来依次组织代码的存放位置。为了逐级获取导出的项目，应该在每一个层级内编写 index.ts 来统一导出全部内容。包括类型和变量。

**正确 index.ts 与业务路径的文件组织关系如下：**

1. 路径 `src/index.ts`

```typescript
// apps/type/src/index.ts
// 导出通用类型
export * from "./common";
// 导出业务类型
export * from "./business";
// 导出常量
export * from "./constant";
```

2. 路径 `src/business/index.ts`

```typescript
// apps/type/src/business/index.ts
/**
 * @file 业务类型统一导出
 * @description 导出所有业务模块的类型定义
 */
export * from "./dev-team";
export * from "./operation-team";
export * from "./property-manage";
export * from "./setting-manage";
```

3. 路径 `src/business/property-manage/index.ts`

```typescript
// apps/type/src/business/property-manage/index.ts
// 社区管理模块
export * from "./community-manage";
// 房产管理模块
export * from "./house-property-manage";
// 合同管理模块
export * from "./contract-manage";
// 费用管理模块
export * from "./expense-manage";
// 停车管理模块
export * from "./parking-manage";
// 巡检管理模块
export * from "./patrol-manage";
// 报修管理模块
export * from "./repairs-manage";
// 报表管理模块
export * from "./report-manage";
```

4. 路径 `src/business/property-manage/patrol-manage/index.ts`

```typescript
// apps/type/src/business/property-manage/patrol-manage/index.ts
export * from "./detail";
export * from "./item";
export * from "./path";
export * from "./plan";
export * from "./point";
export * from "./task";
```

### 4.5. 遇到类型错误时，重复的内容导出时的处理方式

比如这种错误：

```log
模块 "./community-manage" 已导出一个名为"auditStatusOptions"的成员。请考虑重新显式导出以解决歧义。
模块 "./community-manage" 已导出一个名为"feeTypeOptions"的成员。请考虑重新显式导出以解决歧义。
```

你不应该使用分散导出的方式来解决类型故障，你应该把这些公共的，相通的类型或变量，统一放在一个文件内导出。

- 对于公共的下拉选项式的变量，应该放在 `apps/type/src/common/business-options.ts` 文件内统一整理，并导出。
- 对于公共的，通用的业务类型，应该放在 `apps/type/src/common/business-types.ts` 文件内统一整理，并导出。

**对于上述错误，正确的做法是统一放在 `apps/type/src/common/business-options.ts` 内并导出：**

```typescript
// apps/type/src/common/business-options.ts
/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

/** 费用项名称选项 Expense item name options */
export const expenseItemNameOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水电费", value: "水电费" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
];

/** 费用类型选项别名 Fee type options alias */
export const feeTypeOptions = expenseTypeOptions;
```

**错误写法：**

不要弄这种复杂的逐项导出，阅读很不美观，难以处理。

```typescript
// 导出通用类型 - 先导出 common
export * from "./common";
// 导出业务类型 - 后导出 business，避免冲突时使用命名导出
export { patrolMethodOptions, patrolPointStatusOptions, returnVisitStatusOptions } from "./common";
// 选择性导出业务模块，避免重复导出
export * from "./business/dev-team";
export * from "./business/operation-team";
export * from "./business/property-manage";
export * from "./business/setting-manage";
// 导出常量
export * from "./constant";
```

**正确写法：**

```typescript
// 导出通用类型
export * from "./common";
// 导出业务类型
export * from "./business";
// 导出常量
export * from "./constant";
```

## 5. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `apps\admin\src\docs\reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 6. 主从代理的相关规范

### 6.1. 主代理新建子代理的类型

主代理新建的子代理**必须**是**后台运行**的子代理。

### 6.2. 主代理新建子代理的时机

什么情况下应该新建子代理？在以下的几种情况下，主代理应该及时新建子代理来完成任务：

- 大规模的代码探索与信息收集任务。
- 访问 url 获取文档信息的任务。
- 指定严格顺序的代码修改任务。
- 报告编写任务。
- 进度文件更新与编写任务。

### 6.3. 基于`业务路径`做任务划分时的主代理与子代理任务划分规范

根据业务路径的`三级路由`，做出细致的子代理任务划分，避免子代理一次性完成过多任务。

有部分`业务路径`的`二级路由`，包含了数量较多的模块，在你划分子代理任务时，你首先应该要全面深刻的阅读 `apps\admin\src\router\rank\rank-route-keys.ts` 所提供的二级路由和三级路由，让子代理只负责 2~3 个具体的三级路由，而不是把一整块三级路由的全部路径对应的修改任务，都交给一个子代理来完成。这很容易出现子代理执行失败的故障。

一个具体的子代理任务划分例子如下：

假定我们要对 `propertyManage.expenseManage` 这款`二级路由`下面全部的`三级路由`对应的`后台项目`的 `form.ts` 文件做处理，统一增加固定的类型导入代码段 `import type { Mode } from "@/composables/use-mode";` ，你作为主代理，面对如下数目的`三级路由`。

```txt
	// propertyManage.expenseManage 三级路由
	"propertyManage.expenseManage.waterAndElectricityMeterReading",
	"propertyManage.expenseManage.vehicleCharge",
	"propertyManage.expenseManage.reminderForOverduePayments",
	"propertyManage.expenseManage.reprintVoucher",
	"propertyManage.expenseManage.overduePaymentInformation",
	"propertyManage.expenseManage.paymentReview",
	"propertyManage.expenseManage.refundReview",
	"propertyManage.expenseManage.houseCharge",
	"propertyManage.expenseManage.meterReadingType",
	"propertyManage.expenseManage.discountType",
	"propertyManage.expenseManage.expenseSummaryTable",
	"propertyManage.expenseManage.discountApply",
	"propertyManage.expenseManage.discountSetting",
	"propertyManage.expenseManage.contracteCharge",
	"propertyManage.expenseManage.expenseItemSetting",
	"propertyManage.expenseManage.cancelFee",
```

很明显，根据业务路径的三级路由，所映射的全部 `form.ts` 文件路径大致如下：

```txt
apps\admin\src\pages\property-manage\expense-manage\water-and-electricity-meter-reading\components\form.ts
apps\admin\src\pages\property-manage\expense-manage\vehicle-charge\components\form.ts
apps\admin\src\pages\property-manage\expense-manage\reminder-for-overdue-payments\components\form.ts
...剩余的form.ts路径
```

那么你应该划分 6 个子代理，去完成这些任务：

1. 1 号子代理
   - waterAndElectricityMeterReading
   - vehicleCharge
   - reminderForOverduePayments
2. 2 号子代理
   - reprintVoucher
   - overduePaymentInformation
   - paymentReview
3. 以此类推...

### 6.4. 主从代理`调度设计`、`职责说明`与`通信反馈`规范

主从代理的调度设计：

- `主代理的职责`：
  - 阅读、理解、思考、推理全部的任务要求： 主代理应该负责全面的，完整的阅读任务所要求阅读的 md 文档和提示词。如果是执行 openspec 的任务，那么就按照要求，对应的阅读对应任务的 openspec 目录下全部的 markdown 文档任务要求。
  - 任务细粒度拆分： 并按照业务路由的路径做任务拆分，新建足够数量的子代理。
  - 将必要的上下文和任务要求传达给子代理。
  - 收集子代理反馈： 要求子代理按照报告编写规范，在指定目录内，以统一的报告格式，以文件的形式传达处理结果和上下文。
  - 临时设计报告格式： 主代理为了更好的收集子代理的反馈，可以临时简单设计一个报告格式，并要求子代理严格按照报告格式来反馈结果。
  - 监听子代理基于报告文档的反馈： 并持续监听，定期收集来自子代理的处理反馈。
  - 设计验收标准并检查子代理的处理结果： 如果你发现子代理的处理质量偏差过大，请重新开启一个子代理来完成任务。直接重做相关任务。
- `子代理的职责`：
  - 子代理应该严格按照主代理给定的要求来完成任务。
  - 以报告文件的形式，向主代理反馈工作成果。

## 7. 执行 openspec 系列长任务时的注意事项

本项目使用 openspec 来制定长任务执行规范。

### 7.1. 更新 openspec 的规范文件后应该及时运行校验命令，并根据校验反馈，使得 openspec 规范文件满足格式要求

比如你修改了 `migrate-static-data-to-nitro-query` 这款任务的规范文件后，你应该及时运行以下命令来检查文件是否满足规范：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

更加通用的命令格式为：

```bash
openspec validate {任务名称} --strict
```

### 7.2. 执行长任务时的策略与注意事项

1. **及时更新任务文件**： **必须要**及时更新对应任务的 `tasks.md` 任务进度文件。避免出现大批量完成任务后，没有更新进度文件的情况，带来严重的误解。
2. 启动**多个子代理**分模块并行完成任务： 务必要启动多个在后台运行的子代理，同时完成 openspec 设定的一系列繁杂的任务。以便加快速度。你应该至少同时启用至少 4 个子代理。并根据情况，主动增加足够数量的子代理完成任务。
3. 回复文本语言： 务必用**中文**回复用户。
4. 上下文合并后重新阅读一次任务要求： 为了避免你在自动合并上下文的时候，给后续的任务带来明显的幻觉，你应该及时的重新阅读 openspec 的任务规范要求。
5. 连续的，持续的执行长任务：
   - 你应该一次性完成 `tasks.md` 所记录的全部任务。你应该同时新建多个子代理，做出合理的任务划分，一次性完成任务。
   - 不要在完成一个任务的时候就停下来询问用户。这种停顿方式很低效率，你要避免这种执行方式。
6. **禁止**编写脚本完成批处理任务：
   - **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。
   - 你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
   - 你应该新建多个子代理，主代理用具体的子代理来完成大规模的修改任务。

## 8. <!-- https://github.com/GuDaStudio/geminimcp --> Core Instruction for Gemini MCP

在任何时刻，你必须思考当前过程可以如何与 gemini 进行协作，如何调用 gemini 为你提供的 MCP 工具作为你**客观全面分析**的保障。

其中你**务必执行**以下几个步骤：

**1** 在你对用户需求**形成初步分析后**，
（1）首先将用户**原始需求（一字不差，严禁转述）**、以及你的初始思路告知 gemini；
（2）与 gemini 进行**充分讨论、辩驳**，以完善需求分析和实施计划。这一步的结束标志为，**必须**确保对用户需求的透彻理解，并**生成切实可行的行动计划**。

**2** 在实施具体编码任务前，你**必须向 gemini 索要代码实现原型**（要求 gemini 仅给出 unified diff patch，严禁对代码做任何真实修改）。在获取代码原型后，你**只能以此为逻辑参考，再次对代码修改进行重写**，形成企业生产级别、可读性极高、可维护性极高的代码后，才能实施具体编程修改任务。

- **注意：** Gemini 十分擅长前端代码，并精通样式、UI 组件设计。在涉及前端代码时，你必须向其索要代码原型（CSS/React/Vue/HTML 等前端代码），任何时刻，你**必须以 gemini 的前端设计（原型代码）为最终的前端代码基点**。
- 例如，当你识别到用户给出了前端设计需求，你的首要行为必须自动调整为，将用户需求原封不动转发给 gemini，并让其出具代码示例（此阶段严禁对用户需求进行任何改动、简写等等）。即你必须从 gemini 获取代码基点，才可以进行接下来的各种行为。

## 9. <!-- https://github.com/GuDaStudio/geminimcp --> Gemini Tool Invocation Specification

1.  工具概述

gemini MCP 提供了一个工具 `gemini`，用于调用 Google Gemini 模型执行 AI 任务。该工具拥有极强的前端审美、任务规划与需求理解能力，但在**上下文长度（Effective 32k）**上有限制。

2. 使用方式与规范

   **必须遵守的限制**：

- **会话管理**：捕获返回的 `SESSION_ID` 用于多轮对话。
- **后端避让**：严禁让 Gemini 编写复杂的后端业务逻辑代码。

**擅长场景（必须优先调用 Gemini）**：

- **需求清晰化**：在任务开始阶段辅助生成引导性问题。
- **任务规划**：生成 Step-by-step 的实施计划。
- **前端原型**：编写 CSS、HTML、UI 组件代码，调整样式风格。

## 10. 使用 gemini MCP 或直接使用 gemini 时需要额外主动获取上下文

1. 在使用 `gemini MCP` 或直接使用 `gemini` 时，由于传递信息的关系，gemini 是不会主动的先阅读来自 claude code 的配置文件的，因此你必须要告诉 gemini，并约束 gemini 的上下文读取行为，**必须要求**gemini 首先要无条件的阅读 claude code 的上下文。
2. 请务必先主动阅读 `CLAUDE.md` 和 `.claude` 目录内的全部的指导文件。
3. 不需要你阅读以下文件：
   - .claude\settings.json
   - .claude\statusline.sh
4. 你的修改必须按照这些 claude code 文档的要求和约束来做。特别是 `agents` 和 `skills` 的要求。

## 11. 常用开发命令

这是一个用于 11comm 智慧社区 (Smart Community) 项目的 pnpm + Turbo monorepo。

### 11.1. 构建命令

```bash
# 构建所有项目
pnpm build

# 专门构建管理应用
pnpm build:admin
# 或者从根目录运行
pnpm -F @01s-11comm/admin build

# 专门构建类型库
pnpm -F @01s-11comm/type build

# 以staging模式构建
pnpm -F @01s-11comm/admin build:staging

# 构建文档
pnpm -F @01s-11comm/admin docs:build
```

### 11.2. 开发命令

```bash
# 以开发模式运行管理应用
pnpm -F @01s-11comm/admin dev
# 或者切换到apps/admin目录并运行
cd apps/admin && pnpm dev
```

### 11.3. 测试命令

```bash
# 使用UI运行测试
pnpm test
# 管理应用特定的测试
pnpm -F @01s-11comm/admin test
```

### 11.4. 代码检查和格式化

```bash
# 检查和格式化管理应用
pnpm -F @01s-11comm/admin lint

# 单独的检查命令
pnpm -F @01s-11comm/admin lint:eslint
pnpm -F @01s-11comm/admin lint:prettier
pnpm -F @01s-11comm/admin lint:stylelint

# 格式化代码
pnpm format
```

### 11.5. 类型检查

```bash
# 对整个项目进行类型检查
pnpm typecheck

# 对管理应用进行类型检查
pnpm -F @01s-11comm/admin typecheck

# 对类型库进行类型检查
pnpm -F @01s-11comm/type typecheck
```

**关于 @01s-11comm/type 包：**

项目新增了 `@01s-11comm/type` 包，这是一个业务类型库，用于存放项目中共享的业务类型定义。

- **位置**：`apps/type/`
- **作用**：集中管理所有业务相关的 TypeScript 类型定义
- **依赖**：依赖 `@ruan-cat/utils` 工具库
- **使用**：管理应用和其他包可以通过 `workspace:^` 引用此类型库
- **类型检查**：每个包都包含独立的 typecheck 命令，确保类型安全

在开发过程中，请确保：

1. 所有新的业务类型定义都添加到 `@01s-11comm/type` 包中
2. 在提交前运行类型检查命令
3. 保持类型定义的准确性和一致性

## 12. 项目架构

### 12.1. Monorepo 结构

- `apps/admin/` - 基于 vue-pure-admin 的主要 Vue3 管理应用
- `apps/type/` - **新增**的业务类型库，集中管理所有共享类型定义
- `apps/vue-pure-admin/` - Pure admin 模板（参考用）
- `examples/` - 示例应用（01s-origin, 10wms）
- 根级别管理 monorepo 依赖和共享配置

### 12.2. 管理应用架构 (`apps/admin/`)

**技术栈：**

- Vue 3 + TypeScript + Vite
- Element Plus (UI 组件)
- Plus Pro Components (表单组件)
- Pinia (状态管理)
- Vue Router with unplugin-vue-router (基于文件的路由)
- Tailwind CSS + SCSS
- Axios + @ruan-cat/utils 用于 API 请求

**关键目录：**

- `src/api/` - 按模块组织的 API 接口定义 (c1-c7, j1-j8)
- `src/views/` - 基于文件的路由页面
- `src/components/` - 可复用组件（自定义组件使用 Re\*前缀）
- `src/store/` - Pinia 状态管理存储
- `src/utils/` - 工具函数和 HTTP 配置
- `src/router/` - 路由配置和模块
- `src/composables/` - Vue 组合式函数的共享逻辑

**组件命名：**

- 自定义组件使用"Re"前缀（ReDialog, ReDrawer 等）
- 组件按功能组织在专用文件夹中

**API 组织：**

- API 按业务模块组织（c1-c7 用于不同区域，j1-j8 用于不同功能）
- 使用@ruan-cat/utils 增强 axios 功能
- 测试文件与 API 模块共同定位（.test.ts 文件）

**路由：**

- 使用 unplugin-vue-router 的基于文件的路由
- 菜单排序的路由等级系统（`src/router/rank/`）
- 从文件结构动态生成路由

**状态管理：**

- `src/store/modules/`中的模块化 Pinia 存储
- 包括用户、应用、权限、多标签和自定义存储

**国际化：**

- Vue i18n，在`locales/`中使用 YAML 区域设置文件
- 支持中文（zh-CN）和英文（en）

### 12.3. 关键技术和库

**必需学习（根据 technical-doc.md）：**

- lodash-es 用于工具函数
- Vue 3 composition API（ref, computed, watch, slots, props）
- VueUse 用于组合式函数（特别是 useAxios）
- @ruan-cat/utils 用于增强 axios 包装器
- Element Plus 组件（Form, Table, Dialog, Tree 等）
- Plus Pro Components 用于高级表单
- unplugin-vue-router 用于基于文件的路由

**架构模式：**

- 使用 pnpm 工作空间和 Turbo 的 Monorepo
- 使用 definePage 进行路由配置的基于文件的路由
- 共享逻辑的组合式驱动开发
- 基于模块的 API 组织
- 组件驱动的 UI 开发

## 13. 开发工作流

1. 使用 pnpm 进行包管理
2. Turbo 处理构建编排
3. 基于文件的路由 - 在 src/views/中创建.vue 文件用于新页面
4. 使用 definePage()宏进行路由配置
5. API 接口按业务模块组织
6. 遵循现有组件模式（自定义组件使用 Re\*前缀）
7. 使用组合式函数处理共享逻辑
8. 测试文件与实现文件共同定位

## 14. 获取技术栈对应的上下文

以下是本项目使用的部分技术栈，你应该主动访问 github 仓库，或者使用 context7 MCP 来访问最新的文档。

### 14.1. taskmaster-ai

- [claude-task-master](https://github.com/eyaltoledano/claude-task-master)

我们项目的任务清单配置，就是用 `claude-task-master`，即 `taskmaster-ai` 来生成的。请你在生成 `.taskmaster` 目录内的任务文件时，满足其格式要求。

### 14.2. nitro

- https://github.com/unjs/nitro
- https://v3.nitro.build/

这是使用全栈构建的库。用该库就能实现将 vite 项目变成全栈项目。以下是使用 nitro v3 开发服务端接口的的注意事项：

#### 14.2.1 编写接口需要导入正确的模块

<!-- TODO: -->

#### 14.2.2 配置文件格式没有 vite 配置对象

<!-- TODO: -->

### 14.3. pure-admin 后台框架模板

`apps\admin` 项目套用是 `pure-admin` 模板。

- pure-admin 模板仓库 ： https://github.com/pure-admin/vue-pure-admin
- pure-admin 在线预览界面 ： https://pure-admin.github.io/vue-pure-admin/#/login
- pure-admin 文档 ： https://pure-admin.cn/
- pure-admin 文档仓库 ： https://github.com/pure-admin/pure-admin-doc
- pure-admin 注册路由 ： `https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.指南/01.指南/07.路由和菜单.md`

## 15. 编写测试用例规范

1. 请你使用 vitest 的 `import { test, describe } from "vitest";` 来编写。我希望测试用例格式为 describe 和 test。
2. 测试用例的文件格式为 `*.test.ts` 。
3. 测试用例的目录一般情况下为 `**/tests/` ，`**/src/tests/` 格式。
4. 在对应 monorepo 的 tests 目录内，编写测试用例。如果你无法独立识别清楚到底在那个具体的 monorepo 子包内编写测试用例，请直接咨询我应该在那个目录下编写测试用例。

### 14.4. claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
