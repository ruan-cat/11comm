---
name: code-style
description: 提供项目代码风格指南，或根据代码风格审查/重构代码。每当需要把控【代码风格】时，请主动使用该技能。
---

# 代码风格

在你为本项目生成代码时，请遵守以下的**代码风格**与**要求**：

## 1. 不需要运行 format 格式化命令

在执行该代理时，请不要运行任何格式化命令。

## 2. 注释风格

生成的代码尽可能使用 jsdoc 注释风格。

### 2.1 错误的例子

```ts
// 业务配置
```

### 2.2 正确的例子

```ts
/** 业务配置 */
```

## 3. 使用全局导入的组件和类型

1. 请你认真的阅读我提供给你的上下文例子。在我提供给你的例子中，很多类型、组件都是用全局导入的方式导入的。
2. 如果你发现这些全局导入的东西出现类型报错，请你总结出来汇报给我。根据我的指令来修复类型错误。
3. 我不希望你去手动导入这些全局组件和类型。

## 4. 组件命名风格

- 不要生成短杆命名的风格，要求生成的 vue 组件名称风格，使用大驼峰命名风格。

就比如 `element-plus` 组件库的按钮组件，你应该生成 `<ElButton>` 而不是 `<el-button>`

### 4.1 错误的代码例子

```vue
<el-button type="warning" :icon="useRenderIcon('ep:edit')" @click="handleEditEmployee(row)">
  {{ transformI18n($t("common.buttons.edit")) }}
</el-button>
```

### 4.2 正确的代码例子

```vue
<ElButton type="warning" @click="handleEdit(row)">
	{{ transformI18n($t("common.buttons.edit")) }}
</ElButton>
```

## 5. 按钮组件 `<ElButton>` 的代码风格

### 5.1 严格的按钮 type 样式设置

根据不同的业务操作行为，生成不同的按钮 type 样式，针对写死的，给定的业务按钮，其类型是固定的。如下要求：

#### 5.1.1 新增

新增按钮用 `primary` 类型。

```vue
<template>
	<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
</template>
```

#### 5.1.2 修改

修改按钮用 `warning` 类型。

```vue
<template>
	<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
</template>
```

#### 5.1.3 删除

删除按钮用 `danger` 类型。

```vue
<template>
	<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
</template>
```

#### 5.1.4 其他业务性质的按钮

如果需要写实现具体业务的按钮，就使用 `info` 类型。

```vue
<template>
	<ElButton type="info">
		{{ transformI18n($t("propertyManage_communityManage.house-decoration.decorationOk")) }}
	</ElButton>
	<ElButton type="info" @click="gotoHouseDecorationPage(row)">
		{{ transformI18n($t("propertyManage_communityManage.house-decoration.trackingRecord")) }}
	</ElButton>
</template>
```

### 5.2 按钮不允许增加额外的字段

按钮组件不允许增加多余的配置属性。在没有得到明确的指令时，默认执行本子代理时，不应该为按钮组件增加多余的属性配置。

#### 5.2.1 错误写法

```vue
<template>
	<ElButton type="primary" size="small" link @click="handleDelete(row)">
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

#### 5.2.2 正确写法

```vue
<template>
	<ElButton type="primary" @click="handleDelete(row)"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
</template>
```

你不应该增加冗余的配置。就应该保留唯一的 type 属性。其余诸如 size 和 link 这样的属性，都不应该配置。

### 5.3 按钮组件不允许配置任何形式的 icon 图标

1. 不允许配置任何形式的 icon，不希望看到各种按钮都有自己的一套 icon。
2. 不允许使用 icon 插槽来配置 icon。比如以下例子：

#### 5.3.1 错误例子

```vue
<template>
	<ElButton type="primary" @click="openDialog({ mode: 'add' })">
		<template #icon>
			<IconifyIcon icon="ep:plus" />
		</template>
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

#### 5.3.2 正确例子

不应该使用 icon 插槽来配置任何形式的按钮。

```vue
<template>
	<ElButton type="primary" @click="openDialog({ mode: 'add' })">
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

## 组件使用 icon 规范

不允许私自使用 icon 装饰。

## 6. 导入模块

大部分模块是全局导入的，不需要你专门处置。特别是某些模块，不需要你手动写导入语句。

其中，`getRouteRank` 函数不需要你手动导入。

导入语句必须在 `definePage` 页面宏的下方。不要写在 `definePage` 的上面。

### 6.1 例子 1

#### 6.1.1 错误的例子

```ts
import { ref } from "vue";
import { getRouteRank } from "@/router/rank/getRouteRank";

definePage({
	meta: {
		title: "系统配置",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});
```

#### 6.1.2 正确的例子

- 导入语句在 `definePage` 宏的下方。
- 移除掉不需要手动导入的 `getRouteRank` 函数。

```ts
definePage({
	meta: {
		title: "系统配置",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { ref } from "vue";
```

## 组件尺寸设置

几乎全部的组件，都不需要你设置 size 配置。除了模板内已经有的 size 写法依以外，其他的组件都不需要你主动设置组件的尺寸大小。

## 7. i18n

我们生成的模板代码，要尽可能满足 i18n 的需求。

### 7.1 按钮的中文命名一律使用固定的 i18n 工具获得

按钮的命名必须严格的使用 i18n 工具，不要自己直接写中文。对于常用的按钮来说，绝大多数的名称都已经准备好了，不需要你写中文名称。

### 7.2 积极复用现有的 i18n 配置文件

这是全部的 i18n 翻译文本，你应该积极地阅读现有的 i18n 配置文件，学会复用现存的 i18n 配置文本。

请读取以下目录：

`apps\admin\locales`

### 7.3 不要随意新增 i18n 业务用的翻译文本

我们的目的是套模板，不要生成多余的 i18n 文本配置文件。在你根据图片识别业务的字段名称时，你应该直接使用其中文名，不要去新建专门的业务用 i18n 配置文件。

### 7.4 不要新增冗余的按钮文本

在你处理 i18n 文本时，请不要新增冗余的按钮文本。比如新增、修改、删除按钮这些文本。这些公共的文本已经在以下的配置文件内准备就绪了。

请你阅读下面的翻译文本，并确保**不要新建任何冗余的按钮文本**。

- 通用的英文翻译 `apps\admin\locales\en\common.yaml`
- 通用的中文翻译 `apps\admin\locales\zh-CN\common.yaml`

### 7.5 手动导入 `transformI18n` 函数

尽管我们项目使用了全局导入，可是 `transformI18n` 函数往往在 vue 模板内直接使用，因此该函数需要你手动导入。

```ts
/** 导入语句 */
import { transformI18n } from "@/plugins/i18n";
```

### 7.6 使用模板插值

在你使用 i18n 的模板插值语法时，请你使用以下代码写法来完成翻译。

```ts
import { useI18n } from "vue-i18n";
const { t } = useI18n();
```

请你用组合式 api 提供的 `t` 函数来使用模板插值语法。

### 7.7 i18n 的部分文本应该用双引号括起来

针对 `apps/admin/locales/en/*.yaml` 和 `apps/admin/locales/zh-CN/*.yaml` 的 i18n 文本配置文件，满足以下规则的文本，都应该用双引号括起来。

#### 7.7.1 例子 1： 含有尾缀冒号的文本

冒号也作为文本的一部分，为了避免出现 yaml 的语法识别错误，应该连同冒号也一同放在双引号内部。

##### 7.7.1.1 错误例子

```yaml
titleCharCount: Title characters:
```

##### 7.7.1.2 正确例子

```yaml
titleCharCount: "Title characters:"
```

#### 7.7.2 例子 2： 含有插值语法的英文文本

为了防止前缀的括号造成 yaml 语法错误，这里应该连同整行文本都纳入双引号内。

##### 7.7.2.1 错误例子

```yaml
operationSuccess: {operation} successful
```

##### 7.7.2.2 正确例子

```yaml
operationSuccess: "{operation} successful"
```

### 7.8 常见的 i18n 文本

你应该使用正确的 i18n key。

错误例子：

```vue
<template>
	<ElButton>
		{{ transformI18n($t("common.buttons.view")) }}
	</ElButton>
</template>
```

我们是不存在错误的 `common.buttons.view` key 的，请不要识别错误。

---

正确例子：

```vue
<template>
	<ElButton>
		{{ transformI18n($t("common.buttons.info")) }}
	</ElButton>
</template>
```

正确的 key 是 `common.buttons.info` 。这是你**常见的错误**，请不要使用错误的 key 。

### 7.9 业务 i18n key 以运行时解析结果为准

`apps/admin/src/plugins/i18n.ts` 已经实现了当前项目真实生效的 i18n 加载规则。你在页面里编写 i18n key 时，必须以**运行时是否真的能被解析**为准，不要只看 key 的命名像不像正确。

- 页面标题、面包屑、标签页标题、弹窗标题、表格列标题、表单项标题等，只要写成 i18n key，就必须能被 `transformI18n` 或 `i18n.global.t` 解析到。
- 如果浏览器里直接显示 raw key，优先检查 locale 文件命名空间和 yaml 顶层结构是否一致，不要先假设是页面组件本身写错。
- 不要凭空发明看起来“很像”的 key。必须先回到 `apps/admin/locales` 和 `apps/admin/src/plugins/i18n.ts` 确认实际可用路径。

### 7.10 locale 文件命名空间规则

当前项目的 locale 加载器会先根据**文件名**挂载命名空间，并对文件名中的 `-`、`_` 做 camelCase 规整。同时，它兼容本项目历史上已经存在的“文件名一层，内容再包一层命名空间”的旧写法。

- `dev-team.yaml` 这类文件，运行时命名空间会按 `devTeam` 解析。
- `setting-manage_organize-manage.yaml` 这类文件，如果内容顶层是 `settingManage`，那么运行时可以解析出 `settingManage.organizeManage.*`。
- 兼容旧写法，不代表新代码可以继续随意写乱。以后新增或修改 locale 文件时，**文件名命名空间**、**yaml 顶层命名空间**、**页面实际使用的 key 路径**必须保持一致的语义。
- 不要出现 `foo-bar.yaml` 里却写 `baz.xxx` 这种跨命名空间的内容，这会让页面极易出现 raw key。

示例：

```yaml
# 文件：apps/admin/locales/zh-CN/dev-team.yaml
devTeam:
  menuManage:
    catalog:
      pageTitle: 菜单目录
```

```vue
<template>
	<span>{{ transformI18n($t("devTeam.menuManage.catalog.pageTitle")) }}</span>
</template>
```

### 7.11 `common.buttons` 先复用，再补齐

按钮文案优先复用 `common.buttons.*`。如果确实缺少通用按钮 key，并且该按钮会在多个页面复用，那么应该补到公共词典，而不是在业务 yaml 里重复造词。

- 新增公共按钮 key 时，必须同时更新：
  - `apps/admin/locales/zh-CN/common.yaml`
  - `apps/admin/locales/en/common.yaml`
- 不允许只补一个语言版本。
- 当前项目已经实际使用并确认可复用的公共 key 至少包括：
  - `common.buttons.add`
  - `common.buttons.edit`
  - `common.buttons.del`
  - `common.buttons.info`
  - `common.buttons.detail`
  - `common.buttons.export`
  - `common.buttons.enable`
  - `common.buttons.disable`
  - `common.buttons.document`
  - `common.buttons.file`
  - `common.buttons.resetPassword`
  - `common.buttons.permissionConfig`
  - `common.buttons.associateUnit`
  - `common.buttons.associateEmployee`
  - `common.buttons.batchAudit`
  - `common.buttons.batchReprint`
- `common.buttons.view` 依然是错误 key。不要再生成这个 key。
- 如果页面语义是“详情”，优先复用当前页面附近已经在使用的 `common.buttons.info` 或 `common.buttons.detail`，但不要新造 `view`。

### 7.12 `transformI18n` 与 `useI18n` 的分工

- 模板内直接渲染固定 key 时，优先使用 `transformI18n($t("..."))`。
- 脚本内需要插值、拼接、参数化翻译时，再使用 `const { t } = useI18n()`。
- 即便用了 `useI18n`，也不能绕过 key 校验。你传给 `t` 的 key 仍然必须是 `apps/admin/locales` 中真实存在、且能被当前加载器正确解析的 key。

正确例子：

```ts
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const dialogTitle = t("settingManage.organizeManage.staffInfo.pageTitle");
```

#### 7.12.A `transformI18n` 的唯一职责，与动态配置的正确刷新方式

- `transformI18n` 是当前后台项目唯一的基础翻译入口，负责把 i18n key 解析成当前语言文本。
- `renderI18n` 不再是推荐能力。不要再在页面、表单、弹窗内新建本地 `renderI18n` helper。
- 脚本里的动态配置刷新，依赖的是 `computed(...)`、`withLocale(...)`、函数型 `title` / `footerButtons.label` 这些响应式结构，而不是额外包一层本地翻译函数。
- 因此，模板和脚本里的默认写法统一为 `transformI18n($t("..."))`。
- 参数化翻译、插值翻译、拼接翻译时，使用 `useI18n().t(...)` 或 `i18n.global.t(...)`，不要再发明新的 helper。

模板示例：

```vue
<ElButton type="primary">
	{{ transformI18n($t("common.buttons.add")) }}
</ElButton>
```

脚本配置示例：

```ts
const columns = withLocale<TableColumnList>(() => [
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		slot: "operation",
	},
]);
```

### 7.13 列表页与表单页统一使用 `use-i18n-config`

当你在 `apps/admin/src/pages/**/index.vue`、`form.vue`、`dialog.ts` 里实现 i18n 时，默认应该优先使用：

```ts
import { useI18nConfig } from "@/composables/use-i18n-config";
```

这套组合式 API 专门用于处理“需要跟随语言切换而动态刷新”的配置对象。它的核心用途如下：

- 只负责“结构层”的动态刷新问题，例如 `computed` 配置对象、表格列头渲染器、弹窗标题工厂等。
- **不要**在 `use-i18n-config` 内部二次封装 `$t`，也不要在组件里调用 `tLabel("xxx")`、`t("xxx")` 这类二次包装函数来读取 key。

#### 7.13.A 组件内必须直接写 `$t("...")`

为了让 VSCode 的 `i18n Ally`、pure-admin 相关阅读体验和键值映射提示正常工作，**组件里必须直接出现 `$t("xxx.xxx")`**。

错误示例：

```ts
const { tLabel } = useI18nConfig();

const title = computed(() => tLabel("devTeam.configManage.center.pageTitle"));
```

正确示例：

```ts
const title = computed(() => transformI18n($t("devTeam.configManage.center.pageTitle")));
```

再强调一次：

- 你可以继续使用 `use-i18n-config` 处理“配置对象要跟随语言切换刷新”的结构性问题。
- 但是 **i18n key 本身必须直接写在组件里**，写成 `$t("...")`。
- 不要把 `$t` 包进新的 helper 再从组件里调用，否则 VSCode 插件无法稳定映射中文含义。

#### 7.13.0 `definePage.meta.title` 改成 i18n key 后，要补一行中文注释

当你把页面 `definePage({ meta: { title } })` 从中文标题改成 i18n key 时，不要直接把中文删掉。必须在 `title` 上方补一行中文注释，保留这个页面原本的人类可读标题，方便后续维护者快速识别页面语义。

错误示例：

```ts
definePage({
	meta: {
		title: "devTeam.menuManage.group.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});
```

正确示例：

```ts
definePage({
	meta: {
		// 菜单组
		title: "devTeam.menuManage.group.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});
```

补充要求：

- 这行注释默认直接写原本的中文页面名，不要写成长句说明。
- 注释位置固定在 `title` 的正上方，不要挪到 `meta` 外层。
- 只有把中文标题改成 i18n key 的场景，才需要补这行注释。

#### 7.13.1 表格列标题一律优先使用 `headerRenderer`

表格列头需要支持运行时切换语言时，不要继续写静态 `label`。

错误示例：

```ts
const columns = ref<TableColumnList>([
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configName")),
		prop: "configName",
	},
	{
		label: transformI18n($t("common.table.operation")),
		slot: "operation",
	},
]);
```

正确示例：

```ts
const { createHeaderRenderer, withLocale } = useI18nConfig();

const columns = withLocale<TableColumnList>(() => [
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.item.fields.configName"))),
		prop: "configName",
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		slot: "operation",
	},
]);
```

特别注意：

- 操作栏表头必须模仿现有“操作栏”的写法，使用 `headerRenderer`。
- 其他普通列，只要要求语言切换时立即刷新，也应优先改成 `headerRenderer`。

#### 7.13.2 配置对象默认使用 `computed`，不要继续堆静态 `ref`

以下这些配置对象，默认应该写成 `computed`：

- `columns`
- `pureTableBarProps`
- `plusSearchColumns`
- `plusSearchProps`
- `plusFormColumns`
- `plusFormRules`
- 各种基于 options 的翻译映射结果

错误示例：

```ts
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("devTeam.configManage.item.pageTitle")),
	columns: columns.value,
});
```

正确示例：

```ts
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.configManage.item.pageTitle")),
	columns: columns.value,
}));
```

原因：

- `ref({ ...静态字符串 })` 只会在初始化时求值一次。
- 切换语言后，这类静态配置经常不会自动刷新，最常见的后果是：
  - 表格表头仍停留在旧语言。
  - 搜索栏 placeholder、按钮文案停留在旧语言。
  - 弹窗标题、footerButtons、表单 label、校验 message 不联动刷新。
  - 页面出现“菜单是英文，但搜索栏和弹窗还是中文”的混乱状态。
- 这类问题不是样式瑕疵，而是实打实的运行时行为错误。
- 当前后台项目的正确写法是 `computed/withLocale + transformI18n/createHeaderRenderer`。
- 结论很明确：只要配置对象里有 i18n 文本，就不要写成静态 `ref` 对象。

#### 7.13.3 `form.vue` 里表单配置必须转成 `computed`

在 `form.vue` 里，以下内容不要继续用静态 `ref`：

- `plusFormColumns`
- `plusFormRules`
- 各种下拉选项的翻译后结果

推荐写法：

```ts
const translatedStatusOptions = computed(() =>
	statusOptions.map((option) => ({
		...option,
		label: transformI18n($t(`xxx.form.options.status.${option.value}`)),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("xxx.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	status: [
		{
			required: true,
			message: transformI18n($t("xxx.form.validation.selectStatus")),
			trigger: "change",
		},
	],
}));
```

#### 7.13.4 弹窗标题与 footerButtons 文案使用函数

`ReDialog` 现在已经支持函数型 `title` 和 `footerButtons.label`。凡是弹窗打开后仍然需要跟随语言切换更新文案的地方，都应该写成函数。

错误示例：

```ts
addDialog({
	title: `${modeText.value}${transformI18n($t("devTeam.configManage.item.pageTitle"))}`,
	footerButtons: [{ label: transformI18n($t("common.buttons.cancel")) }],
});
```

正确示例：

```ts
addDialog({
	title: () => `${modeText.value}${transformI18n($t("devTeam.configManage.item.pageTitle"))}`,
	footerButtons: [
		{ label: () => transformI18n($t("common.buttons.cancel")) },
		{ label: () => transformI18n($t("common.buttons.reset")) },
		{ label: () => transformI18n($t("common.buttons.submit")) },
	],
});
```

#### 7.13.5 下拉选项不要直接复用静态中文 label

很多 `@01s-11comm/type` 导出的 options 内部仍然是静态中文 label。页面内不能直接拿来渲染，否则切换英文后，下拉框还是中文。

正确做法是在页面或表单内用 `computed` 包一层，再用 `transformI18n($t(...))` 重新映射 label：

```ts
const translatedConfigTypeOptions = computed(() =>
	configTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(`devTeam.configManage.item.form.options.${option.value}`)),
	})),
);
```

#### 7.13.6 实施顺序

改造一个页面时，默认按以下顺序做：

1. 先确认 locale key 真实存在，必要时补齐 `zh-CN` 与 `en`。
2. 引入 `useI18nConfig`。
3. 把 `columns`、搜索配置、表单配置改成 `computed`。
4. 把表头从 `label` 改成 `headerRenderer`。
5. 把弹窗 `title`、`footerButtons.label` 改成函数。
6. 切语言自测，确认页面标题、搜索栏、表头、弹窗标题、表单项、按钮全部联动刷新。

#### 7.13.7 纠偏说明：组件内必须直接写 `$t("key")`

本节前面如果出现任何 `tLabel("key")`、`t("key")`、`ht("key")`、`dialogTitleT(...)` 之类“由 `use-i18n-config` 二次封装 `$t`”的旧示例，**全部以本小节为准覆盖**。

强制规则：

- 组件内必须直接出现 `$t("xxx.xxx")`。
- `use-i18n-config` 只能处理结构层复用，**不能**再包装 `$t` 去读取 key。
- `createHeaderRenderer` 只能接收“已经翻译好的文本”，不能接收 i18n key。
- `searchProps` 只能接收组件内已经翻译好的 `searchText`、`resetText`。
- VSCode 的 `i18n Ally`、pure-admin 代码阅读映射，依赖组件内直接出现 `$t("key")`。
- 唯一允许的固定文案例外是 `useI18nConfig().plusSearchButtonTexts`，它只服务 `PlusSearch` 的 `searchText/resetText`，不扩展成任意 key helper。

推荐写法：

```ts
const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

const columns = withLocale<TableColumnList>(() => [
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.item.fields.configName"))),
		prop: "configName",
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		slot: "operation",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);
```

`PlusSearch` 的按钮文案现在还可以直接复用 `useI18nConfig` 导出的固定 computed：

```ts
const { plusSearchButtonTexts } = useI18nConfig();
```

```vue
<PlusSearch
	:key="locale"
	:search-text="plusSearchButtonTexts.searchText"
	:reset-text="plusSearchButtonTexts.resetText"
/>
```

这个导出只负责 `common.buttons.search` 和 `common.buttons.reset` 两个稳定公共文案。
不要据此继续向 `use-i18n-config` 添加任意 key 的读取函数。

额外强调：

- `renderI18n` 已经不再是推荐写法，旧代码里如仍存在，应优先清理。
- 动态 i18n 刷新依赖的是 `computed`、`withLocale`、函数型弹窗文案，而不是本地 helper。
- 任何把 i18n 文本塞进静态 `ref` 对象的写法，都是当前项目必须主动纠正的误区。

禁止写法：

```ts
const { tLabel, t, ht, valueT, optionText, dialogTitleT } = useI18nConfig();
```

#### 7.13.8 `.vscode/i18n-ally-custom-framework.yml` 的配置目的与动态维护规范

`.vscode/i18n-ally-custom-framework.yml` 是 VSCode `i18n Ally` 插件识别本项目 i18n 写法的工程配置文件。

它的目的只有三个：

- 让 `i18n Ally` 在 `.vue`、`.ts`、`.js` 文件里正确识别 key 的使用位置。
- 让开发者在组件里悬停、跳转、预览 key 时，能直接看到中文和英文映射。
- 防止项目已经改了 i18n 写法，但 VSCode 侧还沿用旧规则，导致阅读体验和规范脱节。

当前文件如下：

```yml
languageIds:
  - javascript
  - typescript
  - vue
usageMatchRegex:
  - "[^\\w\\d]\\$t\\(['\"`]({key})['\"`]"
  - "transformI18n\\(\\s*\\$t\\(['\"`]({key})['\"`]\\s*\\)"
```

这几项分别表示：

- `languageIds`：指定需要扫描的语言类型。
- `usageMatchRegex[0]`：匹配组件或脚本里直接写出来的 `$t("xxx.xxx")`。
- `usageMatchRegex[1]`：匹配模板和脚本里常见的 `transformI18n($t("xxx.xxx"))`。

维护这份文件时，必须遵守以下规则：

- 这份配置必须围绕“项目当前真实在用的 i18n 调用形式”来写。
- 如果组件规范要求“组件内必须直接写 `$t("key")`”，那这里就应该优先只保留 `$t(...)` 和 `transformI18n($t(...))`。
- 如果某种旧 helper 写法已经废弃，例如 `tLabel("key")`、`ht("key")`、`dialogTitleT("key")`，就必须同步删除对应 regex。
- 如果某种写法只是临时兼容或过渡脏写法，不要为了让插件识别而继续往这里追加 regex，应该优先清理代码本身。
- 只有当一种新写法已经被项目正式接受，并且会长期存在时，才允许新增 `usageMatchRegex`。

动态维护策略：

1. 每次调整 i18n 代码规范时，先确认组件里真实会出现哪些调用形式。
2. 只把这些“稳定、正式、推荐”的调用形式写进 `.vscode/i18n-ally-custom-framework.yml`。
3. 修改完成后，必须验证：
   - `.vue` 模板里的 `transformI18n($t("..."))` 仍可识别。
   - `<script setup>` 里的 `$t("...")` 仍可识别。
   - 已废弃的旧 helper 不再被当成推荐方案继续支持。
4. 如果旧 helper 已被彻底清理，就要及时收缩 regex，不允许把过时 pattern 永久留在仓库里。

本项目当前的硬规则是：

- 组件代码的 i18n 写法，决定 `.vscode/i18n-ally-custom-framework.yml` 应该怎么写。
- 不能反过来为了兼容旧 helper，强行扩展 VSCode 配置去迁就它。

也就是说：

- 如果组件规范要求直接写 `$t("devTeam.configManage.center.pageTitle")`，那 `usageMatchRegex` 就围绕 `$t(...)` 维护。
- 如果模板规范要求写 `transformI18n($t("common.buttons.add"))`，那就保留 `transformI18n($t(...))` 的匹配。
- 如果某个 helper 会遮蔽字面量 key，让 `i18n Ally` 无法直接映射，就应该改组件代码，而不是继续扩 regex。

错误方向：

- 因为仓库里有很多私有 helper，就持续往 `.vscode/i18n-ally-custom-framework.yml` 里叠加 wrapper regex。
- 明明已经决定废弃 `tLabel("key")`，却继续保留它的识别规则。
- 让 VSCode 配置和代码规范长期不一致，导致文档说一套、插件识别另一套。

正确方向：

- 先统一组件内 i18n 写法。
- 再让 `.vscode/i18n-ally-custom-framework.yml` 精确匹配这些正式写法。
- 只要 i18n 调用形式发生变化，就把这份文件视为必须同步维护的工程文件。
