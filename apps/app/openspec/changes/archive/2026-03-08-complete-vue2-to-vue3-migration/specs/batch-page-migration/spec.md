## ADDED Requirements

### Requirement: 系统必须支持按模块批量迁移页面

系统 SHALL 支持按照业务模块批量迁移 Vue2 页面到 Vue3，每个模块的迁移必须包含代码迁移、组件迁移、样式迁移、API 迁移、路由迁移的完整流程。

#### Scenario: 迁移单个模块的所有页面

- **WHEN** 用户选择一个模块（如 resource_modules）进行迁移
- **THEN** 系统 SHALL 按照路由映射表（route-migration-map.yml）找到该模块的所有页面
- **THEN** 系统 SHALL 为每个页面创建独立的迁移任务
- **THEN** 系统 SHALL 按照依赖顺序执行迁移任务

#### Scenario: 迁移任务包含所有必需的技能

- **WHEN** 系统创建页面迁移任务
- **THEN** 任务 SHALL 包含 code-migration 技能（Vue2 → Vue3 代码写法）
- **THEN** 任务 SHALL 包含 component-migration 技能（ColorUI → wot-design-uni）
- **THEN** 任务 SHALL 包含 style-migration 技能（ColorUI 类名 → UnoCSS）
- **THEN** 任务 SHALL 包含 api-migration 技能（Java110Context → Alova）
- **THEN** 任务 SHALL 包含 route-migration 技能（pages.json → 约定式路由）

#### Scenario: 表单页面迁移包含额外技能

- **WHEN** 迁移的页面包含 `<wd-form>` 组件
- **THEN** 任务 SHALL 额外包含 use-wd-form 技能
- **THEN** 任务 SHALL 额外包含 beautiful-component-design 技能

#### Scenario: 列表页面迁移包含分页技能

- **WHEN** 迁移的页面包含列表和分页功能
- **THEN** 任务 SHALL 额外包含 z-paging-integration 技能
- **THEN** 任务 SHALL 额外包含 api-error-handling 技能

### Requirement: 系统必须严格按照路由映射表进行迁移

系统 SHALL 严格按照 `docs/prompts/route-migration-map.yml` 中定义的路由映射关系进行页面迁移，不得偏离映射表。

#### Scenario: 验证路由映射表的准确性

- **WHEN** 系统开始迁移前
- **THEN** 系统 SHALL 读取 route-migration-map.yml 文件
- **THEN** 系统 SHALL 验证所有源文件路径存在于 gitee-example 目录
- **THEN** 系统 SHALL 验证所有目标文件路径符合项目目录结构规范

#### Scenario: 按照映射表创建目标文件

- **WHEN** 系统迁移单个页面
- **THEN** 系统 SHALL 根据映射表确定目标文件路径
- **THEN** 系统 SHALL 在目标路径创建新文件
- **THEN** 系统 SHALL 保持目标文件的目录结构与映射表一致

### Requirement: 系统必须支持按优先级分阶段迁移

系统 SHALL 支持按照高、中、低优先级分阶段迁移页面，每个阶段完成后进行验收。

#### Scenario: 高优先级模块优先迁移

- **WHEN** 系统开始迁移
- **THEN** 系统 SHALL 首先迁移 resource_modules（29 个页面）
- **THEN** 系统 SHALL 其次迁移 fee_modules（14 个页面）
- **THEN** 系统 SHALL 在高优先级模块完成后才开始中优先级模块

#### Scenario: 中优先级模块按顺序迁移

- **WHEN** 高优先级模块迁移完成
- **THEN** 系统 SHALL 迁移 oa_modules（8 个页面）
- **THEN** 系统 SHALL 迁移 property_modules（11 个页面）
- **THEN** 系统 SHALL 迁移 parking_modules（5 个页面）

#### Scenario: 低优先级模块最后迁移

- **WHEN** 中优先级模块迁移完成
- **THEN** 系统 SHALL 迁移 notice_modules（2 个页面）
- **THEN** 系统 SHALL 迁移 basic_modules（5 个页面）
- **THEN** 系统 SHALL 迁移 other_modules（14 个页面）

### Requirement: 系统必须在迁移前执行技能触发检查

系统 SHALL 在迁移每个页面前，强制执行 `.claude/skills/check-trigger.md` 中定义的技能触发检查流程。

#### Scenario: 执行技能触发检查流程

- **WHEN** 系统准备迁移一个页面
- **THEN** 系统 SHALL 读取 `.claude/skills/check-trigger.md` 文件
- **THEN** 系统 SHALL 逐项回答检查问题
- **THEN** 系统 SHALL 生成该页面需要的技能清单
- **THEN** 系统 SHALL 阅读所有相关技能的主文件（SKILL.md）和子文档

#### Scenario: 识别多技能协同需求

- **WHEN** 页面包含表单功能
- **THEN** 系统 SHALL 识别需要 use-wd-form 技能
- **THEN** 系统 SHALL 识别需要 beautiful-component-design 技能
- **THEN** 系统 SHALL 确保两个技能协同执行

#### Scenario: 识别列表页面的技能需求

- **WHEN** 页面包含列表和分页功能
- **THEN** 系统 SHALL 识别需要 z-paging-integration 技能
- **THEN** 系统 SHALL 识别需要 api-migration 技能
- **THEN** 系统 SHALL 识别需要 api-error-handling 技能
- **THEN** 系统 SHALL 确保三个技能协同执行

### Requirement: 系统必须为每个页面创建详细的迁移任务清单

系统 SHALL 为每个页面创建包含具体修改内容和 Skills 要求的详细任务清单。

#### Scenario: 任务清单包含所有迁移步骤

- **WHEN** 系统为页面创建任务清单
- **THEN** 任务清单 SHALL 包含代码迁移步骤（code-migration）
- **THEN** 任务清单 SHALL 包含组件迁移步骤（component-migration）
- **THEN** 任务清单 SHALL 包含样式迁移步骤（style-migration）
- **THEN** 任务清单 SHALL 包含 API 迁移步骤（api-migration）
- **THEN** 任务清单 SHALL 包含路由迁移步骤（route-migration）
- **THEN** 任务清单 SHALL 包含合规性检查步骤

#### Scenario: 任务清单包含验收标准

- **WHEN** 系统创建任务清单
- **THEN** 每个步骤 SHALL 包含明确的验收标准
- **THEN** 验收标准 SHALL 基于对应的 Skills 文档
- **THEN** 验收标准 SHALL 可被自动化检查

### Requirement: 系统必须支持迁移进度的实时追踪

系统 SHALL 支持实时追踪每个页面的迁移状态，包括未开始、进行中、已完成、已验收等状态。

#### Scenario: 记录页面迁移状态

- **WHEN** 页面迁移状态发生变化
- **THEN** 系统 SHALL 更新该页面的状态
- **THEN** 系统 SHALL 记录状态变化的时间戳
- **THEN** 系统 SHALL 记录执行迁移的子代理信息

#### Scenario: 生成迁移进度报告

- **WHEN** 用户请求查看迁移进度
- **THEN** 系统 SHALL 生成包含以下信息的报告：
  - 总页面数和已完成数
  - 各模块的完成情况
  - 当前正在迁移的页面
  - 预计完成时间

#### Scenario: 标记页面迁移完成

- **WHEN** 页面通过所有合规性检查
- **THEN** 系统 SHALL 将页面状态标记为"已完成"
- **THEN** 系统 SHALL 更新模块的完成进度
- **THEN** 系统 SHALL 触发下一个页面的迁移任务
