## 1. 基础设施搭建

- [x] 1.1 创建 `apps/admin/server/db/seed-sql/` 目录结构
- [x] 1.2 创建 `seed-sql/utils.ts` 公共工具文件，包含 SQL 转义函数和枚举映射
- [x] 1.3 创建 `seed-sql/types.ts` 类型定义文件，定义 SqlStatement、IdMapRegistry 等接口
- [x] 1.4 创建 `seed-sql/index.ts` 模块导出入口文件
- [x] 1.5 创建 `seed-sql/id-map.ts` ID 映射表管理文件
- [x] 1.6 创建 `apps/admin/drizzle/seed/` 目录（用于存放生成的 SQL 文件）

## 2. 公共工具函数实现

- [x] 2.1 实现 `escapeSql()` SQL 字符串转义函数
- [x] 2.2 实现 `toFullSql()` 参数化 SQL 转换为完整 SQL 的函数
- [x] 2.3 实现 `statusMap` 状态枚举映射（启用/禁用 -> enabled/disabled）
- [x] 2.4 实现 `genderMap` 性别枚举映射（男/女 -> male/female）
- [x] 2.5 实现 `auditStatusMap` 审核状态映射（待审核/已通过/已拒绝 -> pending/approved/rejected）
- [x] 2.6 实现 `toSqlTimestamp()` 日期字符串转 SQL 格式函数
- [x] 2.7 实现 `toSqlDate()` 纯日期字符串转 SQL 格式函数
- [x] 2.8 实现 `IdMapRegistry` 类，管理 mock ID 到数据库 UUID 的映射
- [x] 2.9 实现 `generateUuid()` 确定性 UUID 生成函数（使用 uuid v5）

## 3. 第一层模块实现（无外键依赖）

- [x] 3.1 创建 `seed-sql/community.ts`，实现 `generateCommunitySql()` 函数
  - 生成 `cm_communities` 表的 INSERT SQL
- [x] 3.2 创建 `seed-sql/setting.ts`，实现 `generateSettingSql()` 函数（第一部分）
  - 生成 `sm_organizations` 表的 INSERT SQL（处理树形结构 ID 如 "2-1"）
  - 生成 `sm_roles` 表的 INSERT SQL
  - 生成 `sm_permissions` 表的 INSERT SQL
  - 生成 `sm_shifts` 表的 INSERT SQL
  - 生成 `sm_scheduling_settings` 表的 INSERT SQL
  - 生成 `sm_system_configs` 表的 INSERT SQL
  - 生成 `sm_register_protocols` 表的 INSERT SQL
  - 生成 `sm_initialize_cells` 表的 INSERT SQL
- [x] 3.3 创建 `seed-sql/house-property.ts`（第一部分），实现无外键依赖表的 SQL 生成
  - 生成 `hp_owners` 表的 INSERT SQL
  - 生成 `hp_reserve_venues` 表的 INSERT SQL
  - 生成 `hp_site_managements` 表的 INSERT SQL
  - 生成 `hp_owners_committees` 表的 INSERT SQL

## 4. 第二层模块实现（依赖第一层）

- [x] 4.1 扩展 `seed-sql/setting.ts`，生成依赖组织架构的表 SQL
  - 生成 `sm_staff` 表的 INSERT SQL（依赖 sm_organizations，处理字段映射如 address -> homeAddress）
  - 生成 `sm_role_permissions` 表的 INSERT SQL（依赖 sm_roles 和 sm_permissions）
  - 生成 `sm_data_permissions` 表的 INSERT SQL（依赖 sm_roles）
- [x] 4.2 扩展 `seed-sql/community.ts`，生成依赖小区的表 SQL
  - 生成 `cm_notices` 表的 INSERT SQL
  - 生成 `cm_building_structures` 表的 INSERT SQL
  - 生成 `cm_handing_business` 表的 INSERT SQL
  - 生成 `cm_house_decorations` 表的 INSERT SQL
  - 生成 `cm_property_registers` 表的 INSERT SQL
- [x] 4.3 扩展 `seed-sql/house-property.ts`，生成依赖小区或业主的表 SQL
  - 生成 `hp_houses` 表的 INSERT SQL（依赖 cm_communities）

## 5. 第三层模块实现（依赖第二层）

- [x] 5.1 扩展 `seed-sql/setting.ts`，生成依赖员工的表 SQL
  - 生成 `sm_staff_roles` 表的 INSERT SQL（依赖 sm_staff 和 sm_roles）
  - 生成 `sm_working_schedules` 表的 INSERT SQL（依赖 sm_staff 和 sm_shifts）
- [x] 5.2 扩展 `seed-sql/house-property.ts`，生成依赖业主的表 SQL
  - 生成 `hp_owner_members` 表的 INSERT SQL
  - 生成 `hp_owner_accounts` 表的 INSERT SQL
  - 生成 `hp_invoice_titles` 表的 INSERT SQL
  - 生成 `hp_invoices` 表的 INSERT SQL
  - 生成 `hp_reserve_venue_orders` 表的 INSERT SQL

## 6. 巡检管理模块实现

- [x] 6.1 创建 `seed-sql/patrol.ts`，实现 `generatePatrolSql()` 函数
- [x] 6.2 生成 `pt_patrol_plans` 表的 INSERT SQL（依赖 cm_communities）
- [x] 6.3 生成 `pt_patrol_paths` 表的 INSERT SQL（依赖 pt_patrol_plans）
- [x] 6.4 生成 `pt_patrol_points` 表的 INSERT SQL（依赖 pt_patrol_paths）
- [x] 6.5 生成 `pt_patrol_items` 表的 INSERT SQL（依赖 pt_patrol_points）
- [x] 6.6 生成 `pt_patrol_tasks` 表的 INSERT SQL（依赖 pt_patrol_plans）
- [x] 6.7 生成 `pt_patrol_task_details` 表的 INSERT SQL（依赖 pt_patrol_tasks 和 pt_patrol_points）

## 7. 其他业务模块实现

- [x] 7.1 创建 `seed-sql/contract.ts`，实现 `generateContractSql()` 函数
- [x] 7.2 创建 `seed-sql/expense.ts`，实现 `generateExpenseSql()` 函数
- [x] 7.3 创建 `seed-sql/parking.ts`，实现 `generateParkingSql()` 函数
- [x] 7.4 创建 `seed-sql/repairs.ts`，实现 `generateRepairsSql()` 函数
- [x] 7.5 创建 `seed-sql/report.ts`，实现 `generateReportSql()` 函数
- [x] 7.6 创建 `seed-sql/operation.ts`，实现 `generateOperationSql()` 函数
- [x] 7.7 创建 `seed-sql/dev.ts`，实现 `generateDevSql()` 函数

## 8. 主入口文件实现

- [x] 8.1 创建 `generate-seed-sql.ts` 主入口文件
- [x] 8.2 实现按依赖顺序调用各模块 SQL 生成函数的编排逻辑
- [x] 8.3 实现分模块 SQL 文件输出（每个模块一个文件）
- [x] 8.4 实现 SQL 文件头部注释生成（模块名称、说明，不含时间戳）
- [x] 8.5 实现事务包装（BEGIN/COMMIT）
- [x] 8.6 实现将 SQL 文件写入 `drizzle/seed/` 目录（按编号命名）
- [x] 8.7 实现执行日志输出（进度、统计信息）
- [x] 8.8 实现 `--module` 参数解析，支持指定模块生成
- [x] 8.9 实现 `--list-modules` 参数，列出所有可用模块及依赖关系
- [x] 8.10 实现依赖检查逻辑，缺失依赖时报错

## 9. 清理脚本实现

- [x] 9.1 创建 `_clean.sql` 生成逻辑
- [x] 9.2 按外键依赖逆序生成 TRUNCATE CASCADE 语句
- [x] 9.3 包装在事务中（BEGIN/COMMIT）
- [x] 9.4 添加警告注释说明

## 10. SQL 执行脚本实现

- [x] 10.1 创建 `run-seed-sql.ts` SQL 执行脚本
- [x] 10.2 实现环境变量加载和数据库连接建立
- [x] 10.3 实现按编号顺序读取 `drizzle/seed/*.sql` 文件
- [x] 10.4 实现 `--module` 参数支持，只导入指定模块
- [x] 10.5 实现 `--clean` 参数支持，先执行 `_clean.sql` 再导入
- [x] 10.6 实现 `--clean-only` 参数支持，只执行清理不导入
- [x] 10.7 实现执行结果统计和日志输出
- [x] 10.8 实现错误处理和回滚机制

## 11. 配置和测试

- [x] 11.1 在 `apps/admin/package.json` 中配置 `db:generate-seed` 脚本命令
- [x] 11.2 在 `apps/admin/package.json` 中更新 `db:seed` 脚本命令
- [x] 11.3 运行 `pnpm db:generate-seed` 验证 SQL 文件生成
- [x] 11.4 验证生成的 `drizzle/seed/*.sql` 文件语法正确性
- [x] 11.5 验证 `--module` 参数可正常过滤生成
- [x] 11.6 验证 `--list-modules` 参数可正常列出模块
- [x] 11.7 运行 `pnpm db:seed` 验证数据正确导入到 Neon 数据库
- [x] 11.8 验证 `--clean` 参数可正常清理数据后导入
- [x] 11.9 验证 `--clean-only` 参数可正常只执行清理
- [x] 11.10 检查控制台日志输出是否清晰完整
- [x] 11.11 将生成的 SQL 文件提交到 Git 版本控制
