---
name: schema-change-sync
description: 数据库 Schema 变更时的全项目同步检查清单。当修改 apps/type 中 schema.ts 的表字段、新增数据库表、或删除表时，使用此技能确保类型项目、数据库迁移、后端接口、前端页面、种子数据和技能文档全部同步更新，避免遗漏。
---

# Schema 变更同步 (Schema Change Sync)

## 1. 适用场景

当 `apps/type/src/business/**/schema.ts` 发生以下变更时，**必须**按本清单逐项检查并同步：

- **场景 A**: 现有表新增/删除/重命名字段
- **场景 B**: 新增数据库表
- **场景 C**: 删除数据库表

## 2. 同步检查清单

复制此清单跟踪进度：

```plain
Schema 变更同步进度：
- [ ] 1. Schema 文件 (Trinity Pattern)
- [ ] 2. 导出链完整性
- [ ] 3. 前端业务类型
- [ ] 4. 数据库迁移
- [ ] 5. 技能文档
- [ ] 6. 后端 API 接口
- [ ] 7. 种子数据
- [ ] 8. 前端列表页面
- [ ] 9. 前端表单组件
- [ ] 10. 前端 API Hook
```

### 2.1. Schema 文件 (Trinity Pattern)

**文件**: `apps/type/src/business/{domain}/{module}/schema.ts`

Schema 文件必须同时更新三个部分：

|  部分  |                内容                |                            示例                            |
| :----: | :--------------------------------: | :--------------------------------------------------------: |
| Part A |         Drizzle Table 定义         |           `pgTable("dt_cache_configs", { ... })`           |
| Part B | Zod Schemas (insert/select/update) |  `insertDtCacheConfigSchema`, `updateDtCacheConfigSchema`  |
| Part C |          TypeScript Types          | `DtCacheConfig`, `NewDtCacheConfig`, `UpdateDtCacheConfig` |

**注意**: update schema 手动使用 `z.object({...})`，新增字段需要手动添加对应的 optional 字段。

### 2.2. 导出链完整性

**仅新增表时需要**。确保从 schema.ts 到 `src/index.ts` 的完整导出链：

```plain
schema.ts → module/index.ts → domain/index.ts → business/index.ts → src/index.ts
```

每一层 `index.ts` 必须包含 `export * from "./xxx";`。

### 2.3. 前端业务类型

**文件**: `apps/type/src/business/{dev-team|property-manage|...}/{module}/*.ts`

前端展示用的类型定义（非 schema.ts 中的 DB 类型）：

- `XxxListItem` 接口 — 列表页每行数据的字段
- `XxxQueryParams` 接口 — 搜索/筛选参数
- `XxxFormVO` 接口 — 表单数据对象
- Options 常量 — 下拉选项（如 `cacheTypeOptions`）

**注意**: 前端类型字段名可能与 DB 字段名不同（见第 3 节映射规范）。

### 2.4. 数据库迁移

```bash
pnpm -F @01s-11comm/admin db:generate
```

检查生成的 `apps/admin/drizzle/xxxx_*.sql` 迁移文件内容是否正确。

### 2.5. 技能文档

|                              文件                               |                        更新内容                        |
| :-------------------------------------------------------------: | :----------------------------------------------------: |
|             `.claude/skills/neon-db-list/SKILL.md`              | 新增表: 添加条目；修改字段: 更新备注；删除表: 移除条目 |
| `.claude/skills/project-schema-registry/references/{domain}.md` |              更新对应领域的 Scenario 描述              |

### 2.6. 后端 API 接口

**文件**: `apps/admin/server/api/{业务路径}/*.ts`

|         变更点          |                                   说明                                    |
| :---------------------: | :-----------------------------------------------------------------------: |
| 列表接口 `list.post.ts` | select 查询包含新字段；映射函数处理字段名差异；querySchema 包含新筛选参数 |
|      新增/更新接口      |               `readValidatedBody` 使用的 Zod schema 已更新                |
|        新增表时         |           创建完整的 CRUD 接口文件 (list/create/update/delete)            |

### 2.7. 种子数据

**文件**: `apps/admin/server/db/seed-sql/{module}.ts`

- 导入 Mock 数据源
- 建立中文标签→英文枚举值的映射表（见第 3 节）
- 编写 `db.insert(table).values(records).toSQL()` 生成逻辑

### 2.8. 前端列表页面

**文件**: `apps/admin/src/pages/{业务路径}/index.vue`

|        变更点        |         说明         |
| :------------------: | :------------------: |
|      `columns`       | 表格列配置包含新字段 |
| `plusSearchColumns`  | 搜索栏包含新筛选条件 |
| `plusSearchModelRef` | 搜索默认值包含新字段 |

### 2.9. 前端表单组件

**文件**: `apps/admin/src/pages/{业务路径}/components/form.ts` + `form.vue`

|    文件    |                             变更点                             |
| :--------: | :------------------------------------------------------------: |
| `form.ts`  |                 `defaultForm` 包含新字段默认值                 |
| `form.vue` | `plusFormColumns` 包含新表单项；`plusFormRules` 包含新校验规则 |

### 2.10. 前端 API Hook

**文件**: `apps/admin/src/api/{业务路径}/index.ts`

- 修改字段时: 通常无需更改（Hook 透传参数）
- 新增表时: 创建 `useXxxListQuery` Hook

## 3. 字段名映射规范

### 3.1. DB 字段与前端类型字段的常见差异

后端 API 的映射函数需处理以下差异：

|  差异类型  | DB 字段 (Drizzle)  |  前端字段 (ListItem)   |
| :--------: | :----------------: | :--------------------: |
|    主键    |        `id`        | `xxxId` (如 `cacheId`) |
|  创建时间  | `createdAt` (Date) | `createTime` (string)  |
|  更新时间  | `updatedAt` (Date) | `updateTime` (string)  |
| 语义重命名 | `refreshStrategy`  |    `refreshPolicy`     |

日期格式化统一为 `YYYY-MM-DD HH:mm:ss`。

### 3.2. 枚举值映射规范

|  存储层  |              格式               |            示例            |
| :------: | :-----------------------------: | :------------------------: |
|  数据库  | 英文枚举值 (options 的 `value`) | `"enabled"`, `"scheduled"` |
| 前端展示 |  中文标签 (options 的 `label`)  |   `"启用"`, `"定时刷新"`   |

种子数据如果来自 Mock（使用中文标签），**必须**建立 label→value 映射表：

```typescript
const statusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	维护中: "maintenance",
};
```

## 4. 场景速查表

### 4.1. 场景 A: 现有表新增字段

| 序号 |           检查项           |  必须  |
| :--: | :------------------------: | :----: |
|  1   | Schema 文件 Part A + B + C |   是   |
|  2   |  数据库迁移 `db:generate`  |   是   |
|  3   |        技能文档更新        |   是   |
|  4   |     后端 API 映射函数      |   是   |
|  5   |        前端业务类型        | 视情况 |
|  6   |          种子数据          | 视情况 |
|  7   |       前端列表/表单        | 视情况 |

### 4.2. 场景 B: 新增数据库表

全部 10 项检查项**均为必须**。额外注意：

- 导出链完整性（2.2）
- 创建完整 CRUD 接口（2.6）
- 创建前端 API Hook（2.10）

## 5. 实战示例

参考 `apps/admin/src/docs/reports/2026-02-13-schema-sync-progress.md`，记录了 `dtCacheConfigs` 表新增 5 个字段时的完整同步过程，涉及 7 类文件共 15 个文件的同步更改。
