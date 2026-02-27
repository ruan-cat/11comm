<!-- 已使用该报告 已经沉淀归纳到nitro的技能文档中 -->

# 2026-02-28 Nitro v3 在 Cloudflare Worker 环境下获取环境变量：深度分析报告

|     项目     |                                          详情                                          |
| :----------: | :------------------------------------------------------------------------------------: |
| **分析目标** |                           nitro v3（`nitro@3.0.1-alpha.2`）                            |
| **源码路径** |                               `src/presets/cloudflare/`                                |
| **报告日期** |                                       2026-02-28                                       |
| **核心结论** | Nitro v3 **有能力**在 Cloudflare Worker 中获取环境变量，但存在明确的使用限制和已知陷阱 |

---

## 1. 背景与问题描述

Cloudflare Worker 的运行环境与 Node.js 有本质区别：**环境变量不存在于 `process.env`**，而是由 Cloudflare 运行时在每次 HTTP 请求触发时，通过 `fetch(request, env, context)` 的第二个参数 `env` 对象传入。

这意味着，习惯了 Node.js 开发方式的开发者，如果直接使用 `process.env.MY_VAR` 来读取在 Cloudflare Dashboard 设置的环境变量，往往会得到 `undefined`。

本报告基于对 Nitro v3 全部相关源代码的逐行审查，深度分析 Nitro v3 如何桥接这一差异，以及在使用中容易踩到哪些坑。

---

## 2. 架构概览

Nitro v3 的 Cloudflare 支持由以下几个 Preset 组成：

|     Preset 名称      |          入口文件          |                说明                |
| :------------------: | :------------------------: | :--------------------------------: |
| `cloudflare-module`  |   `cloudflare-module.ts`   | **推荐**，标准 Workers Module 模式 |
|  `cloudflare-pages`  |   `cloudflare-pages.ts`    |       Cloudflare Pages 专用        |
| `cloudflare-durable` |  `cloudflare-durable.ts`   |     配合 Durable Objects 使用      |
|   `cloudflare-dev`   | `dev.ts` + `plugin.dev.ts` | 本地开发模式（通过 wrangler 代理） |

它们共享一个核心处理器 `_module-handler.ts`，这是理解环境变量机制的关键所在。

### 2.1. 请求处理全链路

```plain
Cloudflare 运行时
  └─ fetch(request, env, context)
       │
       ▼
_module-handler.ts
  ├─ Step 1: (globalThis).__env__ = env   ← 关键！将 env 注入全局
  ├─ Step 2: augmentReq(req, {env, ctx})  ← 将 env 挂载到 req.runtime.cloudflare
  │
  ▼
NitroApp.fetch(req)  → H3 路由 → 你的 Handler
  ├─ process.env.MY_VAR      ← 通过 unenv Proxy 读取 __env__
  ├─ import.meta.env.MY_VAR  ← 同上
  ├─ useRuntimeConfig().xxx  ← 通过 process.env 间接读取（有缓存风险）
  └─ event.req.runtime.cloudflare.env.MY_VAR  ← 直接读取（最可靠）
```

---

## 3. 核心机制深度剖析

### 3.1. 机制一：`globalThis.__env__` 注入

**源码位置**：`src/presets/cloudflare/runtime/_module-handler.ts`

```typescript
// 第 22-38 行
return {
	async fetch(request, env, context) {
		(globalThis as any).__env__ = env; // ← 每次请求都会执行
		augmentReq(request as any, { env: env as any, context });
		// ...
		return (await nitroApp.fetch(request)) as any;
	},
	// ...
};
```

每次 Cloudflare 触发 fetch 事件时，Nitro 都会把 `env` 对象写入 `globalThis.__env__`。这是整个机制的基础。

### 3.2. 机制二：`unenv` 的 `process.env` Proxy

**源码位置**：`node_modules/unenv/dist/runtime/node/internal/process/env.mjs`

由于 Cloudflare Workers 没有原生的 `process.env`，Nitro 通过 `unenv` 库提供了一个 Proxy 对象来模拟它：

```javascript
// unenv 核心逻辑（简化）
const _getEnv = () =>
	globalThis.__env__ || // 优先：Cloudflare 注入的 env
	originalProcess?.env || // 次之：Node.js 原生 process.env
	{};

export const env = new Proxy(
	{},
	{
		get(_, prop) {
			return _getEnv()[prop]; // 每次读取 process.env.X 时，都从 __env__ 读
		},
		// ...
	},
);
```

**关键点**：每次访问 `process.env.MY_VAR` 时，Proxy 会**实时**查找 `globalThis.__env__`，因此只要在请求处理期间（`__env__` 已赋值后）访问，就能拿到正确的值。

### 3.3. 机制三：`req.runtime.cloudflare.env` 直接挂载

**源码位置**：`src/presets/cloudflare/runtime/_module-handler.ts`

```typescript
// 第 113-124 行
export function augmentReq(cfReq: Request | CF.Request, ctx: NonNullable<ServerRuntimeContext["cloudflare"]>) {
	const req = cfReq as ServerRequest;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = { ...req.runtime.cloudflare, ...ctx };
	// ctx 包含 { env, context }
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
```

每次请求时，`env` 和 `context` 会被直接绑定到请求对象的 `runtime.cloudflare` 上，可在 Handler 中通过 `event.req.runtime.cloudflare.env` 访问。这是**最直接、最可靠**的方式。

### 3.4. `useRuntimeConfig()` 的全局缓存问题

**源码位置**：`src/runtime/internal/runtime-config.ts`

```typescript
export function useRuntimeConfig(): NitroRuntimeConfig {
	// ⚠️ 使用 ||= 运算符，第一次调用后结果被永久缓存！
	return ((useRuntimeConfig as any)._cached ||= getRuntimeConfig());
}

function getRuntimeConfig() {
	// 仅在第一次调用时读取 process.env（通过 unenv Proxy）
	const env = globalThis.process?.env || {};
	applyEnv(runtimeConfig, {
		prefix: "NITRO_",
		altPrefix: runtimeConfig.nitro?.envPrefix ?? env?.NITRO_ENV_PREFIX ?? "_",
	});
	return runtimeConfig; // 返回后被缓存，永不重新计算
}
```

> **⚠️ 这是最常见的踩坑点**：`useRuntimeConfig()` 的返回值在进程生命周期内只计算一次。
> 如果在全局作用域（模块加载时）首次调用，此时 `globalThis.__env__` 尚未被 Cloudflare 的 `env` 赋值，所有通过 env 注入的配置值都将是**空/默认值**，并且**后续所有请求都无法修正这个缓存**。

---

## 4. 关键陷阱与错误场景

### 4.1. ❌ 陷阱一：在全局作用域（模块顶部）读取环境变量

**错误原因**：模块加载时，Cloudflare 的 `env` 尚未传入，`__env__` 为 undefined。

```typescript
// server/api/example.ts  ← 错误示例

// ❌ 模块加载时执行，env 未注入，永远是 undefined
const DB_URL = process.env.DATABASE_URL;
const config = useRuntimeConfig(); // 被缓存为默认值（空字符串）

export default defineHandler((event) => {
	// 下面这些都会是 undefined 或空字符串！
	return { dbUrl: DB_URL, config };
});
```

### 4.2. ❌ 陷阱二：在 Plugin 的顶层初始化依赖 env 的对象

```typescript
// server/plugins/db.ts  ← 错误示例

// ❌ plugin 文件被执行时，env 还未注入
const db = createDatabaseClient({
	url: process.env.DATABASE_URL, // undefined！
});

export default defineNitroPlugin((app) => {
	// 这里的 db 实例是用 undefined 初始化的
});
```

### 4.3. ❌ 陷阱三：忘记 `NITRO_` 前缀

`useRuntimeConfig()` 通过 `NITRO_` 前缀（或自定义 `envPrefix`）来将环境变量映射到配置对象。

```typescript
// ❌ 错误：Cloudflare Dashboard 设置的是 "DATABASE_URL"
const config = useRuntimeConfig();
config.databaseUrl; // undefined！因为没有 NITRO_ 前缀

// ✅ 正确：在 Dashboard 设置 "NITRO_DATABASE_URL"，
// 或直接用 process.env.DATABASE_URL
```

---

## 5. 正确使用方式

### 5.1. ✅ 方式一：直接通过 `event.req.runtime.cloudflare.env`（**最推荐**）

适合访问所有 Cloudflare Bindings（Secrets、KV、D1 等）。

```typescript
import { defineHandler } from "nitro/h3";

export default defineHandler((event) => {
	// ✅ 直接从请求上下文读取，绝对可靠
	const cfEnv = event.req.runtime?.cloudflare?.env;

	const secret = cfEnv?.MY_SECRET;
	const kvData = cfEnv?.MY_KV; // KV Namespace Binding
	const d1 = cfEnv?.MY_D1; // D1 Database Binding

	return { secret };
});
```

### 5.2. ✅ 方式二：在 Handler 内使用 `process.env` 或 `import.meta.env`

适合读取普通的字符串类型环境变量。

```typescript
import { defineHandler } from "nitro/h3";

export default defineHandler((event) => {
	// ✅ 在 handler 内部访问，此时 __env__ 已被注入
	const secret1 = process.env.MY_SECRET;
	const secret2 = import.meta.env.MY_SECRET; // 与上面等效

	return { secret1, secret2 };
});
```

### 5.3. ✅ 方式三：在 Handler 内使用 `useRuntimeConfig()`

适合访问已在 `nitro.config.ts` 声明的结构化配置。

```typescript
// nitro.config.ts
export default defineNitroConfig({
	runtimeConfig: {
		// 必须预先声明字段
		databaseUrl: "", // 对应环境变量 NITRO_DATABASE_URL
		apiKey: "", // 对应环境变量 NITRO_API_KEY
	},
});
```

```typescript
// server/api/example.ts
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export default defineHandler((event) => {
	// ✅ 在 handler 内部调用，此时 __env__ 已注入
	// 首次调用会正确读取 process.env 并缓存
	const config = useRuntimeConfig();
	const dbUrl = config.databaseUrl; // 对应 NITRO_DATABASE_URL

	return { dbUrl };
});
```

> **注意**：只要确保 `useRuntimeConfig()` **第一次被调用时是在某个请求的 Handler 内**（而非模块加载时），缓存机制就不会造成问题，因为第一次调用时 `__env__` 已经被正确赋值。

### 5.4. ✅ 方式四：在 Plugin 中使用 `request` 钩子懒初始化

```typescript
// server/plugins/db.ts
import { defineNitroPlugin } from "nitro/app";

export default defineNitroPlugin((app) => {
	app.hooks.hook("request", (event) => {
		// ✅ 每次请求时，__env__ 已经就绪
		const env = event.req.runtime?.cloudflare?.env;
		if (env && !event.context.db) {
			event.context.db = createDatabaseClient({ url: env.DATABASE_URL });
		}
	});
});
```

---

## 6. 本地开发模式说明

在开发模式（`cloudflare-dev` preset）下，Nitro 使用 `wrangler` 的 `getPlatformProxy()` 来模拟 Cloudflare 环境：

**源码位置**：`src/presets/cloudflare/runtime/plugin.dev.ts`

```typescript
// 开发模式下，wrangler 代理提供了模拟的 env
const proxy = await getPlatformProxy({ configPath: "wrangler.toml" });
(globalThis as any).__env__ = proxy.env; // 与生产模式行为一致
```

### 6.1. 开发时的环境变量配置

|                场景                |        配置文件        |                  说明                  |
| :--------------------------------: | :--------------------: | :------------------------------------: |
|     `nitro dev`（开发服务器）      | `.env` 或 `.env.local` | 由 dotenv 加载，直接进入 `process.env` |
| `wrangler dev`（本地 Worker 预览） |      `.dev.vars`       |     模拟 Cloudflare 的 `env` 对象      |

> ⚠️ `.env`、`.env.local`、`.dev.vars` 均包含敏感信息，**务必添加到 `.gitignore`**，不要提交到版本控制。

---

## 7. 生产环境设置变量的方式对比

|           设置方式            |             命令/操作              |      适用类型       |      推荐程度       |
| :---------------------------: | :--------------------------------: | :-----------------: | :-----------------: |
| Cloudflare Dashboard 手动设置 | 进入 Worker → Settings → Variables | Secrets + 普通变量  |    ⭐⭐⭐ 最推荐    |
| `wrangler secret put MY_VAR`  |              CLI 命令              | Secrets（加密存储） |     ⭐⭐⭐ 推荐     |
|  `wrangler.toml` 的 `[vars]`  |            写入配置文件            |  非敏感的配置变量   | ⭐⭐ 不适合 secrets |
|  `wrangler.json` 的 `"vars"`  |            写入配置文件            |  非敏感的配置变量   | ⭐⭐ 不适合 secrets |

---

## 8. 诊断排查清单

当在 Cloudflare Worker 中无法获取到环境变量时，按照以下清单逐项排查：

- [ ] **作用域检查**：读取 env 的代码是否在 **handler 函数内部**？还是在模块顶层？
- [ ] **Preset 检查**：是否使用了正确的 preset（`cloudflare-module` 或 `cloudflare-pages`）？
- [ ] **变量是否已设置**：在 Cloudflare Dashboard 或 `wrangler.toml` 中是否已实际配置该变量？
- [ ] **前缀检查**：使用 `useRuntimeConfig()` 时，变量名是否有 `NITRO_` 前缀？
- [ ] **类型检查**：是否只期望读取普通字符串变量？KV/D1 等 Bindings 需要通过 `event.req.runtime.cloudflare.env` 访问。
- [ ] **开发模式检查**：本地开发时是否配置了 `wrangler.toml` 或 `.dev.vars` 文件？
- [ ] **缓存排查**：是否曾在全局作用域调用过 `useRuntimeConfig()`，导致其 `_cached` 被设置为空值？

---

## 9. 总结

Nitro v3 的 Cloudflare Worker 环境变量支持是完整的，但其工作方式与 Node.js 存在根本性差异，开发者必须理解以下三点核心原则：

> **原则一**：所有环境变量的读取操作，必须发生在**请求处理周期之内**（即 handler 函数执行期间），而不是在模块顶层或应用初始化时。

> **原则二**：当需要访问非字符串类型的 Cloudflare Bindings（如 KV、D1、R2 等），必须使用 `event.req.runtime.cloudflare.env`，这是唯一可靠的访问路径。

> **原则三**：`useRuntimeConfig()` 存在全局缓存，只要保证**第一次调用在请求处理周期内**，这个缓存就会正确工作。如果你发现配置始终是默认值，首先检查是否有全局作用域调用的情况。
