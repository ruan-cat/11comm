---
name: nitro-api-development
description: 使用 Nitro v3 框架编写服务端接口的技能规范。适用于初始化纯后端 Nitro 项目、为 Vite 项目赋予全栈能力、编写符合规范的 Nitro 接口。当用户需要创建 Nitro 接口、初始化 Nitro 配置、或咨询 Nitro 开发规范时使用此技能。
---

# Nitro v3 接口开发技能规范

本技能用于指导使用 Nitro v3 框架编写服务端接口，包括项目初始化、配置、接口编写规范等完整流程。

## 1. 适用场景

- **纯后端 Nitro 项目初始化**：对非 Vite 的 Node.js 项目，初始化 Nitro 示例代码和配置
- **Vite 项目全栈化**：对 Vite 项目，初始化 Nitro 接口和配置，赋予全栈能力
- **接口开发与维护**：按规范编写 Nitro v3 格式的接口代码

## 2. 核心依赖

```bash
# Nitro v3 核心包
pnpm add nitro

# 可选：日志工具
pnpm add consola
```

## 3. 目录结构规范

```plain
project-root/
├── server/                          # Nitro 服务端目录
│   ├── api/                         # API 接口目录
│   │   └── {module}/{sub-module}/{page}/
│   │       ├── list.post.ts         # 列表查询接口
│   │       ├── tree.post.ts         # 树形数据接口
│   │       └── mock-data.ts         # Mock 数据文件
│   └── utils/
│       └── filter-data.ts           # 通用数据筛选工具
├── nitro.config.ts                  # Nitro 配置文件
└── package.json
```

**文件路径映射规则**：文件路径直接映射为 API 路径

```plain
文件: server/api/dev-team/config-manage/center/list.post.ts
路径: POST /api/dev-team/config-manage/center/list
```

## 4. 核心规范 [CRITICAL]

### 4.1 导入模块规范

```typescript
// 必须从 nitro/h3 导入，不是 h3
import { defineHandler, readBody } from "nitro/h3";

// 类型和常量导入
import type { JsonVO, PageDTO, ListItem, QueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
```

### 4.2 标准列表接口模板

```typescript
/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 * POST /api/dev-team/config-manage/center/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockConfigCenterData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选
	const filteredData = filterDataByQuery(mockConfigCenterData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

### 4.3 关键要点检查清单

1. **导入来源**：`nitro/h3` 而非 `h3`
2. **处理器函数**：`defineHandler` 而非 `defineEventHandler`
3. **返回值**：创建 `response` 变量并添加完整类型约束
4. **JSDoc 注释**：包含接口路径和描述
5. **参数处理**：使用默认参数对象合并，不使用解构默认值
6. **数据筛选**：使用 `filterDataByQuery` 工具函数
7. **分页常量**：使用 `DEFAULT_PAGE_INDEX` 和 `DEFAULT_PAGE_SIZE`

## 5. 常见错误对比

| 错误写法                                  | 正确写法                                                |
| :---------------------------------------- | :------------------------------------------------------ |
| `import { defineEventHandler } from "h3"` | `import { defineHandler } from "nitro/h3"`              |
| `export default defineEventHandler(...)`  | `export default defineHandler(...)`                     |
| `return { success: true, ... }`           | `const response: JsonVO<...> = {...}; return response;` |
| `const { pageIndex = 1 } = body`          | 使用 defaultParams 对象合并                             |
| 手动编写 filter 逻辑                      | `filterDataByQuery(data, filters)`                      |

## 6. Nitro 配置

### 6.1 基础配置

```typescript
import { defineConfig } from "nitro";

export default defineConfig({
	serverDir: "./server",
	scanDirs: ["./server"],
	devServer: { watch: ["./server/**/*.ts"] },
	alias: { "@": "./src", server: "./server" },
	compatibilityDate: "2024-09-19",
});
```

### 6.2 Vite 集成

```typescript
// vite.config.ts 或 build/plugins/index.ts
import { nitro } from "nitro/vite";

export default defineConfig({
	plugins: [
		// 其他插件...
		nitro(),
	],
});
```

## 7. 部署配置

### 7.1 环境变量规范

```bash
# Nitro 运行时配置前缀必须为 NITRO_
NITRO_API_TOKEN="your-api-token"

# 部署预设
NITRO_PRESET=cloudflare_module  # Cloudflare Workers
NITRO_PRESET=vercel             # Vercel
NITRO_PRESET=node               # Node.js 服务器
```

### 7.2 环境变量访问

```typescript
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export default defineHandler((event) => {
	// 必须在事件处理器内访问
	const config = useRuntimeConfig();
	return { value: config.apiToken };
});
```

## 8. 响应格式规范

### 8.1 JsonVO 结构

```typescript
interface JsonVO<T> {
	success: boolean;
	code: number;
	message: string;
	data: T;
}
```

### 8.2 PageDTO 结构

```typescript
interface PageDTO<T> {
	list: T[];
	total: number;
	pageIndex: number;
	pageSize: number;
	totalPages: number;
}
```

## 9. 项目初始化检查清单

### 9.1 纯后端项目

- [ ] 安装 `nitro` 依赖包
- [ ] 创建 `server/` 目录结构
- [ ] 创建 `nitro.config.ts` 配置文件
- [ ] 创建 `server/utils/filter-data.ts` 工具函数

### 9.2 Vite 项目全栈化

- [ ] 安装 `nitro` 依赖包
- [ ] 在 Vite 插件配置中添加 `nitro()` 插件
- [ ] 创建 `server/` 目录结构
- [ ] 创建 `nitro.config.ts` 配置文件
- [ ] 创建 `server/utils/filter-data.ts` 工具函数

## 10. 附加资源

详细的代码模板和参考文档请查阅：

- **初始化模板**：[templates.md](templates.md) - 包含完整的配置和接口代码模板
- **快速参考**：[reference.md](reference.md) - 函数速查、配置选项和常用类型
- **本项目规范**：`openspec/specs/nitro-api/spec.md`
- **接口示例**：`apps/admin/server/api/`
- **官方文档**：https://v3.nitro.build/
