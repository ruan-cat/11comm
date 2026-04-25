## ADDED Requirements

### Requirement: 扫描所有迁移映射条目的文件存在性

系统 SHALL 读取 `docs/prompts/route-migration-map.yml` 中定义的全部 140 个目标 Vue3 文件路径，并使用 Glob 工具验证每个路径是否在 `src/` 目录下实际存在。

#### Scenario: 文件存在

- **WHEN** 目标路径对应的 `.vue` 文件可以被 Glob 工具找到
- **THEN** 该条目标记为「✅ 已迁移」，并记录文件行数

#### Scenario: 文件不存在

- **WHEN** 目标路径对应的 `.vue` 文件在 `src/` 下不存在
- **THEN** 该条目标记为「❌ 未迁移」

#### Scenario: 文件存在但内容过少（空文件或 placeholder）

- **WHEN** 目标路径对应的 `.vue` 文件存在，但文件总行数 ≤ 20 行
- **THEN** 该条目标记为「⚠️ 存在但内容不完整」

### Requirement: 按模块分组并行扫描

系统 SHALL 将 14 个功能模块分为若干批次，每批次并行启动多个 Explorer 子代理执行扫描，以提高效率。

#### Scenario: 并行分批扫描

- **WHEN** 发起迁移存在性检查
- **THEN** 每批次同时启动 3~4 个子代理，每个子代理负责指定模块的文件扫描

#### Scenario: 汇总扫描结果

- **WHEN** 所有子代理完成扫描
- **THEN** 结果被汇总为「已迁移数量 / 未迁移数量 / 不完整数量」的统计数据，按模块分组呈现

### Requirement: 迁移存在性结果须覆盖全部 14 个模块

扫描结果 SHALL 涵盖映射表中定义的全部模块，不得遗漏任何模块或条目。

#### Scenario: 覆盖全部模块

- **WHEN** 扫描任务完成
- **THEN** 报告中包含以下所有模块的扫描结果：basic_modules、address_modules、repair_modules、complaint_modules、inspection_modules、resource_modules、fee_modules、property_modules、selector_modules、oa_modules、notice_modules、parking_modules、work_modules、other_modules
