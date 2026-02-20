# 2026-02-20 Nitro 接口 Vitest 测试配置报告

## 1. 背景

随着 Nitro 接口开发工作的推进，需要为已开发的 100+ 个 Nitro 接口配置自动化测试用例。原有的测试框架（jsdom）仅适用于前端组件和 Vue 组件的渲染测试，无法满足服务端接口的测试需求。

具体问题包括：

- **环境差异**：jsdom 环境缺少 Node.js 原生模块和数据库连接能力
- **数据库依赖**：Nitro 接口依赖 Neon 数据库的 Drizzle ORM 连接，无法在 jsdom 环境中运行
- **测试隔离**：需要独立的测试命令，区分前端测试和后端接口测试

因此，需要为 Nitro 接口配置独立的 Vitest 测试环境，支持真实的数据库连接和 HTTP 请求测试。

## 2. 实现方案

### 2.1 vitest.config.ts 条件配置

通过 `--node` 参数区分 jsdom 和 node 环境：

```typescript
// apps/admin/vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

// 判断是否使用 node 环境（用于 Nitro 接口测试）
const isNodeEnv = process.argv.includes("--node");

export default defineConfig({
	plugins: isNodeEnv ? [] : [vue()],
	test: {
		environment: isNodeEnv ? "node" : "jsdom",
		include: isNodeEnv ? ["tests/nitro/**/*.test.ts"] : ["src/**/*.{test,spec}.{js,ts}"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			server: path.resolve(__dirname, "./server"),
		},
	},
});
```

### 2.2 tests/setup-neon.ts 环境配置

为 Nitro 接口测试配置 Neon 数据库连接和环境变量：

```typescript
// apps/admin/tests/setup-neon.ts
import { beforeAll } from "vitest";

// 设置测试环境变量
process.env.NODE_ENV = "test";
process.env.NEON_API_KEY = process.env.NEON_API_KEY;
process.env.DATABASE_URL = process.env.DATABASE_URL;

beforeAll(async () => {
	// 全局测试设置
	console.log("Nitro 接口测试环境初始化完成");
});
```

### 2.3 tsconfig.json 路径别名配置

确保测试文件能够正确解析路径别名：

```json
{
	"compilerOptions": {
		"paths": {
			"@/*": ["./src/*"],
			"server/*": ["./server/*"]
		}
	}
}
```

## 3. 文件变更清单

### 3.1 新增文件

| 文件路径                           | 说明                              |
| :--------------------------------- | :-------------------------------- |
| `apps/admin/vitest.config.ts`      | Vitest 配置文件，支持环境条件切换 |
| `apps/admin/tests/setup-neon.ts`   | Neon 数据库测试环境配置           |
| `apps/admin/tests/nitro/*.test.ts` | 100+ 个 Nitro 接口测试文件        |

### 3.2 修改文件

| 文件路径                   | 说明                               |
| :------------------------- | :--------------------------------- |
| `apps/admin/tsconfig.json` | 添加 server 路径别名和测试文件包含 |

## 4. 使用方法

### 4.1 运行原有 jsdom 测试

```bash
pnpm test
```

运行前端组件测试（Vue 组件、Composables 等），使用 jsdom 环境。

### 4.2 运行 Nitro 接口测试

```bash
pnpm test:nitro
```

运行 Nitro 接口测试，需要先启动开发服务器：

```bash
# 终端 1：启动开发服务器
pnpm dev

# 终端 2：运行测试
pnpm test:nitro
```

## 5. 参考文档

详细的配置说明和测试模板请参考：

- **配置文件详解**: `.claude/skills/nitro-api-development/references/vitest-testing.md`
- **测试模板**: `.claude/skills/nitro-api-development/references/vitest-testing.md`
- **运行命令**: `.claude/skills/nitro-api-development/references/vitest-testing.md`

该文档包含：

- vitest.config.ts 完整配置
- tests/setup-neon.ts 环境设置
- Nitro 接口测试用例模板
- 常见测试场景示例
