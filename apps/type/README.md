# `@01s-11comm/type` 类型项目说明

本包是 monorepo 中的**业务类型与同构运行时库**：在单一源码中同时提供 **Drizzle 表定义**、**Zod 运行时校验** 与 **TypeScript 类型**，供后台客户端（`apps/admin/src`）、Nitro 服务端（`apps/admin/server`）及其他 workspace 包**通过包名**引用，避免重复定义与漂移。

---

## 1. 定位与职责

| 维度             | 说明                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **包名**         | `@01s-11comm/type`                                                                                                                                                                                           |
| **单一事实来源** | 数据库表结构、接口/表单校验 schema、以及从中推断的 TS 类型，以本包为权威定义（详见项目技能 `project-schema-registry`）。                                                                                     |
| **同构**         | 前后端共用同一套 Zod / 表定义，减少「后端一种 DTO、前端一种 interface」的不一致。                                                                                                                            |
| **业务对齐**     | 源码目录按**业务域与子模块**组织，并与后台**业务路径**（`apps/admin/src/router/rank/rank-route-keys.ts` 中的三级路由）对齐；新增业务路径应在该文件中体现，**不要**在类型项目里凭空发明与路由无关的顶层模块。 |

---

## 2. 依赖与入口

### 2.1 运行时依赖（`package.json`）

- **校验与建模**：`zod`、`drizzle-orm`、`drizzle-zod`
- **工具**：`@ruan-cat/utils`（与项目内工具函数保持一致）

这些依赖放在 `dependencies` 中，以便将本包作为库被解析时，消费方也能正确解析运行时引用。

### 2.2 对外导出（`exports`）

消费方应优先通过包名导入，**禁止**在 `apps/admin` 内使用指向本仓库的相对路径（例如 `../../type/...`）绕过包边界。

| 子路径                      | 含义                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| `@01s-11comm/type`          | 根入口，聚合 `common`、`business`、`constant`                         |
| `@01s-11comm/type/business` | 仅业务模块                                                            |
| `@01s-11comm/type/common`   | 通用类型、枚举、Schema 辅助、`business-options` / `business-types` 等 |
| `@01s-11comm/type/*`        | 与 `src/*.ts` 对应的细粒度入口（按需使用）                            |

根入口 `src/index.ts` 的聚合顺序为：`common` → `business` → `constant`，保证通用基础先于业务导出。

---

## 3. 目录结构概览

```plain
apps/type/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts              # 根导出入口
    ├── common/               # 跨域共享：枚举、helpers、选项、JsonVO/PageDTO 等
    ├── constant/             # 与业务弱耦合的常量（如默认分页）
    └── business/             # 按业务域划分的类型与 schema
        ├── auth/
        ├── dev-team/
        ├── operation-team/
        ├── property-manage/
        └── setting-manage/
```

- **`common/`**：例如 `helpers.ts`（`primaryId`、`timestamps` 等）、`enums.ts`（PostgreSQL 枚举集中定义）、`business-options.ts`、`business-types.ts`、`OptionsType.ts`、`permission-codes.ts`，以及统一的 `JsonVO<T>`、`PageDTO<T>`、`BaseListQueryParams` 等。
- **`business/<domain>/<module>/`**：具体业务的类型文件；**数据库表**所在模块使用约定文件名 **`schema.ts`**，并遵循 **Trinity Pattern**（见下文）。
- **当前含 `schema.ts` 的模块**（随演进可能增减）：如 `auth`、`operation-team`、多个 `property-manage` 子模块，以及 `setting-manage` 下 `system-manage`、`organize-manage`、`user-manage` 等。请以内建文件为准。

---

## 4. Trinity Pattern（三位一体）

每个承载数据库表的 `schema.ts` 应一致地分为三块（详见 `.claude/skills/project-schema-registry/SKILL.md`）：

1. **Part A — Drizzle 表**：`pgTable`、主键 `primaryId()`、时间戳 `...timestamps`（或与表设计一致的字段）、外键与索引。
2. **Part B — Zod**：`createInsertSchema` / `createSelectSchema`、以及手写的 `updateXxxSchema`（慎用 `insertSchema.partial()`；`id` 在 update 中通常必填）。
3. **Part C — TypeScript 类型**：`$inferSelect` / `$inferInsert`、`z.infer<typeof updateXxxSchema>` 等，命名如 `NewXxx`、`Xxx`、`UpdateXxx`。

**约定**：PostgreSQL 层枚举集中在 `src/common/enums.ts`，避免多文件重复定义。

---

## 5. 导出与导入规范

本节与 `.claude/skills/type-project-organization/SKILL.md` 保持一致。

### 5.1 导出

- 每层目录应有 **`index.ts`**，使用 **`export * from "./子模块"`** 聚合下一层。
- **禁止** `export type * from "..."`；**禁止** `export type { A, B } from "..."` 式的逐项罗列（除非项目另有特例）。
- 多个模块重复导出同名成员时，将公共选项/类型收敛到 `common/business-options.ts` 或 `common/business-types.ts`。

### 5.2 本包内部导入路径

- **必须**使用**相对路径**（如 `../../../common`），**不要**使用 `@/` 别名引用本包内文件。
- **原因**：`apps/admin` 通过 Vite 消费本包源码时，`@/` 会解析到 **admin 的 `src/`**，导致 `ENOENT` 等构建错误；`tsconfig` 中的 `@/*` 仅服务本包 `tsc --noEmit`。

### 5.3 消费方（如 `apps/admin`）导入

- **必须**使用 **`import { ... } from "@01s-11comm/type"`**（或 `/common`、`/business` 子路径），**不要**使用相对路径跨包引用 `apps/type`。

---

## 6. 与数据库工具链的关系

表定义 lives in **`apps/type`**，Drizzle Kit 配置 lives in **`apps/admin`**：

- **配置**：`apps/admin/drizzle.config.ts` 中 `schema` 显式包含本包的 `src/common/enums.ts` 与 `src/business/**/schema.ts`（Glob），确保枚举与各模块表一并被 Kit 扫描。
- **迁移产物**：`out` 当前为 `apps/admin/drizzle`（以该文件为准；若团队改目录需同步更新本文档）。
- **常用命令**（在 **`apps/admin`** 下执行，而非本包）：

  ```bash
  pnpm -F @01s-11comm/admin db:generate   # 生成迁移
  pnpm -F @01s-11comm/admin db:migrate    # 执行迁移
  ```

修改或新增 `apps/type` 内 schema 后，请同步遵循 **schema-change-sync** 技能：类型、迁移、接口、页面、种子与文档的一致性检查。

---

## 7. 本地开发命令

在仓库根目录：

```bash
pnpm -F @01s-11comm/type typecheck
```

用于对本包做 `tsc --noEmit` 严格校验。改动了导出链或 `schema.ts` 后，建议同时验证 **admin** 的类型检查与构建。

---

## 8. 常见问题（FAQ）

**Q：新增业务类型文件要改哪些地方？**  
在对应 `business/...` 路径下新增 `.ts`，并在同层及上层的 `index.ts` 中增加 `export *`，保证从 `src/index.ts` 可达。

**Q：构建 admin 报找不到 `common` 或路径错乱？**  
检查 `apps/type` 源码是否误用了 `@/` 导入；改为相对路径后重试。

**Q：两个模块导出了同名的 Options？**  
迁入 `src/common/business-options.ts`，各模块删除重复定义并统一从这里引用。

**Q：后端 `readValidatedBody` 后入库类型仍不匹配？**  
使用 Trinity 导出的 **`New<Xxx>`** 等对 `insert().values()` 做类型回填（见 `project-schema-registry` 中「API Insert 类型回填」）。

---

## 9. 延伸阅读（项目内技能）

| 主题                                     | 路径                                                |
| ---------------------------------------- | --------------------------------------------------- |
| 目录与导出、相对路径、`business-options` | `.claude/skills/type-project-organization/SKILL.md` |
| Trinity、领域参考、Insert/Update 约定    | `.claude/skills/project-schema-registry/SKILL.md`   |
| Schema 与 Seed 变更注意                  | `.claude/skills/schema-and-seed-guardian/SKILL.md`  |
| 全项目 Schema 变更清单                   | `.claude/skills/schema-change-sync/SKILL.md`        |
| 数据库表清单与排查                       | `.claude/skills/neon-db-query/SKILL.md`             |

---

## 10. 引擎与包管理

- **Node**：`>=22.14.0`（见 `package.json` 的 `engines`）
- **包管理器**：`pnpm@10.32.1`（与仓库约束一致）

本文档描述的是当前仓库中的约定与结构；若与根目录 `CLAUDE.md` / `AGENTS.md` 中有表述差异，以**更严格的工程约束**及**实际代码**为准。

---

## 11. 版本发布

本包使用 `relizy` 进行独立版本管理（`versionMode: "independent"`），tag 格式为 `@01s-11comm/type@<version>`。GitHub Release 通过 CI 中的 `gh release create` 从 CHANGELOG.md 自动生成。

<!-- TODO 故意触发发版 -->
