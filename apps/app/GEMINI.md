# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

（本文件与仓库根目录 `AGENTS.md`、`GEMINI.md` 保持同步，便于不同 AI 工具读取同一套约定。）

## 本项目的技能表

以下清单为 `.claude/skills/` 下技能的索引；**具体触发条件、协同技能与禁止事项以各 `SKILL.md` 正文为准**。

- `add-new-component` — `.claude/skills/add-new-component/SKILL.md` — 在 `src/components/common` 新建公共组件（结构、类型、文档、测试页）。
- `api-error-handling` — `.claude/skills/api-error-handling/SKILL.md` — 基于 Alova useRequest / 全局拦截器的统一接口错误提示。
- `api-migration` — `.claude/skills/api-migration/SKILL.md` — Java110Context + `uni.request` → Alova + TS + Mock。
- `backend-nitro-drizzle` — `.claude/skills/backend-nitro-drizzle/SKILL.md` — Nitro v3 + Neon + Drizzle 后端与数据库访问。
- `beautiful-component-design` — `.claude/skills/beautiful-component-design/SKILL.md` — 移动端页面美化、FormSectionTitle、选择器与弹层规范。
- `code-migration` — `.claude/skills/code-migration/SKILL.md` — Vue2 Options API → Vue3 Composition API + TS。
- `component-migration` — `.claude/skills/component-migration/SKILL.md` — ColorUI / 内置组件 → wot-design-uni。
- `record-bug-fix-memory` — `.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md` — bug 修复后的经验与事故记录沉淀（非调试流程本身）。
- `route-migration` — `.claude/skills/route-migration/SKILL.md` — `pages.json` → 约定式路由与 TypedRouter。
- `style-migration` — `.claude/skills/style-migration/SKILL.md` — ColorUI → UnoCSS + wot-design-uni。
- `use-uniapp-dynamic-page-title` — `.claude/skills/use-uniapp-dynamic-page-title/SKILL.md` — `uni.setNavigationBarTitle` 动态标题。
- `use-wd-form` — `.claude/skills/use-wd-form/SKILL.md` — `wd-form` / `wd-picker` / 校验与分区标题规范。
- `z-paging-integration` — `.claude/skills/z-paging-integration/SKILL.md` — z-paging 与 useRequest / 列表分页。

维护说明：app-local OpenSpec/OPSX 副本已删除，OpenSpec 工作流以 monorepo 根级 canonical skills/commands 为准。

维护说明：新增或重命名技能时，请同步更新本节与「对话沟通术语表」中的简称（如有）。

## 1. 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你**深度思考**这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。在 Claude Code 环境中请主动使用内置的 `AskUserQuestion` 工具，将不清楚的项设计成可选问题并向我确认；在其他 IDE 中则用对话逐条澄清。

我会与你共同补充细化实现细节。我们先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 2. 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

### 2.1. 全局术语

在任何沟通下，这些术语都生效。

- `vue3项目` ： 即 `package.json` 指代的 uniapp 项目。
- `本项目`： 即 `vue3项目` 。
- `vue2项目`： `examples/gitee-exampl-app` 目录下的 uniapp 项目。
- `旧项目`： 即 `vue2项目` 。
- `Vue2 到 Vue3 uni-app 路由迁移映射表`： `docs\prompts\route-migration-map.yml` 文件。
- `api-migration`： api 迁移技能。即 `.claude\skills\api-migration\SKILL.md` 文件。
- `code-migration`： 代码写法迁移技能。即 `.claude\skills\code-migration\SKILL.md` 文件。
- `component-migration`： 组件迁移技能。即 `.claude\skills\component-migration\SKILL.md` 文件。
- `route-migration`： 路由迁移技能。即 `.claude\skills\route-migration\SKILL.md` 文件。
- `style-migration`： 样式迁移技能。即 `.claude\skills\style-migration\SKILL.md` 文件。

- `api-error-handling`： 接口错误提示能力技能。即 `.claude\skills\api-error-handling\SKILL.md` 文件。
- `z-paging-integration`： `z-paging 分页组件集成方案` 技能。即 `.claude\skills\z-paging-integration\SKILL.md` 文件。
- `use-wd-form`： `使用 wd-form 表单组件编写表单页的实施规范` 技能。即 `.claude\skills\use-wd-form\SKILL.md` 文件。
- `use-uniapp-dynamic-page-title`： `uni-app 动态页面标题设置` 技能。即 `.claude\skills\use-uniapp-dynamic-page-title\SKILL.md` 文件。
- `add-new-component`： `新建公共组件规范` 技能。即 `.claude\skills\add-new-component\SKILL.md` 文件。
- `record-bug-fix-memory`： bug 修复经验沉淀技能（非调试本身）。即 `.claude\skills\fix-bug\record-bug-fix-memory\SKILL.md` 文件。

### 2.2. 业务术语

在实现具体业务时，某些热点组件会经常修改，为了便于沟通，这里说明清楚其简称，便于你快速找到对应组件。

- `选择器系列页面` ： `src\pages-sub\selector\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.1. 维修工单流程模块

- `维修工单流程模块系列页面` ： `src\pages-sub\repair\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.2. 房屋申请业务

- `房屋申请列表页` ： `src\pages-sub\property\apply-room.vue`
- `房屋申请记录页` ： `src\pages-sub\property\apply-room-record.vue`
- `房屋申请详情页` ： `src\pages-sub\property\apply-room-detail.vue`
- `房屋申请记录详情页` ： `src\pages-sub\property\apply-room-record-detail.vue`
- `房屋申请记录处理页` ： `src\pages-sub\property\apply-room-record-handle.vue`
- `房屋申请系列页面` ： `src\pages-sub\property\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.3. 活动业务

- `活动操作按钮组件` ： `src\components\activity\activity-actions.vue`
- `活动信息组件` ： `src\components\activity\activity-info.vue`
- `活动详情页` ： `src\pages\activity\detail.vue`
- `活动列表页` ： `src\pages\activity\index.vue`

## 3. 迁移任务的重要原则

在实现 `vue3项目` 迁移到 `vue2项目` 时，请遵守以下几条重要原则：

1. 所有的接口都是 mock 假接口： 全部的接口都是使用本地的 `vite-plugin-mock-dev-server` 插件实现的假接口。
2. 不考虑严格的登录逻辑： 我们不做任何登录功能。关于 token 的存储，读取，管理，使用的功能与逻辑，在 `vue3项目` 内都不做。
3. 不考虑严格的鉴权逻辑： 我们不做任何鉴权功能。在跳转路由的时候，`vue3项目` 不做任何形式的鉴权处理。任何页面都可以随意跳转，任意访问。
4. 不许滥用 unocss 的 shortcuts 功能： 不要将业务性质的，非公共性质的样式类，都写入到 `uno.config.ts` 配置文件内。避免滥用全局变量性质的配置文件，

## 4. 技能触发与协同策略

### 4.1. ⚠️ 强制执行技能触发检查

**在执行任何开发任务前，必须先阅读 `.claude/skills/check-trigger.md` 进行技能触发检查。**

该文件提供了系统化的技能识别流程，帮助确保：

- ✅ 识别所有相关技能（避免遗漏）
- ✅ 理解多技能协同关系（避免单一技能思维）
- ✅ 按照正确顺序执行（避免顺序混乱）

### 4.2. 技能触发矩阵

根据任务特征快速识别需要使用的技能：

|        任务特征        |                                                         必须使用的技能                                                         |                              说明                              |
| :--------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------: |
|    包含 `<wd-form>`    |                                          `use-wd-form` + `beautiful-component-design`                                          |                  表单页面必须同时使用两个技能                  |
|      需要选择功能      |                                              `use-wd-form`（第 3.2 节 wd-picker）                                              |            必须使用 wd-picker，禁止 wd-radio-group             |
|    需要表单分区标题    |                                     `beautiful-component-design`（form-section-title.md）                                      | 必须使用 FormSectionTitle，禁止 `<view class="section-title">` |
|      需要美化组件      |                                                  `beautiful-component-design`                                                  |                 添加图标、调整样式、响应式设计                 |
|    ColorUI 组件迁移    |                                                     `component-migration`                                                      |            ColorUI / uni-app 组件 → wot-design-uni             |
|    ColorUI 样式迁移    |                                                       `style-migration`                                                        |                  ColorUI 类名 → UnoCSS 原子类                  |
|      API 接口迁移      |                                                        `api-migration`                                                         |       Java110Context + uni.request → Alova + TypeScript        |
| Vue2 到 Vue3 代码迁移  |                                                        `code-migration`                                                        |           Options API → Composition API + TypeScript           |
|        路由迁移        |                                                       `route-migration`                                                        |                    pages.json → 约定式路由                     |
|      需要分页功能      |                                `z-paging-integration` + `api-migration` + `api-error-handling`                                 |                 z-paging 几乎总是需要 3 个技能                 |
|    需要接口错误提示    |                                                      `api-error-handling`                                                      |                 所有 API 调用都应该有错误提示                  |
|    需要动态页面标题    |                                                `use-uniapp-dynamic-page-title`                                                 |      根据参数/状态动态设置标题（如派单/转单显示不同标题）      |
|      新建公共组件      |                                                      `add-new-component`                                                       |          src/components/common 目录下新建公共组件规范          |
| 从 Vue2 完整迁移表单页 | `code-migration` + `component-migration` + `style-migration` + `use-wd-form` + `api-migration` + `beautiful-component-design`  |                       需要 6 个技能协同                        |
| 从 Vue2 完整迁移列表页 | `code-migration` + `component-migration` + `style-migration` + `api-migration` + `z-paging-integration` + `api-error-handling` |                       需要 6 个技能协同                        |

### 4.3. 多技能协同原则

**⚠️ 重要：大多数实际任务都需要多个技能协同，禁止单一技能思维！**

#### 4.3.1. 表单页面的技能组合

```plaintext
表单页面（创建/修改）：
  - use-wd-form（必须）- 表单结构、wd-picker、校验规则
  - beautiful-component-design（必须）- FormSectionTitle、图标、美化
  - api-migration（如果有接口）- API 调用
  - api-error-handling（如果有接口）- 错误提示
```

**检查清单**：

- [ ] 包含 `<wd-form>` → 必须使用 `use-wd-form`
- [ ] 需要分区标题 → 必须使用 `beautiful-component-design`（FormSectionTitle）
- [ ] 有选择功能 → 必须使用 `wd-picker`（禁止 wd-radio-group）
- [ ] 需要调用 API → 必须使用 `api-migration` + `api-error-handling`

#### 4.3.2. 列表页面的技能组合

```plaintext
列表页面（分页列表）：
  - z-paging-integration（必须）- 分页组件
  - api-migration（必须）- API 接口
  - api-error-handling（必须）- 错误提示
  - beautiful-component-design（可选）- 美化
```

#### 4.3.3. 从 Vue2 迁移的技能组合

```plaintext
从 Vue2 迁移单个页面：
  - code-migration（必须）- Vue2 → Vue3 代码写法
  - component-migration（必须）- ColorUI → wot-design-uni
  - style-migration（必须）- 样式类名迁移
  - route-migration（必须）- 路由配置迁移
  - 根据页面类型添加：
    - 表单页：+ use-wd-form + beautiful-component-design
    - 列表页：+ z-paging-integration + api-migration + api-error-handling
```

### 4.4. 技能执行流程

**强制执行以下流程：**

```plaintext
收到任务
  ↓
步骤 1：技能触发检查
  - 打开 .claude/skills/check-trigger.md
  - 逐项回答检查问题
  - 生成技能清单
  ↓
步骤 2：阅读所有相关技能
  - 阅读每个技能的主文件（SKILL.md）
  - 阅读所有子文档（*.md）
  - 查阅推荐的示例文件
  ↓
步骤 3：理解技能协同关系
  - 确认技能之间的依赖关系
  - 理解执行顺序
  ↓
步骤 4：创建任务清单
  - 使用 TodoWrite 列出所有任务
  - 包含"阅读技能文件"的任务
  ↓
步骤 5：开始执行
  - 严格按照技能文件规范执行
  - 逐项完成任务并标记
```

### 4.5. 违规后果警告

**如果跳过技能触发检查或只使用部分技能，将导致：**

- ❌ 使用错误的组件（如 `wd-radio-group` 代替 `wd-picker`）
- ❌ 使用错误的样式类（如 `<view class="section-title">` 代替 `FormSectionTitle`）
- ❌ 组件嵌套顺序错误
- ❌ 缺少必需的功能和美化效果
- ❌ 代码不符合项目规范
- ❌ **需要返工重写，浪费时间**

### 4.6. 快速参考

**常见问题快速查询：**

1. **Q: 如何判断需要使用哪些技能？**
   - A: 阅读 `.claude/skills/check-trigger.md`，按照检查清单逐项回答

2. **Q: 表单页面需要使用哪些技能？**
   - A: 至少需要 `use-wd-form` + `beautiful-component-design`

3. **Q: 什么时候使用 wd-picker，什么时候使用 wd-radio-group？**
   - A: 绝大多数情况使用 `wd-picker`；只有动态场景（选项不固定）才考虑 `wd-radio-group`

4. **Q: 如何添加表单分区标题？**
   - A: 必须使用 `FormSectionTitle` 组件，禁止使用 `<view class="section-title">`

5. **Q: 分页功能需要哪些技能？**
   - A: 必须同时使用 `z-paging-integration` + `api-migration` + `api-error-handling` 三个技能

## 5. 代码/编码格式要求

### 5.1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 5.2. markdown 文档的 vue 组件代码片段编写格式

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

### 5.3. javascript / typescript 的代码注释写法

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

### 5.4. unocss 配置不应该创建过多的 shortcuts 样式类快捷方式

在你做样式迁移的时候，**不允许滥用** unocss 的 shortcuts 功能。不要把那么多样式类都设计成公共全局级别的快捷方式。

### 5.5. vue 组件编写规则

1. vue 组件命名风格，使用短横杠的命名风格，而不是大驼峰命名。
2. 先 `<script setup lang="ts">`、然后 `<template>`、最后是 `<style scoped>` 。
3. 每个 vue 组件的最前面，提供少量的 html 注释，说明本组件是做什么的。

### 5.6. jsdoc 注释的 `@example` 标签不要写冗长复杂的例子

1. 你应该积极主动的函数编写 jsdoc 注释的 `@example` 标签。
2. 但是 `@example` 标签不允许写复杂的例子，请写简单的单行例子。完整的函数使用例子，你应该择机在函数文件的附近编写 md 文档，在文档内给出使用例子。

### 5.7. 页面 vue 组件必须提供注释说明本组件的`业务名`和`访问地址`

比如以下的这几个例子：

```html
<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room
-->
```

```html
<!--
  房屋申请详情页
  功能：显示房屋申请详细信息，支持验房和审核操作

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room-detail
  建议携带参数: ?ardId=xxx&communityId=xxx

  http://localhost:3000/#/pages-sub/property/apply-room-detail?ardId=ARD_002&communityId=COMM_001

-->
```

每个页面都必须提供最顶部的文件说明，说明其业务名称，提供访问地址。

### 5.8. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的二级标题、三级标题和四级标题，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 6. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `docs\reports` 文件夹内编写报告。
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

## 7. 其他注意事项

1. 每次你完成更改时，都**不要运行**任何类型检查命令。我们项目不需要你去运行类型检查命令。
2. 不要去更改 `prettier.config.js` 文件，**不要自作主张**的给这个配置文件**增加单引号**。
3. 报告输出地址： 你在生成 markdown 格式的报告时，请默认输出到 `docs\reports` 目录下面，这便于我阅读。

## 8. 代码搜索与检查策略

### 8.1. 为什么需要严格的搜索策略？

在进行代码规范检查、组件用法迁移等任务时，**单次搜索极易遗漏**，可能导致：

- ❌ 特殊字符转义问题导致搜索失败（如 `<template #value>` 搜索不到结果）
- ❌ 依赖单一搜索方式，没有交叉验证
- ❌ 只检查部分文件，未系统性覆盖所有相关文件

### 8.2. 多重搜索策略（必须执行）

当需要在代码库中查找特定模式时，**必须使用至少 2 种以上的搜索方法**进行交叉验证：

#### 8.2.1. 方法 A：正则表达式搜索

```bash
# 示例：搜索 <template #value> 用法
Grep: pattern="template.*#value" path="src/" glob="*.vue"
```

**适用场景**：查找包含特定关键词组合的代码模式

#### 8.2.2. 方法 B：宽泛关键词搜索 + 人工筛选

```bash
# 示例：搜索所有 wd-cell 用法，手动筛选错误用法
Grep: pattern="wd-cell" path="src/pages-sub/repair" glob="*.vue" output_mode="content"
```

**适用场景**：当正则表达式难以精确匹配，需要人工判断时

#### 8.2.3. 方法 C：搜索相关标签/属性

```bash
# 示例：搜索所有 template 插槽用法
Grep: pattern="<template #" path="src/" glob="*.vue"
```

**适用场景**：从更广的范围搜索，避免遗漏边缘情况

### 8.3. 系统性检查方法（用于重要任务）

对于关键的代码规范检查（如组件迁移、API 迁移），**禁止仅依赖搜索**，必须：

#### 8.3.1. 步骤 1：列出所有相关文件

```bash
# 使用 Glob 工具列出所有需要检查的文件
Glob: pattern="**/*.vue" path="src/pages-sub/repair"
```

#### 8.3.2. 步骤 2：逐文件阅读关键部分

- 不要跳过任何一个相关文件
- 重点检查 `<template>` 区域的组件用法
- 检查 `<script>` 区域的类型导入和 API 调用

#### 8.3.3. 步骤 3：交叉验证

- 用不同搜索方法确认结果一致性
- 搜索结果为 0 时，**必须用另一种方法再次确认**

### 8.4. 常见搜索场景示例

#### 8.4.1. 场景 1：检查 `wd-cell` 组件的错误用法

```bash
# 方法 A：搜索 #value 插槽（错误用法）
Grep: pattern="template.*#value" path="src/" glob="*.vue"

# 方法 B：搜索 #title 插槽（大多数情况下是错误的）
Grep: pattern="template.*#title" path="src/" glob="*.vue"

# 方法 C：搜索所有 wd-cell 用法，人工检查
Grep: pattern="wd-cell" path="src/" output_mode="content" -n=true
```

#### 8.4.2. 场景 2：检查 API 调用方式

```bash
# 方法 A：搜索旧的 API 调用方式
Grep: pattern="Java110Context" path="src/"

# 方法 B：搜索未迁移的 uni.request
Grep: pattern="uni\.request" path="src/"

# 方法 C：检查所有 api 文件是否使用新的 Alova 方式
Glob: pattern="*.ts" path="src/api"
# 然后逐个文件检查导入语句
```

#### 8.4.3. 场景 3：检查样式迁移情况

```bash
# 方法 A：搜索旧的 ColorUI 类名
Grep: pattern="cu-" path="src/" glob="*.vue"

# 方法 B：搜索未迁移的内联样式
Grep: pattern="style=" path="src/" glob="*.vue"

# 方法 C：检查所有 scoped style 块
Grep: pattern="<style.*scoped" path="src/"
```

### 8.5. 避免遗漏的检查清单

当执行代码规范检查任务时，请务必完成以下清单：

- [ ] **至少使用 2 种不同的搜索方法**进行交叉验证
- [ ] **搜索结果为 0 时，必须用第二种方法再次确认**（避免搜索语法错误）
- [ ] **对于关键任务，列出所有相关文件并逐个检查**（不依赖搜索）
- [ ] **在修改后，立即搜索验证是否还有遗漏**
- [ ] **记录搜索过程**，便于复查和调试

### 8.6. 错误示例与改进

#### 8.6.1. ❌ 错误做法

```bash
# 单次搜索，搜索失败就认为"没问题"
Grep: pattern="<template #value>"  # 可能因转义问题搜索不到
# 结果：No matches found
# 错误结论：没有错误用法 ❌
```

#### 8.6.2. ✅ 正确做法

```bash
# 方法 1：正则表达式
Grep: pattern="template.*#value"
# 结果：找到 3 处

# 方法 2：宽泛搜索 + 人工筛选
Grep: pattern="<template #" output_mode="content"
# 结果：找到 3 处（交叉验证一致）

# 方法 3：列出所有文件逐个检查
Glob: pattern="*.vue" path="src/pages-sub/repair"
# 逐个文件阅读 <template> 区域
```

### 8.7. 搜索命令速查表

|     任务      |             推荐搜索命令              |                备用搜索命令                 |
| :-----------: | :-----------------------------------: | :-----------------------------------------: |
| 查找插槽用法  |   `Grep: pattern="template.*#\w+"`    |        `Grep: pattern="<template #"`        |
| 查找组件用法  |       `Grep: pattern="<wd-\w+"`       | `Grep: pattern="wd-" output_mode="content"` |
| 查找 API 调用 | `Grep: pattern="import.*from.*@/api"` |        `Grep: pattern="useRequest"`         |
| 查找样式类名  |       `Grep: pattern="class="`        |          `Grep: pattern="<style"`           |

## 9. 项目概述

这是基于 unibest 框架的智慧社区物业管理系统，使用 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 技术栈开发，支持 H5、小程序、APP 多平台。

## 10. 开发环境要求

- Node.js >= 22
- pnpm >= 10
- Vue Official >= 2.1.10
- TypeScript >= 5.0

## 11. 常用开发命令

### 11.1. 安装依赖

```bash
pnpm install
```

### 11.2. 开发环境

```bash
# H5 开发 (默认端口 3000)
pnpm dev
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp
pnpm dev:mp-weixin

# APP 开发
pnpm dev:app

# 其他小程序平台
pnpm dev:mp-alipay    # 支付宝小程序
pnpm dev:mp-baidu     # 百度小程序
pnpm dev:mp-toutiao   # 字节跳动小程序

# 测试/生产环境
pnpm dev:test         # 测试环境
pnpm dev:prod         # 生产环境
```

### 11.3. 构建打包

```bash
# H5 构建
pnpm build
pnpm build:h5

# 微信小程序构建
pnpm build:mp
pnpm build:mp-weixin

# APP 构建
pnpm build:app

# 环境区分构建
pnpm build:test       # 测试环境构建
pnpm build:prod       # 生产环境构建
```

### 11.4. 代码质量检查

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check
```

### 11.5. 其他常用命令

```bash
# 依赖升级
pnpm up-taze

# API 接口类型生成
pnpm openapi-ts-request

# 文档开发/构建
pnpm docs:dev
pnpm docs:build

# 持续集成构建
pnpm ci
```

## 12. 项目架构与目录结构

### 12.1. 核心配置文件

- `package.json` - 项目依赖和脚本配置
- `vite.config.ts` - Vite 构建配置，包含插件配置和平台适配
- `manifest.config.ts` - uni-app 应用清单配置
- `pages.config.ts` - 页面路由配置
- `uno.config.ts` - UnoCSS 配置
- `tsconfig.json` - TypeScript 配置

### 12.2. 源码目录结构

```plain
src/
├── api/            # API 接口定义
├── components/     # 公共组件
├── hooks/          # Vue3 组合式函数
├── http/           # HTTP 请求封装
├── layouts/        # 页面布局组件
├── pages/          # 主要页面文件
├── pages-sub/      # 分包页面
├── router/         # 路由配置
├── service/        # 业务服务层
├── static/         # 静态资源
├── store/          # 状态管理 (Pinia)
├── style/          # 全局样式
├── tabbar/         # 底部导航栏
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── App.vue         # 应用入口组件
├── main.ts         # 应用入口文件
└── uni.scss        # uni-app 全局样式
```

### 12.3. 核心技术栈

- **框架**: uni-app 3.x (Vue3 + TypeScript)
- **构建工具**: Vite 5.x
- **状态管理**: Pinia 2.x + pinia-plugin-persistedstate (持久化)
- **HTTP 请求**: Alova (适配 uni-app)
- **UI 组件库**: wot-design-uni
- **样式方案**: UnoCSS + SCSS
- **分页组件**: z-paging
- **日期处理**: dayjs
- **代码质量**: ESLint + TypeScript + husky + commitlint

### 12.4. 环境配置

项目使用自定义 `env/` 目录管理环境变量：

- `env/.env.development` - 开发环境配置
- `env/.env.test` - 测试环境配置
- `env/.env.production` - 生产环境配置

### 12.5. 路由与页面管理

- 使用约定式路由，文件名即路由路径
- 支持分包加载，分包页面放在 `pages-sub/` 目录
- 布局组件放在 `layouts/` 目录，支持嵌套布局

### 12.6. 平台适配策略

- 使用条件编译 (`#ifdef` / `#endif`) 处理平台差异
- 支持的平台：H5、微信小程序、APP、支付宝小程序等
- 平台特定代码应放在对应的条件编译块中

### 12.7. 开发调试

- **H5**: 访问 http://localhost:3000
- **微信小程序**: 构建后导入 `dist/dev/mp-weixin` 到微信开发者工具
- **APP**: 构建后导入 `dist/dev/app` 到 HBuilderX

### 12.8. 业务特点

这是一个智慧社区物业管理系统，主要功能模块包括：

- 公告管理
- 维修录单
- 通讯录
- 投诉录单
- 物业员工工作台

当前项目处于开发阶段，使用 `dev-rc` 分支进行开发，主分支为 `main`。

### 12.9. 重要注意事项

1. 必须使用 pnpm 作为包管理器
2. 代码提交前会自动进行 ESLint 检查和格式化
3. 遵循 uni-app Vue3 + TypeScript 开发规范
4. 新增组件会自动注册，无需手动引入
5. 使用 UnoCSS 进行样式开发，支持原子化 CSS

## 13. 编写测试用例规范

1. 请你使用 vitest 的 `import { test, describe } from "vitest";` 来编写。我希望测试用例格式为 describe 和 test。
2. 测试用例的文件格式为 `*.test.ts` 。
3. 测试用例的目录一般情况下为 `**/tests/` ，`**/src/tests/` 格式。
4. 在对应 monorepo 的 tests 目录内，编写测试用例。如果你无法独立识别清楚到底在那个具体的 monorepo 子包内编写测试用例，请直接咨询我应该在那个目录下编写测试用例。

## 14. 生成发版日志的操作规范

在你生成发版日志时，按照以下规范来完成：

1. 新建文件： 运行命令 `pnpm dlx @changesets/cli add --empty` ，该命令会在 `.changeset` 目录下，新建一个空的 markdown 文件，这个文件就是你要写入的发版日志。
2. 发版日志文件重命名： 这个命令会新建一个随机名称的发版日志文件，请你按照报告的规格，换成日期加语义化更新内容的名称。比如 `2025-12-15-add-pnpm-workspace-yaml.md` 就是有意义的命名。
3. yaml 区域写入 changeset 规格的发版信息： 写入发版包名，和`发版标签`的等级。
4. 写入更新日志： 在正文内编写更新日志。
5. 编写更新日志正文的行文规范：
   - 禁止使用任何等级的 markdown 标题： 编写任何`发版标签`的更新日志时，不允许使用任何等级的 markdown 标题，比如一级标题、二级标题等。这会影响自动合并的 `CHANGELOG.md` 文档的美观度。必须使用 markdown 的序号语法。
   - major： 详细，清晰。说明清楚 major 版本的重大变更。
   - minor： 用有序序号，简明扼要的说明清楚更新日志即可。
   - patch： 用有序序号，简明扼要的说明清楚更新日志即可。

### 14.1. 发版日志相关术语

- `生成更新日志` ： 指的是在 `.changeset` 目录内，编写面向 changeset 的更新日志文件。其`发版标签`分为 `major` `minor` `patch` 这三个档次。如果我在要求你生成更新日志时，没有说明清楚`发版标签`具体发版到那个等级，请及时询问我。要求我给你说明清楚。
- `生成发版日志` ： `生成更新日志` 的别名，是同一个意思。

## 15. 沟通协作要求

### 15.1. `计划模式`

在`计划模式`下，请你按照以下方式与我协作：

1. 你不需要考虑任何向后兼容的设计，允许你做出破坏性的写法。请先设计一个合适的方案，和我沟通后再修改实施。
2. 如果有疑惑，请询问我。
3. 完成任务后，请告知我你做了那些破坏性变更。

请注意，在绝大多数情况下，我不会要求你以这种 `计划模式` 来和我协作。

## 16. 终端操作注意事项（防卡住）

在 Windows PowerShell 环境下执行终端命令时，必须遵循以下规则，避免命令卡住浪费时间：

### 16.1. 避免超长单行命令

命令行参数过多（超过 200 字符）时，PowerShell 可能会挂起无响应。

- **拆分命令**：每次传入 2~3 个文件路径，不要一次传入 5 个以上。
- **使用通配符**：优先用 `git add scripts/.../src/*.ts` 替代逐个列举文件路径。

### 16.2. 优先使用 `pnpm run` 而非 `npx`

`npx` 在 Windows 上被终止时，会触发 `Terminate batch job (Y/N)?` 交互提示导致卡住。

- **优先使用** `pnpm run build` 替代 `npx tsdown`。
- **优先使用** `pnpm run test` 替代 `npx vitest run`。

### 16.3. 及时止损，不要反复轮询

当命令可能卡住时：

1. 第 1 次状态检查等待 10~15 秒。
2. 如果无输出且仍在运行 → **立即终止**，用新命令重试。
3. **不要超过 2 次**状态检查仍无进展还继续等待。

### 16.4. 合理的等待超时设置

|         命令类型         | 建议等待时长 |
| :----------------------: | :----------: |
| `git add / status / log` |   5~10 秒    |
|       `git commit`       |    10 秒     |
| `pnpm run build / test`  |    30 秒     |
|      `pnpm install`      |    60 秒     |

## 17. 简单任务的高效执行原则

当用户交代的任务范围明确清晰时，必须**直接行动**，禁止进行不必要的大范围侦察。

### 17.1. 判断任务规模，选择正确的行动姿态

| 任务信号                         | 正确行动               |
| :------------------------------- | :--------------------- |
| 用户通过 `@文件` 明确了操作范围  | 直接读该文件，立即动手 |
| 用户说"帮我改这个"、"写个日志"   | 行动优先，缺什么补什么 |
| 用户涉及多包架构改动、新功能设计 | 先侦察，再行动         |

**核心原则**：用户提供的上下文（@文件引用、对话内容、当前打开文件）就是最直接的线索，优先使用，不要用命令重新发现已知信息。

### 17.2. 禁止行为清单

以下行为在**简单任务**（单文件改动、写 changeset、写提交信息等）中是被禁止的：

- 禁止连续执行超过 3 次 `git log` 来"了解全貌"
- 禁止在明确知道目标文件的情况下，仍去扫描整个项目目录
- 禁止把"读遍所有相关文档"当作行动前置条件
- 禁止在用户已给出 @文件 的情况下，用命令重新搜索文件位置

### 17.3. 对用户纠偏提示立即响应

当用户发出以下信号时，必须**立即停止对当前路径的死磕**，回归最小行动路径：

- "太复杂了"
- "不要反复查询"
- "直接做就行"
- "按要求做即可"

正确反应：停止当前侦察行为 → 明确当前已知信息 → 直接执行最核心的操作步骤。

### 17.4. 简单任务的标准执行路径

以"为某文件修改编写更新日志"为例，正确路径只有 3 步：

1. 读目标文件，理解改了什么
2. 执行 `pnpm dlx @changesets/cli add --empty`，重命名文件，写入内容
3. 提交

不需要查 git log，不需要扫描全部 tags，不需要对比所有包的版本号。

## 18. 获取技术栈对应的上下文

在处理特定技术栈相关的问题时，你应该主动获取对应的上下文文档和最佳实践。

### 18.1. 阅读 `wot-design-uni` 组件库的文档

我们项目是移动端项目，高强度的使用了 `wot-design-uni` 组件库。你应该在编写 vue 组件时，主动地获取组件库的文档，及时使用正确的组件。

#### 18.1.1. 文档资源

- **官方文档**: https://wot-ui.cn/guide/quick-use.html （推荐优先查看）
- **GitHub 文档**: https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component

#### 18.1.2. 类型导入的正确方式

⚠️ **重要**：本项目使用 pnpm 安装 wot-design-uni，而不是 uni_modules 插件方式。

**正确的类型导入路径格式**：

```typescript
// ✅ 正确 - 本项目使用方式
import type { FormRules } from "wot-design-uni/components/wd-form/types";
import type { UploadBeforeUpload, UploadFile } from "wot-design-uni/components/wd-upload/types";

// ❌ 错误 - GitHub 文档示例（仅适用于 uni_modules 安装方式）
import type { FormRules } from "@/uni_modules/wot-design-uni/components/wd-form/types";
```

**路径转换规则**：

如果从 GitHub 文档中看到的导入路径是：

```typescript
import type { XXX } from "@/uni_modules/wot-design-uni/components/wd-xxx/types";
```

在本项目中应该转换为：

```typescript
import type { XXX } from "wot-design-uni/components/wd-xxx/types";
```

即：去掉 `@/uni_modules/` 前缀。

#### 18.1.3. 常用组件的类型导入示例

|      组件      |                     导入路径                     |              常用类型              |
| :------------: | :----------------------------------------------: | :--------------------------------: |
|    wd-form     |    `wot-design-uni/components/wd-form/types`     |    `FormRules`, `FormInstance`     |
|   wd-upload    |   `wot-design-uni/components/wd-upload/types`    | `UploadBeforeUpload`, `UploadFile` |
|   wd-picker    |   `wot-design-uni/components/wd-picker/types`    |           `PickerColumn`           |
| wd-picker-view | `wot-design-uni/components/wd-picker-view/types` |            `ColumnItem`            |
|  wd-textarea   |  `wot-design-uni/components/wd-textarea/types`   |          `TextareaProps`           |

#### 18.1.4. 获取文档的方式

你可以使用以下工具查找文档：

1. 其他的 fetch 网站获取工具。
2. markdown 的 MCP 工具。

**注意**：从 GitHub 获取的文档中的类型导入路径需要按照上述规则进行转换。

### 18.3. z-paging 分页组件

- 仓库： https://github.com/SmileZXLee/uni-z-paging
- 文档： https://z-paging.zxlee.cn/
- 文档的仓库： https://github.com/SmileZXLee/uni-z-paging-doc

### 18.2. claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home

## 19. Nitro 双运行时与 TypeScript 导入约束

注：`apps/app` 内置的 Nitro 双运行时方案已退役，统一后端由 `apps/api` 承接。以下内容保留为历史上下文，供理解旧代码迁移过程。

### 19.1. 设计背景

- 当前 Nitro 接入不是单纯“给项目多加一个后端”，而是要同时保住 `mock` 开发链路和 `nitro-standalone` 真实运行时链路。
- 这项设计的核心目标是：H5 日常开发可以继续走 `vite-plugin-mock-dev-server`，同时微信小程序开发、独立 API 联调和未来独立部署可以走 standalone Nitro。
- 对应脚本曾以 `package.json` 中的 `dev:nitro`、`build:nitro:node`、`preview:nitro` 为准；这些脚本已从 `apps/app` 退役，统一后端入口请使用 `apps/api`。它们不是临时调试命令，而是这套运行模型的一部分。

### 19.2. 当前运行模型

- 当前 `nitro-standalone` 路径下，部分 `server/**/*.ts` 实际会走“原生 Node 直接执行 TypeScript 源文件”的链路，而不是完全交给 bundler 统一接管。
- 因此仓库需要通过 `NODE_OPTIONS=--experimental-strip-types` 让 Node 22 具备直接执行这批 TypeScript 文件的能力。
- 这不是理想的长期源码形态，而是为了确保 `mock` 与 standalone Nitro 能同时可用而做出的运行时妥协。

### 19.3. 源码层面的妥协

- 只要代码位于 `server/**`，并且可能被 standalone Nitro 或原生 Node 直接执行，就不要使用 `@/` alias。
- 同类代码的相对导入不能省略扩展名，必须显式写 `.ts`。
- 因此，`server/**` 中出现 `.ts` 尾缀导入，不是编码风格偏好，也不是“有人随手乱写”，而是当前执行模型倒逼出来的结果。

### 19.4. 这项妥协带来的技术债务

- 运行时约束泄漏到了源码层，导致 `server/**` 与前端代码的导入风格不一致，代码观感会更丑。
- TypeScript 配置层容易被迫引入 `allowImportingTsExtensions`、`moduleResolution: "Bundler"` 一类补偿性配置；这些配置只能缓解类型系统摩擦，不能消除根因。
- 如果维护者不了解这套背景，很容易把 `.ts` 导入误判成普通代码味道问题，然后在没有改运行模型的前提下做错误的批量重写。

### 19.5. 后续演进原则

- 如果未来要彻底移除 `server/**` 中的 `.ts` 尾缀导入，必须先改执行模型，不能先做批量替换。
- 可接受的方向只有两类：一类是改用 `tsx`、bundler 或其他运行器承接 TypeScript 执行；另一类是改为更标准的 Node ESM 产物链路，由源码写 `.js` specifier 并输出真实 `.js` 文件。
- 在执行模型正式切换前，`server/**` 下“相对导入显式带 `.ts`”和“禁止使用 `@/` alias”都视为项目级硬约束。

# Memorix — Automatic Memory Rules

You have access to Memorix memory tools. Follow these rules to maintain persistent context across sessions.

## RULE 1: Session Start — Load Context

At the **beginning of every conversation**, BEFORE responding to the user:

1. Call `memorix_session_start` to get the previous session summary and key memories (this is a direct read, not a search — no fragmentation risk)
2. Then call `memorix_search` with a query related to the user's first message for additional context
3. If search results are found, use `memorix_detail` to fetch the most relevant ones
4. Reference relevant memories naturally — the user should feel you "remember" them

## RULE 2: Store Important Context

**Proactively** call `memorix_store` when any of the following happen:

### What MUST be recorded

- Architecture/design decisions → type: `decision`
- Bug identified and fixed → type: `problem-solution`
- Unexpected behavior or gotcha → type: `gotcha`
- Config changed (env vars, ports, deps) → type: `what-changed`
- Feature completed or milestone → type: `what-changed`
- Trade-off discussed with conclusion → type: `trade-off`

### What should NOT be recorded

- Simple file reads, greetings, trivial commands (ls, pwd, git status)

### Use topicKey for evolving topics

For decisions, architecture docs, or any topic that evolves over time, ALWAYS use `topicKey` parameter.
This ensures the memory is UPDATED instead of creating duplicates.
Use `memorix_suggest_topic_key` to generate a stable key.

Example: `topicKey: "architecture/auth-model"` — subsequent stores with the same key update the existing memory.

### Track progress with the progress parameter

When working on features or tasks, include the `progress` parameter:

```json
{
	"progress": {
		"feature": "user authentication",
		"status": "in-progress",
		"completion": 60
	}
}
```

Status values: `in-progress`, `completed`, `blocked`

## RULE 3: Resolve Completed Memories

When a task is completed, a bug is fixed, or information becomes outdated:

1. Call `memorix_resolve` with the observation IDs to mark them as resolved
2. Resolved memories are hidden from default search, preventing context pollution

This is critical — without resolving, old bug reports and completed tasks will keep appearing in future searches.

## RULE 4: Session End — Store Decision Chain Summary

When the conversation is ending, create a **decision chain summary** (not just a checklist):

1. Call `memorix_store` with type `session-request` and `topicKey: "session/latest-summary"`:

   **Required structure:**

   ```plain
   ## Goal
   [What we were working on — specific, not vague]

   ## Key Decisions & Reasoning
   - Chose X because Y. Rejected Z because [reason].
   - [Every architectural/design decision with WHY]

   ## What Changed
   - [File path] — [what changed and why]

   ## Current State
   - [What works now, what's pending]
   - [Any blockers or risks]

   ## Next Steps
   - [Concrete next actions, in priority order]
   ```

   **Critical: Include the "Key Decisions & Reasoning" section.** Without it, the next AI session will lack the context to understand WHY things were done a certain way and may suggest conflicting approaches.

2. Call `memorix_resolve` on any memories for tasks completed in this session

## RULE 5: Compact Awareness

Memorix automatically compacts memories on store:

- **With LLM API configured:** Smart dedup — extracts facts, compares with existing, merges or skips duplicates
- **Without LLM (free mode):** Heuristic dedup — uses similarity scores to detect and merge duplicate memories
- **You don't need to manually deduplicate.** Just store naturally and compact handles the rest.
- If you notice excessive duplicate memories, call `memorix_deduplicate` for batch cleanup.

## Guidelines

- **Use concise titles** (~5-10 words) and structured facts
- **Include file paths** in filesModified when relevant
- **Include related concepts** for better searchability
- **Always use topicKey** for recurring topics to prevent duplicates
- **Always resolve** completed tasks and fixed bugs
- **Always include reasoning** — "chose X because Y" is 10x more valuable than "did X"
- Search defaults to `status="active"` — use `status="all"` to include resolved memories
