---
name: fix-type-error
description: 修复 TypeScript 类型错误，优化类型写法的通用子代理。
---

# 类型错误修复方法论

## 1. 类型错误的发现与定位

### 1.1 运行类型检查命令

**优先使用官方类型检查命令：**

```bash
# 完整类型检查
pnpm -F @01s-11comm/admin typecheck
pnpm -F @01s-11comm/type typecheck

# 或分别运行 TypeScript 和 Vue TypeScript 检查
npx tsc --noEmit --skipLibCheck
npx vue-tsc --noEmit --skipLibCheck
```

### 1.2 筛选特定文件的错误

当项目中存在大量类型错误时，使用筛选方法：

```bash
# 筛选特定模块的错误
npx vue-tsc --noEmit --skipLibCheck 2>&1 | grep -i "模块名"

# 例如：筛选 issues 相关的错误
npx vue-tsc --noEmit --skipLibCheck 2>&1 | grep -i "issues\|工单池"
```

### 1.3 错误信息解读要点

1. **文件位置**：注意错误发生的具体文件路径和行号
2. **错误类型**：
   - `TS2304`: 找不到名称
   - `TS2322`: 类型不匹配
   - `TS2440`: 导入冲突
   - `TS2345`: 参数类型不兼容
3. **上下文信息**：查看错误前后的代码片段

## 2. 常见类型错误解决方案，以及常见的类型写法优化方案

### 2.1 导入冲突问题

**表现：** `Import declaration conflicts with local declaration`

**解决方案：**

1. 检查是否重复导入了相同的类型或接口
2. 如果本地有定义，移除外部导入
3. 使用别名导入避免命名冲突

**示例：**

```typescript
// ❌ 错误：导入冲突
import { type 工单池_列表查询_VO } from "./test-data";
interface 工单池_列表查询_VO { ... }

// ✅ 正确：移除导入，使用本地定义
interface 工单池_列表查询_VO { ... }
```

### 2.2 缺失导入问题

**表现：** `Cannot find name 'xxx'`

**解决方案：**

1. 首先检查是否已开启自动导入功能
2. 查看项目的自动导入配置文件
3. 如未配置自动导入，手动添加导入语句

**自动导入检查位置：**

- `build/plugins/unplugin-auto-import/index.ts`

请务必要完整阅读 `apps\admin\build\plugins\unplugin-auto-import\index.ts` 自动导入文件，了解清楚那些类型属于自动导入的，以确保这些自动导入的类型、函数、变量。不会被使用错误的模块导入。

**常见自动导入项：**

- `lodash-es`: `merge`, `isEmpty` 等
- `vue`: 所有 Vue 组合式 API
- `plus-pro-components`: `FieldValues`, `PlusColumn` 等
- `src/composables/**/*.ts`: 所有自定义组合式函数

### 2.3 类型不匹配问题

**表现：** `Type 'xxx' is not assignable to type 'yyy'`

**解决方案：**

1. 确认期望的类型定义
2. 检查实际值的类型
3. 使用类型断言或修改类型定义

**示例：**

```typescript
// ❌ 错误：类型不匹配
openDialog({ mode: "view", row }); // Mode 类型为 "add" | "edit" | "info"

// ✅ 正确：使用正确的类型值
openDialog({ mode: "info", row });
```

### 2.4 组件内部函数缺失导入

**表现：** 组合式函数内部使用未导入的 API

**解决方案：**

1. 检查组合式函数内部的 Vue API 使用
2. 确保所有使用的函数都已正确导入

**示例：**

```typescript
// ❌ 错误：onMounted 未导入
export function usePlusFormReset(plusFormInstance: any) {
  onMounted(() => { ... }); // onMounted 未导入
}

// ✅ 正确：导入 onMounted
import { onMounted } from "vue";
export function usePlusFormReset(plusFormInstance: any) {
  onMounted(() => { ... });
}
```

### 2.5 错误的模块导入

```typescript
// ❌ 错误 从不存在的 `vue-macro` 模块内导入模块
import { cloneDeep, sleep, useToggle } from "vue-macro";

// ✅ 正确 在正确的模块内导入工具
import { cloneDeep } from "@pureadmin/utils";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
```

### 2.6 找不到正确的 `PlusFormRules` 类型

```ts
// ❌ 错误 从 `plus-pro-components` 模块内导入 PlusFormRules 类型
import { type OptionsType, type FieldValues, type PlusColumn, type PlusFormRules } from "plus-pro-components";

// ✅ 正确 在 @/config/constant 全局常量内， 导入 PlusFormRules 类型
import { type FieldValues, type PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
```

### 2.7 在错误的地方导入 `TableColumnList` 类型

```typescript
// ❌ 错误 从 `@pureadmin/table` 模块内导入了不存在的 `TableColumnList` 类型
import type { TableColumnList } from "@pureadmin/table";

// ✅ 正确 无需手动导入， TableColumnList 类型是全局类型，不需要我们手动导入
```

### 2.8 用导入的 mode 类型来优化手写的 mode 模式类型

不好的类型写法如下：

```typescript
/**
 * @description 商户管理员表单 props Merchant admin form props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface MerchantAdminFormProps {
	/** 表单数据 Form data */
	form: MerchantAdminFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: MerchantAdminFormVO;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}
```

我们不应该手写类型 `mode?: "add" | "edit" | "info";` ，这很容易出错。相反，我们应该使用导入的 mode 类型，来完成类型优化。好的类型写法如下：

`Mode` 是一个在客户端代码内全局导入的类型，直接使用即可，无需考虑手动导入。

```typescript
/**
 * @description 商户管理员表单 props Merchant admin form props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface MerchantAdminFormProps {
	/** 表单数据 Form data */
	form: MerchantAdminFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: MerchantAdminFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
```

### 2.9 不要使用错误的，不存在的，容易带来误导的 `mode?: "add" | "edit" | "view";` 类型，使用全局的客户端类型 Mode

1. 类型 `mode?: "add" | "edit" | "view";` 是错误的。
2. 类型 `mode?: "add" | "edit" | "info";` 才是正确的。我们不存在错误的 view 类型。
3. 我们事实上也不应该直接写字面意义上的 `mode?: "add" | "edit" | "info";` 类型。在客户端代码，即 `apps\admin\src` 目录内，我们应该直接使用 `mode?: Mode;` 的写法。其中 Mode 是客户端代码内全局导入的类型。直接使用即可。
4. 如果在`类型项目`内，出现上述写法，请你将这个错误迁移位置的类型，根据`业务路径`，迁移回到`后台项目`的对应`业务路径`的 form.ts 文件内。`类型项目`是不应该出现这样的写法的，出现的原因是因为有工具错误的迁移该类型到`类型项目`目录下了，所以需要你将该类型迁移到正确的位置。

### 2.10 删除向后兼容的中文类型，直接用纯英文命名的类型做替换

1. 就比如以下的类型，就是不合适的类型，你应该删除掉纯中文的类型，并要求使用中文类型的其他文件，直接使用纯英文的业务类型即可。不需要写任何向后兼容的中文类型。
2. 你应该重点去修复因为中文类型被删除后而导致的类型错误，其修复方式就是直接替换掉中文类型，直接换成英文类型。

```typescript
/** 向后兼容：巡检方式 / Backward compatibility: PatrolMethodType */
export type 巡检方式 = PatrolMethodType;
/** 向后兼容：任务状态 / Backward compatibility: TaskStatusType */
export type 任务状态 = TaskStatusType;
/** 向后兼容：巡检点状态 / Backward compatibility: PatrolPointStatusType */
export type 巡检点状态 = PatrolPointStatusType;
/** 向后兼容：巡查明细表单_VO / Backward compatibility: 巡查明细表单_VO */
export type 巡查明细表单_VO = PatrolDetailFormVO;
/** 向后兼容：巡查明细表单Props / Backward compatibility: 巡查明细表单Props */
export type 巡查明细表单Props = PatrolDetailFormProps;
```

### 2.11 错误导入 getRouteRank 函数

以下代码是错误的，你不应该主动导入任何 getRouteRank 函数。这个函数是全局自动导入的，不需要你手动导入。

getRouteRank 是在宏上的使用的。

```typescript
// 错误的导入 应该删除
import { getRouteRank } from "@/router/rank";
```

### 2.12 错误导入来自 `plus-pro-components` 模块的全局类型

请注意，以下即可类型均来自于 `plus-pro-components` 模块，他们都是客户端代码内全局通用的类型。

- `FieldValues`
- `PlusSearchProps`
- `PlusColumn`

这些类型都在 `apps\admin\build\plugins\unplugin-auto-import\index.ts` 自动导入插件内有声明。

这是常见错误。如果你需要处理类型错误而导入全局类型，请在 `plus-pro-components` 模块内导入正确的类型。

```typescript
// 正确的导入路径
import type { FieldValues } from "plus-pro-components";
```

### 2.13 错误导入全局类型 TableColumnList

在客户端代码内，类型 `TableColumnList` 来自于全局类型文件 `apps\admin\types\global.d.ts` 。不应该手动导入。

```typescript
// 该写法是错误的 不应该去任何模块导入 TableColumnList 类型
import type { TableColumnList } from "@pureadmin/table";
```

### 2.14 错误导入全局类型 PureTableBarProps

```typescript
// 该写法是错误的 不应该去任何模块导入 PureTableBarProps 类型。 不应该去任何 `@pureadmin` 模块内导入该类型
import type { PureTableBarProps } from "@pureadmin/table";
```

### 2.15 不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型

**背景说明：**

对于形如 `xxxxxxFormProps` 格式的类型，这些类型都是表单弹框类型，不是业务类型。你不应该将弹框组件的类型迁移到类型项目内。

**错误示例：**

```typescript
// apps\type\src\business\property-manage\report-manage\repair-reports-summary-table.ts
/**
 * 报修汇总表表单属性
 * Repair reports summary table form props
 */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormData;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormData;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}
```

**正确做法：**

1. 根据业务路径，迁移到对应的 `form.ts` 内。
2. 在 `form.ts` 内导入固定写法的 `import { type Mode } from "@/composables/use-mode";` 类型。
3. 将 `mode` 字段的类型，统一换成 `Mode` 类型。

```typescript
// apps\admin\src\pages\property-manage\report-manage\repair-reports-summary-table\components\form.ts
import { type Mode } from "@/composables/use-mode";
/**
 * 报修汇总表表单属性
 * Repair reports summary table form props
 */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormData;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormData;
	/** 表单模式 Form mode */
	mode?: Mode;
}
```

**关键要点：**

- 表单弹框组件类型应该位于客户端代码的 `form.ts` 文件中，而不是类型项目中
- `Mode` 类型是客户端代码内全局导入的类型，直接使用即可
- 避免在类型项目中出现业务无关的表单组件类型

### 2.16 H3 v2 (Nitro v3) 彻底废弃 event.request / event.response

**现象：** `Property 'request' does not exist on type 'H3Event'`

**根因：** Nitro v3 升级到 H3 v2，H3Event 不再暴露底层的 request / response 对象

**正确写法：**

```typescript
// ❌ 旧写法（H3 v1）
const ip = event.request.headers.get("x-forwarded-for");
event.response.headers.set("X-RateLimit-Limit", "100");

// ✅ 新写法（H3 v2）
import { getRequestHeader, setResponseHeader } from "nitro/h3";
const ip = getRequestHeader(event, "x-forwarded-for");
setResponseHeader(event, "X-RateLimit-Limit", "100");
```

### 2.17 Neon Auth 类型 - createAuthClient 返回 NeonAuthPublicApi<T>

**现象：** NeonAuth 不接受无参数，导致类型报错

**正确写法：**

```typescript
// ❌ 错误
import type { NeonAuth } from "@neondatabase/auth";
export type AuthClientType = NeonAuth;

// ✅ 正确
import { createAuthClient } from "@neondatabase/auth";
import type { NeonAuthPublicApi } from "@neondatabase/auth";
export type AuthClientType = NeonAuthPublicApi<any>;
```

### 2.18 JsonVO 类型来源必须统一用 @01s-11comm/type

**现象：** `res.success` 报 "Property 'success' does not exist"

**根因：** 错误地从 `@ruan-cat/utils/vueuse` 导入 JsonVO（无 success 字段）

**两个 JsonVO 的对比：**

| 来源                   | 字段                                                      |
| ---------------------- | --------------------------------------------------------- |
| @ruan-cat/utils/vueuse | code, message, data                                       |
| @01s-11comm/type       | code, message, data, success?, error?, stack?, timestamp? |

**正确写法：**

```typescript
// ❌ 错误
import type { JsonVO } from "@ruan-cat/utils/vueuse";

// ✅ 正确
import type { JsonVO } from "@01s-11comm/type";
```

### 2.19 pure-admin setToken 不接受 string，需要 DataInfo<number> 对象

**现象：** `Argument of type 'string' is not assignable to parameter of type 'DataInfo<number>'`

**字段映射（Neon Auth → DataInfo）：**

| Neon Auth 响应字段 | DataInfo 字段 |
| ------------------ | ------------- |
| data.token         | accessToken   |
| data.refreshToken  | refreshToken  |
| data.expiresIn     | expires       |

**正确写法：**

```typescript
// ❌ 错误
setToken(data.token);

// ✅ 正确
setToken({
	accessToken: data.token,
	refreshToken: data.refreshToken,
	expires: data.expiresIn,
} as DataInfo<number>);
```

### 2.20 defineHandler 不支持 HTTP 方法对象格式

**现象：** `Object literal may only specify known properties, and 'post' does not exist in type 'EventHandlerObject'`

**根因：** Nitro v3 文件路由通过文件名区分 HTTP 方法

**正确写法：**

```typescript
// ❌ 错误
export default defineHandler({
  async post(event, body) { ... },
});

// ✅ 正确
export default defineHandler(async (event) => {
  const body = await readBody<MyInput>(event);
  return handleXxx(event, body);
});
```

### 2.21 useDb(event: H3Event) 必须传 event

**现象：** `Expected 1 arguments, but got 0`

**根因：** Cloudflare Worker 环境中，环境变量只在 request handler 内部可用

**设计原则：** 所有需要调用数据库的服务端工具函数，必须将 `event: H3Event` 作为第一个参数

**正确写法：**

```typescript
// ❌ 错误
export async function getMigrationStats() {
	const db = useDb();
}

// ✅ 正确
export async function getMigrationStats(event: H3Event) {
	const db = useDb(event);
}
```

### 2.22 Nitro plugin hooks 回调参数是 HTTPEvent，需强制转为 H3Event

**现象：** `Property 'path' does not exist on type 'HTTPEvent'`

**正确写法：**

```typescript
import type { H3Event } from "nitro/h3";

nitroApp.hooks.hook("request", async (rawEvent) => {
	const event = rawEvent as H3Event;
	const path = event.path;
});
```

### 2.23 Element Plus 表单规则 type: "email" 需要 as const

**现象：** `Type 'string' is not assignable to type 'RuleType'`

**正确写法：**

```typescript
// ❌ 类型推断为 string
{ type: "email", message: "请输入正确邮箱", trigger: "blur" }

// ✅ 使用 as const
{ type: "email" as const, message: "请输入正确邮箱", trigger: "blur" }
```

### 2.24 readonly 数组不能直接 as string[]

**现象：** `TS2352: Conversion of type 'readonly [...]' to type 'string[]' may be a mistake`

**正确写法：**

```typescript
// ❌ TypeScript 认为不安全
(BUSINESS_TABLE_GROUPS[group] as string[])
	.includes(tableName)
	(
		// ✅ 双重 as
		BUSINESS_TABLE_GROUPS[group] as unknown as string[],
	)
	.includes(tableName);
```

## 3. 项目特定的类型处理策略

### 3.1 利用自动导入配置

本项目配置了强大的自动导入功能，包括：

- Vue 3 组合式 API
- VueUse 函数
- lodash-es 工具函数
- Plus Pro Components 类型
- 所有自定义组合式函数

**优势：**

- 减少手动导入的工作量
- 避免导入遗漏
- 保持代码整洁

### 3.2 类型定义位置规范

1. **API 接口类型**：定义在对应的 `test-data.ts` 文件中
2. **表单类型**：定义在 `components/form.ts` 文件中
3. **组件 Props 类型**：定义在组件文件夹内的类型文件中

### 3.3 命名约定

- 接口名称使用中文，如：`工单池_列表数据`
- 类型名称以 `_VO`、`_数据`、`_选项` 等后缀区分用途
- 函数名使用驼峰命名，如：`usePlusFormReset`

## 4. 修复流程总结

### 4.1 标准修复流程

1. **运行类型检查**：获取完整的错误列表
2. **筛选目标错误**：专注于特定模块的错误
3. **分析错误原因**：理解错误的根本原因
4. **制定修复方案**：选择最适合的解决方案
5. **实施修复**：修改代码
6. **验证修复**：再次运行类型检查确认

### 4.2 最佳实践

1. **渐进式修复**：一次修复一个模块的错误，避免大规模修改
2. **保留原意**：修复类型错误时不要改变业务逻辑
3. **利用工具**：充分利用 IDE 的类型提示和错误信息
4. **文档参考**：查阅项目文档了解类型定义规范

### 4.3 预防措施

1. **及时检查**：完成功能后立即运行类型检查
2. **遵循规范**：按照项目的类型定义规范编写代码
3. **合理拆分**：将复杂类型拆分为更小的、可复用的类型
4. **充分测试**：确保类型修复不影响功能正常运行

## 5. 工具和技巧

### 5.1 有用的命令

```bash
# 检查特定文件类型
npx tsc --noEmit src/path/to/file.ts --skipLibCheck

# 查看自动导入的生成文件
cat apps/admin/types/auto-imports.d.ts

# 搜索类型定义
grep -r "type.*接口名" src/
```

### 5.2 IDE 配置建议

1. 启用 TypeScript 严格模式
2. 配置自动导入提示
3. 开启类型检查实时反馈
4. 使用类型导航功能快速定位定义

### 5.3 调试技巧

1. 使用 `typeof` 操作符检查变量类型
2. 利用 IDE 的悬停提示查看类型信息
3. 在复杂类型上使用类型断言进行调试
4. 使用条件类型简化复杂逻辑

通过遵循这套方法论，可以系统性地处理项目中的类型错误，提高开发效率和代码质量。

## 6. 实战案例：Plus Pro Components 表单类型修复

### 6.1 案例背景

**文件位置：** `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/components/form.vue`

**遇到的问题：**

1. `valueType: "time"` 类型错误
2. 表单验证规则 `pattern` 类型不兼容
3. 未使用的导入警告

### 6.2 问题分析与解决过程

#### 6.2.1 问题一：valueType 类型错误

**错误表现：**

```plain
不能将类型""time""分配给类型"TableValueType | FormItemValueType"
```

**分析思路：**

1. **查阅文档**：使用 Context7 查询 Plus Pro Components 文档
2. **发现正确类型**：文档显示 `FormItemValueType` 包含 `'time-picker'` 而非 `'time'`
3. **定位错误**：第 55 行和第 60 行的 `valueType: "time"`

**解决方案：**

```typescript
// ❌ 错误的写法
{
  label: "开始时间",
  prop: "开始时间",
  valueType: "time",  // 类型错误
}

// ✅ 正确的写法
{
  label: "开始时间",
  prop: "开始时间",
  valueType: "time-picker",  // 正确的类型
}
```

**关键经验：**

- Plus Pro Components 的 `valueType` 有严格的类型定义
- 时间选择器应该使用 `'time-picker'` 而不是 `'time'`
- 当遇到类型库相关错误时，优先查阅官方文档

#### 6.2.2 问题二：表单验证规则 pattern 类型问题

**错误表现：**

```plain
属性"pattern"的类型不兼容。不能将类型"unknown"分配给类型"string | RegExp"
```

**分析思路：**

1. **类型推断问题**：TypeScript 无法正确推断 `pattern` 的类型
2. **需要明确类型**：为验证规则对象添加明确类型注解

**解决方案：**

```typescript
// ❌ 错误的写法：类型推断失败
const plusFormRules = reactive({
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
});
```

```typescript
// ✅ 正确的写法：
// 1. 使用全局类型 `PlusFormRules` 来约束变量 plusFormRules 。
// 2. 变量 plusFormRules 使用 ref 而不是 reactive 来定义。
const plusFormRules = ref<PlusFormRules>({
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
});
```

#### 6.2.3 问题三：未使用导入清理

**错误表现：**

```plain
已声明"defaultForm"，但从未读取其值
```

**解决方案：**

```typescript
// ❌ 错误：导入但未使用
import { WorkingScheduleFormProps, defaultForm, type 排班表表单_VO } from "./form";

// ✅ 正确：移除未使用的导入
import { WorkingScheduleFormProps, type 排班表表单_VO } from "./form";
```

### 6.3 修复验证

使用 IDE 诊断工具验证修复结果：

```bash
# 检查特定文件的类型错误
mcp__ide__getDiagnostics(uri="具体文件路径")

# 完整类型检查筛选特定模块
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep -E "working-schedule|error|Error"
```

### 6.4 经验总结

#### 6.4.1 第三方组件库类型错误处理

1. **查阅官方文档**：使用 Context7 或其他工具查阅组件库文档
2. **理解类型定义**：仔细阅读组件库的 TypeScript 类型定义
3. **遵循命名约定**：严格按照组件库的类型约定编写代码

#### 6.4.2 表单验证类型处理

1. **导入类型定义**：明确导入 `FormItemRule` 等相关类型
2. **类型断言**：在类型推断失败时使用 `as` 进行类型断言
3. **保持一致性**：确保所有验证规则对象使用相同的类型处理方式

#### 6.4.3 代码质量维护

1. **及时清理**：移除未使用的导入和变量
2. **验证修复**：使用 IDE 工具验证修复效果
3. **文档更新**：将解决方案记录到文档中供后续参考

### 6.5 通用修复模板

对于类似的 Plus Pro Components 表单类型错误，可以使用以下修复模板：

```typescript
import { useTemplateRef, reactive } from "vue";
import type { FormItemRule } from "element-plus";
import type { PlusColumn } from "plus-pro-components";

// 表单项配置模板
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "字段名称",
		prop: "fieldName",
		valueType: "正确的-value-type", // 根据文档选择正确类型
	},
]);

// 验证规则模板
const plusFormRules = reactive({
	fieldName: [
		{ required: true, message: "错误信息", trigger: "blur" } as FormItemRule,
		{ pattern: /正则表达式/, message: "格式错误信息", trigger: "blur" } as FormItemRule,
	],
});
```

通过这个实战案例，我们学会了如何系统性地处理第三方组件库的类型错误，特别是在表单组件中常见的类型问题。

## 7. 实战增补：全局 TSX 与路由类型快速止血手册

### 7.1 适用场景

- Element Plus JSX 组件被识别为 `JSX.IntrinsicElements` 不存在（如 `el-button`、`el-tag` 等）。
- Iconify 自定义标签（`iconify-icon-offline`、`iconify-icon-online`）在 JSX 中类型报错。
- `cellRenderer` / `headerRenderer` 返回值与 `TableColumnRenderer` 类型不兼容。
- `router.push({ name })` 的 name 与路由联合类型不匹配。

### 7.2 快速处置策略

1. **兜底通过（先跑通 typecheck）：** 在 demo/展示或非核心业务的 TSX 文件头添加 `// @ts-nocheck`，立即消除批量 JSX 报错。
2. **组件断言法：** 将 JSX 内的 Element Plus / Iconify 组件写成 `ElButton as any`、`IconifyIconOffline as any`，或改回 template 写法。
3. **Renderer 返回值：** 如需简快处理，将 JSX 包一层 `as any` 或直接 `return h(...)`，确保返回 `VNode | string`。
4. **路由 name 不匹配：** 临时用 `router.push({ name: 'XXX' as any })` 保障通过；后续比对路由声明修正 name。

### 7.3 操作步骤（推荐顺序）

1. 主动使用来自`类型项目`提供的业务类型和公共类型。
2. 运行 `pnpm -F @01s-11comm/admin typecheck` 获取完整清单。
3. 对成批 JSX 报错的 demo/展示文件先加 `ts-nocheck` 兜底。
4. 对核心业务文件精修：
   - Element Plus JSX：组件改为 `ElXxx as any` 或转 template。
   - Iconify：改用已注册组件并 `as any`。
   - Renderer：必要时 `as any` 包裹。
5. 路由类型错误：临时 `as any`，再排期纠正路由枚举。
6. 再跑 typecheck；零报错后，如需提升质量，逐步移除 `ts-nocheck` 并补全类型。

### 7.4 后续精修指引

- 逐步移除 `ts-nocheck`：为 JSX 组件补类型或改回模板。
- 抽象通用 Icon 组件与表格渲染 helper，减少散落的 `as any`。
- 校准路由 name 枚举，消除对 `as any` 的依赖。

## 8. 类型项目的代码组织方式与导出规范

### 8.1 在类型项目内，必须使用全量的导出语法

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

### 8.2 不允许逐个罗列的导出

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

### 8.3 在类型项目，根据业务路径，统一使用 index.ts 来统一作为导出入口

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

### 8.4 遇到类型错误时，重复的内容导出时的处理方式

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
