# migrate-static-data-to-nitro-query 任务清单

## 任务概述

本任务清单用于迁移 100 个三级路由的列表页，从本地假数据迁移到 Nitro 后端 + TanStack Query 体系。

## 任务统计

- **总计三级路由数**：100 个
- **总计任务数**：1000 个（每个路由 10 个任务）
- **预计工时**：约 250 小时（每个路由约 2.5 小时）

## 任务分组

### 1. settingManage（设置管理）- 12 个三级路由

#### 1.1 settingManage.organizeManage.staffInfo（员工信息）

**路由路径**：`settingManage.organizeManage.staffInfo`

- [x] Task 1.1.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/staff-info.ts`
- [x] Task 1.1.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/staff-info/mock-data.ts`
- [x] Task 1.1.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/staff-info/list.post.ts`
- [x] Task 1.1.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/staff-info/index.ts`
- [x] Task 1.1.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/staff-info/index.vue`
- [x] Task 1.1.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/staff-info/test-data.ts`
- [x] Task 1.1.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/staff-info/components/form.ts`
- [x] Task 1.1.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/staff-info/components/form.vue`
- [x] Task 1.1.9: 类型检查通过（与本任务相关的文件无错误）
- [x] Task 1.1.10: 测试验证完成

#### 1.2 settingManage.organizeManage.orgInfo（组织信息）

**路由路径**：`settingManage.organizeManage.orgInfo`

- [x] Task 1.2.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/org-info.ts`
- [x] Task 1.2.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/org-info/mock-data.ts`
- [x] Task 1.2.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/org-info/list.post.ts`
- [x] Task 1.2.3.1: 修复 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/org-info/tree.post.ts`
- [x] Task 1.2.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/org-info/index.ts`
- [x] Task 1.2.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/org-info/index.vue`
- [x] Task 1.2.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/org-info/test-data.ts`
- [x] Task 1.2.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/org-info/components/form.ts`
- [x] Task 1.2.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/org-info/components/form.vue`
- [x] Task 1.2.9: 类型检查通过（与本任务相关的文件无错误）
- [x] Task 1.2.10: 测试验证完成

#### 1.3 settingManage.organizeManage.workingSchedule（排班表）✅ **已完成**

**路由路径**：`settingManage.organizeManage.workingSchedule`

- [x] Task 1.3.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/working-schedule.ts` ✅
- [x] Task 1.3.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/working-schedule/mock-data.ts` ✅
- [x] Task 1.3.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/working-schedule/list.post.ts` ✅
- [x] Task 1.3.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/working-schedule/index.ts` ✅
- [x] Task 1.3.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/index.vue` ✅
- [x] Task 1.3.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/test-data.ts` ✅
- [x] Task 1.3.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/components/form.ts` ✅
- [x] Task 1.3.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/components/form.vue` ✅

- [x] Task 1.3.9: 运行类型检查 ✅
- [x] Task 1.3.10: 测试验证 ✅

**完成时间**: 2025-12-22
**子代理ID**: adfb538
**验证报告**: `apps/admin/src/docs/reports/2025-12-22-migrate-static-data-to-nitro-query-working-schedule-validation.md`

#### 1.4 settingManage.organizeManage.schedulingSetting（排班设置）❌ **子代理失败**

**路由路径**：`settingManage.organizeManage.schedulingSetting`

**子代理ID**: ac07378
**错误状态**: "No assistant messages found"
**状态**: 需要重新分配给新的子代理

- [ ] Task 1.4.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/scheduling-setting.ts`
- [ ] Task 1.4.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/scheduling-setting/mock-data.ts`
- [ ] Task 1.4.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/scheduling-setting/list.post.ts`
- [ ] Task 1.4.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/scheduling-setting/index.ts`
- [ ] Task 1.4.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/index.vue`
- [ ] Task 1.4.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/test-data.ts`
- [ ] Task 1.4.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/components/form.ts`
- [ ] Task 1.4.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/components/form.vue`

- [ ] Task 1.4.10: 测试验证

#### 1.5 settingManage.organizeManage.shiftSetting（班次设置）

**路由路径**：`settingManage.organizeManage.shiftSetting`

- [ ] Task 1.5.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/shift-setting.ts`
- [ ] Task 1.5.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/shift-setting/mock-data.ts`
- [ ] Task 1.5.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/shift-setting/list.post.ts`
- [ ] Task 1.5.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/shift-setting/index.ts`
- [ ] Task 1.5.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/index.vue`
- [ ] Task 1.5.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/test-data.ts`
- [ ] Task 1.5.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/components/form.ts`
- [ ] Task 1.5.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/components/form.vue`

- [ ] Task 1.5.10: 测试验证

#### 1.6 settingManage.organizeManage.rolePermission（角色权限）

**路由路径**：`settingManage.organizeManage.rolePermission`

- [ ] Task 1.6.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/role-permission.ts`
- [ ] Task 1.6.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/role-permission/mock-data.ts`
- [ ] Task 1.6.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/role-permission/list.post.ts`
- [ ] Task 1.6.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/role-permission/index.ts`
- [ ] Task 1.6.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/role-permission/index.vue`
- [ ] Task 1.6.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/role-permission/test-data.ts`
- [ ] Task 1.6.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/role-permission/components/form.ts`
- [ ] Task 1.6.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/role-permission/components/form.vue`

- [ ] Task 1.6.10: 测试验证

#### 1.7 settingManage.organizeManage.dataPermission（数据权限）

**路由路径**：`settingManage.organizeManage.dataPermission`

- [ ] Task 1.7.1: 创建类型定义文件 `apps/type/src/business/setting-manage/organize-manage/data-permission.ts`
- [ ] Task 1.7.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/organize-manage/data-permission/mock-data.ts`
- [ ] Task 1.7.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/organize-manage/data-permission/list.post.ts`
- [ ] Task 1.7.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/organize-manage/data-permission/index.ts`
- [ ] Task 1.7.5: 改写列表页 `apps/admin/src/pages/setting-manage/organize-manage/data-permission/index.vue`
- [ ] Task 1.7.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/organize-manage/data-permission/test-data.ts`
- [ ] Task 1.7.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/organize-manage/data-permission/components/form.ts`
- [ ] Task 1.7.8: 更新表单组件 `apps/admin/src/pages/setting-manage/organize-manage/data-permission/components/form.vue`

- [ ] Task 1.7.10: 测试验证

#### 1.8 settingManage.systemManage.changePassword（修改密码）

**路由路径**：`settingManage.systemManage.changePassword`

- [ ] Task 1.8.1: 创建类型定义文件 `apps/type/src/business/setting-manage/system-manage/change-password.ts`
- [ ] Task 1.8.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/system-manage/change-password/mock-data.ts`
- [ ] Task 1.8.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/system-manage/change-password/list.post.ts`
- [ ] Task 1.8.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/system-manage/change-password/index.ts`
- [ ] Task 1.8.5: 改写列表页 `apps/admin/src/pages/setting-manage/system-manage/change-password/index.vue`
- [ ] Task 1.8.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/system-manage/change-password/test-data.ts`
- [ ] Task 1.8.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/system-manage/change-password/components/form.ts`
- [ ] Task 1.8.8: 更新表单组件 `apps/admin/src/pages/setting-manage/system-manage/change-password/components/form.vue`

- [ ] Task 1.8.10: 测试验证

#### 1.9 settingManage.systemManage.systemConfig（系统配置）

**路由路径**：`settingManage.systemManage.systemConfig`

- [ ] Task 1.9.1: 创建类型定义文件 `apps/type/src/business/setting-manage/system-manage/system-config.ts`
- [ ] Task 1.9.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/system-manage/system-config/mock-data.ts`
- [ ] Task 1.9.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/system-manage/system-config/list.post.ts`
- [ ] Task 1.9.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/system-manage/system-config/index.ts`
- [ ] Task 1.9.5: 改写列表页 `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue`
- [ ] Task 1.9.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/system-manage/system-config/test-data.ts`
- [ ] Task 1.9.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/system-manage/system-config/components/form.ts`
- [ ] Task 1.9.8: 更新表单组件 `apps/admin/src/pages/setting-manage/system-manage/system-config/components/form.vue`

- [ ] Task 1.9.10: 测试验证

#### 1.10 settingManage.systemManage.registerProtocol（注册协议）

**路由路径**：`settingManage.systemManage.registerProtocol`

- [x] Task 1.10.1: 创建类型定义文件 `apps/type/src/business/setting-manage/system-manage/register-protocol.ts`
- [x] Task 1.10.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/system-manage/register-protocol/mock-data.ts`
- [x] Task 1.10.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/system-manage/register-protocol/list.post.ts`
- [x] Task 1.10.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/system-manage/register-protocol/index.ts`
- [x] Task 1.10.5: 改写列表页 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/index.vue`
- [x] Task 1.10.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/test-data.ts`（无此文件）
- [x] Task 1.10.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/components/form.ts`（无表单组件）
- [x] Task 1.10.8: 更新表单组件 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/components/form.vue`（无表单组件）
- [x] Task 1.10.9: 类型检查通过（类型项目无错误）
- [x] Task 1.10.10: 测试验证

#### 1.11 settingManage.systemManage.initializeCell（初始化小区）

**路由路径**：`settingManage.systemManage.initializeCell`

- [x] Task 1.11.1: 创建类型定义文件 `apps/type/src/business/setting-manage/system-manage/initialize-cell.ts`
- [x] Task 1.11.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/system-manage/initialize-cell/mock-data.ts`
- [x] Task 1.11.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/system-manage/initialize-cell/list.post.ts`
- [x] Task 1.11.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/system-manage/initialize-cell/index.ts`
- [x] Task 1.11.5: 改写列表页 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/index.vue`
- [x] Task 1.11.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/test-data.ts`
- [x] Task 1.11.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/components/form.ts`
- [x] Task 1.11.8: 更新表单组件 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/components/form.vue`
- [x] Task 1.11.9: 类型检查通过（与本任务相关的文件无错误）
- [ ] Task 1.11.10: 测试验证

#### 1.12 settingManage.systemManage.communityConfiguration（小区配置）

**路由路径**：`settingManage.systemManage.communityConfiguration`

- [ ] Task 1.12.1: 创建类型定义文件 `apps/type/src/business/setting-manage/system-manage/community-configuration.ts`
- [ ] Task 1.12.2: 创建 Mock 数据文件 `apps/admin/server/api/setting-manage/system-manage/community-configuration/mock-data.ts`
- [ ] Task 1.12.3: 创建 Nitro 接口文件 `apps/admin/server/api/setting-manage/system-manage/community-configuration/list.post.ts`
- [ ] Task 1.12.4: 创建前端 API Hook `apps/admin/src/api/setting-manage/system-manage/community-configuration/index.ts`
- [ ] Task 1.12.5: 改写列表页 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/index.vue`
- [ ] Task 1.12.6: 删除旧的假数据文件 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/test-data.ts`
- [ ] Task 1.12.7: 更新表单类型文件 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/components/form.ts`
- [ ] Task 1.12.8: 更新表单组件 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/components/form.vue`

- [ ] Task 1.12.10: 测试验证

### 2. devTeam（开发团队）- 8 个三级路由

#### 2.1 devTeam.menuManage.catalog（菜单目录）

**路由路径**：`devTeam.menuManage.catalog`

- [ ] Task 2.1.1: 创建类型定义文件 `apps/type/src/business/dev-team/menu-manage/catalog.ts`
- [ ] Task 2.1.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/menu-manage/catalog/mock-data.ts`
- [ ] Task 2.1.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/menu-manage/catalog/list.post.ts`
- [ ] Task 2.1.4: 创建前端 API Hook `apps/admin/src/api/dev-team/menu-manage/catalog/index.ts`
- [ ] Task 2.1.5: 改写列表页 `apps/admin/src/pages/dev-team/menu-manage/catalog/index.vue`
- [ ] Task 2.1.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/menu-manage/catalog/test-data.ts`
- [ ] Task 2.1.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/menu-manage/catalog/components/form.ts`
- [ ] Task 2.1.8: 更新表单组件 `apps/admin/src/pages/dev-team/menu-manage/catalog/components/form.vue`

- [ ] Task 2.1.10: 测试验证

#### 2.2 devTeam.menuManage.group（菜单组）

**路由路径**：`devTeam.menuManage.group`

- [ ] Task 2.2.1: 创建类型定义文件 `apps/type/src/business/dev-team/menu-manage/group.ts`
- [ ] Task 2.2.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/menu-manage/group/mock-data.ts`
- [ ] Task 2.2.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/menu-manage/group/list.post.ts`
- [ ] Task 2.2.4: 创建前端 API Hook `apps/admin/src/api/dev-team/menu-manage/group/index.ts`
- [ ] Task 2.2.5: 改写列表页 `apps/admin/src/pages/dev-team/menu-manage/group/index.vue`
- [ ] Task 2.2.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/menu-manage/group/test-data.ts`
- [ ] Task 2.2.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/menu-manage/group/components/form.ts`
- [ ] Task 2.2.8: 更新表单组件 `apps/admin/src/pages/dev-team/menu-manage/group/components/form.vue`

- [ ] Task 2.2.10: 测试验证

#### 2.3 devTeam.menuManage.item（菜单项）

**路由路径**：`devTeam.menuManage.item`

- [ ] Task 2.3.1: 创建类型定义文件 `apps/type/src/business/dev-team/menu-manage/item.ts`
- [ ] Task 2.3.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/menu-manage/item/mock-data.ts`
- [ ] Task 2.3.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/menu-manage/item/list.post.ts`
- [ ] Task 2.3.4: 创建前端 API Hook `apps/admin/src/api/dev-team/menu-manage/item/index.ts`
- [ ] Task 2.3.5: 改写列表页 `apps/admin/src/pages/dev-team/menu-manage/item/index.vue`
- [ ] Task 2.3.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/menu-manage/item/test-data.ts`
- [ ] Task 2.3.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/menu-manage/item/components/form.ts`
- [ ] Task 2.3.8: 更新表单组件 `apps/admin/src/pages/dev-team/menu-manage/item/components/form.vue`

- [ ] Task 2.3.10: 测试验证

#### 2.4 devTeam.cacheManage.refreshCache（刷新缓存）

**路由路径**：`devTeam.cacheManage.refreshCache`

- [ ] Task 2.4.1: 创建类型定义文件 `apps/type/src/business/dev-team/cache-manage/refresh-cache.ts`
- [ ] Task 2.4.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/cache-manage/refresh-cache/mock-data.ts`
- [ ] Task 2.4.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/cache-manage/refresh-cache/list.post.ts`
- [ ] Task 2.4.4: 创建前端 API Hook `apps/admin/src/api/dev-team/cache-manage/refresh-cache/index.ts`
- [ ] Task 2.4.5: 改写列表页 `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/index.vue`
- [ ] Task 2.4.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/test-data.ts`
- [ ] Task 2.4.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/components/form.ts`
- [ ] Task 2.4.8: 更新表单组件 `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/components/form.vue`

- [ ] Task 2.4.10: 测试验证

#### 2.5 devTeam.configManage.type（字典类型）

**路由路径**：`devTeam.configManage.type`

- [ ] Task 2.5.1: 创建类型定义文件 `apps/type/src/business/dev-team/config-manage/type.ts`
- [ ] Task 2.5.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/config-manage/type/mock-data.ts`
- [ ] Task 2.5.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/config-manage/type/list.post.ts`
- [ ] Task 2.5.4: 创建前端 API Hook `apps/admin/src/api/dev-team/config-manage/type/index.ts`
- [ ] Task 2.5.5: 改写列表页 `apps/admin/src/pages/dev-team/config-manage/type/index.vue`
- [ ] Task 2.5.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/config-manage/type/test-data.ts`
- [ ] Task 2.5.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/config-manage/type/components/form.ts`
- [ ] Task 2.5.8: 更新表单组件 `apps/admin/src/pages/dev-team/config-manage/type/components/form.vue`

- [ ] Task 2.5.10: 测试验证

#### 2.6 devTeam.configManage.item（配置项）

**路由路径**：`devTeam.configManage.item`

- [ ] Task 2.6.1: 创建类型定义文件 `apps/type/src/business/dev-team/config-manage/item.ts`
- [ ] Task 2.6.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/config-manage/item/mock-data.ts`
- [ ] Task 2.6.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/config-manage/item/list.post.ts`
- [ ] Task 2.6.4: 创建前端 API Hook `apps/admin/src/api/dev-team/config-manage/item/index.ts`
- [ ] Task 2.6.5: 改写列表页 `apps/admin/src/pages/dev-team/config-manage/item/index.vue`
- [ ] Task 2.6.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/config-manage/item/test-data.ts`
- [ ] Task 2.6.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/config-manage/item/components/form.ts`
- [ ] Task 2.6.8: 更新表单组件 `apps/admin/src/pages/dev-team/config-manage/item/components/form.vue`

- [ ] Task 2.6.10: 测试验证

#### 2.7 devTeam.configManage.dictionary（字典）

**路由路径**：`devTeam.configManage.dictionary`

- [ ] Task 2.7.1: 创建类型定义文件 `apps/type/src/business/dev-team/config-manage/dictionary.ts`
- [ ] Task 2.7.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/config-manage/dictionary/mock-data.ts`
- [ ] Task 2.7.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/config-manage/dictionary/list.post.ts`
- [ ] Task 2.7.4: 创建前端 API Hook `apps/admin/src/api/dev-team/config-manage/dictionary/index.ts`
- [ ] Task 2.7.5: 改写列表页 `apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue`
- [ ] Task 2.7.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/config-manage/dictionary/test-data.ts`
- [ ] Task 2.7.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/config-manage/dictionary/components/form.ts`
- [ ] Task 2.7.8: 更新表单组件 `apps/admin/src/pages/dev-team/config-manage/dictionary/components/form.vue`

- [ ] Task 2.7.10: 测试验证

#### 2.8 devTeam.configManage.center（配置中心）

**路由路径**：`devTeam.configManage.center`

- [ ] Task 2.8.1: 创建类型定义文件 `apps/type/src/business/dev-team/config-manage/center.ts`
- [ ] Task 2.8.2: 创建 Mock 数据文件 `apps/admin/server/api/dev-team/config-manage/center/mock-data.ts`
- [ ] Task 2.8.3: 创建 Nitro 接口文件 `apps/admin/server/api/dev-team/config-manage/center/list.post.ts`
- [ ] Task 2.8.4: 创建前端 API Hook `apps/admin/src/api/dev-team/config-manage/center/index.ts`
- [ ] Task 2.8.5: 改写列表页 `apps/admin/src/pages/dev-team/config-manage/center/index.vue`
- [ ] Task 2.8.6: 删除旧的假数据文件 `apps/admin/src/pages/dev-team/config-manage/center/test-data.ts`
- [ ] Task 2.8.7: 更新表单类型文件 `apps/admin/src/pages/dev-team/config-manage/center/components/form.ts`
- [ ] Task 2.8.8: 更新表单组件 `apps/admin/src/pages/dev-team/config-manage/center/components/form.vue`

- [ ] Task 2.8.10: 测试验证

### 3. operationTeam（运营团队）- 12 个三级路由

#### 3.1 operationTeam.systemManage.changePassword（修改密码）

**路由路径**：`operationTeam.systemManage.changePassword`

- [ ] Task 3.1.1: 创建类型定义文件 `apps/type/src/business/operation-team/system-manage/change-password.ts`
- [ ] Task 3.1.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/system-manage/change-password/mock-data.ts`
- [ ] Task 3.1.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/system-manage/change-password/list.post.ts`
- [ ] Task 3.1.4: 创建前端 API Hook `apps/admin/src/api/operation-team/system-manage/change-password/index.ts`
- [ ] Task 3.1.5: 改写列表页 `apps/admin/src/pages/operation-team/system-manage/change-password/index.vue`
- [ ] Task 3.1.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/system-manage/change-password/test-data.ts`
- [ ] Task 3.1.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/system-manage/change-password/components/form.ts`
- [ ] Task 3.1.8: 更新表单组件 `apps/admin/src/pages/operation-team/system-manage/change-password/components/form.vue`

- [ ] Task 3.1.10: 测试验证

#### 3.2 operationTeam.systemManage.systemConfig（系统配置）

**路由路径**：`operationTeam.systemManage.systemConfig`

- [ ] Task 3.2.1: 创建类型定义文件 `apps/type/src/business/operation-team/system-manage/system-config.ts`
- [ ] Task 3.2.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/system-manage/system-config/mock-data.ts`
- [ ] Task 3.2.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/system-manage/system-config/list.post.ts`
- [ ] Task 3.2.4: 创建前端 API Hook `apps/admin/src/api/operation-team/system-manage/system-config/index.ts`
- [ ] Task 3.2.5: 改写列表页 `apps/admin/src/pages/operation-team/system-manage/system-config/index.vue`
- [ ] Task 3.2.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/system-manage/system-config/test-data.ts`
- [ ] Task 3.2.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/system-manage/system-config/components/form.ts`
- [ ] Task 3.2.8: 更新表单组件 `apps/admin/src/pages/operation-team/system-manage/system-config/components/form.vue`

- [ ] Task 3.2.10: 测试验证

#### 3.3 operationTeam.systemManage.registerProtocol（注册协议）

**路由路径**：`operationTeam.systemManage.registerProtocol`

- [ ] Task 3.3.1: 创建类型定义文件 `apps/type/src/business/operation-team/system-manage/register-protocol.ts`
- [ ] Task 3.3.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/system-manage/register-protocol/mock-data.ts`
- [ ] Task 3.3.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/system-manage/register-protocol/list.post.ts`
- [ ] Task 3.3.4: 创建前端 API Hook `apps/admin/src/api/operation-team/system-manage/register-protocol/index.ts`
- [ ] Task 3.3.5: 改写列表页 `apps/admin/src/pages/operation-team/system-manage/register-protocol/index.vue`
- [ ] Task 3.3.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/system-manage/register-protocol/test-data.ts`
- [ ] Task 3.3.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/system-manage/register-protocol/components/form.ts`
- [ ] Task 3.3.8: 更新表单组件 `apps/admin/src/pages/operation-team/system-manage/register-protocol/components/form.vue`

- [ ] Task 3.3.10: 测试验证

#### 3.4 operationTeam.systemManage.initializeCell（初始化小区）

**路由路径**：`operationTeam.systemManage.initializeCell`

- [ ] Task 3.4.1: 创建类型定义文件 `apps/type/src/business/operation-team/system-manage/initialize-cell.ts`
- [ ] Task 3.4.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/system-manage/initialize-cell/mock-data.ts`
- [ ] Task 3.4.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/system-manage/initialize-cell/list.post.ts`
- [ ] Task 3.4.4: 创建前端 API Hook `apps/admin/src/api/operation-team/system-manage/initialize-cell/index.ts`
- [ ] Task 3.4.5: 改写列表页 `apps/admin/src/pages/operation-team/system-manage/initialize-cell/index.vue`
- [ ] Task 3.4.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/system-manage/initialize-cell/test-data.ts`
- [ ] Task 3.4.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/system-manage/initialize-cell/components/form.ts`
- [ ] Task 3.4.8: 更新表单组件 `apps/admin/src/pages/operation-team/system-manage/initialize-cell/components/form.vue`

- [ ] Task 3.4.10: 测试验证

#### 3.5 operationTeam.systemManage.communityConfiguration（小区配置）

**路由路径**：`operationTeam.systemManage.communityConfiguration`

- [ ] Task 3.5.1: 创建类型定义文件 `apps/type/src/business/operation-team/system-manage/community-configuration.ts`
- [ ] Task 3.5.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/system-manage/community-configuration/mock-data.ts`
- [ ] Task 3.5.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/system-manage/community-configuration/list.post.ts`
- [ ] Task 3.5.4: 创建前端 API Hook `apps/admin/src/api/operation-team/system-manage/community-configuration/index.ts`
- [ ] Task 3.5.5: 改写列表页 `apps/admin/src/pages/operation-team/system-manage/community-configuration/index.vue`
- [ ] Task 3.5.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/system-manage/community-configuration/test-data.ts`
- [ ] Task 3.5.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/system-manage/community-configuration/components/form.ts`
- [ ] Task 3.5.8: 更新表单组件 `apps/admin/src/pages/operation-team/system-manage/community-configuration/components/form.vue`

- [ ] Task 3.5.10: 测试验证

#### 3.6 operationTeam.dataManage.communityInformation（小区信息）

**路由路径**：`operationTeam.dataManage.communityInformation`

- [ ] Task 3.6.1: 创建类型定义文件 `apps/type/src/business/operation-team/data-manage/community-information.ts`
- [ ] Task 3.6.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/data-manage/community-information/mock-data.ts`
- [ ] Task 3.6.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/data-manage/community-information/list.post.ts`
- [ ] Task 3.6.4: 创建前端 API Hook `apps/admin/src/api/operation-team/data-manage/community-information/index.ts`
- [ ] Task 3.6.5: 改写列表页 `apps/admin/src/pages/operation-team/data-manage/community-information/index.vue`
- [ ] Task 3.6.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/data-manage/community-information/test-data.ts`
- [ ] Task 3.6.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/data-manage/community-information/components/form.ts`
- [ ] Task 3.6.8: 更新表单组件 `apps/admin/src/pages/operation-team/data-manage/community-information/components/form.vue`

- [ ] Task 3.6.10: 测试验证

#### 3.7 operationTeam.dataManage.propertyManagementCompany（物业公司）

**路由路径**：`operationTeam.dataManage.propertyManagementCompany`

- [ ] Task 3.7.1: 创建类型定义文件 `apps/type/src/business/operation-team/data-manage/property-management-company.ts`
- [ ] Task 3.7.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/data-manage/property-management-company/mock-data.ts`
- [ ] Task 3.7.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/data-manage/property-management-company/list.post.ts`
- [ ] Task 3.7.4: 创建前端 API Hook `apps/admin/src/api/operation-team/data-manage/property-management-company/index.ts`
- [ ] Task 3.7.5: 改写列表页 `apps/admin/src/pages/operation-team/data-manage/property-management-company/index.vue`
- [ ] Task 3.7.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/data-manage/property-management-company/test-data.ts`
- [ ] Task 3.7.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/data-manage/property-management-company/components/form.ts`
- [ ] Task 3.7.8: 更新表单组件 `apps/admin/src/pages/operation-team/data-manage/property-management-company/components/form.vue`

- [ ] Task 3.7.10: 测试验证

#### 3.8 operationTeam.merchantManage.merchantInfo（商户信息）

**路由路径**：`operationTeam.merchantManage.merchantInfo`

- [ ] Task 3.8.1: 创建类型定义文件 `apps/type/src/business/operation-team/merchant-manage/merchant-info.ts`
- [ ] Task 3.8.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/merchant-manage/merchant-info/mock-data.ts`
- [ ] Task 3.8.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/merchant-manage/merchant-info/list.post.ts`
- [ ] Task 3.8.4: 创建前端 API Hook `apps/admin/src/api/operation-team/merchant-manage/merchant-info/index.ts`
- [ ] Task 3.8.5: 改写列表页 `apps/admin/src/pages/operation-team/merchant-manage/merchant-info/index.vue`
- [ ] Task 3.8.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-info/test-data.ts`
- [ ] Task 3.8.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-info/components/form.ts`
- [ ] Task 3.8.8: 更新表单组件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-info/components/form.vue`

- [ ] Task 3.8.10: 测试验证

#### 3.9 operationTeam.merchantManage.merchantAdmin（商户管理员）

**路由路径**：`operationTeam.merchantManage.merchantAdmin`

- [ ] Task 3.9.1: 创建类型定义文件 `apps/type/src/business/operation-team/merchant-manage/merchant-admin.ts`
- [ ] Task 3.9.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/merchant-manage/merchant-admin/mock-data.ts`
- [ ] Task 3.9.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/merchant-manage/merchant-admin/list.post.ts`
- [ ] Task 3.9.4: 创建前端 API Hook `apps/admin/src/api/operation-team/merchant-manage/merchant-admin/index.ts`
- [ ] Task 3.9.5: 改写列表页 `apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/index.vue`
- [ ] Task 3.9.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/test-data.ts`
- [ ] Task 3.9.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/components/form.ts`
- [ ] Task 3.9.8: 更新表单组件 `apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/components/form.vue`

- [ ] Task 3.9.10: 测试验证

#### 3.10 operationTeam.reportConfiguration.reportGroup（报表组）

**路由路径**：`operationTeam.reportConfiguration.reportGroup`

- [ ] Task 3.10.1: 创建类型定义文件 `apps/type/src/business/operation-team/report-configuration/report-group.ts`
- [ ] Task 3.10.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/report-configuration/report-group/mock-data.ts`
- [ ] Task 3.10.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/report-configuration/report-group/list.post.ts`
- [ ] Task 3.10.4: 创建前端 API Hook `apps/admin/src/api/operation-team/report-configuration/report-group/index.ts`
- [ ] Task 3.10.5: 改写列表页 `apps/admin/src/pages/operation-team/report-configuration/report-group/index.vue`
- [ ] Task 3.10.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/report-configuration/report-group/test-data.ts`
- [ ] Task 3.10.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/report-configuration/report-group/components/form.ts`
- [ ] Task 3.10.8: 更新表单组件 `apps/admin/src/pages/operation-team/report-configuration/report-group/components/form.vue`

- [ ] Task 3.10.10: 测试验证

#### 3.11 operationTeam.reportConfiguration.reportInfo（报表信息）

**路由路径**：`operationTeam.reportConfiguration.reportInfo`

- [ ] Task 3.11.1: 创建类型定义文件 `apps/type/src/business/operation-team/report-configuration/report-info.ts`
- [ ] Task 3.11.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/report-configuration/report-info/mock-data.ts`
- [ ] Task 3.11.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/report-configuration/report-info/list.post.ts`
- [ ] Task 3.11.4: 创建前端 API Hook `apps/admin/src/api/operation-team/report-configuration/report-info/index.ts`
- [ ] Task 3.11.5: 改写列表页 `apps/admin/src/pages/operation-team/report-configuration/report-info/index.vue`
- [ ] Task 3.11.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/report-configuration/report-info/test-data.ts`
- [ ] Task 3.11.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/report-configuration/report-info/components/form.ts`
- [ ] Task 3.11.8: 更新表单组件 `apps/admin/src/pages/operation-team/report-configuration/report-info/components/form.vue`

- [ ] Task 3.11.10: 测试验证

#### 3.12 operationTeam.reportConfiguration.reportComponent（报表组件）

**路由路径**：`operationTeam.reportConfiguration.reportComponent`

- [ ] Task 3.12.1: 创建类型定义文件 `apps/type/src/business/operation-team/report-configuration/report-component.ts`
- [ ] Task 3.12.2: 创建 Mock 数据文件 `apps/admin/server/api/operation-team/report-configuration/report-component/mock-data.ts`
- [ ] Task 3.12.3: 创建 Nitro 接口文件 `apps/admin/server/api/operation-team/report-configuration/report-component/list.post.ts`
- [ ] Task 3.12.4: 创建前端 API Hook `apps/admin/src/api/operation-team/report-configuration/report-component/index.ts`
- [ ] Task 3.12.5: 改写列表页 `apps/admin/src/pages/operation-team/report-configuration/report-component/index.vue`
- [ ] Task 3.12.6: 删除旧的假数据文件 `apps/admin/src/pages/operation-team/report-configuration/report-component/test-data.ts`
- [ ] Task 3.12.7: 更新表单类型文件 `apps/admin/src/pages/operation-team/report-configuration/report-component/components/form.ts`
- [ ] Task 3.12.8: 更新表单组件 `apps/admin/src/pages/operation-team/report-configuration/report-component/components/form.vue`

- [ ] Task 3.12.10: 测试验证

### 4. propertyManage（物业管理）- 68 个三级路由

#### 4.1 propertyManage.communityManage.houseDecoration（房屋装修）

**路由路径**：`propertyManage.communityManage.houseDecoration`

- [ ] Task 4.1.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/house-decoration.ts`
- [ ] Task 4.1.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/house-decoration/mock-data.ts`
- [ ] Task 4.1.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/house-decoration/list.post.ts`
- [ ] Task 4.1.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/house-decoration/index.ts`
- [ ] Task 4.1.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/house-decoration/index.vue`
- [ ] Task 4.1.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/house-decoration/test-data.ts`
- [ ] Task 4.1.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/house-decoration/components/form.ts`
- [ ] Task 4.1.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/house-decoration/components/form.vue`

- [ ] Task 4.1.10: 测试验证

#### 4.2 propertyManage.communityManage.buildingSpaceStructureDiagram（楼栋结构图）

**路由路径**：`propertyManage.communityManage.buildingSpaceStructureDiagram`

- [ ] Task 4.2.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/building-space-structure-diagram.ts`
- [ ] Task 4.2.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/building-space-structure-diagram/mock-data.ts`
- [ ] Task 4.2.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/building-space-structure-diagram/list.post.ts`
- [ ] Task 4.2.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/building-space-structure-diagram/index.ts`
- [ ] Task 4.2.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram/index.vue`
- [ ] Task 4.2.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram/test-data.ts`
- [ ] Task 4.2.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram/components/form.ts`
- [ ] Task 4.2.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram/components/form.vue`

- [ ] Task 4.2.10: 测试验证

#### 4.3 propertyManage.communityManage.notice（小区公示）

**路由路径**：`propertyManage.communityManage.notice`

- [ ] Task 4.3.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/notice.ts`
- [ ] Task 4.3.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/notice/mock-data.ts`
- [ ] Task 4.3.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/notice/list.post.ts`
- [ ] Task 4.3.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/notice/index.ts`
- [ ] Task 4.3.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/notice/index.vue`
- [ ] Task 4.3.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/notice/test-data.ts`
- [ ] Task 4.3.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/notice/components/form.ts`
- [ ] Task 4.3.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/notice/components/form.vue`

- [ ] Task 4.3.10: 测试验证

#### 4.4 propertyManage.communityManage.propertyRegister（产权登记）

**路由路径**：`propertyManage.communityManage.propertyRegister`

- [ ] Task 4.4.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/property-register.ts`
- [ ] Task 4.4.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/property-register/mock-data.ts`
- [ ] Task 4.4.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/property-register/list.post.ts`
- [ ] Task 4.4.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/property-register/index.ts`
- [ ] Task 4.4.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/property-register/index.vue`
- [ ] Task 4.4.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/property-register/test-data.ts`
- [ ] Task 4.4.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/property-register/components/form.ts`
- [ ] Task 4.4.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/property-register/components/form.vue`

- [ ] Task 4.4.10: 测试验证

#### 4.5 propertyManage.communityManage.handingBusiness（业务受理）

**路由路径**：`propertyManage.communityManage.handingBusiness`

- [ ] Task 4.5.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/handing-business.ts`
- [ ] Task 4.5.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/handing-business/mock-data.ts`
- [ ] Task 4.5.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/handing-business/list.post.ts`
- [ ] Task 4.5.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/handing-business/index.ts`
- [ ] Task 4.5.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/handing-business/index.vue`
- [ ] Task 4.5.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/handing-business/test-data.ts`
- [ ] Task 4.5.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/handing-business/components/form.ts`
- [ ] Task 4.5.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/handing-business/components/form.vue`

- [ ] Task 4.5.10: 测试验证

#### 4.6 propertyManage.communityManage.my（我的）

**路由路径**：`propertyManage.communityManage.my`

- [ ] Task 4.6.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/my.ts`
- [ ] Task 4.6.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/my/mock-data.ts` (扩展至 30 条)
- [ ] Task 4.6.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/my/list.post.ts` (修复为标准格式)
- [ ] Task 4.6.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/my/index.ts`
- [ ] Task 4.6.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/my/index.vue`
- [ ] Task 4.6.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/my/test-data.ts` (已不存在)
- [ ] Task 4.6.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/my/components/form.ts`
- [ ] Task 4.6.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/my/components/form.vue`
      (my 页面类型检查通过)
- [ ] Task 4.6.10: 测试验证

#### 4.7 propertyManage.communityManage.parkingSpaceStructureDiagram（车位结构图）

**路由路径**：`propertyManage.communityManage.parkingSpaceStructureDiagram`

- [ ] Task 4.7.1: 创建类型定义文件 `apps/type/src/business/property-manage/community-manage/parking-space-structure-diagram.ts`
- [ ] Task 4.7.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/community-manage/parking-space-structure-diagram/mock-data.ts`
- [ ] Task 4.7.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/community-manage/parking-space-structure-diagram/list.post.ts`
- [ ] Task 4.7.4: 创建前端 API Hook `apps/admin/src/api/property-manage/community-manage/parking-space-structure-diagram/index.ts`
- [ ] Task 4.7.5: 改写列表页 `apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/index.vue`
- [ ] Task 4.7.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/test-data.ts`
- [ ] Task 4.7.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.ts`
- [ ] Task 4.7.8: 更新表单组件 `apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue`

- [ ] Task 4.7.10: 测试验证

#### 4.8 propertyManage.contractManage.change（合同变更）

**路由路径**：`propertyManage.contractManage.change`

- [ ] Task 4.8.1: 创建类型定义文件 `apps/type/src/business/property-manage/contract-manage/change.ts`
- [ ] Task 4.8.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/contract-manage/change/mock-data.ts`
- [ ] Task 4.8.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/contract-manage/change/list.post.ts`
- [ ] Task 4.8.4: 创建前端 API Hook `apps/admin/src/api/property-manage/contract-manage/change/index.ts`
- [ ] Task 4.8.5: 改写列表页 `apps/admin/src/pages/property-manage/contract-manage/change/index.vue`
- [ ] Task 4.8.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/contract-manage/change/test-data.ts`
- [ ] Task 4.8.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/contract-manage/change/components/form.ts`
- [ ] Task 4.8.8: 更新表单组件 `apps/admin/src/pages/property-manage/contract-manage/change/components/form.vue`

- [ ] Task 4.8.10: 测试验证

#### 4.9 propertyManage.contractManage.draftContract（起草合同）

**路由路径**：`propertyManage.contractManage.draftContract`

- [ ] Task 4.9.1: 创建类型定义文件 `apps/type/src/business/property-manage/contract-manage/draft-contract.ts`
- [ ] Task 4.9.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/contract-manage/draft-contract/mock-data.ts`
- [ ] Task 4.9.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/contract-manage/draft-contract/list.post.ts`
- [ ] Task 4.9.4: 创建前端 API Hook `apps/admin/src/api/property-manage/contract-manage/draft-contract/index.ts`
- [ ] Task 4.9.5: 改写列表页 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/index.vue`
- [ ] Task 4.9.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/test-data.ts`
- [ ] Task 4.9.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.ts`
- [ ] Task 4.9.8: 更新表单组件 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.vue`

- [ ] Task 4.9.10: 测试验证

#### 4.10 propertyManage.contractManage.expire（到期合同）

**路由路径**：`propertyManage.contractManage.expire`

- [ ] Task 4.10.1: 创建类型定义文件 `apps/type/src/business/property-manage/contract-manage/expire.ts`
- [ ] Task 4.10.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/contract-manage/expire/mock-data.ts`
- [ ] Task 4.10.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/contract-manage/expire/list.post.ts`
- [ ] Task 4.10.4: 创建前端 API Hook `apps/admin/src/api/property-manage/contract-manage/expire/index.ts`
- [ ] Task 4.10.5: 改写列表页 `apps/admin/src/pages/property-manage/contract-manage/expire/index.vue`
- [ ] Task 4.10.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/contract-manage/expire/test-data.ts`
- [ ] Task 4.10.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/contract-manage/expire/components/form.ts`
- [ ] Task 4.10.8: 更新表单组件 `apps/admin/src/pages/property-manage/contract-manage/expire/components/form.vue`

- [ ] Task 4.10.10: 测试验证

#### 4.11 propertyManage.contractManage.firstParty（合同甲方）

**路由路径**：`propertyManage.contractManage.firstParty`

- [ ] Task 4.11.1: 创建类型定义文件 `apps/type/src/business/property-manage/contract-manage/first-party.ts`
- [ ] Task 4.11.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/contract-manage/first-party/mock-data.ts`
- [ ] Task 4.11.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/contract-manage/first-party/list.post.ts`
- [ ] Task 4.11.4: 创建前端 API Hook `apps/admin/src/api/property-manage/contract-manage/first-party/index.ts`
- [ ] Task 4.11.5: 改写列表页 `apps/admin/src/pages/property-manage/contract-manage/first-party/index.vue`
- [ ] Task 4.11.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/contract-manage/first-party/test-data.ts`
- [ ] Task 4.11.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/contract-manage/first-party/components/form.ts`
- [ ] Task 4.11.8: 更新表单组件 `apps/admin/src/pages/property-manage/contract-manage/first-party/components/form.vue`

- [ ] Task 4.11.10: 测试验证

#### 4.12 propertyManage.contractManage.type（合同类型）

**路由路径**：`propertyManage.contractManage.type`

- [ ] Task 4.12.1: 创建类型定义文件 `apps/type/src/business/property-manage/contract-manage/type.ts`
- [ ] Task 4.12.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/contract-manage/type/mock-data.ts`
- [ ] Task 4.12.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/contract-manage/type/list.post.ts`
- [ ] Task 4.12.4: 创建前端 API Hook `apps/admin/src/api/property-manage/contract-manage/type/index.ts`
- [ ] Task 4.12.5: 改写列表页 `apps/admin/src/pages/property-manage/contract-manage/type/index.vue`
- [ ] Task 4.12.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/contract-manage/type/test-data.ts`
- [ ] Task 4.12.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/contract-manage/type/components/form.ts`
- [ ] Task 4.12.8: 更新表单组件 `apps/admin/src/pages/property-manage/contract-manage/type/components/form.vue`

- [ ] Task 4.12.10: 测试验证

#### 4.13 propertyManage.expenseManage.waterAndElectricityMeterReading（水电抄表）

**路由路径**：`propertyManage.expenseManage.waterAndElectricityMeterReading`

- [ ] Task 4.13.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/water-and-electricity-meter-reading.ts`
- [ ] Task 4.13.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data.ts`
- [ ] Task 4.13.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts`
- [ ] Task 4.13.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/water-and-electricity-meter-reading/index.ts`
- [ ] Task 4.13.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/index.vue`
- [ ] Task 4.13.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/test-data.ts`
- [ ] Task 4.13.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/components/form.ts`
- [ ] Task 4.13.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/components/form.vue`

- [ ] Task 4.13.10: 测试验证

#### 4.14 propertyManage.expenseManage.vehicleCharge（车辆收费）

**路由路径**：`propertyManage.expenseManage.vehicleCharge`

- [ ] Task 4.14.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/vehicle-charge.ts`
- [ ] Task 4.14.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/vehicle-charge/mock-data.ts`
- [ ] Task 4.14.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/vehicle-charge/list.post.ts`
- [ ] Task 4.14.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/vehicle-charge/index.ts`
- [ ] Task 4.14.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/vehicle-charge/index.vue`
- [ ] Task 4.14.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/vehicle-charge/test-data.ts`
- [ ] Task 4.14.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/vehicle-charge/components/form.ts`
- [ ] Task 4.14.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/vehicle-charge/components/form.vue`

- [ ] Task 4.14.10: 测试验证

#### 4.15 propertyManage.expenseManage.reminderForOverduePayments（欠费催缴）

**路由路径**：`propertyManage.expenseManage.reminderForOverduePayments`

- [ ] Task 4.15.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/reminder-for-overdue-payments.ts`
- [ ] Task 4.15.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/reminder-for-overdue-payments/mock-data.ts`
- [ ] Task 4.15.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/reminder-for-overdue-payments/list.post.ts`
- [ ] Task 4.15.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/reminder-for-overdue-payments/index.ts`
- [ ] Task 4.15.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/reminder-for-overdue-payments/index.vue`
- [ ] Task 4.15.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/reminder-for-overdue-payments/test-data.ts`
- [ ] Task 4.15.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/reminder-for-overdue-payments/components/form.ts`
- [ ] Task 4.15.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/reminder-for-overdue-payments/components/form.vue`

- [ ] Task 4.15.10: 测试验证

#### 4.16 propertyManage.expenseManage.reprintVoucher（补打收据）

**路由路径**：`propertyManage.expenseManage.reprintVoucher`

- [ ] Task 4.16.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/reprint-voucher.ts`
- [ ] Task 4.16.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/reprint-voucher/mock-data.ts`
- [ ] Task 4.16.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/reprint-voucher/list.post.ts`
- [ ] Task 4.16.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/reprint-voucher/index.ts`
- [ ] Task 4.16.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/reprint-voucher/index.vue`
- [ ] Task 4.16.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/reprint-voucher/test-data.ts`
- [ ] Task 4.16.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/reprint-voucher/components/form.ts`
- [ ] Task 4.16.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/reprint-voucher/components/form.vue`

- [ ] Task 4.16.10: 测试验证

#### 4.17 propertyManage.expenseManage.overduePaymentInformation（欠费信息）

**路由路径**：`propertyManage.expenseManage.overduePaymentInformation`

- [ ] Task 4.17.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/overdue-payment-information.ts`
- [ ] Task 4.17.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/overdue-payment-information/mock-data.ts`
- [ ] Task 4.17.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/overdue-payment-information/list.post.ts`
- [ ] Task 4.17.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/overdue-payment-information/index.ts`
- [ ] Task 4.17.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/overdue-payment-information/index.vue`
- [ ] Task 4.17.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/overdue-payment-information/test-data.ts`
- [ ] Task 4.17.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/overdue-payment-information/components/form.ts`
- [ ] Task 4.17.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/overdue-payment-information/components/form.vue`

- [ ] Task 4.17.10: 测试验证

#### 4.18 propertyManage.expenseManage.paymentReview（缴费审核）

**路由路径**：`propertyManage.expenseManage.paymentReview`

- [ ] Task 4.18.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/payment-review.ts`
- [ ] Task 4.18.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/payment-review/mock-data.ts`
- [ ] Task 4.18.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/payment-review/list.post.ts`
- [ ] Task 4.18.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/payment-review/index.ts`
- [ ] Task 4.18.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/payment-review/index.vue`
- [ ] Task 4.18.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/payment-review/test-data.ts`
- [ ] Task 4.18.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/payment-review/components/form.ts`
- [ ] Task 4.18.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/payment-review/components/form.vue`

- [ ] Task 4.18.10: 测试验证

#### 4.19 propertyManage.expenseManage.refundReview（退费审核）

**路由路径**：`propertyManage.expenseManage.refundReview`

- [ ] Task 4.19.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/refund-review.ts`
- [ ] Task 4.19.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/refund-review/mock-data.ts`
- [ ] Task 4.19.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/refund-review/list.post.ts`
- [ ] Task 4.19.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/refund-review/index.ts`
- [ ] Task 4.19.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/refund-review/index.vue`
- [ ] Task 4.19.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/refund-review/test-data.ts`
- [ ] Task 4.19.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/refund-review/components/form.ts`
- [ ] Task 4.19.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/refund-review/components/form.vue`

- [ ] Task 4.19.10: 测试验证

#### 4.20 propertyManage.expenseManage.houseCharge（房屋收费）

**路由路径**：`propertyManage.expenseManage.houseCharge`

- [ ] Task 4.20.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- [ ] Task 4.20.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/house-charge/mock-data.ts`
- [ ] Task 4.20.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/house-charge/list.post.ts`
- [ ] Task 4.20.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
- [ ] Task 4.20.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/house-charge/index.vue`
- [ ] Task 4.20.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/house-charge/test-data.ts`
- [ ] Task 4.20.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/house-charge/components/form.ts`
- [ ] Task 4.20.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/house-charge/components/form.vue`

- [ ] Task 4.20.10: 测试验证

#### 4.21 propertyManage.expenseManage.meterReadingType（抄表类型）

**路由路径**：`propertyManage.expenseManage.meterReadingType`

- [ ] Task 4.21.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/meter-reading-type.ts`
- [ ] Task 4.21.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/meter-reading-type/mock-data.ts`
- [ ] Task 4.21.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/meter-reading-type/list.post.ts`
- [ ] Task 4.21.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/meter-reading-type/index.ts`
- [ ] Task 4.21.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/meter-reading-type/index.vue`
- [ ] Task 4.21.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/meter-reading-type/test-data.ts`
- [ ] Task 4.21.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/meter-reading-type/components/form.ts`
- [ ] Task 4.21.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/meter-reading-type/components/form.vue`

- [ ] Task 4.21.10: 测试验证

#### 4.22 propertyManage.expenseManage.discountType（优惠类型）

**路由路径**：`propertyManage.expenseManage.discountType`

- [ ] Task 4.22.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/discount-type.ts`
- [ ] Task 4.22.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/discount-type/mock-data.ts`
- [ ] Task 4.22.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/discount-type/list.post.ts`
- [ ] Task 4.22.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/discount-type/index.ts`
- [ ] Task 4.22.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/discount-type/index.vue`
- [ ] Task 4.22.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/discount-type/test-data.ts`
- [ ] Task 4.22.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/discount-type/components/form.ts`
- [ ] Task 4.22.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/discount-type/components/form.vue`

- [ ] Task 4.22.10: 测试验证

#### 4.23 propertyManage.expenseManage.expenseSummaryTable（费用汇总表）

**路由路径**：`propertyManage.expenseManage.expenseSummaryTable`

- [ ] Task 4.23.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/expense-summary-table.ts`
- [ ] Task 4.23.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/expense-summary-table/mock-data.ts`
- [ ] Task 4.23.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/expense-summary-table/list.post.ts`
- [ ] Task 4.23.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/expense-summary-table/index.ts`
- [ ] Task 4.23.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/expense-summary-table/index.vue`
- [ ] Task 4.23.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/expense-summary-table/test-data.ts`
- [ ] Task 4.23.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/expense-summary-table/components/form.ts`
- [ ] Task 4.23.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/expense-summary-table/components/form.vue`

- [ ] Task 4.23.10: 测试验证

#### 4.24 propertyManage.expenseManage.discountApply（优惠申请）

**路由路径**：`propertyManage.expenseManage.discountApply`

- [ ] Task 4.24.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/discount-apply.ts`
- [ ] Task 4.24.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/discount-apply/mock-data.ts`
- [ ] Task 4.24.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/discount-apply/list.post.ts`
- [ ] Task 4.24.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/discount-apply/index.ts`
- [ ] Task 4.24.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/discount-apply/index.vue`
- [ ] Task 4.24.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/discount-apply/test-data.ts`
- [ ] Task 4.24.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/discount-apply/components/form.ts`
- [ ] Task 4.24.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/discount-apply/components/form.vue`

- [ ] Task 4.24.10: 测试验证

#### 4.25 propertyManage.expenseManage.discountSetting（折扣设置）

**路由路径**：`propertyManage.expenseManage.discountSetting`

- [ ] Task 4.25.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/discount-setting.ts`
- [ ] Task 4.25.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/discount-setting/mock-data.ts`
- [ ] Task 4.25.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/discount-setting/list.post.ts`
- [ ] Task 4.25.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/discount-setting/index.ts`
- [ ] Task 4.25.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/discount-setting/index.vue`
- [ ] Task 4.25.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/discount-setting/test-data.ts`
- [ ] Task 4.25.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/discount-setting/components/form.ts`
- [ ] Task 4.25.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/discount-setting/components/form.vue`

- [ ] Task 4.25.10: 测试验证

#### 4.26 propertyManage.expenseManage.contracteCharge（合同收费）

**路由路径**：`propertyManage.expenseManage.contracteCharge`

- [ ] Task 4.26.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/contracte-charge.ts`
- [ ] Task 4.26.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/contracte-charge/mock-data.ts`
- [ ] Task 4.26.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/contracte-charge/list.post.ts`
- [ ] Task 4.26.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/contracte-charge/index.ts`
- [ ] Task 4.26.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/contracte-charge/index.vue`
- [ ] Task 4.26.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/contracte-charge/test-data.ts`
- [ ] Task 4.26.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/contracte-charge/components/form.ts`
- [ ] Task 4.26.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/contracte-charge/components/form.vue`

- [ ] Task 4.26.10: 测试验证

#### 4.27 propertyManage.expenseManage.expenseItemSetting（费用项目设置）

**路由路径**：`propertyManage.expenseManage.expenseItemSetting`

- [ ] Task 4.27.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts`
- [ ] Task 4.27.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/expense-item-setting/mock-data.ts`
- [ ] Task 4.27.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/expense-item-setting/list.post.ts`
- [ ] Task 4.27.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- [ ] Task 4.27.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/index.vue`
- [ ] Task 4.27.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/test-data.ts`
- [ ] Task 4.27.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/components/form.ts`
- [ ] Task 4.27.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/components/form.vue`

- [ ] Task 4.27.10: 测试验证

#### 4.28 propertyManage.expenseManage.cancelFee（取消费用）

**路由路径**：`propertyManage.expenseManage.cancelFee`

- [ ] Task 4.28.1: 创建类型定义文件 `apps/type/src/business/property-manage/expense-manage/cancel-fee.ts`
- [ ] Task 4.28.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/expense-manage/cancel-fee/mock-data.ts`
- [ ] Task 4.28.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/expense-manage/cancel-fee/list.post.ts`
- [ ] Task 4.28.4: 创建前端 API Hook `apps/admin/src/api/property-manage/expense-manage/cancel-fee/index.ts`
- [ ] Task 4.28.5: 改写列表页 `apps/admin/src/pages/property-manage/expense-manage/cancel-fee/index.vue`
- [ ] Task 4.28.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/expense-manage/cancel-fee/test-data.ts`
- [ ] Task 4.28.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/expense-manage/cancel-fee/components/form.ts`
- [ ] Task 4.28.8: 更新表单组件 `apps/admin/src/pages/property-manage/expense-manage/cancel-fee/components/form.vue`

- [ ] Task 4.28.10: 测试验证

#### 4.29 propertyManage.housePropertyManage.house（房屋管理）

**路由路径**：`propertyManage.housePropertyManage.house`

- [ ] Task 4.29.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/house.ts`
- [ ] Task 4.29.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/house/mock-data.ts`
- [ ] Task 4.29.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/house/list.post.ts`
- [ ] Task 4.29.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/house/index.ts`
- [ ] Task 4.29.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/house/index.vue`
- [ ] Task 4.29.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/house/test-data.ts`
- [ ] Task 4.29.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/house/components/form.ts`
- [ ] Task 4.29.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/house/components/form.vue`

- [ ] Task 4.29.10: 测试验证

#### 4.30 propertyManage.housePropertyManage.invoice（发票）

**路由路径**：`propertyManage.housePropertyManage.invoice`

- [ ] Task 4.30.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/invoice.ts`
- [ ] Task 4.30.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/invoice/mock-data.ts`
- [ ] Task 4.30.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/invoice/list.post.ts`
- [ ] Task 4.30.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/invoice/index.ts`
- [ ] Task 4.30.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/invoice/index.vue`
- [ ] Task 4.30.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/invoice/test-data.ts`
- [ ] Task 4.30.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/invoice/components/form.ts`
- [ ] Task 4.30.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/invoice/components/form.vue`

- [ ] Task 4.30.10: 测试验证

#### 4.31 propertyManage.housePropertyManage.invoiceTitle（发票抬头）

**路由路径**：`propertyManage.housePropertyManage.invoiceTitle`

- [ ] Task 4.31.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/invoice-title.ts`
- [ ] Task 4.31.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/invoice-title/mock-data.ts`
- [ ] Task 4.31.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/invoice-title/list.post.ts`
- [ ] Task 4.31.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/invoice-title/index.ts`
- [ ] Task 4.31.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/invoice-title/index.vue`
- [ ] Task 4.31.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/invoice-title/test-data.ts`
- [ ] Task 4.31.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/invoice-title/components/form.ts`
- [ ] Task 4.31.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/invoice-title/components/form.vue`

- [ ] Task 4.31.10: 测试验证

#### 4.32 propertyManage.housePropertyManage.ownerAccount（业主账户）

**路由路径**：`propertyManage.housePropertyManage.ownerAccount`

- [ ] Task 4.32.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/owner-account.ts`
- [ ] Task 4.32.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/owner-account/mock-data.ts`
- [ ] Task 4.32.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/owner-account/list.post.ts`
- [ ] Task 4.32.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/owner-account/index.ts`
- [ ] Task 4.32.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/owner-account/index.vue`
- [ ] Task 4.32.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-account/test-data.ts`
- [ ] Task 4.32.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-account/components/form.ts`
- [ ] Task 4.32.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/owner-account/components/form.vue`

- [ ] Task 4.32.10: 测试验证

#### 4.33 propertyManage.housePropertyManage.ownerInformation（业主信息）

**路由路径**：`propertyManage.housePropertyManage.ownerInformation`

- [ ] Task 4.33.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/owner-information.ts`
- [ ] Task 4.33.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/owner-information/mock-data.ts`
- [ ] Task 4.33.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/owner-information/list.post.ts`
- [ ] Task 4.33.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/owner-information/index.ts`
- [ ] Task 4.33.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/owner-information/index.vue`
- [ ] Task 4.33.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-information/test-data.ts`
- [ ] Task 4.33.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-information/components/form.ts`
- [ ] Task 4.33.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/owner-information/components/form.vue`

- [ ] Task 4.33.10: 测试验证

#### 4.34 propertyManage.housePropertyManage.ownerMember（业主成员）

**路由路径**：`propertyManage.housePropertyManage.ownerMember`

- [ ] Task 4.34.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/owner-member.ts`
- [ ] Task 4.34.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/owner-member/mock-data.ts`
- [ ] Task 4.34.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/owner-member/list.post.ts`
- [ ] Task 4.34.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/owner-member/index.ts`
- [ ] Task 4.34.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/owner-member/index.vue`
- [ ] Task 4.34.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-member/test-data.ts`
- [ ] Task 4.34.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/owner-member/components/form.ts`
- [ ] Task 4.34.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/owner-member/components/form.vue`

- [ ] Task 4.34.10: 测试验证

#### 4.35 propertyManage.housePropertyManage.ownersCommittee（业委会）

**路由路径**：`propertyManage.housePropertyManage.ownersCommittee`

- [ ] Task 4.35.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/owners-committee.ts`
- [ ] Task 4.35.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/owners-committee/mock-data.ts`
- [ ] Task 4.35.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/owners-committee/list.post.ts`
- [ ] Task 4.35.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/owners-committee/index.ts`
- [ ] Task 4.35.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/owners-committee/index.vue`
- [ ] Task 4.35.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/owners-committee/test-data.ts`
- [ ] Task 4.35.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/owners-committee/components/form.ts`
- [ ] Task 4.35.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/owners-committee/components/form.vue`

- [ ] Task 4.35.10: 测试验证

#### 4.36 propertyManage.housePropertyManage.reserveVenue（场地预约）

**路由路径**：`propertyManage.housePropertyManage.reserveVenue`

- [ ] Task 4.36.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/reserve-venue.ts`
- [ ] Task 4.36.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/reserve-venue/mock-data.ts`
- [ ] Task 4.36.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/reserve-venue/list.post.ts`
- [ ] Task 4.36.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/reserve-venue/index.ts`
- [ ] Task 4.36.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue/index.vue`
- [ ] Task 4.36.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue/test-data.ts`
- [ ] Task 4.36.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue/components/form.ts`
- [ ] Task 4.36.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue/components/form.vue`

- [ ] Task 4.36.10: 测试验证

#### 4.37 propertyManage.housePropertyManage.reserveVenueOrder（预约场馆订单）

**路由路径**：`propertyManage.housePropertyManage.reserveVenueOrder`

- [ ] Task 4.37.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/reserve-venue-order.ts`
- [ ] Task 4.37.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/reserve-venue-order/mock-data.ts`
- [ ] Task 4.37.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/reserve-venue-order/list.post.ts`
- [ ] Task 4.37.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/reserve-venue-order/index.ts`
- [ ] Task 4.37.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue-order/index.vue`
- [ ] Task 4.37.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue-order/test-data.ts`
- [ ] Task 4.37.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue-order/components/form.ts`
- [ ] Task 4.37.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/reserve-venue-order/components/form.vue`

- [ ] Task 4.37.10: 测试验证

#### 4.38 propertyManage.housePropertyManage.siteManagement（场地管理）

**路由路径**：`propertyManage.housePropertyManage.siteManagement`

- [ ] Task 4.38.1: 创建类型定义文件 `apps/type/src/business/property-manage/house-property-manage/site-management.ts`
- [ ] Task 4.38.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/house-property-manage/site-management/mock-data.ts`
- [ ] Task 4.38.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/house-property-manage/site-management/list.post.ts`
- [ ] Task 4.38.4: 创建前端 API Hook `apps/admin/src/api/property-manage/house-property-manage/site-management/index.ts`
- [ ] Task 4.38.5: 改写列表页 `apps/admin/src/pages/property-manage/house-property-manage/site-management/index.vue`
- [ ] Task 4.38.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/house-property-manage/site-management/test-data.ts`
- [ ] Task 4.38.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/house-property-manage/site-management/components/form.ts`
- [ ] Task 4.38.8: 更新表单组件 `apps/admin/src/pages/property-manage/house-property-manage/site-management/components/form.vue`

- [ ] Task 4.38.10: 测试验证

#### 4.39 propertyManage.parkingManage.carportApply（车位申请）

**路由路径**：`propertyManage.parkingManage.carportApply`

- [ ] Task 4.39.1: 创建类型定义文件 `apps/type/src/business/property-manage/parking-manage/carport-apply.ts`
- [ ] Task 4.39.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/parking-manage/carport-apply/mock-data.ts`
- [ ] Task 4.39.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/parking-manage/carport-apply/list.post.ts`
- [ ] Task 4.39.4: 创建前端 API Hook `apps/admin/src/api/property-manage/parking-manage/carport-apply/index.ts`
- [ ] Task 4.39.5: 改写列表页 `apps/admin/src/pages/property-manage/parking-manage/carport-apply/index.vue`
- [ ] Task 4.39.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/parking-manage/carport-apply/test-data.ts`
- [ ] Task 4.39.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/parking-manage/carport-apply/components/form.ts`
- [ ] Task 4.39.8: 更新表单组件 `apps/admin/src/pages/property-manage/parking-manage/carport-apply/components/form.vue`

- [ ] Task 4.39.10: 测试验证

#### 4.40 propertyManage.parkingManage.carportInfo（车位信息）

**路由路径**：`propertyManage.parkingManage.carportInfo`

- [ ] Task 4.40.1: 创建类型定义文件 `apps/type/src/business/property-manage/parking-manage/carport-info.ts`
- [ ] Task 4.40.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/parking-manage/carport-info/mock-data.ts`
- [ ] Task 4.40.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/parking-manage/carport-info/list.post.ts`
- [ ] Task 4.40.4: 创建前端 API Hook `apps/admin/src/api/property-manage/parking-manage/carport-info/index.ts`
- [ ] Task 4.40.5: 改写列表页 `apps/admin/src/pages/property-manage/parking-manage/carport-info/index.vue`
- [ ] Task 4.40.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/parking-manage/carport-info/test-data.ts`
- [ ] Task 4.40.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/parking-manage/carport-info/components/form.ts`
- [ ] Task 4.40.8: 更新表单组件 `apps/admin/src/pages/property-manage/parking-manage/carport-info/components/form.vue`

- [ ] Task 4.40.10: 测试验证

#### 4.41 propertyManage.parkingManage.ownerVehicle（业主车辆）

**路由路径**：`propertyManage.parkingManage.ownerVehicle`

- [ ] Task 4.41.1: 创建类型定义文件 `apps/type/src/business/property-manage/parking-manage/owner-vehicle.ts`
- [ ] Task 4.41.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/parking-manage/owner-vehicle/mock-data.ts`
- [ ] Task 4.41.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/parking-manage/owner-vehicle/list.post.ts`
- [ ] Task 4.41.4: 创建前端 API Hook `apps/admin/src/api/property-manage/parking-manage/owner-vehicle/index.ts`
- [ ] Task 4.41.5: 改写列表页 `apps/admin/src/pages/property-manage/parking-manage/owner-vehicle/index.vue`
- [ ] Task 4.41.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/parking-manage/owner-vehicle/test-data.ts`
- [ ] Task 4.41.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/parking-manage/owner-vehicle/components/form.ts`
- [ ] Task 4.41.8: 更新表单组件 `apps/admin/src/pages/property-manage/parking-manage/owner-vehicle/components/form.vue`

- [ ] Task 4.41.10: 测试验证

#### 4.42 propertyManage.parkingManage.parkingLot（停车场管理）

**路由路径**：`propertyManage.parkingManage.parkingLot`

- [ ] Task 4.42.1: 创建类型定义文件 `apps/type/src/business/property-manage/parking-manage/parking-lot.ts`
- [ ] Task 4.42.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/parking-manage/parking-lot/mock-data.ts`
- [ ] Task 4.42.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/parking-manage/parking-lot/list.post.ts`
- [ ] Task 4.42.4: 创建前端 API Hook `apps/admin/src/api/property-manage/parking-manage/parking-lot/index.ts`
- [ ] Task 4.42.5: 改写列表页 `apps/admin/src/pages/property-manage/parking-manage/parking-lot/index.vue`
- [ ] Task 4.42.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/parking-manage/parking-lot/test-data.ts`
- [ ] Task 4.42.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/parking-manage/parking-lot/components/form.ts`
- [ ] Task 4.42.8: 更新表单组件 `apps/admin/src/pages/property-manage/parking-manage/parking-lot/components/form.vue`

- [ ] Task 4.42.10: 测试验证

#### 4.43 propertyManage.patrolManage.detail（巡检明细）

**路由路径**：`propertyManage.patrolManage.detail`

- [ ] Task 4.43.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/detail.ts`
- [ ] Task 4.43.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/detail/mock-data.ts`
- [ ] Task 4.43.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/detail/list.post.ts`
- [ ] Task 4.43.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/detail/index.ts`
- [ ] Task 4.43.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/detail/index.vue`
- [ ] Task 4.43.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/detail/test-data.ts`
- [ ] Task 4.43.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/detail/components/form.ts`
- [ ] Task 4.43.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/detail/components/form.vue`

- [ ] Task 4.43.10: 测试验证

#### 4.44 propertyManage.patrolManage.item（巡检项目）

**路由路径**：`propertyManage.patrolManage.item`

- [ ] Task 4.44.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/item.ts`
- [ ] Task 4.44.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/item/mock-data.ts`
- [ ] Task 4.44.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/item/list.post.ts`
- [ ] Task 4.44.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/item/index.ts`
- [ ] Task 4.44.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/item/index.vue`
- [ ] Task 4.44.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/item/test-data.ts`
- [ ] Task 4.44.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/item/components/form.ts`
- [ ] Task 4.44.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/item/components/form.vue`

- [ ] Task 4.44.10: 测试验证

#### 4.45 propertyManage.patrolManage.path（巡检路线）

**路由路径**：`propertyManage.patrolManage.path`

- [ ] Task 4.45.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/path.ts`
- [ ] Task 4.45.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/path/mock-data.ts`
- [ ] Task 4.45.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/path/list.post.ts`
- [ ] Task 4.45.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/path/index.ts`
- [ ] Task 4.45.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/path/index.vue`
- [ ] Task 4.45.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/path/test-data.ts`
- [ ] Task 4.45.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/path/components/form.ts`
- [ ] Task 4.45.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/path/components/form.vue`

- [ ] Task 4.45.10: 测试验证

#### 4.46 propertyManage.patrolManage.plan（巡检计划）

**路由路径**：`propertyManage.patrolManage.plan`

- [ ] Task 4.46.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/plan.ts`
- [ ] Task 4.46.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/plan/mock-data.ts`
- [ ] Task 4.46.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/plan/list.post.ts`
- [ ] Task 4.46.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/plan/index.ts`
- [ ] Task 4.46.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/plan/index.vue`
- [ ] Task 4.46.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/plan/test-data.ts`
- [ ] Task 4.46.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/plan/components/form.ts`
- [ ] Task 4.46.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/plan/components/form.vue`

- [ ] Task 4.46.10: 测试验证

#### 4.47 propertyManage.patrolManage.point（巡检点）

**路由路径**：`propertyManage.patrolManage.point`

- [ ] Task 4.47.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/point.ts`
- [ ] Task 4.47.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/point/mock-data.ts`
- [ ] Task 4.47.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/point/list.post.ts`
- [ ] Task 4.47.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/point/index.ts`
- [ ] Task 4.47.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/point/index.vue`
- [ ] Task 4.47.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/point/test-data.ts`
- [ ] Task 4.47.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/point/components/form.ts`
- [ ] Task 4.47.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/point/components/form.vue`

- [ ] Task 4.47.10: 测试验证

#### 4.48 propertyManage.patrolManage.task（巡检任务）

**路由路径**：`propertyManage.patrolManage.task`

- [ ] Task 4.48.1: 创建类型定义文件 `apps/type/src/business/property-manage/patrol-manage/task.ts`
- [ ] Task 4.48.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/patrol-manage/task/mock-data.ts`
- [ ] Task 4.48.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/patrol-manage/task/list.post.ts`
- [ ] Task 4.48.4: 创建前端 API Hook `apps/admin/src/api/property-manage/patrol-manage/task/index.ts`
- [ ] Task 4.48.5: 改写列表页 `apps/admin/src/pages/property-manage/patrol-manage/task/index.vue`
- [ ] Task 4.48.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/patrol-manage/task/test-data.ts`
- [ ] Task 4.48.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts`
- [ ] Task 4.48.8: 更新表单组件 `apps/admin/src/pages/property-manage/patrol-manage/task/components/form.vue`

- [ ] Task 4.48.10: 测试验证

#### 4.49 propertyManage.repairsManage.issues（工单池）

**路由路径**：`propertyManage.repairsManage.issues`

- [ ] Task 4.49.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/issues.ts`
- [ ] Task 4.49.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/issues/mock-data.ts`
- [ ] Task 4.49.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/issues/list.post.ts`
- [ ] Task 4.49.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/issues/index.ts`
- [ ] Task 4.49.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/issues/index.vue`
- [ ] Task 4.49.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/issues/test-data.ts`
- [ ] Task 4.49.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/issues/components/form.ts`
- [ ] Task 4.49.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/issues/components/form.vue`

- [ ] Task 4.49.10: 测试验证

#### 4.50 propertyManage.repairsManage.mandatoryReturnIssue（强制回单）

**路由路径**：`propertyManage.repairsManage.mandatoryReturnIssue`

- [ ] Task 4.50.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/mandatory-return-issue.ts`
- [ ] Task 4.50.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/mandatory-return-issue/mock-data.ts`
- [ ] Task 4.50.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/mandatory-return-issue/list.post.ts`
- [ ] Task 4.50.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/mandatory-return-issue/index.ts`
- [ ] Task 4.50.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/index.vue`
- [ ] Task 4.50.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/test-data.ts`
- [ ] Task 4.50.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/components/form.ts`
- [ ] Task 4.50.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/components/form.vue`

- [ ] Task 4.50.10: 测试验证

#### 4.51 propertyManage.repairsManage.phoneReportRepairs（电话报修）

**路由路径**：`propertyManage.repairsManage.phoneReportRepairs`

- [ ] Task 4.51.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/phone-report-repairs.ts`
- [ ] Task 4.51.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/phone-report-repairs/mock-data.ts`
- [ ] Task 4.51.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/phone-report-repairs/list.post.ts`
- [ ] Task 4.51.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/phone-report-repairs/index.ts`
- [ ] Task 4.51.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/phone-report-repairs/index.vue`
- [ ] Task 4.51.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/phone-report-repairs/test-data.ts`
- [ ] Task 4.51.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/phone-report-repairs/components/form.ts`
- [ ] Task 4.51.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/phone-report-repairs/components/form.vue`

- [ ] Task 4.51.10: 测试验证

#### 4.52 propertyManage.repairsManage.repairsHaveDone（报修已办）

**路由路径**：`propertyManage.repairsManage.repairsHaveDone`

- [ ] Task 4.52.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/repairs-have-done.ts`
- [ ] Task 4.52.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-have-done/mock-data.ts`
- [ ] Task 4.52.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-have-done/list.post.ts`
- [ ] Task 4.52.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/repairs-have-done/index.ts`
- [ ] Task 4.52.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/index.vue`
- [ ] Task 4.52.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/test-data.ts`
- [ ] Task 4.52.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/components/form.ts`
- [ ] Task 4.52.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/components/form.vue`

- [ ] Task 4.52.10: 测试验证

#### 4.53 propertyManage.repairsManage.repairsSetting（报修设置）

**路由路径**：`propertyManage.repairsManage.repairsSetting`

- [ ] Task 4.53.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/repairs-setting.ts`
- [ ] Task 4.53.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-setting/mock-data.ts`
- [ ] Task 4.53.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-setting/list.post.ts`
- [ ] Task 4.53.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/repairs-setting/index.ts`
- [ ] Task 4.53.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/repairs-setting/index.vue`
- [ ] Task 4.53.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-setting/test-data.ts`
- [ ] Task 4.53.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-setting/components/form.ts`
- [ ] Task 4.53.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-setting/components/form.vue`

- [ ] Task 4.53.10: 测试验证

#### 4.54 propertyManage.repairsManage.repairsTodo（报修待办）

**路由路径**：`propertyManage.repairsManage.repairsTodo`

- [ ] Task 4.54.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/repairs-todo.ts`
- [ ] Task 4.54.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-todo/mock-data.ts`
- [ ] Task 4.54.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/repairs-todo/list.post.ts`
- [ ] Task 4.54.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/repairs-todo/index.ts`
- [ ] Task 4.54.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/index.vue`
- [ ] Task 4.54.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/test-data.ts`
- [ ] Task 4.54.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/components/form.ts`
- [ ] Task 4.54.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/components/form.vue`

- [ ] Task 4.54.10: 测试验证

#### 4.55 propertyManage.repairsManage.returnVisit（报修回访）

**路由路径**：`propertyManage.repairsManage.returnVisit`

- [ ] Task 4.55.1: 创建类型定义文件 `apps/type/src/business/property-manage/repairs-manage/return-visit.ts`
- [ ] Task 4.55.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/repairs-manage/return-visit/mock-data.ts`
- [ ] Task 4.55.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/repairs-manage/return-visit/list.post.ts`
- [ ] Task 4.55.4: 创建前端 API Hook `apps/admin/src/api/property-manage/repairs-manage/return-visit/index.ts`
- [ ] Task 4.55.5: 改写列表页 `apps/admin/src/pages/property-manage/repairs-manage/return-visit/index.vue`
- [ ] Task 4.55.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/repairs-manage/return-visit/test-data.ts`
- [ ] Task 4.55.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/repairs-manage/return-visit/components/form.ts`
- [ ] Task 4.55.8: 更新表单组件 `apps/admin/src/pages/property-manage/repairs-manage/return-visit/components/form.vue`

- [ ] Task 4.55.10: 测试验证

#### 4.56 propertyManage.reportManage.arrearsDetailsList（欠费明细表）

**路由路径**：`propertyManage.reportManage.arrearsDetailsList`

- [ ] Task 4.56.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/arrears-details-list.ts`
- [ ] Task 4.56.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/arrears-details-list/mock-data.ts`
- [ ] Task 4.56.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/arrears-details-list/list.post.ts`
- [ ] Task 4.56.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/arrears-details-list/index.ts`
- [ ] Task 4.56.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/arrears-details-list/index.vue`
- [ ] Task 4.56.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/arrears-details-list/test-data.ts`
- [ ] Task 4.56.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/arrears-details-list/components/form.ts`
- [ ] Task 4.56.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/arrears-details-list/components/form.vue`

- [ ] Task 4.56.10: 测试验证

#### 4.57 propertyManage.reportManage.dataStatistics（数据统计）

**路由路径**：`propertyManage.reportManage.dataStatistics`

- [ ] Task 4.57.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/data-statistics.ts`
- [ ] Task 4.57.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/data-statistics/mock-data.ts`
- [ ] Task 4.57.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/data-statistics/list.post.ts`
- [ ] Task 4.57.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/data-statistics/index.ts`
- [ ] Task 4.57.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/data-statistics/index.vue`
- [ ] Task 4.57.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/data-statistics/test-data.ts`
- [ ] Task 4.57.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/data-statistics/components/form.ts`
- [ ] Task 4.57.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/data-statistics/components/form.vue`

- [ ] Task 4.57.10: 测试验证

#### 4.58 propertyManage.reportManage.depositReport（押金报表）

**路由路径**：`propertyManage.reportManage.depositReport`

- [ ] Task 4.58.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/deposit-report.ts`
- [ ] Task 4.58.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/deposit-report/mock-data.ts`
- [ ] Task 4.58.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/deposit-report/list.post.ts`
- [ ] Task 4.58.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/deposit-report/index.ts`
- [ ] Task 4.58.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/deposit-report/index.vue`
- [ ] Task 4.58.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/deposit-report/test-data.ts`
- [ ] Task 4.58.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/deposit-report/components/form.ts`
- [ ] Task 4.58.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/deposit-report/components/form.vue`

- [ ] Task 4.58.10: 测试验证

#### 4.59 propertyManage.reportManage.expenseSummaryTable（费用汇总表）

**路由路径**：`propertyManage.reportManage.expenseSummaryTable`

- [ ] Task 4.59.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/expense-summary-table.ts`
- [ ] Task 4.59.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/expense-summary-table/mock-data.ts`
- [ ] Task 4.59.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/expense-summary-table/list.post.ts`
- [ ] Task 4.59.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/expense-summary-table/index.ts`
- [ ] Task 4.59.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/expense-summary-table/index.vue`
- [ ] Task 4.59.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/expense-summary-table/test-data.ts`
- [ ] Task 4.59.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/expense-summary-table/components/form.ts`
- [ ] Task 4.59.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/expense-summary-table/components/form.vue`

- [ ] Task 4.59.10: 测试验证

#### 4.60 propertyManage.reportManage.feeReminder（费用提醒）

**路由路径**：`propertyManage.reportManage.feeReminder`

- [ ] Task 4.60.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/fee-reminder.ts`
- [ ] Task 4.60.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/fee-reminder/mock-data.ts`
- [ ] Task 4.60.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/fee-reminder/list.post.ts`
- [ ] Task 4.60.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/fee-reminder/index.ts`
- [ ] Task 4.60.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/fee-reminder/index.vue`
- [ ] Task 4.60.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/fee-reminder/test-data.ts`
- [ ] Task 4.60.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/fee-reminder/components/form.ts`
- [ ] Task 4.60.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/fee-reminder/components/form.vue`

- [ ] Task 4.60.10: 测试验证

#### 4.61 propertyManage.reportManage.noChargeHouse（未收费房屋）

**路由路径**：`propertyManage.reportManage.noChargeHouse`

- [ ] Task 4.61.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/no-charge-house.ts`
- [ ] Task 4.61.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/no-charge-house/mock-data.ts`
- [ ] Task 4.61.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/no-charge-house/list.post.ts`
- [ ] Task 4.61.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/no-charge-house/index.ts`
- [ ] Task 4.61.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/no-charge-house/index.vue`
- [ ] Task 4.61.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/no-charge-house/test-data.ts`
- [ ] Task 4.61.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/no-charge-house/components/form.ts`
- [ ] Task 4.61.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/no-charge-house/components/form.vue`

- [ ] Task 4.61.10: 测试验证

#### 4.62 propertyManage.reportManage.outstandingFeesAnalysis（欠费分析）

**路由路径**：`propertyManage.reportManage.outstandingFeesAnalysis`

- [ ] Task 4.62.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/outstanding-fees-analysis.ts`
- [ ] Task 4.62.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/outstanding-fees-analysis/mock-data.ts`
- [ ] Task 4.62.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/outstanding-fees-analysis/list.post.ts`
- [ ] Task 4.62.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/outstanding-fees-analysis/index.ts`
- [ ] Task 4.62.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/outstanding-fees-analysis/index.vue`
- [ ] Task 4.62.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/outstanding-fees-analysis/test-data.ts`
- [ ] Task 4.62.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/outstanding-fees-analysis/components/form.ts`
- [ ] Task 4.62.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/outstanding-fees-analysis/components/form.vue`

- [ ] Task 4.62.10: 测试验证

#### 4.63 propertyManage.reportManage.ownerPaymentDetails（业主缴费明细）

**路由路径**：`propertyManage.reportManage.ownerPaymentDetails`

- [ ] Task 4.63.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/owner-payment-details.ts`
- [ ] Task 4.63.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/owner-payment-details/mock-data.ts`
- [ ] Task 4.63.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/owner-payment-details/list.post.ts`
- [ ] Task 4.63.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/owner-payment-details/index.ts`
- [ ] Task 4.63.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/index.vue`
- [ ] Task 4.63.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/test-data.ts`
- [ ] Task 4.63.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/components/form.ts`
- [ ] Task 4.63.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/components/form.vue`

- [ ] Task 4.63.10: 测试验证

#### 4.64 propertyManage.reportManage.patrolReport（巡检报表）

**路由路径**：`propertyManage.reportManage.patrolReport`

- [ ] Task 4.64.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/patrol-report.ts`
- [ ] Task 4.64.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/patrol-report/mock-data.ts`
- [ ] Task 4.64.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/patrol-report/list.post.ts`
- [ ] Task 4.64.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/patrol-report/index.ts`
- [ ] Task 4.64.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/patrol-report/index.vue`
- [ ] Task 4.64.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/patrol-report/test-data.ts`
- [ ] Task 4.64.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/patrol-report/components/form.ts`
- [ ] Task 4.64.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/patrol-report/components/form.vue`

- [ ] Task 4.64.10: 测试验证

#### 4.65 propertyManage.reportManage.paymentDetailsForm（缴费明细表）

**路由路径**：`propertyManage.reportManage.paymentDetailsForm`

- [ ] Task 4.65.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/payment-details-form.ts`
- [ ] Task 4.65.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/payment-details-form/mock-data.ts`
- [ ] Task 4.65.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/payment-details-form/list.post.ts`
- [ ] Task 4.65.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/payment-details-form/index.ts`
- [ ] Task 4.65.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/payment-details-form/index.vue`
- [ ] Task 4.65.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/payment-details-form/test-data.ts`
- [ ] Task 4.65.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/payment-details-form/components/form.ts`
- [ ] Task 4.65.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/payment-details-form/components/form.vue`

- [ ] Task 4.65.10: 测试验证

#### 4.66 propertyManage.reportManage.repairReportForm（维修报告表）

**路由路径**：`propertyManage.reportManage.repairReportForm`

- [ ] Task 4.66.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/repair-report-form.ts`
- [ ] Task 4.66.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/repair-report-form/mock-data.ts`
- [ ] Task 4.66.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/repair-report-form/list.post.ts`
- [ ] Task 4.66.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/repair-report-form/index.ts`
- [ ] Task 4.66.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/repair-report-form/index.vue`
- [ ] Task 4.66.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/repair-report-form/test-data.ts`
- [ ] Task 4.66.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/repair-report-form/components/form.ts`
- [ ] Task 4.66.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/repair-report-form/components/form.vue`

- [ ] Task 4.66.10: 测试验证

#### 4.67 propertyManage.reportManage.repairReportsSummaryTable（报修汇总表）

**路由路径**：`propertyManage.reportManage.repairReportsSummaryTable`

- [ ] Task 4.67.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/repair-reports-summary-table.ts`
- [ ] Task 4.67.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/repair-reports-summary-table/mock-data.ts`
- [ ] Task 4.67.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/repair-reports-summary-table/list.post.ts`
- [ ] Task 4.67.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/repair-reports-summary-table/index.ts`
- [ ] Task 4.67.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue`
- [ ] Task 4.67.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/repair-reports-summary-table/test-data.ts`
- [ ] Task 4.67.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/repair-reports-summary-table/components/form.ts`
- [ ] Task 4.67.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/repair-reports-summary-table/components/form.vue`

- [ ] Task 4.67.10: 测试验证

#### 4.68 propertyManage.reportManage.statementExpenses（费用明细表）

**路由路径**：`propertyManage.reportManage.statementExpenses`

- [ ] Task 4.68.1: 创建类型定义文件 `apps/type/src/business/property-manage/report-manage/statement-expenses.ts`
- [ ] Task 4.68.2: 创建 Mock 数据文件 `apps/admin/server/api/property-manage/report-manage/statement-expenses/mock-data.ts`
- [ ] Task 4.68.3: 创建 Nitro 接口文件 `apps/admin/server/api/property-manage/report-manage/statement-expenses/list.post.ts`
- [ ] Task 4.68.4: 创建前端 API Hook `apps/admin/src/api/property-manage/report-manage/statement-expenses/index.ts`
- [ ] Task 4.68.5: 改写列表页 `apps/admin/src/pages/property-manage/report-manage/statement-expenses/index.vue`
- [ ] Task 4.68.6: 删除旧的假数据文件 `apps/admin/src/pages/property-manage/report-manage/statement-expenses/test-data.ts`
- [ ] Task 4.68.7: 更新表单类型文件 `apps/admin/src/pages/property-manage/report-manage/statement-expenses/components/form.ts`
- [ ] Task 4.68.8: 更新表单组件 `apps/admin/src/pages/property-manage/report-manage/statement-expenses/components/form.vue`

- [ ] Task 4.68.10: 测试验证

## 任务执行规范

### 严格的执行顺序

对于每个三级路由，**必须严格按照以下顺序执行任务，不允许跳步**：

1. **类型定义层**（Task X.Y.1）- 必须首先完成，确保类型安全的基础
2. **数据层**（Task X.Y.2）- 依赖类型定义，创建 Mock 数据
3. **API 层**（Task X.Y.3）- 依赖类型定义和数据层，创建 Nitro 接口
4. **前端 Hook 层**（Task X.Y.4）- 依赖 API 层，封装数据查询逻辑
5. **列表页改造**（Task X.Y.5）- 依赖 Hook 层，使用新的数据获取方式
6. **清理旧代码**（Task X.Y.6）- 删除旧的假数据文件
7. **表单类型迁移**（Task X.Y.7 和 Task X.Y.8）- 更新表单相关文件，使用类型库
8. **类型检查**（Task X.Y.9）- 确保无类型报错
9. **测试验证**（Task X.Y.10）- 功能测试，验收标准检查

### 每个任务的详细要求

#### Task X.Y.1: 创建类型定义文件

**任务内容**：

- 定义 {Page}ListItem 接口（所有字段英文+JSDoc 注释）
- 定义 {Page}QueryParams 接口（包含分页参数）
- 定义相关枚举类型（如 Status、Type 等）
- 导出 Options 常量（下拉选择用）

**验收标准**：

- 所有字段名为英文驼峰命名
- 每个字段有 JSDoc 注释（中文+英文）
- 枚举值保持中文
- Options 导出正确

#### Task X.Y.2: 创建 Mock 数据文件

**任务内容**：

- 导入 {Page}ListItem 类型
- 创建 mock{Page}Data 数组
- 数据量：至少 20-50 条
- 数据类型约束满足 {Page}ListItem

**验收标准**：

- 类型约束正确
- 数据字段名为英文
- 数据量充足（20-50 条）

#### Task X.Y.3: 创建 Nitro 接口文件

**任务内容**：

- 导入必要的类型（JsonVO、PageDTO、{Page}ListItem、{Page}QueryParams）
- 使用 defineHandler 和 readBody（从 nitro/h3 导入）
- 实现筛选逻辑（字符串模糊匹配、枚举精确匹配）
- 实现分页逻辑（slice）
- 返回 JsonVO<PageDTO<{Page}ListItem>> 格式
- 添加 JSDoc 注释

**验收标准**：

- 使用 Nitro v3 写法
- 返回值有完整类型约束
- 筛选和分页逻辑正确
- 有 JSDoc 注释

#### Task X.Y.4: 创建前端 API Hook

**任务内容**：

- 定义 use{Page}ListQuery Hook
- 调用通用 useListQuery
- 配置 queryKeyPrefix（完整路径）
- 配置 apiUrl（对应 Nitro 接口路径）

**验收标准**：

- queryKeyPrefix 格式正确
- apiUrl 路径正确
- 类型泛型参数正确

#### Task X.Y.5: 改写列表页

**任务内容**：

- 导入类型和 Hook
- 使用 use{Page}ListQuery 获取数据
- 移除本地 test-data 导入
- 配置搜索和分页
- 使用 isLoading 控制 loading 状态
- 监听 data 变化更新 tableData

**验收标准**：

- 无 test-data 导入
- 使用 TanStack Query Hook
- 搜索和分页功能正常
- loading 状态正确

#### Task X.Y.6: 删除旧的假数据文件

**任务内容**：

- 删除 test-data.ts 文件
- 确保无任何文件引用

**验收标准**：

- 文件已删除
- 无导入引用报错

#### Task X.Y.7: 更新表单类型文件

**任务内容**：

- 从 @01s-11comm/type 导入类型
- 移除本地类型定义
- 使用类型库提供的 Options
- 字段名改为纯英文

**验收标准**：

- 所有类型从类型库导入
- 无本地类型定义
- Options 从类型库导入

#### Task X.Y.8: 更新表单组件

**任务内容**：

- 导入类型库的 Options
- 更新表单项配置
- 使用纯英文类型
- prop 字段名更新为英文

**验收标准**：

- Options 从类型库导入
- 表单项配置正确
- 类型约束正确

#### Task X.Y.9: 运行类型检查

**命令**：`pnpm typecheck`

**任务内容**：

- 运行类型检查
- 修复所有类型报错
- 确保类型库和 admin 项目无报错

**验收标准**：

- typecheck 通过
- 无类型报错

#### Task X.Y.10: 测试验证

**任务内容**：

- 启动开发服务器测试列表加载
- 测试搜索功能
- 测试分页功能
- 测试新增/编辑/删除功能
- 测试 loading 状态
- 测试错误处理

**验收标准**：

- 所有功能正常
- 无 console 报错
- 数据加载正确

### 总体验收标准

每个三级路由完成后，必须满足以下验收标准：

- 类型检查无报错（`pnpm typecheck`）
- 列表页初始加载正常
- 搜索功能正常
- 分页功能正常
- Loading 状态显示正确
- 错误处理正常
- 新增/编辑/删除功能正常
- 无旧的 test-data.ts 文件残留
- 所有类型从 @01s-11comm/type 导入
- 所有 Options 从类型库导入

## 进度追踪

### 总体进度

- [ ] settingManage: 12/12 (100%)
- [ ] devTeam: 8/8 (100%)
- [ ] operationTeam: 12/12 (100%)
- [ ] propertyManage: 68/68 (100%)
- **总计**: 100/100 (100%)

### 里程碑

- [ ] Milestone 1: 完成 settingManage 模块（12 个路由）
- [ ] Milestone 2: 完成 devTeam 模块（8 个路由）
- [ ] Milestone 3: 完成 operationTeam 模块（12 个路由）
- [ ] Milestone 4: 完成 propertyManage 模块（68 个路由）
- [ ] Milestone 5: 全部验证通过

## 参考文档

- [proposal.md](./proposal.md) - 变更提案
- [design.md](./design.md) - 技术设计
- [specs/nitro-api/spec.md](./specs/nitro-api/spec.md) - Nitro API 规范
- [specs/type-system/spec.md](./specs/type-system/spec.md) - 类型系统规范
- [specs/data-fetching/spec.md](./specs/data-fetching/spec.md) - 数据获取规范
- [specs/list-page-pattern/spec.md](./specs/list-page-pattern/spec.md) - 列表页模式规范
- [specs/common-business-options/spec.md](./specs/common-business-options/spec.md) - 公共业务选项规范
