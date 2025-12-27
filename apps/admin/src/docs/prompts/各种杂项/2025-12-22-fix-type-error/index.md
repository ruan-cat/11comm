<!-- 多次复用提示词 已完成 -->

# 按照指定要求来修复类型错误、修改代码

1. 各种类型修复任务。
2. 各种细化的，简单的批处理任务。
3. 将 openspec 的一揽子任务拆分细化，多轮多次的让子代理完成代码写法修改。

## 零、运行类型检查命令，生成完整的错误清单报告

1. 运行`类型项目`和`后台项目`的类型检查命令。
2. 不需要你处理任何类型错误，只需要按照要求生成报告即可。
3. 分类、归纳、并统计类型错误。便于我针对性的处理不同种类的类型错误。
4. 将全部的，完整的类型错误，以报告的形式展示出来。

## 一、处理服务端代码的出现的字段不匹配的类型错误

1. 阅读全部 `apps/admin/server/**/mock-data.ts` 的文件。
2. 处理全部 `mock-data.ts` 出现的类型报错，使用正确的类型。
3. 补全数据，确保每一个 `mock-data.ts` 返回的数据都有 20~40 条左右。
4. 不允许你运行任何类型修复命令。只允许你手动阅读文件并逐步处理类型报错。
5. 不允许你处理范围之外的文件。

### 其他要求

1. 务必要完整阅读 `CLAUDE.md` 文档的全部规范要求。
2. 禁止编写脚本完成批处理任务：
   > **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
3. 主动开启多个后台运行的子代理并行完成任务：
   - 请你主动的开启多个独立并行的修改子代理，加快修改任务。
   - 你新建的子代理**必须**是**后台运行**的子代理。

## 二、（有部分代码仍旧有问题，需要继续直接使用）针对性修复类型项目出现的中文命名，和中间变量别名

在**类型项目**中，有很多类型和字段都是中文命名，我需要你按照 `.claude\agents\fix-type-error.md` 文档的标准，帮我实现兼容类型写法的删减，和中文字段名、类型名，变量名的改换，全部换成英文名。

你的核心任务是：

1. 删减并替换掉掉全部 `向后兼容` 的中文类型别名。
2. 中文字段名、类型名，变量名的改换，全部换成英文名。

### 1. 核心准则

1. **只做**变量替换，将全部中文命名的字段名、变量名、类型名。都换成英文名。
2. 删减掉全部多余兼容性类型别名。不允许编写中文类型名作为类型别名。
3. 在之前使用别名的地方，直接换成原本的英文类型。

比如这个例子：

```ts
import type { PropertyManagementCompanyFormVO } from "@01s-11comm/type";
/** FormVO类型别名 */
export type FormVO = PropertyManagementCompanyFormVO;
export interface PropertyManagementCompanyFormProps {
	form: FormVO;
	defaultValues: FormVO;
	mode?: Mode;
}
```

你需要将多余的别名删除，然后直接换成原本的类型即可：

```ts
import type { PropertyManagementCompanyFormVO } from "@01s-11comm/type";
export interface PropertyManagementCompanyFormProps {
	form: PropertyManagementCompanyFormVO;
	defaultValues: PropertyManagementCompanyFormVO;
	mode?: Mode;
}
```

### 2. 处理范围

1. 全部类型项目的类型名，出现中文变量命名的类型，就全部替换掉。
2. 全部后台项目的：
   - form.ts
   - form.vue
   - index.vue
3. 全部的类型项目和后台项目，检索字符串 `FormVO` 将字符串 `FormVO` 这款固定写法的类型别名，全面清退替换掉，换成原本的类型。
4. 在后台项目内，全文检索字符串 `向后兼容`，找到含有 `向后兼容` 字样注释的中文类型，将其替换。

### 3. 处理步骤

务必按照以下的严格顺序，逐步安排处理任务。

1. 先处理类型项目出现中文变量命名，全部替换成英文变量名。删减掉兼容性中文类型，和类型重命名导出。
2. 然后处理客户端项目的文件，按照以下分类逐步处理替换：
   - form.ts
   - form.vue
   - index.vue
3. 先确定清楚，中文命名的类型名，其使用范围有多大，明确清楚稍后替换时需要及时处理的文件，**避免出现遗漏的情况**。
4. **同时**的对使用`中文命名类型名`的文件，**同步**的替换成原本的`英文命名类型名`。务必确保**不要出现遗漏**的情况。

### 4. 其他要求

1. 务必要完整阅读 `CLAUDE.md` 文档的全部规范要求。
2. 禁止编写脚本完成批处理任务：
   > **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
3. 主动开启多个后台运行的子代理并行完成任务：
   - 请你主动的开启多个独立并行的修改子代理，加快修改任务。
   - 你新建的子代理**必须**是**后台运行**的子代理。

## 三、根据`业务路径`，检查全部的`类型项目`的文件命名与文件夹组织模式，是否严格满足`业务路径`的要求

如果发现不符合要求的，重命名文件。或新建一个导出空对象的 typescript 文件。文件命名风格为小驼峰短横杠风格。

根据业务路径，检查`类型项目`全部的文件。

## 四、将错误迁移的表单组件类型和默认表单数据，迁移回到 `form.ts` 内存储

### 1. 将形如 `xxxDefaultForm` 的变量迁移回 `form.ts` 内

比如这个例子：

```ts
// apps\admin\src\pages\operation-team\data-manage\property-management-company\components\form.ts
import { propertyManagementCompanyDefaultForm as defaultFormValues } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;
```

在`业务路径` `operation-team\data-manage\property-management-company` 内，对应的 `form.ts` 错误导入了来自类型项目的 `xxxDefaultForm` 的变量。形如 `xxxDefaultForm` 的变量在 `form.ts` 内本来就不应该拆分到类型项目，而且也不需要被重新命名。你需要按照以下步骤来完成修改：

1. 根据`业务路径` `operation-team\data-manage\property-management-company`，去类型项目找到定义 `propertyManagementCompanyDefaultForm` 的文件。
2. 将 `xxxDefaultForm` 变量，剪切迁移到原本的业务路径的 `form.ts` 内，重命名为固定的名称 `defaultForm` ，并导出。
3. 如果在类型项目内没有找到对外导出的 `xxxDefaultForm` 变量，就用类型项目或 `form.ts` 对应的 `xxxFormVO` 类型来新建一个 `defaultForm` 变量。

最终的正确结果如下：

```ts
// apps\admin\src\pages\operation-team\data-manage\property-management-company\components\form.ts
import type { PropertyManagementCompanyFormVO } from "@01s-11comm/type";
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PropertyManagementCompanyFormVO = {
	code: "",
	name: "",
	address: "",
	phone: "",
	administrator: "",
	legalRepresentative: "",
	establishmentDate: "",
	landmark: "",
	communityCount: 0,
	companyType: "",
	serviceLevel: "",
	operationStatus: "",
	remarks: "",
};
```

核心准则如下：

1. 不允许在`类型项目`内出现形如 `xxxDefaultForm` 变量的导出。应该剪切恢复至对应的 `form.ts` 内。
2. 不允许出现多余的变量重命名。
3. 每一个 `form.ts` 必须导出一个来自`类型项目`的 `xxxFormVO` 类型约束的 `defaultForm` 变量。

### 2. 处理范围

根据业务路径，检查：

- `类型项目`全部的文件。
- `后天项目`全部的 form.ts 文件。

### 3. 其他要求

1. 务必要完整阅读 `CLAUDE.md` 文档的全部规范要求。
2. 禁止编写脚本完成批处理任务：
   > **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
3. 主动开启多个后台运行的子代理并行完成任务：
   - 请你主动的开启多个独立并行的修改子代理，加快修改任务。
   - 你新建的子代理**必须**是**后台运行**的子代理。

## 五、（已完成、已归档）重新调整对 `./form` 路径内的模块导出方式

在后台项目中，有很多模块的导出是冗余的，是重新二次导出的，我需要你帮我删除。

### 核心原则与处理方针

1. 在后台项目内所有的 `form.ts` 内，只允许对外导出弹框组件的 props 类型，即形如 `xxxFormProps` 的类型，和 固定命名的 `defaultForm` 变量。其他变量和类型不允许导出。
2. 不允许将 `form.ts` 作为变量和类型的二次中转站。

### 对于每一个业务路径对应的文件处理步骤

1. 首先访问对应业务路径的 form.ts 文件。如果有其他变量和类型在 `form.ts` 内声明，请将这些变量直接剪切移动到对应`业务类型`的`类型项目`内。形如 `xxxFormVo` 或 `xxxFormData` 的类型，和形如 `xxxxOptions` 的下拉选择数组，都应该剪切迁移到`类型项目`内。
2. 接着依次访问以下文件，按照要求处理错误：
   - form.vue
   - index.vue
3. 如果其他文件出现了因为从 `./form` 路径缺乏导出的故障，请根据`业务路径`，从`类型项目`内导出所缺乏的变量和类型。
4. 如果在 `类型项目` 无法找到所需要的类型，就先去`类型项目`内补充类型和变量。

### 处理范围

1. 后台项目全部的 form.ts 文件。
2. 后台项目全部的 form.vue 文件。
3. 后台项目全部的 index.vue 列表页文件。

### 处理案例

以`业务路径` `dev-team\config-manage\item` 举例，这里将 form.ts 当成了二次导出的中转站。这不符合要求。

```ts
// apps\admin\src\pages\dev-team\config-manage\item\components\form.ts
import type { ConfigItemFormVO } from "@01s-11comm/type";
import { configItemTypeOptions, itemEnableStatusOptions } from "@01s-11comm/type";
export type { ConfigItemFormVO };
export { configItemTypeOptions, itemEnableStatusOptions };
```

在 `apps\admin\src\pages\dev-team\config-manage\item\components\form.vue` 内：

```ts
// apps\admin\src\pages\dev-team\config-manage\item\components\form.vue
import { ConfigItemFormProps, ConfigItemFormVO } from "./form";
```

在 `apps\admin\src\pages\dev-team\config-manage\item\index.vue` 内

```ts
// apps\admin\src\pages\dev-team\config-manage\item\index.vue
import { type ConfigItemFormProps, type ConfigItemFormVO, defaultForm } from "./components/form";
```

#### 正确处理方式

在 `form.ts` 内，删除掉全部来自于类型项目 `@01s-11comm/type` 导入的变量和类型。

在 `apps\admin\src\pages\dev-team\config-manage\item\components\form.vue` 内：

```ts
// apps\admin\src\pages\dev-team\config-manage\item\components\form.vue
import { ConfigItemFormProps } from "./form";
// 直接导入来自类型项目提供的类型
import type { ConfigItemFormVO } from "@01s-11comm/type";
```

在 `apps\admin\src\pages\dev-team\config-manage\item\index.vue` 内

```ts
// apps\admin\src\pages\dev-team\config-manage\item\index.vue
import { type ConfigItemFormProps, defaultForm } from "./components/form";
// 直接导入来自类型项目提供的类型
import type { ConfigItemFormVO } from "@01s-11comm/type";
```
