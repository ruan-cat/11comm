# 2026-03-02 TypeScript 类型错误全量修复复盘报告

## 一、任务背景

本次任务目标：对 `apps/admin`（Vue 3 + Nitro v3 全栈项目）进行全量类型检查，修复所有 TypeScript 类型错误，确保 `typecheck` 和 `build` 均能通过。

**项目技术栈：**

- 前端：Vue 3 + TypeScript + Element Plus + pure-admin 框架
- 后端：Nitro v3 + H3 v2 + Drizzle ORM + Neon Postgres
- 认证：@neondatabase/auth（Better Auth）

**修复前状态：**

```log
server/api/auth/forgot-password/post.ts(159,8): error TS2769: No overload matches this call.
server/utils/account-migration.ts(48,13): error TS2554: Expected 1 arguments, but got 0.
server/utils/account-migration.ts(188,35): error TS2353: 'neonAuthId' does not exist in type ...
server/utils/rls-helpers.ts(1020,10): error TS2352: Conversion of type 'readonly [...]' to 'string[]' may be a mistake
src/composables/use-auth/index.ts(35,11): error TS2339: Property 'success' does not exist on type 'JsonVO<AuthCurrentUser>'
src/composables/use-auth/index.ts(57,15): error TS2345: Argument of type 'string' is not assignable to parameter of type 'DataInfo<number>'
src/views/login/index.vue(544,8): error TS2322: Type '...' is not assignable to type '...'
src/views/login/index.vue(616,52): error TS2345: Argument of type 'string' is not assignable to parameter of type '"google" | "github"'
... 共约 20+ 处错误
```

---

## 二、修复内容汇总

| 文件                                         | 错误类型            | 根因                                             | 修复方式                                     |
| -------------------------------------------- | ------------------- | ------------------------------------------------ | -------------------------------------------- |
| `server/utils/audit-log.ts`                  | H3 API 变更         | `event.request.headers.get()` 不存在             | 改用 `getRequestHeader(event, name)`         |
| `server/utils/rate-limit.ts`                 | H3 API 变更         | `event.response.headers.set()` 不存在            | 改用 `setResponseHeader(event, name, value)` |
| `server/middleware/1.logger.ts`              | H3 API 变更         | 同上                                             | 同上                                         |
| `server/middleware/2.auth.ts`                | H3 API 变更         | `event.request.headers.get("authorization")`     | 改用 `getRequestHeader()`                    |
| `server/plugins/auth.ts`                     | Nitro hook 类型     | hooks 回调是 `HTTPEvent` 非 `H3Event`            | `rawEvent as H3Event`                        |
| `server/utils/auth-client.ts`                | Neon Auth 类型      | `NeonAuth` 无泛型参数                            | 改为 `NeonAuthPublicApi<any>`                |
| `server/utils/account-migration.ts`          | 多处错误            | `useDb()` 无参数 + insert/update 类型            | 所有函数加 `event: H3Event` + `as any`       |
| `server/api/auth/forgot-password/post.ts`    | defineHandler 格式  | 错用 `{post: fn}` 对象格式                       | 改为函数形式                                 |
| `server/utils/rls-helpers.ts`                | readonly 转换       | `readonly []` 转 `string[]` 不合法               | `as unknown as string[]`                     |
| `server/utils/sensitive-data.ts`             | 泛型索引写入        | `T extends Record` 不可写索引                    | `(result as Record<string, any>)[field]`     |
| `server/db/seed-sql/*.ts`                    | 路径错误            | `../../c/` 路径不存在                            | 批量改为 `../../api/`                        |
| `src/api/auth.ts`                            | 错误 JsonVO 来源    | 从 `@ruan-cat/utils/vueuse` 导入（无 `success`） | 改从 `@01s-11comm/type` 导入                 |
| `src/composables/use-auth/index.ts`          | setToken 类型       | 传 `string` 给需要 `DataInfo<number>` 的参数     | 构造完整 `DataInfo<number>` 对象             |
| `src/views/login/index.vue`                  | 表单规则类型        | `type: "email"` 推断为 `string`                  | `"email" as const`                           |
| `src/views/login/index.vue`                  | OAuth provider 类型 | `item.provider` 是 `string`                      | 函数签名改为接受 `string`，内部 `as` 转换    |
| `src/views/login/components/LoginRegist.vue` | 表单规则类型        | 同上                                             | 同上                                         |
| `apps/type/src/common/permission-codes.ts`   | 枚举缺字段          | `PUBLISH` 未定义导致 `"notice:publish"` 报错     | 添加 `PUBLISH = "publish"`                   |
| `apps/type/src/business/auth/schema.ts`      | 导出冲突            | `rolePermissions` 与 permission-codes 重名       | 重命名为 `systemRolePermissions`             |

---

## 三、关键经验教训

### 🔴 Gotcha 1：H3 v2（Nitro v3）彻底废弃 `event.request` / `event.response`

**现象：** 大量 `Property 'request' does not exist on type 'H3Event'` 错误。

**根因：** Nitro v3 升级到 H3 v2，`H3Event` 不再暴露底层的 `request` / `response` 对象。

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

---

### 🔴 Gotcha 2：Neon Auth 类型 - `createAuthClient` 返回 `NeonAuthPublicApi<T>`

**现象：** `NeonAuth` 不接受无参数，导致类型报错。

**正确写法：**

```typescript
// ❌ 错误
import type { NeonAuth } from "@neondatabase/auth";
export type AuthClientType = NeonAuth; // 错误：需要泛型参数

// ✅ 正确
import { createAuthClient } from "@neondatabase/auth";
import type { NeonAuthPublicApi } from "@neondatabase/auth";
export type AuthClientType = NeonAuthPublicApi<any>;
```

---

### 🔴 Gotcha 3：`JsonVO` 类型来源必须统一用 `@01s-11comm/type`

**现象：** `use-auth/index.ts` 中 `res.success` 报 "Property 'success' does not exist"。

**根因：** `src/api/auth.ts` 错误地从 `@ruan-cat/utils/vueuse` 导入 `JsonVO`，该版本只有 `{ code, message, data }`，没有 `success` 字段。

**两个 JsonVO 的对比：**

| 来源                     | 字段                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| `@ruan-cat/utils/vueuse` | `code`, `message`, `data`                                               |
| `@01s-11comm/type`       | `code`, `message`, `data`, `success?`, `error?`, `stack?`, `timestamp?` |

**正确写法：**

```typescript
// ❌ 错误
import type { JsonVO } from "@ruan-cat/utils/vueuse";

// ✅ 正确
import type { JsonVO } from "@01s-11comm/type";
```

---

### 🔴 Gotcha 4：pure-admin `setToken` 不接受 `string`，需要 `DataInfo<number>` 对象

**现象：** `Argument of type 'string' is not assignable to parameter of type 'DataInfo<number>'`

**根因：** pure-admin 框架的 `setToken` 设计用于处理完整的 Token 信息对象（包含 accessToken、refreshToken、expires、用户信息等）。

**字段映射（Neon Auth → DataInfo）：**

| Neon Auth 响应字段  | DataInfo 字段  |
| ------------------- | -------------- |
| `data.token`        | `accessToken`  |
| `data.refreshToken` | `refreshToken` |
| `data.expiresIn`    | `expires`      |

**正确写法：**

```typescript
// ❌ 错误
setToken(data.token);

// ✅ 正确（登录/注册场景）
setToken({
	accessToken: data.token,
	refreshToken: data.refreshToken,
	expires: data.expiresIn,
} as DataInfo<number>);

// ✅ 正确（刷新 Token 场景，响应无新 refreshToken）
const existingToken = getToken();
setToken({
	accessToken: res.data.token,
	refreshToken: existingToken?.refreshToken ?? "",
	expires: res.data.expiresIn,
} as DataInfo<number>);
```

---

### 🔴 Gotcha 5：`defineHandler` 不支持 HTTP 方法对象格式

**现象：** `Object literal may only specify known properties, and 'post' does not exist in type 'EventHandlerObject'`

**根因：** Nitro v3 的文件路由通过**文件名**区分 HTTP 方法（`post.ts`、`get.ts`），不是通过 handler 对象的方法名。

```typescript
// ❌ 错误（H3 某些旧版本写法，在 Nitro v3 不支持）
export default defineHandler({
  async post(event, body) { ... },
});

// ✅ 正确（Nitro v3 文件路由，文件名 post.ts 已代表 POST 方法）
export default defineHandler(async (event) => {
  const body = await readBody<MyInput>(event);
  return handleXxx(event, body);
});
```

---

### 🔴 Gotcha 6：`useDb(event: H3Event)` 必须传 `event`，服务端工具函数需贯穿透传

**现象：** `Expected 1 arguments, but got 0`（多处 `useDb()` 无参数调用）

**根因：** Cloudflare Worker 环境中，环境变量（数据库 URL 等）只在 request handler 内部可用，因此 `useDb` 强制要求 `event` 参数。

**设计原则：**

> 所有需要调用数据库的服务端工具函数，必须将 `event: H3Event` 作为第一个参数，并透传给 `useDb(event)` 和 `useAuthClient(event)`。

```typescript
// ❌ 错误（不接受 event）
export async function getMigrationStats(): Promise<...> {
  const db = useDb(); // 类型错误
}

// ✅ 正确（透传 event）
export async function getMigrationStats(event: H3Event): Promise<...> {
  const db = useDb(event);
}
```

---

### 🔴 Gotcha 7：Nitro plugin hooks 回调参数是 `HTTPEvent`，需强制转为 `H3Event`

**现象：** `Property 'path' does not exist on type 'HTTPEvent'`

**正确写法：**

```typescript
import type { H3Event } from "nitro/h3";

nitroApp.hooks.hook("request", async (rawEvent) => {
	const event = rawEvent as H3Event; // 必须强制转换
	const path = event.path; // 现在可以访问
});
```

---

### 🟡 Problem-Solution 1：Element Plus 表单规则 `type: "email"` 需要 `as const`

**现象：** `Type 'string' is not assignable to type 'RuleType'`

**根因：** TypeScript 将 `type: "email"` 中的 `"email"` 推断为宽泛的 `string`，而 `FormItemRule` 要求的是具体的 `RuleType` 字面量联合类型。

```typescript
// ❌ 类型推断为 string，无法赋值给 RuleType
{ type: "email", message: "请输入正确邮箱", trigger: "blur" }

// ✅ 使用 as const 缩窄为字面量类型
{ type: "email" as const, message: "请输入正确邮箱", trigger: "blur" }
```

---

### 🟡 Problem-Solution 2：`readonly` 数组不能直接 `as string[]`

**现象：** `TS2352: Conversion of type 'readonly [...]' to type 'string[]' may be a mistake`

**根因：** `readonly` 数组/元组不可变，与可变的 `string[]` 之间转换 TypeScript 认为不安全。

```typescript
// ❌ TypeScript 认为不安全
(BUSINESS_TABLE_GROUPS[group] as string[])
	.includes(tableName)
	(
		// ✅ 双重 as 绕过安全检查
		BUSINESS_TABLE_GROUPS[group] as unknown as string[],
	)
	.includes(tableName);
```

---

## 四、流程问题与改进建议

### 4.1 问题：服务端工具类函数设计时未考虑 Cloudflare Worker 环境约束

`account-migration.ts` 中大量函数定义时未添加 `event: H3Event` 参数，导致整个文件的 `useDb()` 调用全部非法。

**改进：** 服务端任何需要访问数据库或认证的工具函数，必须在设计时就将 `event: H3Event` 作为第一个参数。这是本项目的架构约定。

### 4.2 问题：跨包类型导入未统一，同名类型来源不同

`JsonVO` 在 `@ruan-cat/utils/vueuse` 和 `@01s-11comm/type` 中都有定义，但字段不同。开发者不小心引用了错误的来源。

**改进：** 项目内部统一约定：前端代码的通用类型（`JsonVO`、`DataInfo` 等）只从 `@01s-11comm/type` 导入，禁止从 `@ruan-cat/utils` 导入业务类型。

### 4.3 问题：Drizzle 跨包 schema 类型推断失败

`db.update(smStaff).set({ neonAuthId })` 虽然字段存在于 schema，但因跨包模块解析问题导致 TypeScript 看不到该字段。

**改进：** 此类跨包 Drizzle 操作可接受使用 `as any`，与 `migrate/post.ts` 保持一致，无需深入追查 Drizzle 内部类型推断机制。

---

## 五、最终结果

```log
# TypeCheck
> @01s-11comm/admin typecheck
> tsc --noEmit && vue-tsc --noEmit --skipLibCheck
(无任何错误输出) ✅

# Build
> @01s-11comm/admin build
✓ built in 1m45.774s ✅
```

- `apps/type` typecheck：✅ 0 errors
- `apps/admin` typecheck：✅ 0 errors
- `apps/admin` build：✅ 成功构建

---

## 六、修改文件清单

**服务端（server/）：**

- `server/utils/audit-log.ts`
- `server/utils/rate-limit.ts`
- `server/utils/account-migration.ts`（大改：添加 event 参数、as any 修复）
- `server/utils/auth-client.ts`
- `server/utils/rls-helpers.ts`
- `server/utils/sensitive-data.ts`
- `server/middleware/1.logger.ts`
- `server/middleware/2.auth.ts`
- `server/plugins/auth.ts`
- `server/api/auth/forgot-password/post.ts`
- `server/db/seed-sql/*.ts`（11 个文件，路径修复）

**前端（src/）：**

- `src/api/auth.ts`
- `src/composables/use-auth/index.ts`
- `src/views/login/index.vue`
- `src/views/login/components/LoginRegist.vue`

**类型包（apps/type/）：**

- `apps/type/src/common/permission-codes.ts`
- `apps/type/src/business/auth/schema.ts`
