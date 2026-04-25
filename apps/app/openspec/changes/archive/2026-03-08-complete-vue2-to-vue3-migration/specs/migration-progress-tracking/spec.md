## ADDED Requirements

### Requirement: 系统必须实时追踪每个页面的迁移状态

系统 SHALL 实时追踪 140 个页面的迁移状态，包括未开始、进行中、已完成、已验收等状态。

#### Scenario: 初始化页面状态

- **WHEN** 系统开始迁移任务
- **THEN** 系统 SHALL 为所有 140 个页面初始化状态为"未开始"
- **THEN** 系统 SHALL 根据路由映射表（route-migration-map.yml）创建页面清单
- **THEN** 系统 SHALL 为每个页面分配唯一的标识符

#### Scenario: 更新页面状态为进行中

- **WHEN** 系统开始迁移一个页面
- **THEN** 系统 SHALL 将该页面状态更新为"进行中"
- **THEN** 系统 SHALL 记录开始时间戳
- **THEN** 系统 SHALL 记录负责迁移的子代理团队信息

#### Scenario: 更新页面状态为已完成

- **WHEN** 页面迁移完成并通过审核
- **THEN** 系统 SHALL 将该页面状态更新为"已完成"
- **THEN** 系统 SHALL 记录完成时间戳
- **THEN** 系统 SHALL 记录迁移耗时

#### Scenario: 更新页面状态为已验收

- **WHEN** 页面通过最终的合规性验收
- **THEN** 系统 SHALL 将该页面状态更新为"已验收"
- **THEN** 系统 SHALL 记录验收时间戳
- **THEN** 系统 SHALL 记录验收结果

### Requirement: 系统必须追踪每个模块的完成进度

系统 SHALL 按照业务模块追踪迁移进度，包括已完成页面数、总页面数、完成百分比。

#### Scenario: 计算模块完成进度

- **WHEN** 模块内的页面状态发生变化
- **THEN** 系统 SHALL 重新计算该模块的完成进度
- **THEN** 系统 SHALL 更新模块的已完成页面数
- **THEN** 系统 SHALL 更新模块的完成百分比

#### Scenario: 标记模块完成

- **WHEN** 模块内所有页面都已验收
- **THEN** 系统 SHALL 将该模块标记为"已完成"
- **THEN** 系统 SHALL 记录模块完成时间戳
- **THEN** 系统 SHALL 触发下一个模块的迁移任务

### Requirement: 系统必须生成迁移进度报告

系统 SHALL 定期生成迁移进度报告，包含总体进度、各模块进度、当前任务等信息。

#### Scenario: 生成总体进度报告

- **WHEN** 用户请求查看迁移进度
- **THEN** 系统 SHALL 生成包含以下信息的报告：
  - 总页面数（140 个）
  - 已完成页面数
  - 未完成页面数
  - 总体完成百分比
  - 预计完成时间

#### Scenario: 生成模块进度报告

- **WHEN** 用户请求查看模块进度
- **THEN** 系统 SHALL 生成包含以下信息的报告：
  - 各模块的总页面数
  - 各模块的已完成页面数
  - 各模块的完成百分比
  - 各模块的状态（未开始、进行中、已完成）

#### Scenario: 生成当前任务报告

- **WHEN** 用户请求查看当前任务
- **THEN** 系统 SHALL 生成包含以下信息的报告：
  - 当前正在迁移的页面列表
  - 每个页面的负责团队
  - 每个页面的开始时间
  - 每个页面的预计完成时间

### Requirement: 系统必须追踪合规性检查结果

系统 SHALL 追踪每个页面的合规性检查结果，包括通过的检查项和未通过的检查项。

#### Scenario: 记录合规性检查项

- **WHEN** 系统对页面进行合规性检查
- **THEN** 系统 SHALL 记录所有检查项（api-error-handling、z-paging、use-wd-form 等）
- **THEN** 系统 SHALL 记录每个检查项的结果（通过/未通过）
- **THEN** 系统 SHALL 记录未通过检查项的具体问题

#### Scenario: 计算合规性通过率

- **WHEN** 系统完成合规性检查
- **THEN** 系统 SHALL 计算该页面的合规性通过率
- **THEN** 系统 SHALL 计算整个项目的合规性通过率
- **THEN** 系统 SHALL 更新合规性统计信息

#### Scenario: 生成合规性报告

- **WHEN** 用户请求查看合规性报告
- **THEN** 系统 SHALL 生成包含以下信息的报告：
  - 总检查文件数
  - 通过检查的文件数
  - 未通过检查的文件数
  - 合规性通过率
  - 各检查项的通过情况

### Requirement: 系统必须支持按优先级查看进度

系统 SHALL 支持按照高、中、低优先级分别查看迁移进度。

#### Scenario: 查看高优先级模块进度

- **WHEN** 用户请求查看高优先级模块进度
- **THEN** 系统 SHALL 显示 resource_modules 的进度（29 个页面）
- **THEN** 系统 SHALL 显示 fee_modules 的进度（14 个页面）
- **THEN** 系统 SHALL 显示高优先级模块的总体完成百分比

#### Scenario: 查看中优先级模块进度

- **WHEN** 用户请求查看中优先级模块进度
- **THEN** 系统 SHALL 显示 oa_modules 的进度（8 个页面）
- **THEN** 系统 SHALL 显示 property_modules 的进度（11 个页面）
- **THEN** 系统 SHALL 显示 parking_modules 的进度（5 个页面）
- **THEN** 系统 SHALL 显示中优先级模块的总体完成百分比

#### Scenario: 查看低优先级模块进度

- **WHEN** 用户请求查看低优先级模块进度
- **THEN** 系统 SHALL 显示 notice_modules 的进度（2 个页面）
- **THEN** 系统 SHALL 显示 basic_modules 的进度（5 个页面）
- **THEN** 系统 SHALL 显示 other_modules 的进度（14 个页面）
- **THEN** 系统 SHALL 显示低优先级模块的总体完成百分比

### Requirement: 系统必须记录迁移过程中的问题和解决方案

系统 SHALL 记录迁移过程中遇到的所有问题和对应的解决方案，便于后续参考。

#### Scenario: 记录迁移问题

- **WHEN** 子代理在迁移过程中遇到问题
- **THEN** 系统 SHALL 记录问题的描述
- **THEN** 系统 SHALL 记录问题发生的页面和位置
- **THEN** 系统 SHALL 记录问题的严重程度（阻塞/非阻塞）

#### Scenario: 记录解决方案

- **WHEN** 问题被解决
- **THEN** 系统 SHALL 记录解决方案的描述
- **THEN** 系统 SHALL 记录解决方案参考的技能文档
- **THEN** 系统 SHALL 记录解决问题的子代理

#### Scenario: 生成问题解决方案库

- **WHEN** 迁移任务完成
- **THEN** 系统 SHALL 生成问题解决方案库
- **THEN** 库 SHALL 包含所有问题和解决方案
- **THEN** 库 SHALL 按照问题类型分类
- **THEN** 库 SHALL 便于后续项目参考

### Requirement: 系统必须支持导出迁移进度数据

系统 SHALL 支持将迁移进度数据导出为 Markdown 或 JSON 格式，便于分享和存档。

#### Scenario: 导出 Markdown 格式报告

- **WHEN** 用户请求导出 Markdown 格式报告
- **THEN** 系统 SHALL 生成包含所有进度信息的 Markdown 文件
- **THEN** 文件 SHALL 包含表格、列表等格式化内容
- **THEN** 文件 SHALL 保存到 `docs/reports/` 目录

#### Scenario: 导出 JSON 格式数据

- **WHEN** 用户请求导出 JSON 格式数据
- **THEN** 系统 SHALL 生成包含所有进度数据的 JSON 文件
- **THEN** JSON 文件 SHALL 包含结构化的数据
- **THEN** JSON 文件 SHALL 便于程序化处理

### Requirement: 系统必须支持恢复中断的迁移任务

系统 SHALL 支持在迁移任务中断后，从中断点恢复继续执行。

#### Scenario: 保存迁移状态

- **WHEN** 迁移任务执行过程中
- **THEN** 系统 SHALL 定期保存当前状态
- **THEN** 系统 SHALL 保存每个页面的迁移状态
- **THEN** 系统 SHALL 保存当前正在执行的任务

#### Scenario: 恢复迁移任务

- **WHEN** 迁移任务中断后重新启动
- **THEN** 系统 SHALL 读取上次保存的状态
- **THEN** 系统 SHALL 跳过已完成的页面
- **THEN** 系统 SHALL 从中断点继续执行未完成的任务

#### Scenario: 验证恢复的正确性

- **WHEN** 系统恢复迁移任务
- **THEN** 系统 SHALL 验证已完成页面的状态
- **THEN** 系统 SHALL 验证未完成页面的状态
- **THEN** 系统 SHALL 确保没有重复执行或遗漏任务
