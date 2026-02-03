## 1. 基础设施搭建

- [ ] 1.1 创建 `apps/admin/server/db/seed/` 目录结构
- [ ] 1.2 创建 `seed/utils.ts` 公共工具文件，包含枚举映射函数
- [ ] 1.3 创建 `seed/types.ts` 类型定义文件，定义 SeedResult、IdMapRegistry 等接口
- [ ] 1.4 创建 `seed/index.ts` 模块导出入口文件

## 2. 公共工具函数实现

- [ ] 2.1 实现 `statusMap` 状态枚举映射（启用/禁用 -> enabled/disabled）
- [ ] 2.2 实现 `genderMap` 性别枚举映射（男/女 -> male/female）
- [ ] 2.3 实现 `auditStatusMap` 审核状态映射（待审核/已通过/已拒绝 -> pending/approved/rejected）
- [ ] 2.4 实现 `parseDate()` 日期解析函数，支持 "YYYY-MM-DD" 和 "YYYY-MM-DD HH:mm:ss" 格式
- [ ] 2.5 实现 `parseTimestamp()` 时间戳解析函数
- [ ] 2.6 实现 `IdMapRegistry` 类，管理 mock ID 到数据库 UUID 的映射
- [ ] 2.7 实现 `parseNumber()` 数值安全转换函数

## 3. 第一层模块实现（无外键依赖）

- [ ] 3.1 创建 `seed/community.ts`，实现 `seedCommunity()` 函数
  - 填充 `cm_communities` 表
- [ ] 3.2 创建 `seed/setting.ts`，实现 `seedSetting()` 函数
  - 填充 `sm_organizations` 表
  - 填充 `sm_roles` 表
  - 填充 `sm_permissions` 表
  - 填充 `sm_shifts` 表
  - 填充 `sm_scheduling_settings` 表
  - 填充 `sm_system_configs` 表
  - 填充 `sm_register_protocols` 表
  - 填充 `sm_initialize_cells` 表
- [ ] 3.3 创建 `seed/house-property.ts`（第一部分），实现无外键依赖表的填充
  - 填充 `hp_owners` 表
  - 填充 `hp_reserve_venues` 表
  - 填充 `hp_site_managements` 表
  - 填充 `hp_owners_committees` 表

## 4. 第二层模块实现（依赖第一层）

- [ ] 4.1 扩展 `seed/setting.ts`，填充依赖组织架构的表
  - 填充 `sm_staff` 表（依赖 sm_organizations）
  - 填充 `sm_role_permissions` 表（依赖 sm_roles 和 sm_permissions）
  - 填充 `sm_data_permissions` 表（依赖 sm_roles）
- [ ] 4.2 扩展 `seed/community.ts`，填充依赖小区的表
  - 填充 `cm_notices` 表
  - 填充 `cm_building_structures` 表
  - 填充 `cm_handing_business` 表
  - 填充 `cm_house_decorations` 表
  - 填充 `cm_property_registers` 表
- [ ] 4.3 扩展 `seed/house-property.ts`，填充依赖小区或业主的表
  - 填充 `hp_houses` 表（依赖 cm_communities）

## 5. 第三层模块实现（依赖第二层）

- [ ] 5.1 扩展 `seed/setting.ts`，填充依赖员工的表
  - 填充 `sm_staff_roles` 表（依赖 sm_staff 和 sm_roles）
  - 填充 `sm_working_schedules` 表（依赖 sm_staff 和 sm_shifts）
- [ ] 5.2 扩展 `seed/house-property.ts`，填充依赖业主的表
  - 填充 `hp_owner_members` 表
  - 填充 `hp_owner_accounts` 表
  - 填充 `hp_invoice_titles` 表
  - 填充 `hp_invoices` 表
  - 填充 `hp_reserve_venue_orders` 表

## 6. 巡检管理模块实现

- [ ] 6.1 创建 `seed/patrol.ts`，实现 `seedPatrol()` 函数
- [ ] 6.2 填充 `pt_patrol_plans` 表（依赖 cm_communities）
- [ ] 6.3 填充 `pt_patrol_paths` 表（依赖 pt_patrol_plans）
- [ ] 6.4 填充 `pt_patrol_points` 表（依赖 pt_patrol_paths）
- [ ] 6.5 填充 `pt_patrol_items` 表（依赖 pt_patrol_points）
- [ ] 6.6 填充 `pt_patrol_tasks` 表（依赖 pt_patrol_plans）
- [ ] 6.7 填充 `pt_patrol_task_details` 表（依赖 pt_patrol_tasks 和 pt_patrol_points）

## 7. 其他业务模块实现

- [ ] 7.1 创建 `seed/contract.ts`，实现 `seedContract()` 函数
- [ ] 7.2 创建 `seed/expense.ts`，实现 `seedExpense()` 函数
- [ ] 7.3 创建 `seed/parking.ts`，实现 `seedParking()` 函数
- [ ] 7.4 创建 `seed/repairs.ts`，实现 `seedRepairs()` 函数
- [ ] 7.5 创建 `seed/report.ts`，实现 `seedReport()` 函数
- [ ] 7.6 创建 `seed/operation.ts`，实现 `seedOperation()` 函数
- [ ] 7.7 创建 `seed/dev.ts`，实现 `seedDev()` 函数

## 8. 主入口文件实现

- [ ] 8.1 创建 `seed.ts` 主入口文件
- [ ] 8.2 实现环境变量加载和数据库连接建立
- [ ] 8.3 实现按依赖顺序调用各模块 seed 函数的编排逻辑
- [ ] 8.4 实现 `--clean` 参数支持，提供数据清理功能
- [ ] 8.5 实现执行日志输出（进度、统计信息）
- [ ] 8.6 实现错误处理和快速失败机制

## 9. 配置和测试

- [ ] 9.1 在 `apps/admin/package.json` 中配置 `db:seed` 脚本命令
- [ ] 9.2 验证 `pnpm db:seed` 命令可正常执行
- [ ] 9.3 验证数据正确插入到 Neon 数据库
- [ ] 9.4 验证 `--clean` 参数可正常清理数据
- [ ] 9.5 检查控制台日志输出是否清晰完整
