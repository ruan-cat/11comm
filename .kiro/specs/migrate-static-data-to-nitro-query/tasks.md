# Implementation Plan

## 任务概述

本任务清单用于迁移 100 个三级路由的列表页，从本地假数据迁移到 Nitro 后端 + TanStack Query 体系。

## 任务统计

- **总计三级路由数**: 100 个
- **总计任务数**: 1000 个（每个路由 10 个任务）
- **预计工时**: 约 250 小时（每个路由约 2.5 小时）
- **已完成**: settingManage (10/12), devTeam (8/8), operationTeam (12/12)
- **进行中**: propertyManage (0/68)

## 任务执行规则

### 单页面迁移 10 步流程

每个列表页的迁移必须严格按照以下顺序执行：

1. **Step 1**: 创建类型定义文件（15 分钟）
   - 路径: `apps/type/src/business/{module}/{sub-module}/{page}.ts`
   - 定义 {Page}ListItem、{Page}QueryParams、枚举类型、Options
   - 所有字段使用英文驼峰命名，添加 JSDoc 注释

2. **Step 2**: 创建 Mock 数据文件（10 分钟）
   - 路径: `apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`
   - 导入类型，创建至少 20-50 条测试数据

3. **Step 3**: 创建 Nitro 接口文件（20 分钟）
   - 路径: `apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts`
   - 使用 defineHandler 和 readBody（从 nitro/h3 导入）
   - 使用 filterDataByQuery 工具函数
   - 返回 JsonVO<PageDTO<T>> 格式

4. **Step 4**: 创建前端 API Hook（10 分钟）
   - 路径: `apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`
   - 定义 use{Page}ListQuery Hook
   - 调用通用 useListQuery 模板

5. **Step 5**: 改写列表页（30 分钟）
   - 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`
   - 使用 Query Hook 获取数据
   - 移除本地 test-data 导入
   - 使用 isLoading 控制 loading 状态
   - 监听 data 变化更新 tableData

6. **Step 6**: 删除旧的假数据文件（5 分钟）
   - 删除: `apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts`

7. **Step 7**: 更新表单类型文件（15 分钟）
   - 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.ts`
   - 从 @01s-11comm/type 导入类型
   - 移除本地类型定义

8. **Step 8**: 更新表单组件（15 分钟）
   - 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.vue`
   - 使用类型库的 Options
   - 使用英文字段名

9. **Step 9**: 运行类型检查（5 分钟）
   - 执行: `pnpm typecheck`
   - 修复所有类型报错

10. **Step 10**: 测试验证（15 分钟）
    - 测试列表加载、搜索、分页
    - 测试新增/编辑/删除功能
    - 测试 loading 状态和错误处理

## Phase 1: 基础设施（已完成）✅

- [x] 1.1 初始化 apps/type 类型库
- [x] 1.2 安装 @tanstack/vue-query ^5.62.8
- [x] 1.3 创建 useListQuery 通用模板
- [x] 1.4 创建 filterDataByQuery 工具函数
- [x] 1.5 完成试点页面验证

## Phase 2: settingManage（设置管理）- 12 个三级路由

### 2.1 settingManage.organizeManage.staffInfo（员工信息）✅

- [x] 2.1.1 创建类型定义文件
- [x] 2.1.2 创建 Mock 数据文件
- [x] 2.1.3 创建 Nitro 接口文件
- [x] 2.1.4 创建前端 API Hook
- [x] 2.1.5 改写列表页
- [x] 2.1.6 删除旧的假数据文件
- [x] 2.1.7 更新表单类型文件
- [x] 2.1.8 更新表单组件
- [x] 2.1.9 类型检查通过
- [x] 2.1.10 测试验证完成

### 2.2 settingManage.organizeManage.orgInfo（组织信息）✅

- [x] 2.2.1-2.2.10 全部任务已完成

### 2.3 settingManage.organizeManage.workingSchedule（排班表）✅

- [x] 2.3.1-2.3.10 全部任务已完成

### 2.4 settingManage.organizeManage.schedulingSetting（排班设置）✅

- [x] 2.4.1-2.4.10 全部任务已完成

### 2.5 settingManage.organizeManage.shiftSetting（班次设置）✅

- [x] 2.5.1-2.5.10 全部任务已完成

### 2.6 settingManage.organizeManage.rolePermission（角色权限）✅

- [x] 2.6.1-2.6.10 全部任务已完成

### 2.7 settingManage.organizeManage.dataPermission（数据权限）✅

- [x] 2.7.1-2.7.10 全部任务已完成

### 2.8 settingManage.systemManage.changePassword（修改密码）✅

- [x] 2.8.1-2.8.10 全部任务已完成

### 2.9 settingManage.systemManage.systemConfig（系统配置）✅

- [x] 2.9.1-2.9.10 全部任务已完成

### 2.10 settingManage.systemManage.registerProtocol（注册协议）✅

- [x] 2.10.1-2.10.10 全部任务已完成

### 2.11 settingManage.systemManage.initializeCell（初始化小区）

- [x] 2.11.1 创建类型定义文件
- [x] 2.11.2 创建 Mock 数据文件
- [x] 2.11.3 创建 Nitro 接口文件
- [x] 2.11.4 创建前端 API Hook
- [x] 2.11.5 改写列表页
- [x] 2.11.6 删除旧的假数据文件
- [x] 2.11.7 更新表单类型文件
- [x] 2.11.8 更新表单组件
- [x] 2.11.9 类型检查通过
- [ ] 2.11.10 测试验证

### 2.12 settingManage.systemManage.communityConfiguration（小区配置）✅

- [x] 2.12.1-2.12.10 全部任务已完成

## Phase 3: devTeam（开发团队）- 8 个三级路由 ✅ 全部完成

### 3.1 devTeam.menuManage.catalog（菜单目录）✅

- [x] 3.1.1-3.1.10 全部任务已完成

### 3.2 devTeam.menuManage.group（菜单组）✅

- [x] 3.2.1-3.2.10 全部任务已完成

### 3.3 devTeam.menuManage.item（菜单项）✅

- [x] 3.3.1-3.3.10 全部任务已完成

### 3.4 devTeam.cacheManage.refreshCache（刷新缓存）✅

- [x] 3.4.1-3.4.10 全部任务已完成

### 3.5 devTeam.configManage.type（字典类型）✅

- [x] 3.5.1-3.5.10 全部任务已完成

### 3.6 devTeam.configManage.item（配置项）✅

- [x] 3.6.1-3.6.10 全部任务已完成

### 3.7 devTeam.configManage.dictionary（字典）✅

- [x] 3.7.1-3.7.10 全部任务已完成

### 3.8 devTeam.configManage.center（配置中心）✅

- [x] 3.8.1-3.8.10 全部任务已完成

## Phase 4: operationTeam（运营团队）- 12 个三级路由 ✅ 全部完成

### 4.1-4.12 全部路由已完成迁移

- [x] operationTeam.systemManage.changePassword
- [x] operationTeam.systemManage.systemConfig
- [x] operationTeam.systemManage.registerProtocol
- [x] operationTeam.systemManage.initializeCell
- [x] operationTeam.systemManage.communityConfiguration
- [x] operationTeam.dataManage.communityInformation
- [x] operationTeam.dataManage.propertyManagementCompany
- [x] operationTeam.merchantManage.merchantInfo
- [x] operationTeam.merchantManage.merchantAdmin
- [x] operationTeam.reportConfiguration.reportGroup
- [x] operationTeam.reportConfiguration.reportInfo
- [x] operationTeam.reportConfiguration.reportComponent

## Phase 5: propertyManage（物业管理）- 68 个三级路由

### 5.1 propertyManage.communityManage（社区管理）- 约 15 个路由

#### 5.1.1 propertyManage.communityManage.houseDecoration（房屋装修）

- [ ] 5.1.1.1 创建类型定义文件
  - 路径: `apps/type/src/business/property-manage/community-manage/house-decoration.ts`
  - 定义 HouseDecorationListItem、HouseDecorationQueryParams
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 5.1.1.2 创建 Mock 数据文件
  - 路径: `apps/admin/server/api/property-manage/community-manage/house-decoration/mock-data.ts`
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 5.1.1.3 创建 Nitro 接口文件
  - 路径: `apps/admin/server/api/property-manage/community-manage/house-decoration/list.post.ts`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 5.1.1.4 创建前端 API Hook
  - 路径: `apps/admin/src/api/property-manage/community-manage/house-decoration/index.ts`
  - _Requirements: 4.3, 4.4_

- [ ] 5.1.1.5 改写列表页
  - 路径: `apps/admin/src/pages/property-manage/community-manage/house-decoration/index.vue`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.1.1.6 删除旧的假数据文件
  - 删除: `apps/admin/src/pages/property-manage/community-manage/house-decoration/test-data.ts`
  - _Requirements: 3.1_

- [ ] 5.1.1.7 更新表单类型文件
  - 路径: `apps/admin/src/pages/property-manage/community-manage/house-decoration/components/form.ts`
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 5.1.1.8 更新表单组件
  - 路径: `apps/admin/src/pages/property-manage/community-manage/house-decoration/components/form.vue`
  - _Requirements: 6.4_

- [ ] 5.1.1.9 运行类型检查
  - 执行: `pnpm typecheck`
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5.1.1.10 测试验证
  - 测试所有功能
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

#### 5.1.2 propertyManage.communityManage.buildingSpaceStructureDiagram（楼栋结构图）

- [ ] 5.1.2.1-5.1.2.10 按照 10 步流程执行

#### 5.1.3 propertyManage.communityManage.my（我的）

- [ ] 5.1.3.1-5.1.3.10 按照 10 步流程执行

#### 5.1.4-5.1.15 其他社区管理路由

- [ ] 待补充完整任务清单

### 5.2 propertyManage.housePropertyManage（房产管理）- 约 10 个路由

#### 5.2.1-5.2.10 各房产管理路由

- [ ] 待补充完整任务清单

### 5.3 propertyManage.contractManage（合同管理）- 约 8 个路由

#### 5.3.1-5.3.8 各合同管理路由

- [ ] 待补充完整任务清单

### 5.4 propertyManage.expenseManage（费用管理）- 约 16 个路由

#### 5.4.1-5.4.16 各费用管理路由

- [ ] 待补充完整任务清单

### 5.5 propertyManage.parkingManage（停车管理）- 约 8 个路由

#### 5.5.1-5.5.8 各停车管理路由

- [ ] 待补充完整任务清单

### 5.6 propertyManage.patrolManage（巡检管理）- 约 6 个路由

#### 5.6.1-5.6.6 各巡检管理路由

- [ ] 待补充完整任务清单

### 5.7 propertyManage.repairsManage（报修管理）- 约 5 个路由

#### 5.7.1-5.7.5 各报修管理路由

- [ ] 待补充完整任务清单

## Phase 6: 验证清理

- [ ] 6.1 运行完整类型检查
  - 执行: `pnpm typecheck`
  - 确保无任何类型错误

- [ ] 6.2 功能测试
  - 测试所有迁移后的列表页
  - 验证搜索、分页、新增、编辑、删除功能

- [ ] 6.3 删除旧文件
  - 确认所有 test-data.ts 文件已删除
  - 清理无用的导入和代码

- [ ] 6.4 文档更新
  - 更新 `.claude/agents/make-list-page.md`
  - 编写迁移总结报告
  - 更新 `CLAUDE.md` 项目说明

- [ ] 6.5 OpenSpec 规范验证
  - 执行: `openspec validate migrate-static-data-to-nitro-query --strict`
  - 确保规范文件格式正确

## 主从代理任务划分建议

### 主代理职责

1. 阅读和理解全部任务要求
2. 按业务路径拆分任务（每个子代理负责 2-3 个三级路由）
3. 新建足够数量的子代理（建议至少 4 个并行）
4. 收集子代理反馈（要求子代理编写报告）
5. 验收子代理工作成果
6. 及时更新本任务文件的进度

### 子代理职责

1. 严格按照 10 步流程执行
2. 每次负责 2-3 个三级路由
3. 以报告文件形式反馈结果（路径: `apps/admin/src/docs/reports/`）
4. 确保类型检查通过后再提交

### 任务划分示例

**propertyManage.communityManage 子模块（15 个路由）**:

- 子代理 1: 负责路由 1-3（houseDecoration, buildingSpaceStructureDiagram, my）
- 子代理 2: 负责路由 4-6
- 子代理 3: 负责路由 7-9
- 子代理 4: 负责路由 10-12
- 子代理 5: 负责路由 13-15

## 注意事项

1. **禁止编写脚本**: 不允许编写 Python、TypeScript、JavaScript 或 bash 脚本完成批处理任务
2. **及时更新进度**: 完成任务后立即更新本文件的任务状态
3. **类型检查优先**: 每完成一个路由立即运行类型检查
4. **功能测试必须**: 每完成一个路由必须进行功能测试
5. **报告编写规范**: 子代理必须按照报告编写规范提交工作成果
6. **连续执行**: 不要在完成一个任务后就停下来询问用户，应连续执行多个任务

## 当前状态

- **已完成模块**: settingManage (10/12), devTeam (8/8), operationTeam (12/12)
- **当前模块**: settingManage (剩余 2 个路由待测试验证)
- **下一模块**: propertyManage (68 个路由)
- **总体进度**: 30/100 (30%)
