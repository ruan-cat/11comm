# Nitro 接口测试参考文档

本文档包含 Nitro 接口测试的详细配置和模板。

## 0. tsconfig.json 配置

### 0.1 添加路径别名和测试目录

在 `apps/admin/tsconfig.json` 的 `compilerOptions` 中添加 paths 配置：

```json
{
	"compilerOptions": {
		"paths": {
			"setup-neon": ["./tests/setup-neon.ts"]
		}
	},
	"include": [
		// 添加测试目录
		"tests/**/*.ts"
	]
}
```

这样 TypeScript 就能正确识别 `import ... from "setup-neon"` 的导入语句。

## 1. vitest.config.ts 配置

### 1.1 条件配置

`apps/admin/vitest.config.ts` 使用 `--node` 参数区分测试环境：

```typescript
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	// 如果是 node 环境（nitro 接口测试）
	const isNodeTest = process.argv.includes("--node");

	if (isNodeTest) {
		return {
			test: {
				environment: "node",
				include: ["tests/nitro/**/*.test.ts"],
				exclude: [...configDefaults.exclude, "e2e/**", "src/**/*.test.ts"],
				root: fileURLToPath(new URL("./", import.meta.url)),
				env: {
					NODE_ENV: "test",
					...loadEnv("test", process.cwd(), ""),
				},
				globals: true,
				setupFiles: ["./tests/setup-neon.ts"],
				pool: "forks",
			},
			resolve: {
				alias: {
					"@": fileURLToPath(new URL("./src", import.meta.url)),
					"setup-neon": fileURLToPath(new URL("./tests/setup-neon.ts", import.meta.url)),
				},
			},
		};
	}

	// 默认 jsdom 环境（原有测试）
	return {
		/* ... */
	};
});
```

## 2. setup-neon.ts 环境配置

### 2.1 文件位置

`apps/admin/tests/setup-neon.ts`

### 2.2 完整代码

```typescript
import { vi } from "vitest";
import { config } from "@dotenvx/dotenvx";
import { resolve } from "node:path";

const adminDir = process.cwd();

/**
 * 加载 Neon 环境变量（用于 Nitro 接口测试）
 */
function loadVercelEnv() {
	config({ path: resolve(adminDir, ".env") });
	config({ path: resolve(adminDir, ".env.vercel.local") });
}

loadVercelEnv();

const NITRO_PORT = process.env.VITE_PORT || "8080";
export const NITRO_BASE_URL = `http://localhost:${NITRO_PORT}`;

export async function fetchNitroApi(path: string, options: RequestInit = {}): Promise<Response> {
	const url = `${NITRO_BASE_URL}${path}`;
	console.log(`📡 调用 Nitro API: ${url}`);

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	return response;
}

export async function checkNitroServer(): Promise<boolean> {
	try {
		const response = await fetch(`${NITRO_BASE_URL}/api/health`, {
			method: "GET",
		});
		return response.ok;
	} catch {
		return false;
	}
}
```

## 3. 测试用例模板

### 3.1 标准模板

```typescript
/**
 * @file {接口描述}
 * @description 测试 {API 路径} 接口
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "setup-neon";

describe("{测试套件描述}", () => {
	beforeAll(async () => {
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	test("POST /api/{接口路径} - {测试描述}", async () => {
		const response = await fetchNitroApi("/api/{接口路径}", {
			method: "POST",
			body: JSON.stringify({
				page: 1,
				pageSize: 10,
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = await response.json();

		// 验证响应结构
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toBeDefined();

		console.log("✅ {测试描述}测试通过");
	});
});
```

### 3.2 完整测试示例

```typescript
/**
 * @file 菜单目录列表接口测试
 * @description 测试 /api/dev-team/menu-manage/catalog/list 接口
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "setup-neon";

describe("菜单目录列表接口测试", () => {
	beforeAll(async () => {
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	test("POST /api/dev-team/menu-manage/catalog/list - 获取菜单目录列表", async () => {
		const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
			method: "POST",
			body: JSON.stringify({
				page: 1,
				pageSize: 10,
			}),
		});

		expect(response.ok).toBe(true);

		const result = await response.json();
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toBeDefined();

		console.log("✅ 菜单目录列表接口测试通过");
	});
});
```

## 4. 运行命令

### 4.1 命令说明

| 命令                                         | 说明                             |
| :------------------------------------------- | :------------------------------- |
| `pnpm test`                                  | 运行原有的前端测试（jsdom 环境） |
| `pnpm test:nitro`                            | 运行 Nitro 接口测试（node 环境） |
| `pnpm test:nitro:watch`                      | 监听模式                         |
| `pnpm test:nitro -- tests/nitro/xxx.test.ts` | 指定单个测试文件                 |

### 4.2 测试流程

1. **终端 1**：启动 Nitro 服务器

   ```bash
   cd apps/admin
   pnpm dev
   ```

2. **终端 2**：运行测试
   ```bash
   cd apps/admin
   pnpm test:nitro
   ```

## 5. 文件位置规范

### 5.1 接口与测试文件对应关系

| 文件类型 | 位置                                         |
| :------- | :------------------------------------------- |
| 接口文件 | `server/api/{模块}/{功能}/{action}.post.ts`  |
| 测试文件 | `tests/nitro/{模块}/{功能}/{action}.test.ts` |

### 5.2 示例

- 接口：`server/api/dev-team/menu-manage/catalog/list.post.ts`
- 测试：`tests/nitro/dev-team/menu-manage/catalog/list.test.ts`

## 6. 常见问题

| 问题                              | 解决方案                                     |
| :-------------------------------- | :------------------------------------------- |
| `Cannot find module 'setup-neon'` | 使用别名导入：`import ... from "setup-neon"` |
| `connect ECONNREFUSED`            | 先启动 Nitro 服务器：`pnpm dev`              |
| `Failed to parse source for .vue` | 确保使用 `--node` 参数运行测试               |
| 导入路径错误                      | 使用 `"setup-neon"` 别名，不要使用相对路径   |

## 7. 测试检查清单

- [ ] 接口文件已创建：`server/api/xxx/xxx.post.ts`
- [ ] 测试文件已创建：`tests/nitro/xxx/xxx.test.ts`
- [ ] 测试文件使用正确的导入路径：`from "setup-neon"`
- [ ] 测试用例包含基本的列表查询测试
- [ ] 测试可以通过 `pnpm test:nitro` 运行
