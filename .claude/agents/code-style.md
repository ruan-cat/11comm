---
name: code-style
description: 这是一个代码风格管控的代理。每当我需要你把控【代码风格】时，请你主动使用该代理。本项目的代码风格，请严格按照本文提供的标准实施。
color: green
---

# 代码风格

在你为本项目生成代码时，请遵守以下的**代码风格**与**要求**：

## 不需要运行 format 格式化命令

在执行该代理时，请不要运行任何格式化命令。

## 注释风格

生成的代码尽可能使用 jsdoc 注释风格。

错误的例子：

```ts
// 业务配置
```

正确的例子：

```ts
/** 业务配置 */
```

## 使用全局导入的组件和类型

请你认真的阅读我提供给你的上下文例子。在我提供给你的例子中，很多类型、组件都是用全局导入的方式导入的。

如果你发现这些全局导入的东西出现类型报错，请你总结出来汇报给我。根据我的指令来修复类型错误。

我不希望你去手动导入这些全局组件和类型。

## 组件命名风格

- 不要生成短杆命名的风格，要求生成的 vue 组件名称风格，使用大驼峰命名风格。

就比如 element-plus 组件库的按钮组件，你应该生成 `<ElButton>` 而不是 `<el-button>`

### 错误的代码例子

```vue
<el-button type="warning" :icon="useRenderIcon('ep:edit')" @click="handleEditEmployee(row)">
  {{ transformI18n($t("common.buttons.edit")) }}
</el-button>
```

### 正确的代码例子

```vue
<ElButton type="warning" @click="handleEdit(row)">
	{{ transformI18n($t("common.buttons.edit")) }}
</ElButton>
```

## 按钮组件 `<ElButton>` 的代码风格

### 严格的按钮 type 样式设置

根据不同的业务操作行为，生成不同的按钮 type 样式，针对写死的，给定的业务按钮，其类型是固定的。如下要求：

#### 新增

新增按钮用 primary 类型。

```html
<template>
	<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
</template>
```

#### 修改

修改按钮用 warning 类型。

```html
<template>
	<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
</template>
```

#### 删除

删除按钮用 danger 类型。

```html
<template>
	<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
</template>
```

#### 其他业务性质的按钮

如果需要写实现具体业务的按钮，就使用 info 类型。

```html
<template>
	<ElButton type="info">
		{{ transformI18n($t("propertyManage_communityManage.house-decoration.decorationOk")) }}
	</ElButton>
	<ElButton type="info" @click="gotoHouseDecorationPage(row)">
		{{ transformI18n($t("propertyManage_communityManage.house-decoration.trackingRecord")) }}
	</ElButton>
</template>
```

### 按钮不允许增加额外的字段

按钮组件不允许增加多余的配置属性。在没有得到明确的指令时，默认执行本子代理时，不应该为按钮组件增加多余的属性配置。

错误写法：

```html
<template>
	<ElButton type="primary" size="small" link @click="handleDelete(row)">
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

正确写法：

```html
<template>
	<ElButton type="primary" @click="handleDelete(row)"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
</template>
```

你不应该增加冗余的配置。就应该保留唯一的 type 属性。其余诸如 size 和 link 这样的属性，都不应该配置。

### 按钮组件不允许配置任何形式的 icon 图标

1. 不允许配置任何形式的 icon，不希望看到各种按钮都有自己的一套 icon。
2. 不允许使用 icon 插槽来配置 icon。比如以下例子：

错误例子：

```html
<template>
	<ElButton type="primary" @click="openDialog({ mode: 'add' })">
		<template #icon>
			<IconifyIcon icon="ep:plus" />
		</template>
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

正确例子：

不应该使用 icon 插槽来配置任何形式的按钮。

```html
<template>
	<ElButton type="primary" @click="openDialog({ mode: 'add' })">
		{{ transformI18n($t("common.buttons.add")) }}
	</ElButton>
</template>
```

## 组件使用 icon 规范

不允许私自使用 icon 装饰。

## 导入模块

大部分模块是全局导入的，不需要你专门处置。特别是某些模块，不需要你手动写导入语句。

其中，`getRouteRank` 函数不需要你手动导入。

导入语句必须在 `definePage` 页面宏的下方。不要写在 `definePage` 的上面。

### 例子 1

错误的例子：

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

正确的例子：

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

## i18n

我们生成的模板代码，要尽可能满足 i18n 的需求。

### 按钮的中文命名一律使用固定的 i18n 工具获得

按钮的命名必须严格的使用 i18n 工具，不要自己直接写中文。对于常用的按钮来说，绝大多数的名称都已经准备好了，不需要你写中文名称。

### 积极复用现有的 i18n 配置文件

这是全部的 i18n 翻译文本，你应该积极地阅读现有的 i18n 配置文件，学会复用现存的 i18n 配置文本。

请读取以下目录：

`apps\admin\locales`

### 不要随意新增 i18n 业务用的翻译文本

我们的目的是套模板，不要生成多余的 i18n 文本配置文件。在你根据图片识别业务的字段名称时，你应该直接使用其中文名，不要去新建专门的业务用 i18n 配置文件。

### 不要新增冗余的按钮文本

在你处理 i18n 文本时，请不要新增冗余的按钮文本。比如新增、修改、删除按钮这些文本。这些公共的文本已经在以下的配置文件内准备就绪了。

请你阅读下面的翻译文本，并确保**不要新建任何冗余的按钮文本**。

- 通用的英文翻译 `apps\admin\locales\en\common.yaml`
- 通用的中文翻译 `apps\admin\locales\zh-CN\common.yaml`

### 手动导入 transformI18n 函数

尽管我们项目使用了全局导入，可是 transformI18n 函数往往在 vue 模板内直接使用，因此该函数需要你手动导入。

导入语句如下：

```ts
import { transformI18n } from "@/plugins/i18n";
```

### 使用模板插值

在你使用 i18n 的模板插值语法时，请你使用以下代码写法来完成翻译。

```ts
import { useI18n } from "vue-i18n";
const { t } = useI18n();
```

请你用组合式 api 提供的 `t` 函数来使用模板插值语法。

### i18n 的部分文本应该用双引号括起来

针对 `apps/admin/locales/en/*.yaml` 和 `apps/admin/locales/zh-CN/*.yaml` 的 i18n 文本配置文件，满足以下规则的文本，都应该用双引号括起来。

#### 例子 1： 含有尾缀冒号的文本

冒号也作为文本的一部分，为了避免出现 yaml 的语法识别错误，应该连同冒号也一同放在双引号内部。

错误例子：

```yaml
titleCharCount: Title characters:
```

正确例子：

```yaml
titleCharCount: "Title characters:"
```

#### 例子 2： 含有插值语法的英文文本

为了防止前缀的括号造成 yaml 语法错误，这里应该连同整行文本都纳入双引号内。

错误例子：

```yaml
operationSuccess: {operation} successful
```

正确例子：

```yaml
operationSuccess: "{operation} successful"
```
