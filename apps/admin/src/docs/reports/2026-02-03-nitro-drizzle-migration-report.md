# 2026-02-03 Nitro + Drizzle 后端迁移规范分析报告

## 1. 背景与目的

随着项目从演示阶段向生产阶段演进，后端架构正从基于 Mock 数据的模拟接口迁移至基于 Nitro + Drizzle ORM + Neon Database 的真实后端架构。为了确保这一过程的规范性和平滑性，我们对现有的 `openspec` 规范进行了全面的审查和更新。

本报告旨在总结规范冲突分析的结果、详细说明 `nitro-api` 规范的更新内容，并为后续的接口开发提供实施建议。

## 2. 规范冲突与兼容性分析

### 2.1 Nitro API 规范 (主要冲突点)

**原状**：原 `nitro-api/spec.md` 规范是为了支持静态数据迁移而制定的，其中包含了两条与真实后端相悖的强制性要求：

1.  **强制 Mock 数据**：要求所有接口必须从 `mock-data.ts` 导入数据。
2.  **强制内存筛选**：要求使用 `filterDataByQuery` 工具函数在内存中对数组进行过滤。

**分析**：这完全无法适应数据库开发模式。数据库查询需要使用 SQL (Drizzle ORM) 在数据库层面完成筛选和分页，而不是把所有数据加载到内存处理。

**解决**：已彻底重写该规范，废弃 Mock 模式，引入 Drizzle 查询标准。

### 2.2 Data Fetching 规范 (前端契约)

**分析**：`data-fetching/spec.md` 主要定义了前端 Vue 组件如何使用 TanStack Query (`useListQuery`)。

- 它规定了前端 Hook 的输入参数 (`initialParams`) 和输出结构 (`tableData`, `pureTableProps`)。
- 它依赖于 API 返回标准的 `JsonVO<PageDTO<T>>` 数据格式。

**结论**：该规范定义的是**接口契约 (Interface Contract)**。只要后端 Nitro 接口继续返回符合 `JsonVO` 格式的 JSON 数据，前端 Hook 就完全不需要感知后端的具体实现（是 Mock 还是 DB）。因此，该规范**无需修改**。

### 2.3 Type System 与 DB Schema 的映射关系

**分析**：我们对比了 `apps/type` (前端业务类型) 和 `apps/type/src/business` (数据库定义)。

- **一致性**：对于大多数实体表（如 `sm_staff` 员工表、`sm_roles` 角色表），数据库的 `snake_case` 列名通过 Drizzle 定义可以自动映射为 JS 对象的 `camelCase` 属性，与前端类型高度一致。
- **差异点**：对于部分特殊模块，如 `SystemConfig` (系统配置)，数据库采用了 Key-Value (`config_key`, `config_value`) 的通用存储结构，而前端类型定义的是结构化的对象 (`{ title: string, logoUrl: string }`)。

**结论**：这种结构差异是正常的业务复杂度体现。规范无法强制要求 DB 和 UI 类型完全 1:1。
**实施策略**：在实现此类接口时，开发者必须在 Nitro Handler 层编写数据转换逻辑（例如将 KV 列表转换为对象），而不能简单套用通用的 `select().from()` 模板。

## 3. 规范更新内容摘要

已更新 `openspec/specs/nitro-api/spec.md`，主要变更如下：

### 3.1 废弃旧模式 (Deprecated)

以下规范被标记为 **[DEPRECATED]**，仅用于遗留代码：

- ❌ `Requirement: [DEPRECATED] 使用通用筛选函数 filterDataByQuery`
- ❌ `Requirement: [DEPRECATED] Mock 数据文件规范`

### 3.2 引入新标准 (New Standards)

新增了针对 Drizzle ORM 的开发规范：

#### ✅ Requirement: 使用 Drizzle ORM 查询数据

- **强制**使用 `server/db` 导出的 `db` 实例。
- **强制**使用 `drizzle-orm` 提供的 SQL 运算符 (`eq`, `like`, `and` 等) 构建查询条件。
- **强制**使用异步 (`await`) 操作。

#### ✅ Requirement: 数据库查询标准模板

提供了标准的代码实现模式，包含以下四个步骤：

1.  **参数解构**：从请求体解构 `pageIndex`, `pageSize` 和查询字段。
2.  **条件构建**：使用数组收集 `where` 条件，最后用 `and(...)` 组合。
3.  **双重查询**：
    - 使用 `db.select({ count: count() })` 获取总记录数。
    - 使用 `db.select().limit().offset()` 获取分页数据。
4.  **结果返回**：组装成标准的 `JsonVO<PageDTO<T>>` 格式返回。

## 4. 实施建议

1.  **新接口开发**：
    - 严格遵循新的 `nitro-api` 规范。
    - 直接在 `*.post.ts` 中导入 `db` 和 Schema 进行开发。
    - 参考规范中的 "Standard Template" 进行代码编写。

2.  **旧接口迁移**：
    - 不必急于一次性迁移所有接口。
    - 可以在修改某个模块的业务逻辑时，顺便将该模块的 Mock 实现替换为 Drizzle 实现。
    - 迁移过程中，注意对比 DB Schema 和前端 Type 的字段差异，必要时使用 `.map()` 进行字段适配。

3.  **复杂查询处理**：
    - 对于 `SystemConfig` 等 KV 存储或需要多表 Join 的场景，不要受限于标准模板。
    - Drizzle 提供了强大的 `leftJoin`, `groupBy`, `with` 等功能，应充分利用 ORM 能力在数据库层解决复杂查询，尽量减少应用层的内存计算。

## 5. 总结

本次规范更新扫清了后端向真实数据库架构演进的障碍。通过明确 Drizzle ORM 的使用标准，同时保持前后端接口契约（JSON 格式）的稳定性，我们能够以最小的代价实现架构升级，同时保证前端业务的连续性。
