# 2026-07-08 admin 项目 vite-plugin-vercel 插件调研报告

## 问题背景

admin 项目构建产物 `.vercel/output` 中存在 `functions/api/proxy.func/` 目录，这是由 `vite-plugin-vercel` 插件生成的 Edge Function。

用户咨询：

1. admin 项目能否不使用 `vite-plugin-vercel` 插件？
2. 能否用其他手段生成 `.vercel/output` 目录？
3. 能否通过配置避免生成 `functions/api/proxy.func/`？
4. 是否应该保留此配置？

## 调研结论

### ✅ 结论：保留 vite-plugin-vercel 配置

**建议保留当前配置**，原因如下：

### 1. vite-plugin-vercel 的核心作用

| 功能                         | 说明                                       |
| :--------------------------- | :----------------------------------------- |
| **生成 .vercel/output 目录** | Vercel 部署所需的标准化输出结构            |
| **Edge Function 支持**       | `functions/api/proxy.func/` 作为边缘云函数 |
| **Vercel 平台代理**          | 生产环境承担 API 反向代理职责              |

### 2. functions/api/proxy.func 的价值

当前 `apps/admin` 已物理删除内置 Nitro 服务，API 请求统一路由到 `apps/api`。

```plain
浏览器 → Vercel Edge (functions/api/proxy.func) → apps/api (独立 Nitro 服务)
```

这个 Edge Function 可以在 Vercel 平台层面实现：

- **跨域资源共享（CORS）**
- **API 请求聚合**
- **认证头处理**
- **生产环境反向代理**

### 3. 替代方案分析

| 方案                    | 可行性 | 评估                                      |
| :---------------------- | :----- | :---------------------------------------- |
| 移除 vite-plugin-vercel | ❌     | Vercel 部署需要 `.vercel/output` 目录结构 |
| 手动创建 .vercel/output | ❌     | 不符合 Vercel 构建流程，难以维护          |
| 配置插件禁用 proxy.func | ⚠️     | 可能影响 Edge Function 功能               |
| **保留现状**            | ✅     | 保留 Edge Function 作为平台层代理         |

### 4. 当前配置解读

```typescript
// apps/admin/build/plugins/index.ts
const vercelPlugin = vercel(
	IS_REVERSE_PROXY()
		? {
				rewrites: [{ source: "/backend/(.*)", destination: "/api/proxy" }],
			}
		: {},
);
```

- `VITE_IS_REVERSE_PROXY = "false"` 时，`rewrites` 配置为空对象
- Edge Function `functions/api/proxy.func/` 仍会生成，但不执行代理逻辑
- **生产环境保留此结构是合理的选择**

### 5. Vercel 项目架构（Phase7）

```plain
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐      ┌─────────────────────────────┐     │
│  │ Admin SPA   │      │ Edge Function               │     │
│  │ .vercel/    │ ───▶ │ functions/api/proxy.func/   │     │
│  │ output/     │      │ (反向代理/请求转发)          │     │
│  │ static/     │      └──────────────┬──────────────┘     │
│  └─────────────┘                     │                     │
│                                      ▼                     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  apps/api (独立 Nitro 服务)                          │  │
│  │  https://01s-11-server.ruan-cat.com                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 最终建议

| 决策                              | 说明                            |
| :-------------------------------- | :------------------------------ |
| **保留** vite-plugin-vercel       | ✅ 保留                         |
| **保留** functions/api/proxy.func | ✅ 保留，作为 Vercel 平台层代理 |
| **不修改** vercel() 配置          | 维持现状，无需调整              |

## 参考文件

- 插件配置：`apps/admin/build/plugins/index.ts` (第 36、73-86 行)
- 生产环境变量：`apps/admin/env/.env.production` (VITE_IS_REVERSE_PROXY = "false")

## 变更记录

- 2026-07-08：初版报告，确认保留配置方案
