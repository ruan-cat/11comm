以下是根据你的需求整理的 **接口生成规范与计划文档**，以 Markdown 格式呈现，涵盖接口设计、测试用例、工具使用、边缘情况处理及实施流程。

---

# 接口生成规范与计划文档

## 一、接口设计规范

### 1. **命名与路径规范**

- **URL 路径**：
  - 遵循 RESTful 风格（如 `/sys-manager/get/userlist`）。
  - 模块命名统一为 `sys-manager`（系统管理模块）。
- **函数名**：
  - 使用驼峰命名法（如 `sysManagerGetUserList`）。
  - 前缀必须包含模块名（如 `sysManager`、`app`）。
- **文件路径**：
  - 接口代码文件仅存放在 `apps\admin\src\api` 目录。
  - 新建文件夹前需用户审核命名（如 `user/`、`order/`）。

### 2. **参数传递方式**

- **`query` 参数**：
  - 用于过滤、分页（如 `?page=1&pageSize=10`）。
  - 示例：
    ```ts
    config: {
      method: "GET",
      params: {
        page: 1,
        pageSize: 10,
        username: "",
      },
    }
    ```
- **`body` 参数**：
  - 用于创建/更新资源（如 POST/PUT 请求）。
  - 示例：
    ```ts
    config: {
      method: "POST",
      data: {
        username: "",
        password: "",
      },
    }
    ```
- **`path` 参数**：
  - 用于唯一标识资源（如 `/users/{id}`）。
  - 示例：
    ```ts
    url: `/users/${userId}`;
    ```

### 3. **上传类型处理**

- **`upType` 字段**：
  - 用 `UpType` 枚举指定上传类型（如 `file`、`json`）。
  - **禁止手动设置请求头**（如 `Content-Type`）。
  - 示例：
    ```ts
    upType: UpType.file;
    ```

### 4. **分页接口规范**

- **返回类型**：
  - 直接使用全局类型 `PageDTO<YourType>`，无需自行定义。
  - 示例：
    ```ts
    export function sysManagerGetUserList<T = PageDTO<UserVO>>() {
    	// ...
    }
    ```
- **参数要求**：
  - 必须包含 `page` 和 `pageSize` 查询参数。

### 5. **无参数接口处理**

- **补全空对象**：
  - 无参数接口需补全空对象（如 `params: {}`）。
  - 示例：
    ```ts
    config: {
      method: "GET",
      params: {},
    }
    ```

---

## 二、接口测试用例规范

### 1. **测试套件结构**

- **文件命名**：
  - 接口测试文件后缀为 `.test.ts`（如 `get-user-list.test.ts`）。
- **测试用例结构**：

  - 使用 `describe` 分组测试（如按模块划分）。
  - 使用 `it` 定义具体测试项（如正常调用、异常调用）。
  - 示例：

    ```ts
    import { describe, it } from "vitest";
    import { sysManagerGetUserList } from "./get-user-list";

    describe("sysManagerGetUserList 接口测试", () => {
    	it("基础调用", async () => {
    		const { execute, data } = sysManagerGetUserList();
    		const response = await execute();
    		console.warn("sysManagerGetUserList 响应数据:", response);
    	});
    });
    ```

### 2. **测试用例规则**

- **解构变量**：
  - 仅解构 `execute` 和 `data` 变量，忽略其他响应式变量。
- **输出格式**：
  - 使用 `console.warn` 输出分组标识（如 `console.warn("接口名称 响应数据:", response)`）。
- **类型处理**：
  - 测试用例的 `data` 变量允许类型报错，不添加 `unknown` 或 `any` 类型。

---

## 三、工具与依赖管理

### 1. **`useRequest` 使用规范**

- **导入方式**：
  - 优先使用全局导入（如 `useRequest<ParamsQueryKey, T, GetUsersQuery>`）。
  - 允许 `useRequest` 使用时出现类型报错，无需修复。
- **类型约束**：
  - 必须满足以下类型约束：
    - `ParamsBodyKey`（`body` 参数）
    - `ParamsQueryKey`（`query` 参数）
    - `ParamsPathKey`（`path` 参数）

### 2. **错误示例修正**

- **错误示例（手动设置请求头）**：
  ```ts
  headers: {
    "Content-Type": "multipart/form-data",
  }
  ```
- **正确示例（使用 `upType`）**：
  ```ts
  upType: UpType.file;
  ```

---

## 四、边缘情况处理

| **场景**         | **处理方式**                                          |
| ---------------- | ----------------------------------------------------- |
| **无参数接口**   | 补全空对象（如 `params: {}`）                         |
| **分页接口**     | 使用 `PageDTO<YourType>` 全局类型                     |
| **文件上传**     | 使用 `upType: UpType.file`                            |
| **参数类型错误** | 必须满足 `ParamsBodyKey`、`ParamsQueryKey` 等类型约束 |

---

## 五、实施流程

### 1. **接口生成步骤**

1. **需求分析**：
   - 根据 API 文档提取接口功能、参数和请求方式。
2. **代码编写**：
   - 生成 `.ts` 接口文件，遵循命名和参数传递规范。
   - 处理分页、上传等特殊场景。
3. **测试用例生成**：
   - 为每个接口生成 `.test.ts` 文件。
   - 覆盖正常调用、异常调用场景。
4. **代码校验**：
   - 检查类型约束是否满足。
   - 验证 `upType` 字段是否正确设置。
   - 确保无参数接口补全空对象。

### 2. **文件管理**

- **文件夹命名**：
  - 新建文件夹前需用户审核命名（如 `user/`、`order/`）。
- **文件路径**：
  - 所有接口文件仅存放在 `apps\admin\src\api` 目录。

---

## 六、示例代码

### **接口定义**

```ts
/**
 * 获取用户列表接口
 * @description
 * 支持分页、过滤参数
 */
export function sysManagerGetUserList<T = PageDTO<UserVO>>() {
	return useRequest<ParamsQueryKey, T, GetUsersQuery>({
		url: "/sys-manager/get/userlist",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				page: 1,
				pageSize: 10,
				username: "",
				status: "",
			},
		},
	});
}
```

### **测试用例**

```ts
import { describe, it } from "vitest";
import { sysManagerGetUserList } from "./get-user-list";

describe("sysManagerGetUserList 接口测试", () => {
	it("基础调用", async () => {
		const { execute, data } = sysManagerGetUserList();
		const response = await execute();
		console.warn("sysManagerGetUserList 响应数据:", response);
	});

	it("带参数调用", async () => {
		const { execute, data } = sysManagerGetUserList();
		const response = await execute({
			params: {
				page: 2,
				pageSize: 20,
				username: "test",
				status: "active",
			},
		});
		console.warn("sysManagerGetUserList 带参数响应:", response);
	});
});
```

---

## 七、注意事项

1. **全局类型优先**：
   - 直接使用 `PageDTO`，不定义分页类型。
2. **文件夹管理**：
   - 新建文件夹前需用户审核命名。
3. **类型校验**：
   - 必须满足 `ParamsBodyKey`、`ParamsQueryKey` 等类型约束。
4. **工具使用**：
   - 仅使用 `vitest` 提供的 `describe` 和 `it`。
   - 使用相对路径导入接口函数（如 `import { sysManagerGetUserList } from "./get-user-list"`）。

---

通过以上规范，确保接口生成符合用户要求，测试用例覆盖全面，代码结构清晰，类型校验严格。如需生成具体接口，请提供接口名称和参数要求。
