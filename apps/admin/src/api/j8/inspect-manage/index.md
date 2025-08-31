# J8 - 巡检管理模块

本模块提供了完整的巡检管理功能，包含巡检项目配置、计划制定、任务执行等全流程管理。

## 模块结构

### 1. 巡检明细 (`inspect-detail/`)

- `queryInspectDetailList` - 获取巡检明细列表（条件+分页）

**功能**: 查看巡检执行的详细记录和结果

### 2. 巡检项目选项管理 (`inspect-project-option/`)

- `addInspectProjectOption` - 添加巡检项目选项
- `modifyInspectProjectOption` - 修改巡检项目选项
- `deleteInspectProjectOption` - 删除巡检项目选项

**功能**: 管理巡检项目的配置选项

### 3. 巡检项目管理 (`inspect-project/`)

- `addInspectProject` - 添加巡检项目
- `modifyInspectProject` - 修改巡检项目
- `deleteInspectProject` - 删除巡检项目
- `queryInspectProjectList` - 获取巡检项目列表（条件+分页）
- `queryInspectProjectNameList` - 获取巡检项目名称列表
- `addInspectQuestion` - 增加巡检题目
- `modifyInspectQuestion` - 修改巡检题目
- `deleteInspectQuestion` - 删除巡检题目
- `queryInspectQuestionList` - 获取巡检题目列表（条件+分页）

**功能**: 管理巡检项目和相关的巡检题目

### 4. 巡检计划管理 (`inspect-plan/`)

- `addInspectPlan` - 添加巡检计划
- `modifyInspectPlan` - 修改巡检计划
- `modifyInspectPlanState` - 停用巡检计划
- `queryInspectPlanDetail` - 获取巡检计划详情
- `queryInspectPlanList` - 获取巡检计划列表（条件+分页）
- `deleteInspectPlan` - 删除巡检计划

**功能**: 制定和管理巡检计划，包括计划的创建、修改、启停和删除

### 5. 巡检点管理 (`inspect-point/`)

- `addInspectPoint` - 添加巡检点
- `modifyInspectPoint` - 修改巡检点信息
- `queryInspectPointList` - 获取巡检点列表（条件+分页）
- `deleteInspectPoint` - 删除巡检点
- `querySelectableInspectPointList` - 获取可选巡检点列表（条件+分页）

**功能**: 管理巡检点位，包括点位的添加、修改、删除和查询

### 6. 巡检路线管理 (`inspect-route/`)

- `addInspectRoute` - 添加巡检路线，返回添加成功的 ID
- `modifyInspectRoute` - 修改巡检路线
- `queryInspectRouteNameList` - 获取巡检路线名称列表
- `queryInspectRouteList` - 获取巡检路线列表（条件+分页）
- `queryInspectRoutePointList` - 获取巡检路线巡检点列表（条件+分页）
- `deleteInspectRoute` - 删除巡检路线

**功能**: 管理巡检路线，包括路线的设计、修改和删除

### 7. 巡检路线巡检点管理 (`inspect-route-point/`)

- `addInspectRoutePoint` - 新增巡检路线巡检点
- `modifyInspectRoutePoint` - 修改巡检路线巡检点
- `deleteInspectRoutePoint` - 删除巡检路线巡检点

**功能**: 管理巡检路线中的具体巡检点配置

### 8. 巡检任务管理 (`inspect-task/`)

- `queryInspectTaskDetail` - 获取巡检任务详情
- `queryInspectTaskList` - 获取巡检任务列表（条件+分页）
- `transferInspectTask` - 流转任务

**功能**: 管理巡检任务的执行，包括任务查看和状态流转

## 业务流程

1. **项目配置**: 创建巡检项目 → 添加巡检题目 → 配置项目选项
2. **点位管理**: 添加巡检点 → 设置点位信息
3. **路线设计**: 创建巡检路线 → 添加路线巡检点 → 设置巡检顺序
4. **计划制定**: 创建巡检计划 → 关联路线和人员 → 设置执行周期
5. **任务执行**: 生成巡检任务 → 执行巡检 → 记录巡检结果
6. **结果查看**: 查看巡检明细 → 分析巡检数据

## 技术特点

- **模块化设计**: 每个子功能独立模块，便于维护
- **类型安全**: 完整的 TypeScript 类型定义
- **统一规范**: 遵循项目代码风格和接口规范
- **完整测试**: 每个接口都提供测试用例

## 注意事项

1. 所有接口都使用 `UseAxiosOptionsJsonVO<T>` 作为 options 参数类型
2. 分页接口统一使用 `PageDTO<T>` 返回类型
3. POST/PUT 请求统一使用 `UpType.json` 内容类型
4. 删除操作需要确认相关依赖关系
5. 状态变更操作需要权限验证
