# 根据特定的 LLMs 站点生成 API 文档

在本次对话中，你的任务是生成 API 请求接口。请根据 API 文档，你将根据我提供给你的关键词，生成接口。

在本次对话中，我们将按照指定的要求，逐步地，批量的，少量多次的生成接口和接口请求用例。

## 主动使用 mcp 工具 fetch-mcp

在后续的对话中，请你主动使用 MCP `fetch-mcp` 提供的 fetch_markdown 工具，访问我提供的 url 地址。

如果你未发现可用的 `fetch-mcp` 工具，请立刻停止，并要求我检查该工具是否可用。

## 全部核心资料的上下文

- 文档：使用 useRequestIn01s 函数：https://utils.ruan-cat.com/vueuse/useAxios-for-01s/use.html
- 文档：01s 内封装好的 useAxios 函数： https://utils.ruan-cat.com/vueuse/useAxios-for-01s/
- 全部的 github 实现代码： https://github.com/ruan-cat/monorepo/tree/main/packages/utils/src/vueuse/useAxios-for-01s

生成 api 接口的工具，以及工具如何使用，均在此文档内有详细讲述。

## 阅读 LLM.txt 文档

- https://01s-11.apifox.cn/llms.txt

我要求生成的全部接口信息，都在上述文档内。

## 工作范围

我会要求你修改、编辑或新建文件。你的文件修改范围仅限于 @apps\admin\src\api 目录。你只可以在该目录内新建并修改文件。

## 文件后缀类型

你将生成 `*.ts` 和 `*.test.ts` 格式的文件。

- `*.ts` 即真实的接口请求。
- `*.test.ts` 即接口请求的测试套件。

## 交互方式

我会向你这样提问，如下例子：

1. 请根据 API 文档，生成 `获取XXX` 接口。
2. 生成 `删除***` 接口
3. 生成 【图标录入接口】

你的工作方式应该如下，举例如下：

## 新建文件夹时提醒我

在你想新建文件夹时，提醒我，并由我审核你的文件夹命名。

## 标准以本文档为主

未来我会给你提供额外的测试用例，和具体的上下问代码。如果你发现我提供的代码和本文所述的内容有差异，请你立刻停止生成，并和我核实正确的生成标准。再开始生成代码。

标准优先级如下：

1. 本文。
2. 我提供给你的 url 链接，和各种在线文档。
3. 我提供给你的上下文代码。

## api 接口代码，生成案例

如下例子所示：

```ts
/**
 * 编辑用户详情接口
 * @description
 * id必填，其他字段选填
 */
export function sysManagerModifyUserDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RequiredPick<UserDetail, "id">>({
		url: "/sys-manager/modify/userdetail",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				id: "",
			},
		},
	});
}
```

1. 生成的 jsdoc 注释，不要包含任何 `@see` 字样。不需要增加额外的链接。
2. 导入 `useRequest` 接口请求工具时，导入语法要严格使用上述文档提供的例子来导入。我们导入时已经使用路径别名了。
3. 在生成接口代码时，同时生成业务类型。其中，在生成分页接口时，不要生成额外的 PageDTO 类型。请使用全局自动提供的全局类型。PageDTO 是全局类型，你应该直接使用。

## api 接口代码 代码风格

在你生成 api 接口代码时，请遵守以下代码风格：

### 仅仅导入一行接口请求工具

正确的例子：

```ts
import { useRequest } from "@/composables/use-request";
```

整个文件只需要导入一行接口请求工具即可。不需要你手动导入其他多余的类型。

以下是错误的例子：

```ts
import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { ParamsBodyKey, ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { AxiosRequestConfig } from "axios";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
```

不应该导入过多多余的内容。我们项目使用了自动导入，很多工具不需要你手动导入。

## api 测试代码 生成案例

请严格遵守以下的测试用例代码生成规则。

### 测试用例的 data 变量，允许出现类型报错

1. 不要去处理测试用例的 data 变量的类型报错。
2. 不要主动的添加 unknown 类型和 any 类型。

### 测试用例内解构导出的内容仅有`execute`和`data`

我们的工具确实提供了很多响应式变量。但是我要求你在测试用例内，只解构出 `execute` 和 `data` 变量。

### 使用测试套件完成多个接口的测试

1. 导入的测试工具仅为以下的测试套件。我们用测试套件来完成测试。
   > `import { describe, it } from "vitest";`

未来要测试的接口很多，为了实现分组效果，我要求接口都在 describe 内定义的 it 函数内完成测试。

### 使用相对路径导入要测试的函数

1. 不需要增加额外的 `@ts-ignore`。
2. 无 .ts 后缀。

### 输出格式

使用 console.warn + printFormat 输出。我需要 console.warn 实现一定程度的分组效果。

## 根据请求头类型，增加 upType 上传类型字段

我所提供的接口文档内，会包含具体的请求头类型。增加 `upType` 上传类型字段。

你不应该增加请求头字段。相反，你应该用 `upType` 字段来表示该接口的上传类型。

与此同时，你应该用全局导入的 `UpType` 枚举对象，来使用正确的上传类型。

这是错误的，手写请求头的例子：

```ts
export function addColumn<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddColumnParams>({
		url: "/app/add-column",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			data: {},
		},
	});
}
```

这是正确的，用 upType 字段来表示上传类型的例子：

```ts
export function addColumn<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddColumnParams>({
		url: "/app/add-column",
		options,
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {},
		},
	});
}
```

## 边缘情况注意事项

你在生成接口时，应该严格遵循的注意事项：

1. 当目标接口的参数请求方式为 query 时，请不要添加多余的 params 参数。
2. 当接口请求的返回参数含有 `PageDTO` 时，不要生成该类型。直接使用已经有的全局 `PageDTO` 类型即可。
3. 生成的泛型 T，不要包裹多余的 `JsonVO<T>` 泛型。
4. 当你生成分页接口时，应该主动的使用 PageDTO 泛型来包裹返回值。
5. **options 必传**：二次包装 useRequest 时，其参数 options 必须是必填项。外部调用本函数时，options 参数必须是必填项，

### 从正确的位置内导入 `useRequest` 接口请求工具

按照以下的优先级导入 useRequest 请求工具：

#### 优先使用全局导入的方式实现导入

一般来说，useRequest 函数是全局导入的，你直接使用即可。允许出现 useRequest 在使用时出现类型报错。

#### 其次使用组合式 api 提供的文件导入

如果你在类似的 `src/composables/use-request` 目录内，找到了 `useRequest` 函数的导入方式，你可以使用该导入方式。

### 务必满足定义接口时的类型校验

在定义接口时，必须处理类型错误。必须满足以下类型约束。

- ParamsBodyKey
- ParamsQueryKey
- ParamsPathKey

我不希望在定义接口时，出现缺少字段的类型错误。

### 无参数的请求，请补全一个空对象

比如无参数 GET 请求，在生成接口时， 使用 `{}` 空对象。以便满足上述的类型校验要求。
