# Vercel Neon 环境变量前缀机制

本文档说明 admin 项目如何获取和使用带前缀的 Vercel Neon 环境变量。

## 1. 背景

当通过 Vercel 的 Neon 集成配置数据库时，Vercel 会为环境变量添加自定义前缀，以区分不同项目的数据库连接。例如：

```bash
comm_admin_11__DATABASE_URL="postgresql://..."
comm_admin_11__DATABASE_URL_UNPOOLED="postgresql://..."
comm_admin_11__NEON_AUTH_BASE_URL="https://..."
comm_admin_11__PGDATABASE="neondb"
```

其中 `comm_admin_11_` 是在 Vercel Neon 集成配置页面设置的前缀。

## 2. 环境变量文件结构

|              文件              |                   作用                   | 是否提交 Git |
| :----------------------------: | :--------------------------------------: | :----------: |
|       `apps/admin/.env`        |  项目级别配置（包含 VERCEL_ENV_PREFIX）  |      是      |
| `apps/admin/.env.vercel.local` | 从 Vercel 拉取的 Neon 环境变量（带前缀） |      否      |
| `apps/admin/.env.development`  |             开发环境前端配置             |      是      |
|  `apps/admin/.env.production`  |             生产环境前端配置             |      是      |

## 3. 核心配置

### 3.1. 前缀环境变量

在 `apps/admin/.env` 中定义了前缀环境变量：

```bash
# Vercel Neon 集成环境变量前缀
# 该前缀用于标识从 Vercel 拉取的 Neon 数据库环境变量
# 在 Vercel Neon 集成配置页面设置和维护：
# https://vercel.com/ruancat-projects/~/integrations/neon/icfg_aFCpQJZiS9sXcBJfKSgHG3ZR/resources/storage/store_1hsWrjTtdSHtwdJQ/projects
VERCEL_ENV_PREFIX=comm_admin_11_
```

### 3.2. 拉取 Vercel 环境变量

执行以下命令拉取 Vercel 环境变量：

```bash
cd apps/admin
pnpm env:pull
```

该命令会将环境变量保存到 `apps/admin/.env.vercel.local` 文件中（已被 .gitignore 忽略）。

## 4. 工具函数

项目提供了专用的工具函数来获取带前缀的环境变量。

### 4.1. 文件位置

```plain
apps/admin/server/utils/vercel-env.ts
```

### 4.2. 可用函数

|          函数名          |                  说明                   |       返回值        |
| :----------------------: | :-------------------------------------: | :-----------------: |
|   `getVercelEnvPrefix`   |   获取环境变量前缀（comm*admin_11*）    |      `string`       |
|      `getVercelEnv`      | 获取带前缀的环境变量（可选，可能为空）  | `string｜undefined` |
|  `getVercelEnvRequired`  |   获取带前缀的环境变量（必需，报错）    |      `string`       |
|     `getDatabaseUrl`     | 获取数据库连接 URL（优先 Vercel，回退） |      `string`       |
| `getDatabaseUrlUnpooled` |     获取数据库直连 URL（无连接池）      | `string｜undefined` |

### 4.3. 使用示例

```typescript
import { getDatabaseUrl, getVercelEnv, getVercelEnvRequired } from "../utils/vercel-env";

// 获取数据库连接 URL（自动处理前缀）
const databaseUrl = getDatabaseUrl();

// 获取特定的带前缀环境变量
// 实际读取的是 comm_admin_11__PGDATABASE
const pgDatabase = getVercelEnv("PGDATABASE");

// 获取必需的环境变量（不存在时报错）
const neonProjectId = getVercelEnvRequired("NEON_PROJECT_ID");
```

## 5. 工作原理

```plain
┌─────────────────────────────────────────────────────────────────┐
│                      环境变量获取流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 从 .env 读取 VERCEL_ENV_PREFIX                              │
│     └── 获取前缀：comm_admin_11_                                 │
│                                                                 │
│  2. 从 .env.vercel.local 读取带前缀的环境变量                     │
│     └── 例如：comm_admin_11__DATABASE_URL                       │
│                                                                 │
│  3. 拼接完整的环境变量名                                          │
│     └── 前缀 + "_" + 变量名 = comm_admin_11__DATABASE_URL       │
│                                                                 │
│  4. 返回环境变量值                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 在代码中的实际使用

### 6.1. 数据库连接（server/db/index.ts）

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "../utils/vercel-env";

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
```

### 6.2. Drizzle 配置（drizzle.config.ts）

```typescript
import { getDatabaseUrl } from "./server/utils/vercel-env";

export default defineConfig({
	dbCredentials: {
		url: getDatabaseUrl(),
	},
});
```

## 7. 测试

项目提供了测试用例来验证环境变量读取功能：

```bash
cd apps/admin
pnpm vitest run tests/vercel-env.test.ts
```

测试内容包括：

- 验证 `VERCEL_ENV_PREFIX` 变量读取
- 验证带前缀的 `PGDATABASE` 变量读取（期望值：`neondb`）
- 验证前缀变量不为空字符串

## 8. Vercel 配置管理

### 8.1. 配置页面

环境变量前缀在以下 Vercel 页面配置和维护：

[Vercel Neon 集成配置](https://vercel.com/ruancat-projects/~/integrations/neon/icfg_aFCpQJZiS9sXcBJfKSgHG3ZR/resources/storage/store_1hsWrjTtdSHtwdJQ/projects)

### 8.2. 修改前缀

如需修改前缀，需同步更新：

1. Vercel Neon 集成配置页面的前缀设置
2. `apps/admin/.env` 中的 `VERCEL_ENV_PREFIX` 变量
3. 重新执行 `pnpm env:pull` 拉取新的环境变量

## 9. 故障排查

### 9.1. 常见问题

**问题：** 调用 `getDatabaseUrl()` 报错 "DATABASE_URL is not configured"

**解决方案：**

1. 确认已执行 `pnpm env:pull` 拉取 Vercel 环境变量
2. 确认 `apps/admin/.env.vercel.local` 文件存在且包含带前缀的环境变量
3. 确认 `apps/admin/.env` 中的 `VERCEL_ENV_PREFIX` 与 Vercel 配置一致

**问题：** 环境变量前缀不匹配

**解决方案：**

1. 检查 Vercel Neon 集成配置页面的前缀设置
2. 更新 `apps/admin/.env` 中的 `VERCEL_ENV_PREFIX` 变量

### 9.2. 调试技巧

可以打印环境变量进行调试：

```typescript
import { getVercelEnvPrefix, getVercelEnv } from "../utils/vercel-env";

console.log("前缀:", getVercelEnvPrefix());
console.log("数据库名:", getVercelEnv("PGDATABASE"));
```
