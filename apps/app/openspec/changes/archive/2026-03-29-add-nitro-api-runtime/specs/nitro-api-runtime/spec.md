## ADDED Requirements

### Requirement: 系统必须支持三套可切换的 API 运行时

系统 SHALL 支持 `mock`、`nitro-vite`、`nitro-standalone` 三套 API 运行时，并通过统一环境变量切换运行方式。

#### Scenario: H5 以 mock 运行时启动

- **WHEN** 开发者以 `mock` 运行时启动 H5
- **THEN** 系统 SHALL 启用 `vite-plugin-mock-dev-server`
- **THEN** 系统 SHALL 不启用 Nitro Vite 插件

#### Scenario: H5 以 nitro-vite 运行时启动

- **WHEN** 开发者以 `nitro-vite` 运行时启动 H5
- **THEN** 系统 SHALL 启用 Nitro Vite 插件
- **THEN** 系统 SHALL 禁用 `vite-plugin-mock-dev-server`

#### Scenario: 独立 Nitro 服务启动

- **WHEN** 开发者执行独立 Nitro 启动命令
- **THEN** 系统 SHALL 启动不依赖 H5 页面服务的独立 API 进程
- **THEN** 系统 SHALL 暴露可用于健康检查的基础接口

### Requirement: 系统必须保持旧业务路径契约稳定

系统 SHALL 在 Nitro 运行时下继续支持现有 `/app/...` 与 `/callComponent/...` 业务路径，不得要求前端试点模块批量改写 URL。

#### Scenario: 旧业务路径命中 Nitro

- **WHEN** 前端向 `/app/ownerRepair.listOwnerRepairs` 等旧业务路径发起请求
- **THEN** Nitro 运行时 SHALL 正确匹配并处理该请求

#### Scenario: 健康检查路径独立于业务路径

- **WHEN** 调试脚本或启动脚本发起健康检查
- **THEN** 系统 SHALL 提供独立的健康检查接口
- **THEN** 该接口 SHALL 不依赖业务模块加载完成
