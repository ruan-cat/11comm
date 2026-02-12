## ADDED Requirements

### Requirement: Nitro 数据库原生交互标准 (Nitro Native DB Interaction Standard)

Nitro 服务器的所有 API 事件处理程序（Event Handlers）MUST 废弃静态 Mock 数据，转而使用 Drizzle ORM 直接与 Neon 数据库进行交互，以实现数据的真实持久化和状态管理。

#### Scenario: 写入操作持久化 (Write Persistence)

- **当 (WHEN)** 客户端发起 POST, PUT, DELETE 或 PATCH 请求时
- **那么 (THEN)** 服务器必须使用 `db.insert`, `db.update`, 或 `db.delete` 操作 Neon 数据库
- **并且 (AND)** 操作必须包含必要的数据库事务（如果涉及多表变更）
- **并且 (AND)** 必须返回数据库执行后的真实结果（使用 `.returning()` 获取）

#### Scenario: 读取操作实时性 (Read Real-time Consistency)

- **当 (WHEN)** 客户端发起 GET 请求时
- **那么 (THEN)** 服务器必须使用 `db.select` 或 `db.query` 从数据库实时检索数据
- **并且 (AND)** 必须支持基于 URL 查询参数（如 `page`, `pageSize`, `keyword`）的动态过滤和分页

### Requirement: 全栈 Schema 驱动验证 (Full-Stack Schema-Driven Validation)

API 层 MUST 建立“零信任”机制。所有进入系统的外部输入（Body, Query Params, Route Params）必须经过 `apps/type` 中定义的 Zod Schema 的严格校验。

#### Scenario: 请求体严格校验 (Strict Body Validation)

- **当 (WHEN)** 处理包含 Body 的请求时
- **那么 (THEN)** 必须使用 `readValidatedBody(event, Schema.parse)` 方法
- **并且 (AND)** Schema 必须直接引用自 `@01s-11comm/type` 的 `insertSchema` 或其变体
- **并且 (AND)** 如果校验失败，系统必须自动抛出 400 Bad Request 异常，通过 `h3` 框架返回标准化的 JSON 错误详情

#### Scenario: 查询参数与路由参数校验 (Query & Param Validation)

- **当 (WHEN)** 处理 GET 请求的查询参数或路由上的 ID 参数时
- **那么 (THEN)** 必须使用 `getValidatedQuery` 或 `getRouterParam` 配合 `z.coerce` 进行类型转换和校验（如将字符串 "123" 安全转换为数字 123）

### Requirement: 同构类型架构 (Isomorphic Type Architecture)

`apps/type` MUST 构建为全栈共享的运行时库，确保前后端使用完全一致的数据定义。

#### Scenario: 单一事实来源引用 (Single Source of Truth Reference)

- **当 (WHEN)** 后端定义数据库表结构时
- **或者 (OR)** 后端验证 API 输入时
- **或者 (OR)** 前端定义表单校验规则时
- **那么 (THEN)** 它们必须引用 `apps/type` 中同一个导出文件中的同一个 Schema 对象
- **并且 (AND)** 严禁在 `apps/admin` (Server 或 Client) 代码中重新定义数据接口

### Requirement: 自动化错误语义映射 (Automated Error Semantic Mapping)

后端 MUST 具备将底层数据库技术错误自动转化为上层业务语义错误的能力。

#### Scenario: 唯一性冲突处理 (Uniqueness Conflict Handling)

- **当 (WHEN)** 数据库操作抛出 Unique Constraint Violation (Postgres Code 23505) 时
- **那么 (THEN)** 全局错误处理器必须捕获该异常
- **并且 (AND)** 解析具体的冲突字段
- **并且 (AND)** 抛出 HTTP 409 Conflict 错误，并附带可读的错误信息（如“该编码已存在”）

#### Scenario: 引用完整性处理 (Referential Integrity Handling)

- **当 (WHEN)** 数据库操作抛出 Foreign Key Violation (Postgres Code 23503) 时
- **那么 (THEN)** 全局错误处理器必须抛出 HTTP 400 Bad Request 错误
- **并且 (AND)** 提示用户关联的资源不存在或不可操作
