## ADDED Requirements

### Requirement: 系统必须为试点模块提供共享端点注册表

系统 SHALL 为试点模块提供一套独立于具体运行时的端点注册表，用于统一描述路径、方法、请求解析和业务处理入口。

#### Scenario: mock 与 nitro 复用同一端点定义

- **WHEN** `repair` 或 `work-order` 模块声明一个试点端点
- **THEN** 系统 SHALL 让 Vite mock 与 Nitro 适配层复用同一端点定义
- **THEN** 系统 SHALL 避免在两个运行时内重复维护业务逻辑

### Requirement: 系统必须为试点模块提供 repository 抽象

系统 SHALL 为试点模块定义可替换的 `repository` 边界，并默认提供 mock 内存实现。

#### Scenario: 当前阶段使用 mock 内存仓储

- **WHEN** 运行时数据源配置为 `mock`
- **THEN** 系统 SHALL 通过内存仓储提供试点模块的数据读写能力

#### Scenario: 后续阶段切换真实仓储

- **WHEN** 后续版本引入 `neon` 数据源
- **THEN** 系统 SHALL 可以在不改前端 URL 契约的前提下替换试点模块仓储实现

### Requirement: 系统必须保持双运行时响应一致性

系统 SHALL 确保试点模块在 mock 与 Nitro 运行时下的响应结构、业务码语义与关键字段形状保持一致。

#### Scenario: 相同端点在双运行时下返回一致结构

- **WHEN** 同一个试点端点分别由 mock 与 Nitro 运行时处理
- **THEN** 系统 SHALL 返回一致的响应结构
- **THEN** 系统 SHALL 保持前端现有解析逻辑可继续工作
