## ADDED Requirements

### Requirement: 系统必须在页面迁移后保持 API 地址契约稳定

系统 SHALL 确保已迁移页面在切换 `mock`、`nitro-vite`、`nitro-standalone` 运行时后，继续使用原有业务 URL，不得要求页面批量改写接口路径。

#### Scenario: 已迁移页面切换运行时

- **WHEN** 已迁移页面在不同 API 运行时之间切换
- **THEN** 页面中的业务请求地址 SHALL 保持不变
- **THEN** 系统 SHALL 仅通过统一基址解析逻辑完成路由到正确运行时

#### Scenario: 旧请求链与新请求链共存

- **WHEN** 页面分别通过 Alova 与旧 `uni.request` 链发起业务请求
- **THEN** 系统 SHALL 为两条请求链提供一致的运行时基址解析能力
