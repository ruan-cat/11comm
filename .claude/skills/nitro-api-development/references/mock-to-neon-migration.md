# Admin 迁移指南：从 Mock 到 Neon 数据库

当需要将现有的 Mock 模式接口迁移到真实的 Neon PostgreSQL 数据库时，请遵循以下步骤。

## 迁移步骤

### Step 1: 准备数据库 Schema

1.  在 `apps/type/src/business/{domain}/{module}/schema.ts` 下创建对应的 Schema 定义文件。
2.  确保导出 Drizzle Table 对象 (例如 `export const smSystemConfigs = pgTable(...)`)。
3.  运行 `pnpm db:generate` 和 `pnpm db:migrate` (或 `drizzle-kit push`) 更新数据库结构。

### Step 2: 替换接口实现

修改 API 处理器文件（例如 `list.post.ts`）：

1.  **移除 Mock 依赖**：
    - 删除 `import { filterDataByQuery } ...`
    - 删除 `import { mockData } ...`
    - 删除本地定义的 `mock-data.ts` 文件引用。

2.  **导入 DB 依赖**：
    - 添加 `import { db } from "server/db"`
    - 添加 `import { yourTable } from "@01s-11comm/type"`
    - 添加 Drizzle 操作符 `import { count, eq, like, ... } from "drizzle-orm"`

3.  **重写查询逻辑**：
    - 将 `filterDataByQuery` 替换为 Drizzle 的 `where(...)` 条件构建。
    - 将数组的 `.slice()` 分页替换为数据库的 `.limit().offset()`。
    - **关键**：数据库操作是异步的，务必添加 `await` 关键字。

    **代码对比**：

    _Mock 模式 (旧)_:

    ```typescript
    const list = filterDataByQuery(mockData, { key: val });
    return { data: list.slice(0, 10) };
    ```

    _Neon 模式 (新)_:

    ```typescript
    const list = await db.select().from(table).where(eq(table.key, val)).limit(10).offset(0);
    return { data: list };
    ```

### Step 3: 数据映射 (Data Mapping)

- **自动映射**：Drizzle 通常会自动将数据库的 `snake_case` 列名映射为 Schema 定义中的 `camelCase` 属性名（如果在定义时使用了 `.name("db_col_name")`）。
- **手动映射**：如果前端类型 (`apps/type` 定义的 VO) 与 DB Schema 结构不完全一致（例如数据库存的是 JSON 字符串而前端需要对象），需要在查询后使用 `.map(...)` 进行手动转换。

### Step 4: 清理

- 删除同目录下的 `mock-data.ts` 文件。
- 验证接口返回格式是否保持不变 (`JsonVO<PageDTO>`)。
