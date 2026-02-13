# 2026-02-13 dictionary-manage schema.ts 字段同步进度

## 1. 背景

`apps/type/src/business/setting-manage/dictionary-manage/schema.ts` 的 `dtCacheConfigs` 表新增了 5 个字段：

|   新增字段    | 类型 |        说明         |
| :-----------: | :--: | :-----------------: |
|  `cacheCode`  | text | 缓存编码（notNull） |
|  `cacheName`  | text | 缓存名称（notNull） |
| `cacheGroup`  | text |      缓存分组       |
| `description` | text |      缓存描述       |
|   `status`    | text |        状态         |

## 2. 任务清单与进度

| 序号 |         任务         |                            文件                            |  状态   |
| :--: | :------------------: | :--------------------------------------------------------: | :-----: |
|  1   | 更新 Schema 参考文档 | `.claude/skills/project-schema-registry/references/dev.md` | ✅ 完成 |
|  2   |     定义映射函数     |          `apps/admin/server/api/.../list.post.ts`          | ✅ 完成 |
|  3   |   更新数据库表清单   |           `.claude/skills/neon-db-list/SKILL.md`           | ✅ 完成 |
|  4   |     补充种子数据     |           `apps/admin/server/db/seed-sql/dev.ts`           | ✅ 完成 |
|  5   |     补充表单字段     |                   `form.ts` + `form.vue`                   | ✅ 完成 |
|  6   |    扩展列表列配置    |                        `index.vue`                         | ✅ 完成 |
|  7   |     生成迁移文件     |            `drizzle/0006_big_hannibal_king.sql`            | ✅ 完成 |

## 3. 完成记录

### 3.1. 任务 1 — Schema 参考文档

更新了 `dev.md` 中 `Cache Configs Table` 的描述，从仅记录"缓存键、缓存类型、过期时间、刷新策略"扩展为 3 个 Scenario：

- Store cache identity: 缓存编码、缓存名称、缓存键
- Store cache config details: 缓存类型、缓存分组、过期时间、缓存描述、刷新策略
- Manage cache status: 启用/禁用/维护中状态

### 3.2. 任务 2 — 映射函数

在 `list.post.ts` 中定义了 `mapDtCacheConfigsToRefreshCacheListItems` 函数和 `formatDateTime` 辅助函数，处理以下字段映射：

- `id` -> `cacheId`
- `refreshStrategy` -> `refreshPolicy`
- `createdAt` (Date) -> `createTime` (string, YYYY-MM-DD HH:mm:ss)
- `updatedAt` (Date) -> `updateTime` (string)
- nullable 字段使用默认值兜底

### 3.3. 任务 3 — 数据库表清单

更新了 `neon-db-list/SKILL.md` 的 Dev (dt) 分区：

- 来源路径从旧的 `apps/admin/server/db/schemas/dev.ts` 更新为新位置
- `dtCacheConfigs` 条目补充了完整的字段列表

### 3.4. 任务 4 — 种子数据

在 `dev.ts` 中新增了 `dt_cache_configs` 种子数据生成逻辑：

- 导入 `mockRefreshCacheData`（35 条记录）
- 添加了 3 个值映射表（cacheStatusMap, refreshPolicyMap, cacheTypeMap）
- 中文标签自动转换为英文枚举值

### 3.5. 任务 5 — 表单补充

- `form.ts`: `defaultForm` 新增 `cacheCode: ""`
- `form.vue`: 新增缓存编码输入框 + 校验规则（大写字母+数字+下划线）

### 3.6. 任务 6 — 列表页扩展

`index.vue` 表格从 3 列扩展为 9 列：缓存编码、缓存名称、缓存键名、缓存类型、缓存分组、过期时间、状态、刷新策略、操作。

### 3.7. 任务 7 — 迁移文件

生成了 `drizzle/0006_big_hannibal_king.sql`，包含 5 条 `ALTER TABLE` 语句，对应 5 个新增字段。
