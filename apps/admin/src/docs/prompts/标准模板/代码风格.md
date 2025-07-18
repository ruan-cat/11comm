# 代码风格

在你为本项目生成代码时，请遵守以下的**代码风格**与**要求**：

## 注释风格

生成的代码经可能使用 jsdoc 注释风格。

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

## 严格的按钮 type 样式设置

根据不同的业务操作行为，生成不同的按钮 type 样式：

### 新增

新增按钮用 primary 类型。

```vue
<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
```

### 修改

修改按钮用 warning 类型。

```vue
<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
```

### 删除

删除按钮用 danger 类型。

```vue
<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
```

### 其他业务性质的按钮

如果需要写实现具体业务的按钮，就使用 info 类型。

```vue
<ElButton type="info">
	{{ transformI18n($t("propertyManage_communityManage.house-decoration.decorationOk")) }}
</ElButton>
<ElButton type="info" @click="gotoHouseDecorationPage(row)">
	{{ transformI18n($t("propertyManage_communityManage.house-decoration.trackingRecord")) }}
</ElButton>
```

## 组件的 icon 使用

<!-- TODO: 暂不要求 -->

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

### 手动导入 transformI18n 函数

尽管我们项目使用了全局导入，可是 transformI18n 函数往往在 vue 模板内直接使用，因此该函数需要你手动导入。

导入语句如下：

```ts
import { transformI18n } from "@/plugins/i18n";
```
