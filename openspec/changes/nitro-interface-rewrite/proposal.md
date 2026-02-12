# 提案：Nitro 接口重写与全栈类型统一架构

## 1. 为什么 (Why)

当前的 `apps/admin` 后端架构处于一种“半仿真”状态，严重阻碍了项目的生产级演进。我们面临三大核心痛点：

1.  **数据虚空 (The Void of Data)**：后端大量依赖 `mock-data.ts` 返回写死的数据。这意味着我们设计了复杂的 Neon 数据库架构，却几乎没有真正使用它。业务逻辑无法验证数据库事务、约束冲突或并发问题。
2.  **类型断裂 (The Fracture of Types)**：前端依赖 `apps/type` 中手动维护的 TypeScript Interface，而这些 Interface 与后端实际返回的数据、数据库真实的表结构经常不一致。由于编译时的类型擦除，后端 API 对前端传来的数据没有任何防御能力，导致运行时异常频繁。
3.  **验证缺失 (The Absence of Validation)**：缺乏统一的运行时验证机制。校验逻辑散落在前端组件的 `rules` 和后端的临时 `if` 判断中，没有一个单一事实来源 (Single Source of Truth) 来定义“什么是有效的数据”。

我们需要一场**架构革命**，而不是简单的修补。我们需要转向 **"Schema-First Isomorphic Architecture"（模式优先的同构架构）**。

## 2. 变更内容 (What Changes)

本次变更将对后端数据层进行彻底的重构，由**静态的接口定义**转向**动态的 Schema 驱动**。

- **重塑 `apps/type` (核心引擎)**：
  - **性质变更**：从 `devDependencies`（开发时依赖）升级为 `dependencies`（运行时依赖）。这是本次架构改造的基石。
  - **能力注入**：引入 `drizzle-orm` (定义表), `zod` (定义规则), `drizzle-zod` (自动桥接)。
  - **Schema 迁移**：将原散落在 `apps/admin/server/db/schemas` 的表定义，按业务路径 (Business Path) 迁移至 `apps/type/src/business/.../schema.ts`。
  - **混合导出**：同时导出 Drizzle Table 对象（供后端查库）、Zod Schema 对象（供前后端校验）、TypeScript 类型（供 IDE 智能提示）。

- **重写 Nitro API (业务神经)**：
  - **消灭 Mock**：全量删除 `mock-data.ts`，替换为 Drizzle 的 `db.select()`, `db.insert()` 等真实操作。
  - **防御性编程**：在每一个 API Handler 中，强制使用 `readValidatedBody` 或 `getValidatedQuery` 配合 Zod Schema 进行严格的入参清洗与校验。
  - **统一错误流**：建立 `handleDbError` 机制，将数据库底层错误（如唯一键冲突 23505）自动转化为语义化的 HTTP 409/400 响应。

- **前端同构集成 (展现层)**：
  - **校验复用**：表单不再手写 `rules`，而是直接从 `apps/type` 导入 Zod Schema，生成 VeeValidate 或 Element Plus 兼容的校验规则。
  - **类型对齐**：通过类型别名 (Type Alias) 技术，引导存量代码平滑切换到新类型。

- **破坏性与兼容 (Breaking & Compatibility)**：
  - **Shadow Migration 策略**：不立即删除旧 Interface，而是将其重定义为新 Schema 类型的别名，确保项目在改造期间依然能编译通过。
  - **最终清理**：在确认所有模块迁移完毕后，将执行死代码清理，彻底移除旧的类型定义体系。

## 3. 能力图谱 (Capabilities)

### 新增能力 (New Capabilities)

- `nitro-db-integration`: **Nitro 数据库集成能力**。定义了 Nitro Server 如何标准化地连接、查询、写入 Neon 数据库，包括连接池管理和事务处理范式。
- `shared-schema-registry`: **全栈共享 Schema 注册中心**。确立 `apps/type` 为全栈唯一的“元数据中心”。它不仅存储“类型”，更存储“逻辑”（校验规则）和“结构”（数据库表定义）。
- `api-validation-standard`: **API 强验证标准**。确立了“无验证，不处理”的 API 开发原则，强制所有写入操作必须经过 Zod 层的清洗。
- `unified-error-handling`: **统一错误处理机制**。提供了一套将数据库错误码 (Postgres Error Codes) 映射为标准 HTTP 状态码的自动化机制。

### 修改能力 (Modified Capabilities)

- `mock-data-deprecation`: **Mock 数据废弃**。这是一个反向能力，标志着系统从原型阶段正式迈向生产阶段，Mock 数据将被逐步清退。
