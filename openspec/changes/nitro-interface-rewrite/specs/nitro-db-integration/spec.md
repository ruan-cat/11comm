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

### Requirement: 导入路径与别名唯一来源 (Import & Alias Contract)

API 层 MUST 以 `apps/admin/nitro.config.ts` 的 alias 为唯一依据，避免路径漂移导致类型与编译错误。

#### Scenario: 服务端模块导入 (Server Module Import)

- **当 (WHEN)** API 引入服务端模块（db/utils）时
- **那么 (THEN)** 必须使用 `server/*` 别名（如 `server/db`）
- **并且 (AND)** 严禁使用未声明的 `@/server/*` 别名

#### Scenario: Schema 与类型导入 (Schema Import)

- **当 (WHEN)** API 引入表结构或 Zod Schema 时
- **那么 (THEN)** 必须从 `@01s-11comm/type` 导入
- **并且 (AND)** 不允许在 `apps/admin` 内重复定义业务类型或 schema

### Requirement: 校验工具可用性闸门 (Validation Helper Availability Gate)

API 层 MUST 以“可用性优先”选择校验 helper，禁止调用不可用函数导致类型错误。

#### Scenario: 校验 Helper 可用 (Helper Available)

- **当 (WHEN)** `readValidatedBody` 或 `getValidatedQuery` 在当前 Nitro 运行时可用
- **那么 (THEN)** 必须直接使用它们完成校验

#### Scenario: 校验 Helper 不可用 (Helper Missing)

- **当 (WHEN)** helper 不存在或未启用
- **那么 (THEN)** 必须使用 `readBody/getQuery + Schema.parse` 完成校验
- **并且 (AND)** 禁止编译期报错或运行期异常作为“后置校验”

### Requirement: readValidatedBody 类型回填 (Validated Body Type Recovery)

当 `readValidatedBody` 的类型推导不足以满足 Drizzle `values()` 的严格类型要求时，必须显式回填类型，避免出现 `Record<string, never>` 或 `unknown` 导致的插入类型报错。

#### Scenario: Insert 类型回填 (Insert Type Recovery)

- **当 (WHEN)** `readValidatedBody` 推导为 `Record<string, never>` 或 `unknown`
- **那么 (THEN)** 必须使用 `as unknown as NewX` 将结果回填为 `@01s-11comm/type` 的 Insert 类型
- **并且 (AND)** 不得依赖 `readValidatedBody<NewX>` 泛型写法（该实现要求多个类型参数，容易产生 TS2558）

#### Example: 安全写入 (Safe Insert)

- `const body = (await readValidatedBody(event, insertSchema.parse)) as unknown as NewX;`
- `await db.insert(table).values(body).returning();`

### Requirement: 写操作类型安全 (Write Type Safety)

写入操作 MUST 与 Drizzle 表定义严格对齐，避免字段漂移导致类型错误。

#### Scenario: Insert 数据写入 (Insert Payload)

- **当 (WHEN)** 执行 `db.insert` 时
- **那么 (THEN)** 只允许写入 schema 允许的字段
- **并且 (AND)** 由数据库默认或触发器维护的字段禁止显式写入

#### Scenario: Update 数据写入 (Update Payload)

- **当 (WHEN)** 执行 `db.update` 时
- **那么 (THEN)** 只允许更新 `partial()` 中存在的字段
- **并且 (AND)** 主键或路由参数必须先通过 Zod 校验

### Requirement: 排序字段白名单 (Safe Sort Mapping)

列表排序 MUST 通过白名单映射，避免动态索引带来的类型与运行时错误。

#### Scenario: 排序参数处理 (Sort Mapping)

- **当 (WHEN)** 接口需要使用 `sortBy` 参数
- **那么 (THEN)** 必须通过字段白名单映射到 Drizzle 列对象
- **并且 (AND)** 不得直接使用 `table[sortBy]` 形式访问

### Requirement: 响应结构一致性 (Response Envelope Consistency)

API 返回结构 MUST 保持 `JsonVO<PageDTO<T>>` 规范一致，避免旧字段与新字段混用。

#### Scenario: 分页返回结构 (PageDTO Return)

- **当 (WHEN)** 返回分页数据
- **那么 (THEN)** 必须按 `JsonVO<PageDTO<T>>` 输出
- **并且 (AND)** 字段名必须与现行约定一致，不得混用旧命名
