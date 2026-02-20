# 基础设施配置参考 (Infrastructure Configuration Reference)

本参考文档规定了项目基础设施（特别是 `apps/type` 和 `apps/admin`）的配置标准。

## `apps/type` 配置

### package.json

- **依赖 (Dependencies)**：运行时依赖（如 `zod`, `drizzle-orm`）必须放在 `dependencies` 中，而不是 `devDependencies`。
- **脚本 (Scripts)**：必须包含用于构建 (`build`) 和类型检查 (`typecheck`) 的标准脚本。

### tsconfig.json

- **运行时路径 (Runtime Paths)**：路径别名（如 `@/`）仅用于编译时。输出的声明文件 (`.d.ts`) 必须能够解析这些路径，或者随附相应的配置支持。在 `apps/type` 源码内部引用其他文件时，**强烈建议使用相对路径**以避免复杂的构建配置问题。
- **严格模式 (Strict Mode)**：必须启用 `strict: true`。

## 应用配置 (Apps Configuration)

### `apps/admin`

- **导入 (Imports)**：从 `apps/type` 导入类型时，必须通过包名 `@01s-11comm/type` 导入，**严禁**使用相对路径（如 `../../type`）。

## 数据库 Schema 配置 (Drizzle)

- **配置文件**：位于 `apps/admin` 目录下的 `drizzle.config.ts`。
- **Schema 路径**：指向 `apps/type/src/index.ts`。
- **输出目录**：迁移文件生成到 `apps/admin/server/db/migrations`。

## 环境一致性 (Environment Consistency)

- **检查**：在运行迁移之前，脚本应检查 `.env` 文件是否存在以及 `DATABASE_URL` 是否有效。
