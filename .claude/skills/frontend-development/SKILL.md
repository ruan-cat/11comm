---
name: frontend-development
description: 前端开发指南与模式，涵盖 `apps/admin`（Vue 3 + TypeScript）的页面结构、列表页、表单页、弹窗和 i18n 的最新标准写法。
license: MIT
---

# 前端开发技能

本技能用于指导 `apps/admin` 内的 Vue 3 页面、表单、弹窗和列表页开发。
如果你要修改现有页面，必须优先遵守当前仓库已经落地的写法，而不是继续复制旧页面里的过时模式。

## 1. 适用范围

- `apps/admin/src/pages/**/index.vue`
- `apps/admin/src/pages/**/components/form.vue`
- `apps/admin/src/pages/**/components/dialog.ts`
- `apps/admin/src/api/**`
- `apps/admin/src/composables/**`

## 2. 核心原则

1. 页面和表单都使用 Vue 3 `script setup` + TypeScript。
2. 业务类型统一从 `@01s-11comm/type` 导入。
3. 页面配置对象、表格列、搜索配置、表单配置优先使用 `computed` 或 `useI18nConfig().withLocale()`，不要继续堆静态 `ref`。
4. i18n key 必须直接写在组件里，写成 `$t("xxx.xxx")`，不要再二次封装 `$t`。
5. 表格列标题需要动态切语言时，一律使用 `headerRenderer`，不要继续写静态 `label`。
6. `form.vue` 内部表单数据优先 `ref(cloneDeep(props.form))`，不要用 `structuredClone(props.form)` 处理弹窗传入的 props proxy。

## 3. 页面文件结构

`index.vue` 默认遵循以下顺序：

1. `definePage`
2. import
3. i18n / composable 初始化
4. option label 映射与翻译函数
5. 搜索模型
6. query hook
7. `columns`
8. `pureTableBarProps`
9. `plusSearchColumns`
10. `plusSearchProps`
11. 事件函数
12. 弹窗函数

## 4. definePage 规范

页面标题改成 i18n key 后，`title` 正上方必须保留中文注释，注释内容就是原本的中文标题。

示例：

```ts
definePage({
	meta: {
		// 菜单目录
		title: "devTeam.menuManage.catalog.pageTitle",
		icon: "mdi:folder",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.catalog"),
	},
});
```

## 5. 列表页标准

### 5.1 useI18nConfig 的正确职责

列表页默认这样引入：

```ts
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();
```

#### 5.1.A `transformI18n` 与动态配置刷新的边界

- `transformI18n` 只负责翻译，把 key 解析成当前语言文本。
- 模板和脚本里的默认写法统一为 `transformI18n($t("..."))`。
- 脚本配置的动态刷新依赖 `computed(...)`、`withLocale(...)`、函数型 `title` / `footerButtons.label`，不要再新建本地 `renderI18n` helper。
- 参数化翻译、插值翻译时，使用 `useI18n().t(...)` 或 `i18n.global.t(...)`。

约束：

- `useI18nConfig` 只负责结构层的动态刷新。
- 组件内必须直接出现 `$t("key")`。
- `createHeaderRenderer` 只接收已经翻译好的文本。
- `searchProps` 只接收已经翻译好的 `searchText`、`resetText`。

### 5.2 搜索模型顺序

标准顺序：

```ts
const plusSearchModelRef: FieldValues & Partial<QueryParams> = {
	name: "",
	status: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);
```

### 5.3 Query Hook

列表数据统一通过 query hook 获取：

```ts
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useXxxListQuery(plusSearchDefaultValues);
```

### 5.4 列表页 i18n 配置对象

以下对象默认都写成 `withLocale`：

- `columns`
- `pureTableBarProps`
- `plusSearchColumns`
- `translatedOptions`

`plusSearchProps` 默认走 `searchProps(...)`。
`PlusSearch` 的按钮文本默认再补 `plusSearchButtonTexts`。

示例：

```ts
const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.catalog.fields.name"))),
		prop: "name",
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		slot: "operation",
	},
]);

const { plusSearchButtonTexts } = useI18nConfig();

const plusSearchProps = searchProps(plusSearchDefaultValues);
```

### 5.5 表头写法

错误写法：

```ts
{
	label: transformI18n($t("devTeam.menuManage.catalog.fields.name")),
	prop: "name",
}
```

正确写法：

```ts
{
	headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.catalog.fields.name"))),
	prop: "name",
}
```

### 5.6 页面根节点与搜索区 key

涉及 `PlusSearch`、表格列、第三方表单配置时，页面根节点和 `PlusSearch` 默认补 `:key="locale"`，保证切语言后整块结构重算：

```vue
<section :key="locale" class="index-root">
	<PlusSearch
		:key="locale"
		v-model="plusSearchModel"
		:="plusSearchProps"
		:columns="plusSearchColumns"
		:search-text="plusSearchButtonTexts.searchText"
		:reset-text="plusSearchButtonTexts.resetText"
	/>
</section>
```

说明：

- `searchProps(...)` 负责搜索栏结构配置。
- `plusSearchButtonTexts.searchText/resetText` 负责 `PlusSearch` 的按钮文案动态切换。
- 这两个按钮文案现在优先复用 `useI18nConfig` 的固定 computed，不再在每个页面重复写额外 helper。

### 5.7 PureTable 现状约束

当前项目里部分 `PureTable` props 类型仍有噪音。
如果页面本身沿用仓库现状，需要在模板上保留：

```vue
<PureTable ... />
```

不要为了消除这类历史噪音而擅自改掉页面正常工作的现有接口结构。

### 5.7 PureTable `treeProps` 类型现状

- 已经走 `useListQuery` 或 `defaultPureTableProps` + `ListPureTableProps` 的页面，不要再添加 `<!-- @vue-ignore -->` 来忽略 `treeProps.checkStrictly`。
- 旧页面如果还保留本地 `ref<PureTableProps>` / `computed<PureTableProps>`，应先切到统一的 `ListPureTableProps`，再删除注释；不要只删注释不修类型。
- `treeProps` 的默认值统一放在 `apps/admin/src/config/constant.ts`，类型别名统一放在 `apps/admin/types/pure-table.d.ts`。

## 6. 表单组件标准

### 6.1 form.ts

`form.ts` 只负责：

- `defaultForm`
- `Props` 类型
- 可选的 `mode?: Mode`

不要把表单渲染逻辑写到 `form.ts`。

### 6.2 form.vue 的数据初始化

标准写法：

```ts
const props = defineProps<FormProps>();
const defaultValues = props.defaultValues as FieldValues & XxxFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & XxxFormVO);
const formComputed = computed(() => form.value);
```

约束：

- 优先 `cloneDeep(props.form)`。
- 不要使用 `structuredClone(props.form)`，弹窗场景下容易踩到 props proxy 问题。
- `formComputed` 暴露给弹窗关闭前比较逻辑。

### 6.3 表单配置对象

以下对象默认写成 `withLocale`：

- `translatedOptions`
- `plusFormColumns`
- `plusFormRules`

示例：

```ts
const translatedStatusOptions = withLocale(() =>
	statusOptions.map((option) => ({
		...option,
		label: transformI18n($t("xxx.form.options.status.enabled")),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("xxx.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("xxx.placeholders.status")),
		},
	},
]);
```

强制规则：

- 只要配置对象里含有 i18n 文本，就不要写成静态 `ref({...})`。
- 静态 `ref` 的严重后果是：切语言后表单 label、placeholder、校验信息和下拉选项经常停留在旧语言。
- 这类问题会直接造成运行时界面语言混杂，不是简单的可读性问题。

### 6.4 表单规则

表单校验信息也必须跟随语言切换：

```ts
const plusFormRules = withLocale<PlusFormRules>(() => ({
	status: [
		{
			required: true,
			message: transformI18n($t("xxx.validation.statusRequired")),
			trigger: "change",
		},
	],
}));
```

## 7. 弹窗标准

### 7.1 ReDialog

弹窗标题与 footer 按钮文案默认使用函数：

```ts
addDialog({
	title: () => transformI18n($t("devTeam.menuManage.catalog.dialogs.addTitle")),
	footerButtons: [
		{
			label: () => transformI18n($t("common.buttons.cancel")),
			type: "info",
		},
		{
			label: () => transformI18n($t("common.buttons.reset")),
			type: "warning",
		},
		{
			label: () => transformI18n($t("common.buttons.submit")),
			type: "success",
		},
	],
});
```

原因：

- 弹窗打开后仍然可能切语言。
- 静态字符串或静态 `ref` 容易导致弹窗标题、footer 按钮不刷新。

### 7.2 弹窗表单关闭前逻辑

默认写法：

```ts
async doBeforeClose({ options, index }) {
	const formComputed = formInstance.value?.formComputed;
	if (formComputed) {
		await useDoBeforeClose({ defaultValues, formComputed, index, options });
	}
}
```

## 8. i18n 现行规范

### 8.1 必须直接写 `$t("key")`

错误：

```ts
const { tLabel } = useI18nConfig();
const title = computed(() => tLabel("devTeam.configManage.center.pageTitle"));
```

正确：

```ts
const title = computed(() => transformI18n($t("devTeam.configManage.center.pageTitle")));
```

### 8.1.A 模板与脚本的边界

- 模板：`transformI18n($t("..."))`
- 脚本动态配置：放进 `computed(...)` / `withLocale(...)` 后，仍直接写 `transformI18n($t("..."))`
- 不要在组件里新建 `renderI18n(...)`
- 不要在脚本里继续发明 `tLabel`、`ht`、`dialogTitleT` 这类二次包装 `$t` 的 helper

### 8.2 模板里优先写法

```vue
<ElButton type="primary">
	{{ transformI18n($t("common.buttons.add")) }}
</ElButton>
```

### 8.3 参数化文本

参数化翻译不要发明新的 helper。
需要插值时，直接使用 `i18n.global.t($t("key"), params)` 或项目当前统一方式。

### 8.4 options 不要直接复用静态中文 label

很多 `@01s-11comm/type` 导出的 options 仍然带静态中文 label。
页面和表单里必须重新映射 label，不要直接原样渲染。

## 9. 按钮与操作列

- 新增：`type="primary"`
- 修改：`type="warning"`
- 删除：`type="danger"`
- 其他业务动作：`type="info"`

不要额外加 `icon`、`link`、`size`，除非页面已有明确既有模式必须保持一致。

## 10. 自测要求

修改列表页或表单页后，默认至少做这些检查：

1. 切中文和英文，确认页面标题、搜索区、表头、操作按钮会刷新。
2. 打开弹窗后再次切语言，确认弹窗标题、表单项、footerButtons 会刷新。
3. 至少执行一次定向 `vue-tsc` 检查。
4. 如用户要求，启动 `apps/admin` 的 `pnpm dev` 并用 Chrome MCP 实测。

## 11. 实施顺序

当你接手一个旧页面做 i18n/结构重构时，默认按这个顺序推进：

1. 先确认 locale key 是否真实存在。
2. 把 `definePage.meta.title` 改成 key，并补中文注释。
3. 引入 `useI18nConfig`，把脚本配置统一收进 `computed(...)` / `withLocale(...)`。
4. 把表格列标题改成 `headerRenderer`。
5. 把搜索区和表单区配置改成 `withLocale/computed`。
6. 清掉 `tLabel`、`ht`、`dialogTitleT`、`renderI18n` 这类旧 helper 写法。
7. 把弹窗标题与 footerButtons 改成函数。
8. 做语言切换和弹窗联动自测。

## 12. 交叉约束

本技能和以下文档联动：

- `.claude/skills/code-style/SKILL.md`

如果两者发生冲突：

1. 先遵守 `code-style` 里的强约束。
2. 再用本技能补充页面结构、列表页、表单页和弹窗的实现方式。
