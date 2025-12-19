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

## 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你深度思考这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。

我会与你共同补充细化实现细节。我们先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

### 全局术语

在任何沟通下，这些术语都生效。

- `code-style` ： `.claude\agents\code-style.md` `代码风格子代理` ，用于说明代码编写规范的子代理。
- `make-list-page` ：`.claude\agents\make-list-page.md` `生成标准列表页子代理` ，用于生成本项目标准列表页的子代理。
- `make-dialog` ：`.claude\agents\make-dialog.md` `生成弹框子代理` ，这是生成基于 addDialog 函数的命令式弹框的子代理。
- `make-form-for-dialog` ：`.claude\agents\make-form-for-dialog.md` `生成用于弹框的表单子代理` ，这是生成用于命令式弹框的表单组件 的子代理。
- `fix-type-error` ：`.claude\agents\fix-type-error.md` `修复类型报错子代理`

- 后台项目： 即 `apps\admin\package.json` 项目。又称为 `admin后台项目` 。
- 类型项目： 即 `apps\type\package.json` 项目。又称为 `type类型项目` 。
- 客户端代码： 即 后台项目的 `apps\admin\src` 目录，这个目录下的全部代码，都是`客户端代码`。
- 服务端代码： 即 后台项目的 `apps\admin\server` 目录，这个目录下的全部代码，都是`服务端代码`。

## 代码/编码格式要求

### 1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2. markdown 文档的 vue 组件代码片段编写格式

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

### 3. javascript / typescript 的代码注释写法

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

### 4. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

### 5. 禁止编写脚本完成批处理任务

**不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务

## 报告编写规范

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

## openspec 使用规范

本项目使用 openspec 来制定长任务执行规范。

### 更新 openspec 的规范文件后应该及时运行校验命令，并根据校验反馈，使得 openspec 规范文件满足格式要求

比如你修改了 `migrate-static-data-to-nitro-query` 这款任务的规范文件后，你应该及时运行以下命令来检查文件是否满足规范：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

更加通用的命令格式为：

```bash
openspec validate {任务名称} --strict
```

## 注意事项

1. 每次你完成更改时，都要主动运行类型检查命令。我们项目需要你去运行类型检查命令。需要你主动解决类型报错。

## 常用开发命令

这是一个用于 11comm 智慧社区 (Smart Community) 项目的 pnpm + Turbo monorepo。

### 构建命令

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

### 开发命令

```bash
# 以开发模式运行管理应用
pnpm -F @01s-11comm/admin dev
# 或者切换到apps/admin目录并运行
cd apps/admin && pnpm dev
```

### 测试命令

```bash
# 使用UI运行测试
pnpm test
# 管理应用特定的测试
pnpm -F @01s-11comm/admin test
```

### 代码检查和格式化

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

### 类型检查

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

## 项目架构

### Monorepo 结构

- `apps/admin/` - 基于 vue-pure-admin 的主要 Vue3 管理应用
- `apps/type/` - **新增**的业务类型库，集中管理所有共享类型定义
- `apps/vue-pure-admin/` - Pure admin 模板（参考用）
- `examples/` - 示例应用（01s-origin, 10wms）
- 根级别管理 monorepo 依赖和共享配置

### 管理应用架构 (`apps/admin/`)

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

### 关键技术和库

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

## 开发工作流

1. 使用 pnpm 进行包管理
2. Turbo 处理构建编排
3. 基于文件的路由 - 在 src/views/中创建.vue 文件用于新页面
4. 使用 definePage()宏进行路由配置
5. API 接口按业务模块组织
6. 遵循现有组件模式（自定义组件使用 Re\*前缀）
7. 使用组合式函数处理共享逻辑
8. 测试文件与实现文件共同定位

## 获取技术栈对应的上下文

以下是本项目使用的部分技术栈，你应该主动访问 github 仓库，或者使用 context7 MCP 来访问最新的文档。

### taskmaster-ai

- [claude-task-master](https://github.com/eyaltoledano/claude-task-master)

我们项目的任务清单配置，就是用 `claude-task-master`，即 `taskmaster-ai` 来生成的。请你在生成 `.taskmaster` 目录内的任务文件时，满足其格式要求。

### nitro

- https://github.com/unjs/nitro
- https://v3.nitro.build/

这是使用全栈构建的库。用该库就能实现将 vite 项目变成全栈项目。以下是使用 nitro v3 开发服务端接口的的注意事项：

#### 编写接口需要导入正确的模块

<!-- TODO: -->

#### 配置文件格式没有 vite 配置对象

<!-- TODO: -->
